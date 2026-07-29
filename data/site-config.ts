import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Lamia Akoubache",
  title: {
    fr: "Lamia Akoubache — Portfolio Architecture",
    en: "Lamia Akoubache — Architecture Portfolio",
  },
  description: {
    fr: "Portfolio d'architecture de Lamia Akoubache, étudiante en Master 2 Architecture. Découvrez mes projets, ma vision et mon parcours.",
    en: "Architecture portfolio of Lamia Akoubache, Master 2 Architecture student. Discover my projects, vision and journey.",
  },
  url: "https://lamia-akoubache.vercel.app",
  ogImage: "/images/og-image.jpg",
  navItems: [
    { label: { fr: "Accueil", en: "Home" }, href: "#hero" },
    { label: { fr: "À propos", en: "About" }, href: "#about" },
    { label: { fr: "Compétences", en: "Skills" }, href: "#skills" },
    { label: { fr: "Projets", en: "Projects" }, href: "#projects" },
    { label: { fr: "Expérience", en: "Experience" }, href: "#experience" },
    { label: { fr: "Témoignages", en: "Testimonials" }, href: "#testimonials" },
    { label: { fr: "Blog", en: "Blog" }, href: "#blog" },
    { label: { fr: "Contact", en: "Contact" }, href: "#contact" },
    { label: { fr: "CV", en: "Resume" }, href: "#resume" },
  ],
};

