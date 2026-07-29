import { AboutData } from "@/types";

export const aboutData: AboutData = {
  sectionTitle: {
    fr: "À Propos",
    en: "About",
  },
  photo: "/images/about.jpg",
  biography: {
    fr: [
      "Passionnée par l'architecture depuis mon plus jeune âge, je poursuis actuellement un Master 2 en Architecture. Mon approche se situe à l'intersection de l'innovation durable et du design contextuel.",
      "Je crois que l'architecture est bien plus que des murs et des toits — c'est la création d'expériences, d'émotions et de connexions entre les personnes et leur environnement.",
      "Mon travail explore la relation entre les formes organiques et la rigueur géométrique, cherchant toujours l'harmonie entre l'espace bâti et son contexte naturel.",
    ],
    en: [
      "Passionate about architecture since a young age, I am currently pursuing a Master 2 in Architecture. My approach sits at the intersection of sustainable innovation and contextual design.",
      "I believe architecture is much more than walls and roofs — it is about creating experiences, emotions, and connections between people and their environment.",
      "My work explores the relationship between organic forms and geometric rigor, always seeking harmony between the built space and its natural context.",
    ],
  },
  philosophy: {
    fr: "L'architecture devrait être un dialogue silencieux entre l'homme et la nature, un espace où la lumière sculpte l'émotion.",
    en: "Architecture should be a silent dialogue between man and nature, a space where light sculpts emotion.",
  },
  education: [
    {
      degree: { fr: "Master 2 Architecture", en: "Master 2 Architecture" },
      institution: { fr: "École Nationale Supérieure d'Architecture", en: "National School of Architecture" },
      year: "2024 — 2026",
      description: {
        fr: "Spécialisation en architecture durable et design urbain",
        en: "Specialization in sustainable architecture and urban design",
      },
    },
    {
      degree: { fr: "Master 1 Architecture", en: "Master 1 Architecture" },
      institution: { fr: "École Nationale Supérieure d'Architecture", en: "National School of Architecture" },
      year: "2023 — 2024",
      description: {
        fr: "Conception architecturale avancée et théorie",
        en: "Advanced architectural design and theory",
      },
    },
    {
      degree: { fr: "Licence Architecture", en: "Bachelor of Architecture" },
      institution: { fr: "École Nationale Supérieure d'Architecture", en: "National School of Architecture" },
      year: "2020 — 2023",
      description: {
        fr: "Fondamentaux de l'architecture, dessin technique et modélisation",
        en: "Architecture fundamentals, technical drawing and modeling",
      },
    },
  ],
  statistics: [
    { value: "15+", label: { fr: "Projets Réalisés", en: "Completed Projects" } },
    { value: "5", label: { fr: "Années d'Études", en: "Years of Study" } },
    { value: "3", label: { fr: "Stages Professionnels", en: "Professional Internships" } },
    { value: "8", label: { fr: "Prix & Distinctions", en: "Awards & Honors" } },
  ],
};
