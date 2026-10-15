# claudetones — web

The marketing site + license backend for the [claudetones](../) Claude Code plugin.

- **Landing page** with an A/B soundboard (free vs. Pro for all 7 events)
- **Checkout** through Dodo Payments
- **`/api/webhook`** — mints a `CLAUDETONES-XXXX-YYYY` key on `payment.succeeded`
- **`/api/verify`** — the endpoint the plugin calls from `/claudetones unlock`
- **`/success`** — reveals the key after purchase and shows the unlock command

It runs with **zero configuration** in development (a local JSON store and a dev
"mint a test key" button). Point it at Supabase + Dodo for production.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

Without env vars, buying a key goes to `/success?dev=1`, which mints a throwaway
key into `web/.data/licenses.json`. Test the full loop:

```bash
# mint a key
curl -s -X POST localhost:3000/api/dev/mint | jq -r .key

# verify it (this is what the plugin does)
curl -s -X POST localhost:3000/api/verify \
  -H 'content-type: application/json' \
  -d '{"key":"CLAUDETONES-XXXX-YYYY"}'
```

## Environment

Copy `.env.example` to `.env.local` and fill in what you have.

| Variable | Needed | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | prod | Canonical URL; builds the Dodo `return_url` |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | prod | License storage (see below) |
| `DODO_PAYMENTS_API_KEY` / `DODO_PRODUCT_ID` | prod | Checkout sessions |
| `DODO_ENVIRONMENT` | prod | `test_mode` (default) or `live_mode` |
| `DODO_PAYMENTS_WEBHOOK_KEY` | prod | Webhook signature verification |
| `RESEND_API_KEY` / `EMAIL_FROM` | optional | Email the key to buyers |

In production, `/api/webhook` **refuses unverified requests** and license storage
**requires** Supabase — the local JSON store is dev-only.

## Supabase

Run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL editor. It creates a
single `licenses` table with RLS enabled and no policies, so only the service role
(the server) can touch it.

## Dodo Payments

1. Create a product (one-time) for the Pro Pack → copy its `pdt_...` id.
2. Set the webhook endpoint to `https://<your-domain>/api/webhook` and copy the
   signing secret into `DODO_PAYMENTS_WEBHOOK_KEY`.
3. Subscribe to at least `payment.succeeded`.

The webhook is idempotent per `payment_id`. If `RESEND_API_KEY` is unset, buyers
still get their key from `/success` (Dodo appends `payment_id` + `email` to the
`return_url`).

## Deploy

Vercel → set the project **root directory to `web`** → add the env vars above.

## Before launch (TODO)

- [ ] Move the Pro clips out of `public/sounds/` to the private R2 bucket and
      serve them through authenticated, watermarked, presigned URLs. Right now the
      site ships full-length Pro previews, which is fine for pre-launch only.
- [ ] Remove `OFFLINE_UNLOCK` in `../hooks/register.ts` so the plugin trusts only
      this backend.
- [ ] Add rate limiting to `/api/verify` and `/api/license/claim`.
