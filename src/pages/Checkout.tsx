import { CheckCircle2, CreditCard, MapPin, ShieldCheck, Smartphone, WalletCards, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem, Order } from "../types";
import { saveOrders } from "../services/storage";
import { createOrderOnServer } from "../services/api";
import {
  processBkashPayment,
  processNagadPayment,
  processStripePayment,
} from "../services/payment";

/* ========================================================
   SSLCOMMERZ EASY CHECKOUT MODAL COMPONENT
   ======================================================== */
function SSLCommerzModal({
  totalBDT,
  totalUSD,
  onSuccess,
  onClose,
}: {
  totalBDT: number;
  totalUSD: number;
  onSuccess: (details: { method: string; trxId: string }) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"card" | "mfs" | "bank">("card");
  const [timer, setTimer] = useState(224); // 03:44 countdown
  const [selectedMfs, setSelectedMfs] = useState("bKash");
  const [selectedBank, setSelectedBank] = useState("City Touch");
  const [cardData, setCardData] = useState({ num: "", exp: "", cvc: "", name: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, []);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m < 10 ? "0" + m : m}:${sec < 10 ? "0" + sec : sec}`;
  };

  const trxId = "SSL" + Date.now().toString().slice(-8) + "xKhy";

  const handlePay = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      const chosenMethod =
        tab === "card"
          ? "Card (VISA/Mastercard)"
          : tab === "mfs"
          ? `MFS (${selectedMfs})`
          : `Bank (${selectedBank})`;
      onSuccess({ method: chosenMethod, trxId });
    }, 1200);
  };

  const mfsList = [
    { name: "bKash", cls: "mfs-bkash", badge: "bKash" },
    { name: "Rocket", cls: "mfs-rocket", badge: "rocket" },
    { name: "Nagad", cls: "mfs-nagad", badge: "নগদ" },
    { name: "CellFin", cls: "mfs-cellfin", badge: "CellFin" },
    { name: "MCash", cls: "mfs-bkash", badge: "MCash" },
    { name: "Cashbaba", cls: "mfs-upay", badge: "CB" },
    { name: "Rainbow", cls: "mfs-bank", badge: "RB" },
    { name: "Tap", cls: "mfs-tap", badge: "tap" },
    { name: "OK Wallet", cls: "mfs-okwallet", badge: "OK" },
    { name: "GPay", cls: "mfs-gpay", badge: "G" },
    { name: "Rupali Cash", cls: "mfs-bkash", badge: "RC" },
    { name: "Pathao Pay", cls: "mfs-upay", badge: "P" },
  ];

  const bankList = [
    { name: "AB Bank", code: "AB" },
    { name: "Sonali Bank", code: "SB" },
    { name: "City Touch", code: "City" },
    { name: "MTB", code: "MTB" },
    { name: "Dhaka Bank", code: "DBL" },
    { name: "Prime Bank", code: "Prime" },
    { name: "Islami Bank", code: "IBBL" },
    { name: "EBL SKY", code: "EBL" },
    { name: "iPay", code: "iPay" },
    { name: "FSIBL", code: "FSIBL" },
    { name: "Midland Bank", code: "MDB" },
    { name: "BRAC Bank", code: "BRAC" },
  ];

  return (
    <div
      className="sslModalBackdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sslModalBox">
        <button className="sslCloseBtn" onClick={onClose} title="Cancel">
          ✕
        </button>

        {/* Left Column: Summary */}
        <div className="sslLeftCol">
          <div>
            <div className="sslHeader">
              <div className="sslBrand">
                <span className="sslBrandBadge">SHOPMATE</span>
                <div>
                  <b style={{ display: "block", fontSize: "13px" }}>ShopMate Store</b>
                  <small style={{ color: "#64748b", fontSize: "10px" }}>Trx ID: {trxId}</small>
                </div>
              </div>
              <div className="sslTimer">⏱ {formatTimer(timer)}</div>
            </div>

            <div className="sslAmountCard">
              <small>You are paying</small>
              <h2>৳{totalBDT.toLocaleString()}.00</h2>
              <span style={{ fontSize: "11px", color: "#64748b" }}>(${totalUSD.toFixed(2)} USD)</span>
            </div>

            <div className="sslSummaryRow">
              <span>Subtotal</span>
              <b>৳{totalBDT.toLocaleString()}.00</b>
            </div>
            <div className="sslSummaryRow">
              <span>Convenience Charge</span>
              <b>৳0.00</b>
            </div>
            <div className="sslSummaryRow total">
              <span>Total amount</span>
              <b>৳{totalBDT.toLocaleString()}.00</b>
            </div>

            <div className="sslOffersBox">
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>🎁</div>
              <b style={{ color: "#334155" }}>Special Offers and Savings</b>
              <p style={{ margin: "2px 0 0", fontSize: "10px" }}>
                Automatically applied with eligible payments
              </p>
            </div>
          </div>

          <div className="sslFooterLinks">
            <span>Support • FAQ</span>
            <span>
              Powered by <b>SSLCOMMERZ</b> • PCI-DSS
            </span>
          </div>
        </div>

        {/* Right Column: Payment Tabs */}
        <div className="sslRightCol">
          <div className="sslTopBar">
            <small style={{ color: "#64748b" }}>Secure Payment Gateway</small>
            <span style={{ fontSize: "11px", color: "#0072f5", fontWeight: 600 }}>🔒 256-Bit SSL</span>
          </div>

          <div className="sslGPayBar" onClick={handlePay}>
            <span style={{ fontSize: "14px" }}>G Pay</span> •••• 7443 (Express)
          </div>

          <div className="sslDivider">Or select payment method</div>

          {/* 3 Tabs: Card, Mobile Banking, Net Banking */}
          <div className="sslTabs">
            <button
              type="button"
              className={`sslTabBtn ${tab === "card" ? "active" : ""}`}
              onClick={() => setTab("card")}
            >
              <span className="tabIcon">💳</span>
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={`sslTabBtn ${tab === "mfs" ? "active" : ""}`}
              onClick={() => setTab("mfs")}
            >
              <span className="tabIcon">📱</span>
              <span>Mobile Banking</span>
            </button>
            <button
              type="button"
              className={`sslTabBtn ${tab === "bank" ? "active" : ""}`}
              onClick={() => setTab("bank")}
            >
              <span className="tabIcon">🏛️</span>
              <span>Net Banking</span>
            </button>
          </div>

          {/* Tab 1: Cards */}
          {tab === "card" && (
            <div className="sslCardForm">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#334155" }}>
                  Pay with Credit or Debit Card
                </span>
                <span style={{ fontSize: "10px", color: "#0072f5", fontWeight: 600 }}>
                  VISA / MasterCard / Amex
                </span>
              </div>
              <div>
                <input
                  placeholder="Card Number (e.g. 4242 4242 4242 4242)"
                  value={cardData.num}
                  onChange={(e) => setCardData({ ...cardData, num: e.target.value })}
                  maxLength={19}
                />
              </div>
              <div className="sslCardRow">
                <input
                  placeholder="MM/YY"
                  value={cardData.exp}
                  onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                  maxLength={5}
                />
                <input
                  placeholder="CVC/CVV"
                  type="password"
                  value={cardData.cvc}
                  onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                  maxLength={4}
                />
              </div>
              <input
                placeholder="Card Holder Name"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" defaultChecked /> Remember this Card securely
              </label>
            </div>
          )}

          {/* Tab 2: Mobile Banking */}
          {tab === "mfs" && (
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  color: "#334155",
                }}
              >
                Select your Mobile Wallet:
              </span>
              <div className="sslMfsGrid">
                {mfsList.map((m) => (
                  <div
                    key={m.name}
                    className={`sslMfsItem ${selectedMfs === m.name ? "selected" : ""}`}
                    onClick={() => setSelectedMfs(m.name)}
                  >
                    <div className={`sslMfsIcon ${m.cls}`}>{m.badge}</div>
                    <span>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Net Banking */}
          {tab === "bank" && (
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "8px",
                  color: "#334155",
                }}
              >
                Select your Bank for Internet Banking:
              </span>
              <div className="sslMfsGrid">
                {bankList.map((b) => (
                  <div
                    key={b.name}
                    className={`sslMfsItem ${selectedBank === b.name ? "selected" : ""}`}
                    onClick={() => setSelectedBank(b.name)}
                  >
                    <div className="sslMfsIcon mfs-bank">{b.code}</div>
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            className="sslPayBtn"
            onClick={handlePay}
            disabled={busy}
          >
            {busy ? "Processing Secure Payment..." : `Pay ৳${totalBDT.toLocaleString()}.00`}
          </button>

          <p className="sslTerms">
            By clicking "Pay", you authorize payment to ShopMate Store via SSLCommerz encrypted gateway.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   CHECKOUT PAGE COMPONENT
   ======================================================== */
export default function Checkout({
  cart,
  onClear,
  notify,
}: {
  cart: CartItem[];
  onClear: () => void;
  notify?: (msg: string) => void;
}) {
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

  const [paymentMethod, setPaymentMethod] = useState<
    "Cash on Delivery" | "bKash" | "Nagad" | "SSLCommerz" | "Stripe Card"
  >("SSLCommerz");
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSSLModal, setShowSSLModal] = useState(false);

  // Complete order after SSLCommerz modal verification
  const handleSSLSuccess = async (details: { method: string; trxId: string }) => {
    setShowSSLModal(false);
    setBusy(true);

    const orderId = "SM-" + Date.now().toString().slice(-8);
    const order: Order = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      total,
      status: "Confirmed",
      customer: form,
      payment: "SSLCommerz",
      paymentDetails: {
        method: details.method,
        transactionId: details.trxId,
        paymentStatus: "Paid",
      },
    };

    await createOrderOnServer(order);
    const existingOrders = JSON.parse(localStorage.getItem("shopmate_orders") || "[]");
    saveOrders([order, ...existingOrders]);
    onClear();
    setBusy(false);
    if (notify) notify("🎉 SSLCOMMERZ Payment Successful! Order placed.");
    navigate(`/order-success/${order.id}`);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;
    setErrorMsg("");

    // If SSLCommerz is selected, popup the interactive modal!
    if (paymentMethod === "SSLCommerz") {
      setShowSSLModal(true);
      return;
    }

    setBusy(true);
    const orderId = "SM-" + Date.now().toString().slice(-8);
    let paymentStatus: "Paid" | "Pending Verification" | "Unpaid" = "Unpaid";
    let finalTrxId = trxId;

    if (paymentMethod === "Cash on Delivery") {
      paymentStatus = "Unpaid";
      finalTrxId = "COD-" + Date.now().toString().slice(-6);
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

    if (notify) {
      if (paymentMethod === "Cash on Delivery") {
        notify("🚚 Order placed! Pay with Cash on Delivery.");
      } else {
        notify("🎉 Order placed successfully!");
      }
    }
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
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* SSLCommerz Modal Popup */}
        {showSSLModal && (
          <SSLCommerzModal
            totalBDT={totalBDT}
            totalUSD={total}
            onSuccess={handleSSLSuccess}
            onClose={() => setShowSSLModal(false)}
          />
        )}

        <form className="checkout-grid" onSubmit={submit}>
          <section className="checkout-form">
            {/* Shipping Information */}
            <div className="card checkout-card">
              <h2>
                <MapPin /> Shipping Information
              </h2>
              <div className="form-grid">
                <label>
                  Full Name
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Phone
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+880 1XXXXXXXXX"
                  />
                </label>
                <label>
                  City
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </label>
                <label className="full">
                  Address
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Street, house number, area"
                  />
                </label>
                <label>
                  Country
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  >
                    <option>Bangladesh</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                  </select>
                </label>
                <label>
                  Postal Code
                  <input
                    required
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    placeholder="1212"
                  />
                </label>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="card checkout-card">
              <h2>
                <WalletCards /> Payment Method
              </h2>
              <div className="payment-options">
                {/* SSLCommerz */}
                <label
                  className={paymentMethod === "SSLCommerz" ? "pay-option active" : "pay-option"}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "SSLCommerz"}
                    onChange={() => setPaymentMethod("SSLCommerz")}
                  />
                  <span>
                    <b style={{ color: "#0066b2" }}>💳 SSLCommerz Easy Checkout Gateway</b>
                    <small>Cards, Internet Banking, Rocket, Upay & Mobile Wallets</small>
                  </span>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={paymentMethod === "Cash on Delivery" ? "pay-option active" : "pay-option"}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => setPaymentMethod("Cash on Delivery")}
                  />
                  <Truck size={24} style={{ color: "#059669", marginRight: "6px" }} />
                  <span>
                    <b style={{ color: "#059669" }}>Cash on Delivery</b>
                    <small>Pay in cash when order arrives at your doorstep</small>
                  </span>
                </label>

                {/* bKash */}
                <label
                  className={paymentMethod === "bKash" ? "pay-option active" : "pay-option"}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bKash"}
                    onChange={() => setPaymentMethod("bKash")}
                  />
                  <span>
                    <b style={{ color: "#e2136e" }}>📱 bKash (বিকাশ ম্যানুয়াল পেমেন্ট)</b>
                    <small>Pay instantly via bKash Personal/Merchant Account</small>
                  </span>
                </label>

                {/* Nagad */}
                <label
                  className={paymentMethod === "Nagad" ? "pay-option active" : "pay-option"}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Nagad"}
                    onChange={() => setPaymentMethod("Nagad")}
                  />
                  <span>
                    <b style={{ color: "#f7941d" }}>📲 Nagad (নগদ ম্যানুয়াল পেমেন্ট)</b>
                    <small>Pay instantly via Nagad Send Money / Payment</small>
                  </span>
                </label>

                {/* Stripe Card */}
                <label
                  className={paymentMethod === "Stripe Card" ? "pay-option active" : "pay-option"}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Stripe Card"}
                    onChange={() => setPaymentMethod("Stripe Card")}
                  />
                  <span>
                    <b>🌐 International Card (Stripe)</b>
                    <small>Visa, Mastercard, American Express</small>
                  </span>
                </label>
              </div>

              {/* SSLCommerz Info Box */}
              {paymentMethod === "SSLCommerz" && (
                <div
                  className="notice"
                  style={{
                    background: "#eff6ff",
                    color: "#1e40af",
                    borderColor: "#bfdbfe",
                    padding: "14px",
                    borderRadius: "8px",
                  }}
                >
                  <ShieldCheck size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <b style={{ display: "block", marginBottom: "4px" }}>
                      💳 SSLCOMMERZ Easy Checkout Gateway:
                    </b>
                    <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.6" }}>
                      অর্ডার বাটনে ক্লিক করার পর সরাসরি <b>SSLCOMMERZ পপআপ গেটওয়ে</b> ওপেন হবে। আপনি{" "}
                      <b>Visa, Mastercard, bKash, Nagad, Rocket, CellFin</b> অথবা যেকোনো ব্যাংক কার্ড দিয়ে সিকিউর পেমেন্ট সম্পন্ন করতে পারবেন।
                    </p>
                  </div>
                </div>
              )}

              {/* Cash on Delivery Instructions Box */}
              {paymentMethod === "Cash on Delivery" && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <Truck size={28} style={{ color: "#059669", flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: "#065f46", fontSize: "13px", margin: "0 0 4px" }}>
                      Cash on Delivery (ক্যাশ অন ডেলিভারি):
                    </h4>
                    <p style={{ fontSize: "12px", color: "#047857", margin: 0, lineHeight: "1.6" }}>
                      পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে <b>৳{totalBDT.toLocaleString()} BDT</b> ক্যাশ টাকা পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                    </p>
                  </div>
                </div>
              )}

              {/* bKash Instructions Box */}
              {paymentMethod === "bKash" && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    background: "#fdf2f8",
                    border: "1px solid #fbcfe8",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ color: "#be185d", fontSize: "13px", marginBottom: "8px" }}>
                    bKash পেমেন্ট নির্দেশাবলী:
                  </h4>
                  <ol style={{ fontSize: "11px", color: "#4b5563", paddingLeft: "18px", lineHeight: "1.7" }}>
                    <li>আপনার bKash App ওপেন করুন অথবা <b>*247#</b> ডায়াল করুন।</li>
                    <li><b>Send Money</b> অথবা <b>Payment</b> সিলেক্ট করুন।</li>
                    <li>
                      আমাদের বিকাশ নম্বর দিন: <b style={{ color: "#be185d", fontSize: "12px" }}>01614703406</b>
                    </li>
                    <li>
                      মোট টাকার পরিমাণ দিন: <b>৳{totalBDT.toLocaleString()} BDT</b> (${total.toFixed(2)})
                    </li>
                    <li>রেফারেন্স হিসেবে আপনার নাম লিখুন এবং পিন দিয়ে সম্পন্ন করুন।</li>
                    <li>মেসেজে প্রাপ্ত <b>TrxID (Transaction ID)</b> নিচে লিখে অর্ডার কনফার্ম করুন।</li>
                  </ol>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      আপনার bKash নম্বর
                      <input
                        required
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                      />
                    </label>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      Transaction ID (TrxID)
                      <input
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. BL9A8BC76D"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Nagad Instructions Box */}
              {paymentMethod === "Nagad" && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ color: "#c2410c", fontSize: "13px", marginBottom: "8px" }}>
                    Nagad পেমেন্ট নির্দেশাবলী:
                  </h4>
                  <ol style={{ fontSize: "11px", color: "#4b5563", paddingLeft: "18px", lineHeight: "1.7" }}>
                    <li>আপনার Nagad App অথবা <b>*167#</b> ডায়াল করুন।</li>
                    <li><b>Send Money</b> অথবা <b>Merchant Pay</b> সিলেক্ট করুন।</li>
                    <li>
                      আমাদের নগদ নম্বর দিন: <b style={{ color: "#c2410c", fontSize: "12px" }}>01614703406</b>
                    </li>
                    <li>
                      মোট টাকার পরিমাণ দিন: <b>৳{totalBDT.toLocaleString()} BDT</b>
                    </li>
                    <li>লেনদেন সম্পন্ন করার পর প্রাপ্ত <b>TrxID</b> নিচে লিখুন।</li>
                  </ol>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      আপনার Nagad নম্বর
                      <input
                        required
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="018XXXXXXXX"
                      />
                    </label>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      Transaction ID (TrxID)
                      <input
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. 7N8B9C01"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Stripe Card Box */}
              {paymentMethod === "Stripe Card" && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ fontSize: "13px", marginBottom: "10px" }}>
                    <CreditCard size={15} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Card Details
                  </h4>
                  <label style={{ fontSize: "11px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                    Card Number
                    <input
                      required
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                      placeholder="4242 •••• •••• 4242"
                    />
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      Expiry (MM/YY)
                      <input
                        required
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                        placeholder="12/28"
                      />
                    </label>
                    <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                      CVC / CVV
                      <input
                        required
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                        placeholder="123"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Order Summary Sidebar */}
          <aside className="card summary">
            <h2>Order Summary</h2>
            {cart.map((x) => (
              <div className="mini-item" key={x.id}>
                <img src={x.image} alt="" />
                <span>
                  {x.name}
                  <small>Qty: {x.quantity}</small>
                </span>
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
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                textAlign: "right",
                marginTop: "-6px",
                marginBottom: "15px",
              }}
            >
              Approx: <b>৳{totalBDT.toLocaleString()} BDT</b>
            </div>
            <button className="btn btn-primary checkout-btn" disabled={busy || !cart.length}>
              {busy
                ? "Processing..."
                : paymentMethod === "SSLCommerz"
                ? `Proceed to SSLCOMMERZ (৳${totalBDT.toLocaleString()})`
                : `Confirm Order (${paymentMethod})`}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}