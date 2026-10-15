import { adminApi } from "@/src/lib/admin-api";

type Context = { params: Promise<{ path: string[] }> };
const collections = ["users", "doctors", "services", "funds", "news", "faqs", "prices"];
async function forward(request: Request, context: Context) {
  const { path } = await context.params;
  if (!path?.length || path.length > 2 || !collections.includes(path[0]) || path.some((part) => !/^[a-z0-9-]{1,100}$/i.test(part))) return Response.json({ error: "Not found" }, { status: 404 });
  if (path[0] === "users" && (request.method !== "GET" || path.length !== 1)) return Response.json({ error: "Not found" }, { status: 404 });
  const url = new URL(request.url);
  const query = new URLSearchParams([...url.searchParams.entries()].filter(([key]) => ["limit", "offset"].includes(key))).toString();
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  const backendPath = path[0] === "users" ? "/api/users/all" : `/api/${path.join("/")}`;
  return adminApi(`${backendPath}${query ? `?${query}` : ""}`, { method: request.method, body, headers: { "Content-Type": "application/json" } });
}
export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
