/**
 * ShopMate Production API Service
 * Directly integrated with the Live Central Admin Panel:
 * https://shopmate-admin-panel.vercel.app/
 */

export const ADMIN_PANEL_URL = "https://shopmate-admin-panel.vercel.app";
export const ADMIN_API_BASE = `${ADMIN_PANEL_URL}/api`;

export interface AdminStoreConfig {
  storeName: string;
  storeUrl: string;
  status: "online" | "maintenance";
  announcement?: {
    active: boolean;
    text: string;
  };
  coupons?: {
    code: string;
    discountPercent: number;
    active: boolean;
  }[];
  currency?: {
    primary: string;
    bdtRate: number;
  };
  support?: {
    email: string;
    phone: string;
    whatsapp: string;
  };
  paymentGateways?: {
    id: string;
    name: string;
    enabled: boolean;
    merchantNumber?: string;
  }[];
  products?: any[];
  categories?: any[];
}

/**
 * Dispatch newly placed order directly to https://shopmate-admin-panel.vercel.app/api/orders
 * so store administrators can view customer details, phone, address, and verify payment.
 */
export async function createOrderOnServer(orderPayload: any): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const formattedPayload = {
      id: orderPayload?.id || "#SM-" + Math.floor(1000 + Math.random() * 9000),
      customer: {
        name: orderPayload?.customer?.name || "Customer",
        email: orderPayload?.customer?.email || "",
        phone: orderPayload?.customer?.phone || "N/A",
        address: orderPayload?.customer?.address || "",
        city: orderPayload?.customer?.city || "Dhaka",
        postalCode: orderPayload?.customer?.postalCode || "1000",
      },
      items: orderPayload?.items || [],
      total: orderPayload?.total || 0,
      payment: orderPayload?.payment || orderPayload?.paymentDetails?.method || "Cash on Delivery",
      paymentDetails: orderPayload?.paymentDetails || {},
      status: orderPayload?.status || "Processing",
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(`${ADMIN_API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedPayload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✅ Order synced with ShopMate Admin Panel:", data);
      return { ok: true, data };
    } else {
      console.warn("⚠️ Admin panel order endpoint responded with non-200 status:", res.status);
    }
  } catch (error: any) {
    console.warn("Could not sync order to ShopMate Admin Panel (using local store):", error?.message);
  }
  return { ok: false, data: orderPayload };
}

/**
 * Fetch live store configuration (announcement banner, coupons, exchange rates, etc.)
 * from the live Admin Panel: https://shopmate-admin-panel.vercel.app/api/store
 */
export async function fetchStoreConfig(): Promise<AdminStoreConfig | null> {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/store`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data as AdminStoreConfig;
      }
    }
  } catch (error: any) {
    console.warn("Could not fetch store config from ShopMate Admin Panel:", error?.message);
  }
  return null;
}

/**
 * Payment intent helper
 */
export async function createPaymentIntent(payload: unknown) {
  return { ok: true, clientSecret: null, payload };
}
