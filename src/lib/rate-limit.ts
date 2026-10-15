const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(request: Request, namespace: string, limit: number, windowMs: number) {
  const forwarded = request.headers.get("cf-connecting-ip")?.trim();
  const client = forwarded && /^[0-9a-fA-F:.]{3,45}$/.test(forwarded) ? forwarded : "shared-origin";
  const key = `${namespace}:${client}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.reset <= now) { buckets.set(key, { count: 1, reset: now + windowMs }); return false; }
  current.count++;
  if (buckets.size > 5_000) for (const [entry, bucket] of buckets) if (bucket.reset <= now) buckets.delete(entry);
  return current.count > limit;
}
