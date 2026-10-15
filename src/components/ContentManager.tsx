"use client";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type Collection = "news" | "faqs" | "doctors" | "prices" | "services" | "funds";
type Item = { id: string; [key: string]: unknown };
const fields: Record<Collection, string[]> = {
  news: ["slug", "title", "titleEn", "titleUz", "subtitle", "subtitleEn", "subtitleUz", "date", "image", "content", "contentEn", "contentUz"],
  faqs: ["question", "questionEn", "questionUz", "answer", "answerEn", "answerUz"],
  doctors: ["name", "nameEn", "nameUz", "specialty", "specialtyEn", "specialtyUz", "bio", "bioEn", "bioUz", "email", "phone", "image"],
  prices: ["title", "titleEn", "titleUz", "price", "priceEn", "priceUz", "includes", "includesEn", "includesUz"],
  services: ["slug", "name", "nameEn", "nameUz", "description", "descriptionEn", "descriptionUz", "fundsCount"],
  funds: ["professionSlug", "name", "nameEn", "nameUz", "phone", "website", "description", "descriptionEn", "descriptionUz"],
};
const textFields = new Set(["content", "contentEn", "contentUz", "includes", "includesEn", "includesUz", "bio", "bioEn", "bioUz", "answer", "answerEn", "answerUz", "description", "descriptionEn", "descriptionUz"]);
const listFields = new Set(["content", "contentEn", "contentUz", "includes", "includesEn", "includesUz"]);

function fieldValue(item: Item, key: string) {
  const current = item[key];
  return Array.isArray(current) ? current.join("\n") : String(current ?? "");
}
function parseField(key: string, raw: string): unknown {
  if (listFields.has(key)) return raw.split("\n").map((line) => line.trim()).filter(Boolean);
  if (key === "fundsCount") return Math.max(0, Math.min(10_000, Number(raw) || 0));
  return raw.trim();
}

export function ContentManager({ collection, title }: { collection: Collection; title: string }) {
  const t = useTranslations();
  const [items, setItems] = useState<Item[]>([]);
  const [edit, setEdit] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const response = await fetch(`/api/admin/${collection}`, { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || t("common.loadError"));
    setItems(Array.isArray(body.items) ? body.items : []);
  }, [collection, t]);

  useEffect(() => {
    let active = true;
    setBusy(true);
    fetch(`/api/admin/${collection}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || t("common.loadError"));
        if (active) setItems(Array.isArray(body.items) ? body.items : []);
      })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : t("common.loadError")); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [collection, t]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!edit) return;
    setBusy(true); setError(""); setNotice("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(fields[collection].map((key) => [key, parseField(key, String(form.get(key) ?? ""))]));
    try {
      const response = await fetch(`/api/admin/${collection}${edit.id ? `/${encodeURIComponent(edit.id)}` : ""}`, {
        method: edit.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || t("common.saveError"));
      setEdit(null); await refresh(); setNotice(t("messages.saved"));
    } catch (reason) { setError(reason instanceof Error ? reason.message : t("common.saveError")); }
    finally { setBusy(false); }
  }

  async function remove(item: Item) {
    if (!window.confirm(t("common.deleteConfirm"))) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/${collection}/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error(t("common.deleteError"));
      await refresh(); setNotice(t("messages.deleted"));
    } catch (reason) { setError(reason instanceof Error ? reason.message : t("common.deleteError")); }
    finally { setBusy(false); }
  }

  const visible = useMemo(() => items.filter((item) => JSON.stringify(item).toLocaleLowerCase().includes(query.toLocaleLowerCase())), [items, query]);
  return <section className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-semibold text-primary">{t("common.content")}</p><h1 className="mt-1 text-3xl font-bold">{title}</h1><p className="mt-2 text-sm text-muted">{t("common.records")}: {items.length}</p></div>
      <div className="flex gap-2"><input aria-label={t("common.search")} placeholder={`${t("common.search")}…`} className="control-input min-w-0" value={query} onChange={(event) => setQuery(event.target.value)} /><button onClick={() => { setError(""); setNotice(""); setEdit({ id: "" }); }} className="shrink-0 rounded-xl bg-primary px-4 py-2 font-semibold text-white">{t("common.add")}</button></div>
    </div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">{error}</p>}
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{notice}</p>}
    {edit && <form onSubmit={save} className="panel-card grid gap-4 p-5 sm:grid-cols-2">
      {fields[collection].map((key) => <label className="space-y-1 text-sm" key={key}>
        <span className="font-medium">{t(`fields.${key}`)}</span>
        {textFields.has(key) ? <textarea rows={4} name={key} defaultValue={edit.id ? fieldValue(edit, key) : ""} maxLength={8_000} className="control-input min-h-24 w-full resize-y" /> : <input name={key} type={key === "date" ? "date" : key === "fundsCount" ? "number" : "text"} min={key === "fundsCount" ? 0 : undefined} max={key === "fundsCount" ? 10_000 : undefined} required={["title", "question", "name", "slug", "specialty", "price", "description", "answer", "professionSlug", "website"].includes(key)} maxLength={2_000} defaultValue={edit.id ? fieldValue(edit, key) : ""} className="control-input w-full" />}
      </label>)}
      <div className="flex gap-2 sm:col-span-2"><button disabled={busy} className="rounded-xl bg-primary px-5 py-2 font-semibold text-white disabled:opacity-50">{t("common.save")}</button><button type="button" onClick={() => setEdit(null)} className="rounded-xl border border-border px-5 py-2">{t("common.cancel")}</button></div>
    </form>}
    <div className="overflow-hidden rounded-2xl border border-border bg-panel">
      <div className="hidden grid-cols-[minmax(0,1fr)_auto] border-b border-border bg-subtle px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted sm:grid"><span>{t("common.content")}</span><span>{t("common.actions")}</span></div>
      {busy && !items.length ? <p className="p-6 text-sm text-muted">{t("common.loading")}</p> : visible.length ? visible.map((item) => <article key={item.id} className="flex flex-col gap-4 border-b border-border p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="min-w-0"><h2 className="break-words font-semibold">{String(item.title ?? item.name ?? item.question ?? item.slug ?? t("common.content"))}</h2><p className="mt-1 break-words text-sm text-muted">{String(item.subtitle ?? item.specialty ?? item.answer ?? item.description ?? item.price ?? "")}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => setEdit(item)} className="rounded-lg border border-border px-3 py-2 text-sm">{t("common.edit")}</button><button onClick={() => void remove(item)} className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 dark:text-red-300">{t("common.delete")}</button></div></article>) : <p className="p-6 text-sm text-muted">{t("common.empty")}</p>}
    </div>
  </section>;
}
