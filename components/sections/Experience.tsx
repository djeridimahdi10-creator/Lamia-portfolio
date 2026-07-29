"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Building, MapPin, Calendar } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText } from "@/lib/utils";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterPills } from "@/components/ui/FilterPills";

interface ExperienceProps {
  locale: string;
}

const typeIcons: Record<string, React.ElementType> = {
  work: Briefcase,
  education: GraduationCap,
  internship: Building,
};

export function Experience({ locale }: ExperienceProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.experience;
  const [filter, setFilter] = useState<string>("all");

  const filteredEntries =
    filter === "all"
      ? data.entries
      : data.entries.filter((entry: any) => entry.type === filter);

  const filterOptions = [
    { key: "all", label: locale === "fr" ? "Tout" : "All" },
    { key: "education", label: locale === "fr" ? "Formation" : "Education" },
    { key: "work", label: locale === "fr" ? "Travail" : "Work" },
    { key: "internship", label: locale === "fr" ? "Stages" : "Internships" },
  ];

  return (
    <section id="experience" className="relative py-28 lg:py-36 bg-white dark:bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title={getLocalizedText(data.sectionTitle, locale)}
          subtitle={getLocalizedText(data.subtitle, locale)}
        />

        {/* Filter Pills */}
        <SectionReveal delay={0.15}>
          <div className="mb-14">
            <FilterPills
              options={filterOptions}
              active={filter}
              onChange={setFilter}
            />
          </div>
        </SectionReveal>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C5A059]/30 via-[#C5A059]/15 to-transparent md:-translate-x-[1px]" />

          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry: any, index: number) => {
              const Icon = typeIcons[entry.type] || Briefcase;
              const isLeft = index % 2 === 0;

              return (
                <SectionReveal
                  key={entry.id || index}
                  delay={index * 0.1}
                  direction={isLeft ? "left" : "right"}
                >
                  <div className={`relative flex items-start gap-6 mb-12 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Content Card */}
                    <div className={`flex-1 ml-12 md:ml-0 ${isLeft ? "md:pr-10 md:text-right" : "md:pl-10 md:text-left"}`}>
                      <motion.div
                        className="p-6 rounded-2xl bg-white dark:bg-[#161616] border border-[#E4E4E7] dark:border-[#27272A] hover:border-[#C5A059]/40 transition-all duration-300 shadow-sm hover:shadow-md group"
                        whileHover={{ y: -3 }}
                      >
                        {/* Date & Type Badge */}
                        <div className={`flex flex-wrap items-center gap-2 mb-3 ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-[0.15em] bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/15">
                            <Icon className="w-3 h-3" />
                            {entry.type === "education"
                              ? locale === "fr" ? "Formation" : "Education"
                              : entry.type === "internship"
                              ? locale === "fr" ? "Stage" : "Internship"
                              : locale === "fr" ? "Travail" : "Work"}
                          </span>
                          <span className="text-xs font-mono font-semibold text-[#52525B] dark:text-[#A1A1AA] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                            {entry.startDate} — {entry.endDate === "Present"
                              ? locale === "fr" ? "Présent" : "Present"
                              : entry.endDate}
                          </span>
                        </div>

                        <h3 className="font-playfair text-xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF] mb-1 group-hover:text-[#C5A059] transition-colors duration-300">
                          {getLocalizedText(entry.role, locale)}
                        </h3>
                        <p className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.15em] mb-2">
                          {getLocalizedText(entry.company, locale)}
                        </p>
                        <p className="text-xs md:text-sm text-[#52525B] dark:text-[#A1A1AA] leading-relaxed">
                          {getLocalizedText(entry.description, locale)}
                        </p>
                        <p className={`mt-3 text-[11px] text-[#71717A] flex items-center gap-1 font-mono ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
                          <MapPin className="w-3 h-3 text-[#C5A059]" />
                          {getLocalizedText(entry.location, locale)}
                        </p>
                      </motion.div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-4 h-4 mt-8">
                      <div className="w-4 h-4 rounded-full bg-[#C5A059] ring-4 ring-white dark:ring-[#0F0F0F] z-10 shadow-sm" />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </div>
                </SectionReveal>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
