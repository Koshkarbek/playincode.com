"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Code2, Gamepad2, Sparkles } from "lucide-react";
import { useContent } from "@/lib/i18n";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// AnimatedTextCycle
// ---------------------------------------------------------------------------

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

function AnimatedTextCycle({
  words,
  interval = 3000,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, words.length]);

  const containerVariants: Variants = {
    hidden: { y: -20, opacity: 0, filter: "blur(8px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <>
      {/* Hidden measurement layer */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      <motion.span
        className="relative inline-block"
        animate={{
          width,
          transition: { type: "spring", stiffness: 150, damping: 15, mass: 1.2 },
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}

// ---------------------------------------------------------------------------
// AnimatedGroup
// ---------------------------------------------------------------------------

const transitionVariants: { item: Variants } = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 1.5 },
    },
  },
};

interface AnimatedGroupProps {
  children: React.ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
}

function AnimatedGroup({ children, className, variants }: AnimatedGroupProps) {
  const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const defaultItemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const containerVariants = variants?.container ?? defaultContainerVariants;
  const itemVariants = variants?.item ?? defaultItemVariants;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------

// Order matches courseBadges: ["Scratch", "Roblox Studio", "Python"]
const courseIcons = [
  { Icon: Sparkles, color: "text-orange-500", bg: "from-orange-500/10 to-orange-600/5 border-orange-500/20" },
  { Icon: Gamepad2, color: "text-blue-500",   bg: "from-blue-500/10 to-blue-600/5 border-blue-500/20" },
  { Icon: Code2,    color: "text-primary",    bg: "from-primary/10 to-primary/5 border-primary/20" },
];

export function HeroSection() {
  const content = useContent();
  const {
    courseBadges,
    headingPrefix,
    headingSuffix,
    subheading,
    ctaText,
    ctaSubtext,
    viewCoursesText,
    courseDescriptions,
  } = content.hero;

  return (
    <section
      id="hero-section"
      tabIndex={-1}
      className="overflow-hidden bg-background"
    >
      {/* ── Main hero block ── */}
      <div className="relative pt-10 md:pt-16 lg:pt-20">
        {/* Radial gradient backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
        />

        <Container size="lg">
          <div className="text-center">
            {/* Top badge */}
            <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-primary/20 bg-primary-light px-4 py-2 shadow-sm">
              <Sparkles className="size-5 shrink-0 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {subheading}
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-8 mx-auto max-w-4xl text-balance text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight lg:mt-12">
              {headingPrefix}{" "}
              <AnimatedTextCycle
                words={courseBadges}
                interval={3000}
                className="text-primary"
              />
              <br />
              <span className="text-foreground">{headingSuffix}</span>
            </h1>

            {/* Feature badges */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {content.hero.featureBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.6 },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row"
            >
              <div className="rounded-[14px] border border-primary/20 bg-primary/10 p-0.5">
                <Button
                  href={getWhatsAppUrl(content.whatsapp.trialLessonMessage)}
                  dataCta="common"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="rounded-xl px-8 text-base"
                  onClick={() => trackWhatsAppClick("hero")}
                >
                  {ctaText}
                </Button>
              </div>
              <Button
                href="#courses-section"
                variant="outline"
                size="lg"
                className="rounded-xl px-6"
              >
                {viewCoursesText}
              </Button>
            </AnimatedGroup>

            {/* Urgency note */}
            <motion.p
              className="mt-5 inline-flex items-center justify-center rounded-full border border-rose-200/80 bg-rose-50/80 px-4 py-2 text-sm font-medium text-rose-700/85"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              {ctaSubtext}
            </motion.p>
          </div>
        </Container>

        {/* ── Course cards preview ── */}
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: { staggerChildren: 0.05, delayChildren: 0.75 },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="relative mt-14 overflow-hidden px-2 sm:mt-16 md:mt-20 pb-14 md:pb-20">
            {/* Gradient fade at bottom */}
            <div
              aria-hidden
              className="absolute inset-0 z-10 bg-gradient-to-b from-transparent from-35% to-background"
            />
            <Container size="lg">
              <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-card p-4 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {courseBadges.map((course, index) => {
                    const { Icon, color, bg } = courseIcons[index] ?? courseIcons[0];
                    return (
                      <div
                        key={course}
                        className={`flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-br border ${bg}`}
                      >
                        <Icon className={`size-12 ${color} mb-4`} />
                        <h3 className="text-xl font-bold mb-2">{course}</h3>
                        <p className="text-sm text-muted text-center">
                          {courseDescriptions[index]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Container>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
