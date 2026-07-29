"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin, Calendar, X, Building, ChevronDown } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText, getLocalizedArray } from "@/lib/utils";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FilterPills } from "@/components/ui/FilterPills";
import type { Project } from "@/types";

interface ProjectsProps {
  locale: string;
}

function ProjectCard({
  project,
  locale,
  index,
  onClick,
}: {
  project: Project;
  locale: string;
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative overflow-hidden cursor-pointer rounded-2xl bg-white dark:bg-[#121214] border border-[#E4E4E7] dark:border-[#1F1F24] hover:border-[#C5A059]/60 shadow-card hover:shadow-card-hover transition-all duration-350 ${
        project.featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Project Cover Image / Architectural Fallback */}
      <div className={`relative w-full bg-[#FAFAFA] dark:bg-[#141414] overflow-hidden ${project.featured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {project.coverImage && !imgError ? (
          <img
            src={project.coverImage}
            alt={getLocalizedText(project.title, locale)}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Architectural Blueprint Geometric Fallback */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#FAFAFA] via-[#F4F4F5] to-[#E4E4E7] dark:from-[#161616] dark:via-[#1A1A1A] dark:to-[#0F0F0F] overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#C5A059 1px, transparent 1px), linear-gradient(90deg, #C5A059 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/25 text-[#C5A059] flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Building className="w-8 h-8" />
            </div>
            <span className="font-playfair text-base font-bold text-[#0A0A0A] dark:text-[#EDEDEF] text-center max-w-xs leading-snug">
              {getLocalizedText(project.title, locale)}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] mt-1 font-bold">
              {getLocalizedText(project.category, locale)}
            </span>
          </div>
        )}

        {/* Category Pill Tag Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-full bg-[#C5A059] text-white text-[10px] uppercase font-bold tracking-wider shadow-lg shadow-[#C5A059]/20">
            {getLocalizedText(project.category, locale)}
          </span>
        </div>

        {/* Hover Information Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-transparent backdrop-blur-[2px] flex flex-col justify-end p-6 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 15, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <h3 className="font-playfair text-xl lg:text-2xl font-bold text-white mb-2 leading-snug">
              {getLocalizedText(project.title, locale)}
            </h3>
            <p className="text-white/70 text-xs leading-relaxed mb-4 line-clamp-2 font-normal">
              {getLocalizedText(project.description, locale)}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/50 font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                {getLocalizedText(project.location, locale)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                {project.year}
              </span>
            </div>
          </motion.div>

          <div className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white group-hover:bg-[#C5A059] transition-colors duration-300 shadow-lg">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* Card Info Footer */}
      <div className="p-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-playfair text-base sm:text-lg font-bold text-[#0A0A0A] dark:text-[#EDEDEF] truncate group-hover:text-[#C5A059] transition-colors duration-300">
            {getLocalizedText(project.title, locale)}
          </h3>
          <p className="text-[11px] text-[#71717A] font-mono mt-0.5 truncate">
            {getLocalizedText(project.location, locale)} · {project.year}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#71717A] group-hover:text-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all duration-300 shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

export function Projects({ locale }: ProjectsProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.projects;
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeGalleryImg, setActiveGalleryImg] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const filteredProjects =
    activeFilter === "all"
      ? data.projects
      : data.projects.filter((p) => p.categoryKey === activeFilter);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const selectedProject = data.projects.find((p) => p.id === selectedProjectId);
  const longDescParagraphs = selectedProject ? getLocalizedArray(selectedProject.longDescription, locale) : [];

  const galleryImages: string[] = selectedProject
    ? Array.from(new Set([selectedProject.coverImage, ...(selectedProject.images || [])].filter(Boolean)))
    : [];

  const activeImageToShow = activeGalleryImg || (selectedProject?.coverImage || "");

  const handleFilterChange = (key: string) => {
    setActiveFilter(key);
    setVisibleCount(6);
  };

  useEffect(() => {
    if (selectedProjectId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProjectId]);

  const filterOptions = [
    {
      key: "all",
      label: getLocalizedText(data.filterAll, locale),
      count: data.projects.length,
    },
    ...data.categories.map((cat) => ({
      key: cat.key,
      label: getLocalizedText(cat.label, locale),
      count: data.projects.filter((p) => p.categoryKey === cat.key).length,
    })),
  ];

  return (
    <section id="projects" className="relative py-28 lg:py-36 bg-[#FAF9F6] dark:bg-[#0B0B0C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title={getLocalizedText(data.sectionTitle, locale)}
          subtitle={getLocalizedText(data.subtitle, locale)}
        />

        {/* Category Pill Filters */}
        <SectionReveal delay={0.15}>
          <div className="mb-14">
            <FilterPills
              options={filterOptions}
              active={activeFilter}
              onChange={handleFilterChange}
            />
          </div>
        </SectionReveal>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                index={index}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setActiveGalleryImg(project.coverImage || null);
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {filteredProjects.length > visibleCount && (
          <div className="mt-16 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="btn-primary cursor-pointer font-bold shadow-lg shadow-[#C5A059]/20 dark:bg-gradient-to-r dark:from-[#DFBF7B] dark:via-[#C5A059] dark:to-[#A8833D] dark:text-[#0A0A0B]"
            >
              <span>{locale === "fr" ? "Voir Plus de Projets" : "Load More Projects"}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Project Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#0B0B0C]/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedProjectId(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#121214] border border-[#E4E4E7] dark:border-[#1F1F24] rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProjectId(null)}
                className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md text-[#0A0A0A] dark:text-[#EDEDEF] hover:text-[#C5A059] shadow-lg cursor-pointer transition-colors duration-300"
                aria-label="Close project modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image Lightbox Viewer */}
              <div className="relative h-72 sm:h-[26rem] w-full bg-[#FAFAFA] dark:bg-[#141414] shrink-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageToShow}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={activeImageToShow}
                    alt={getLocalizedText(selectedProject.title, locale)}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#161616] via-transparent to-transparent" />

                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 rounded-full bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#C5A059]/20">
                    {getLocalizedText(selectedProject.category, locale)}
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              {galleryImages.length > 1 && (
                <div className="px-6 pt-4 flex gap-2 overflow-x-auto bg-[#FAFAFA] dark:bg-[#141414] border-b border-[#E4E4E7] dark:border-[#1C1C1C]">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveGalleryImg(img)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer shrink-0 ${
                        activeImageToShow === img
                          ? "border-[#C5A059] scale-105 shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Content Scroll Body */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-6 flex-1">
                <div>
                  <h2 className="font-playfair text-2xl sm:text-4xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF] mb-3">
                    {getLocalizedText(selectedProject.title, locale)}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#52525B] dark:text-[#A1A1AA] pb-4 border-b border-[#E4E4E7] dark:border-[#1C1C1C]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      {getLocalizedText(selectedProject.location, locale)}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      {selectedProject.year}
                    </span>
                  </div>
                </div>

                {/* Software Tools */}
                {selectedProject.software && selectedProject.software.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#71717A] mb-2">
                      {locale === "fr" ? "Outils & Logiciels" : "Tools & Software"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.software.map((sw, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-[#C5A059]/10 text-[#C5A059] text-xs font-semibold font-mono border border-[#C5A059]/15"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architectural Concept */}
                {selectedProject.concept && (
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#141414] border border-[#E4E4E7] dark:border-[#1C1C1C] border-l-4 border-l-[#C5A059]">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A059] mb-1">
                      {locale === "fr" ? "Concept Architectural" : "Architectural Concept"}
                    </p>
                    <p className="font-playfair text-base italic text-[#52525B] dark:text-[#A1A1AA]">
                      &ldquo;{getLocalizedText(selectedProject.concept, locale)}&rdquo;
                    </p>
                  </div>
                )}

                {/* Long Description */}
                <div className="space-y-4 text-[#0A0A0A]/80 dark:text-[#EDEDEF]/80 text-sm leading-relaxed font-normal">
                  {longDescParagraphs.length > 0 ? (
                    longDescParagraphs.map((para, idx) => <p key={idx}>{para}</p>)
                  ) : (
                    <p>{getLocalizedText(selectedProject.description, locale)}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
