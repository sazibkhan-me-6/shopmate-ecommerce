import type { CartItem, Order } from "../types";

const read = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
};

export const getCart = (): CartItem[] => read<CartItem[]>("shopmate_cart", []);
export const saveCart = (cart: CartItem[]) => localStorage.setItem("shopmate_cart", JSON.stringify(cart));

export const getWishlist = (): string[] => read<string[]>("shopmate_wishlist", []);
export const saveWishlist = (ids: string[]) => localStorage.setItem("shopmate_wishlist", JSON.stringify(ids));

export const getOrders = (): Order[] => read<Order[]>("shopmate_orders", []);
export const saveOrders = (orders: Order[]) => localStorage.setItem("shopmate_orders", JSON.stringify(orders));

export const getUser = () => read<{name: string; email: string; role?: string} | null>("shopmate_user", null);
export const saveUser = (user: {name: string; email: string; role?: string}) => localStorage.setItem("shopmate_user", JSON.stringify(user));
export const clearUser = () => localStorage.removeItem("shopmate_user");