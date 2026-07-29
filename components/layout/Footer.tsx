"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const { data: portfolioData } = usePortfolioData();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.includes("/admin")) {
    return null;
  }

  const socialLinks = portfolioData.contact?.socialLinks || [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-[#0A0A0A]/5 dark:border-white/5 bg-white/50 dark:bg-[#0A0A0A]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between h-20">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <p className="font-playfair text-base font-semibold text-[#0A0A0A] dark:text-[#EDEDEF]">
              <span className="text-[#C5A059]">L</span>amia
              <span className="text-[#C5A059]">.</span>
            </p>
            <span className="hidden sm:inline text-[#0A0A0A]/15 dark:text-white/15">·</span>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              © {currentYear} Lamia Akoubache
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-1 my-4 md:my-0">
            {socialLinks.map((social: any) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-[#52525B] dark:text-[#A1A1AA] hover:text-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300"
                aria-label={social.platform}
              >
                <SocialIcon platform={social.platform} size={17} />
              </a>
            ))}
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[13px] text-[#52525B] dark:text-[#A1A1AA] hover:text-[#C5A059] transition-colors duration-300 group cursor-pointer"
            aria-label={t("backToTop")}
          >
            <span className="font-medium">{t("backToTop")}</span>
            <ArrowUp
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
