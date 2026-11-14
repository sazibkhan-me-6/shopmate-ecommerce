import { Home, ShoppingBag, Heart, ShoppingCart, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNav({
  cartCount,
  wishlistCount,
  user,
}: {
  cartCount: number;
  wishlistCount: number;
  user?: { name: string; email: string; role?: string } | null;
}) {
  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <ShoppingBag size={20} />
        <span>Shop</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <Heart size={20} />
        {wishlistCount > 0 && <span className="bottom-nav-badge">{wishlistCount}</span>}
        <span>Wishlist</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <ShoppingCart size={20} />
        {cartCount > 0 && <span className="bottom-nav-badge">{cartCount}</span>}
        <span>Cart</span>
      </NavLink>

      <NavLink
        to={user ? (user.role === "admin" ? "/admin" : "/account") : "/login"}
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        <UserRound size={20} />
        <span>{user ? user.name.split(" ")[0] : "Account"}</span>
      </NavLink>
    </nav>
  );
}
