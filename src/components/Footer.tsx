import { Facebook, Instagram, Youtube, Twitter, Linkedin, Phone, Mail, MapPin } from "lucide-react";

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
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/shop">Categories</a>
          <a href="/shop?offer=true">Offers</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </div>
        <div>
          <h4>Customer Service</h4>
          <a href="#">Help Center</a>
          <a href="#">Shipping Info</a>
          <a href="#">Returns & Refunds</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
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