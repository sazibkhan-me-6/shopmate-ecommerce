import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Star, Zap, Clock, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface AdSlide {
  id: string;
  badge: string;
  badgeType: "hot" | "new" | "offer";
  title: string;
  highlight: string;
  subtitle: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  bgGradient: string;
  accentColor: string;
  link: string;
  feature: string;
}

const slides: AdSlide[] = [
  {
    id: "slide-1",
    badge: "✨ NEW ARRIVAL 2026",
    badgeType: "new",
    title: "MacBook Air M3",
    highlight: "Supercharged by Apple M3 Chip",
    subtitle: "Ultra-thin aluminum enclosure, brilliant Liquid Retina display, and up to 18 hours of game-changing battery life.",
    price: 999,
    oldPrice: 1099,
    discount: "Save $100 Today",
    rating: 4.9,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
    bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%)",
    accentColor: "#a5b4fc",
    link: "/product/p6",
    feature: "M3 8-Core CPU • 10-Core GPU • Liquid Retina"
  },
  {
    id: "slide-2",
    badge: "🔥 TOP TRENDING NEW",
    badgeType: "hot",
    title: "iPhone 15 Pro Max",
    highlight: "Forged in Aerospace Titanium",
    subtitle: "A17 Pro game-changing processor, customizable Action button, and 48MP periscope telephoto camera system.",
    price: 1099,
    oldPrice: 1299,
    discount: "15% Special Launch Off",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=900&q=85",
    bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    accentColor: "#38bdf8",
    link: "/product/p1",
    feature: "Titanium Chassis • USB-C 3.0 • Super Retina XDR"
  },
  {
    id: "slide-3",
    badge: "🎧 STUDIO SOUND NEW",
    badgeType: "offer",
    title: "Sony WH-1000XM5",
    highlight: "Industry-Leading Active Noise Cancelling",
    subtitle: "Two dedicated audio processors and 8 microphones deliver absolute silence and breathtaking high-resolution wireless sound.",
    price: 319,
    oldPrice: 399,
    discount: "20% Instant Savings",
    rating: 4.9,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85",
    bgGradient: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)",
    accentColor: "#fbbf24",
    link: "/product/p2",
    feature: "30h Battery Life • LDAC Wireless High-Res • Speak-to-Chat"
  },
  {
    id: "slide-4",
    badge: "👟 FRESH STREETWEAR 2026",
    badgeType: "new",
    title: "Nike Air Force 1 '07",
    highlight: "Iconic Heritage, Everyday Bounce",
    subtitle: "Stitched crisp leather overlays, bold color accents, and full-length encapsulated Nike Air cushioning.",
    price: 89,
    oldPrice: 119,
    discount: "25% Off Deal",
    rating: 4.7,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    bgGradient: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)",
    accentColor: "#f87171",
    link: "/product/p3",
    feature: "Premium Leather • Stitched Overlays • Encapsulated Air"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 35, seconds: 40 });

  // Countdown timer simulation for animated advertisement banner
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic slide rotation every 5.5 seconds unless user hovers
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [paused]);

  const slide = slides[current];

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      className="ad-billboard-wrapper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Top Animated Announcement Ticker */}
      <div className="ad-ticker">
        <div className="ad-ticker-content">
          <span><Zap size={13} className="ticker-icon" /> <b>NEW ARRIVALS 2026:</b> Exclusive Launch Deals Live Now</span>
          <span className="ticker-divider">•</span>
          <span><Clock size={13} className="ticker-icon" /> Limited Stock Offer Ends In: <b>{String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s</b></span>
          <span className="ticker-divider">•</span>
          <span><Truck size={13} className="ticker-icon" /> Free Express Delivery on All New Arrivals</span>
        </div>
      </div>

      {/* Main Animated Ad Banner */}
      <div
        className="ad-billboard"
        style={{
          background: slide.bgGradient,
        }}
      >
        {/* Animated Background Decorative Elements */}
        <div className="ad-glow-blob blob-1" style={{ background: slide.accentColor }}></div>
        <div className="ad-glow-blob blob-2"></div>

        {/* Slide Content Left */}
        <div className="ad-content-col" key={`content-${slide.id}`}>
          <div className="ad-badge-row">
            <span className={`ad-badge badge-${slide.badgeType}`}>
              <Sparkles size={13} /> {slide.badge}
            </span>
            <span className="ad-discount-pill">{slide.discount}</span>
          </div>

          <h1 className="ad-title">
            {slide.title}
            <span className="ad-highlight" style={{ color: slide.accentColor }}>
              {slide.highlight}
            </span>
          </h1>

          <p className="ad-subtitle">{slide.subtitle}</p>

          <div className="ad-feature-tag">
            <Zap size={14} style={{ color: slide.accentColor }} />
            <span>{slide.feature}</span>
          </div>

          <div className="ad-price-row">
            <div className="ad-price-box">
              <span className="ad-price-label">Launch Special</span>
              <div className="ad-price-digits">
                <strong className="ad-current-price">${slide.price}</strong>
                <del className="ad-old-price">${slide.oldPrice}</del>
              </div>
            </div>

            <div className="ad-rating-box">
              <div className="ad-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill="#fbbf24" stroke="#fbbf24" />
                ))}
              </div>
              <span className="ad-rating-text">{slide.rating} ({slide.reviews} Verified Reviews)</span>
            </div>
          </div>

          <div className="ad-cta-row">
            <Link className="btn ad-btn-primary" to={slide.link}>
              <ShoppingBag size={17} /> Shop This Deal <ArrowRight size={17} />
            </Link>
            <Link className="btn ad-btn-ghost" to="/shop?category=Electronics">
              Explore All New
            </Link>
          </div>
        </div>

        {/* Slide Visual Right: Animated Product Showcase */}
        <div className="ad-visual-col" key={`visual-${slide.id}`}>
          <div className="ad-product-card-3d">
            <div className="ad-img-circle-glow" style={{ borderColor: slide.accentColor }}></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="ad-product-img floating-product"
              loading="eager"
            />
            <div className="ad-floating-tag tag-discount">
              <b>{slide.discount}</b>
              <small>Limited Units</small>
            </div>
            <div className="ad-floating-tag tag-security">
              <ShieldCheck size={16} />
              <span>Official Warranty</span>
            </div>
          </div>
        </div>

        {/* Slider Controls (Previous / Next) */}
        <button
          className="ad-nav-btn prev-btn"
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          className="ad-nav-btn next-btn"
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom Slide Indicators / Dots */}
        <div className="ad-dots-container">
          {slides.map((s, index) => (
            <button
              key={s.id}
              className={`ad-dot-pill ${index === current ? "active" : ""}`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                backgroundColor: index === current ? slide.accentColor : "rgba(255, 255, 255, 0.3)"
              }}
            >
              {index === current && <span className="ad-dot-label">{s.title.split(" ")[0]}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Strip Under Hero */}
      <div className="ad-features-strip">
        <div className="strip-item">
          <Truck size={20} className="strip-icon" />
          <div>
            <b>Free Nationwide Delivery</b>
            <small>On all orders above $50</small>
          </div>
        </div>
        <div className="strip-item">
          <ShieldCheck size={20} className="strip-icon" />
          <div>
            <b>100% Authentic Guarantee</b>
            <small>Direct from brand official distributors</small>
          </div>
        </div>
        <div className="strip-item">
          <Clock size={20} className="strip-icon" />
          <div>
            <b>7 Days Easy Returns</b>
            <small>Hassle-free money-back warranty</small>
          </div>
        </div>
        <div className="strip-item">
          <Zap size={20} className="strip-icon" />
          <div>
            <b>24/7 Dedicated Support</b>
            <small>Call, chat or email anytime</small>
          </div>
        </div>
      </div>
    </div>
  );
}
