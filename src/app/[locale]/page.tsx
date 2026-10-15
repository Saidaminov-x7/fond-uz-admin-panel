import { redirect } from "@/src/i18n/routing";
export default async function Home({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; redirect({ href: "/admin", locale: locale as "ru" | "en" | "uz" }); }
