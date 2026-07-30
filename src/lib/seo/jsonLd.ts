import { getContent, Locale } from "@/content";
import { getSiteUrl } from "./siteUrl";

const WHATSAPP_NUMBER = "+77029003890";
const INSTAGRAM_URL = "https://www.instagram.com/playincode.school";
const TELEGRAM_URL = "https://t.me/playincode_school";

function orgUrl(locale: Locale): string {
  const site = getSiteUrl();
  return locale === "en" ? `${site}/en` : `${site}/`;
}

function organizationId(): string {
  return `${getSiteUrl()}/#organization`;
}

export function buildEducationalOrganization(locale: Locale) {
  const site = getSiteUrl();
  const content = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": organizationId(),
    name: "Play In Code",
    alternateName: "PlayInCode",
    url: orgUrl(locale),
    logo: `${site}/logo.svg`,
    image: `${site}/opengraph-image`,
    description: content.seo.description,
    inLanguage: locale === "en" ? ["en", "ru"] : ["ru", "en"],
    areaServed: ["US", "CA", "GB", "DE", "FR", "ES", "IT", "NL", "PL", "CZ"],
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 7,
      suggestedMaxAge: 16,
    },
    sameAs: [INSTAGRAM_URL, TELEGRAM_URL, `https://wa.me/77029003890`],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: WHATSAPP_NUMBER,
        availableLanguage: ["Russian", "English"],
        areaServed: ["US", "CA", "EU", "GB"],
      },
    ],
  };
}

export function buildWebSite(locale: Locale) {
  const site = getSiteUrl();
  const content = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    url: orgUrl(locale),
    name: "Play In Code",
    description: content.seo.description,
    inLanguage: locale === "en" ? "en" : "ru",
    publisher: { "@id": organizationId() },
  };
}

interface CoursePreset {
  id: "scratch" | "roblox" | "python";
  courseCode: string;
  minAge: number;
  maxAge: number;
  subject: string;
}

const COURSE_PRESETS: CoursePreset[] = [
  { id: "scratch", courseCode: "SCRATCH-K", minAge: 7, maxAge: 10, subject: "Scratch programming for kids" },
  { id: "roblox", courseCode: "ROBLOX-K", minAge: 9, maxAge: 16, subject: "Roblox Studio game development for kids" },
  { id: "python", courseCode: "PYTHON-K", minAge: 12, maxAge: 16, subject: "Python programming for teens" },
];

export function buildCourses(locale: Locale): Array<Record<string, unknown>> {
  const site = getSiteUrl();
  const content = getContent(locale);
  const courseList = content.courses.list;
  const result: Array<Record<string, unknown>> = [];

  for (const preset of COURSE_PRESETS) {
    const card = courseList.find((c) => c.id === preset.id);
    if (!card) continue;
    result.push({
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${site}/#course-${preset.id}`,
      name: card.heading,
      description: card.description,
      url: `${orgUrl(locale)}#courses`,
      courseCode: preset.courseCode,
      educationalLevel: "beginner",
      inLanguage: locale === "en" ? "en" : "ru",
      about: preset.subject,
      provider: { "@id": organizationId() },
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        suggestedMinAge: preset.minAge,
        suggestedMaxAge: preset.maxAge,
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT60M",
        inLanguage: locale === "en" ? "en" : "ru",
        offers: {
          "@type": "Offer",
          category: "Free trial lesson",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://wa.me/77029003890",
        },
      },
    });
  }
  return result;
}

interface FaqItemLike {
  question: string;
  answer: string;
}

export function buildFaqPage(items: ReadonlyArray<FaqItemLike>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
