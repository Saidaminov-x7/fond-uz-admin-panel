"use client";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { AppearanceControls } from "@/src/components/AppearanceControls";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!response.ok) { setError(response.status === 502 || response.status === 503 ? t("unavailable") : t("invalid")); return; }
      router.replace("/admin"); router.refresh();
    } catch { setError(t("unavailable")); }
    finally { setLoading(false); }
  }

  return <main className="min-h-screen bg-background px-4 py-5 sm:px-6 sm:py-8">
    <div className="mx-auto flex min-h-[calc(100svh-2.5rem)] w-full max-w-6xl flex-col">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-sm bg-primary text-xs font-black text-white">FU</span><span className="admin-wordmark text-2xl font-semibold">FondUz</span></div>
        <AppearanceControls />
      </header>
      <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
        <form onSubmit={submit} className="panel-card w-full max-w-md space-y-6 p-6 sm:p-8">
          <div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">FondUz / Admin</p><h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h1></div>
          <label className="block space-y-2 text-sm font-medium">{t("email")}<input className="control-input w-full" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="block space-y-2 text-sm font-medium">{t("password")}<input className="control-input w-full" type="password" autoComplete="current-password" required maxLength={200} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">{error}</p>}
          <button disabled={loading} className="button-primary w-full rounded-md px-4 py-3 font-semibold disabled:opacity-50">{loading ? t("submitting") : t("submit")}</button>
        </form>
      </div>
    </div>
  </main>;
}
