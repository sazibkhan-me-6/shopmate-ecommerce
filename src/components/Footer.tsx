import { Facebook, Instagram, Youtube, Twitter, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-icon">🛍</span>ShopMate
          </div>
          <p>One-stop shop for the best products at the best prices. Shop smart, live better.</p>
          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook" style={{color:"inherit"}}><Facebook size={18}/></a>
            <a href="https://wa.me/8801614703406" target="_blank" rel="noreferrer" title="WhatsApp" style={{color:"inherit"}}><Phone size={18}/></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" style={{color:"inherit"}}><Instagram size={18}/></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube" style={{color:"inherit"}}><Youtube size={18}/></a>
            <a href="https://x.com" target="_blank" rel="noreferrer" title="X (Twitter)" style={{color:"inherit"}}><Twitter size={18}/></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" style={{color:"inherit"}}><Linkedin size={18}/></a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/shop?category=Electronics">Categories</Link>
          <Link to="/shop?offer=true">Offers & Discounts</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Customer Service</h4>
          <Link to="/contact">Help Center & Support</Link>
          <Link to="/about">Shipping Info</Link>
          <Link to="/about">Returns & Refunds</Link>
          <Link to="/about">Terms & Conditions</Link>
          <Link to="/about">Privacy Policy</Link>
        </div>
        <div>
          <h4>Contact Us</h4>
          <p><Phone size={14}/> +880 1614703406 (Call & WhatsApp)</p>
          <p><Mail size={14}/> support@shopmate.com</p>
          <p><MapPin size={14}/> Banani, Dhaka - 1213, Bangladesh</p>
          <h4 className="accept-title">We Accept</h4>
          <div className="payments">
            <span>bKash</span>
            <span>Nagad</span>
            <span>VISA</span>
            <span>Mastercard</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2026 ShopMate. All rights reserved.</span>
        <span>Secure shopping • Fast delivery • Easy returns</span>
      </div>
    </footer>
  );
}