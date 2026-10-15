"use client";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/routing";
import { routing } from "@/src/i18n/routing";

export function AppearanceControls() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  return <div className="flex items-center gap-2">
    <label className="sr-only" htmlFor="locale">{t("locale")}</label>
    <select id="locale" value={locale} onChange={(event) => router.replace(pathname, { locale: event.target.value as (typeof routing.locales)[number] })} className="control-select" aria-label={t("locale")}>
      {routing.locales.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}
    </select>
    <label className="sr-only" htmlFor="theme">{t("theme")}</label>
    <select id="theme" value={theme ?? "system"} onChange={(event) => setTheme(event.target.value)} className="control-select" aria-label={t("theme")}>
      <option value="light">{t("light")}</option><option value="dark">{t("dark")}</option><option value="system">{t("system")}</option>
    </select>
  </div>;
}
