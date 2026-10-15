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

  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-5">
    <div className="flex justify-end"><AppearanceControls /></div>
    <form onSubmit={submit} className="panel-card w-full space-y-5 p-8 shadow-xl">
      <p className="text-sm font-semibold text-primary">FondUz</p>
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <label className="block space-y-2 text-sm">{t("email")}<input className="control-input w-full" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label className="block space-y-2 text-sm">{t("password")}<input className="control-input w-full" type="password" autoComplete="current-password" required maxLength={200} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
      <button disabled={loading} className="w-full rounded-xl bg-primary p-3 font-semibold text-white disabled:opacity-50">{loading ? t("submitting") : t("submit")}</button>
    </form>
  </main>;
}
