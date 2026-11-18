import type { CartItem, Order } from "../types";

export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  role: "customer" | "admin";
  registeredAt: string;
};

const defaultAdmin: RegisteredUser = {
  id: "admin-1",
  name: "ShopMate Admin",
  email: "admin@shopmate.com",
  phone: "+880 1614703406",
  password: "admin123",
  address: "Banani, Dhaka",
  city: "Dhaka",
  role: "admin",
  registeredAt: "2026-01-01T00:00:00.000Z",
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined" || raw === "null") return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const getCart = (): CartItem[] => {
  const c = read<CartItem[]>("shopmate_cart", []);
  return Array.isArray(c) ? c : [];
};
export const saveCart = (cart: CartItem[]) => localStorage.setItem("shopmate_cart", JSON.stringify(cart || []));

export const getWishlist = (): string[] => {
  const w = read<string[]>("shopmate_wishlist", []);
  return Array.isArray(w) ? w : [];
};
export const saveWishlist = (ids: string[]) => localStorage.setItem("shopmate_wishlist", JSON.stringify(ids || []));

export const getOrders = (): Order[] => {
  const o = read<Order[]>("shopmate_orders", []);
  return Array.isArray(o) ? o : [];
};
export const saveOrders = (orders: Order[]) => localStorage.setItem("shopmate_orders", JSON.stringify(orders || []));

export const getUser = () => read<RegisteredUser | {name: string; email: string; role?: string} | null>("shopmate_user", null);
export const saveUser = (user: any) => localStorage.setItem("shopmate_user", JSON.stringify(user));
export const clearUser = () => localStorage.removeItem("shopmate_user");

export const getRegisteredUsers = (): RegisteredUser[] => {
  const users = read<RegisteredUser[]>("shopmate_registered_users", []);
  if (!users.some((u) => u.email.toLowerCase() === defaultAdmin.email.toLowerCase())) {
    users.unshift(defaultAdmin);
    saveRegisteredUsers(users);
  }
  return users;
};

export const saveRegisteredUsers = (users: RegisteredUser[]) => {
  localStorage.setItem("shopmate_registered_users", JSON.stringify(users));
};

export const registerUser = (
  userData: Omit<RegisteredUser, "id" | "registeredAt">
): { success: boolean; message: string; user?: RegisteredUser } => {
  const normalizedEmail = userData.email.trim().toLowerCase();
  const users = getRegisteredUsers();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return {
      success: false,
      message: "⚠️ An account with this email already exists. Please Sign In.",
    };
  }

  const newUser: RegisteredUser = {
    ...userData,
    id: "usr-" + Date.now().toString().slice(-6),
    email: normalizedEmail,
    role: normalizedEmail === "admin@shopmate.com" ? "admin" : "customer",
    registeredAt: new Date().toISOString(),
  };

  const updated = [newUser, ...users];
  saveRegisteredUsers(updated);

  return {
    success: true,
    message: "🎉 Account created successfully!",
    user: newUser,
  };
};

export const loginUser = (
  email: string,
  pass: string
): { success: boolean; message: string; user?: RegisteredUser } => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!found) {
    return {
      success: false,
      message: "❌ Account not found! You must Sign Up with your full information first before signing in.",
    };
  }

  if (found.password !== pass) {
    return {
      success: false,
      message: "❌ Incorrect password. Please check your credentials.",
    };
  }

  return {
    success: true,
    message: "Login successful!",
    user: found,
  };
};