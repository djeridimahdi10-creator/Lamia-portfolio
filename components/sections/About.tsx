"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { GraduationCap, BarChart3, Quote } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText, getLocalizedArray } from "@/lib/utils";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";

interface AboutProps {
  locale: string;
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="text-center p-6 relative"
    >
      <div className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#C5A059] mb-2">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#71717A] font-bold">
        {label}
      </div>
    </motion.div>
  );
}

export function About({ locale }: AboutProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.about;
  const bioParagraphs = getLocalizedArray(data.biography, locale);

  return (
    <section id="about" className="relative py-28 lg:py-36 bg-white dark:bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title={getLocalizedText(data.sectionTitle, locale)}
        />

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-center">
          {/* Photo Side */}
          <SectionReveal direction="left" className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] bg-white dark:bg-[#111111] rounded-2xl overflow-hidden shadow-xl border border-[#E4E4E7] dark:border-[#1C1C1C] group corner-accents">
              <Image
                src={data.photo}
                alt="Lamia Akoubache"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </SectionReveal>

          {/* Text Side */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {bioParagraphs.map((paragraph, index) => (
              <SectionReveal key={index} delay={index * 0.12}>
                <p className="text-base md:text-lg text-[#0A0A0A]/80 dark:text-[#EDEDEF]/80 leading-relaxed mb-6 last:mb-0 font-normal">
                  {paragraph}
                </p>
              </SectionReveal>
            ))}

            {/* Philosophy Quote */}
            <SectionReveal delay={0.4}>
              <blockquote className="mt-8 p-6 rounded-2xl bg-[#FAF9F6] dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] border-l-4 border-l-[#C5A059] shadow-sm relative">
                <Quote className="w-8 h-8 text-[#C5A059]/15 absolute top-4 right-4" />
                <div className="absolute top-4 right-14 text-5xl font-playfair text-[#C5A059]/10 leading-none select-none">&ldquo;</div>
                <p className="font-playfair text-lg md:text-xl italic text-[#52525B] dark:text-[#A1A1AA] leading-relaxed relative z-10">
                  {getLocalizedText(data.philosophy, locale)}
                </p>
              </blockquote>
            </SectionReveal>
          </div>
        </div>

        {/* Statistics */}
        <SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 py-12 rounded-2xl bg-[#FAF9F6] dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] shadow-sm overflow-hidden">
            {data.statistics.map((stat, i) => (
              <div key={i} className={`${i > 0 ? "border-l border-[#E4E4E7] dark:border-[#1C1C1C]" : ""}`}>
                <AnimatedCounter
                  value={stat.value}
                  label={getLocalizedText(stat.label, locale)}
                />
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Education Timeline */}
        <div className="mt-24">
          <SectionReveal>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF] text-center mb-14 flex items-center justify-center gap-3">
              <GraduationCap className="w-7 h-7 text-[#C5A059]" />
              {locale === "fr" ? "Formation & Diplômes" : "Education & Credentials"}
            </h3>
          </SectionReveal>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C5A059]/30 via-[#C5A059]/15 to-transparent hidden md:block" />

            {data.education.map((edu, index) => (
              <SectionReveal key={index} delay={index * 0.12}>
                <div className={`flex flex-col md:flex-row items-center gap-8 mb-10 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#1C1C1C] shadow-sm hover:border-[#C5A059]/40 hover:shadow-md transition-all duration-300 group">
                      <p className="text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-bold mb-2">
                        {edu.year}
                      </p>
                      <h4 className="font-playfair text-lg md:text-xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF] mb-1 group-hover:text-[#C5A059] transition-colors">
                        {getLocalizedText(edu.degree, locale)}
                      </h4>
                      <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] mb-2 font-semibold">
                        {getLocalizedText(edu.institution, locale)}
                      </p>
                      <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                        {getLocalizedText(edu.description, locale)}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-[#C5A059] ring-4 ring-white dark:ring-[#0F0F0F] z-10 shadow-sm" />

                  <div className="flex-1 hidden md:block" />
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
