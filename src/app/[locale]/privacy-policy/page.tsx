import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocalizedPrivacyPolicy } from "@/components/legal/LocalizedLegalPages";
import { getContent, Locale } from "@/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "ru";
  const seo = getContent(locale).seo.privacy;
  const canonical =
    locale === "en" ? "/en/privacy-policy" : "/privacy-policy";
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        ru: "/privacy-policy",
        en: "/en/privacy-policy",
        "x-default": "/privacy-policy",
      },
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <LocalizedPrivacyPolicy />
      <Footer />
    </>
  );
}
