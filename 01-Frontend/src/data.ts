import type { Product } from "./types";

export const categories = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80" },
  { name: "Fashion", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80" },
  { name: "Home & Living", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80" },
  { name: "Beauty & Health", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80" },
  { name: "Sports & Fitness", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80" },
  { name: "Books", image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=500&q=80" },
  { name: "Toys & Games", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=500&q=80" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80" }
];

export const products: Product[] = [
  {
    id: "p1", name: "iPhone 15 Pro Max", category: "Electronics", brand: "Apple", price: 1099, oldPrice: 1299,
    rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=700&q=85",
    description: "Titanium design, powerful camera system and all-day battery life. A premium smartphone built for performance.",
    colors: ["Natural Titanium", "Black Titanium", "Blue Titanium"], stock: 24, badge: "-15%"
  },
  {
    id: "p2", name: "Sony WH-1000XM5", category: "Electronics", brand: "Sony", price: 319, oldPrice: 399,
    rating: 4.9, reviews: 98, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=85",
    description: "Industry-leading noise cancellation, premium sound and a comfortable lightweight design.",
    colors: ["Black", "Silver"], stock: 31, badge: "-20%"
  },
  {
    id: "p3", name: "Nike Air Force 1", category: "Fashion", brand: "Nike", price: 89, oldPrice: 119,
    rating: 4.7, reviews: 76, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    description: "Iconic everyday sneakers with timeless styling, cushioned comfort and durable construction.",
    sizes: ["39", "40", "41", "42", "43", "44"], colors: ["White", "Black"], stock: 45, badge: "-25%"
  },
  {
    id: "p4", name: "Apple Watch Series 9", category: "Electronics", brand: "Apple", price: 409, oldPrice: 499,
    rating: 4.8, reviews: 63, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=85",
    description: "Powerful health, fitness and connectivity features in a sleek smartwatch for everyday life.",
    colors: ["Midnight", "Starlight"], stock: 19, badge: "-18%"
  },
  {
    id: "p5", name: "Under Armour Backpack", category: "Accessories", brand: "Under Armour", price: 45, oldPrice: 58,
    rating: 4.6, reviews: 42, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
    description: "Durable, spacious backpack with practical compartments for work, school and travel.",
    colors: ["Black"], stock: 52, badge: "-22%"
  },
  {
    id: "p6", name: "MacBook Air M3", category: "Electronics", brand: "Apple", price: 999, oldPrice: 1099,
    rating: 4.9, reviews: 88, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=85",
    description: "Thin, silent and powerful laptop with the M3 chip, brilliant display and long battery life.",
    colors: ["Midnight", "Silver", "Starlight"], stock: 16, badge: "NEW"
  },
  {
    id: "p7", name: "Premium Cotton T-Shirt", category: "Fashion", brand: "Uniqlo", price: 29, oldPrice: 39,
    rating: 4.5, reviews: 51, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
    description: "Soft premium cotton with a clean regular fit, made for everyday comfort.",
    sizes: ["S", "M", "L", "XL"], colors: ["White", "Beige", "Black"], stock: 70
  },
  {
    id: "p8", name: "Minimal Lounge Sofa", category: "Home & Living", brand: "Nordic Home", price: 699, oldPrice: 799,
    rating: 4.7, reviews: 34, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85",
    description: "Modern lounge sofa with supportive cushions and a soft neutral finish.",
    colors: ["Cream", "Gray"], stock: 8, badge: "-12%"
  },
  {
    id: "p9", name: "Everyday Skincare Set", category: "Beauty & Health", brand: "Glow Lab", price: 59, oldPrice: 79,
    rating: 4.6, reviews: 29, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
    description: "Simple daily skincare essentials designed for cleansing, hydration and a healthy glow.",
    stock: 37, badge: "-25%"
  },
  {
    id: "p10", name: "Adjustable Dumbbell Set", category: "Sports & Fitness", brand: "FitPro", price: 149, oldPrice: 189,
    rating: 4.7, reviews: 45, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=85",
    description: "Compact adjustable weights for efficient home workouts and strength training.",
    stock: 20
  },
  {
    id: "p11", name: "The Creative Mind", category: "Books", brand: "Penguin", price: 19, oldPrice: 25,
    rating: 4.8, reviews: 18, image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=700&q=85",
    description: "An inspiring guide to creative thinking, habits and practical idea generation.",
    stock: 100
  },
  {
    id: "p12", name: "Classic Teddy Bear", category: "Toys & Games", brand: "PlayTime", price: 24, oldPrice: 32,
    rating: 4.9, reviews: 67, image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=85",
    description: "Soft, giftable teddy bear made with child-friendly plush materials.",
    stock: 60
  }
];

export const reviews = [
  { name: "Rahul Ahmed", text: "Amazing products and fast delivery! The quality is better than I expected. Highly recommended!", days: "2 days ago" },
  { name: "Sarah Khan", text: "Great customer service and easy return process. Will definitely shop again!", days: "4 days ago" },
  { name: "Imran Hossain", text: "The website is very user-friendly and the products are original. Love it!", days: "1 week ago" }
];