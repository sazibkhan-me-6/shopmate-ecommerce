import { useState } from "react";
import { Package, Truck, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getUser } from "../services/storage";
import { syncCustomerToAdminPanel } from "../services/api";

export default function Profile({ notify }: { notify?: (msg: string) => void }) {
  const initial: any = getUser() || {
    name: "ShopMate User",
    email: "customer@example.com",
    phone: "+880 1614703406",
    address: "Banani, Block C, House 24",
    city: "Dhaka",
    role: "customer",
  };

  const [form, setForm] = useState({
    name: initial.name || "ShopMate User",
    email: initial.email || "",
    phone: initial.phone || "+880 1614703406",
    address: initial.address || "Banani, Dhaka",
    city: initial.city || "Dhaka",
    role: initial.role || "customer",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("shopmate_user", JSON.stringify(form));
    syncCustomerToAdminPanel({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      source: "Storefront Profile Update",
    });
    if (notify) notify("✅ Your profile information has been saved successfully!");
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: "850px" }}>
        <div className="page-heading">
          <div>
            <span className="eyebrow">MY ACCOUNT</span>
            <h1>Profile & Account Settings</h1>
            <p>Manage your personal information, shipping addresses, and security preferences.</p>
          </div>
          <Link to="/account" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ArrowLeft size={16} /> Back to Account
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "25px" }}>
          {/* User Card */}
          <div
            className="card"
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
              background: "linear-gradient(105deg, #1e293b, #0f172a)",
              color: "#fff",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#6246e8",
                display: "grid",
                placeItems: "center",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              {form.name[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 style={{ fontSize: "20px", margin: "0 0 4px" }}>{form.name}</h2>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>{form.email}</p>
            </div>
            <span
              style={{
                marginLeft: "auto",
                background: "rgba(98, 70, 232, 0.35)",
                border: "1px solid #6246e8",
                color: "#c7d2fe",
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {form.role}
            </span>
          </div>

          {/* Form */}
          <div className="card" style={{ padding: "30px" }}>
            <h3 style={{ fontSize: "17px", margin: "0 0 20px" }}>Personal & Delivery Details</h3>
            <form onSubmit={handleSave} className="checkout-form" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <label>
                  Full Name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
                <label>
                  Email Address
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <label>
                  Phone Number
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </label>
                <label>
                  City
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Default Delivery Address
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  marginTop: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  alignSelf: "flex-start",
                  padding: "12px 24px",
                }}
              >
                <Save size={16} /> Save Profile Changes
              </button>
            </form>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "15px" }}>
            <Link to="/orders" className="card account-card">
              <Package size={22} style={{ color: "#6246e8" }} />
              <h3>My Orders</h3>
              <p>Review past order history.</p>
            </Link>
            <Link to="/shipping" className="card account-card">
              <Truck size={22} style={{ color: "#6246e8" }} />
              <h3>Shipping Details</h3>
              <p>Delivery timelines and shipping rates.</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
