import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Headphones, ShieldCheck, CheckCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  sendCustomerMessage,
  closeSupportThread,
  subscribeToSupportBus,
  type SupportMessage,
} from "../services/support";
import {
  fetchRemoteSupportData,
  createRemoteSupportTicket,
  sendRemoteSupportFollowUp,
} from "../services/api";
import { getUser } from "../services/storage";

const generateThreadId = () =>
  `th-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const DEFAULT_WELCOME =
  "👋 Hi there! Welcome to ShopMate Live Support. You are directly connected with our Admin Support team. Ask your question below and an admin will reply shortly!";

const createInitialMessage = (welcomeText?: string): SupportMessage => ({
  id: "welcome-1",
  sender: "admin",
  senderName: "ShopMate Admin Support",
  text: welcomeText || DEFAULT_WELCOME,
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  timestamp: Date.now(),
});

export default function CustomerSupportChat() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string>(generateThreadId);
  const [remoteTicketId, setRemoteTicketId] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState<"online" | "offline">("online");
  const [welcomeText, setWelcomeText] = useState<string>(DEFAULT_WELCOME);
  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<SupportMessage[]>([createInitialMessage()]);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const threadIdRef = useRef<string>(threadId);
  const remoteTicketIdRef = useRef<string | null>(null);
  const seenRemoteMsgIdsRef = useRef<Set<string>>(new Set());
  const sentCustomerTextsRef = useRef<Set<string>>(new Set());

  // Keep refs in sync
  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);

  useEffect(() => {
    remoteTicketIdRef.current = remoteTicketId;
  }, [remoteTicketId]);

  // Hide floating chat button when browsing the in-app Admin page itself
  const isAdminPage = location.pathname.startsWith("/admin");

  // Fetch live Admin Support configuration (online status & welcome message) when chat opens
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      const res = await fetchRemoteSupportData();
      if (cancelled || !res.ok || !res.config) return;
      if (res.config.chatStatus) {
        setChatStatus(res.config.chatStatus);
      }
      if (res.config.autoWelcomeMessage) {
        const cleanWelcome = res.config.autoWelcomeMessage;
        setWelcomeText(cleanWelcome);
        setMessages((prev) =>
          prev.length === 1 && prev[0].id === "welcome-1"
            ? [createInitialMessage(cleanWelcome)]
            : prev
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending, isOpen]);

  // Subscribe to local same-origin Admin Panel events (for in-app /admin dashboard)
  useEffect(() => {
    const unsubscribe = subscribeToSupportBus((event) => {
      if (event.type === "ADMIN_MESSAGE") {
        const { threadId: targetThreadId, message } = event.payload;
        if (targetThreadId === threadIdRef.current && message) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;
            return [...prev, message];
          });
          if (!isOpen) {
            setUnreadCount((c) => c + 1);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  // Real-time polling against live Central Admin Panel (https://shopmate-admin-panel.vercel.app/api/support)
  useEffect(() => {
    if (!isOpen || !remoteTicketId) return;

    const pollReplies = async () => {
      const currentTicketId = remoteTicketIdRef.current;
      if (!currentTicketId) return;

      const res = await fetchRemoteSupportData();
      if (!res.ok) return;

      if (res.config?.chatStatus) {
        setChatStatus(res.config.chatStatus);
      }

      const ticket = res.tickets.find((t) => t.id === currentTicketId);
      if (!ticket) return;

      if (ticket.status) {
        setTicketStatus(ticket.status);
      }

      if (Array.isArray(ticket.messages)) {
        const newAdminReplies: SupportMessage[] = [];
        for (const rm of ticket.messages) {
          const isFromAdmin = rm.sender === "admin";
          const isOurOwnFollowUp = sentCustomerTextsRef.current.has(rm.text.trim());
          if (isFromAdmin && !isOurOwnFollowUp && !seenRemoteMsgIdsRef.current.has(rm.id)) {
            seenRemoteMsgIdsRef.current.add(rm.id);
            newAdminReplies.push({
              id: rm.id,
              sender: "admin",
              senderName: rm.senderName || "ShopMate Admin Support",
              text: rm.text,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              timestamp: Date.now(),
            });
          }
        }

        if (newAdminReplies.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const uniqueNew = newAdminReplies.filter((m) => !existingIds.has(m.id));
            return uniqueNew.length > 0 ? [...prev, ...uniqueNew] : prev;
          });
        }
      }
    };

    const interval = setInterval(pollReplies, 3000);
    return () => clearInterval(interval);
  }, [isOpen, remoteTicketId]);

  // Clean conversation completely when user closes the chat
  const handleCloseChat = () => {
    closeSupportThread(threadIdRef.current);

    const freshId = generateThreadId();
    setThreadId(freshId);
    threadIdRef.current = freshId;
    setRemoteTicketId(null);
    remoteTicketIdRef.current = null;
    seenRemoteMsgIdsRef.current.clear();
    sentCustomerTextsRef.current.clear();
    setTicketStatus("");
    setMessages([createInitialMessage(welcomeText)]);
    setInput("");
    setIsSending(false);
    setIsOpen(false);
  };

  // Toggle chat opening
  const toggleChat = () => {
    if (isOpen) {
      handleCloseChat();
    } else {
      setUnreadCount(0);
      setIsOpen(true);
    }
  };

  // Send message directly to Central Admin Panel + Local Admin Desk
  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const currentUser: any = getUser();
    const customerName = currentUser?.name || `Customer #${threadId.slice(-4)}`;
    const customerEmail = currentUser?.email || "customer@shopmate.com";
    const customerPhone = currentUser?.phone || "Not provided";

    // Track our sent message text to avoid echo during polling
    sentCustomerTextsRef.current.add(text);

    // Dispatch to local admin desk & show immediately in UI
    const sentMsg = sendCustomerMessage(threadId, text, {
      name: customerName,
      email: customerEmail,
    });
    setMessages((prev) => [...prev, sentMsg]);
    setInput("");
    setIsSending(true);

    try {
      if (!remoteTicketIdRef.current) {
        // First message: create live support ticket in Central Admin Panel
        const res = await createRemoteSupportTicket({
          customerName,
          customerEmail,
          customerPhone,
          subject: text.length > 60 ? text.slice(0, 57) + "..." : text,
          category: "Storefront Live Chat",
          urgency: "Normal",
          source: "Storefront Live Chat",
          message: text,
        });

        if (res.ok && res.ticketId) {
          setRemoteTicketId(res.ticketId);
          remoteTicketIdRef.current = res.ticketId;
          setTicketStatus("New");
          if (res.ticket?.messages) {
            res.ticket.messages.forEach((m) => seenRemoteMsgIdsRef.current.add(m.id));
          }
        }
      } else {
        // Follow-up message on the active ticket
        await sendRemoteSupportFollowUp(remoteTicketIdRef.current, text, customerName);
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isAdminPage) {
    return null;
  }

  return (
    <div className="support-chat-wrapper">
      {/* Floating Trigger Button (Bottom Right) */}
      <button
        className={`support-floating-btn ${isOpen ? "active" : ""}`}
        onClick={toggleChat}
        aria-label="Customer Support Live Chat"
        title="Chat with Admin Support"
      >
        <span className="support-pulse-ring"></span>
        {isOpen ? (
          <X size={26} className="support-icon-open" />
        ) : (
          <>
            <MessageCircle size={28} className="support-icon-chat" />
            <span
              className="support-online-badge"
              style={{ background: chatStatus === "online" ? "#22c55e" : "#94a3b8" }}
            ></span>
            {unreadCount > 0 && <span className="support-unread-badge">{unreadCount}</span>}
          </>
        )}
      </button>

      {/* Floating Chat Drawer / Popup Window */}
      {isOpen && (
        <div className="support-chat-box">
          {/* Header (Clean: No WhatsApp buttons, direct Admin connection) */}
          <div className="support-header">
            <div className="support-header-agent">
              <div className="support-avatar-wrap">
                <Headphones size={20} className="support-avatar-icon" />
                <span
                  className="support-avatar-status"
                  style={{ background: chatStatus === "online" ? "#22c55e" : "#94a3b8" }}
                ></span>
              </div>
              <div className="support-agent-meta">
                <h4>ShopMate Admin Support</h4>
                <p>
                  <span
                    className="live-status-dot"
                    style={{ background: chatStatus === "online" ? "#4ade80" : "#cbd5e1" }}
                  ></span>{" "}
                  {chatStatus === "online" ? "Admin Online • Live Desk" : "Leave a Message"}
                </p>
              </div>
            </div>

            <div className="support-header-actions">
              <button
                className="support-close-btn"
                onClick={handleCloseChat}
                title="Close and Clear Chat"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Clean Notice Bar (No WhatsApp or Phone numbers) */}
          <div className="support-notice-bar">
            <ShieldCheck size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
            <span>
              {remoteTicketId
                ? `Connected to Admin Support • Ticket ${remoteTicketId}${ticketStatus ? ` (${ticketStatus})` : ""}`
                : "Directly Connected to Admin Customer Support"}
            </span>
          </div>

          {/* Messages Body */}
          <div className="support-body">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`support-msg-row ${m.sender === "user" ? "user-row" : "bot-row"}`}
              >
                {m.sender === "admin" && (
                  <div className="support-bot-icon-circle">
                    <ShieldCheck size={14} />
                  </div>
                )}
                <div className="support-msg-content">
                  {m.sender === "admin" && m.senderName && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#6246e8",
                        marginBottom: "2px",
                      }}
                    >
                      {m.senderName}
                    </span>
                  )}
                  <div
                    className={`support-bubble ${
                      m.sender === "user" ? "user-bubble" : "bot-bubble"
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span className="support-msg-time">{m.time}</span>
                    {m.sender === "user" && (
                      <span
                        title="Sent to Admin Support"
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <CheckCheck size={12} style={{ color: "#6246e8", opacity: 0.8 }} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="support-msg-row bot-row">
                <div className="support-bot-icon-circle">
                  <Headphones size={14} />
                </div>
                <div className="support-typing-indicator" title="Sending to Admin Support...">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Send Form (Clean: No quick questions) */}
          <form
            className="support-footer-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Write your message to Admin Support..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="support-input"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="support-send-btn"
              title="Send Message to Admin"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
