import {
  BarChart3,
  Box,
  ClipboardList,
  DollarSign,
  Plus,
  Smartphone,
  X,
  Check,
  ExternalLink,
  ShieldCheck,
  Radio,
  Headphones,
  MessageCircle,
  Send,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getOrders, saveOrders } from "../services/storage";
import {
  getSupportThreads,
  sendAdminReply,
  deleteSupportThread,
  subscribeToSupportBus,
  type SupportThread,
} from "../services/support";
import { products as initialProducts } from "../data";
import type { Product } from "../types";

export default function Admin({ notify }: { notify?: (msg: string) => void }) {
  const [orders, setOrdersState] = useState(getOrders());
  const [status, setStatus] = useState<Record<string, string>>({});
  const [productList, setProductList] = useState<Product[]>(() => {
    const saved = localStorage.getItem("shopmate_custom_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [supportThreads, setSupportThreads] = useState<SupportThread[]>(getSupportThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    const list = getSupportThreads();
    return list.length > 0 ? list[0].id : "";
  });
  const [adminReplyText, setAdminReplyText] = useState("");
  const adminChatEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to live events from customer support chat
  useEffect(() => {
    const unsubscribe = subscribeToSupportBus((event) => {
      const updated = getSupportThreads();
      setSupportThreads(updated);

      if (event.type === "CUSTOMER_MESSAGE") {
        const { threadId, message, customerInfo } = event.payload;
        setActiveThreadId((prev) => prev || threadId);
        if (notify) {
          notify(`💬 New support message from ${customerInfo?.name || "Customer"}: "${message.text}"`);
        }
      }
    });

    return () => unsubscribe();
  }, [notify]);

  // Auto-scroll admin chat
  useEffect(() => {
    adminChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supportThreads, activeThreadId]);

  const activeThread = supportThreads.find((t) => t.id === activeThreadId) || supportThreads[0];

  const handleSendReply = (textToSend?: string) => {
    const text = (textToSend || adminReplyText).trim();
    if (!text || !activeThread) return;

    sendAdminReply(activeThread.id, text, "Admin Support");
    setAdminReplyText("");
    const updated = getSupportThreads();
    setSupportThreads(updated);
    if (notify) notify(`✅ Reply sent to ${activeThread.customerName}!`);
  };

  const handleDeleteThread = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteSupportThread(threadId);
    const updated = getSupportThreads();
    setSupportThreads(updated);
    if (activeThreadId === threadId) {
      setActiveThreadId(updated.length > 0 ? updated[0].id : "");
    }
    if (notify) notify("🗑️ Support conversation cleared.");
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProd, setNewProd] = useState({
    name: "",
    category: "Electronics",
    price: "",
    oldPrice: "",
    brand: "ShopMate",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    stock: "25",
  });

  const sales = orders.reduce((s, o) => s + o.total, 0);

  const updateStatus = (orderId: string, newStatus: string) => {
    setStatus({ ...status, [orderId]: newStatus });
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus as any } : o
    );
    setOrdersState(updated);
    saveOrders(updated);
    if (notify) notify(`✅ Order ${orderId} status updated to "${newStatus}"`);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    const created: Product = {
      id: "p" + Date.now().toString().slice(-5),
      name: newProd.name,
      category: newProd.category,
      price: parseFloat(newProd.price),
      oldPrice: newProd.oldPrice ? parseFloat(newProd.oldPrice) : undefined,
      brand: newProd.brand || "ShopMate",
      image: newProd.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      rating: 4.8,
      reviews: 1,
      stock: parseInt(newProd.stock) || 10,
      description: `${newProd.name} - high quality item from ${newProd.brand}.`,
    };

    const updated = [created, ...productList];
    setProductList(updated);
    localStorage.setItem("shopmate_custom_products", JSON.stringify(updated));
    setShowAddModal(false);
    setNewProd({
      name: "",
      category: "Electronics",
      price: "",
      oldPrice: "",
      brand: "ShopMate",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      stock: "25",
    });
    if (notify) notify(`✅ Product "${created.name}" added to catalog!`);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = productList.map((p) =>
      p.id === editingProduct.id ? editingProduct : p
    );
    setProductList(updated);
    localStorage.setItem("shopmate_custom_products", JSON.stringify(updated));
    setEditingProduct(null);
    if (notify) notify(`✅ Product "${editingProduct.name}" updated!`);
  };

  return (
    <main className="page admin-page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">ADMIN PANEL</span>
            <h1>Store Dashboard & Payment Verification</h1>
            <p>Manage store orders, view customer bKash/Nagad/Card payments and status.</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a
              href="https://shopmate-admin-panel.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              <ExternalLink size={16} /> Open Live Admin Panel (Vercel)
            </a>
            <button
              className="btn btn-soft"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} style={{ marginRight: "4px" }} /> Add Product
            </button>
          </div>
        </div>

        {/* Central Admin Hub Connection Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
            color: "#ffffff",
            padding: "24px 28px",
            borderRadius: "16px",
            marginBottom: "28px",
            boxShadow: "0 10px 25px -5px rgba(49, 46, 129, 0.35)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span
                style={{
                  background: "#22c55e",
                  color: "#052e16",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: "999px",
                  letterSpacing: "0.5px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Radio size={12} /> LIVE SYNC ACTIVE
              </span>
              <span style={{ fontSize: "13px", opacity: 0.9, fontWeight: 500 }}>
                Central Command Architecture
              </span>
            </div>
            <h2 style={{ fontSize: "21px", fontWeight: 800, margin: "0 0 6px", color: "#ffffff", letterSpacing: "-0.3px" }}>
              ShopMate Live Admin Control Panel
            </h2>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", opacity: 0.9, color: "#e0e7ff" }}>
              This e-commerce store is controlled and synchronized in real-time with the central admin control dashboard at{" "}
              <b style={{ color: "#ffffff", textDecoration: "underline" }}>https://shopmate-admin-panel.vercel.app/</b>. Manage catalog items, orders with customer phone & delivery address, bKash/Nagad verification, promo codes, and storefront announcements.
            </p>
          </div>
          <a
            href="https://shopmate-admin-panel.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#ffffff",
              color: "#312e81",
              padding: "13px 24px",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              whiteSpace: "nowrap",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <ShieldCheck size={18} color="#4f46e5" />
            Launch Central Admin Hub ↗
          </a>
        </div>

        {/* Dashboard Stats */}
        <div className="stats">
          <div className="stat card">
            <DollarSign />
            <small>Total Sales</small>
            <b>${sales.toFixed(2)}</b>
            <span>Live orders</span>
          </div>
          <div className="stat card">
            <ClipboardList />
            <small>Total Orders</small>
            <b>{orders.length}</b>
            <span>All placed orders</span>
          </div>
          <div className="stat card">
            <Smartphone />
            <small>MFS Payments (bKash/Nagad)</small>
            <b>
              {
                orders.filter(
                  (o) => o.payment === "bKash" || o.payment === "Nagad"
                ).length
              }
            </b>
            <span>Mobile Banking</span>
          </div>
          <div className="stat card">
            <Box />
            <small>Products</small>
            <b>{productList.length}</b>
            <span>Active catalog</span>
          </div>
          <div className="stat card" style={{ borderLeft: "3px solid #6246e8" }}>
            <Headphones style={{ color: "#6246e8" }} />
            <small>Live Support Inquiries</small>
            <b>{supportThreads.length}</b>
            <span>{supportThreads.filter(t => t.unreadByAdmin > 0).length} unread</span>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="sslModalBackdrop" onClick={() => setShowAddModal(false)}>
            <div
              className="card"
              style={{
                maxWidth: "500px",
                width: "100%",
                padding: "24px",
                position: "relative",
                background: "#fff",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="sslCloseBtn"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
              <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Add New Product</h2>
              <form onSubmit={handleAddProduct} className="checkout-form">
                <label>
                  Product Name
                  <input
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Wireless Smart Watch"
                  />
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    Category
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    >
                      <option>Electronics</option>
                      <option>Audio</option>
                      <option>Wearables</option>
                      <option>Fashion</option>
                      <option>Footwear</option>
                      <option>Home</option>
                    </select>
                  </label>
                  <label>
                    Brand
                    <input
                      value={newProd.brand}
                      onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    />
                  </label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    Price ($)
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      placeholder="49.99"
                    />
                  </label>
                  <label>
                    Old Price ($) [Optional]
                    <input
                      type="number"
                      step="0.01"
                      value={newProd.oldPrice}
                      onChange={(e) => setNewProd({ ...newProd, oldPrice: e.target.value })}
                      placeholder="69.99"
                    />
                  </label>
                </div>
                <label>
                  Image URL
                  <input
                    value={newProd.image}
                    onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  />
                </label>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "16px" }}
                >
                  Save Product to Catalog
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="sslModalBackdrop" onClick={() => setEditingProduct(null)}>
            <div
              className="card"
              style={{
                maxWidth: "460px",
                width: "100%",
                padding: "24px",
                position: "relative",
                background: "#fff",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="sslCloseBtn"
                onClick={() => setEditingProduct(null)}
              >
                ✕
              </button>
              <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Edit Product</h2>
              <form onSubmit={handleEditProduct} className="checkout-form">
                <label>
                  Name
                  <input
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                  />
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    Price ($)
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </label>
                  <label>
                    Stock
                    <input
                      required
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "16px" }}
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Live Customer Support Desk */}
        <section className="admin-support-desk">
          <div className="admin-support-header">
            <div className="admin-support-title">
              <Headphones size={22} color="#a5b4fc" />
              <div>
                <h2>Live Customer Support Desk</h2>
                <small style={{ color: "#c7d2fe", fontSize: "11px" }}>
                  Direct Real-Time Connection with Storefront Customer Support
                </small>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="admin-support-badge">
                <span className="live-status-dot" style={{ background: "#052e16", width: "6px", height: "6px" }}></span>
                LIVE SYNC ACTIVE
              </span>
              <button
                className="btn btn-soft"
                onClick={() => {
                  const updated = getSupportThreads();
                  setSupportThreads(updated);
                  if (notify) notify("🔄 Support inquiries refreshed");
                }}
                title="Refresh Support Inquiries"
                style={{ padding: "4px 10px", fontSize: "11px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "0" }}
              >
                <RefreshCw size={12} style={{ marginRight: "4px" }} /> Refresh
              </button>
            </div>
          </div>

          <div className="admin-support-layout">
            {/* Left Sidebar: Customer Threads */}
            <div className="admin-threads-sidebar">
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #edf0f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b" }}>
                  Active Inquiries ({supportThreads.length})
                </span>
              </div>

              {!supportThreads.length ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                  <MessageCircle size={32} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
                  <p style={{ fontSize: "12px", margin: "0 0 4px", fontWeight: 600 }}>No Inquiries Right Now</p>
                  <small style={{ fontSize: "10px", lineHeight: "1.4", display: "block" }}>
                    When visitors send questions from the Customer Support chat, they will show up here immediately.
                  </small>
                </div>
              ) : (
                supportThreads.map((thread) => {
                  const lastMsg = thread.messages[thread.messages.length - 1];
                  const isSelected = activeThread?.id === thread.id;
                  return (
                    <div
                      key={thread.id}
                      className={`admin-thread-item ${isSelected ? "active" : ""}`}
                      onClick={() => setActiveThreadId(thread.id)}
                    >
                      <div className="admin-thread-top">
                        <span className="admin-thread-name">
                          {thread.customerName}
                          {thread.unreadByAdmin > 0 && (
                            <span className="admin-thread-unread">{thread.unreadByAdmin} new</span>
                          )}
                        </span>
                        <span className="admin-thread-time">{lastMsg?.time || ""}</span>
                      </div>
                      <p className="admin-thread-snippet">
                        {lastMsg?.sender === "admin" ? "You: " : ""}{lastMsg?.text || "Started conversation"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Panel: Live Chat Messages & Reply */}
            <div className="admin-chat-main">
              {activeThread ? (
                <>
                  <div className="admin-chat-topbar">
                    <div>
                      <b style={{ fontSize: "13px" }}>{activeThread.customerName}</b>
                      {activeThread.customerEmail && (
                        <small style={{ display: "block", color: "#64748b", fontSize: "10px" }}>
                          {activeThread.customerEmail}
                        </small>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                        <span className="live-status-dot"></span> Live
                      </span>
                      <button
                        className="btn btn-soft"
                        onClick={(e) => handleDeleteThread(activeThread.id, e)}
                        title="Clear Conversation"
                        style={{ padding: "4px 8px", fontSize: "11px", color: "#ef4444" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="admin-chat-messages-area">
                    {activeThread.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`support-msg-row ${m.sender === "admin" ? "user-row" : "bot-row"}`}
                        style={{ maxWidth: "80%" }}
                      >
                        <div className="support-msg-content">
                          <span style={{ fontSize: "9px", fontWeight: 700, color: m.sender === "admin" ? "#6246e8" : "#0f172a", marginBottom: "2px" }}>
                            {m.sender === "admin" ? "You (Admin Support)" : activeThread.customerName}
                          </span>
                          <div className={`support-bubble ${m.sender === "admin" ? "user-bubble" : "bot-bubble"}`}>
                            <p>{m.text}</p>
                          </div>
                          <span className="support-msg-time">{m.time}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={adminChatEndRef} />
                  </div>

                  {/* Canned Quick Response Chips */}
                  <div className="admin-canned-chips">
                    {[
                      "Hello! How can I assist you today?",
                      "Your order is verified and on its way!",
                      "We have received your payment via bKash/Nagad.",
                      "Thank you for reaching out to ShopMate Support!"
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        className="admin-chip-btn"
                        onClick={() => handleSendReply(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form
                    className="admin-chat-bottom-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendReply();
                    }}
                  >
                    <input
                      type="text"
                      className="admin-reply-box"
                      placeholder={`Reply to ${activeThread.customerName}...`}
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!adminReplyText.trim()}
                      className="btn btn-primary"
                      style={{ padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <Send size={14} /> Send Reply
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ padding: "80px 20px", textAlign: "center", color: "#94a3b8", margin: "auto" }}>
                  <Headphones size={42} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
                  <h3 style={{ fontSize: "15px", margin: "0 0 6px" }}>Admin Live Support Desk</h3>
                  <p style={{ fontSize: "12px", margin: 0, maxWidth: "340px" }}>
                    Select a conversation from the sidebar or wait for a customer to send an inquiry from the storefront chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Orders Table with Payment Verification */}
        <div className="admin-grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
          <section className="card admin-table">
            <div className="table-head">
              <h2>Recent Orders & Payment Verification</h2>
              <BarChart3 size={18} />
            </div>
            {orders.length ? (
              orders.map((o) => (
                <div
                  className="table-row"
                  key={o.id}
                  style={{ gridTemplateColumns: "1fr auto auto" }}
                >
                  <span>
                    <b>
                      {o.id} — {o.customer.name}
                    </b>
                    <small>
                      <b>Payment:</b> {o.payment}{" "}
                      {o.paymentDetails?.transactionId && (
                        <span style={{ color: "#6246e8" }}>
                          | TrxID: <code>{o.paymentDetails.transactionId}</code>
                        </span>
                      )}
                      {o.paymentDetails?.senderNumber && (
                        <span> | From: {o.paymentDetails.senderNumber}</span>
                      )}
                    </small>
                    <small>
                      Tel: {o.customer.phone} | {o.customer.city}
                    </small>
                  </span>
                  <b>${o.total.toFixed(2)}</b>
                  <select
                    value={status[o.id] || o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {[
                      "Pending",
                      "Confirmed",
                      "Processing",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))
            ) : (
              <div className="empty mini">
                <ClipboardList />
                <p>No orders placed yet.</p>
              </div>
            )}
          </section>

          {/* Products Catalog Summary */}
          <section className="card admin-table">
            <div className="table-head">
              <h2>Products Catalog</h2>
              <span>{productList.length} total</span>
            </div>
            {productList.slice(0, 8).map((p) => (
              <div className="table-row" key={p.id}>
                <span className="prod-mini">
                  <img src={p.image} alt={p.name} />
                  <div>
                    <b>{p.name}</b>
                    <small style={{ color: "#64748b" }}>Stock: {p.stock}</small>
                  </div>
                </span>
                <b>${p.price.toFixed(2)}</b>
                <button
                  className="btn btn-soft"
                  onClick={() => setEditingProduct(p)}
                >
                  Edit
                </button>
              </div>
            ))}
          </section>
        </div>

        <div className="admin-notice">
          💡 <b>Payment Gateway Note:</b> For live bKash & SSLCommerz production transactions, store your Merchant App Key, Secret, and Store ID in <code>.env</code> on the server.
        </div>
      </div>
    </main>
  );
}