import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalizedTerms } from "@/components/legal/LocalizedLegalPages";
import { getContent, Locale } from "@/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "ru";
  const seo = getContent(locale).seo.terms;
  const canonical = locale === "en" ? "/en/terms" : "/terms";
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        ru: "/terms",
        en: "/en/terms",
        "x-default": "/terms",
      },
    },
  };
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <LocalizedTerms />
      <Footer />
    </>
  );
}
