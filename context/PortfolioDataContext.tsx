"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getPortfolioContentAction, savePortfolioContentAction } from "@/app/actions/portfolio";

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
  updateData: (newData: PortfolioData) => Promise<{ success: boolean; error?: string }>;
  resetData: () => Promise<void>;
  isLoading: boolean;
}

const PortfolioDataContext = createContext<ContextType>({
  data: defaultData,
  updateData: async () => ({ success: true }),
  resetData: async () => {},
  isLoading: false,
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
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCloudData() {
      try {
        const res = await getPortfolioContentAction();
        if (res.success && res.data) {
          const merged = mergePortfolioData(res.data);
          setData(merged);
          if (typeof window !== "undefined") {
            localStorage.setItem("portfolio_data", JSON.stringify(merged));
          }
        } else {
          const saved = localStorage.getItem("portfolio_data");
          if (saved) {
            setData(mergePortfolioData(JSON.parse(saved)));
          }
        }
      } catch (err) {
        console.warn("Could not load cloud portfolio data:", err);
        try {
          const saved = localStorage.getItem("portfolio_data");
          if (saved) {
            setData(mergePortfolioData(JSON.parse(saved)));
          }
        } catch {}
      } finally {
        setIsLoading(false);
      }
    }

    loadCloudData();
  }, []);

  const updateData = async (newData: PortfolioData) => {
    setData(newData);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_data", JSON.stringify(newData));
      window.dispatchEvent(new Event("portfolio_data_updated"));
    }
    // Save to Supabase Cloud
    const res = await savePortfolioContentAction(newData);
    return res;
  };

  const resetData = async () => {
    setData(defaultData);
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_data");
      window.dispatchEvent(new Event("portfolio_data_updated"));
    }
    // Reset on Supabase Cloud
    await savePortfolioContentAction(defaultData);
  };

  return (
    <PortfolioDataContext.Provider value={{ data, updateData, resetData, isLoading }}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
