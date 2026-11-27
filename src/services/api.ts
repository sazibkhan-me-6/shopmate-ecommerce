/**
 * ShopMate Production API Service
 * Directly integrated with the Live Central Admin Panel:
 * https://shopmate-admin-panel.vercel.app/
 */

export const ADMIN_PANEL_URL = "https://shopmate-admin-panel.vercel.app";
export const ADMIN_API_BASE = `${ADMIN_PANEL_URL}/api`;

export interface AdminStoreConfig {
  storeName: string;
  storeUrl: string;
  status: "online" | "maintenance";
  announcement?: {
    active: boolean;
    text: string;
  };
  coupons?: {
    code: string;
    discountPercent: number;
    active: boolean;
  }[];
  currency?: {
    primary: string;
    bdtRate: number;
  };
  support?: {
    email: string;
    phone: string;
    whatsapp: string;
  };
  socialLinks?: {
    id: string;
    platform: string;
    url: string;
    active: boolean;
  }[];
  paymentGateways?: {
    id: string;
    name: string;
    enabled: boolean;
    merchantNumber?: string;
  }[];
  products?: any[];
  categories?: any[];
}

/**
 * Dispatch newly placed order directly to https://shopmate-admin-panel.vercel.app/api/orders
 * so store administrators can view customer details, phone, address, and verify payment.
 */
export async function createOrderOnServer(orderPayload: any): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const formattedPayload = {
      id: orderPayload?.id || "#SM-" + Math.floor(1000 + Math.random() * 9000),
      customer: {
        name: orderPayload?.customer?.name || "Customer",
        email: orderPayload?.customer?.email || "",
        phone: orderPayload?.customer?.phone || "N/A",
        address: orderPayload?.customer?.address || "",
        city: orderPayload?.customer?.city || "Dhaka",
        postalCode: orderPayload?.customer?.postalCode || "1000",
      },
      items: orderPayload?.items || [],
      total: orderPayload?.total || 0,
      payment: orderPayload?.payment || orderPayload?.paymentDetails?.method || "Cash on Delivery",
      paymentDetails: orderPayload?.paymentDetails || {},
      status: orderPayload?.status || "Processing",
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(`${ADMIN_API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedPayload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✅ Order synced with ShopMate Admin Panel:", data);
      return { ok: true, data };
    } else {
      console.warn("⚠️ Admin panel order endpoint responded with non-200 status:", res.status);
    }
  } catch (error: any) {
    console.warn("Could not sync order to ShopMate Admin Panel (using local store):", error?.message);
  }
  return { ok: false, data: orderPayload };
}

/**
 * Fetch live store configuration (announcement banner, coupons, exchange rates, etc.)
 * from the live Admin Panel: https://shopmate-admin-panel.vercel.app/api/store
 */
export async function fetchStoreConfig(): Promise<AdminStoreConfig | null> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/store?t=${Date.now()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data as AdminStoreConfig;
      }
    }
  } catch (error: any) {
    console.warn("Could not fetch store config from ShopMate Admin Panel:", error?.message);
  }
  return null;
}

/**
 * Sync newly registered customer account or profile updates directly to
 * https://shopmate-admin-panel.vercel.app/api/customers so Admin Panel Customers page updates immediately.
 */
export async function syncCustomerToAdminPanel(customerPayload: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  registeredAt?: string;
  source?: string;
}): Promise<{ ok: boolean; data?: any }> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: customerPayload.name,
        email: customerPayload.email,
        phone: customerPayload.phone || "+880 1700-000000",
        address: customerPayload.address || "",
        city: customerPayload.city || "Dhaka",
        registeredAt: customerPayload.registeredAt || new Date().toISOString(),
        source: customerPayload.source || "Storefront Sign Up",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✅ Customer synced with ShopMate Admin Panel:", data);
      return { ok: true, data };
    }
  } catch (error: any) {
    console.warn("Could not sync customer to ShopMate Admin Panel:", error?.message);
  }
  return { ok: false };
}

/**
 * Payment intent helper
 */
export async function createPaymentIntent(payload: unknown) {
  return { ok: true, clientSecret: null, payload };
}

/* ========================================================
   LIVE ADMIN CUSTOMER SUPPORT API
   Directly connected to https://shopmate-admin-panel.vercel.app/api/support
   ======================================================== */

export interface RemoteSupportMessage {
  id: string;
  sender: "customer" | "admin";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface RemoteSupportTicket {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  subject: string;
  category: string;
  urgency: string;
  status: string;
  source: string;
  createdAt: string;
  unread: boolean;
  messages: RemoteSupportMessage[];
}

export interface RemoteSupportConfig {
  hotline?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  operatingHours?: string;
  chatStatus?: "online" | "offline";
  autoWelcomeMessage?: string;
}

/**
 * Fetch live support tickets & admin chat configuration
 */
export async function fetchRemoteSupportData(): Promise<{
  ok: boolean;
  tickets: RemoteSupportTicket[];
  config: RemoteSupportConfig | null;
}> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/support`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return {
        ok: true,
        tickets: Array.isArray(json.tickets) ? json.tickets : [],
        config: json.config || null,
      };
    }
  } catch (error: any) {
    console.warn("Could not fetch remote support data:", error?.message);
  }
  return { ok: false, tickets: [], config: null };
}

/**
 * Submit a new customer inquiry / live chat message directly to Admin Panel
 */
export async function createRemoteSupportTicket(payload: {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  subject: string;
  category?: string;
  urgency?: string;
  source?: string;
  message: string;
}): Promise<{ ok: boolean; ticket?: RemoteSupportTicket; ticketId?: string }> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: payload.customerName || "Storefront Customer",
        customerEmail: payload.customerEmail || "customer@shopmate.com",
        customerPhone: payload.customerPhone || "Not provided",
        subject: payload.subject || "Live Chat Inquiry",
        category: payload.category || "Storefront Live Chat",
        urgency: payload.urgency || "Normal",
        source: payload.source || "Storefront Live Chat",
        message: payload.message,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const ticket: RemoteSupportTicket | undefined = json.ticket || json.data;
      const ticketId = ticket?.id || json.ticketId || json.id;
      return { ok: true, ticket, ticketId };
    }
  } catch (error: any) {
    console.warn("Could not send support ticket to Admin Panel:", error?.message);
  }
  return { ok: false };
}

/**
 * Send a follow-up customer message on an existing support ticket
 */
export async function sendRemoteSupportFollowUp(
  ticketId: string,
  message: string,
  customerName: string
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/support`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId,
        replyMessage: message,
        sender: "customer",
        senderName: customerName || "Storefront Customer",
        status: "New",
        unread: true,
      }),
    });
    return { ok: res.ok };
  } catch (error: any) {
    console.warn("Could not send follow-up message to Admin Panel:", error?.message);
  }
  return { ok: false };
}
