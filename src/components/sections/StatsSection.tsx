"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Users,
  Globe,
  MapPin,
  Award,
  Target,
  Megaphone,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/lib/i18n";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";

// ── Icon map (order matches content.stats.list) ──────────────────────────────
const STAT_ICONS = [
  <Award key="award" className="w-8 h-8" />,
  <Users key="users" className="w-8 h-8" />,
  <Globe key="globe" className="w-8 h-8" />,
  <MapPin key="map" className="w-8 h-8" />,
  <Target key="target" className="w-8 h-8" />,
  <Megaphone key="recommend" className="w-8 h-8" />,
];

// ── Parse "[500]+" → { num: 500, suffix: "+" } ───────────────────────────────
function parseStatValue(raw: string): { num: number; suffix: string } {
  const cleaned = raw.replace(/[\[\]]/g, "");
  const match = cleaned.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: cleaned };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

// ── Animated counter card ────────────────────────────────────────────────────
interface StatCounterProps {
  icon: React.ReactNode;
  num: number;
  suffix: string;
  label: string;
  delay: number;
}

function StatCounter({ icon, num, suffix, label, delay }: StatCounterProps) {
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true });

  const springValue = useSpring(0, { stiffness: 50, damping: 10 });
  const displayValue = useTransform(springValue, (v) => Math.floor(v));

  // Trigger once when in view
  useRef(() => {
    if (isInView) springValue.set(num);
  });

  // useEffect equivalent via motion value subscription
  if (isInView) springValue.set(num);

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl flex flex-col items-center text-center group hover:bg-white hover:shadow-lg transition-all duration-300 border border-primary/10"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>

      <div ref={countRef} className="text-4xl font-bold text-foreground flex items-center">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </div>

      <p className="text-muted text-sm mt-2 font-medium leading-snug">{label}</p>

      <motion.div className="w-12 h-1 bg-primary mt-4 rounded-full group-hover:w-20 transition-all duration-300" />
    </motion.div>
  );
}

// ── StatsSection ─────────────────────────────────────────────────────────────
export function StatsSection() {
  const content = useContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-white to-primary-light/20"
    >
      {/* Parallax blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/8 blur-3xl pointer-events-none"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/6 blur-3xl pointer-events-none"
        style={{ y: y2 }}
      />

      {/* Floating dots */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-primary/30 pointer-events-none"
        animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-6 h-6 rounded-full bg-primary/25 pointer-events-none"
        animate={{ y: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <Container>
          {/* Header */}
          <motion.div className="flex flex-col items-center mb-12 md:mb-16" variants={itemVariants}>
            <motion.span
              className="text-primary font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              {content.stats.description}
            </motion.span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-center">
              {content.stats.heading}
            </h2>

            <motion.div
              className="h-1.5 bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: 128 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          {/* Stat counters grid */}
          <motion.div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            initial="hidden"
            animate={isStatsInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {content.stats.list.map((stat, idx) => {
              const { num, suffix } = parseStatValue(stat.value);
              return (
                <StatCounter
                  key={idx}
                  icon={STAT_ICONS[idx] ?? STAT_ICONS[0]}
                  num={num}
                  suffix={suffix}
                  label={stat.label}
                  delay={idx * 0.1}
                />
              );
            })}
          </motion.div>

          {/* Bottom banner */}
          <motion.div
            className="bg-primary text-white p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <BookOpen className="w-6 h-6 shrink-0" />
                <h3 className="text-2xl md:text-3xl font-bold">
                  {content.stats.individualFormatTitle}
                </h3>
              </div>
              <p className="text-white/85 text-base md:text-lg leading-relaxed">
                {content.stats.individualFormatDescription}
              </p>
            </div>

            <Button
              href={getWhatsAppUrl(content.whatsapp.trialLessonMessage)}
              dataCta="common"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              className="shrink-0 rounded-full font-semibold shadow-lg"
              onClick={() => trackWhatsAppClick("stats")}
            >
              {content.scarcity.ctaText}
            </Button>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}
