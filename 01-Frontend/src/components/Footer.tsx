import { Facebook, Instagram, Youtube, Twitter, Linkedin, Phone, Mail, MapPin, CreditCard } from "lucide-react";
export default function Footer(){
 return <footer className="footer"><div className="container footer-grid">
  <div><div className="brand footer-brand"><span className="brand-icon">🛍</span>ShopMate</div><p>One-stop shop for the best products at the best prices. Shop smart, live better.</p><div className="socials"><Facebook/><Instagram/><Youtube/><Twitter/><Linkedin/></div></div>
  <div><h4>Quick Links</h4><a href="/shop">Home</a><a href="/shop">Shop</a><a href="/shop">Categories</a><a href="/shop?offer=true">Offers</a><a href="/about">About</a><a href="/contact">Contact</a></div>
  <div><h4>Customer Service</h4><a href="#">Help Center</a><a href="#">Shipping Info</a><a href="#">Returns & Refunds</a><a href="#">Terms & Conditions</a><a href="#">Privacy Policy</a></div>
  <div><h4>Contact Us</h4><p><Phone/> +880 1234 567890</p><p><Mail/> support@shopmate.com</p><p><MapPin/> Dhaka, Bangladesh</p><h4 className="accept-title">We Accept</h4><div className="payments"><span>VISA</span><span>MC</span><span>bkash</span><span>PayPal</span></div></div>
 </div><div className="footer-bottom container"><span>© 2026 ShopMate. All rights reserved.</span><span>Secure shopping • Fast delivery • Easy returns</span></div></footer>
}