import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { isAdminSessionValid } from "./lib/verify-session";
const intl = createMiddleware(routing);
function createCsp() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const nonce = btoa(String.fromCharCode(...bytes));
  const devScript = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  const upgrade = process.env.NODE_ENV === "production" ? " upgrade-insecure-requests;" : "";
  return `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devScript}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';${upgrade}`;
}
function secureResponse(response: NextResponse, policy: string) {
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}
export default async function middleware(request: NextRequest) {
  const originSecret = process.env.CLOUDFLARE_ORIGIN_SECRET;
  if (originSecret && request.headers.get("x-fonduz-origin") !== originSecret) return new Response("Forbidden", { status: 403 });
  const policy = createCsp();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", policy);
  requestHeaders.set("x-nonce", policy.match(/'nonce-([^']+)'/)?.[1] ?? "");
  const nonceRequest = new NextRequest(request, { headers: requestHeaders });
  if (request.nextUrl.pathname.startsWith("/api")) return secureResponse(NextResponse.next({ request: { headers: requestHeaders } }), policy);
  if (request.nextUrl.pathname.includes("_next") || request.nextUrl.pathname.includes(".")) return secureResponse(NextResponse.next({ request: { headers: requestHeaders } }), policy);
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = parts[0];
  if (parts[1] === "admin" && !(await isAdminSessionValid(request.cookies.get("session")?.value))) {
    const target = request.nextUrl.clone(); target.pathname = `/${locale}/login`; return secureResponse(NextResponse.redirect(target), policy);
  }
  return secureResponse(intl(nonceRequest), policy);
}
export const config = { matcher: ["/", "/api/:path*", "/(ru|en|uz)/:path*", "/((?!_next|_vercel|.*\\..*).*)"] };
