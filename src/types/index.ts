export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  description: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  badge?: string;
};

export type CartItem = Product & { quantity: number; selectedSize?: string; selectedColor?: string };

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  customer: { name: string; email: string; phone: string; address: string; city: string; country: string; postalCode: string };
  payment: string;
  paymentDetails?: {
    method: string;
    transactionId?: string;
    senderNumber?: string;
    cardLast4?: string;
    paymentStatus: "Paid" | "Pending Verification" | "Unpaid";
  };
};