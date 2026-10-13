import { BarChart3, Box, ClipboardList, DollarSign, Plus, Users, CheckCircle, Smartphone, CreditCard } from "lucide-react";
import { useState } from "react";
import { getOrders, saveOrders } from "../services/storage";
import { products } from "../data";

export default function Admin() {
  const [orders, setOrdersState] = useState(getOrders());
  const [status, setStatus] = useState<Record<string, string>>({});
  const sales = orders.reduce((s, o) => s + o.total, 0);

  const updateStatus = (orderId: string, newStatus: string) => {
    setStatus({ ...status, [orderId]: newStatus });
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus as any } : o
    );
    setOrdersState(updated);
    saveOrders(updated);
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
          <button className="btn btn-primary">
            <Plus size={16} style={{ marginRight: "4px" }} /> Add Product
          </button>
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
            <b>{products.length}</b>
            <span>Active catalog</span>
          </div>
        </div>

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
                    <b>{o.id} — {o.customer.name}</b>
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
                    <small>Tel: {o.customer.phone} | {o.customer.city}</small>
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
              <h2>Products</h2>
              <span>{products.length} total</span>
            </div>
            {products.slice(0, 7).map((p) => (
              <div className="table-row" key={p.id}>
                <span className="prod-mini">
                  <img src={p.image} alt={p.name} />
                  <b>{p.name}</b>
                </span>
                <b>${p.price}</b>
                <button className="btn btn-soft">Edit</button>
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