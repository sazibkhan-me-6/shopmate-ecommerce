import { Heart, ShoppingCart, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Product } from "../types";

export default function ProductCard({
  product,
  wished,
  onWish,
  onCart,
}: {
  product: Product;
  wished: boolean;
  onWish: () => void;
  onCart: () => void;
}) {
  const [added, setAdded] = useState(false);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleCartClick = () => {
    onCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="product-card card">
      <div className="product-image">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} />
        </Link>
        {product.oldPrice && <span className="sale-badge">-{discount}%</span>}
        <button
          className={wished ? "wish active" : "wish"}
          onClick={onWish}
          aria-label="Wishlist"
          title={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={17} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-info">
        <Link className="product-name" to={`/product/${product.id}`} title={product.name}>
          {product.name}
        </Link>
        <div className="rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              fill={i < Math.round(product.rating) ? "#ffb000" : "none"}
              stroke={i < Math.round(product.rating) ? "#ffb000" : "#ccd2dc"}
            />
          ))}
          <span>({product.reviews})</span>
        </div>
        <div className="price">
          <strong>${product.price.toFixed(2)}</strong>
          {product.oldPrice && <del>${product.oldPrice.toFixed(2)}</del>}
        </div>
        <button
          className="add-btn"
          onClick={handleCartClick}
          style={added ? { background: "#10b981", color: "#fff" } : undefined}
        >
          {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          {added ? " Added!" : " Add to Cart"}
        </button>
      </div>
    </article>
  );
}