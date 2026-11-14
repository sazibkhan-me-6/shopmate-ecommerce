import { FileText, Shield, Scale, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="page">
      <div className="container static-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">LEGAL AGREEMENT</span>
            <h1>Terms & Conditions</h1>
            <p>Last updated: November 2026. Please read these terms carefully before using ShopMate.</p>
          </div>
          <Link to="/contact" className="btn btn-outline">
            Legal Inquiries
          </Link>
        </div>

        <div className="card" style={{ padding: "32px", fontSize: "14px", lineHeight: "1.8", color: "#334155" }}>
          <h2 style={{ fontSize: "18px", marginTop: "0", color: "#0f172a" }}>1. Introduction & Acceptance</h2>
          <p>
            Welcome to <b>ShopMate</b> ("we," "our," or "us"). By accessing or using our website, services, and online store, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please refrain from using our services.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>2. User Account & Security</h2>
          <p>
            When creating an account on ShopMate, you are responsible for maintaining the confidentiality of your login credentials and for restricting unauthorized access to your account. You agree to accept responsibility for all activities that occur under your account.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>3. Product Information & Pricing</h2>
          <p>
            We strive to display accurate descriptions, specifications, and pricing for all products. Prices are quoted in United States Dollars ($ USD) with approximate local conversions in Bangladeshi Taka (৳ BDT) at the prevailing exchange rate. We reserve the right to correct any typographical errors, inaccuracies, or price discrepancies before an order is dispatched.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>4. Payment Terms & Gateways</h2>
          <p>
            ShopMate supports multiple secure payment channels:
          </p>
          <ul style={{ paddingLeft: "20px" }}>
            <li><b>SSLCommerz Gateway:</b> Supports Visa, MasterCard, American Express, bKash, Nagad, Rocket, CellFin, and Internet Banking through 256-bit PCI-DSS certified encryption.</li>
            <li><b>Mobile Financial Services (MFS):</b> Manual transactions via bKash and Nagad require a valid Transaction ID (TrxID) and sender mobile number verification.</li>
            <li><b>Cash on Delivery (COD):</b> Available across all 64 districts in Bangladesh. Customers must inspect the outer packaging and pay the exact invoice amount to the delivery courier upon delivery.</li>
          </ul>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>5. Order Confirmation & Shipping</h2>
          <p>
            Upon placing an order, you will receive an electronic confirmation containing your unique Order ID. We reserve the right to cancel any order due to product unavailability, stock depletion, fraud suspicion, or payment verification failure.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>6. Returns, Replacements & Warranty</h2>
          <p>
            All eligible purchases come with a 7-day return and exchange policy. Products must be in their original packaging with tags intact. Electronic products carry official manufacturer warranties where indicated on the product detail page.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>7. Limitation of Liability</h2>
          <p>
            ShopMate shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our products or website services.
          </p>

          <h2 style={{ fontSize: "18px", marginTop: "24px", color: "#0f172a" }}>8. Governing Law</h2>
          <p>
            These Terms & Conditions are governed by and construed in accordance with the laws of the People's Republic of Bangladesh and applicable international digital commerce frameworks.
          </p>

          <div style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Questions about these terms? Email legal@shopmate.com</span>
            <Link to="/privacy" className="link-purple" style={{ fontSize: "13px" }}>
              Read Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
