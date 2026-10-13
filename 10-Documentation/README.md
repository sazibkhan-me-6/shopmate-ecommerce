# ShopMate E-commerce Website

A modern, responsive React + TypeScript + Tailwind-ready e-commerce store with integrated Bangladeshi & International payment gateways (bKash, Nagad, SSLCommerz, Stripe, and Cash on Delivery).

## Features Included
- **Homepage:** Responsive hero banner, category grid, product showcase, promo cards, and customer reviews.
- **Product Catalog:** Real-time search, category filters, price range, ratings, and sorting.
- **Product Details:** High-resolution galleries, size/color variant selection, stock status, and related items.
- **Cart & Coupons:** Persistent cart with coupon discounts (`SAVE10`, `WELCOME20`).
- **Payment Gateways Integrated:**
  - **bKash (বিকাশ):** Personal/Merchant number, BDT conversion, TrxID & sender mobile number verification.
  - **Nagad (নগদ):** Step-by-step payment instructions with TrxID validation.
  - **SSLCommerz:** Support for Visa, Mastercard, Internet Banking, Rocket, Upay, and mobile wallets.
  - **Stripe:** International Credit & Debit Card checkout.
  - **Cash on Delivery (COD):** Pay upon delivery.
- **Order Tracking & Success:** Order confirmation screen with transaction ID receipt and payment status.
- **Admin Panel:** Real-time order monitoring, payment verification, and product catalog management.
- **Dark Mode:** System and manual toggle.

---

## Folder Structure
```
ShopMate-Ecommerce-Website/
├── Ecommerce-Website-ShopMate/
│   ├── src/                    # Complete React + Vite TypeScript source code
│   │   ├── components/         # Header, Footer, Hero, ProductCard
│   │   ├── pages/              # Checkout, Home, Shop, ProductDetails, Cart, Admin, etc.
│   │   ├── services/           # payment.ts, storage.ts, api.ts
│   │   └── types/              # TypeScript models with payment details
│   ├── server/                 # Express Backend for bKash, SSLCommerz & Stripe
│   │   ├── server.js           # Live payment routes & webhook endpoints
│   │   ├── package.json        # Server dependencies
│   │   └── .env.example        # Payment credentials template
│   ├── 01-Frontend/ to 10-Documentation/  # Modular stage folders
│   └── package.json            # Frontend package config
├── preview.html                # Standalone interactive browser preview
└── README.md
```

---

## How to Run

### 1. Quick Browser Preview (No installation required)
Double-click `preview.html` on your desktop or open it in any browser (Chrome, Edge, Opera) to test categories, cart, bKash/Nagad checkout, and admin panel immediately.

### 2. Full React App (When Node.js is installed)
1. Open this folder in VS Code or Terminal.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Payment Backend Server (Optional for live production)
1. Navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your merchant credentials:
   - `SSLCOMMERZ_STORE_ID` & `SSLCOMMERZ_STORE_PASSWORD`
   - `BKASH_APP_KEY`, `BKASH_APP_SECRET`, etc.
   - `STRIPE_SECRET_KEY`
3. Start the payment server:
   ```bash
   node server.js
   ```
