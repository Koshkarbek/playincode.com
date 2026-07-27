import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalizedConsent } from "@/components/legal/LocalizedLegalPages";
import { getContent, Locale } from "@/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "ru";
  const seo = getContent(locale).seo.consent;
  const canonical =
    locale === "en"
      ? "/en/consent-to-data-processing"
      : "/consent-to-data-processing";
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        ru: "/consent-to-data-processing",
        en: "/en/consent-to-data-processing",
        "x-default": "/consent-to-data-processing",
      },
    },
  };
}

export default function ConsentPage() {
  return (
    <>
      <Header />
      <LocalizedConsent />
      <Footer />
    </>
  );
}
