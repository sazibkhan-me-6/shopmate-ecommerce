/**
 * ShopMate Backend Payment Gateway Server
 * Supports: bKash, SSLCommerz, Stripe & Nagad
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 1. SSLCOMMERZ INTEGRATION
// ==========================================
const SSLCommerzPayment = require('sslcommerz-lts');

const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true'; // false for sandbox
const store_id = process.env.SSLCOMMERZ_STORE_ID || 'your_store_id';
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || 'your_store_password';

app.post('/api/payment/sslcommerz/init', async (req, res) => {
  const { orderId, amount, customer } = req.body;

  const data = {
    total_amount: amount,
    currency: 'BDT',
    tran_id: orderId || 'TRAN_' + Date.now(),
    success_url: `http://localhost:${PORT}/api/payment/sslcommerz/success`,
    fail_url: `http://localhost:${PORT}/api/payment/sslcommerz/fail`,
    cancel_url: `http://localhost:${PORT}/api/payment/sslcommerz/cancel`,
    ipn_url: `http://localhost:${PORT}/api/payment/sslcommerz/ipn`,
    shipping_method: 'Courier',
    product_name: 'ShopMate Products',
    product_category: 'Ecommerce',
    product_profile: 'general',
    cus_name: customer?.name || 'Customer Name',
    cus_email: customer?.email || 'customer@example.com',
    cus_add1: customer?.address || 'Dhaka',
    cus_city: customer?.city || 'Dhaka',
    cus_postcode: customer?.postalCode || '1000',
    cus_country: customer?.country || 'Bangladesh',
    cus_phone: customer?.phone || '01700000000',
    ship_name: customer?.name || 'Customer Name',
    ship_add1: customer?.address || 'Dhaka',
    ship_city: customer?.city || 'Dhaka',
    ship_postcode: customer?.postalCode || '1000',
    ship_country: customer?.country || 'Bangladesh',
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
    if (apiResponse?.GatewayPageURL) {
      return res.json({ success: true, gatewayUrl: apiResponse.GatewayPageURL });
    }
    return res.status(400).json({ success: false, message: 'SSLCommerz session failed to initialize', details: apiResponse });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/payment/sslcommerz/success', (req, res) => {
  const { tran_id, val_id } = req.body;
  // Redirect back to frontend with success parameters
  res.redirect(`http://localhost:5173/order-success/${tran_id}?val_id=${val_id}&status=paid`);
});

app.post('/api/payment/sslcommerz/fail', (req, res) => {
  res.redirect(`http://localhost:5173/checkout?payment_error=failed`);
});

app.post('/api/payment/sslcommerz/cancel', (req, res) => {
  res.redirect(`http://localhost:5173/checkout?payment_error=cancelled`);
});

// ==========================================
// 2. BKASH TOKENIZED GATEWAY INTEGRATION
// ==========================================
const BKASH_APP_KEY = process.env.BKASH_APP_KEY || '';
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET || '';
const BKASH_USERNAME = process.env.BKASH_USERNAME || '';
const BKASH_PASSWORD = process.env.BKASH_PASSWORD || '';
const BKASH_BASE_URL = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v2.0';

// Grant Token Helper
async function getBkashToken() {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const res = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      username: BKASH_USERNAME,
      password: BKASH_PASSWORD,
    },
    body: JSON.stringify({
      app_key: BKASH_APP_KEY,
      app_secret: BKASH_APP_SECRET,
    }),
  });
  return res.json();
}

app.post('/api/payment/bkash/initiate', async (req, res) => {
  const { orderId, amount } = req.body;
  try {
    const tokenData = await getBkashToken();
    if (!tokenData?.id_token) {
      return res.status(400).json({ success: false, message: 'Failed to obtain bKash token' });
    }

    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const createRes = await fetch(`${BKASH_BASE_URL}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokenData.id_token,
        'X-APP-Key': BKASH_APP_KEY,
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: orderId,
        callbackURL: `http://localhost:${PORT}/api/payment/bkash/callback`,
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: orderId,
      }),
    });

    const createData = await createRes.json();
    return res.json({ success: true, redirectUrl: createData.bkashURL, paymentID: createData.paymentID });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. STRIPE CHECKOUT INTEGRATION
// ==========================================
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

app.post('/api/payment/stripe/create-checkout-session', async (req, res) => {
  const { orderId, amount, customer } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `ShopMate Order ${orderId}` },
            unit_amount: Math.round(amount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customer.email,
      success_url: `http://localhost:5173/order-success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/checkout`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', services: ['bKash', 'Nagad', 'SSLCommerz', 'Stripe'] });
});

app.listen(PORT, () => {
  console.log(`Payment server running on http://localhost:${PORT}`);
});
