import { BarChart3, Box, ClipboardList, DollarSign, Plus, Smartphone, X, Check, ExternalLink, ShieldCheck, Radio } from "lucide-react";
import { useState } from "react";
import { getOrders, saveOrders } from "../services/storage";
import { products as initialProducts } from "../data";
import type { Product } from "../types";

export default function Admin({ notify }: { notify?: (msg: string) => void }) {
  const [orders, setOrdersState] = useState(getOrders());
  const [status, setStatus] = useState<Record<string, string>>({});
  const [productList, setProductList] = useState<Product[]>(() => {
    const saved = localStorage.getItem("shopmate_custom_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

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