/* ───────────────────────── Shared Types ───────────────────────── */

export type Locale = "fr" | "en";

export interface BilingualText {
  fr: string;
  en: string;
}

export interface BilingualRichText {
  fr: string[];
  en: string[];
}

/* ───────────────────────── Hero ───────────────────────── */

export interface HeroData {
  name: string;
  title: BilingualText;
  subtitle: BilingualText;
  intro: BilingualText;
  profileImage: string;
  specialty: BilingualText;
  cta: BilingualText;
  scrollText: BilingualText;
}

/* ───────────────────────── About ───────────────────────── */

export interface Education {
  degree: BilingualText;
  institution: BilingualText;
  year: string;
  description: BilingualText;
}

export interface Statistic {
  value: string;
  label: BilingualText;
}

export interface AboutData {
  sectionTitle: BilingualText;
  photo: string;
  biography: BilingualRichText;
  philosophy: BilingualText;
  education: Education[];
  statistics: Statistic[];
}

/* ───────────────────────── Skills ───────────────────────── */

export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
}

export interface SkillCategory {
  title: BilingualText;
  icon: string;
  skills: Skill[];
}

export interface SkillsData {
  sectionTitle: BilingualText;
  subtitle: BilingualText;
  categories: SkillCategory[];
}

/* ───────────────────────── Projects ───────────────────────── */

export interface Project {
  id: string;
  slug: string;
  title: BilingualText;
  category: BilingualText;
  categoryKey: string;
  description: BilingualText;
  longDescription: BilingualRichText;
  location: BilingualText;
  year: string;
  software: string[];
  concept: BilingualText;
  coverImage: string;
  images: string[];
  featured: boolean;
}

export interface ProjectsData {
  sectionTitle: BilingualText;
  subtitle: BilingualText;
  filterAll: BilingualText;
  categories: { key: string; label: BilingualText }[];
  projects: Project[];
}

/* ───────────────────────── Experience ───────────────────────── */

export interface ExperienceEntry {
  id: string;
  role: BilingualText;
  company: BilingualText;
  location: BilingualText;
  startDate: string;
  endDate: string;
  description: BilingualText;
  type: "work" | "education" | "internship";
}

export interface ExperienceData {
  sectionTitle: BilingualText;
  subtitle: BilingualText;
  entries: ExperienceEntry[];
}

/* ───────────────────────── Testimonials ───────────────────────── */

export interface Testimonial {
  id: string;
  quote: BilingualText;
  author: string;
  role: BilingualText;
  company: BilingualText;
  photo: string;
}

export interface TestimonialsData {
  sectionTitle: BilingualText;
  subtitle: BilingualText;
  testimonials: Testimonial[];
}

/* ───────────────────────── Blog ───────────────────────── */

export interface BlogPost {
  id: string;
  slug: string;
  title: BilingualText;
  excerpt: BilingualText;
  content: BilingualText;
  date: string;
  readingTime: number;
  category: BilingualText;
  categoryKey: string;
  thumbnail: string;
  featured: boolean;
}

export interface BlogData {
  sectionTitle: BilingualText;
  subtitle: BilingualText;
  searchPlaceholder: BilingualText;
  readMore: BilingualText;
  posts: BlogPost[];
}

/* ───────────────────────── Contact ───────────────────────── */

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactData {
  sectionTitle: BilingualText;
  subtitle: BilingualText;
  email: string;
  phone: string;
  location: BilingualText;
  formAction: string;
  namePlaceholder: BilingualText;
  emailPlaceholder: BilingualText;
  messagePlaceholder: BilingualText;
  sendButton: BilingualText;
  socialLinks: SocialLink[];
}

/* ───────────────────────── Resume ───────────────────────── */

export interface ResumeData {
  sectionTitle: BilingualText;
  subtitle: BilingualText;
  downloadText: BilingualText;
  previewText: BilingualText;
  resumeUrl: string;
}

/* ───────────────────────── Site Config ───────────────────────── */

export interface NavItem {
  label: BilingualText;
  href: string;
}

export interface SiteConfig {
  name: string;
  title: BilingualText;
  description: BilingualText;
  url: string;
  ogImage: string;
  navItems: NavItem[];
}
