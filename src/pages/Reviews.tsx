import { useState } from "react";
import { Star, CheckCircle2, MessageSquarePlus, ThumbsUp, ArrowRight, UserRound, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { reviews as initialReviews } from "../data";

export default function Reviews({ notify }: { notify?: (msg: string) => void }) {
  const [reviewsList, setReviewsList] = useState(() => {
    const saved = localStorage.getItem("shopmate_user_reviews");
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;

    const newReview = {
      name: form.name.trim(),
      text: form.text.trim(),
      days: "Just now",
      rating: form.rating,
      verified: true,
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem("shopmate_user_reviews", JSON.stringify(updated));
    setForm({ name: "", text: "", rating: 5 });
    setShowForm(false);
    if (notify) notify("⭐ Thank you! Your review has been published.");
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">CUSTOMER VOICES</span>
            <h1>Customer Reviews & Ratings</h1>
            <p>Real feedback from verified buyers across Bangladesh and international customers.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <MessageSquarePlus size={16} style={{ marginRight: "6px" }} />
            Write a Review
          </button>
        </div>

        {/* Rating Overview Card */}
        <div
          className="card"
          style={{
            padding: "30px",
            marginBottom: "35px",
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: "35px",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", borderRight: "1px solid #edf0f5", paddingRight: "25px" }}>
            <h2 style={{ fontSize: "48px", margin: "0", color: "#1e293b", fontWeight: 800 }}>4.8</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "3px", margin: "8px 0" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="#ffb000" stroke="#ffb000" />
              ))}
            </div>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Based on 340+ verified reviews</span>
          </div>

          <div>
            {[
              { star: 5, pct: "86%" },
              { star: 4, pct: "11%" },
              { star: 3, pct: "2%" },
              { star: 2, pct: "1%" },
              { star: 1, pct: "0%" },
            ].map((row) => (
              <div
                key={row.star}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "12px",
                  margin: "6px 0",
                  color: "#475569",
                }}
              >
                <span style={{ minWidth: "45px" }}>{row.star} stars</span>
                <div style={{ flex: 1, height: "8px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: row.pct, height: "100%", background: "#ffb000", borderRadius: "99px" }} />
                </div>
                <span style={{ minWidth: "35px", textAlign: "right", fontWeight: 600 }}>{row.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form Modal */}
        {showForm && (
          <div className="card" style={{ padding: "26px", marginBottom: "35px", background: "#f8fafc" }}>
            <h3 style={{ fontSize: "17px", margin: "0 0 16px" }}>Share Your Shopping Experience</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700 }}>
                  Your Full Name
                  <div className="icon-field" style={{ marginTop: "6px" }}>
                    <span className="icon-field-icon"><UserRound size={15} /></span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder=""
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #dce1ea",
                      }}
                    />
                  </div>
                </label>
                <label style={{ fontSize: "12px", fontWeight: 700 }}>
                  Rating (1 to 5 Stars)
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #dce1ea",
                      marginTop: "6px",
                    }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                    <option value={1}>⭐ (1 - Unsatisfied)</option>
                  </select>
                </label>
              </div>

              <label style={{ fontSize: "12px", fontWeight: 700 }}>
                Your Feedback
                <div className="icon-field icon-field-top" style={{ marginTop: "6px" }}>
                  <span className="icon-field-icon"><MessageSquare size={15} /></span>
                  <textarea
                    required
                    rows={3}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    placeholder=""
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #dce1ea",
                    }}
                  />
                </div>
              </label>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {reviewsList.map((r: any, idx: number) => (
            <div key={idx} className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#eef2f6",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    color: "#1e293b",
                  }}
                >
                  {r.name[0]}
                </div>
                <div>
                  <b style={{ fontSize: "13px", display: "block" }}>{r.name}</b>
                  <small style={{ fontSize: "10px", color: "#16a34a", display: "flex", alignItems: "center", gap: "3px" }}>
                    <CheckCircle2 size={12} /> Verified Buyer
                  </small>
                </div>
                <small style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "11px" }}>{r.days}</small>
              </div>

              <div style={{ display: "flex", gap: "2px", margin: "8px 0" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < (r.rating || 5) ? "#ffb000" : "none"}
                    stroke={i < (r.rating || 5) ? "#ffb000" : "#d1d5db"}
                  />
                ))}
              </div>

              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", margin: "10px 0 0" }}>
                “{r.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
