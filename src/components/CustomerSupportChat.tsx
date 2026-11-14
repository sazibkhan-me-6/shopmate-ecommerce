import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, Headphones, Phone, ExternalLink, Sparkles, Check, Clock } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  actionLink?: { label: string; url: string; external?: boolean };
}

const QUICK_QUESTIONS = [
  "📦 Where is my order?",
  "💳 How to pay via bKash / Nagad?",
  "🚚 Delivery time & shipping charge?",
  "🔄 How do returns & refunds work?",
  "💬 Talk to agent on WhatsApp"
];

export default function CustomerSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Hi there! Welcome to ShopMate 24/7 Customer Support. How can we assist you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Handle opening chat
  const toggleChat = () => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  };

  // Smart automated replies generator
  const getBotResponse = (query: string): { text: string; actionLink?: { label: string; url: string; external?: boolean } } => {
    const q = query.toLowerCase();

    if (q.includes("order") || q.includes("track") || q.includes("where is")) {
      return {
        text: "You can track your order status anytime from your Account > Orders page. We dispatch all confirmed orders within 24 hours!",
        actionLink: { label: "View My Orders", url: "/orders" }
      };
    }
    if (q.includes("bkash") || q.includes("nagad") || q.includes("payment") || q.includes("pay")) {
      return {
        text: "We accept bKash, Nagad, Rocket, VISA, Mastercard and Cash on Delivery via our secure SSLCommerz payment gateway. Simply select your preferred method on checkout!",
        actionLink: { label: "Go to Checkout", url: "/checkout" }
      };
    }
    if (q.includes("delivery") || q.includes("shipping") || q.includes("charge") || q.includes("time")) {
      return {
        text: "🚚 Inside Dhaka: 24–48 hours ($2.99 / Free over $50).\n🚚 Outside Dhaka / Nationwide: 2–4 business days ($4.99). All orders over $50 get 100% Free Shipping!",
        actionLink: { label: "Shipping Policy", url: "/shipping" }
      };
    }
    if (q.includes("return") || q.includes("refund") || q.includes("exchange") || q.includes("damaged")) {
      return {
        text: "We offer a 7-day hassle-free money-back return policy. If you receive a damaged or incorrect item, we will replace or refund it immediately.",
        actionLink: { label: "Returns Policy", url: "/returns" }
      };
    }
    if (q.includes("whatsapp") || q.includes("agent") || q.includes("human") || q.includes("talk") || q.includes("call") || q.includes("number")) {
      return {
        text: "You can chat directly with our human support manager on WhatsApp or call us at +880 1614703406 (Banani, Dhaka). Click below to open WhatsApp chat!",
        actionLink: { label: "Chat on WhatsApp 📱", url: "https://wa.me/8801614703406", external: true }
      };
    }
    if (q.includes("discount") || q.includes("coupon") || q.includes("offer") || q.includes("promo")) {
      return {
        text: "🎉 We currently have up to 30% OFF on all Electronics and special seasonal deals! Use code 'SAVE10' at checkout for an extra $10 off orders over $100.",
        actionLink: { label: "Explore Offers", url: "/offers" }
      };
    }

    // Default polite helpful reply
    return {
      text: "Thank you for reaching out! Our dedicated team is ready to help you. If you need immediate assistance or want to place an order over phone/WhatsApp, please click below:",
      actionLink: { label: "Live WhatsApp Support 💬", url: "https://wa.me/8801614703406", external: true }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate natural typing delay (800ms - 1200ms)
    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionLink: response.actionLink
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="support-chat-wrapper">
      {/* Floating Trigger Button (Bottom Right) */}
      <button
        className={`support-floating-btn ${isOpen ? "active" : ""}`}
        onClick={toggleChat}
        aria-label="Customer Support Live Chat"
        title="Chat with Customer Support"
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
          {/* Header */}
          <div className="support-header">
            <div className="support-header-agent">
              <div className="support-avatar-wrap">
                <Headphones size={20} className="support-avatar-icon" />
                <span className="support-avatar-status"></span>
              </div>
              <div className="support-agent-meta">
                <h4>ShopMate Support Care</h4>
                <p>
                  <span className="live-status-dot"></span> Active Now • Instant Reply
                </p>
              </div>
            </div>

            <div className="support-header-actions">
              <a
                href="https://wa.me/8801614703406"
                target="_blank"
                rel="noopener noreferrer"
                className="support-header-wa-btn"
                title="Direct WhatsApp Support (+880 1614703406)"
              >
                <Phone size={14} />
                <span>WhatsApp</span>
              </a>
              <button
                className="support-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="support-notice-bar">
            <Sparkles size={13} className="sparkle-icon" />
            <span>24/7 Live Assistance • Call / WhatsApp: +880 1614703406</span>
          </div>

          {/* Messages Body */}
          <div className="support-body">
            {messages.map((m) => (
              <div key={m.id} className={`support-msg-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                {m.sender === "bot" && (
                  <div className="support-bot-icon-circle">
                    <Bot size={14} />
                  </div>
                )}
                <div className="support-msg-content">
                  <div className={`support-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                    <p>{m.text}</p>
                    {m.actionLink && (
                      <div className="support-action-link-box">
                        {m.actionLink.external ? (
                          <a
                            href={m.actionLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="support-link-btn"
                          >
                            {m.actionLink.label} <ExternalLink size={12} />
                          </a>
                        ) : (
                          <a href={m.actionLink.url} className="support-link-btn">
                            {m.actionLink.label} <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="support-msg-time">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="support-msg-row bot-row">
                <div className="support-bot-icon-circle">
                  <Bot size={14} />
                </div>
                <div className="support-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="support-quick-pills">
            <span className="quick-title">Quick Help:</span>
            <div className="quick-pills-list">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  className="quick-pill-btn"
                  onClick={() => handleSendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Send Form */}
          <form
            className="support-footer-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Ask anything or message support..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="support-input"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="support-send-btn"
              title="Send Message"
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
