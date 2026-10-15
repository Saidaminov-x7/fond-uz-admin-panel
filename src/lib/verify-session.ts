function decodeSegment(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

export async function isAdminSessionValid(token: string | undefined) {
  const secret = process.env.JWT_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const header = JSON.parse(new TextDecoder().decode(decodeSegment(parts[0]))) as { alg?: string };
    const payload = JSON.parse(new TextDecoder().decode(decodeSegment(parts[1]))) as {
      sub?: string; role?: string; iss?: string; aud?: string | string[]; exp?: number;
    };
    if (header.alg !== "HS256" || payload.role !== "admin" || typeof payload.sub !== "string" || payload.iss !== "fond-uz-api" || payload.aud !== "fond-uz-admin" || typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now()) return false;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    return crypto.subtle.verify("HMAC", key, decodeSegment(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  } catch {
    return false;
  }
}
