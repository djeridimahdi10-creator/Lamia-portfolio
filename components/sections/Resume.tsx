"use client";

import { motion } from "framer-motion";
import { Download, FileText, CheckCircle2, Eye } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText } from "@/lib/utils";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";

interface ResumeProps {
  locale: string;
}

export function Resume({ locale }: ResumeProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.resume;

  const highlights = [
    locale === "fr" ? "Master 2 Architecture" : "Master 2 Architecture",
    locale === "fr" ? "Conception Bioclimatique & BIM" : "Bioclimatic Design & BIM",
    locale === "fr" ? "AutoCAD, Revit, SketchUp" : "AutoCAD, Revit, SketchUp",
    locale === "fr" ? "Projets Résidentiels & Culturels" : "Residential & Cultural Projects",
  ];

  return (
    <section id="resume" className="relative py-28 lg:py-36 bg-white dark:bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <SectionHeader
          title={getLocalizedText(data.sectionTitle, locale)}
          subtitle={getLocalizedText(data.subtitle, locale)}
        />

        {/* Executive Resume Card */}
        <SectionReveal>
          <div className="relative bg-[#FAF9F6] dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] p-8 sm:p-12 md:p-16 text-center shadow-xl overflow-hidden corner-accents">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-5 bg-[#C5A059]/10 text-[#C5A059] rounded-full">
                <FileText size={40} strokeWidth={1.5} />
              </div>
            </div>

            {/* Title & Info */}
            <h3 className="font-playfair text-3xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF] mb-2">
              Lamia Akoubache
            </h3>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-10">
              {locale === "fr" ? "Curriculum Vitae Officiel — Master 2 Architecture" : "Official Resume — Master 2 Architecture"}
            </p>

            {/* Highlights Chips */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-12 max-w-2xl mx-auto">
              {highlights.map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#0A0A0A] border border-[#E4E4E7] dark:border-[#1C1C1C] rounded-xl text-[11px] text-[#0A0A0A]/70 dark:text-[#EDEDEF]/70 font-medium"
                >
                  <CheckCircle2 size={12} className="text-[#C5A059]" strokeWidth={2} />
                  {item}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href={data.resumeUrl}
                download
                className="btn-primary w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={16} strokeWidth={2} />
                <span>{getLocalizedText(data.downloadText, locale)}</span>
              </motion.a>

              <motion.a
                href={data.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye size={16} strokeWidth={2} />
                <span>{getLocalizedText(data.previewText, locale)}</span>
              </motion.a>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
