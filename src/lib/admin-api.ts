import { cookies, headers as requestHeaders } from "next/headers";

const apiBase = process.env.API_URL?.trim();

export async function adminApi(path: string, init: RequestInit = {}) {
  if (!apiBase) return Response.json({ error: "API_URL is not configured" }, { status: 503 });
  const token = (await cookies()).get("session")?.value;
  const clientHeaders = await requestHeaders();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (process.env.CLOUDFLARE_ORIGIN_SECRET) headers.set("X-FondUz-Origin", process.env.CLOUDFLARE_ORIGIN_SECRET);
  const clientIp = clientHeaders.get("cf-connecting-ip");
  if (clientIp && /^[0-9a-fA-F:.]{3,45}$/.test(clientIp)) headers.set("CF-Connecting-IP", clientIp);
  if (token) headers.set("Cookie", `fond_session=${token}`);
  if (init.body) headers.set("Content-Type", "application/json");
  try {
    const response = await fetch(new URL(path, apiBase), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(8_000) });
    if (response.status === 204) return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    const body = await response.json().catch(() => ({ error: "Invalid API response" }));
    return Response.json(body, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "API unavailable" }, { status: 502 });
  }
}
