"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { useContent } from "@/lib/i18n";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const benefitItemVariants: Variants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export function ValueSection() {
  const content = useContent();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const columns = [
    {
      title: content.value.forChild.title,
      items: content.value.forChild.items,
    },
    {
      title: content.value.forParent.title,
      items: content.value.forParent.items,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-br from-[#f7faf6] via-primary-light/20 to-secondary-bg"
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-primary/4 blur-3xl pointer-events-none" />

      <motion.div
        className="relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <Container>
          {/* Header */}
          <motion.div className="text-center mb-12 md:mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {content.value.heading}
            </h2>
            <motion.div
              className="h-1 bg-primary mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.div>

          {/* Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {columns.map((column, colIdx) => (
              <motion.div key={colIdx} variants={itemVariants}>
                <Card className="h-full hover:-translate-y-1 transition-transform duration-300 !p-6 md:!p-8">
                  {/* Column title */}
                  <div className="mb-6 pb-4 border-b-2 border-primary/20">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                      <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
                      {column.title}
                    </h3>
                  </div>

                  {/* Benefits list */}
                  <motion.ul
                    className="space-y-4"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: colIdx * 0.2 + 0.3,
                        },
                      },
                    }}
                  >
                    {column.items.map((item, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-3 group"
                        variants={benefitItemVariants}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                            <Check className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                        <span className="text-muted leading-relaxed group-hover:text-foreground transition-colors duration-300">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom decorative line */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-primary/30 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-12 h-0.5 bg-primary/30 rounded-full" />
            </div>
          </motion.div>
        </Container>
      </motion.div>
    </section>
  );
}
