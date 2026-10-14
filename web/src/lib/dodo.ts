// Dodo Payments helpers. We use the REST API directly (no SDK dependency) — it's a
// single call. Everything degrades gracefully when the env isn't configured so the
// site runs before you've created a Dodo account.
//
// Required env for live checkout:
//   DODO_PAYMENTS_API_KEY   — Developer → API Keys
//   DODO_PRODUCT_ID         — the Pro Pack product (pdt_...)
//   DODO_ENVIRONMENT        — 'test_mode' (default) | 'live_mode'
// Optional:
//   NEXT_PUBLIC_DODO_PAYMENT_LINK — a static https://checkout.dodopayments.com/buy/... link

function apiBase(): string {
  return process.env.DODO_ENVIRONMENT === 'live_mode'
    ? 'https://live.dodopayments.com'
    : 'https://test.dodopayments.com'
}

export function dodoConfigured(): boolean {
  return Boolean(process.env.DODO_PAYMENTS_API_KEY && process.env.DODO_PRODUCT_ID)
}

/**
 * Create a hosted checkout session and return its URL, or null if Dodo isn't
 * configured (the caller falls back to the static link / a dev placeholder).
 */
export async function createCheckoutSession(input: {
  returnUrl: string
  email?: string
}): Promise<string | null> {
  if (!dodoConfigured()) return null
  const res = await fetch(`${apiBase()}/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      product_cart: [{ product_id: process.env.DODO_PRODUCT_ID, quantity: 1 }],
      ...(input.email ? { customer: { email: input.email } } : {}),
      return_url: input.returnUrl,
    }),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Dodo checkout failed (${res.status}): ${await res.text()}`)
  }
  const data = (await res.json()) as { checkout_url?: string }
  return data.checkout_url ?? null
}

export function staticPaymentLink(): string | null {
  return process.env.NEXT_PUBLIC_DODO_PAYMENT_LINK ?? null
}
