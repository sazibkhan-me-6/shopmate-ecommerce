/**
 * Production integration boundary.
 * Replace these functions with Supabase/Firebase/server API calls.
 * Never put service-role keys or payment secrets in the browser.
 */
export async function createOrderOnServer(payload: unknown) {
  // TODO: POST to your secure server/API route.
  return { ok: true, payload };
}
export async function createPaymentIntent(payload: unknown) {
  // TODO: Call a secure backend endpoint that creates the payment intent.
  return { ok: true, clientSecret: null, payload };
}