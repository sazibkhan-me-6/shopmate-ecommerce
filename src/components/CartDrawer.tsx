import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, Check } from "lucide-react";
import type { CartItem, Product } from "../types";
import { products } from "../data";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onQty,
  onRemove,
  onAdd,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onQty: (id: string, q: number) => void;
  onRemove: (id: string) => void;
  onAdd?: (p: Product) => void;
  user?: { name: string; email: string; city?: string } | null;
}) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    onClose();
    navigate("/checkout");
  };

  const handleViewCartClick = () => {
    onClose();
    navigate("/cart");
  };

  const recommended = products.slice(0, 3);

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <aside
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingBag size={20} className="cart-drawer-icon" />
            <h3>Your Shopping Cart</h3>
            <span className="cart-drawer-badge">
              {cart.reduce((s, x) => s + x.quantity, 0)}
            </span>
          </div>
          <button
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="Close cart"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="cart-drawer-shipping-box">
          <div className="shipping-progress-text">
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <b>${remainingForFreeShipping.toFixed(2)}</b> more for <strong>FREE Shipping</strong>!
              </span>
            ) : (
              <span className="free-shipping-unlocked">
                🎉 Congratulations! You have unlocked <strong>FREE Shipping</strong>!
              </span>
            )}
          </div>
          <div className="shipping-progress-bar">
            <div
              className="shipping-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="cart-drawer-body">
          {cart.length > 0 ? (
            <div className="cart-drawer-items">
              {cart.map((item) => (
                <div className="cart-drawer-item" key={item.id + (item.selectedSize || "") + (item.selectedColor || "")}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-drawer-item-img"
                    onClick={() => {
                      onClose();
                      navigate(`/product/${item.id}`);
                    }}
                  />
                  <div className="cart-drawer-item-details">
                    <Link
                      to={`/product/${item.id}`}
                      className="cart-drawer-item-name"
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="cart-drawer-item-variants">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                    )}
                    <div className="cart-drawer-item-price">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="cart-drawer-item-actions">
                      <div className="qty-control">
                        <button
                          onClick={() => onQty(item.id, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => onQty(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        className="cart-drawer-remove"
                        onClick={() => onRemove(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cart-drawer-empty">
              <div className="empty-cart-icon">🛒</div>
              <h4>Your Cart is Empty</h4>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  navigate("/shop");
                }}
              >
                Browse Shop <ArrowRight size={16} />
              </button>

              {/* Quick Trending Recommendations */}
              <div className="cart-drawer-suggestions">
                <h5>Popular Products You May Like</h5>
                <div className="drawer-suggest-list">
                  {recommended.map((prod) => (
                    <div className="drawer-suggest-item" key={prod.id}>
                      <img src={prod.image} alt={prod.name} />
                      <div className="drawer-suggest-info">
                        <strong>{prod.name}</strong>
                        <span>${prod.price.toFixed(2)}</span>
                      </div>
                      <button
                        className="btn btn-soft btn-sm"
                        onClick={() => {
                          if (onAdd) onAdd(prod);
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer (when cart has items) */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {user && (
              <div className="drawer-autofill-note">
                <Sparkles size={14} />
                <span>
                  Delivering to <b>{user.name}</b> ({user.city || "Dhaka"}). Auto-filled at checkout!
                </span>
              </div>
            )}

            <div className="cart-drawer-subtotal-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="cart-drawer-tax-note">
              Taxes & shipping calculated at checkout
            </div>

            <button
              className="btn btn-primary cart-drawer-checkout-btn"
              onClick={handleCheckoutClick}
            >
              Proceed to Checkout (${subtotal.toFixed(2)})
            </button>

            <button
              className="cart-drawer-view-full"
              onClick={handleViewCartClick}
            >
              View Detailed Cart Page →
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
