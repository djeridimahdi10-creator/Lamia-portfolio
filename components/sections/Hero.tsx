"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Award, ArrowRight } from "lucide-react";
import Image from "next/image";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText } from "@/lib/utils";

interface HeroProps {
  locale: string;
}

export function Hero({ locale }: HeroProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.hero;
  const shouldReduceMotion = useReducedMotion();

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#FAF9F6] dark:bg-[#0A0A0A]"
    >
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_0.5px,transparent_0.5px)] [background-size:40px_40px] opacity-[0.07]" />
        {/* Top-right decorative arc */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-[#C5A059]/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          />
        )}
        {/* Bottom-left subtle glow */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C5A059]/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content Side */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5A059]/8 border border-[#C5A059]/20 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                {locale === "fr" ? "Disponible pour projets" : "Available for projects"}
              </span>
            </motion.div>

            {/* Architect Name */}
            <motion.h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight leading-[0.95]">
              {data.name.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className={`block ${i === 0 ? "text-[#C5A059]" : "text-[#0A0A0A] dark:text-[#EDEDEF]"}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-6 text-lg sm:text-xl font-playfair font-semibold text-[#0A0A0A]/80 dark:text-[#EDEDEF]/80 tracking-wide"
            >
              {getLocalizedText(data.title, locale)}
            </motion.p>

            {/* Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A0A0A]/5 dark:bg-white/5 text-[#52525B] dark:text-[#A1A1AA] text-[11px] font-semibold tracking-wide"
            >
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{getLocalizedText(data.subtitle, locale)}</span>
            </motion.div>

            {/* Intro Paragraph */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-6 text-base sm:text-lg text-[#52525B] dark:text-[#A1A1AA] max-w-xl leading-relaxed font-normal mx-auto lg:mx-0"
            >
              {getLocalizedText(data.intro, locale)}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={scrollToProjects}
                className="btn-primary cursor-pointer"
              >
                <span>{getLocalizedText(data.cta, locale)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#contact"
                className="btn-secondary cursor-pointer"
              >
                <span>{locale === "fr" ? "Me contacter" : "Get in touch"}</span>
              </a>
            </motion.div>
          </div>

          {/* Profile Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative ring behind image */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute -inset-4 rounded-full border border-[#C5A059]/15"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
              )}
              {/* Profile image container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[22rem] lg:h-[22rem] rounded-full overflow-hidden border-2 border-[#C5A059]/30 dark:border-[#C5A059]/25 shadow-2xl shadow-[#C5A059]/10">
                {data.profileImage ? (
                  <Image
                    src={data.profileImage}
                    alt={data.name}
                    fill
                    sizes="(max-width: 1024px) 256px, 352px"
                    className="object-cover object-center"
                    quality={90}
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#C5A059]/10 to-[#C5A059]/5 flex items-center justify-center">
                    <span className="font-playfair text-6xl text-[#C5A059] font-bold">L</span>
                  </div>
                )}
              </div>
              {/* Floating accent card */}
              {!shouldReduceMotion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute -bottom-4 -left-4 sm:bottom-4 sm:-left-8 bg-white dark:bg-[#111111] rounded-xl px-4 py-3 shadow-lg border border-[#E4E4E7] dark:border-[#1C1C1C]"
                >
                  <p className="text-[10px] uppercase tracking-widest text-[#71717A] font-bold mb-0.5">
                    {locale === "fr" ? "Spécialité" : "Specialty"}
                  </p>
                  <p className="text-xs font-semibold text-[#0A0A0A] dark:text-[#EDEDEF]">
                    {getLocalizedText(data.specialty, locale)}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Chevron */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={scrollToProjects}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] font-bold font-mono">
          {getLocalizedText(data.scrollText, locale)}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#C5A059]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
