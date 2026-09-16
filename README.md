# ShopMate E-commerce Website

A modern, responsive React + TypeScript + Tailwind-ready e-commerce frontend inspired by the supplied ShopMate reference image.

## Included
- Responsive homepage matching the supplied visual direction
- Shop/product listing with search, category, price, rating and sorting
- Product details with gallery, variants, quantity, wishlist and related products
- Functional cart using localStorage
- Coupon codes: `SAVE10`, `WELCOME20`
- Checkout with Cash on Delivery and card/online payment placeholders
- Demo authentication stored locally for development
- User profile, orders and wishlist
- Admin dashboard with product/order/customer/coupon demo management
- Dark mode
- Accessible keyboard-friendly buttons and navigation
- SEO meta tags
- Modular data/services structure ready for Supabase/Firebase integration

## Run locally
1. Install Node.js 18+.
2. Open this folder in VS Code.
3. Run:
   `npm install`
4. Start:
   `npm run dev`
5. Open the Vite URL shown in the terminal.

## Production backend
The included app uses localStorage for demo persistence so it works immediately without credentials. For production:
- Connect Supabase/Firebase in `src/services/`.
- Move authentication and order validation to server-side code.
- Add a server-side payment endpoint/webhook.
- Never expose secret payment/database keys in frontend code.
- Configure real shipping/tax rules and email notifications.

## Demo admin
Login with:
Email: `admin@shopmate.com`
Password: `admin123`

This is only a local demo credential. Replace it with real server-side authentication before deployment.
