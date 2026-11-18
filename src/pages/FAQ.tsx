import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare, Phone, Mail, Search, Truck, CreditCard, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [activeTab, setActiveTab] = useState<"all" | "orders" | "payments" | "returns">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "orders",
      q: "How do I place an order on ShopMate?",
      a: "Browse products, select your desired color or size, and click 'Add to Cart'. When you're ready, visit your Cart, review your items, and click 'Proceed to Checkout'. Fill in your delivery address, choose your payment method, and confirm your order.",
    },
    {
      category: "orders",
      q: "How can I check the status of my order?",
      a: "Once your order is confirmed, you will receive an Order ID (e.g. SM-12345678). You can check your order status anytime by clicking 'My Orders' in your account menu, or contacting our support team via WhatsApp.",
    },
    {
      category: "orders",
      q: "How long does shipping take?",
      a: "Inside Dhaka City, orders are delivered within 24 to 48 hours. Outside Dhaka across all districts of Bangladesh, delivery takes 2 to 4 business days. International orders take 5 to 7 business days.",
    },
    {
      category: "payments",
      q: "What payment methods do you accept?",
      a: "We support: 1. Cash on Delivery (COD) across all 64 districts. 2. SSLCommerz Gateway (Visa, Mastercard, Amex, Rocket, CellFin, Net Banking). 3. Direct bKash & Nagad (Send Money / Merchant Payment). 4. International Cards via Stripe.",
    },
    {
      category: "payments",
      q: "How does Cash on Delivery (COD) work?",
      a: "With Cash on Delivery, you pay cash directly to the delivery courier agent when your package arrives at your doorstep. No advance payment is needed.",
    },
    {
      category: "payments",
      q: "How do I pay using bKash or Nagad?",
      a: "You can either use the SSLCommerz gateway popup to pay directly from your bKash/Nagad wallet, or select manual bKash/Nagad on checkout, send the total amount to 01614703406, and enter your Transaction ID (TrxID) in the checkout field.",
    },
    {
      category: "returns",
      q: "What is your return and refund policy?",
      a: "We offer a 7-day hassle-free return and exchange policy. If an item is defective, damaged, or wrong size, you can request a return. Once verified, refunds are sent directly to your bKash, Nagad, or Bank within 24–48 hours.",
    },
    {
      category: "returns",
      q: "Is there any charge for returning an item?",
      a: "No. If you received a defective, wrong, or damaged item, return courier pickup is 100% free of charge.",
    },
    {
      category: "orders",
      q: "Can I cancel or modify my order after placing it?",
      a: "Yes. You can cancel or change your order before it has been dispatched by contacting our customer support team at +880 1614703406 with your Order ID.",
    },
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesSearch =
      !searchQuery ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">HELP CENTER</span>
            <h1>Frequently Asked Questions</h1>
            <p>Find quick answers to common questions about orders, delivery, payments, and returns.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Contact Support
          </Link>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: "600px", margin: "0 auto 30px" }}>
          <div style={{ position: "relative" }}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. delivery, bKash, return, orders)..."
              style={{
                width: "100%",
                padding: "14px 44px 14px 18px",
                borderRadius: "10px",
                border: "1px solid #dce1ea",
                fontSize: "14px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            />
            <Search
              size={18}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
              }}
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "30px" }}>
          <button
            className={`btn ${activeTab === "all" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("all")}
            style={{ fontSize: "12px", padding: "8px 16px" }}
          >
            All Questions
          </button>
          <button
            className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("orders")}
            style={{ fontSize: "12px", padding: "8px 16px" }}
          >
            <Truck size={14} style={{ marginRight: "4px" }} /> Orders & Shipping
          </button>
          <button
            className={`btn ${activeTab === "payments" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("payments")}
            style={{ fontSize: "12px", padding: "8px 16px" }}
          >
            <CreditCard size={14} style={{ marginRight: "4px" }} /> Payments & COD
          </button>
          <button
            className={`btn ${activeTab === "returns" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActiveTab("returns")}
            style={{ fontSize: "12px", padding: "8px 16px" }}
          >
            <RotateCcw size={14} style={{ marginRight: "4px" }} /> Returns & Refunds
          </button>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ maxWidth: "800px", margin: "0 auto 40px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredFaqs.length ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="card" style={{ overflow: "hidden" }}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "18px 20px",
                      background: "none",
                      border: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: "14px",
                      color: isOpen ? "#6246e8" : "#1e293b",
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 20px 20px",
                        fontSize: "13px",
                        lineHeight: "1.7",
                        color: "#475569",
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "14px",
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="card empty" style={{ padding: "40px" }}>
              <HelpCircle size={40} />
              <h3>No matching questions found</h3>
              <p>Try searching for a different keyword or contact our support team.</p>
            </div>
          )}
        </div>

        {/* Contact Banner */}
        <div
          className="card"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "26px",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "16px" }}>Still have questions?</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
              Our dedicated support team is available 24/7 on WhatsApp & Phone.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <a
              href="https://wa.me/8801614703406"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Phone size={14} /> WhatsApp Support
            </a>
            <Link to="/contact" className="btn btn-primary" style={{ fontSize: "12px" }}>
              <Mail size={14} style={{ marginRight: "4px" }} /> Send Message
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
