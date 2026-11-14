import { Lock, ShieldCheck, Eye, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <main className="page">
      <div className="container static-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">YOUR PRIVACY MATTERS</span>
            <h1>Privacy Policy</h1>
            <p>Last updated: November 2026. Learn how ShopMate protects and respects your personal information.</p>
          </div>
          <Link to="/contact" className="btn btn-outline">
            Privacy Concerns
          </Link>
        </div>

        <div className="card" style={{ padding: "32px", fontSize: "14px", lineHeight: "1.8", color: "#334155" }}>
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "8px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#065f46",
            }}
          >
            <ShieldCheck size={28} style={{ flexShrink: 0 }} />
            <span>
              <b>Our Guarantee:</b> We never sell, rent, or trade your personal or financial data to third-party marketers. Your privacy is paramount.
            </span>
          </div>

          <h2 style={{ fontSize: "18px", marginTop: "16px", color: "#0f172a" }}>1. Information We Collect</h2>
          <p>
            When you interact with ShopMate, we collect essential information required to fulfill your orders and enhance your shopping experience:
          </p>
          <ul style={{ paddingLeft: "20px" }}>
            <li><b>Personal Details:</b> Name, email address, contact phone number.</li>
            <li><b>Shipping Address:</b> Street, city, postal code, and country for accurate package delivery.</li>
            <li><b>Order Data:</b> Purchased items, quantities, transaction records, and preferred payment method.</li>
          </ul>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>2. Payment Security & Encryption</h2>
          <p>
            All online payments via credit cards, debit cards, and mobile banking (bKash, Nagad, Rocket) are processed through <b>SSLCommerz</b>, a Tier-1 PCI-DSS certified gateway with 256-bit SSL encryption.
          </p>
          <p>
            <b>We do not store your card number, CVV code, mobile wallet PIN, or banking passwords</b> on our servers. Transactions are handled directly by the licensed payment gateway.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>3. How We Use Your Data</h2>
          <p>Your information is used strictly for:</p>
          <ul style={{ paddingLeft: "20px" }}>
            <li>Processing, dispatching, and delivering your ordered goods.</li>
            <li>Sending SMS and email tracking updates regarding your order status.</li>
            <li>Providing customer support and processing returns/refunds.</li>
            <li>Detecting and preventing fraudulent transactions.</li>
          </ul>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>4. Information Sharing</h2>
          <p>
            We only share necessary information (such as your delivery name, telephone number, and delivery address) with trusted courier partners (such as Pathao, RedX, Steadfast, DHL) strictly for the purpose of doorstep delivery.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>5. Cookies and Local Storage</h2>
          <p>
            ShopMate uses browser LocalStorage and standard session cookies solely to preserve your shopping cart items, wishlist favorites, and dark/light mode preference across sessions.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>6. Your Rights</h2>
          <p>
            You have the right to request access to the personal data we hold about you, request corrections, or request deletion of your customer profile at any time by contacting our privacy officer.
          </p>

          <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Privacy inquiries: privacy@shopmate.com</span>
            <Link to="/terms" className="link-purple" style={{ fontSize: "13px" }}>
              View Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
