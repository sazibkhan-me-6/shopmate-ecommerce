/**
 * ShopMate Live Customer Support & Admin Connection Service
 * Powers real-time bidirectional communication between storefront visitors
 * and the store Admin Panel.
 */

export interface SupportMessage {
  id: string;
  sender: "user" | "admin";
  senderName?: string;
  text: string;
  time: string;
  timestamp: number;
}

export interface SupportThread {
  id: string;
  customerName: string;
  customerEmail?: string;
  status: "active" | "closed";
  updatedAt: number;
  unreadByAdmin: number;
  messages: SupportMessage[];
}

const STORAGE_KEY = "shopmate_support_threads";
const BUS_CHANNEL = "shopmate_support_bus";

// Setup BroadcastChannel safely (supports modern browsers)
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChannel = new BroadcastChannel(BUS_CHANNEL);
  } catch (e) {
    console.warn("BroadcastChannel not supported in this environment", e);
  }
}

/**
 * Retrieve all support conversation threads from local storage
 */
export function getSupportThreads(): SupportThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error reading support threads:", e);
    return [];
  }
}

/**
 * Persist threads to local storage
 */
export function saveSupportThreads(threads: SupportThread[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch (e) {
    console.error("Error saving support threads:", e);
  }
}

/**
 * Broadcast event across browser tabs and storage
 */
function broadcastEvent(type: "CUSTOMER_MESSAGE" | "ADMIN_MESSAGE" | "THREAD_CLOSED" | "THREAD_CLEARED", payload: any) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload });
    } catch (e) {
      console.warn("Failed to broadcast on channel:", e);
    }
  }

  // Also trigger custom window event for same-tab / storage listeners
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("shopmate_support_event", { detail: { type, payload } })
      );
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Customer sends a message to the Admin Panel
 */
export function sendCustomerMessage(
  threadId: string,
  text: string,
  customerInfo?: { name?: string; email?: string }
): SupportMessage {
  const newMsg: SupportMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sender: "user",
    senderName: customerInfo?.name || "Customer",
    text: text.trim(),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    timestamp: Date.now(),
  };

  const threads = getSupportThreads();
  const existingIdx = threads.findIndex((t) => t.id === threadId);

  if (existingIdx !== -1) {
    threads[existingIdx].messages.push(newMsg);
    threads[existingIdx].updatedAt = Date.now();
    threads[existingIdx].status = "active";
    threads[existingIdx].unreadByAdmin = (threads[existingIdx].unreadByAdmin || 0) + 1;
    if (customerInfo?.name) threads[existingIdx].customerName = customerInfo.name;
    if (customerInfo?.email) threads[existingIdx].customerEmail = customerInfo.email;
  } else {
    threads.unshift({
      id: threadId,
      customerName: customerInfo?.name || `Customer #${threadId.slice(-4)}`,
      customerEmail: customerInfo?.email || "",
      status: "active",
      updatedAt: Date.now(),
      unreadByAdmin: 1,
      messages: [newMsg],
    });
  }

  saveSupportThreads(threads);
  broadcastEvent("CUSTOMER_MESSAGE", { threadId, message: newMsg, customerInfo });

  return newMsg;
}

/**
 * Admin replies to a customer from the Admin Panel
 */
export function sendAdminReply(
  threadId: string,
  text: string,
  adminName: string = "Admin Support"
): SupportMessage {
  const newMsg: SupportMessage = {
    id: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sender: "admin",
    senderName: adminName,
    text: text.trim(),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    timestamp: Date.now(),
  };

  const threads = getSupportThreads();
  const existingIdx = threads.findIndex((t) => t.id === threadId);

  if (existingIdx !== -1) {
    threads[existingIdx].messages.push(newMsg);
    threads[existingIdx].updatedAt = Date.now();
    threads[existingIdx].unreadByAdmin = 0;
    saveSupportThreads(threads);
  }

  broadcastEvent("ADMIN_MESSAGE", { threadId, message: newMsg });

  return newMsg;
}

/**
 * Mark a thread as closed when customer or admin ends the session
 */
export function closeSupportThread(threadId: string): void {
  const threads = getSupportThreads();
  const updated = threads.map((t) =>
    t.id === threadId ? { ...t, status: "closed" as const } : t
  );
  saveSupportThreads(updated);
  broadcastEvent("THREAD_CLOSED", { threadId });
}

/**
 * Completely remove a thread
 */
export function deleteSupportThread(threadId: string): void {
  const threads = getSupportThreads();
  const filtered = threads.filter((t) => t.id !== threadId);
  saveSupportThreads(filtered);
  broadcastEvent("THREAD_CLEARED", { threadId });
}

/**
 * Subscribe to real-time support events
 */
export function subscribeToSupportBus(
  callback: (event: { type: string; payload: any }) => void
): () => void {
  const handleBroadcast = (evt: MessageEvent) => {
    if (evt.data && evt.data.type) {
      callback(evt.data);
    }
  };

  const handleCustom = (evt: Event) => {
    const detail = (evt as CustomEvent).detail;
    if (detail && detail.type) {
      callback(detail);
    }
  };

  const handleStorage = (evt: StorageEvent) => {
    if (evt.key === STORAGE_KEY) {
      callback({ type: "STORAGE_UPDATED", payload: { threads: getSupportThreads() } });
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", handleBroadcast);
  }
  if (typeof window !== "undefined") {
    window.addEventListener("shopmate_support_event", handleCustom);
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", handleBroadcast);
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("shopmate_support_event", handleCustom);
      window.removeEventListener("storage", handleStorage);
    }
  };
}
