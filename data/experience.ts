import { ExperienceData } from "@/types";

export const experienceData: ExperienceData = {
  sectionTitle: {
    fr: "Expérience",
    en: "Experience",
  },
  subtitle: {
    fr: "Mon parcours académique et professionnel",
    en: "My academic and professional journey",
  },
  entries: [
    {
      id: "1",
      role: { fr: "Étudiante en Master 2", en: "Master 2 Student" },
      company: { fr: "École Nationale Supérieure d'Architecture", en: "National School of Architecture" },
      location: { fr: "Alger, Algérie", en: "Algiers, Algeria" },
      startDate: "2024",
      endDate: "2026",
      description: {
        fr: "Spécialisation en architecture durable et conception bioclimatique. Projet de fin d'études sur l'habitat collectif écologique.",
        en: "Specialization in sustainable architecture and bioclimatic design. Final year project on ecological collective housing.",
      },
      type: "education",
    },
    {
      id: "2",
      role: { fr: "Stagiaire Architecte", en: "Architecture Intern" },
      company: { fr: "Atelier d'Architecture Méditerranée", en: "Mediterranean Architecture Studio" },
      location: { fr: "Alger, Algérie", en: "Algiers, Algeria" },
      startDate: "2024",
      endDate: "2024",
      description: {
        fr: "Stage de 6 mois. Participation à la conception de projets résidentiels et culturels. Modélisation BIM et réalisation de rendus 3D.",
        en: "6-month internship. Participated in the design of residential and cultural projects. BIM modeling and 3D rendering.",
      },
      type: "internship",
    },
    {
      id: "3",
      role: { fr: "Étudiante en Master 1", en: "Master 1 Student" },
      company: { fr: "École Nationale Supérieure d'Architecture", en: "National School of Architecture" },
      location: { fr: "Alger, Algérie", en: "Algiers, Algeria" },
      startDate: "2023",
      endDate: "2024",
      description: {
        fr: "Conception architecturale avancée, théorie de l'architecture, urbanisme et développement durable.",
        en: "Advanced architectural design, architecture theory, urbanism and sustainable development.",
      },
      type: "education",
    },
    {
      id: "4",
      role: { fr: "Assistante de Recherche", en: "Research Assistant" },
      company: { fr: "Laboratoire d'Architecture Bioclimatique", en: "Bioclimatic Architecture Laboratory" },
      location: { fr: "Alger, Algérie", en: "Algiers, Algeria" },
      startDate: "2023",
      endDate: "2023",
      description: {
        fr: "Recherche sur les matériaux de construction écologiques et les techniques de ventilation naturelle en climat méditerranéen.",
        en: "Research on ecological building materials and natural ventilation techniques in Mediterranean climate.",
      },
      type: "work",
    },
    {
      id: "5",
      role: { fr: "Stagiaire", en: "Intern" },
      company: { fr: "Bureau d'Études Urbaines", en: "Urban Studies Office" },
      location: { fr: "Constantine, Algérie", en: "Constantine, Algeria" },
      startDate: "2022",
      endDate: "2022",
      description: {
        fr: "Stage d'observation et de pratique. Relevés architecturaux, plans d'urbanisme et études de faisabilité.",
        en: "Observation and practice internship. Architectural surveys, urban plans, and feasibility studies.",
      },
      type: "internship",
    },
    {
      id: "6",
      role: { fr: "Étudiante en Licence", en: "Bachelor Student" },
      company: { fr: "École Nationale Supérieure d'Architecture", en: "National School of Architecture" },
      location: { fr: "Alger, Algérie", en: "Algiers, Algeria" },
      startDate: "2020",
      endDate: "2023",
      description: {
        fr: "Formation fondamentale en architecture : dessin, modélisation, histoire de l'architecture, construction et structure.",
        en: "Fundamental training in architecture: drawing, modeling, architecture history, construction and structure.",
      },
      type: "education",
    },
  ],
};
