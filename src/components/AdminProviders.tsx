"use client";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function AdminProviders({ children, nonce }: { children: ReactNode; nonce?: string }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange nonce={nonce}>{children}</ThemeProvider>;
}
