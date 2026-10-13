import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, UserRound, Moon, Sun, Menu, X, Truck, ChevronDown } from "lucide-react";

export default function Header({ cartCount, wishlistCount, dark, setDark }: { cartCount:number; wishlistCount:number; dark:boolean; setDark:(v:boolean)=>void }) {
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const search = (e: React.FormEvent) => { e.preventDefault(); navigate(`/shop?search=${encodeURIComponent(q)}`); setMobile(false); };
  return <>
    <div className="announce"><div className="container"><span><Truck size={14}/> Free shipping on orders over $50</span><b>30% Off on All Electronics — Shop Now!</b><span className="announce-right">EN <ChevronDown size={12}/> &nbsp; USD <ChevronDown size={12}/></span></div></div>
    <header className="header">
      <div className="container nav">
        <Link className="brand" to="/"><span className="brand-icon">🛍</span><span>ShopMate</span></Link>
        <button className="mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Menu">{mobile?<X/>:<Menu/>}</button>
        <nav className={mobile?"nav-links open":"nav-links"}>
          {["Home","Shop","Categories","Offers","About","Contact"].map(x=><NavLink key={x} to={x==="Home"?"/":x==="Shop"?"/shop":x==="Categories"?"/shop?category=Electronics":x==="Offers"?"/shop?offer=true":`/${x.toLowerCase()}`} onClick={()=>setMobile(false)}>{x}</NavLink>)}
        </nav>
        <form className="search" onSubmit={search}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for products..."/><button aria-label="Search"><Search size={19}/></button></form>
        <div className="nav-actions">
          <button className="icon-action" onClick={()=>navigate("/wishlist")} title="Wishlist"><Heart/><span className="count">{wishlistCount}</span><em>Wishlist</em></button>
          <button className="icon-action" onClick={()=>navigate("/cart")} title="Cart"><ShoppingCart/><span className="count">{cartCount}</span><em>Cart</em></button>
          <button className="icon-action login-btn" onClick={()=>navigate("/login")}><UserRound/><em>Login / Register</em></button>
          <button className="theme-btn" onClick={()=>setDark(!dark)} title="Toggle dark mode">{dark?<Sun/>:<Moon/>}</button>
        </div>
      </div>
    </header>
  </>;
}