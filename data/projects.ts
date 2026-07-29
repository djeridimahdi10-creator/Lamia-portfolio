import { ProjectsData } from "@/types";

export const projectsData: ProjectsData = {
  sectionTitle: {
    fr: "Projets",
    en: "Projects",
  },
  subtitle: {
    fr: "Une sélection de projets architecturaux qui définissent ma vision",
    en: "A selection of architectural projects that define my vision",
  },
  filterAll: {
    fr: "Tous",
    en: "All",
  },
  categories: [
    { key: "residential", label: { fr: "Résidentiel", en: "Residential" } },
    { key: "cultural", label: { fr: "Culturel", en: "Cultural" } },
    { key: "urban", label: { fr: "Urbain", en: "Urban" } },
    { key: "conceptual", label: { fr: "Conceptuel", en: "Conceptual" } },
  ],
  projects: [
    {
      id: "1",
      slug: "maison-lumiere",
      title: { fr: "Maison Lumière", en: "Light House" },
      category: { fr: "Résidentiel", en: "Residential" },
      categoryKey: "residential",
      description: {
        fr: "Une résidence contemporaine qui capture et diffuse la lumière naturelle à travers des volumes géométriques purs.",
        en: "A contemporary residence that captures and diffuses natural light through pure geometric volumes.",
      },
      longDescription: {
        fr: [
          "La Maison Lumière est un projet résidentiel qui explore la relation intime entre l'architecture et la lumière naturelle.",
          "Chaque espace a été conçu pour maximiser l'apport lumineux tout en préservant l'intimité des habitants.",
          "Les matériaux — béton brut, verre et bois — créent un dialogue subtil avec l'environnement méditerranéen.",
        ],
        en: [
          "The Light House is a residential project that explores the intimate relationship between architecture and natural light.",
          "Each space has been designed to maximize natural light while preserving the privacy of the inhabitants.",
          "The materials — raw concrete, glass and wood — create a subtle dialogue with the Mediterranean environment.",
        ],
      },
      location: { fr: "Alger, Algérie", en: "Algiers, Algeria" },
      year: "2025",
      software: ["AutoCAD", "Revit", "Lumion", "Photoshop"],
      concept: {
        fr: "La lumière comme matériau de construction",
        en: "Light as a building material",
      },
      coverImage: "/images/projects/lumiere-cover.jpg",
      images: [],
      featured: true,
    },
    {
      id: "2",
      slug: "centre-culturel-oasis",
      title: { fr: "Centre Culturel Oasis", en: "Oasis Cultural Center" },
      category: { fr: "Culturel", en: "Cultural" },
      categoryKey: "cultural",
      description: {
        fr: "Un centre culturel inspiré par les oasis, créant un refuge de savoir et d'art au cœur de la ville.",
        en: "A cultural center inspired by oases, creating a haven of knowledge and art in the heart of the city.",
      },
      longDescription: {
        fr: [
          "Le Centre Culturel Oasis s'inspire de la forme et de l'esprit des oasis sahariennes.",
          "Le bâtiment s'organise autour d'un jardin intérieur central, créant un microclimat naturel.",
          "Les espaces d'exposition, la bibliothèque et l'auditorium s'articulent autour de ce noyau vert.",
        ],
        en: [
          "The Oasis Cultural Center draws inspiration from the form and spirit of Saharan oases.",
          "The building is organized around a central interior garden, creating a natural microclimate.",
          "Exhibition spaces, the library and the auditorium are arranged around this green core.",
        ],
      },
      location: { fr: "Constantine, Algérie", en: "Constantine, Algeria" },
      year: "2024",
      software: ["SketchUp", "V-Ray", "AutoCAD", "InDesign"],
      concept: {
        fr: "L'oasis comme modèle architectural durable",
        en: "The oasis as a sustainable architectural model",
      },
      coverImage: "/images/projects/oasis-cover.jpg",
      images: [],
      featured: true,
    },
    {
      id: "3",
      slug: "eco-quartier-horizon",
      title: { fr: "Éco-Quartier Horizon", en: "Horizon Eco-District" },
      category: { fr: "Urbain", en: "Urban" },
      categoryKey: "urban",
      description: {
        fr: "Un projet d'urbanisme durable qui réinvente la vie en communauté avec des espaces verts intégrés.",
        en: "A sustainable urban planning project that reinvents community living with integrated green spaces.",
      },
      longDescription: {
        fr: [
          "L'Éco-Quartier Horizon est un projet de Master qui imagine un quartier résidentiel du futur.",
          "Le projet intègre des principes bioclimatiques, des espaces partagés et une mobilité douce.",
          "L'objectif est de créer un lieu de vie durable, inclusif et connecté à la nature.",
        ],
        en: [
          "The Horizon Eco-District is a Master project that imagines a residential neighborhood of the future.",
          "The project integrates bioclimatic principles, shared spaces, and soft mobility.",
          "The goal is to create a sustainable, inclusive living place connected to nature.",
        ],
      },
      location: { fr: "Oran, Algérie", en: "Oran, Algeria" },
      year: "2024",
      software: ["Rhino", "Grasshopper", "AutoCAD", "Photoshop"],
      concept: {
        fr: "Urbanisme régénératif et bioclimatique",
        en: "Regenerative and bioclimatic urbanism",
      },
      coverImage: "/images/projects/horizon-cover.jpg",
      images: [],
      featured: true,
    },
    {
      id: "4",
      slug: "pavillon-reflexion",
      title: { fr: "Pavillon Réflexion", en: "Reflection Pavilion" },
      category: { fr: "Conceptuel", en: "Conceptual" },
      categoryKey: "conceptual",
      description: {
        fr: "Un pavillon temporaire explorant la dualité entre transparence et opacité, réel et reflet.",
        en: "A temporary pavilion exploring the duality between transparency and opacity, reality and reflection.",
      },
      longDescription: {
        fr: [
          "Le Pavillon Réflexion est un exercice conceptuel sur la perception de l'espace.",
          "Utilisant des surfaces miroir et du verre traité, le pavillon joue avec les reflets et les perspectives.",
          "Le visiteur est invité à questionner les limites entre intérieur et extérieur.",
        ],
        en: [
          "The Reflection Pavilion is a conceptual exercise on the perception of space.",
          "Using mirror surfaces and treated glass, the pavilion plays with reflections and perspectives.",
          "The visitor is invited to question the boundaries between interior and exterior.",
        ],
      },
      location: { fr: "Paris, France", en: "Paris, France" },
      year: "2023",
      software: ["Rhino", "3ds Max", "V-Ray", "Illustrator"],
      concept: {
        fr: "La matière comme miroir de l'environnement",
        en: "Material as a mirror of the environment",
      },
      coverImage: "/images/projects/reflexion-cover.jpg",
      images: [],
      featured: false,
    },
    {
      id: "5",
      slug: "villa-terrasses",
      title: { fr: "Villa des Terrasses", en: "Terraces Villa" },
      category: { fr: "Résidentiel", en: "Residential" },
      categoryKey: "residential",
      description: {
        fr: "Une villa en gradins épousant la topographie naturelle du terrain, avec des terrasses végétalisées.",
        en: "A stepped villa embracing the natural topography, with vegetated terraces.",
      },
      longDescription: {
        fr: [
          "La Villa des Terrasses est une réponse architecturale à un terrain en pente prononcée.",
          "Chaque niveau offre une terrasse privée avec vue panoramique sur la vallée.",
          "L'intégration de toitures végétalisées réduit l'impact environnemental et assure une isolation naturelle.",
        ],
        en: [
          "The Terraces Villa is an architectural response to a steeply sloping site.",
          "Each level offers a private terrace with panoramic views of the valley.",
          "The integration of green roofs reduces environmental impact and provides natural insulation.",
        ],
      },
      location: { fr: "Tizi Ouzou, Algérie", en: "Tizi Ouzou, Algeria" },
      year: "2023",
      software: ["Revit", "Enscape", "AutoCAD", "Photoshop"],
      concept: {
        fr: "L'architecture comme prolongement du paysage",
        en: "Architecture as an extension of the landscape",
      },
      coverImage: "/images/projects/terrasses-cover.jpg",
      images: [],
      featured: false,
    },
    {
      id: "6",
      slug: "bibliotheque-silence",
      title: { fr: "Bibliothèque du Silence", en: "Library of Silence" },
      category: { fr: "Culturel", en: "Cultural" },
      categoryKey: "cultural",
      description: {
        fr: "Un espace de lecture contemplatif où l'acoustique et la lumière créent une atmosphère de recueillement.",
        en: "A contemplative reading space where acoustics and light create an atmosphere of reflection.",
      },
      longDescription: {
        fr: [
          "La Bibliothèque du Silence explore le concept du silence comme matière architecturale.",
          "Des volumes en béton matricé filtrent la lumière, créant des ambiances changeantes au fil de la journée.",
          "L'acoustique a été pensée pour favoriser la concentration et l'introspection.",
        ],
        en: [
          "The Library of Silence explores the concept of silence as an architectural material.",
          "Patterned concrete volumes filter light, creating changing ambiances throughout the day.",
          "The acoustics were designed to promote concentration and introspection.",
        ],
      },
      location: { fr: "Annaba, Algérie", en: "Annaba, Algeria" },
      year: "2022",
      software: ["SketchUp", "AutoCAD", "Lumion", "InDesign"],
      concept: {
        fr: "Le silence comme espace architectural",
        en: "Silence as architectural space",
      },
      coverImage: "/images/projects/silence-cover.jpg",
      images: [],
      featured: true,
    },
  ],
};
