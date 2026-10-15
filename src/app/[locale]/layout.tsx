import "./styles/globals.css";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { AdminProviders } from "@/src/components/AdminProviders";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";
export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }
export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale); const messages = await getMessages(); const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <html lang={locale} suppressHydrationWarning><body className="min-h-screen bg-background text-foreground antialiased"><AdminProviders nonce={nonce}><NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider></AdminProviders></body></html>;
}
