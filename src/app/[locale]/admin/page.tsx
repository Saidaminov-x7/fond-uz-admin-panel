import Link from "next/link";
import { getTranslations } from "next-intl/server";

const resources = [
  { slug: "news", key: "news" },
  { slug: "faqs", key: "faqs" },
  { slug: "doctors", key: "doctors" },
  { slug: "prices", key: "prices" },
  { slug: "services", key: "services" },
  { slug: "funds", key: "funds" },
] as const;

export default async function Dashboard() {
  const t = await getTranslations();
  return <section className="space-y-8 sm:space-y-10">
    <div className="grid gap-5 border-b border-border pb-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">FondUz <span aria-hidden="true">/</span> {t("dashboard.eyebrow")}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("dashboard.title")}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted">{t("dashboard.description")}</p></div>
      <span className="inline-flex w-fit items-center gap-2 border-l-2 border-primary bg-sage px-3 py-2 text-xs font-semibold text-foreground"><span className="size-2 rounded-full bg-primary" />FondUz</span>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((item, index) => <Link key={item.slug} href={`/admin/${item.slug}`} className="group panel-card flex min-h-44 flex-col justify-between p-5 transition-colors hover:border-primary hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6">
        <div className="flex items-center justify-between"><span className="text-[11px] font-bold tracking-[.14em] text-muted">{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true" className="text-lg text-primary transition-transform group-hover:translate-x-1">→</span></div>
        <div><h2 className="text-lg font-semibold tracking-tight">{t(`navigation.${item.key}`)}</h2><p className="mt-2 text-sm text-muted">{t("dashboard.edit")}</p></div>
      </Link>)}
    </div>
  </section>;
}
