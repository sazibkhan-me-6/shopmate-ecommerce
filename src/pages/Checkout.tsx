import {
  CheckCircle2,
  CreditCard,
  MapPin,
  ShieldCheck,
  Smartphone,
  WalletCards,
  Truck,
  Sparkles,
  LogIn,
  Lock,
  Copy,
  Check,
  Globe,
  UserRound,
  Mail,
  Phone,
  Building,
  Hash,
  Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CartItem, Order } from "../types";
import {
  getUser,
  saveOrders,
  saveUser,
  getRegisteredUsers,
  saveRegisteredUsers
} from "../services/storage";
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
              <div className="icon-field">
                <span className="icon-field-icon"><CreditCard size={15} /></span>
                <input
                  placeholder=""
                  aria-label="Card Number"
                  value={cardData.num}
                  onChange={(e) => setCardData({ ...cardData, num: e.target.value })}
                  maxLength={19}
                />
              </div>
              <div className="sslCardRow">
                <div className="icon-field">
                  <span className="icon-field-icon"><Calendar size={14} /></span>
                  <input
                    placeholder=""
                    aria-label="Expiry"
                    value={cardData.exp}
                    onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                    maxLength={5}
                  />
                </div>
                <div className="icon-field">
                  <span className="icon-field-icon"><Lock size={14} /></span>
                  <input
                    placeholder=""
                    aria-label="CVC"
                    type="password"
                    value={cardData.cvc}
                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="icon-field">
                <span className="icon-field-icon"><UserRound size={15} /></span>
                <input
                  placeholder=""
                  aria-label="Card Holder Name"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                />
              </div>
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

  const loggedInUser: any = getUser();
  const [saveToAccount, setSaveToAccount] = useState(true);

  const [form, setForm] = useState(() => {
    const u: any = getUser();
    return {
      name: u?.name || "",
      email: u?.email || "",
      phone: u?.phone || "",
      address: u?.address || "",
      city: u?.city || "Dhaka",
      country: "Bangladesh",
      postalCode: u?.postalCode || "1212",
    };
  });

  // Automatically pre-fill shipping information from user account registration/profile
  useEffect(() => {
    const u: any = getUser();
    if (u) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || u.name || "",
        email: prev.email || u.email || "",
        phone: prev.phone || u.phone || "",
        address: prev.address || u.address || "",
        city: prev.city && prev.city !== "Dhaka" ? prev.city : (u.city || "Dhaka"),
        postalCode: prev.postalCode || u.postalCode || "1212",
      }));
    }
  }, []);

  // Sync any updated contact/delivery details back to the user account profile
  const syncAccountInfo = () => {
    const u: any = getUser();
    if (u && saveToAccount) {
      const updatedUser = {
        ...u,
        name: form.name || u.name,
        email: u.email,
        phone: form.phone || u.phone,
        address: form.address || u.address,
        city: form.city || u.city,
        postalCode: form.postalCode || u.postalCode,
      };
      saveUser(updatedUser);

      try {
        const users = getRegisteredUsers();
        const idx = users.findIndex((user) => user.email.toLowerCase() === u.email.toLowerCase());
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updatedUser };
          saveRegisteredUsers(users);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [paymentMethod, setPaymentMethod] = useState<
    "Cash on Delivery" | "bKash" | "Nagad" | "SSLCommerz" | "Stripe Card"
  >("SSLCommerz");
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSSLModal, setShowSSLModal] = useState(false);
  const [copiedNum, setCopiedNum] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard?.writeText("01614703406");
    setCopiedNum(true);
    setTimeout(() => setCopiedNum(false), 2000);
  };

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
    syncAccountInfo();
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
    syncAccountInfo();
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

  if (!cart.length) {
    return (
      <main className="page">
        <div className="container" style={{ maxWidth: "600px", textAlign: "center", padding: "60px 20px" }}>
          <div className="card empty" style={{ padding: "40px 20px" }}>
            <div className="empty-icon" style={{ fontSize: "50px" }}>🛒</div>
            <h2>Your Cart is Empty</h2>
            <p style={{ color: "#64748b", margin: "10px auto 25px", maxWidth: "380px" }}>
              There are no items in your cart to checkout. Please add products to your cart before proceeding!
            </p>
            <Link className="btn btn-primary" to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Browse Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

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

              {loggedInUser ? (
                <div className="checkout-autofill-alert">
                  <div className="autofill-badge">
                    <Sparkles size={16} /> Auto-filled from your Account ({loggedInUser.name})
                  </div>
                  <p>
                    Your registered phone, delivery address, and city have been automatically loaded.
                    You can edit any field below or complete your order directly!
                  </p>
                </div>
              ) : (
                <div className="checkout-guest-alert">
                  <span>Already have a ShopMate account?</span>
                  <Link to="/login" className="link-purple" style={{ textDecoration: "underline" }}>
                    Sign In to auto-fill your delivery info
                  </Link>
                </div>
              )}

              <div className="form-grid">
                <label>
                  Full Name
                  <div className="icon-field" style={{ marginTop: "6px" }}>
                    <span className="icon-field-icon"><UserRound size={15} /></span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder=""
                      style={{ marginTop: 0 }}
                    />
                  </div>
                </label>
                <label>
                  Email
                  <div className="icon-field" style={{ marginTop: "6px" }}>
                    <span className="icon-field-icon"><Mail size={15} /></span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder=""
                      style={{ marginTop: 0 }}
                    />
                  </div>
                </label>
                <label>
                  Phone
                  <div className="icon-field" style={{ marginTop: "6px" }}>
                    <span className="icon-field-icon"><Phone size={15} /></span>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder=""
                      style={{ marginTop: 0 }}
                    />
                  </div>
                </label>
                <label>
                  City
                  <div className="icon-field" style={{ marginTop: "6px" }}>
                    <span className="icon-field-icon"><Building size={15} /></span>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder=""
                      style={{ marginTop: 0 }}
                    />
                  </div>
                </label>
                <label className="full">
                  Delivery Address
                  <div className="icon-field" style={{ marginTop: "6px" }}>
                    <span className="icon-field-icon"><MapPin size={15} /></span>
                    <input
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder=""
                      style={{ marginTop: 0 }}
                    />
                  </div>
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
                  <div className="icon-field" style={{ marginTop: "6px" }}>
                    <span className="icon-field-icon"><Hash size={15} /></span>
                    <input
                      required
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder=""
                      style={{ marginTop: 0 }}
                    />
                  </div>
                </label>

                {loggedInUser && (
                  <label className="full auto-save-checkbox">
                    <input
                      type="checkbox"
                      checked={saveToAccount}
                      onChange={(e) => setSaveToAccount(e.target.checked)}
                    />
                    <span>Save updated address & phone to my account profile for future orders</span>
                  </label>
                )}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="card checkout-card pay-section-card">
              <div className="pay-section-head">
                <div className="pay-section-title-group">
                  <div className="pay-section-icon-badge">
                    <WalletCards size={18} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0 }}>Payment Method</h2>
                    <p className="pay-section-sub">Choose your preferred secure payment option</p>
                  </div>
                </div>
                <span className="pay-secure-pill">
                  <Lock size={11} /> 100% Secure
                </span>
              </div>

              <div className="pay-card-list">
                {/* SSLCommerz */}
                <label
                  className={`pay-card pay-card-ssl ${paymentMethod === "SSLCommerz" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="pay-radio-hidden"
                    checked={paymentMethod === "SSLCommerz"}
                    onChange={() => setPaymentMethod("SSLCommerz")}
                  />
                  <span className="pay-custom-radio" aria-hidden="true">
                    <span className="pay-custom-radio-dot" />
                  </span>
                  <div className="pay-brand-tile tile-ssl">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="pay-card-body">
                    <div className="pay-card-title-row">
                      <strong>SSLCommerz Easy Checkout</strong>
                      <span className="pay-tag tag-recommended">Recommended</span>
                    </div>
                    <span className="pay-card-desc">
                      Cards, Internet Banking, Rocket, Upay & Mobile Wallets
                    </span>
                  </div>
                  <div className="pay-mini-badges">
                    <span>VISA</span>
                    <span>MC</span>
                    <span>MFS</span>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`pay-card pay-card-cod ${paymentMethod === "Cash on Delivery" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="pay-radio-hidden"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => setPaymentMethod("Cash on Delivery")}
                  />
                  <span className="pay-custom-radio" aria-hidden="true">
                    <span className="pay-custom-radio-dot" />
                  </span>
                  <div className="pay-brand-tile tile-cod">
                    <Truck size={20} />
                  </div>
                  <div className="pay-card-body">
                    <div className="pay-card-title-row">
                      <strong>Cash on Delivery</strong>
                      <span className="pay-tag tag-cod">No Advance</span>
                    </div>
                    <span className="pay-card-desc">
                      Pay in cash when your order arrives at your doorstep
                    </span>
                  </div>
                  <div className="pay-mini-badges">
                    <span>৳ CASH</span>
                  </div>
                </label>

                {/* bKash */}
                <label
                  className={`pay-card pay-card-bkash ${paymentMethod === "bKash" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="pay-radio-hidden"
                    checked={paymentMethod === "bKash"}
                    onChange={() => setPaymentMethod("bKash")}
                  />
                  <span className="pay-custom-radio" aria-hidden="true">
                    <span className="pay-custom-radio-dot" />
                  </span>
                  <div className="pay-brand-tile tile-bkash">
                    <span className="pay-tile-text">bKash</span>
                  </div>
                  <div className="pay-card-body">
                    <div className="pay-card-title-row">
                      <strong>bKash (বিকাশ ম্যানুয়াল পেমেন্ট)</strong>
                      <span className="pay-tag tag-bkash">Instant</span>
                    </div>
                    <span className="pay-card-desc">
                      Pay instantly via bKash Personal / Merchant Account
                    </span>
                  </div>
                  <div className="pay-mini-badges">
                    <span style={{ color: "#e2136e", borderColor: "#fbcfe8" }}>*247#</span>
                  </div>
                </label>

                {/* Nagad */}
                <label
                  className={`pay-card pay-card-nagad ${paymentMethod === "Nagad" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="pay-radio-hidden"
                    checked={paymentMethod === "Nagad"}
                    onChange={() => setPaymentMethod("Nagad")}
                  />
                  <span className="pay-custom-radio" aria-hidden="true">
                    <span className="pay-custom-radio-dot" />
                  </span>
                  <div className="pay-brand-tile tile-nagad">
                    <span className="pay-tile-text">নগদ</span>
                  </div>
                  <div className="pay-card-body">
                    <div className="pay-card-title-row">
                      <strong>Nagad (নগদ ম্যানুয়াল পেমেন্ট)</strong>
                      <span className="pay-tag tag-nagad">Fast Pay</span>
                    </div>
                    <span className="pay-card-desc">
                      Pay instantly via Nagad Send Money / Merchant Pay
                    </span>
                  </div>
                  <div className="pay-mini-badges">
                    <span style={{ color: "#ea580c", borderColor: "#fed7aa" }}>*167#</span>
                  </div>
                </label>

                {/* Stripe Card */}
                <label
                  className={`pay-card pay-card-stripe ${paymentMethod === "Stripe Card" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="pay-radio-hidden"
                    checked={paymentMethod === "Stripe Card"}
                    onChange={() => setPaymentMethod("Stripe Card")}
                  />
                  <span className="pay-custom-radio" aria-hidden="true">
                    <span className="pay-custom-radio-dot" />
                  </span>
                  <div className="pay-brand-tile tile-stripe">
                    <Globe size={20} />
                  </div>
                  <div className="pay-card-body">
                    <div className="pay-card-title-row">
                      <strong>International Card (Stripe)</strong>
                      <span className="pay-tag tag-stripe">Global</span>
                    </div>
                    <span className="pay-card-desc">
                      Visa, Mastercard, American Express Credit & Debit Cards
                    </span>
                  </div>
                  <div className="pay-mini-badges">
                    <span>VISA</span>
                    <span>AMEX</span>
                  </div>
                </label>
              </div>

              {/* SSLCommerz Info Box */}
              {paymentMethod === "SSLCommerz" && (
                <div className="pay-detail-panel panel-ssl">
                  <div className="pay-detail-head">
                    <ShieldCheck size={20} />
                    <strong>SSLCOMMERZ Easy Checkout Gateway</strong>
                  </div>
                  <p className="pay-detail-text">
                    অর্ডার বাটনে ক্লিক করার পর সরাসরি <b>SSLCOMMERZ পপআপ গেটওয়ে</b> ওপেন হবে। আপনি{" "}
                    <b>Visa, Mastercard, bKash, Nagad, Rocket, CellFin</b> অথবা যেকোনো ব্যাংক কার্ড দিয়ে ১০০% সিকিউর পেমেন্ট সম্পন্ন করতে পারবেন।
                  </p>
                  <div className="pay-gateway-chips">
                    <span>Visa</span>
                    <span>Mastercard</span>
                    <span>bKash</span>
                    <span>Nagad</span>
                    <span>Rocket</span>
                    <span>CellFin</span>
                    <span>Net Banking</span>
                  </div>
                </div>
              )}

              {/* Cash on Delivery Instructions Box */}
              {paymentMethod === "Cash on Delivery" && (
                <div className="pay-detail-panel panel-cod">
                  <div className="pay-detail-head">
                    <Truck size={20} />
                    <strong>Cash on Delivery (ক্যাশ অন ডেলিভারি)</strong>
                  </div>
                  <p className="pay-detail-text">
                    পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে{" "}
                    <span className="pay-amount-pill pill-cod">৳{totalBDT.toLocaleString()} BDT</span>{" "}
                    ক্যাশ টাকা পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                  </p>
                </div>
              )}

              {/* bKash Instructions Box */}
              {paymentMethod === "bKash" && (
                <div className="pay-detail-panel panel-bkash">
                  <div className="pay-detail-head">
                    <Smartphone size={18} />
                    <strong>bKash পেমেন্ট নির্দেশাবলী</strong>
                    <span className="pay-amount-pill pill-bkash">
                      ৳{totalBDT.toLocaleString()} BDT
                    </span>
                  </div>
                  <div className="pay-number-bar bar-bkash">
                    <div>
                      <small>আমাদের bKash Personal / Merchant নম্বর</small>
                      <b>01614703406</b>
                    </div>
                    <button
                      type="button"
                      className="pay-copy-btn"
                      onClick={handleCopyNumber}
                    >
                      {copiedNum ? <Check size={13} /> : <Copy size={13} />}
                      {copiedNum ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <ol className="pay-steps-list">
                    <li>আপনার bKash App ওপেন করুন অথবা <b>*247#</b> ডায়াল করুন।</li>
                    <li><b>Send Money</b> অথবা <b>Payment</b> সিলেক্ট করে উপরের নম্বরে <b>৳{totalBDT.toLocaleString()}</b> (${total.toFixed(2)}) পাঠান।</li>
                    <li>মেসেজে প্রাপ্ত <b>TrxID (Transaction ID)</b> নিচে লিখে অর্ডার কনফার্ম করুন।</li>
                  </ol>
                  <div className="pay-inputs-grid">
                    <label>
                      আপনার bKash নম্বর
                      <div className="icon-field" style={{ marginTop: "6px" }}>
                        <span className="icon-field-icon"><Phone size={14} /></span>
                        <input
                          required
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder=""
                          style={{ marginTop: 0 }}
                        />
                      </div>
                    </label>
                    <label>
                      Transaction ID (TrxID)
                      <div className="icon-field" style={{ marginTop: "6px" }}>
                        <span className="icon-field-icon"><Hash size={14} /></span>
                        <input
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder=""
                          style={{ marginTop: 0 }}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Nagad Instructions Box */}
              {paymentMethod === "Nagad" && (
                <div className="pay-detail-panel panel-nagad">
                  <div className="pay-detail-head">
                    <Smartphone size={18} />
                    <strong>Nagad পেমেন্ট নির্দেশাবলী</strong>
                    <span className="pay-amount-pill pill-nagad">
                      ৳{totalBDT.toLocaleString()} BDT
                    </span>
                  </div>
                  <div className="pay-number-bar bar-nagad">
                    <div>
                      <small>আমাদের Nagad Personal / Merchant নম্বর</small>
                      <b>01614703406</b>
                    </div>
                    <button
                      type="button"
                      className="pay-copy-btn"
                      onClick={handleCopyNumber}
                    >
                      {copiedNum ? <Check size={13} /> : <Copy size={13} />}
                      {copiedNum ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <ol className="pay-steps-list">
                    <li>আপনার Nagad App ওপেন করুন অথবা <b>*167#</b> ডায়াল করুন।</li>
                    <li><b>Send Money</b> অথবা <b>Merchant Pay</b> সিলেক্ট করে উপরের নম্বরে <b>৳{totalBDT.toLocaleString()}</b> পাঠান।</li>
                    <li>লেনদেন সম্পন্ন করার পর প্রাপ্ত <b>TrxID</b> নিচে লিখে অর্ডার কনফার্ম করুন।</li>
                  </ol>
                  <div className="pay-inputs-grid">
                    <label>
                      আপনার Nagad নম্বর
                      <div className="icon-field" style={{ marginTop: "6px" }}>
                        <span className="icon-field-icon"><Phone size={14} /></span>
                        <input
                          required
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder=""
                          style={{ marginTop: 0 }}
                        />
                      </div>
                    </label>
                    <label>
                      Transaction ID (TrxID)
                      <div className="icon-field" style={{ marginTop: "6px" }}>
                        <span className="icon-field-icon"><Hash size={14} /></span>
                        <input
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder=""
                          style={{ marginTop: 0 }}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Stripe Card Box */}
              {paymentMethod === "Stripe Card" && (
                <div className="pay-detail-panel panel-stripe">
                  <div className="pay-detail-head">
                    <CreditCard size={18} />
                    <strong>International Card Details</strong>
                    <span className="pay-amount-pill pill-stripe">${total.toFixed(2)} USD</span>
                  </div>
                  <label className="pay-full-input-label">
                    Card Number
                    <div className="icon-field" style={{ marginTop: "6px" }}>
                      <span className="icon-field-icon"><CreditCard size={14} /></span>
                      <input
                        required
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value })}
                        placeholder=""
                        style={{ marginTop: 0 }}
                      />
                    </div>
                  </label>
                  <div className="pay-inputs-grid">
                    <label>
                      Expiry (MM/YY)
                      <div className="icon-field" style={{ marginTop: "6px" }}>
                        <span className="icon-field-icon"><Calendar size={14} /></span>
                        <input
                          required
                          value={card.expiry}
                          onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                          placeholder=""
                          style={{ marginTop: 0 }}
                        />
                      </div>
                    </label>
                    <label>
                      CVC / CVV
                      <div className="icon-field" style={{ marginTop: "6px" }}>
                        <span className="icon-field-icon"><Lock size={14} /></span>
                        <input
                          required
                          value={card.cvc}
                          onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                          placeholder=""
                          style={{ marginTop: 0 }}
                        />
                      </div>
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