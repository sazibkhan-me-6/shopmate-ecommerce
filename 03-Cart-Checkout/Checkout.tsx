import { CheckCircle2, CreditCard, MapPin, ShieldCheck, Smartphone, WalletCards, Truck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem, Order } from "../types";
import { saveOrders } from "../services/storage";
import { createOrderOnServer } from "../services/api";
import {
  processBkashPayment,
  processNagadPayment,
  processSSLCommerzPayment,
  processStripePayment,
} from "../services/payment";

export default function Checkout({ cart, onClear }: { cart: CartItem[]; onClear: () => void }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 7.99;
  const total = subtotal + shipping;
  const bdtRate = 120; // 1 USD approx 120 BDT
  const totalBDT = Math.round(total * bdtRate);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    country: "Bangladesh",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"Cash on Delivery" | "bKash" | "Nagad" | "SSLCommerz" | "Stripe Card">("SSLCommerz");
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;
    setErrorMsg("");
    setBusy(true);

    const orderId = "SM-" + Date.now().toString().slice(-8);
    let paymentStatus: "Paid" | "Pending Verification" | "Unpaid" = "Unpaid";
    let finalTrxId = trxId;

    // Payment Processing based on method
    if (paymentMethod === "Cash on Delivery") {
      paymentStatus = "Unpaid";
    } else if (paymentMethod === "bKash") {
      if (!senderNumber || !trxId) {
        setErrorMsg("Please provide your bKash mobile number and Transaction ID (TrxID).");
        setBusy(false);
        return;
      }
      const res = await processBkashPayment({
        orderId,
        amount: totalBDT,
        currency: "BDT",
        customer: form,
        method: "bKash",
        transactionId: trxId,
        senderNumber,
      });
      if (!res.success) {
        setErrorMsg(res.message);
        setBusy(false);
        return;
      }
      paymentStatus = res.paymentStatus;
      finalTrxId = res.transactionId || trxId;
    } else if (paymentMethod === "Nagad") {
      if (!senderNumber || !trxId) {
        setErrorMsg("Please provide your Nagad mobile number and Transaction ID.");
        setBusy(false);
        return;
      }
      const res = await processNagadPayment({
        orderId,
        amount: totalBDT,
        currency: "BDT",
        customer: form,
        method: "Nagad",
        transactionId: trxId,
        senderNumber,
      });
      if (!res.success) {
        setErrorMsg(res.message);
        setBusy(false);
        return;
      }
      paymentStatus = res.paymentStatus;
      finalTrxId = res.transactionId || trxId;
    } else if (paymentMethod === "SSLCommerz") {
      const res = await processSSLCommerzPayment({
        orderId,
        amount: totalBDT,
        currency: "BDT",
        customer: form,
        method: "SSLCommerz",
      });
      paymentStatus = res.paymentStatus;
      finalTrxId = res.transactionId || "SSL-" + Date.now().toString().slice(-6);
    } else if (paymentMethod === "Stripe Card") {
      if (!card.number || !card.expiry || !card.cvc) {
        setErrorMsg("Please enter valid card details.");
        setBusy(false);
        return;
      }
      const res = await processStripePayment({
        orderId,
        amount: total,
        currency: "USD",
        customer: form,
        method: "Stripe Card",
        cardDetails: {
          cardNumber: card.number,
          expDate: card.expiry,
          cvc: card.cvc,
          nameOnCard: card.name || form.name,
        },
      });
      if (!res.success) {
        setErrorMsg(res.message);
        setBusy(false);
        return;
      }
      paymentStatus = res.paymentStatus;
      finalTrxId = res.transactionId || "CH-" + Date.now().toString().slice(-6);
    }

    const order: Order = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      total,
      status: "Confirmed",
      customer: form,
      payment: paymentMethod,
      paymentDetails: {
        method: paymentMethod,
        transactionId: finalTrxId || undefined,
        senderNumber: senderNumber || undefined,
        cardLast4: card.number ? card.number.slice(-4) : undefined,
        paymentStatus,
      },
    };

    await createOrderOnServer(order);
    const existingOrders = JSON.parse(localStorage.getItem("shopmate_orders") || "[]");
    saveOrders([order, ...existingOrders]);
    onClear();
    setBusy(false);
    navigate(`/order-success/${order.id}`);
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">CHECKOUT</span>
            <h1>Complete Your Order</h1>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: "600" }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form className="checkout-grid" onSubmit={submit}>
          <section className="checkout-form">
            {/* Shipping Information */}
            <div className="card checkout-card">
              <h2><MapPin /> Shipping Information</h2>
              <div className="form-grid">
                <label>Full Name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>
                <label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
                <label>Phone<input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+880 1XXXXXXXXX" /></label>
                <label>City<input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></label>
                <label className="full">Address<input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, house number, area" /></label>
                <label>Country
                  <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                    <option>Bangladesh</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                  </select>
                </label>
                <label>Postal Code<input required value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} placeholder="1212" /></label>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="card checkout-card">
              <h2><WalletCards /> Payment Method</h2>
              <div className="payment-options">
                {/* bKash */}
                <label className={paymentMethod === "bKash" ? "pay-option active" : "pay-option"}>
                  <input type="radio" name="payment" checked={paymentMethod === "bKash"} onChange={() => setPaymentMethod("bKash")} />
                  <span>
                    <b style={{ color: "#e2136e" }}>📱 bKash (বিকাশ)</b>
                    <small>Pay instantly via bKash Personal/Merchant Account</small>
                  </span>
                </label>

                {/* Nagad */}
                <label className={paymentMethod === "Nagad" ? "pay-option active" : "pay-option"}>
                  <input type="radio" name="payment" checked={paymentMethod === "Nagad"} onChange={() => setPaymentMethod("Nagad")} />
                  <span>
                    <b style={{ color: "#f7941d" }}>📲 Nagad (নগদ)</b>
                    <small>Pay instantly via Nagad Send Money / Payment</small>
                  </span>
                </label>

                {/* SSLCommerz */}
                <label className={paymentMethod === "SSLCommerz" ? "pay-option active" : "pay-option"}>
                  <input type="radio" name="payment" checked={paymentMethod === "SSLCommerz"} onChange={() => setPaymentMethod("SSLCommerz")} />
                  <span>
                    <b style={{ color: "#0066b2" }}>💳 SSLCommerz Gateway</b>
                    <small>Cards, Internet Banking, Rocket, Upay & Mobile Wallets</small>
                  </span>
                </label>

                {/* Stripe Card */}
                <label className={paymentMethod === "Stripe Card" ? "pay-option active" : "pay-option"}>
                  <input type="radio" name="payment" checked={paymentMethod === "Stripe Card"} onChange={() => setPaymentMethod("Stripe Card")} />
                  <span>
                    <b>🌐 International Card (Stripe)</b>
                    <small>Visa, Mastercard, American Express</small>
                  </span>
                </label>

                {/* Cash on Delivery */}
                <label className={paymentMethod === "Cash on Delivery" ? "pay-option active" : "pay-option"}>
                  <input type="radio" name="payment" checked={paymentMethod === "Cash on Delivery"} onChange={() => setPaymentMethod("Cash on Delivery")} />
                  <Truck size={24} style={{ color: "#059669", marginRight: "6px" }} />
                  <span>
                    <b style={{ color: "#059669" }}>Cash on Delivery</b>
                    <small>Pay in cash when order arrives at your doorstep</small>
                  </span>
                </label>
              </div>

              {/* Cash on Delivery Instructions Box */}
              {paymentMethod === "Cash on Delivery" && (
                <div style={{ marginTop: "16px", padding: "16px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <Truck size={28} style={{ color: "#059669", flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: "#065f46", fontSize: "13px", margin: "0 0 4px" }}>Cash on Delivery (ক্যাশ অন ডেলিভারি):</h4>
                    <p style={{ fontSize: "12px", color: "#047857", margin: 0, lineHeight: "1.6" }}>
                      পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে <b>৳{totalBDT.toLocaleString()} BDT</b> ক্যাশ টাকা পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                    </p>
                  </div>
                </div>
              )}

              {/* bKash Instructions Box */}
              {paymentMethod === "bKash" && (
                <div style={{ marginTop: "16px", padding: "16px", background: "#fdf2f8", border: "1px solid #fbcfe8", borderRadius: "8px" }}>
                  <h4 style={{ color: "#be185d", fontSize: "13px", marginBottom: "8px" }}>bKash পেমেন্ট নির্দেশাবলী:</h4>
                  <ol style={{ fontSize: "11px", color: "#4b5563", paddingLeft: "18px", lineHeight: "1.7" }}>
                    <li>আপনার bKash App ওপেন করুন অথবা <b>*247#</b> ডায়াল করুন।</li>
                    <li><b>Send Money</b> অথবা <b>Payment</b> সিলেক্ট করুন।</li>
                    <li>আমাদের বিকাশ নম্বর দিন: <b style={{ color: "#be185d", fontSize: "12px" }}>01614703406</b> (Personal / Merchant)</li>
                    <li>মোট টাকার পরিমাণ দিন: <b>৳{totalBDT.toLocaleString()} BDT</b> (${total.toFixed(2)})</li>
                    <li>রেফারেন্স হিসেবে আপনার নাম লিখুন এবং পিন দিয়ে সম্পন্ন করুন।</li>
                    <li>মেসেজে প্রাপ্ত <b>TrxID (Transaction ID)</b> নিচে লিখে অর্ডার কনফার্ম করুন।</li>
                  </ol>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      আপনার bKash নম্বর
                      <input required value={senderNumber} onChange={e => setSenderNumber(e.target.value)} placeholder="017XXXXXXXX" />
                    </label>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      Transaction ID (TrxID)
                      <input required value={trxId} onChange={e => setTrxId(e.target.value)} placeholder="e.g. BL9A8BC76D" />
                    </label>
                  </div>
                </div>
              )}

              {/* Nagad Instructions Box */}
              {paymentMethod === "Nagad" && (
                <div style={{ marginTop: "16px", padding: "16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px" }}>
                  <h4 style={{ color: "#c2410c", fontSize: "13px", marginBottom: "8px" }}>Nagad পেমেন্ট নির্দেশাবলী:</h4>
                  <ol style={{ fontSize: "11px", color: "#4b5563", paddingLeft: "18px", lineHeight: "1.7" }}>
                    <li>আপনার Nagad App অথবা <b>*167#</b> ডায়াল করুন।</li>
                    <li><b>Send Money</b> অথবা <b>Merchant Pay</b> সিলেক্ট করুন।</li>
                    <li>আমাদের নগদ নম্বর দিন: <b style={{ color: "#c2410c", fontSize: "12px" }}>01614703406</b> (Personal / Merchant)</li>
                    <li>মোট টাকার পরিমাণ দিন: <b>৳{totalBDT.toLocaleString()} BDT</b></li>
                    <li>লেনদেন সম্পন্ন করার পর প্রাপ্ত <b>TrxID</b> নিচে লিখুন।</li>
                  </ol>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      আপনার Nagad নম্বর
                      <input required value={senderNumber} onChange={e => setSenderNumber(e.target.value)} placeholder="018XXXXXXXX" />
                    </label>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      Transaction ID (TrxID)
                      <input required value={trxId} onChange={e => setTrxId(e.target.value)} placeholder="e.g. 7N8B9C01" />
                    </label>
                  </div>
                </div>
              )}

              {/* SSLCommerz Info Box */}
              {paymentMethod === "SSLCommerz" && (
                <div className="notice" style={{ background: "#eff6ff", color: "#1e40af", borderColor: "#bfdbfe" }}>
                  <ShieldCheck size={20} />
                  <span>অর্ডার প্লেস করার পর আপনাকে <b>SSLCommerz সিকিউর পেমেন্ট গেটওয়েতে</b> রিডাইরেক্ট করা হবে (Visa, Mastercard, bKash, Nagad, Rocket সাপোর্টেড)।</span>
                </div>
              )}

              {/* Stripe Card Box */}
              {paymentMethod === "Stripe Card" && (
                <div style={{ marginTop: "16px", padding: "16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                  <h4 style={{ fontSize: "13px", marginBottom: "10px" }}><CreditCard size={15} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Card Details</h4>
                  <label style={{ fontSize: "11px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                    Card Number
                    <input required value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} placeholder="4242 •••• •••• 4242" />
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      Expiry (MM/YY)
                      <input required value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} placeholder="12/28" />
                    </label>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      CVC / CVV
                      <input required value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value })} placeholder="123" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Order Summary Sidebar */}
          <aside className="card summary">
            <h2>Order Summary</h2>
            {cart.map(x => (
              <div className="mini-item" key={x.id}>
                <img src={x.image} alt="" />
                <span>{x.name}<small>Qty: {x.quantity}</small></span>
                <b>${(x.price * x.quantity).toFixed(2)}</b>
              </div>
            ))}
            <hr />
            <div>
              <span>Subtotal</span>
              <b>${subtotal.toFixed(2)}</b>
            </div>
            <div>
              <span>Shipping</span>
              <b>{shipping ? "$" + shipping.toFixed(2) : "Free"}</b>
            </div>
            <div className="total">
              <span>Total (USD)</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", textAlign: "right", marginTop: "-6px", marginBottom: "15px" }}>
              Approx: <b>৳{totalBDT.toLocaleString()} BDT</b>
            </div>
            <button className="btn btn-primary checkout-btn" disabled={busy || !cart.length}>
              {busy ? "Processing..." : `Confirm Order (${paymentMethod})`}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}