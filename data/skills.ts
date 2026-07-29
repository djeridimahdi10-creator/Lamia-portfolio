import { SkillsData } from "@/types";

export const skillsData: SkillsData = {
  sectionTitle: {
    fr: "Compétences",
    en: "Skills",
  },
  subtitle: {
    fr: "Outils et savoir-faire acquis au fil de mon parcours",
    en: "Tools and expertise acquired throughout my journey",
  },
  categories: [
    {
      title: { fr: "Logiciels de Conception", en: "Design Software" },
      icon: "Pen",
      skills: [
        { name: "AutoCAD", level: 95 },
        { name: "Revit", level: 85 },
        { name: "SketchUp", level: 90 },
        { name: "Rhino 3D", level: 80 },
        { name: "3ds Max", level: 75 },
        { name: "V-Ray", level: 78 },
      ],
    },
    {
      title: { fr: "Créativité & Graphisme", en: "Creative & Graphics" },
      icon: "Palette",
      skills: [
        { name: "Adobe Photoshop", level: 90 },
        { name: "Adobe Illustrator", level: 85 },
        { name: "Adobe InDesign", level: 88 },
        { name: "Lumion", level: 82 },
        { name: "Enscape", level: 75 },
        { name: "Blender", level: 65 },
      ],
    },
    {
      title: { fr: "Compétences Techniques", en: "Technical Skills" },
      icon: "Settings",
      skills: [
        { name: "Dessin Technique", level: 95 },
        { name: "Maquettisme", level: 90 },
        { name: "BIM", level: 80 },
        { name: "Urbanisme", level: 78 },
        { name: "Développement Durable", level: 85 },
        { name: "Réglementation", level: 70 },
      ],
    },
    {
      title: { fr: "Compétences Humaines", en: "Soft Skills" },
      icon: "Users",
      skills: [
        { name: "Travail d'équipe", level: 95 },
        { name: "Présentation", level: 90 },
        { name: "Gestion de projet", level: 85 },
        { name: "Créativité", level: 95 },
        { name: "Esprit critique", level: 88 },
        { name: "Communication", level: 92 },
      ],
    },
  ],
};
