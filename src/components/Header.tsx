import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, UserRound, Moon, Sun, Menu, X, Truck, ChevronDown, ShieldCheck } from "lucide-react";

export default function Header({
  cartCount,
  wishlistCount,
  dark,
  setDark,
  user,
}: {
  cartCount: number;
  wishlistCount: number;
  dark: boolean;
  setDark: (v: boolean) => void;
  user?: { name: string; email: string; role?: string } | null;
}) {
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
    } else {
      navigate("/shop");
    }
    setMobile(false);
  };

  const handleAccountClick = () => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } else {
      navigate("/login");
    }
    setMobile(false);
  };

  return (
    <>
      <div className="announce">
        <div className="container">
          <span><Truck size={14} /> Free shipping on orders over $50</span>
          <Link to="/offers" style={{ color: "inherit", textDecoration: "none" }}>
            <b>30% Off on All Electronics — Explore Offers!</b>
          </Link>
          <span className="announce-right">EN <ChevronDown size={12} /> &nbsp; USD <ChevronDown size={12} /></span>
        </div>
      </div>
      <header className="header">
        <div className="container nav">
          <Link className="brand" to="/">
            <span className="brand-icon">🛍</span>
            <span>ShopMate</span>
          </Link>
          <button className="mobile-menu" onClick={() => setMobile(!mobile)} aria-label="Menu">
            {mobile ? <X /> : <Menu />}
          </button>
          <nav className={mobile ? "nav-links open" : "nav-links"}>
            {["Home", "Shop", "Categories", "Offers", "About", "Contact"].map((x) => (
              <NavLink
                key={x}
                to={
                  x === "Home"
                    ? "/"
                    : x === "Shop"
                    ? "/shop"
                    : x === "Categories"
                    ? "/categories"
                    : x === "Offers"
                    ? "/offers"
                    : `/${x.toLowerCase()}`
                }
                onClick={() => setMobile(false)}
              >
                {x}
              </NavLink>
            ))}
            {mobile && (
              <button
                className="btn btn-soft"
                style={{ marginTop: "10px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                onClick={handleAccountClick}
              >
                <UserRound size={16} />
                {user ? `Account (${user.name})` : "Account"}
              </button>
            )}
          </nav>
          <form className="search" onSubmit={search}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products..."
            />
            <button aria-label="Search"><Search size={19} /></button>
          </form>
          <div className="nav-actions">
            <button className="icon-action" onClick={() => navigate("/wishlist")} title="Wishlist" aria-label="Wishlist">
              <Heart />
              <span className="count" style={{ top: "-6px", right: "-6px" }}>{wishlistCount}</span>
            </button>
            <button className="icon-action" onClick={() => navigate("/cart")} title="Cart" aria-label="Cart">
              <ShoppingCart />
              <span className="count" style={{ top: "-6px", right: "-6px" }}>{cartCount}</span>
            </button>
            <button
              className="icon-action login-btn"
              onClick={handleAccountClick}
              title={user ? `Signed in as ${user.name}` : "Account"}
            >
              <UserRound />
              {user && <em>{user.name.split(" ")[0]}</em>}
            </button>
            {user?.role === "admin" && (
              <a
                href="https://shopmate-admin-panel.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#fff",
                }}
                title="Open ShopMate Central Admin Control Panel"
              >
                <ShieldCheck size={14} /> Admin Hub ↗
              </a>
            )}
            <button className="theme-btn" onClick={() => setDark(!dark)} title="Toggle dark mode">
              {dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}