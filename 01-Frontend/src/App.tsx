import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import StaticPage from "./pages/StaticPage";
import { getCart, getWishlist, saveCart, saveWishlist, clearUser } from "./services/storage";
import type { CartItem, Product } from "./types";

export default function App(){
 const [cart,setCart]=useState<CartItem[]>(getCart); const [wishlist,setWishlist]=useState<string[]>(getWishlist); const [coupon,setCoupon]=useState(""); const [discount,setDiscount]=useState(0);
 const [dark,setDark]=useState(localStorage.getItem("shopmate_dark")==="1"); const [user,setUser]=useState(localStorage.getItem("shopmate_user"));
 const nav=useNavigate();
 useEffect(()=>saveCart(cart),[cart]); useEffect(()=>saveWishlist(wishlist),[wishlist]); useEffect(()=>{localStorage.setItem("shopmate_dark",dark?"1":"0");document.documentElement.classList.toggle("dark",dark)},[dark]);
 const add=(p:Product,q=1,s="",c="")=>setCart(prev=>{const key=p.id+s+c; const found=prev.find(x=>x.id+s+c===key); return found?prev.map(x=>x===found?{...x,quantity:x.quantity+q}:x):[...prev,{...p,quantity:q,selectedSize:s||undefined,selectedColor:c||undefined}]});
 const remove=(id:string)=>setCart(c=>c.filter(x=>x.id!==id)); const qty=(id:string,q:number)=>setCart(c=>c.map(x=>x.id===id?{...x,quantity:q}:x));
 const wish=(id:string)=>setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
 const login=(u:{name:string;email:string;role?:string})=>setUser(JSON.stringify(u)); const logout=()=>{clearUser();setUser(null);nav("/")};
 return <div className="app"><Header cartCount={cart.reduce((s,x)=>s+x.quantity,0)} wishlistCount={wishlist.length} dark={dark} setDark={setDark}/><Routes>
  <Route path="/" element={<Home wishlist={wishlist} onWish={wish} onCart={add}/>}/>
  <Route path="/shop" element={<Shop wishlist={wishlist} onWish={wish} onCart={add}/>}/>
  <Route path="/product/:id" element={<ProductDetails wishlist={wishlist} onWish={wish} onCart={add}/>}/>
  <Route path="/cart" element={<Cart cart={cart} onQty={qty} onRemove={remove} coupon={coupon} setCoupon={setCoupon} discount={discount} setDiscount={setDiscount}/>}/>
  <Route path="/checkout" element={<Checkout cart={cart} onClear={()=>{setCart([]);setCoupon("");setDiscount(0)}}/>}/>
  <Route path="/login" element={<Login onLogin={login}/>}/>
  <Route path="/account" element={<Account onLogout={logout}/>}/>
  <Route path="/orders" element={<Orders/>}/>
  <Route path="/wishlist" element={<Wishlist wishlist={wishlist} onWish={wish} onCart={add}/>}/>
  <Route path="/order-success/:id" element={<OrderSuccess/>}/>
  <Route path="/admin" element={user&&JSON.parse(user).role==="admin"?<Admin/>:<Login onLogin={login}/>}/>
  <Route path="/about" element={<StaticPage eyebrow="ABOUT SHOPMATE" title="Shopping made smarter"><p>ShopMate brings curated products, clear pricing and a friendly checkout experience together in one modern store.</p><p>Our goal is simple: quality products, transparent service and dependable delivery.</p></StaticPage>}/>
  <Route path="/contact" element={<StaticPage eyebrow="CONTACT US" title="We’re here to help"><p>Email: support@shopmate.com</p><p>Phone: +880 1234 567890</p><p>Dhaka, Bangladesh</p></StaticPage>}/>
 </Routes><Footer/></div>
}