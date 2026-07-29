"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Default data imports
import { heroData as defaultHero } from "@/data/hero";
import { aboutData as defaultAbout } from "@/data/about";
import { skillsData as defaultSkills } from "@/data/skills";
import { projectsData as defaultProjects } from "@/data/projects";
import { experienceData as defaultExperience } from "@/data/experience";
import { testimonialsData as defaultTestimonials } from "@/data/testimonials";
import { blogData as defaultBlog } from "@/data/blog";
import { contactData as defaultContact } from "@/data/contact";
import { resumeData as defaultResume } from "@/data/resume";

export interface PortfolioData {
  hero: typeof defaultHero;
  about: typeof defaultAbout;
  skills: typeof defaultSkills;
  projects: typeof defaultProjects;
  experience: typeof defaultExperience;
  testimonials: typeof defaultTestimonials;
  blog: typeof defaultBlog;
  contact: typeof defaultContact;
  resume: typeof defaultResume;
}

const defaultData: PortfolioData = {
  hero: defaultHero,
  about: defaultAbout,
  skills: defaultSkills,
  projects: defaultProjects,
  experience: defaultExperience,
  testimonials: defaultTestimonials,
  blog: defaultBlog,
  contact: defaultContact,
  resume: defaultResume,
};

interface ContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => void;
  resetData: () => void;
}

const PortfolioDataContext = createContext<ContextType>({
  data: defaultData,
  updateData: () => { },
  resetData: () => { },
});

function mergePortfolioData(parsed: Record<string, any>): PortfolioData {
  return {
    hero: { ...defaultHero, ...parsed.hero },
    about: { ...defaultAbout, ...parsed.about },
    skills: { ...defaultSkills, ...parsed.skills },
    projects: { ...defaultProjects, ...parsed.projects },
    experience: { ...defaultExperience, ...parsed.experience },
    testimonials: { ...defaultTestimonials, ...parsed.testimonials },
    blog: { ...defaultBlog, ...parsed.blog },
    contact: { ...defaultContact, ...parsed.contact },
    resume: { ...defaultResume, ...parsed.resume },
  };
}

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer reads from localStorage on first render, avoiding setState-in-effect
  const [data, setData] = useState<PortfolioData>(() => {
    if (typeof window === "undefined") return defaultData;
    try {
      const saved = localStorage.getItem("portfolio_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergePortfolioData(parsed);
      }
    } catch (err) {
      console.error("Failed to parse saved portfolio data", err);
    }
    return defaultData;
  });

  useEffect(() => {
    // Listen for storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "portfolio_data" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData(mergePortfolioData(parsed));
        } catch { }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateData = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem("portfolio_data", JSON.stringify(newData));
    // Trigger custom event for same-window updates
    window.dispatchEvent(new Event("portfolio_data_updated"));
  };

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem("portfolio_data");
    window.dispatchEvent(new Event("portfolio_data_updated"));
  };

  // Custom event listener for same window tab updates
  useEffect(() => {
    const handleCustomEvent = () => {
      const saved = localStorage.getItem("portfolio_data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData(mergePortfolioData(parsed));
        } catch { }
      } else {
        setData(defaultData);
      }
    };

    window.addEventListener("portfolio_data_updated", handleCustomEvent);
    return () => window.removeEventListener("portfolio_data_updated", handleCustomEvent);
  }, []);

  return (
    <PortfolioDataContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
