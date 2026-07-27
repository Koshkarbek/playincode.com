import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, Locale } from "@/content";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { Providers } from "@/app/providers";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";

const LOCALES: Locale[] = ["ru", "en"];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function resolveLocale(raw: string): Locale {
  return raw === "en" ? "en" : "ru";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!LOCALES.includes(rawLocale as Locale)) {
    return {};
  }
  const locale = resolveLocale(rawLocale);
  const seo = getContent(locale).seo;
  const canonical = locale === "en" ? "/en" : "/";

  return {
    title: {
      default: seo.title,
      template: "%s | Play In Code",
    },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical,
      languages: {
        ru: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      alternateLocale: locale === "ru" ? ["en_US"] : ["ru_RU"],
      url: canonical,
      siteName: "Play In Code",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : undefined,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!LOCALES.includes(rawLocale as Locale)) {
    notFound();
  }
  const locale = resolveLocale(rawLocale);

  return (
    <>
      <GoogleTagManager />
      <Providers locale={locale}>{children}</Providers>
      <GoogleAnalytics />
      <YandexMetrika />
    </>
  );
}
