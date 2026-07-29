"use client";

import { SectionReveal } from "@/components/animations/SectionReveal";
import { TextReveal } from "@/components/animations/TextReveal";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <SectionReveal>
        <div className="section-divider" />
      </SectionReveal>
      <TextReveal
        text={title}
        as="h2"
        className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF]"
      />
      {subtitle && (
        <SectionReveal delay={0.2}>
          <p className="mt-4 text-base md:text-lg text-[#52525B] dark:text-[#A1A1AA] max-w-2xl mx-auto font-normal leading-relaxed">
            {subtitle}
          </p>
        </SectionReveal>
      )}
    </div>
  );
}
