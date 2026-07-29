"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, X, Search, Calendar, User, Share2, FileText } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText } from "@/lib/utils";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";

interface BlogProps {
  locale: string;
}

export function Blog({ locale }: BlogProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.blog;
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPost]);

  const filteredPosts = data.posts.filter(
    (post) =>
      getLocalizedText(post.title, locale).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getLocalizedText(post.excerpt, locale).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPost = data.posts.find((p) => p.id === selectedPost);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="blog" className="relative py-28 lg:py-36 bg-white dark:bg-[#0B0B0C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title={getLocalizedText(data.sectionTitle, locale)}
          subtitle={getLocalizedText(data.subtitle, locale)}
        />

        {/* Search */}
        <SectionReveal delay={0.15}>
          <div className="max-w-md mx-auto mb-14 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder={getLocalizedText(data.searchPlaceholder, locale)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FAF9F6] dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] text-xs text-[#0A0A0A] dark:text-[#EDEDEF] shadow-sm focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/10 outline-none transition-all duration-300"
            />
          </div>
        </SectionReveal>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post, index) => (
            <SectionReveal key={post.id} delay={index * 0.08}>
              <motion.article
                className="group rounded-2xl bg-[#FAF9F6] dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] hover:border-[#C5A059]/60 transition-all duration-350 cursor-pointer overflow-hidden shadow-card hover:shadow-card-hover flex flex-col justify-between"
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPost(post.id)}
              >
                <div>
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] bg-[#F4F4F5] dark:bg-[#141414] relative overflow-hidden">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={getLocalizedText(post.title, locale)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#71717A] p-4">
                        <FileText className="w-8 h-8 text-[#C5A059] mb-1" />
                        <span className="text-xs font-semibold">Article</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#C5A059] text-white text-[10px] uppercase font-bold tracking-wider shadow-lg shadow-[#C5A059]/20">
                      {getLocalizedText(post.category, locale)}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-[#71717A] font-mono mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        {post.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                        {post.readingTime} min
                      </span>
                    </div>

                    <h3 className="font-playfair text-xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF] mb-2 group-hover:text-[#C5A059] transition-colors duration-300 leading-snug line-clamp-2">
                      {getLocalizedText(post.title, locale)}
                    </h3>

                    <p className="text-xs md:text-sm text-[#52525B] dark:text-[#A1A1AA] line-clamp-3 leading-relaxed">
                      {getLocalizedText(post.excerpt, locale)}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#C5A059] group-hover:gap-2.5 transition-all duration-300">
                    {getLocalizedText(data.readMore, locale)}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.article>
            </SectionReveal>
          ))}
        </div>
      </div>

      {/* Reader Modal Lightbox */}
      <AnimatePresence>
        {openPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#0A0A0A]/85 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] rounded-2xl shadow-2xl overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md text-[#0A0A0A] dark:text-[#EDEDEF] hover:text-[#C5A059] shadow-lg cursor-pointer transition-colors duration-300"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 sm:h-96 w-full bg-[#FAFAFA] dark:bg-[#141414] overflow-hidden">
                {openPost.thumbnail && (
                  <img
                    src={openPost.thumbnail}
                    alt={getLocalizedText(openPost.title, locale)}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#161616] via-transparent to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 rounded-full bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#C5A059]/20">
                    {getLocalizedText(openPost.category, locale)}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <h1 className="font-playfair text-2xl sm:text-4xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF]">
                  {getLocalizedText(openPost.title, locale)}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7] dark:border-[#1C1C1C] text-xs text-[#52525B] dark:text-[#A1A1AA] font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-[#0A0A0A] dark:text-[#EDEDEF]">
                      <User className="w-3.5 h-3.5 text-[#C5A059]" /> Lamia Akoubache
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> {openPost.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> {openPost.readingTime} min read
                    </span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-[#C5A059] font-semibold hover:underline cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? "Copied!" : "Share"}</span>
                  </button>
                </div>

                <div className="space-y-4 text-[#0A0A0A]/80 dark:text-[#EDEDEF]/80 text-sm leading-relaxed">
                  <p className="text-base font-playfair italic text-[#C5A059] border-l-4 border-[#C5A059] pl-4 my-4">
                    &ldquo;{getLocalizedText(openPost.excerpt, locale)}&rdquo;
                  </p>
                  <p>{getLocalizedText(openPost.content, locale)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
