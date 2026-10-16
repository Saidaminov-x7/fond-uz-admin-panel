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
  return <section className="space-y-8">
    <div className="flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">FondUz · {t("dashboard.eyebrow")}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t("dashboard.title")}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{t("dashboard.description")}</p></div>
      <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-xs font-semibold text-muted"><span className="size-2 rounded-full bg-emerald-600" />FondUz</span>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((item, index) => <Link key={item.slug} href={`/admin/${item.slug}`} className="group panel-card p-5 transition-colors hover:border-primary/50 hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        <div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.12em] text-muted">{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true" className="text-lg text-primary transition-transform group-hover:translate-x-1">→</span></div>
        <h2 className="mt-8 font-semibold">{t(`navigation.${item.key}`)}</h2>
        <p className="mt-2 text-sm text-muted">{t("dashboard.edit")}</p>
      </Link>)}
    </div>
  </section>;
}
