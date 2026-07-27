import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import type { Locale } from "@/content";
import "./globals.css";
import "@/features/profile-test/profile-test.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#60C849",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale: Locale =
    (await headers()).get("x-locale") === "en" ? "en" : "ru";

  return (
    <html lang={locale}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
