import { Link } from "react-router-dom";
import { getOrders, getUser } from "../services/storage";
import { Package, Heart, UserRound, LogOut } from "lucide-react";
export default function Account({onLogout}:{onLogout:()=>void}){
 const u=getUser()||{name:"ShopMate User",email:""}; const orders=getOrders();
 return <main className="page"><div className="container"><div className="page-heading"><div><span className="eyebrow">MY ACCOUNT</span><h1>Hello, {u.name}</h1><p>{u.email}</p></div><button className="btn btn-outline" onClick={onLogout}><LogOut/> Logout</button></div><div className="account-grid"><div className="account-card card"><UserRound/><h3>Profile</h3><p>Manage your account information.</p></div><Link to="/orders" className="account-card card"><Package/><h3>My Orders</h3><p>{orders.length} order(s) placed.</p></Link><Link to="/wishlist" className="account-card card"><Heart/><h3>Wishlist</h3><p>Saved products you love.</p></Link></div></div></main>
}