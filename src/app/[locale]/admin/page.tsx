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
  return <section>
    <p className="text-sm font-semibold text-primary">{t("dashboard.eyebrow")}</p>
    <h1 className="mt-1 text-3xl font-bold">{t("dashboard.title")}</h1>
    <p className="mt-2 text-muted">{t("dashboard.description")}</p>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((item) => <Link key={item.slug} href={`/admin/${item.slug}`} className="panel-card p-5 transition-colors hover:border-primary">
        <h2 className="font-semibold">{t(`navigation.${item.key}`)}</h2>
        <p className="mt-2 text-sm text-muted">{t("dashboard.edit")}</p>
      </Link>)}
    </div>
  </section>;
}
