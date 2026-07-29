import { BlogData } from "@/types";

export const blogData: BlogData = {
  sectionTitle: {
    fr: "Journal",
    en: "Journal",
  },
  subtitle: {
    fr: "Réflexions sur l'architecture, le design et la créativité",
    en: "Reflections on architecture, design and creativity",
  },
  searchPlaceholder: {
    fr: "Rechercher un article...",
    en: "Search articles...",
  },
  readMore: {
    fr: "Lire la suite",
    en: "Read more",
  },
  posts: [
    {
      id: "1",
      slug: "lumiere-naturelle-architecture",
      title: {
        fr: "La Lumière Naturelle comme Matériau de Construction",
        en: "Natural Light as a Building Material",
      },
      excerpt: {
        fr: "Comment la lumière naturelle façonne notre perception de l'espace et influence le bien-être des occupants.",
        en: "How natural light shapes our perception of space and influences occupant well-being.",
      },
      content: {
        fr: "La lumière naturelle est bien plus qu'un simple éclairage — c'est un matériau de construction à part entière. Dans mes projets, j'explore comment les ouvertures, les orientations et les matériaux translucides peuvent transformer un espace ordinaire en une expérience sensorielle riche. L'architecture japonaise traditionnelle nous enseigne que la lumière filtrée crée une atmosphère de contemplation et de sérénité. Cette leçon reste profondément pertinente dans notre pratique contemporaine.",
        en: "Natural light is much more than simple illumination — it is a building material in its own right. In my projects, I explore how openings, orientations and translucent materials can transform an ordinary space into a rich sensory experience. Traditional Japanese architecture teaches us that filtered light creates an atmosphere of contemplation and serenity. This lesson remains deeply relevant in our contemporary practice.",
      },
      date: "2025-03-15",
      readingTime: 5,
      category: { fr: "Design", en: "Design" },
      categoryKey: "design",
      thumbnail: "/images/blog/light.jpg",
      featured: true,
    },
    {
      id: "2",
      slug: "architecture-durable-mediterranee",
      title: {
        fr: "Architecture Durable en Méditerranée",
        en: "Sustainable Architecture in the Mediterranean",
      },
      excerpt: {
        fr: "Les principes bioclimatiques traditionnels et leur application dans l'architecture contemporaine méditerranéenne.",
        en: "Traditional bioclimatic principles and their application in contemporary Mediterranean architecture.",
      },
      content: {
        fr: "La Méditerranée possède une tradition architecturale millénaire qui répond naturellement aux défis climatiques. Les patios, les moucharabiehs, les murs épais et les toits-terrasses sont autant de solutions bioclimatiques que nous redécouvrons aujourd'hui. Mon travail de recherche explore comment ces principes ancestraux peuvent être réinterprétés avec les technologies modernes pour créer une architecture véritablement durable.",
        en: "The Mediterranean has a millennia-old architectural tradition that naturally responds to climate challenges. Patios, mashrabiyas, thick walls and rooftop terraces are all bioclimatic solutions that we are rediscovering today. My research explores how these ancestral principles can be reinterpreted with modern technologies to create truly sustainable architecture.",
      },
      date: "2025-01-20",
      readingTime: 7,
      category: { fr: "Durabilité", en: "Sustainability" },
      categoryKey: "sustainability",
      thumbnail: "/images/blog/sustainable.jpg",
      featured: true,
    },
    {
      id: "3",
      slug: "maquette-ere-numerique",
      title: {
        fr: "La Maquette à l'Ère Numérique",
        en: "The Physical Model in the Digital Age",
      },
      excerpt: {
        fr: "Pourquoi la maquette physique reste un outil irremplaçable malgré la révolution numérique en architecture.",
        en: "Why the physical model remains an irreplaceable tool despite the digital revolution in architecture.",
      },
      content: {
        fr: "À l'heure où les rendus 3D et la réalité virtuelle dominent la présentation architecturale, la maquette physique garde une place essentielle dans le processus créatif. Toucher, voir sous différents angles, comprendre l'échelle — la maquette offre une compréhension spatiale que l'écran ne peut pas remplacer. Dans ma pratique, je combine systématiquement le numérique et le physique pour une exploration complète de mes projets.",
        en: "At a time when 3D renders and virtual reality dominate architectural presentation, the physical model retains an essential place in the creative process. Touching, seeing from different angles, understanding scale — the model offers a spatial understanding that the screen cannot replace. In my practice, I systematically combine digital and physical approaches for a complete exploration of my projects.",
      },
      date: "2024-11-08",
      readingTime: 4,
      category: { fr: "Processus", en: "Process" },
      categoryKey: "process",
      thumbnail: "/images/blog/model.jpg",
      featured: false,
    },
  ],
};
