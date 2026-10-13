import { ArrowRight, CheckCircle2, Mail, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, products, reviews } from "../data";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import type { Product } from "../types";

export default function Home({wishlist,onWish,onCart}:{wishlist:string[];onWish:(id:string)=>void;onCart:(p:Product)=>void}){
 return <main>
  <div className="container"><Hero/></div>
  <section className="container section"><div className="section-head"><div><h2 className="section-title">Featured Categories</h2><p>Shop by category and find exactly what you need.</p></div><Link className="link-purple" to="/shop">View All <ArrowRight size={14}/></Link></div>
   <div className="categories">{categories.map(c=><Link to={`/shop?category=${encodeURIComponent(c.name)}`} className="category" key={c.name}><img src={c.image} alt={c.name}/><b>{c.name}</b></Link>)}</div>
  </section>
  <section className="container section"><div className="section-head"><div><h2 className="section-title">Best Selling Products</h2><p>Our most popular products, loved by customers.</p></div><Link className="link-purple" to="/shop">View All <ArrowRight size={14}/></Link></div>
   <div className="products-grid">{products.slice(0,5).map(p=><ProductCard key={p.id} product={p} wished={wishlist.includes(p.id)} onWish={()=>onWish(p.id)} onCart={()=>onCart(p)}/>)}</div>
  </section>
  <section className="container promo-grid"><div className="promo dark-promo"><div><small>BIG SALE</small><h2>Up to 50% OFF</h2><p>On Selected Items</p><Link className="btn btn-primary" to="/shop?offer=true">Shop Now <ArrowRight size={15}/></Link></div><div className="promo-visual">📱 💻 🎧</div><b className="off-circle">50%<small>OFF</small></b></div><div className="promo green-promo"><div><h2>Fresh Looks<br/>For Every Season</h2><p>Fashion Collection 2026</p><Link className="btn btn-outline" to="/shop?category=Fashion">Shop Now <ArrowRight size={15}/></Link></div><div className="model">🧑‍🎨</div></div></section>
  <section className="container section"><div className="section-head"><div><h2 className="section-title">What Our Customers Say</h2><p>Real reviews from real customers.</p></div><Link className="link-purple" to="/shop">View All Reviews <ArrowRight size={14}/></Link></div><div className="reviews">{reviews.map(r=><div className="review card" key={r.name}><div className="review-top"><div className="avatar">{r.name[0]}</div><div><b>{r.name}</b><small><CheckCircle2 size={13}/> Verified Buyer</small></div></div><div className="stars">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill="#ffb000" stroke="#ffb000"/>)}</div><p>“{r.text}”</p><small className="muted">{r.days}</small></div>)}</div></section>
  <section className="container newsletter"><div className="newsletter-icon"><Mail/></div><div><h3>Subscribe to Our Newsletter</h3><p>Get the latest updates on new products and special offers.</p></div><form onSubmit={e=>{e.preventDefault();alert("Thanks! You're subscribed to ShopMate.");}}><input type="email" required placeholder="Enter your email address"/><button className="btn btn-primary">Subscribe</button></form></section>
 </main>
}