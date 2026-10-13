import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: "960px", margin: "auto" }}>
        <div className="page-heading" style={{ textAlign: "center", display: "block", marginBottom: "30px" }}>
          <span className="eyebrow">SUPPORT & ASSISTANCE</span>
          <h1>Contact Us & Connect</h1>
          <p style={{ maxWidth: "560px", margin: "8px auto 0" }}>
            Have questions regarding orders, payments, or wholesale deals? Get in touch with our support team or reach us via social media.
          </p>
        </div>

        {/* Social Media Channels Card */}
        <div className="card" style={{ padding: "24px", textAlign: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "17px", margin: "0 0 8px" }}>Follow Our Social Media Channels</h2>
          <p className="muted" style={{ fontSize: "13px", margin: "0 0 16px" }}>
            Stay updated with special discounts, coupon codes, and upcoming sales.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="btn" style={{ background: "#1877f2", color: "#fff", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <Facebook size={16} /> Facebook
            </a>
            <a href="https://wa.me/8801614703406" target="_blank" rel="noreferrer" className="btn" style={{ background: "#25d366", color: "#fff", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <Phone size={16} /> WhatsApp
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn" style={{ background: "linear-gradient(45deg,#f09433,#dc2743,#bc1888)", color: "#fff", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <Instagram size={16} /> Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="btn" style={{ background: "#ff0000", color: "#fff", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <Youtube size={16} /> YouTube
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="btn" style={{ background: "#111", color: "#fff", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <Twitter size={16} /> Twitter / 𝕏
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn" style={{ background: "#0a66c2", color: "#fff", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {/* Direct Contact Info */}
          <div className="card" style={{ padding: "26px" }}>
            <h2 style={{ fontSize: "18px", margin: "0 0 20px" }}>Direct Contact</h2>

            <div style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "9px", background: "#f0edff", color: "#6246e8", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Phone size={20} />
              </div>
              <div>
                <b style={{ fontSize: "13px", display: "block" }}>Phone & Mobile Banking</b>
                <span className="muted" style={{ fontSize: "12px", display: "block" }}>+880 1614703406 (bKash & Nagad)</span>
                <span className="muted" style={{ fontSize: "12px", display: "block" }}>+880 1800000000 (Helpline)</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "9px", background: "#f0edff", color: "#6246e8", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <b style={{ fontSize: "13px", display: "block" }}>Email Address</b>
                <span className="muted" style={{ fontSize: "12px", display: "block" }}>support@shopmate.com</span>
                <span className="muted" style={{ fontSize: "12px", display: "block" }}>sales@shopmate.com</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "9px", background: "#f0edff", color: "#6246e8", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <b style={{ fontSize: "13px", display: "block" }}>Office Location</b>
                <span className="muted" style={{ fontSize: "12px", display: "block" }}>House 42, Road 11, Block D</span>
                <span className="muted" style={{ fontSize: "12px", display: "block" }}>Banani, Dhaka - 1213, Bangladesh</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "9px", background: "#f0edff", color: "#6246e8", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Clock size={20} />
              </div>
              <div>
                <b style={{ fontSize: "13px", display: "block" }}>Customer Support Hours</b>
                <span className="muted" style={{ fontSize: "12px", display: "block" }}>Saturday – Thursday: 9:00 AM – 10:00 PM</span>
                <span className="muted" style={{ fontSize: "12px", display: "block" }}>Friday: 2:00 PM – 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="card" style={{ padding: "26px" }}>
            <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Send Us a Message</h2>
            {submitted && (
              <div style={{ background: "#e8f8ef", color: "#16894e", padding: "12px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <CheckCircle2 size={18} /> Thank you! Your message has been sent. We'll get back to you shortly.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>Your Name *</label>
                <input required style={{ width: "100%", height: "38px", border: "1px solid #dfe3ea", borderRadius: "6px", padding: "0 10px", fontSize: "12px" }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Tanvir Ahmed" />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>Email Address *</label>
                <input required type="email" style={{ width: "100%", height: "38px", border: "1px solid #dfe3ea", borderRadius: "6px", padding: "0 10px", fontSize: "12px" }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. tanvir@example.com" />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>Phone Number</label>
                <input style={{ width: "100%", height: "38px", border: "1px solid #dfe3ea", borderRadius: "6px", padding: "0 10px", fontSize: "12px" }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="017XXXXXXXX" />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>Subject</label>
                <input style={{ width: "100%", height: "38px", border: "1px solid #dfe3ea", borderRadius: "6px", padding: "0 10px", fontSize: "12px" }} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Order query / Product question" />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>Message *</label>
                <textarea required rows={4} style={{ width: "100%", border: "1px solid #dfe3ea", borderRadius: "6px", padding: "10px", fontSize: "12px", fontFamily: "inherit" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Type your message here..."></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
