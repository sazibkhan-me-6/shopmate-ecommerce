import { Link } from "react-router-dom";
import { getOrders, getUser } from "../services/storage";
import { Package, UserRound, LogOut, Truck } from "lucide-react";

export default function Account({ onLogout }: { onLogout: () => void }) {
  const u = getUser() || { name: "ShopMate User", email: "" };
  const orders = getOrders();

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">MY ACCOUNT</span>
            <h1>Hello, {u.name}</h1>
            <p>{u.email || "Welcome to your ShopMate account center"}</p>
          </div>
          <button className="btn btn-outline" onClick={onLogout}>
            <LogOut size={16} style={{ marginRight: "4px" }} /> Logout
          </button>
        </div>

        <div className="account-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Link to="/profile" className="account-card card">
            <UserRound />
            <h3>My Profile</h3>
            <p>Edit name, contact phone & default delivery address.</p>
          </Link>

          <Link to="/orders" className="account-card card">
            <Package />
            <h3>My Orders</h3>
            <p>{orders.length} order(s) placed with live status.</p>
          </Link>

          <Link to="/shipping" className="account-card card">
            <Truck />
            <h3>Shipping Details</h3>
            <p>Courier tracking, delivery times & rates.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}