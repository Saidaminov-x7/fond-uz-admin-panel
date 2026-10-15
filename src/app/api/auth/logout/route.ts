import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const token = (await cookies()).get("session")?.value;
  const apiBase = process.env.API_URL?.trim();
  if (apiBase && token) {
    try { await fetch(new URL("/api/auth/logout", apiBase), { method: "POST", headers: { Cookie: `fond_session=${token}`, ...(process.env.CLOUDFLARE_ORIGIN_SECRET ? { "X-FondUz-Origin": process.env.CLOUDFLARE_ORIGIN_SECRET } : {}) }, cache: "no-store", signal: AbortSignal.timeout(5_000) }); } catch { /* Local cookie is still cleared below. */ }
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
