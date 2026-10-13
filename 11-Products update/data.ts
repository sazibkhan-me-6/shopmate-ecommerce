import productsJson from "./products.json";

export interface Product {
  id: number | string;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  img: string;
  colors?: string[];
  sizes?: string[];
  description?: string;
}

export const products: Product[] = productsJson as Product[];

export const categories = [
  ["Electronics", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80"],
  ["Fashion", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80"],
  ["Home & Living", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80"],
  ["Beauty & Health", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80"],
  ["Sports & Fitness", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80"],
  ["Books", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80"],
  ["Toys & Games", "https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&w=500&q=80"],
  ["Accessories", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80"]
];
