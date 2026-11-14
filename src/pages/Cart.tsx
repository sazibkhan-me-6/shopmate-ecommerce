import { ArrowLeft, Minus, Plus, Trash2, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { CartItem } from "../types";

export default function Cart({
  cart,
  onQty,
  onRemove,
  coupon,
  setCoupon,
  discount,
  setDiscount,
  notify,
}: {
  cart: CartItem[];
  onQty: (id: string, q: number) => void;
  onRemove: (id: string) => void;
  coupon: string;
  setCoupon: (v: string) => void;
  discount: number;
  setDiscount: (v: number) => void;
  notify?: (msg: string) => void;
}) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 7.99;
  const total = Math.max(0, subtotal + shipping - discount);

  const apply = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "SAVE10") {
      setDiscount(subtotal * 0.1);
      if (notify) notify("🎉 Coupon 'SAVE10' applied! 10% discount added.");
    } else if (code === "WELCOME20") {
      setDiscount(Math.min(20, subtotal * 0.2));
      if (notify) notify("🎉 Coupon 'WELCOME20' applied! $20 discount added.");
    } else {
      setDiscount(0);
      if (notify) {
        notify("❌ Invalid coupon code. Try SAVE10 or WELCOME20.");
      } else {
        alert("Invalid coupon code. Try SAVE10 or WELCOME20.");
      }
    }
  };

  if (!cart.length)
    return (
      <main className="page">
        <div className="container empty card">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add something you love and it will appear here.</p>
          <Link className="btn btn-primary" to="/shop">
            Continue Shopping
          </Link>
        </div>
      </main>
    );

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">YOUR CART</span>
            <h1>Shopping Cart</h1>
          </div>
          <Link className="back" to="/shop">
            <ArrowLeft /> Continue Shopping
          </Link>
        </div>
        <div className="cart-layout">
          <section className="card cart-items">
            {cart.map((x) => (
              <div className="cart-item" key={x.id}>
                <img src={x.image} alt={x.name} />
                <div className="cart-main">
                  <Link to={`/product/${x.id}`}>
                    <b>{x.name}</b>
                  </Link>
                  <small>
                    {x.selectedColor || ""} {x.selectedSize ? `• ${x.selectedSize}` : ""}
                  </small>
                  <strong>${x.price.toFixed(2)}</strong>
                </div>
                <div className="qty">
                  <button onClick={() => onQty(x.id, Math.max(1, x.quantity - 1))}>
                    <Minus />
                  </button>
                  <b>{x.quantity}</b>
                  <button onClick={() => onQty(x.id, x.quantity + 1)}>
                    <Plus />
                  </button>
                </div>
                <button className="remove" onClick={() => onRemove(x.id)} aria-label="Remove">
                  <Trash2 />
                </button>
              </div>
            ))}
          </section>
          <aside className="card summary">
            <h2>Order Summary</h2>
            <div>
              <span>Subtotal</span>
              <b>${subtotal.toFixed(2)}</b>
            </div>
            <div>
              <span>Shipping</span>
              <b>{shipping ? "$" + shipping.toFixed(2) : "Free"}</b>
            </div>
            {discount > 0 && (
              <div>
                <span>Discount</span>
                <b className="green">-${discount.toFixed(2)}</b>
              </div>
            )}
            <div className="coupon">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code (SAVE10 / WELCOME20)"
              />
              <button onClick={apply}>
                <Tag size={16} /> Apply
              </button>
            </div>
            <hr />
            <div className="total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button className="btn btn-primary checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
            <p className="secure-note">🔒 Secure checkout • Easy returns</p>
          </aside>
        </div>
      </div>
    </main>
  );
}