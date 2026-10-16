"use client";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/routing";
import { AppearanceControls } from "@/src/components/AppearanceControls";

const navigation = [
  { href: "/admin", key: "overview" },
  { href: "/admin/news", key: "news" },
  { href: "/admin/faqs", key: "faqs" },
  { href: "/admin/doctors", key: "doctors" },
  { href: "/admin/prices", key: "prices" },
  { href: "/admin/services", key: "services" },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => {
        if (!active) return;
        if (response.ok) setReady(true);
        else router.replace("/login");
      })
      .catch(() => router.replace("/login"));
    return () => { active = false; };
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  if (!ready) return <div className="grid min-h-screen place-items-center text-sm text-muted">{tCommon("loading")}</div>;

  return <div className="min-h-screen lg:flex">
    <aside className="hidden w-72 shrink-0 border-r border-border bg-panel p-5 lg:block">
      <Link className="flex items-center gap-3 border-b border-border px-3 py-5 text-lg font-bold text-foreground" href="/admin"><span className="grid size-9 place-items-center rounded-md bg-primary text-xs font-black text-white">FU</span><span>{tCommon("brand")}</span></Link>
      <p className="px-3 pt-7 text-[10px] font-bold uppercase tracking-[.2em] text-muted">FondUz</p>
      <nav className="mt-3 space-y-1" aria-label={tCommon("panel")}>
        {navigation.map((item) => <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "nav-link-active" : ""}`}>{tNav(item.key)}</Link>)}
      </nav>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-panel px-4 py-3 sm:px-7">
        <button className="rounded-lg border border-border px-3 py-2 text-sm lg:hidden" onClick={() => setMenu((value) => !value)} aria-expanded={menu} aria-controls="mobile-admin-navigation">{tCommon("menu")}</button>
        <span className="hidden text-sm font-semibold sm:block">{tCommon("panel")}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2"><AppearanceControls /><button onClick={() => void logout()} className="rounded-lg border border-border px-3 py-2 text-sm">{tCommon("logout")}</button></div>
      </header>
      {menu && <nav id="mobile-admin-navigation" className="grid gap-1 border-b border-border bg-panel p-3 lg:hidden" aria-label={tCommon("panel")}>{navigation.map((item) => <Link onClick={() => setMenu(false)} key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "nav-link-active" : ""}`}>{tNav(item.key)}</Link>)}</nav>}
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-7">{children}</main>
    </div>
  </div>;
}
