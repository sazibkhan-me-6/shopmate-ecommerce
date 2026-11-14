import { useState } from "react";
import { LockKeyhole, Mail, UserRound, Phone, MapPin, Building, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { saveUser, registerUser, loginUser } from "../services/storage";

export default function Login({
  onLogin,
  notify,
}: {
  onLogin: (u: { name: string; email: string; role?: string }) => void;
  notify?: (msg: string) => void;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const nav = useNavigate();

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Sign Up Form State (Full Information Required)
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!loginEmail.trim() || !loginPass.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    const res = loginUser(loginEmail, loginPass);
    if (!res.success || !res.user) {
      setErrorMsg(res.message);
      return;
    }

    // Login successful
    saveUser(res.user);
    onLogin(res.user);
    if (notify) notify(`👋 Welcome back, ${res.user.name}!`);
    nav(res.user.role === "admin" ? "/admin" : "/account");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const { name, email, phone, address, city, password, confirmPassword } = signUpForm;

    // Strict Validation: Full Information Required
    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg("Please enter a valid phone number (e.g. +880 1XXXXXXXXX).");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please enter your full delivery address.");
      return;
    }
    if (!city.trim()) {
      setErrorMsg("Please select or enter your city / district.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match! Please check and confirm your password.");
      return;
    }

    // Attempt Registration
    const res = registerUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      password,
      role: email.trim().toLowerCase() === "admin@shopmate.com" ? "admin" : "customer",
    });

    if (!res.success || !res.user) {
      setErrorMsg(res.message);
      return;
    }

    // Registration succeeded - save session & notify
    saveUser(res.user);
    onLogin(res.user);
    if (notify) notify(`🎉 Account created successfully! Welcome to ShopMate, ${res.user.name}.`);
    nav("/account");
  };

  return (
    <main className="page auth-page">
      <div className="auth-card card" style={{ maxWidth: isSignUp ? "520px" : "440px", transition: "max-width 0.25s ease" }}>
        <div className="auth-logo">🛍</div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#f1f5f9",
            borderRadius: "8px",
            padding: "4px",
            marginBottom: "20px",
            gap: "4px",
          }}
        >
          <button
            type="button"
            className="btn"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            style={{
              padding: "9px 14px",
              fontSize: "12px",
              fontWeight: 700,
              borderRadius: "6px",
              background: !isSignUp ? "#fff" : "transparent",
              color: !isSignUp ? "#6246e8" : "#64748b",
              boxShadow: !isSignUp ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            style={{
              padding: "9px 14px",
              fontSize: "12px",
              fontWeight: 700,
              borderRadius: "6px",
              background: isSignUp ? "#fff" : "transparent",
              color: isSignUp ? "#6246e8" : "#64748b",
              boxShadow: isSignUp ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Sign Up (Full Details)
          </button>
        </div>

        <span className="eyebrow">{isSignUp ? "CREATE NEW ACCOUNT" : "WELCOME BACK"}</span>
        <h1>{isSignUp ? "Register on ShopMate" : "Sign In to ShopMate"}</h1>
        <p className="muted" style={{ fontSize: "12px", marginBottom: "18px" }}>
          {isSignUp
            ? "Fill in your complete profile details to create a verified shopper account."
            : "Sign in with your registered email and password to access your account."}
        </p>

        {/* Error Notification Banner */}
        {errorMsg && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "12px 14px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "12px",
              fontWeight: 600,
              textAlign: "left",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              lineHeight: "1.5",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
            <div>
              <span>{errorMsg}</span>
              {!isSignUp && errorMsg.includes("Sign Up") && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg("");
                  }}
                  style={{
                    display: "block",
                    background: "none",
                    border: 0,
                    color: "#6246e8",
                    fontWeight: 800,
                    cursor: "pointer",
                    padding: "4px 0 0",
                    fontSize: "12px",
                    textDecoration: "underline",
                  }}
                >
                  Click here to Sign Up with Full Information →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Success Notification Banner */}
        {successMsg && (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#047857",
              padding: "12px 14px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "12px",
              fontWeight: 600,
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================
            FORM 1: SIGN IN
            ======================================================== */}
        {!isSignUp ? (
          <form onSubmit={handleSignIn}>
            <label>
              <Mail size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Email Address
              <input
                required
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              <LockKeyhole size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Password
              <div style={{ position: "relative" }}>
                <input
                  required
                  type={showPass ? "text" : "password"}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Enter your password"
                  style={{ paddingRight: "36px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: 0,
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button type="submit" className="btn btn-primary auth-submit">
              Sign In to Account
            </button>
          </form>
        ) : (
          /* ========================================================
             FORM 2: SIGN UP (FULL INFORMATION REQUIRED)
             ======================================================== */
          <form onSubmit={handleSignUp}>
            <label>
              <UserRound size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Full Name
              <input
                required
                value={signUpForm.name}
                onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                placeholder="e.g. Sazib Khan"
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label>
                <Mail size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Email Address
                <input
                  required
                  type="email"
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </label>

              <label>
                <Phone size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Phone Number
                <input
                  required
                  value={signUpForm.phone}
                  onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                  placeholder="+880 1XXXXXXXXX"
                />
              </label>
            </div>

            <label>
              <MapPin size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Full Delivery Address
              <input
                required
                value={signUpForm.address}
                onChange={(e) => setSignUpForm({ ...signUpForm, address: e.target.value })}
                placeholder="House, Road, Area (e.g. Banani, Block C)"
              />
            </label>

            <label>
              <Building size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> City / District
              <select
                value={signUpForm.city}
                onChange={(e) => setSignUpForm({ ...signUpForm, city: e.target.value })}
                style={{
                  width: "100%",
                  height: "35px",
                  borderRadius: "6px",
                  border: "1px solid #dfe3ea",
                  padding: "0 9px",
                  marginTop: "6px",
                  fontSize: "11px",
                  background: "#fff",
                }}
              >
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Sylhet</option>
                <option>Rajshahi</option>
                <option>Khulna</option>
                <option>Barisal</option>
                <option>Rangpur</option>
                <option>Mymensingh</option>
                <option>Comilla</option>
                <option>Gazipur</option>
                <option>Narayanganj</option>
                <option>Other District</option>
              </select>
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label>
                <LockKeyhole size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Password (min 6)
                <input
                  required
                  type="password"
                  minLength={6}
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                  placeholder="••••••••"
                />
              </label>

              <label>
                <CheckCircle2 size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Confirm Password
                <input
                  required
                  type="password"
                  minLength={6}
                  value={signUpForm.confirmPassword}
                  onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" style={{ marginTop: "14px" }}>
              Complete Sign Up & Continue
            </button>
          </form>
        )}

        <button
          type="button"
          className="switch-auth"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMsg("");
            setSuccessMsg("");
          }}
        >
          {isSignUp
            ? "Already have an account? Sign in here"
            : "Don't have an account? Sign up with full details"}
        </button>

        {!isSignUp && (
          <p className="demo-hint" style={{ marginTop: "16px" }}>
            Admin Access: <b>admin@shopmate.com</b> / <b>admin123</b>
          </p>
        )}

        <Link to="/" className="back" style={{ marginTop: "18px" }}>
          ← Back to ShopMate Store
        </Link>
      </div>
    </main>
  );
}
