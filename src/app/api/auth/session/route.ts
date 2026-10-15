import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const apiBase = process.env.API_URL?.trim();
  const token = (await cookies()).get("session")?.value;
  if (!apiBase || !token) return NextResponse.json({ authenticated: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  try {
    const response = await fetch(new URL("/api/auth/session", apiBase), { headers: { Cookie: `fond_session=${token}`, Accept: "application/json", ...(process.env.CLOUDFLARE_ORIGIN_SECRET ? { "X-FondUz-Origin": process.env.CLOUDFLARE_ORIGIN_SECRET } : {}) }, cache: "no-store", signal: AbortSignal.timeout(5_000) });
    if (!response.ok) return NextResponse.json({ authenticated: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const body = await response.json();
    return NextResponse.json({ authenticated: true, email: body.user?.email }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
