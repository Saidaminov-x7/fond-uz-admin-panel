# FondUz Admin

Next.js admin panel for managing news, FAQs, doctors, care areas, partner organizations, and prices in the FondUz API.

## Run locally

Install with `npm ci`, set `API_URL` to the backend origin and set `JWT_SECRET` to the same value used by the API. If the backend requires the Cloudflare origin header, set the matching `CLOUDFLARE_ORIGIN_SECRET` in this app's server environment too. Start with `npm run dev`.

The admin login calls the backend and stores its signed session in an HttpOnly, Secure (in production), SameSite cookie. No API keys or admin passwords belong in this repository or in `NEXT_PUBLIC_*` variables.

## Deploy

Deploy this folder as its own Vercel project. Set `API_URL`, `JWT_SECRET`, and, when enabled at the backend, `CLOUDFLARE_ORIGIN_SECRET` as server-only environment variables. Add the resulting Vercel origin to the backend `CORS_ORIGINS` list.
