import { ArrowRight, CheckCircle2, Flame, Mail, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, products, reviews } from "../data";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import type { Product } from "../types";

export default function Home({
  wishlist,
  onWish,
  onCart,
}: {
  wishlist: string[];
  onWish: (id: string) => void;
  onCart: (p: Product) => void;
}) {
  // New Arrivals showcase items (featuring MacBook Air M3, iPhone 15 Pro Max, Sony, Nike, Apple Watch)
  const newArrivals = [products[5], products[0], products[1], products[2], products[3]];
  // Best selling customer favorites
  const bestSellers = [products[4], products[6], products[7], products[8], products[9]];

  return (
    <main>
      {/* Animated Advertisement Billboard Showcase for NEW ARRIVALS */}
      <div className="container">
        <Hero />
      </div>

      {/* Featured Categories */}
      <section className="container section">
        <div className="section-head">
          <div>
            <h2 className="section-title">Featured Categories</h2>
            <p>Shop by category and find exactly what you need.</p>
          </div>
          <Link className="link-purple" to="/categories">
            View All Categories <ArrowRight size={14} />
          </Link>
        </div>
        <div className="categories">
          {categories.map((c) => (
            <Link
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="category"
              key={c.name}
            >
              <img src={c.image} alt={c.name} />
              <b>{c.name}</b>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS 2026 Showcase */}
      <section className="container section">
        <div className="section-head">
          <div>
            <div className="new-arrivals-badge-pulse">
              <Sparkles size={13} /> NEW ARRIVALS 2026
            </div>
            <h2 className="section-title">Latest New Arrivals & Trending Gadgets</h2>
            <p>Explore the freshest high-performance releases and designer picks just added to ShopMate.</p>
          </div>
          <Link className="link-purple" to="/shop?category=Electronics">
            View All New Arrivals <ArrowRight size={14} />
          </Link>
        </div>
        <div className="products-grid">
          {newArrivals.map((p) => (
            <ProductCard
              key={`new-${p.id}`}
              product={p}
              wished={wishlist.includes(p.id)}
              onWish={() => onWish(p.id)}
              onCart={() => onCart(p)}
            />
          ))}
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="container section">
        <div className="section-head">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#ea580c", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
              <Flame size={14} /> MOST POPULAR
            </div>
            <h2 className="section-title">Best Selling Products</h2>
            <p>Our most popular products, loved and rated 5 stars by thousands of verified buyers.</p>
          </div>
          <Link className="link-purple" to="/shop">
            View All Products <ArrowRight size={14} />
          </Link>
        </div>
        <div className="products-grid">
          {bestSellers.map((p) => (
            <ProductCard
              key={`best-${p.id}`}
              product={p}
              wished={wishlist.includes(p.id)}
              onWish={() => onWish(p.id)}
              onCart={() => onCart(p)}
            />
          ))}
        </div>
      </section>

      {/* Promo Banners */}
      <section className="container promo-grid">
        <div className="promo dark-promo">
          <div>
            <small>BIG SALE</small>
            <h2>Up to 50% OFF</h2>
            <p>On Selected Items</p>
            <Link className="btn btn-primary" to="/offers">
              Claim Offers <ArrowRight size={15} />
            </Link>
          </div>
          <div className="promo-visual">📱 💻 🎧</div>
          <b className="off-circle">
            50%<small>OFF</small>
          </b>
        </div>
        <div className="promo green-promo">
          <div>
            <h2>
              Fresh Looks
              <br />
              For Every Season
            </h2>
            <p>Fashion Collection 2026</p>
            <Link className="btn btn-outline" to="/shop?category=Fashion">
              Shop Fashion <ArrowRight size={15} />
            </Link>
          </div>
          <div className="model">🧑‍🎨</div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="container section">
        <div className="section-head">
          <div>
            <h2 className="section-title">What Our Customers Say</h2>
            <p>Real reviews from real verified customers.</p>
          </div>
          <Link className="link-purple" to="/reviews">
            View All Reviews <ArrowRight size={14} />
          </Link>
        </div>
        <div className="reviews">
          {reviews.map((r) => (
            <div className="review card" key={r.name}>
              <div className="review-top">
                <div className="avatar">{r.name[0]}</div>
                <div>
                  <b>{r.name}</b>
                  <small>
                    <CheckCircle2 size={13} /> Verified Buyer
                  </small>
                </div>
              </div>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#ffb000" stroke="#ffb000" />
                ))}
              </div>
              <p>“{r.text}”</p>
              <small className="muted">{r.days}</small>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container newsletter">
        <div className="newsletter-icon">
          <Mail />
        </div>
        <div>
          <h3>Subscribe to Our Newsletter</h3>
          <p>Get the latest updates on new products and special offers.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks! You're subscribed to ShopMate.");
          }}
        >
          <input type="email" required placeholder="Enter your email address" />
          <button className="btn btn-primary">Subscribe</button>
        </form>
      </section>
    </main>
  );
}
