import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  UserRound,
  Moon,
  Sun,
  Menu,
  X,
  Truck,
  ChevronDown,
  Package,
  LogOut,
  Shield
} from "lucide-react";

export default function Header({
  cartCount,
  wishlistCount,
  dark,
  setDark,
  user,
  onLogout,
  onOpenCart,
}: {
  cartCount: number;
  wishlistCount: number;
  dark: boolean;
  setDark: (v: boolean) => void;
  user?: { name: string; email: string; role?: string } | null;
  onLogout?: () => void;
  onOpenCart?: () => void;
}) {
  const [mobile, setMobile] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [q, setQ] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
    } else {
      navigate("/shop");
    }
    setMobile(false);
  };

  const handleAccountToggle = () => {
    if (user) {
      setUserDropdown((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const handleLogoutClick = () => {
    setUserDropdown(false);
    setMobile(false);
    if (onLogout) onLogout();
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

            {/* Mobile View Customer Profile Drawer with Logout */}
            {mobile && (
              <div className="mobile-user-section">
                {user ? (
                  <div className="mobile-profile-card">
                    <div className="mobile-profile-head">
                      <div className="profile-dropdown-avatar">
                        {user.name ? user.name[0]?.toUpperCase() : "U"}
                      </div>
                      <div className="mobile-profile-info">
                        <strong>{user.name || "Customer"}</strong>
                        <small>{user.email || "customer@shopmate.com"}</small>
                        <span className="profile-role-tag">{user.role || "Customer"}</span>
                      </div>
                    </div>
                    <div className="mobile-profile-links">
                      <Link to="/profile" onClick={() => setMobile(false)}>
                        <UserRound size={15} /> My Profile & Details
                      </Link>
                      <Link to="/orders" onClick={() => setMobile(false)}>
                        <Package size={15} /> My Orders & Tracking
                      </Link>
                      <Link to="/shipping" onClick={() => setMobile(false)}>
                        <Truck size={15} /> Shipping & Delivery
                      </Link>
                      <button
                        className="mobile-cart-btn"
                        onClick={() => {
                          setMobile(false);
                          if (onOpenCart) onOpenCart();
                          else navigate("/cart");
                        }}
                      >
                        <ShoppingCart size={15} /> View My Cart ({cartCount})
                      </button>
                      {user.role === "admin" && (
                        <Link to="/admin" onClick={() => setMobile(false)} style={{ color: "#818cf8" }}>
                          <Shield size={15} /> Admin Dashboard
                        </Link>
                      )}
                      <button className="mobile-profile-logout-btn" onClick={handleLogoutClick}>
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{
                      marginTop: "12px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                    onClick={() => {
                      setMobile(false);
                      navigate("/login");
                    }}
                  >
                    <UserRound size={16} /> Sign In / Register
                  </button>
                )}
              </div>
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
            <button
              className="icon-action cart-action-btn"
              onClick={() => {
                if (onOpenCart) onOpenCart();
                else navigate("/cart");
              }}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart />
              <span className="count" style={{ top: "-6px", right: "-6px" }}>{cartCount}</span>
            </button>

            {/* Customer Account & Profile Dropdown Container */}
            <div className="account-dropdown-wrapper" ref={dropdownRef}>
              <button
                className={`icon-action login-btn ${userDropdown ? "dropdown-open" : ""}`}
                onClick={handleAccountToggle}
                title={user ? `Signed in as ${user.name}` : "Account"}
                aria-expanded={userDropdown}
              >
                <UserRound />
                {user ? (
                  <span className="user-btn-label">
                    <em>{(user.name || "User").split(" ")[0]}</em>
                    <ChevronDown size={12} className={`dropdown-chevron ${userDropdown ? "rotate" : ""}`} />
                  </span>
                ) : (
                  <em>Sign In</em>
                )}
              </button>

              {/* Profile Dropdown Menu when user is logged in */}
              {user && userDropdown && (
                <div className="profile-dropdown-menu">
                  {/* Dropdown Header with Avatar & Details */}
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">
                      {user.name ? user.name[0]?.toUpperCase() : "U"}
                    </div>
                    <div className="profile-dropdown-user-info">
                      <strong className="profile-dropdown-name">{user.name || "Customer"}</strong>
                      <span className="profile-dropdown-email">{user.email || "customer@shopmate.com"}</span>
                      <span className="profile-role-tag">{user.role || "Customer"}</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  {/* Profile & Account Navigation Links */}
                  <div className="profile-dropdown-links">
                    <Link
                      to="/profile"
                      className="profile-dropdown-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <UserRound size={16} />
                      <div className="profile-item-text">
                        <b>My Profile</b>
                        <small>Name, contact & delivery address</small>
                      </div>
                    </Link>

                    <Link
                      to="/orders"
                      className="profile-dropdown-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <Package size={16} />
                      <div className="profile-item-text">
                        <b>My Orders</b>
                        <small>Live tracking & order history</small>
                      </div>
                    </Link>

                    <Link
                      to="/shipping"
                      className="profile-dropdown-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <Truck size={16} />
                      <div className="profile-item-text">
                        <b>Shipping Details</b>
                        <small>Delivery timelines & courier info</small>
                      </div>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="profile-dropdown-item admin-dropdown-item"
                        onClick={() => setUserDropdown(false)}
                      >
                        <Shield size={16} />
                        <div className="profile-item-text">
                          <b>Admin Dashboard</b>
                          <small>Store management & live orders</small>
                        </div>
                      </Link>
                    )}
                  </div>

                  <div className="profile-dropdown-divider" />

                  {/* Logout Button */}
                  <div className="profile-dropdown-footer">
                    <button
                      className="profile-dropdown-logout-btn"
                      onClick={handleLogoutClick}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="theme-btn" onClick={() => setDark(!dark)} title="Toggle dark mode">
              {dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
