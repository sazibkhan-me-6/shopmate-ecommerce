import { RotateCcw, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Wallet, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Returns() {
  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">POLICY & GUARANTEES</span>
            <h1>Returns & Refunds Policy</h1>
            <p>Shop with confidence. If you're not completely satisfied, we make returns easy.</p>
          </div>
          <Link className="btn btn-primary" to="/contact">
            Request a Return <ArrowRight size={15} style={{ marginLeft: "4px" }} />
          </Link>
        </div>

        {/* 7-Day Guarantee Banner */}
        <section
          className="card"
          style={{
            padding: "30px",
            background: "linear-gradient(105deg, #064e3b, #047857)",
            color: "#fff",
            borderRadius: "12px",
            marginBottom: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              100% BUYER PROTECTION
            </span>
            <h2 style={{ fontSize: "26px", margin: "10px 0 6px" }}>7-Day Free Replacement & Refund</h2>
            <p style={{ margin: 0, color: "#a7f3d0", fontSize: "13px", maxWidth: "540px", lineHeight: "1.6" }}>
              Received a damaged product, incorrect size, or defective item? Request a free exchange or 100% money-back refund within 7 days of delivery.
            </p>
          </div>
          <div style={{ background: "#fff", color: "#065f46", padding: "16px 24px", borderRadius: "10px", textAlign: "center" }}>
            <RotateCcw size={28} style={{ margin: "auto" }} />
            <b style={{ display: "block", fontSize: "14px", marginTop: "4px" }}>Hassle-Free</b>
            <small style={{ fontSize: "11px", color: "#64748b" }}>24-48h Refund Speed</small>
          </div>
        </section>

        {/* 4 Step Process */}
        <h2 style={{ fontSize: "20px", marginBottom: "18px" }}>How Our Return Process Works</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div className="card" style={{ padding: "22px" }}>
            <span style={{ background: "#eff6ff", color: "#1d4ed8", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: "12px" }}>
              1
            </span>
            <h3 style={{ fontSize: "15px", margin: "0 0 6px" }}>Submit Request</h3>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
              Reach out via our Contact page or WhatsApp with your Order ID and photo evidence of the item.
            </p>
          </div>

          <div className="card" style={{ padding: "22px" }}>
            <span style={{ background: "#fef3c7", color: "#b45309", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: "12px" }}>
              2
            </span>
            <h3 style={{ fontSize: "15px", margin: "0 0 6px" }}>Pack the Item</h3>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
              Keep the original packaging, tags, box, and invoice intact with the product safely stored.
            </p>
          </div>

          <div className="card" style={{ padding: "22px" }}>
            <span style={{ background: "#ede9fe", color: "#6d28d9", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: "12px" }}>
              3
            </span>
            <h3 style={{ fontSize: "15px", margin: "0 0 6px" }}>Courier Pickup</h3>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
              Our delivery partner will pick up the parcel directly from your doorstep with zero return delivery charge.
            </p>
          </div>

          <div className="card" style={{ padding: "22px" }}>
            <span style={{ background: "#ecfdf5", color: "#047857", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: "12px" }}>
              4
            </span>
            <h3 style={{ fontSize: "15px", margin: "0 0 6px" }}>Fast Refund</h3>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
              Receive your refund directly into your bKash, Nagad, Bank account or original payment card within 24–48 hours.
            </p>
          </div>
        </div>

        {/* Eligibility Conditions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "40px" }}>
          <div className="card" style={{ padding: "26px", borderLeft: "4px solid #10b981" }}>
            <h3 style={{ fontSize: "16px", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px", color: "#065f46" }}>
              <CheckCircle2 size={18} /> Eligible for Return & Refund
            </h3>
            <ul style={{ fontSize: "13px", color: "#475569", lineHeight: "1.8", paddingLeft: "20px", margin: 0 }}>
              <li>Item delivered in physically damaged or broken state</li>
              <li>Defective electronics or malfunctioning parts</li>
              <li>Incorrect size, color, or model received</li>
              <li>Item differs noticeably from catalog photo or specs</li>
              <li>Missing items or accessories in package</li>
            </ul>
          </div>

          <div className="card" style={{ padding: "26px", borderLeft: "4px solid #ef4444" }}>
            <h3 style={{ fontSize: "16px", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px", color: "#991b1b" }}>
              <AlertCircle size={18} /> Non-Returnable Conditions
            </h3>
            <ul style={{ fontSize: "13px", color: "#475569", lineHeight: "1.8", paddingLeft: "20px", margin: 0 }}>
              <li>Items returned after the 7-day guarantee window</li>
              <li>Damage caused by misuse, water ingress, or improper handling</li>
              <li>Items with missing original brand tags, serial stickers, or packaging</li>
              <li>Personal hygiene or intimate apparel items once unsealed</li>
            </ul>
          </div>
        </div>

        {/* FAQ Support */}
        <div className="card" style={{ padding: "28px", textAlign: "center", background: "#f8fafc" }}>
          <h3 style={{ fontSize: "17px", margin: "0 0 8px" }}>Need help processing an existing order return?</h3>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 18px" }}>
            Our customer claims department is available 24/7 to assist with your return or replacement request.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/contact" className="btn btn-primary" style={{ fontSize: "13px" }}>
              Start Return on Support
            </Link>
            <Link to="/faq" className="btn btn-outline" style={{ fontSize: "13px" }}>
              Read Return FAQs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
