import { ArrowRight, Headphones, LockKeyhole, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">NEW ARRIVALS</span>
        <h1>
          Upgrade Your Style
          <br />
          <span>With the Latest Trends</span>
        </h1>
        <p>
          Discover premium quality products at unbeatable prices.
          <br />
          Shop the best deals, only at <b>ShopMate.</b>
        </p>
        <Link className="btn btn-primary" to="/shop">
          Shop Now <ArrowRight size={17} />
        </Link>
        <div className="hero-features">
          <Link to="/shipping" style={{ color: "inherit", textDecoration: "none" }}>
            <span>
              <Truck /> <b>Free Shipping</b>
              <small>On orders over $50</small>
            </span>
          </Link>
          <Link to="/terms" style={{ color: "inherit", textDecoration: "none" }}>
            <span>
              <LockKeyhole /> <b>Secure Payment</b>
              <small>100% secure checkout</small>
            </span>
          </Link>
          <Link to="/faq" style={{ color: "inherit", textDecoration: "none" }}>
            <span>
              <Headphones /> <b>24/7 Support</b>
              <small>We're here to help</small>
            </span>
          </Link>
        </div>
      </div>
      <div className="hero-art">
        <div className="art-glow"></div>
        <div className="art-emoji">
          👟 🎧<br />⌚ 📱
        </div>
        <div className="better">
          Better
          <br />
          Lifestyle
        </div>
      </div>
      <div className="hero-dots">
        <i></i>
        <i></i>
        <i></i>
      </div>
    </section>
  );
}