import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import Offers from "./pages/Offers";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Reviews from "./pages/Reviews";
import Profile from "./pages/Profile";
import { getCart, getWishlist, saveCart, saveWishlist, clearUser } from "./services/storage";
import type { CartItem, Product } from "./types";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const [wishlist, setWishlist] = useState<string[]>(getWishlist);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [dark, setDark] = useState(localStorage.getItem("shopmate_dark") === "1");
  const [user, setUser] = useState(localStorage.getItem("shopmate_user"));
  const [toast, setToast] = useState<string | null>(null);
  const nav = useNavigate();

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 2500);
  };

  // Redirect to home page "/" whenever page is reloaded / refreshed
  useEffect(() => {
    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        isReload = (navEntries[0] as PerformanceNavigationTiming).type === "reload";
      } else if ((performance as any).navigation) {
        isReload = (performance as any).navigation.type === 1;
      }
    } catch {}

    if (isReload && (window.location.pathname !== "/" || window.location.search !== "")) {
      nav("/", { replace: true });
    }
  }, [nav]);

  useEffect(() => saveCart(cart), [cart]);
  useEffect(() => saveWishlist(wishlist), [wishlist]);
  useEffect(() => {
    localStorage.setItem("shopmate_dark", dark ? "1" : "0");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const add = (p: Product, q = 1, s = "", c = "") => {
    setCart((prev) => {
      const key = p.id + s + c;
      const found = prev.find((x) => x.id + (x.selectedSize || "") + (x.selectedColor || "") === key);
      return found
        ? prev.map((x) => (x === found ? { ...x, quantity: x.quantity + q } : x))
        : [...prev, { ...p, quantity: q, selectedSize: s || undefined, selectedColor: c || undefined }];
    });
    notify(`🛍️ Added "${p.name.length > 25 ? p.name.slice(0, 25) + "..." : p.name}" to cart!`);
  };

  const remove = (id: string) => {
    setCart((c) => c.filter((x) => x.id !== id));
    notify("Item removed from cart");
  };

  const qty = (id: string, q: number) => {
    setCart((c) => c.map((x) => (x.id === id ? { ...x, quantity: q } : x)));
  };

  const wish = (id: string) => {
    setWishlist((w) => {
      const exists = w.includes(id);
      notify(exists ? "Removed from Wishlist" : "❤️ Added to Wishlist!");
      return exists ? w.filter((x) => x !== id) : [...w, id];
    });
  };

  const login = (u: { name: string; email: string; role?: string }) => {
    const userStr = JSON.stringify(u);
    setUser(userStr);
    localStorage.setItem("shopmate_user", userStr);
    notify(`Welcome back, ${u.name}! 👋`);
  };

  const logout = () => {
    clearUser();
    setUser(null);
    notify("Logged out successfully");
    nav("/");
  };

  const currentUser = user ? JSON.parse(user) : null;

  return (
    <div className="app">
      <ScrollToTop />
      <Header
        cartCount={cart.reduce((s, x) => s + x.quantity, 0)}
        wishlistCount={wishlist.length}
        dark={dark}
        setDark={setDark}
        user={currentUser}
      />
      <Routes>
        <Route path="/" element={<Home wishlist={wishlist} onWish={wish} onCart={add} />} />
        <Route path="/shop" element={<Shop wishlist={wishlist} onWish={wish} onCart={add} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/offers" element={<Offers wishlist={wishlist} onWish={wish} onCart={add} notify={notify} />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/reviews" element={<Reviews notify={notify} />} />
        <Route path="/profile" element={<Profile notify={notify} />} />
        <Route path="/product/:id" element={<ProductDetails wishlist={wishlist} onWish={wish} onCart={add} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              onQty={qty}
              onRemove={remove}
              coupon={coupon}
              setCoupon={setCoupon}
              discount={discount}
              setDiscount={setDiscount}
              notify={notify}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              onClear={() => {
                setCart([]);
                setCoupon("");
                setDiscount(0);
              }}
              notify={notify}
            />
          }
        />
        <Route path="/login" element={<Login onLogin={login} notify={notify} />} />
        <Route path="/account" element={<Account onLogout={logout} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist wishlist={wishlist} onWish={wish} onCart={add} />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route
          path="/admin"
          element={currentUser && currentUser.role === "admin" ? <Admin notify={notify} /> : <Login onLogin={login} notify={notify} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      {toast && (
        <div className="toast-notification">
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}