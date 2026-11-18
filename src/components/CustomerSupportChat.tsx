import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Headphones, ShieldCheck, CheckCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  sendCustomerMessage,
  closeSupportThread,
  subscribeToSupportBus,
  type SupportMessage,
} from "../services/support";
import { getUser } from "../services/storage";

const generateThreadId = () =>
  `th-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const createInitialMessage = (): SupportMessage => ({
  id: "welcome-1",
  sender: "admin",
  senderName: "ShopMate Admin Support",
  text: "👋 Hi there! Welcome to ShopMate Live Support. You are directly connected with our Admin Panel. Ask your question below and an admin will reply shortly!",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  timestamp: Date.now(),
});

export default function CustomerSupportChat() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string>(generateThreadId);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<SupportMessage[]>([createInitialMessage()]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const threadIdRef = useRef<string>(threadId);

  // Keep threadIdRef in sync
  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);

  // Hide floating chat button when browsing the Admin page itself
  const isAdminPage = location.pathname.startsWith("/admin");

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Subscribe to real-time events from Admin Panel
  useEffect(() => {
    const unsubscribe = subscribeToSupportBus((event) => {
      if (event.type === "ADMIN_MESSAGE") {
        const { threadId: targetThreadId, message } = event.payload;
        if (targetThreadId === threadIdRef.current && message) {
          setIsTyping(false);
          setMessages((prev) => {
            // Avoid duplicate message appending
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

  // Clean conversation when user closes the chat
  const handleCloseChat = () => {
    // Notify admin panel that thread is closed
    closeSupportThread(threadIdRef.current);

    // Completely wipe conversation clean
    const freshId = generateThreadId();
    setThreadId(freshId);
    threadIdRef.current = freshId;
    setMessages([createInitialMessage()]);
    setInput("");
    setIsTyping(false);
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

  // Send message to Admin Panel
  const handleSendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const currentUser: any = getUser();
    const customerInfo = currentUser
      ? { name: currentUser.name || "Customer", email: currentUser.email || "" }
      : { name: `Customer #${threadId.slice(-4)}` };

    // Dispatch message to Admin Panel
    const sentMsg = sendCustomerMessage(threadId, text, customerInfo);

    setMessages((prev) => [...prev, sentMsg]);
    setInput("");
    setIsTyping(true);

    // Brief simulated status indication that admin was alerted
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
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
            <span className="support-online-badge"></span>
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
                <span className="support-avatar-status"></span>
              </div>
              <div className="support-agent-meta">
                <h4>ShopMate Admin Support</h4>
                <p>
                  <span className="live-status-dot"></span> Admin Online • Live Desk
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
            <span>Connected to Store Admin Panel • Live Instant Response</span>
          </div>

          {/* Messages Body */}
          <div className="support-body">
            {messages.map((m) => (
              <div key={m.id} className={`support-msg-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                {m.sender === "admin" && (
                  <div className="support-bot-icon-circle">
                    <ShieldCheck size={14} />
                  </div>
                )}
                <div className="support-msg-content">
                  {m.sender === "admin" && m.senderName && (
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#6246e8", marginBottom: "2px" }}>
                      {m.senderName}
                    </span>
                  )}
                  <div className={`support-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                    <p>{m.text}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span className="support-msg-time">{m.time}</span>
                    {m.sender === "user" && (
                      <span title="Delivered to Admin" style={{ display: "inline-flex", alignItems: "center" }}>
                        <CheckCheck size={12} style={{ color: "#6246e8", opacity: 0.8 }} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="support-msg-row bot-row">
                <div className="support-bot-icon-circle">
                  <Headphones size={14} />
                </div>
                <div className="support-typing-indicator" title="Admin is notified">
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
              placeholder="Ask admin support anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="support-input"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim()}
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
