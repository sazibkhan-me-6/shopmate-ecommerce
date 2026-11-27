import { ArrowLeft, Minus, Plus, Trash2, Tag, Sparkles, LogIn, ShoppingCart, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { CartItem, Product } from "../types";
import { getUser } from "../services/storage";
import { products } from "../data";

export default function Cart({
  cart,
  onQty,
  onRemove,
  coupon,
  setCoupon,
  discount,
  setDiscount,
  notify,
  onAdd,
}: {
  cart: CartItem[];
  onQty: (id: string, q: number) => void;
  onRemove: (id: string) => void;
  coupon: string;
  setCoupon: (v: string) => void;
  discount: number;
  setDiscount: (v: number) => void;
  notify?: (msg: string) => void;
  onAdd?: (p: Product) => void;
}) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 7.99;
  const total = Math.max(0, subtotal + shipping - discount);
  const user: any = getUser();

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
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="empty card" style={{ padding: "40px 20px" }}>
            <div className="empty-icon" style={{ fontSize: "50px" }}>🛒</div>
            <h2>Your cart is currently empty</h2>
            <p style={{ color: "#64748b", maxWidth: "420px", margin: "6px auto 20px" }}>
              Explore our best selling items below and add them directly to your cart!
            </p>
            <Link className="btn btn-primary" to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Browse All Products <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ marginTop: "35px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px" }}>
              Trending Recommendations
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px" }}>
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className="card" style={{ padding: "12px", display: "flex", flexDirection: "column" }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                  />
                  <strong style={{ fontSize: "13px", lineHeight: "1.3", marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.name}
                  </strong>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "8px" }}>
                    <span style={{ color: "#e22d3d", fontWeight: "800", fontSize: "14px" }}>${p.price.toFixed(2)}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onAdd && onAdd(p)}
                      style={{ padding: "6px 12px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      <ShoppingCart size={13} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <div className="icon-field" style={{ flex: 1 }}>
                <span className="icon-field-icon"><Tag size={15} /></span>
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder=""
                  aria-label="Coupon code"
                />
              </div>
              <button onClick={apply}>
                <Tag size={16} /> Apply
              </button>
            </div>
            <hr />
            <div className="total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            {user ? (
              <div className="cart-autofill-hint">
                <Sparkles size={15} style={{ flexShrink: 0 }} />
                <span>
                  Delivering to <b>{user.name}</b> ({user.city || "Dhaka"}). Your details are auto-filled at checkout!
                </span>
              </div>
            ) : (
              <div className="cart-autofill-hint not-signed">
                <LogIn size={15} style={{ flexShrink: 0 }} />
                <span>
                  <Link to="/login">Sign in</Link> to auto-fill your saved address & checkout faster.
                </span>
              </div>
            )}

            <Link to="/checkout" className="btn btn-primary checkout-btn" style={{ textDecoration: "none", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
              Proceed to Checkout
            </Link>
            <p className="secure-note">🔒 Secure checkout • Easy returns</p>
          </aside>
        </div>
      </div>
    </main>
  );
}