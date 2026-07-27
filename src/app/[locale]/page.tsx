import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { TrialLessonSection } from "@/components/sections/TrialLessonSection";
import { ValueSection } from "@/components/sections/ValueSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { HowLessonsWorkSection } from "@/components/sections/HowLessonsWorkSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ScarcitySection } from "@/components/sections/ScarcitySection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { JsonLd } from "@/components/analytics/JsonLd";
import {
  buildEducationalOrganization,
  buildCourses,
  buildFaqPage,
  buildWebSite,
} from "@/lib/seo/jsonLd";
import { getContent, Locale } from "@/content";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "ru";
  const content = getContent(locale);
  const org = buildEducationalOrganization(locale);
  const site = buildWebSite(locale);
  const courses = buildCourses(locale);
  const faq = buildFaqPage(content.faq.list);

  return (
    <>
      <JsonLd data={[site, org, ...courses, faq]} />
      <Header />
      <main className="pt-24">
        <HeroSection />
        <WhyUsSection />
        <CoursesSection />
        <TrialLessonSection />
        <ValueSection />
        <CasesSection />
        <ReviewsSection />
        <HowLessonsWorkSection />
        <StatsSection />
        <ScarcitySection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <ScrollToTopButton />
      <Footer />
    </>
  );
}
