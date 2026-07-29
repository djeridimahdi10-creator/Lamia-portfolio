"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Globe, Lock } from "lucide-react";
import { siteConfig } from "@/data/site-config";

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = useCallback((href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (pathname?.includes("/admin")) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [pathname]);

  if (pathname?.includes("/admin")) {
    return null;
  }

  const switchLocale = () => {
    const targetLocale = locale === "fr" ? "en" : "fr";
    if (targetLocale === "en") {
      if (pathname?.startsWith("/fr")) {
        router.push(pathname.replace("/fr", "/en"));
      } else if (!pathname || pathname === "/") {
        router.push("/en");
      } else if (!pathname.startsWith("/en")) {
        router.push(`/en${pathname}`);
      }
    } else {
      if (pathname?.startsWith("/en")) {
        const newPath = pathname.replace("/en", "") || "/";
        router.push(newPath);
      } else {
        router.push("/");
      }
    }
  };

  const navLinks = siteConfig.navItems;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 pointer-events-none"
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition-all duration-300 pointer-events-auto ${
            scrolled
              ? "bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-xl border border-[#E4E4E7]/60 dark:border-[#27272A]/60 shadow-lg shadow-black/[0.03]"
              : "bg-white/40 dark:bg-[#0F0F0F]/40 backdrop-blur-sm border border-transparent"
          }`}
        >
          {/* Logo Badge */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#hero");
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#C5A059] text-white flex items-center justify-center font-playfair font-bold text-base shadow-md shadow-[#C5A059]/20 group-hover:scale-105 transition-transform duration-300">
              L
            </div>
            <span className="font-playfair text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-[#EDEDEF] hidden xs:inline">
              Lamia<span className="text-[#C5A059]">.</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.03] p-1 rounded-xl border border-[#E4E4E7]/40 dark:border-[#27272A]/40">
            {navLinks.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={`relative px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer rounded-lg ${
                    isActive
                      ? "text-[#0A0A0A] dark:text-[#EDEDEF]"
                      : "text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#EDEDEF]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label[locale as "fr" | "en"]}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Controls Right */}
          <div className="flex items-center gap-2">
            {/* Admin Portal Link */}
            <a
              href={`/${locale}/admin`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] text-[#C5A059] bg-[#C5A059]/8 hover:bg-[#C5A059] hover:text-white transition-all duration-300 border border-[#C5A059]/25 shadow-xs"
              title={locale === "fr" ? "Administration Studio" : "Studio Administration"}
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </a>

            {/* Language Switch */}
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#A1A1AA] hover:text-[#EDEDEF] bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-300 cursor-pointer border border-[#27272A]/40"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="uppercase font-mono text-[10px]">
                {locale === "fr" ? "EN" : "FR"}
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-[#0A0A0A] dark:text-[#EDEDEF] bg-black/[0.03] dark:bg-white/[0.03] transition-colors duration-300 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#FAF9F6]/98 dark:bg-[#0F0F0F]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 pt-28"
          >
            <div className="flex flex-col items-center justify-center space-y-5 my-auto">
              {navLinks.map((item, index) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`font-playfair text-3xl font-bold tracking-tight transition-colors duration-300 ${
                      isActive ? "text-[#C5A059]" : "text-[#0A0A0A] dark:text-[#EDEDEF]"
                    }`}
                  >
                    {item.label[locale as "fr" | "en"]}
                  </motion.a>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 pt-6 border-t border-[#E4E4E7] dark:border-[#27272A]">
              <a
                href={`/${locale}/admin`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] text-white bg-[#C5A059] shadow-lg shadow-[#C5A059]/20"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Studio</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
