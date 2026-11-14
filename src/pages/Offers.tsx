import { useState, useEffect } from "react";
import { ArrowRight, Clock, Copy, Flame, Gift, Tag, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";

export default function Offers({
  wishlist,
  onWish,
  onCart,
  notify,
}: {
  wishlist: string[];
  onWish: (id: string) => void;
  onCart: (p: Product) => void;
  notify?: (msg: string) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(18420); // ~5 hours in seconds
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const pad = (n: number) => (n < 10 ? "0" + n : n);

  const discountedProducts = products.filter(
    (p) => p.oldPrice && p.oldPrice > p.price
  );

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (notify) notify(`📋 Coupon "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const coupons = [
    {
      code: "SAVE10",
      desc: "Get 10% off on your entire shopping cart total",
      type: "10% OFF",
      min: "No minimum spend",
    },
    {
      code: "WELCOME20",
      desc: "Save up to $20 on orders over $100",
      type: "$20 OFF",
      min: "Min. spend $100",
    },
    {
      code: "FREESHIP",
      desc: "Automatic free courier shipping on all orders over $50",
      type: "FREE SHIP",
      min: "Orders over $50",
    },
  ];

  return (
    <main className="page">
      <div className="container">
        {/* Flash Sale Banner */}
        <section
          className="card"
          style={{
            padding: "36px 30px",
            background: "linear-gradient(120deg, #1e1b4b, #312e81, #4338ca)",
            color: "#fff",
            borderRadius: "14px",
            marginBottom: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            boxShadow: "0 15px 35px rgba(67, 56, 202, 0.25)",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#f43f5e",
                color: "#fff",
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.5px",
                marginBottom: "12px",
              }}
            >
              <Flame size={14} /> FLASH SALE • LIMITED TIME
            </div>
            <h1 style={{ fontSize: "32px", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
              Up to 50% OFF on Top Picks
            </h1>
            <p style={{ margin: 0, color: "#c7d2fe", fontSize: "14px", maxWidth: "480px", lineHeight: "1.6" }}>
              Exclusive limited-time promotions on electronics, smartphones, audio, and fashion essentials.
            </p>
          </div>

          {/* Countdown Clock */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(8px)",
              padding: "16px 24px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#e0e7ff",
                marginBottom: "8px",
              }}
            >
              <Clock size={15} /> Sale Ends In:
            </span>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ background: "#fff", color: "#1e1b4b", padding: "8px 12px", borderRadius: "8px", fontWeight: 800, fontSize: "18px", minWidth: "48px" }}>
                {pad(hours)}
                <small style={{ display: "block", fontSize: "9px", fontWeight: 600, color: "#64748b" }}>HRS</small>
              </div>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>:</span>
              <div style={{ background: "#fff", color: "#1e1b4b", padding: "8px 12px", borderRadius: "8px", fontWeight: 800, fontSize: "18px", minWidth: "48px" }}>
                {pad(minutes)}
                <small style={{ display: "block", fontSize: "9px", fontWeight: 600, color: "#64748b" }}>MIN</small>
              </div>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>:</span>
              <div style={{ background: "#fff", color: "#1e1b4b", padding: "8px 12px", borderRadius: "8px", fontWeight: 800, fontSize: "18px", minWidth: "48px" }}>
                {pad(seconds)}
                <small style={{ display: "block", fontSize: "9px", fontWeight: 600, color: "#64748b" }}>SEC</small>
              </div>
            </div>
          </div>
        </section>

        {/* Active Coupons Section */}
        <div style={{ marginBottom: "35px" }}>
          <div className="section-head">
            <div>
              <h2 className="section-title">
                <Tag size={20} style={{ display: "inline", verticalAlign: "-3px", marginRight: "6px", color: "#6246e8" }} />
                Active Store Promo Codes
              </h2>
              <p>Copy and apply these discount coupon codes on the checkout or cart page.</p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {coupons.map((c) => (
              <div
                key={c.code}
                className="card"
                style={{
                  padding: "20px",
                  borderLeft: "5px solid #6246e8",
                  position: "relative",
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <b style={{ color: "#6246e8", fontSize: "16px", letterSpacing: "0.5px" }}>{c.code}</b>
                  <span
                    style={{
                      background: "#f3e8ff",
                      color: "#7e22ce",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    {c.type}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#475569", margin: "0 0 14px", lineHeight: "1.5" }}>
                  {c.desc}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #e2e8f0", paddingTop: "12px" }}>
                  <small style={{ color: "#94a3b8", fontSize: "11px" }}>{c.min}</small>
                  <button
                    className="btn btn-soft"
                    onClick={() => copyCoupon(c.code)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {copiedCode === c.code ? <Check size={13} /> : <Copy size={13} />}
                    {copiedCode === c.code ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discounted Products Grid */}
        <section>
          <div className="section-head">
            <div>
              <h2 className="section-title">
                <Gift size={20} style={{ display: "inline", verticalAlign: "-3px", marginRight: "6px", color: "#e22d3d" }} />
                Special Offers Catalog ({discountedProducts.length} items)
              </h2>
              <p>Special slashed prices on selected bestsellers.</p>
            </div>
            <Link className="link-purple" to="/shop">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>

          <div className="products-grid">
            {discountedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                wished={wishlist.includes(p.id)}
                onWish={() => onWish(p.id)}
                onCart={() => onCart(p)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
