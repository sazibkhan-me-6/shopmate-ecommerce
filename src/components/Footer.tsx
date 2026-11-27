import { Facebook, Instagram, Youtube, Twitter, Linkedin, Phone, Mail, MapPin, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  active: boolean;
}

const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { id: "facebook", platform: "Facebook", url: "https://facebook.com", active: true },
  { id: "whatsapp", platform: "WhatsApp", url: "https://wa.me/8801614703406", active: true },
  { id: "instagram", platform: "Instagram", url: "https://instagram.com", active: true },
  { id: "youtube", platform: "YouTube", url: "https://youtube.com", active: true },
  { id: "twitter", platform: "X (Twitter)", url: "https://x.com", active: true },
  { id: "linkedin", platform: "LinkedIn", url: "https://linkedin.com", active: true },
];

function renderSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("facebook")) return <Facebook size={18} />;
  if (p.includes("whatsapp")) return <Phone size={18} />;
  if (p.includes("instagram")) return <Instagram size={18} />;
  if (p.includes("youtube")) return <Youtube size={18} />;
  if (p.includes("twitter") || p === "x" || p.includes("x (")) return <Twitter size={18} />;
  if (p.includes("linkedin")) return <Linkedin size={18} />;
  return <Globe size={18} />;
}

export default function Footer({ socialLinks }: { socialLinks?: SocialLinkItem[] }) {
  const links = (socialLinks && socialLinks.length > 0 ? socialLinks : DEFAULT_SOCIAL_LINKS).filter(
    (s) => s.active && s.url
  );

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-icon">🛍</span>ShopMate
          </div>
          <p>One-stop shop for the best products at the best prices. Shop smart, live better.</p>
          <div className="socials">
            {links.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                title={s.platform}
                style={{ color: "inherit" }}
              >
                {renderSocialIcon(s.platform)}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop All Products</Link>
          <Link to="/categories">Product Categories</Link>
          <Link to="/offers">Offers & Flash Deals</Link>
          <Link to="/reviews">Customer Reviews</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div>
          <h4>Customer Service</h4>
          <Link to="/faq">Help Center & FAQ</Link>
          <Link to="/shipping">Shipping Information</Link>
          <Link to="/returns">Returns & Refunds</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/profile">My Account & Profile</Link>
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