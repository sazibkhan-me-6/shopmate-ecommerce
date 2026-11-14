import { ShieldCheck, Truck, Users, Award, HeartHandshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="page-heading">
          <div>
            <span className="eyebrow">ABOUT SHOPMATE</span>
            <h1>Shopping Made Smarter & Simple</h1>
            <p>Curated quality, transparent pricing, and dependable doorstep delivery since 2024.</p>
          </div>
          <Link to="/shop" className="btn btn-primary">
            Explore Store <ArrowRight size={15} style={{ marginLeft: "4px" }} />
          </Link>
        </div>

        {/* Hero Mission Card */}
        <section
          className="card"
          style={{
            padding: "36px",
            background: "linear-gradient(105deg, #142033, #1e293b)",
            color: "#fff",
            borderRadius: "14px",
            marginBottom: "35px",
          }}
        >
          <span style={{ color: "#a5b4fc", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
            OUR MISSION
          </span>
          <h2 style={{ fontSize: "28px", margin: "10px 0 14px", letterSpacing: "-0.5px" }}>
            Empowering Everyday Shoppers with Quality You Can Trust
          </h2>
          <p style={{ margin: 0, color: "#cbd5e1", fontSize: "14px", lineHeight: "1.7", maxWidth: "720px" }}>
            ShopMate was founded to bridge the gap between quality electronics, fashion, lifestyle items, and honest customer service in Bangladesh. We believe online shopping should be seamless, transparent, and completely free of hidden fees or deceptive product photos.
          </p>
        </section>

        {/* 4 Pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ color: "#6246e8", marginBottom: "12px" }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>100% Authentic</h3>
            <p style={{ fontSize: "13px", color: "#667085", margin: 0, lineHeight: "1.6" }}>
              Every product in our catalog is sourced directly from certified manufacturers and official brand distributors.
            </p>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ color: "#10b981", marginBottom: "12px" }}>
              <Truck size={32} />
            </div>
            <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>Fast Delivery</h3>
            <p style={{ fontSize: "13px", color: "#667085", margin: 0, lineHeight: "1.6" }}>
              24–48 hour delivery inside Dhaka and 2–4 days across all 64 districts with full parcel inspection on COD.
            </p>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ color: "#f59e0b", marginBottom: "12px" }}>
              <HeartHandshake size={32} />
            </div>
            <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>7-Day Returns</h3>
            <p style={{ fontSize: "13px", color: "#667085", margin: 0, lineHeight: "1.6" }}>
              Hassle-free 7-day replacement and 100% refund policy if an item arrives damaged or doesn't meet expectations.
            </p>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div style={{ color: "#ec4899", marginBottom: "12px" }}>
              <Award size={32} />
            </div>
            <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>Secure Checkout</h3>
            <p style={{ fontSize: "13px", color: "#667085", margin: 0, lineHeight: "1.6" }}>
              Protected by 256-bit SSL encryption via SSLCommerz, bKash, Nagad, and Visa/Mastercard payments.
            </p>
          </div>
        </div>

        {/* Company Stats */}
        <section
          className="card"
          style={{
            padding: "30px",
            background: "#f8fafc",
            marginBottom: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            textAlign: "center",
          }}
        >
          <div>
            <b style={{ fontSize: "32px", color: "#6246e8", display: "block" }}>15,000+</b>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Happy Customers</span>
          </div>
          <div>
            <b style={{ fontSize: "32px", color: "#10b981", display: "block" }}>64 Districts</b>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Nationwide Coverage</span>
          </div>
          <div>
            <b style={{ fontSize: "32px", color: "#f59e0b", display: "block" }}>4.8 / 5.0</b>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Average Rating</span>
          </div>
          <div>
            <b style={{ fontSize: "32px", color: "#6366f1", display: "block" }}>24/7</b>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Dedicated Support</span>
          </div>
        </section>

        {/* Direct Links */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/categories" className="btn btn-outline" style={{ fontSize: "12px" }}>
              Explore Categories
            </Link>
            <Link to="/shipping" className="btn btn-outline" style={{ fontSize: "12px" }}>
              Shipping Policy
            </Link>
            <Link to="/reviews" className="btn btn-outline" style={{ fontSize: "12px" }}>
              Read Reviews
            </Link>
          </div>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: "12px" }}>
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
