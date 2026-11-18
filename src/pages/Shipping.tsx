import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

export default function Shipping() {
  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">DELIVERY & LOGISTICS</span>
            <h1>Shipping Information</h1>
            <p>Fast, reliable, and secure doorstep delivery across Bangladesh and worldwide.</p>
          </div>
          <Link className="btn btn-outline" to="/shop">
            Start Shopping
          </Link>
        </div>

        {/* Top 3 Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <div className="card" style={{ padding: "24px", borderTop: "4px solid #6246e8" }}>
            <div style={{ color: "#6246e8", marginBottom: "12px" }}>
              <Truck size={32} />
            </div>
            <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>Free Shipping on $50+</h3>
            <p style={{ fontSize: "13px", color: "#667085", margin: 0, lineHeight: "1.6" }}>
              Enjoy free doorstep shipping automatically applied on any domestic order exceeding $50 (approx. ৳6,000 BDT).
            </p>
          </div>

          <div className="card" style={{ padding: "24px", borderTop: "4px solid #10b981" }}>
            <div style={{ color: "#10b981", marginBottom: "12px" }}>
              <Clock size={32} />
            </div>
            <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>Express 24h Delivery</h3>
            <p style={{ fontSize: "13px", color: "#667085", margin: 0, lineHeight: "1.6" }}>
              Same-day dispatch and 24 to 48 hours doorstep delivery in Dhaka, Chittagong, and major metro regions.
            </p>
          </div>

          <div className="card" style={{ padding: "24px", borderTop: "4px solid #f59e0b" }}>
            <div style={{ color: "#f59e0b", marginBottom: "12px" }}>
              <PackageCheck size={32} />
            </div>
            <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>Cash on Delivery Available</h3>
            <p style={{ fontSize: "13px", color: "#667085", margin: 0, lineHeight: "1.6" }}>
              Check your package and pay cash directly to the courier agent at your door across all 64 districts.
            </p>
          </div>
        </div>

        {/* Delivery Rates & Timelines Table */}
        <section className="card" style={{ padding: "28px", marginBottom: "35px" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Delivery Timelines & Rates</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Destination</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Estimated Delivery</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Standard Cost</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Orders $50+</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>Inside Dhaka City</td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>24 – 48 Hours</td>
                  <td style={{ padding: "14px 16px" }}>৳60 BDT / $2.00</td>
                  <td style={{ padding: "14px 16px", color: "#10b981", fontWeight: 700 }}>FREE</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>Outside Dhaka (All Districts)</td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>2 – 4 Business Days</td>
                  <td style={{ padding: "14px 16px" }}>৳120 BDT / $4.00</td>
                  <td style={{ padding: "14px 16px", color: "#10b981", fontWeight: 700 }}>FREE</td>
                </tr>
                <tr>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>International Air Delivery</td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>5 – 7 Business Days</td>
                  <td style={{ padding: "14px 16px" }}>Calculated at checkout</td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>Standard Rates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Courier Partners */}
        <div style={{ marginBottom: "35px" }}>
          <div className="card" style={{ padding: "26px" }}>
            <h3 style={{ fontSize: "16px", margin: "0 0 12px" }}>Trusted Delivery Partners</h3>
            <p style={{ fontSize: "13px", color: "#667085", lineHeight: "1.6", margin: "0 0 16px" }}>
              We partner with industry-leading courier services to ensure prompt and tamper-proof delivery:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <span style={{ background: "#f1f5f9", padding: "8px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", color: "#334155" }}>
                🚚 Pathao Courier
              </span>
              <span style={{ background: "#f1f5f9", padding: "8px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", color: "#334155" }}>
                📦 RedX Logistics
              </span>
              <span style={{ background: "#f1f5f9", padding: "8px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", color: "#334155" }}>
                ⚡ Steadfast Courier
              </span>
              <span style={{ background: "#f1f5f9", padding: "8px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", color: "#334155" }}>
                ✈️ DHL Express
              </span>
            </div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="card" style={{ padding: "24px", background: "#f8fafc", textAlign: "center" }}>
          <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>Have special delivery instructions or questions?</h3>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
            Our customer logistics desk is available 24/7 on WhatsApp & Phone: <b>+880 1614703406</b>
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: "13px" }}>
            Contact Shipping Support
          </Link>
        </div>
      </div>
    </main>
  );
}
