"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText } from "@/lib/utils";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";

interface TestimonialsProps {
  locale: string;
}

export function Testimonials({ locale }: TestimonialsProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.testimonials;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent(
        (prev) =>
          (prev + newDirection + data.testimonials.length) % data.testimonials.length
      );
    },
    [data.testimonials.length]
  );

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 7000);
    return () => clearInterval(timer);
  }, [paginate]);

  const testimonial = data.testimonials[current];

  return (
    <section id="testimonials" className="relative py-28 lg:py-36 bg-[#FAF9F6] dark:bg-[#0A0A0A]">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <SectionHeader
          title={getLocalizedText(data.sectionTitle, locale)}
        />

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <div className="relative min-h-[360px] flex items-center p-8 lg:p-12 rounded-2xl bg-white dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] shadow-xl">
              {/* Decorative quote mark */}
              <Quote className="w-16 h-16 text-[#C5A059]/10 absolute top-6 left-6" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center relative z-10"
                >
                  {/* Star Rating */}
                  <div className="flex justify-center gap-1 mb-6 text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="font-playfair text-xl md:text-2xl text-[#0A0A0A] dark:text-[#EDEDEF] italic mb-8 px-4 leading-relaxed font-semibold">
                    &ldquo;{getLocalizedText(testimonial.quote, locale)}&rdquo;
                  </blockquote>

                  {/* Author Meta */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-[#FAF9F6] dark:bg-[#141414] border-2 border-[#C5A059] overflow-hidden flex items-center justify-center mb-3 shadow-md shadow-[#C5A059]/10">
                      {testimonial.photo ? (
                        <img
                          src={testimonial.photo}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="font-playfair text-lg text-[#C5A059] font-bold">
                          {testimonial.author.charAt(0)}
                        </span>
                      )}
                    </div>
                    <p className="font-playfair text-lg font-bold text-[#0A0A0A] dark:text-[#EDEDEF]">
                      {testimonial.author}
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A059] mt-1">
                      {getLocalizedText(testimonial.role, locale)}
                    </p>
                    <p className="text-xs text-[#71717A] mt-0.5 font-mono">
                      {getLocalizedText(testimonial.company, locale)}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                type="button"
                onClick={() => paginate(-1)}
                className="p-3 rounded-full bg-white dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] text-[#52525B] dark:text-[#A1A1AA] hover:text-[#C5A059] hover:border-[#C5A059] transition-all duration-300 cursor-pointer shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {data.testimonials.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setDirection(index > current ? 1 : -1);
                      setCurrent(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === current
                        ? "bg-[#C5A059] w-8"
                        : "bg-[#E4E4E7] dark:bg-[#27272A] hover:bg-[#C5A059]/50 w-2"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => paginate(1)}
                className="p-3 rounded-full bg-white dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] text-[#52525B] dark:text-[#A1A1AA] hover:text-[#C5A059] hover:border-[#C5A059] transition-all duration-300 cursor-pointer shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
