# FondUz Admin

Next.js 15 content management panel for news, FAQs, doctors, care areas, partner organisations, and prices stored in the FondUz API. The panel uses localized Russian, English, and Uzbek routes.

## Local development

```powershell
npm ci
npm run dev
```

Set server-only `API_URL` to the backend origin and `JWT_SECRET` to the same value configured in the API. If the backend checks a Cloudflare origin header, configure the same `CLOUDFLARE_ORIGIN_SECRET` on this server. Do not use `NEXT_PUBLIC_*` for credentials.

## Content workflow

Sign in at `/ru/login`, `/en/login`, or `/uz/login`. The overview links to each collection and loads counts from the authenticated API. Collection pages support search, pagination, create, edit, and delete operations; translated fields are entered separately for Russian, English, and Uzbek. The dashboard includes news, FAQs, doctors, prices, care areas, and partner organizations. Content is saved through the server-side API proxy; user-provided copy is treated as text by the public website.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
```

`npm run lint` and `npm run typecheck` are quick local checks. `npm run build` produces the production Next.js bundle. Visit a locale login route to authenticate; the page forwards credentials to the API and stores the session in an HttpOnly, Secure-in-production, SameSite cookie. Admin pages check the session before displaying content. API requests and mutations use a server-side proxy.

## Deployment

Deploy this folder as a separate Vercel project. Set `API_URL`, `JWT_SECRET`, and optional `CLOUDFLARE_ORIGIN_SECRET` as private server variables. Add the exact admin origin to API `CORS_ORIGINS`. Keep admin passwords and signing keys in the hosting provider's encrypted variable store.

For FondUz, the public website is available at [fond-uz.vercel.app](https://fond-uz.vercel.app); its `/ru/login` route uses the same-origin auth proxy. The backend is deployed independently on Railway. After a deployment, check the locale home page, login page, and at least one collection in the admin panel. Verify login with the account configured in Railway and check that a create/edit action appears on the public site. A successful static build alone does not establish that the API, credentials, or browser session work.
