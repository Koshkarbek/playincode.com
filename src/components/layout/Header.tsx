"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { useContent, useLanguage } from "@/lib/i18n";

const LOCALES = ["ru", "en"] as const;

function localeHref(pathname: string, targetLocale: "ru" | "en"): string {
  const stripped = pathname.replace(/^\/en(\/|$)/, "/").replace(/\/$/, "");
  const base = stripped === "" ? "/" : stripped;
  if (targetLocale === "ru") return base;
  return base === "/" ? "/en" : `/en${base}`;
}

export function Header() {
  const content = useContent();
  const { locale } = useLanguage();
  const pathname = usePathname() ?? "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      setIsScrolled(currentScrollY > 0);

      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const homeHref = locale === "en" ? "/en" : "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-transform duration-200",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isScrolled
          ? "bg-white/95 backdrop-blur shadow-sm"
          : "bg-white"
      )}
    >
      <Container className="flex items-center justify-between gap-4 py-3">
        <Link
          href={homeHref}
          className="flex items-center text-foreground hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt={content.header.logoAlt}
            width={347}
            height={191}
            sizes="116px"
            quality={100}
            priority
            className="h-16 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Button
            href={getWhatsAppUrl(content.whatsapp.trialLessonMessage)}
            dataCta="common"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            className="text-sm whitespace-nowrap"
            onClick={() => trackWhatsAppClick("header")}
          >
            {content.header.ctaText}
          </Button>

          <div className="inline-flex rounded-full border border-primary/15 bg-white/90 p-1 shadow-sm">
            {LOCALES.map((lang) => {
              const isActive = locale === lang;
              return (
                <Link
                  key={lang}
                  href={localeHref(pathname, lang)}
                  hrefLang={lang}
                  prefetch={false}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {lang.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </header>
  );
}
