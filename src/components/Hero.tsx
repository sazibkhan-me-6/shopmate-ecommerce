import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Headphones, LockKeyhole, Star, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [paused, setPaused] = useState(false);

  // Extended slides with first product appended to end for seamless non-stop right-to-left loop
  const slides = [...products, products[0]];

  // Non-stop automatic slide rotation every 2.8 seconds from right to left
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, [paused]);

  // When reaching the cloned slide (index === products.length), reset to index 0 smoothly
  const handleTransitionEnd = () => {
    if (currentIndex >= products.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  // Re-enable CSS transition on next animation frame after seamless jump
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const nextSlide = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!isTransitioning) return;
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(products.length);
      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentIndex(products.length - 1);
      }, 20);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentDisplayIndex = currentIndex % products.length;

  return (
    <section className="hero">
      {/* Left Column: Hero Copy */}
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

      {/* Right Column: Non-stop Product Advertisement Slider */}
      <div
        className="hero-art hero-ad-showcase"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="hero-ad-card-frame">
          {/* Ad Header with Live Indicator & Counter */}
          <div className="hero-ad-header">
            <div className="hero-ad-live-pill">
              <span className="live-pulse-dot"></span>
              <Zap size={11} className="ad-zap" />
              <span>LIVE ADVERTISEMENT</span>
            </div>
            <div className="hero-ad-counter">
              <b>{String(currentDisplayIndex + 1).padStart(2, "0")}</b>
              <span>/</span>
              <small>{String(products.length).padStart(2, "0")}</small>
            </div>
          </div>

          {/* Sliding Product Viewport (Slides right to left continuously) */}
          <div className="hero-ad-viewport">
            <div
              className="hero-ad-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitioning ? "transform 0.62s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((p, idx) => {
                const discountPercent = p.oldPrice
                  ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                  : null;
                return (
                  <div className="hero-ad-slide-item" key={`${p.id}-${idx}`}>
                    <Link to={`/product/${p.id}`} className="hero-ad-product-link">
                      <div className="hero-ad-content-box">
                        {/* Product Image Column */}
                        <div className="hero-ad-img-wrap">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="hero-ad-img"
                            loading={idx < 3 ? "eager" : "lazy"}
                          />
                          {p.badge ? (
                            <span className="hero-ad-badge-tag">{p.badge}</span>
                          ) : discountPercent ? (
                            <span className="hero-ad-badge-tag">-{discountPercent}%</span>
                          ) : (
                            <span className="hero-ad-badge-tag ad-hot">HOT</span>
                          )}
                        </div>

                        {/* Product Info Column */}
                        <div className="hero-ad-details">
                          <div className="hero-ad-meta">
                            <span className="hero-ad-category-tag">{p.category}</span>
                            <span className="hero-ad-brand-tag">{p.brand}</span>
                          </div>

                          <h3 className="hero-ad-product-title" title={p.name}>
                            {p.name}
                          </h3>

                          <div className="hero-ad-stars-row">
                            <div className="hero-ad-stars-list">
                              {Array.from({ length: 5 }).map((_, s) => (
                                <Star
                                  key={s}
                                  size={11}
                                  fill={s < Math.floor(p.rating) ? "#ffb000" : "none"}
                                  stroke="#ffb000"
                                />
                              ))}
                            </div>
                            <span className="hero-ad-rating-number">
                              {p.rating} ({p.reviews})
                            </span>
                          </div>

                          <div className="hero-ad-price-row">
                            <strong className="hero-ad-current-price">${p.price}</strong>
                            {p.oldPrice && (
                              <del className="hero-ad-old-price">${p.oldPrice}</del>
                            )}
                            {discountPercent && (
                              <span className="hero-ad-save-badge">
                                Save ${p.oldPrice! - p.price}
                              </span>
                            )}
                          </div>

                          <div className="hero-ad-cta-button">
                            <span>Order Now</span>
                            <ArrowRight size={13} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ad Footer Controls & Slide Dots */}
          <div className="hero-ad-footer-bar">
            <button
              className="hero-ad-nav-btn prev-ad"
              onClick={prevSlide}
              title="Previous Product"
              aria-label="Previous Product"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="hero-ad-dots-wrapper">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  className={`hero-ad-dot-indicator ${i === currentDisplayIndex ? "active" : ""}`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(i);
                  }}
                  title={`View ${p.name}`}
                  aria-label={`View ${p.name}`}
                />
              ))}
            </div>

            <button
              className="hero-ad-nav-btn next-ad"
              onClick={nextSlide}
              title="Next Product"
              aria-label="Next Product"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Dots */}
      <div className="hero-dots">
        <i></i>
        <i></i>
        <i></i>
      </div>
    </section>
  );
}
