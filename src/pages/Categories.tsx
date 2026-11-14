import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, products } from "../data";

export default function Categories() {
  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">BROWSE BY DEPARTMENT</span>
            <h1>All Product Categories</h1>
            <p>Explore all categories and find high-quality products curated just for you.</p>
          </div>
          <Link className="btn btn-primary" to="/shop">
            View All Products <ArrowRight size={15} style={{ marginLeft: "4px" }} />
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.name).length;
            return (
              <div
                key={c.name}
                className="card"
                style={{
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={c.image}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "rgba(17,28,45,0.85)",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {count} {count === 1 ? "Product" : "Products"}
                  </span>
                </div>
                <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "17px", margin: "0 0 6px" }}>{c.name}</h3>
                    <p style={{ fontSize: "12px", color: "#667085", margin: "0 0 16px", lineHeight: "1.5" }}>
                      Discover premium selections, top brands and new arrivals in {c.name}.
                    </p>
                  </div>
                  <Link
                    to={`/shop?category=${encodeURIComponent(c.name)}`}
                    className="btn btn-outline"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "12px",
                      padding: "10px 14px",
                      width: "100%",
                    }}
                  >
                    Explore {c.name} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories Banner */}
        <section
          className="card"
          style={{
            marginTop: "40px",
            padding: "30px",
            background: "linear-gradient(105deg, #142033, #1e293b)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <span style={{ color: "#a5b4fc", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
              <Sparkles size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: "4px" }} />
              CAN'T FIND WHAT YOU ARE LOOKING FOR?
            </span>
            <h2 style={{ fontSize: "24px", margin: "8px 0 6px" }}>Looking for a custom or unlisted item?</h2>
            <p style={{ margin: 0, color: "#cbd5e1", fontSize: "13px" }}>
              Reach out to our customer support team for pre-orders, corporate deals, or product inquiries.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary" style={{ padding: "12px 24px" }}>
            Contact Support
          </Link>
        </section>
      </div>
    </main>
  );
}
