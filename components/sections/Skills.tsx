"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Pen, Palette, Settings, Users, CheckCircle2 } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText } from "@/lib/utils";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterPills } from "@/components/ui/FilterPills";

interface SkillsProps {
  locale: string;
}

const iconMap: Record<string, React.ElementType> = {
  Pen,
  Palette,
  Settings,
  Users,
};

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="group relative">
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
          <span className="text-sm font-semibold text-[#0A0A0A] dark:text-[#EDEDEF] group-hover:text-[#C5A059] transition-colors duration-300">
            {name}
          </span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.3, duration: 0.3 }}
          className="text-xs font-mono font-bold text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-full"
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-2 bg-[#E4E4E7] dark:bg-[#27272A] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full rounded-full bg-gradient-to-r from-[#C5A059] to-[#DFBF7B]"
        />
      </div>
    </div>
  );
}

export function Skills({ locale }: SkillsProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.skills;
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const filterOptions = data.categories.map((cat, idx) => ({
    key: String(idx),
    label: getLocalizedText(cat.title, locale),
    count: cat.skills.length,
  }));

  return (
    <section id="skills" className="relative py-28 lg:py-36 bg-[#FAF9F6] dark:bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title={getLocalizedText(data.sectionTitle, locale)}
          subtitle={getLocalizedText(data.subtitle, locale)}
        />

        {/* Category Tabs */}
        <SectionReveal delay={0.15}>
          <div className="mb-14">
            <FilterPills
              options={filterOptions}
              active={String(activeCategory)}
              onChange={(key) => setActiveCategory(Number(key))}
            />
          </div>
        </SectionReveal>

        {/* Active Category Box */}
        <SectionReveal key={activeCategory} delay={0.1}>
          <div className="max-w-4xl mx-auto p-8 lg:p-12 rounded-2xl bg-white dark:bg-[#161616] border border-[#E4E4E7] dark:border-[#27272A] shadow-xl">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E4E4E7] dark:border-[#27272A]">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059] text-white flex items-center justify-center shadow-md shadow-[#C5A059]/20">
                {(() => {
                  const Icon = iconMap[data.categories[activeCategory].icon] || Pen;
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
              <div>
                <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF]">
                  {getLocalizedText(data.categories[activeCategory].title, locale)}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mt-1">
                  {data.categories[activeCategory].skills.length} {locale === "fr" ? "Compétences" : "Skills"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.categories[activeCategory].skills.map((skill, sIdx) => (
                <SkillBar
                  key={sIdx}
                  name={skill.name}
                  level={skill.level}
                  delay={sIdx * 0.08}
                />
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
