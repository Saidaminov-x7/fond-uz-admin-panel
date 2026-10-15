import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContentManager } from "@/src/components/ContentManager";

const resources = ["news", "faqs", "doctors", "prices", "services", "funds"] as const;
type Resource = (typeof resources)[number];

export default async function ResourcePage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!resources.includes(collection as Resource)) notFound();
  const t = await getTranslations("navigation");
  return <ContentManager collection={collection as Resource} title={t(collection as Resource)} />;
}
