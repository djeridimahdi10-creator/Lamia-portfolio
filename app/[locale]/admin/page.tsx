"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { validateAdminPassword, checkAdminAuth, logoutAdmin } from "@/app/actions/auth";
import {
  Lock, LogOut, Download, Upload, Save, ArrowLeft,
  Home, User, Wrench, FolderOpen, Briefcase,
  MessageSquare, BookOpen, Mail, FileText,
  Plus, Trash2, RefreshCw, Edit3, AlertTriangle, Eye, Sparkles,
  LayoutDashboard, GraduationCap, BarChart3, EyeOff, MoreHorizontal
} from "lucide-react";

import { heroData as defaultHero } from "@/data/hero";
import { aboutData as defaultAbout } from "@/data/about";
import { skillsData as defaultSkills } from "@/data/skills";
import { projectsData as defaultProjects } from "@/data/projects";
import { experienceData as defaultExperience } from "@/data/experience";
import { testimonialsData as defaultTestimonials } from "@/data/testimonials";
import { blogData as defaultBlog } from "@/data/blog";
import { contactData as defaultContact } from "@/data/contact";
import { resumeData as defaultResume } from "@/data/resume";
import { usePortfolioData } from "@/context/PortfolioDataContext";

import { ToastContainer, ToastItem, ToastType } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { AdminTable, Column } from "@/components/ui/AdminTable";
import { BilingualInput } from "@/components/ui/BilingualInput";
import { ProjectGalleryManager } from "@/components/ui/ProjectGalleryManager";
import type { Project } from "@/types";

const tabGroups = [
  {
    title: "Portfolio & Works",
    items: [
      { key: "projects", icon: FolderOpen },
      { key: "skills", icon: Wrench },
      { key: "experience", icon: Briefcase },
    ],
  },
  {
    title: "Studio & Bio",
    items: [
      { key: "hero", icon: Home },
      { key: "about", icon: User },
      { key: "contact", icon: Mail },
      { key: "resume", icon: FileText },
    ],
  },
  {
    title: "Publications",
    items: [
      { key: "blog", icon: BookOpen },
      { key: "testimonials", icon: MessageSquare },
    ],
  },
];

const metricIcons: Record<string, React.ElementType> = {
  projects: FolderOpen,
  skills: Wrench,
  experience: Briefcase,
  testimonials: MessageSquare,
  blog: BookOpen,
};

export default function AdminPage() {
  const t = useTranslations("admin");
  const currentLocale = useLocale();
  const { data: contextData, updateData, resetData } = usePortfolioData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<Record<string, any>>({});
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showMobileMore, setShowMobileMore] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  // Sync admin state with live contextData from Supabase
  useEffect(() => {
    if (contextData && Object.keys(contextData).length > 0) {
      setData(contextData);
    }
  }, [contextData]);

  const addToast = (message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string | number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadDefaults = useCallback(() => {
    const defaults = {
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
    setData(defaults);
    resetData();
  }, [resetData]);

  useEffect(() => {
    // Only check authentic server session cookie
    checkAdminAuth()
      .then((isAuth) => {
        setIsAuthenticated(isAuth);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await validateAdminPassword(password);
    if (res.success) {
      setIsAuthenticated(true);
      setError("");
      addToast("Successfully logged into Studio Admin", "success");
    } else {
      setError(t("wrongPassword"));
      addToast(t("wrongPassword"), "error");
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    addToast("Logged out of Studio Admin", "info");
  };

  const saveToLocalStorage = useCallback(async () => {
    const res = await updateData(data as any);
    setSaved(true);
    if (res && res.error) {
      addToast(`Cloud save notice: ${res.error}`, "error");
    } else {
      addToast(t("saved"), "success");
    }
    setTimeout(() => setSaved(false), 2000);
  }, [data, updateData, t]);

  useEffect(() => {
    if (Object.keys(data).length > 0 && isAuthenticated) {
      const timer = setTimeout(() => {
        updateData(data as any);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [data, updateData, isAuthenticated]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Portfolio configuration exported successfully", "success");
  };

  const importJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const imported = JSON.parse(ev.target?.result as string);
            setData(imported);
            saveToLocalStorage();
            addToast("Portfolio configuration imported successfully", "success");
          } catch {
            addToast(t("invalidJson"), "error");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const updateSectionData = (section: string, newContent: any) => {
    setData((prev) => ({ ...prev, [section]: newContent }));
  };

  /* ─── Login View ─── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF9F6] dark:bg-[#0A0A0A]">
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 sm:p-10 bg-white dark:bg-[#141414] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl shadow-2xl relative"
        >
          <a
            href={`/${currentLocale}`}
            className="inline-flex items-center gap-2 text-xs text-[#71717A] hover:text-[#C5A059] transition-colors font-medium mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("backToSite")}</span>
          </a>

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#C5A059]/10 text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#C5A059]/20 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#0A0A0A] dark:text-[#F4F4F5]">
              {t("loginTitle")}
            </h1>
            <p className="text-xs text-[#71717A] mt-2 font-sans">{t("loginSubtitle")}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 font-sans">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#71717A] mb-2 font-semibold">
                {t("passwordLabel")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="admin-input pr-10 font-mono text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#F4F4F5] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <button type="submit" className="admin-btn-primary w-full py-3.5 text-xs">
              <span>{t("loginButton")}</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const currentSection = data[activeTab] || {};

  const counts = {
    projects: data.projects?.projects?.length || 0,
    skills: data.skills?.categories?.length || 0,
    experience: data.experience?.entries?.length || 0,
    testimonials: data.testimonials?.testimonials?.length || 0,
    blog: data.blog?.posts?.length || 0,
  };

  const tabLabels: Record<string, string> = {
    hero: t("hero"),
    about: t("about"),
    projects: t("projects"),
    skills: t("skills"),
    experience: t("experience"),
    testimonials: t("testimonials"),
    blog: t("blog"),
    contact: t("contact"),
    resume: t("resume"),
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0A0A0A] font-sans text-[#0A0A0A] dark:text-[#F4F4F5]">
      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={confirmModal.title}
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                confirmModal.onConfirm();
                setConfirmModal({ ...confirmModal, isOpen: false });
              }}
              className="admin-btn-danger"
            >
              Confirm
            </button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm text-[#52525B] dark:text-[#A1A1AA] leading-relaxed pt-1">
            {confirmModal.message}
          </p>
        </div>
      </Modal>

      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#141414]/95 backdrop-blur-xl border-b border-[#E4E4E7] dark:border-[#27272A] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`/${currentLocale}`}
              className="flex items-center gap-2 text-xs font-semibold text-[#71717A] hover:text-[#C5A059] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t("viewSite")}</span>
            </a>
            <span className="text-[#E4E4E7] dark:text-[#27272A] hidden sm:inline">|</span>
            <h1 className="font-playfair text-lg font-bold flex items-center gap-2">
              <span className="text-[#C5A059]">Lamia</span>
              <span className="text-xs uppercase tracking-widest text-[#71717A] font-normal font-sans hidden sm:inline">
                {t("studioAdmin")}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {saved && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                {t("saved")}
              </span>
            )}

            <button type="button" onClick={saveToLocalStorage} className="admin-btn-primary">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">{t("saveAll")}</span>
            </button>

            {/* Desktop-only action buttons */}
            <button type="button" onClick={exportJSON} className="admin-btn-secondary hidden md:inline-flex">
              <Download className="w-4 h-4" />
              <span>{t("exportJson")}</span>
            </button>

            <button type="button" onClick={importJSON} className="admin-btn-secondary hidden md:inline-flex">
              <Upload className="w-4 h-4" />
              <span>{t("importJson")}</span>
            </button>

            {/* Mobile more menu */}
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setShowMobileMore(!showMobileMore)}
                className="p-2 text-[#71717A] hover:text-[#C5A059] rounded-lg transition-colors cursor-pointer border border-[#E4E4E7] dark:border-[#27272A]"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showMobileMore && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMobileMore(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-50 w-48 bg-white dark:bg-[#141414] border border-[#E4E4E7] dark:border-[#27272A] rounded-xl shadow-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => { exportJSON(); setShowMobileMore(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t("exportJson")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { importJSON(); setShowMobileMore(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{t("importJson")}</span>
                      </button>
                      <div className="border-t border-[#E4E4E7] dark:border-[#27272A]" />
                      <button
                        type="button"
                        onClick={() => {
                          setShowMobileMore(false);
                          setConfirmModal({
                            isOpen: true,
                            title: t("resetDefaults"),
                            message: t("confirmReset"),
                            onConfirm: () => {
                              loadDefaults();
                              addToast("Data reset to defaults", "info");
                            },
                          });
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>{t("resetDefaults")}</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => {
                setConfirmModal({
                  isOpen: true,
                  title: t("resetDefaults"),
                  message: t("confirmReset"),
                  onConfirm: () => {
                    loadDefaults();
                    addToast("Data reset to defaults", "info");
                  },
                });
              }}
              className="hidden md:flex p-2 text-[#71717A] hover:text-[#C5A059] rounded-lg transition-colors cursor-pointer"
              title={t("resetDefaults")}
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {Object.entries(counts).map(([key, value]) => {
            const Icon = metricIcons[key] || LayoutDashboard;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`admin-card p-4 flex flex-col justify-between text-left cursor-pointer transition-all duration-200 hover:shadow-md group ${
                  activeTab === key ? "ring-2 ring-[#C5A059]/40 border-[#C5A059]/30" : "hover:border-[#C5A059]/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    activeTab === key ? "bg-[#C5A059]/15 text-[#C5A059]" : "bg-black/5 dark:bg-white/5 text-[#71717A] group-hover:text-[#C5A059] group-hover:bg-[#C5A059]/10"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#71717A] font-semibold">{key}</p>
                </div>
                <p className="font-playfair text-2xl font-bold text-[#C5A059]">
                  {value}
                </p>
              </button>
            );
          })}
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Mobile Tab Bar */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex gap-1.5 pb-2 min-w-max">
              {tabGroups.flatMap((group) =>
                group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  const badgeCount = (counts as any)[tab.key];
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/25"
                          : "bg-white dark:bg-[#141414] border border-[#E4E4E7] dark:border-[#27272A] text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#F4F4F5]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tabLabels[tab.key]}</span>
                      {badgeCount !== undefined && (
                        <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded-full font-bold ${
                          isActive ? "bg-white/25 text-white" : "bg-black/5 dark:bg-white/10 text-[#71717A]"
                        }`}>
                          {badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <nav className="sticky top-24 space-y-5 admin-card p-4">
              {tabGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-1.5">
                    {group.title}
                  </p>
                  {group.items.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    const badgeCount = (counts as any)[tab.key];

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-200 text-left cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-[#C5A059] to-[#A8833D] text-white shadow-md shadow-[#C5A059]/25 font-bold"
                            : "text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#F4F4F5] hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{tabLabels[tab.key]}</span>
                        </div>
                        {badgeCount !== undefined && (
                          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full font-bold ${
                            isActive ? "bg-white/25 text-white" : "bg-black/5 dark:bg-white/10 text-[#71717A]"
                          }`}>
                            {badgeCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {gIdx < tabGroups.length - 1 && (
                    <div className="pt-2" />
                  )}
                </div>
              ))}
            </nav>
          </aside>

          {/* Section Content Area */}
          <section className="flex-1 min-w-0">
            <div className="admin-card p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7] dark:border-[#27272A]">
                <h2 className="font-playfair text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <span className="text-[#C5A059]">{t("editorTitle")}:</span>
                  <span className="capitalize">{tabLabels[activeTab]}</span>
                </h2>
              </div>

              {activeTab === "hero" && (
                <HeroEditor data={currentSection} onChange={(val) => updateSectionData("hero", val)} locale={currentLocale} />
              )}
              {activeTab === "about" && (
                <AboutEditor data={currentSection} onChange={(val) => updateSectionData("about", val)} locale={currentLocale} onToast={addToast} />
              )}
              {activeTab === "projects" && (
                <ProjectsEditor
                  projects={currentSection.projects || []}
                  onChange={(newProj) => updateSectionData("projects", { ...currentSection, projects: newProj })}
                  onToast={addToast}
                  onConfirm={(modal) => setConfirmModal({ ...modal, isOpen: true })}
                />
              )}
              {activeTab === "skills" && (
                <SkillsEditor
                  categories={currentSection.categories || []}
                  onChange={(newCats) => updateSectionData("skills", { ...currentSection, categories: newCats })}
                  onToast={addToast}
                />
              )}
              {activeTab === "experience" && (
                <ExperienceEditor
                  entries={currentSection.entries || []}
                  onChange={(newEntries) => updateSectionData("experience", { ...currentSection, entries: newEntries })}
                  onToast={addToast}
                  onConfirm={(modal) => setConfirmModal({ ...modal, isOpen: true })}
                />
              )}
              {activeTab === "testimonials" && (
                <TestimonialsEditor
                  items={currentSection.testimonials || []}
                  onChange={(newItems) => updateSectionData("testimonials", { ...currentSection, testimonials: newItems })}
                  onToast={addToast}
                  onConfirm={(modal) => setConfirmModal({ ...modal, isOpen: true })}
                />
              )}
              {activeTab === "blog" && (
                <BlogEditor
                  posts={currentSection.posts || []}
                  onChange={(newPosts) => updateSectionData("blog", { ...currentSection, posts: newPosts })}
                  onToast={addToast}
                  onConfirm={(modal) => setConfirmModal({ ...modal, isOpen: true })}
                />
              )}
              {activeTab === "contact" && (
                <ContactEditor data={currentSection} onChange={(val) => updateSectionData("contact", val)} />
              )}
              {activeTab === "resume" && (
                <ResumeEditor data={currentSection} onChange={(val) => updateSectionData("resume", val)} />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ─── Hero Section Editor ─── */
function HeroEditor({ data, onChange, locale }: { data: any; onChange: (val: any) => void; locale: string }) {
  return (
    <div className="space-y-8">
      {/* Live Preview Card */}
      <div className="admin-card p-5 sm:p-6 bg-gradient-to-br from-[#FAF9F6] to-white dark:from-[#18181B] dark:to-[#141414]">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-[#C5A059]" />
          <h4 className="text-xs uppercase tracking-widest font-bold text-[#C5A059]">Live Preview</h4>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Photo Preview */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#1A1A1A] shadow-xl shadow-[#C5A059]/10 shrink-0">
            {data.profileImage ? (
              <img src={data.profileImage} alt={data.name || "Profile"} className="w-full h-full object-cover object-center" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 flex items-center justify-center">
                <span className="font-playfair text-4xl text-[#C5A059] font-bold">
                  {(data.name || "L").charAt(0)}
                </span>
              </div>
            )}
          </div>
          {/* Name + Info Preview */}
          <div className="text-center sm:text-left">
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF] leading-tight">
              {data.name || "Architect Name"}
            </h3>
            <p className="text-sm font-semibold text-[#52525B] dark:text-[#A1A1AA] mt-1">
              {(data.title?.fr || data.title?.en) || "Title"}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#E4E4E7] dark:border-[#27272A] shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-[#71717A] font-bold">
                {locale === "fr" ? "Spécialité" : "Specialty"}
              </span>
              <span className="text-[10px] text-[#71717A]">·</span>
              <span className="text-xs font-semibold text-[#0A0A0A] dark:text-[#EDEDEF]">
                {(locale === "fr" ? data.specialty?.fr : data.specialty?.en) || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Photo Upload */}
      <ImageUploader
        label="Profile Photo (Circular Display)"
        value={data.profileImage || ""}
        onChange={(val) => onChange({ ...data, profileImage: val })}
        aspectRatio="square"
        maxDimension={800}
      />

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1.5">Architect Full Name</label>
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="admin-input font-semibold"
          placeholder="Full name..."
        />
      </div>

      {/* Specialty */}
      <BilingualInput
        label="Specialty / Title Label"
        value={data.specialty || { fr: "", en: "" }}
        onChange={(val) => onChange({ ...data, specialty: val })}
      />

      <BilingualInput label="Main Title" value={data.title || { fr: "", en: "" }} onChange={(val) => onChange({ ...data, title: val })} />
      <BilingualInput label="Subtitle Tagline" value={data.subtitle || { fr: "", en: "" }} onChange={(val) => onChange({ ...data, subtitle: val })} />
      <BilingualInput label="Introduction Paragraph" value={data.intro || { fr: "", en: "" }} onChange={(val) => onChange({ ...data, intro: val })} multiline rows={4} />
      <BilingualInput label="CTA Button Text" value={data.cta || { fr: "", en: "" }} onChange={(val) => onChange({ ...data, cta: val })} />
    </div>
  );
}

/* ─── About Section Editor ─── */
function AboutEditor({ data, onChange, locale, onToast }: { data: any; onChange: (val: any) => void; locale: string; onToast: (msg: string, type?: ToastType) => void }) {
  const biography = data.biography || { fr: [], en: [] };
  const education = data.education || [];
  const statistics = data.statistics || [];

  const addBioParagraph = () => {
    const updated = {
      ...biography,
      fr: [...(biography.fr || []), "Nouveau paragraphe..."],
      en: [...(biography.en || []), "New paragraph..."],
    };
    onChange({ ...data, biography: updated });
    onToast("Biography paragraph added", "success");
  };

  const removeBioParagraph = (index: number) => {
    const updated = {
      ...biography,
      fr: (biography.fr || []).filter((_: string, i: number) => i !== index),
      en: (biography.en || []).filter((_: string, i: number) => i !== index),
    };
    onChange({ ...data, biography: updated });
    onToast("Paragraph removed", "info");
  };

  const updateBioParagraph = (index: number, lang: "fr" | "en", value: string) => {
    const updated = { ...biography };
    const arr = [...(updated[lang] || [])];
    arr[index] = value;
    updated[lang] = arr;
    onChange({ ...data, biography: updated });
  };

  const addEducation = () => {
    const newEdu = {
      degree: { fr: "Nouveau diplôme", en: "New Degree" },
      institution: { fr: "Institution", en: "Institution" },
      year: "2024 — 2026",
      description: { fr: "Description...", en: "Description..." },
    };
    onChange({ ...data, education: [...education, newEdu] });
    onToast("Education entry added", "success");
  };

  const removeEducation = (index: number) => {
    onChange({ ...data, education: education.filter((_: any, i: number) => i !== index) });
    onToast("Education entry removed", "info");
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, education: updated });
  };

  const updateStat = (index: number, field: string, value: any) => {
    const updated = [...statistics];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, statistics: updated });
  };

  return (
    <div className="space-y-8">
      {/* Profile Photo */}
      <ImageUploader
        label="Profile & Studio Photo"
        value={data.photo || ""}
        onChange={(val) => onChange({ ...data, photo: val })}
        aspectRatio="portrait"
        maxDimension={1200}
      />

      {/* Philosophy Quote */}
      <BilingualInput
        label="Architectural Philosophy Quote"
        value={data.philosophy || { fr: "", en: "" }}
        onChange={(val) => onChange({ ...data, philosophy: val })}
        multiline
        rows={4}
      />

      {/* Biography Paragraphs */}
      <div className="space-y-4 pt-4 border-t border-[#E4E4E7] dark:border-[#27272A]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            Biography Paragraphs ({(biography.fr || []).length})
          </h4>
          <button type="button" onClick={addBioParagraph} className="admin-btn-primary py-1.5 px-3 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Paragraph</span>
          </button>
        </div>

        {(biography.fr || []).map((_: string, index: number) => (
          <div key={index} className="admin-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest">Paragraph {index + 1}</span>
              <button
                type="button"
                onClick={() => removeBioParagraph(index)}
                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider mb-1 block">French (FR)</span>
                <textarea
                  value={biography.fr?.[index] || ""}
                  onChange={(e) => updateBioParagraph(index, "fr", e.target.value)}
                  className="admin-textarea"
                  rows={3}
                  placeholder="Version française..."
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#1E3A8A] dark:text-[#60A5FA] uppercase tracking-wider mb-1 block">English (EN)</span>
                <textarea
                  value={biography.en?.[index] || ""}
                  onChange={(e) => updateBioParagraph(index, "en", e.target.value)}
                  className="admin-textarea"
                  rows={3}
                  placeholder="English version..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div className="space-y-4 pt-4 border-t border-[#E4E4E7] dark:border-[#27272A]">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Education & Credentials ({education.length})
          </h4>
          <button type="button" onClick={addEducation} className="admin-btn-primary py-1.5 px-3 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>

        {education.map((edu: any, index: number) => (
          <div key={index} className="admin-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-widest">Entry {index + 1}</span>
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <BilingualInput label="Degree / Title" value={edu.degree || { fr: "", en: "" }} onChange={(val) => updateEducation(index, "degree", val)} />
            <BilingualInput label="Institution" value={edu.institution || { fr: "", en: "" }} onChange={(val) => updateEducation(index, "institution", val)} />
            <div>
              <label className="block text-xs font-semibold text-[#71717A] mb-1">Years</label>
              <input
                type="text"
                value={edu.year || ""}
                onChange={(e) => updateEducation(index, "year", e.target.value)}
                className="admin-input"
                placeholder="2024 — 2026"
              />
            </div>
            <BilingualInput label="Description" value={edu.description || { fr: "", en: "" }} onChange={(val) => updateEducation(index, "description", val)} />
          </div>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="space-y-4 pt-4 border-t border-[#E4E4E7] dark:border-[#27272A]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Statistics ({statistics.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statistics.map((stat: any, index: number) => (
            <div key={index} className="admin-card p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#71717A] uppercase tracking-widest mb-1">Value</label>
                <input
                  type="text"
                  value={stat.value || ""}
                  onChange={(e) => updateStat(index, "value", e.target.value)}
                  className="admin-input font-bold text-[#C5A059]"
                  placeholder="15+"
                />
              </div>
              <BilingualInput label="Label" value={stat.label || { fr: "", en: "" }} onChange={(val) => updateStat(index, "label", val)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Projects Editor ─── */
function ProjectsEditor({
  projects,
  onChange,
  onToast,
  onConfirm,
}: {
  projects: Project[];
  onChange: (val: Project[]) => void;
  onToast: (msg: string, type?: ToastType) => void;
  onConfirm: (modal: { title: string; message: string; onConfirm: () => void }) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addProject = () => {
    const newId = Date.now().toString();
    const newProj: Project = {
      id: newId,
      slug: `project-${newId}`,
      title: { fr: "Nouveau Projet Architectural", en: "New Architectural Project" },
      category: { fr: "Résidentiel", en: "Residential" },
      categoryKey: "residential",
      description: { fr: "Description succincte du projet...", en: "Brief project description..." },
      longDescription: { fr: ["Description détaillée du concept..."], en: ["Detailed concept description..."] },
      location: { fr: "Alger, Algérie", en: "Algiers, Algeria" },
      year: new Date().getFullYear().toString(),
      software: ["AutoCAD", "SketchUp", "Revit"],
      concept: { fr: "Intégration bioclimatique et lumière naturelle", en: "Bioclimatic integration and natural light" },
      coverImage: "",
      images: [],
      featured: false,
    };
    onChange([newProj, ...projects]);
    setEditingId(newId);
    onToast("New project created", "success");
  };

  const deleteProject = (id: string) => {
    onConfirm({
      title: "Delete Project",
      message: "Are you sure you want to permanently delete this project record?",
      onConfirm: () => {
        onChange(projects.filter((p) => p.id !== id));
        if (editingId === id) setEditingId(null);
        onToast("Project deleted", "success");
      },
    });
  };

  const updateProj = (id: string, field: string, value: any) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const columns: Column<Project>[] = [
    {
      header: "Cover",
      accessor: (p) => (
        <div className="w-14 h-10 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 border border-[#E4E4E7] dark:border-[#27272A]">
          {p.coverImage ? (
            <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#71717A]">No img</div>
          )}
        </div>
      ),
      width: "80px",
    },
    {
      header: "Project Title",
      accessor: (p) => (
        <div>
          <p className="font-semibold text-xs text-[#0A0A0A] dark:text-[#F4F4F5]">{p.title?.fr || "Untitled"}</p>
          <p className="text-[10px] text-[#71717A] truncate font-mono">{p.slug}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (p) => (
        <span className="px-2.5 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] font-mono uppercase text-[10px] font-bold">
          {p.categoryKey}
        </span>
      ),
    },
    {
      header: "Year",
      accessor: (p) => <span className="font-mono text-xs">{p.year}</span>,
    },
    {
      header: "Actions",
      accessor: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditingId(p.id)}
            className="p-1.5 text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => deleteProject(p.id)}
            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const currentProj = projects.find((p) => p.id === editingId);

  return (
    <div className="space-y-8">
      <AdminTable
        data={projects}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Search projects by title or category..."
        searchFilter={(p, q) =>
          (p.title?.fr || "").toLowerCase().includes(q.toLowerCase()) ||
          (p.categoryKey || "").toLowerCase().includes(q.toLowerCase())
        }
        onAddClick={addProject}
        addLabel="Add Project"
      />

      {currentProj && (
        <Modal
          isOpen={true}
          onClose={() => setEditingId(null)}
          title={`Edit Project: ${currentProj.title?.fr}`}
          size="2xl"
          footer={
            <button type="button" onClick={() => setEditingId(null)} className="admin-btn-primary">
              Done Editing
            </button>
          }
        >
          <div className="space-y-6">
            <BilingualInput label="Project Title" value={currentProj.title} onChange={(val) => updateProj(currentProj.id, "title", val)} required />
            <BilingualInput label="Short Description" value={currentProj.description} onChange={(val) => updateProj(currentProj.id, "description", val)} multiline rows={3} />
            <ProjectGalleryManager
              coverImage={currentProj.coverImage || ""}
              images={currentProj.images || []}
              onChangeCoverImage={(url) => updateProj(currentProj.id, "coverImage", url)}
              onChangeImages={(urls) => updateProj(currentProj.id, "images", urls)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1">Year</label>
                <input
                  type="text"
                  value={currentProj.year}
                  onChange={(e) => updateProj(currentProj.id, "year", e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1">Category</label>
                <select
                  value={currentProj.categoryKey}
                  onChange={(e) => updateProj(currentProj.id, "categoryKey", e.target.value)}
                  className="admin-select"
                >
                  <option value="residential">Residential</option>
                  <option value="cultural">Cultural</option>
                  <option value="urban">Urban Design</option>
                  <option value="conceptual">Conceptual</option>
                </select>
              </div>
            </div>

            <BilingualInput label="Location" value={currentProj.location} onChange={(val) => updateProj(currentProj.id, "location", val)} />
            <BilingualInput label="Architectural Concept Quote" value={currentProj.concept} onChange={(val) => updateProj(currentProj.id, "concept", val)} />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1">Software Used (Comma Separated)</label>
              <input
                type="text"
                value={currentProj.software?.join(", ") || ""}
                onChange={(e) => updateProj(currentProj.id, "software", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                className="admin-input"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">Featured Project</label>
              <button
                type="button"
                onClick={() => updateProj(currentProj.id, "featured", !currentProj.featured)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${currentProj.featured ? "bg-[#C5A059]" : "bg-[#27272A]/20"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${currentProj.featured ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Skills Editor ─── */
function SkillsEditor({
  categories,
  onChange,
  onToast,
}: {
  categories: any[];
  onChange: (val: any[]) => void;
  onToast: (msg: string, type?: ToastType) => void;
}) {
  const [catIdx, setCatIdx] = useState(0);
  const currentCat = categories[catIdx];

  const updateSkillLevel = (sIdx: number, level: number) => {
    const newCats = [...categories];
    newCats[catIdx].skills[sIdx].level = level;
    onChange(newCats);
  };

  const addSkill = () => {
    const newCats = [...categories];
    newCats[catIdx].skills = [...newCats[catIdx].skills, { name: "New Skill", level: 60 }];
    onChange(newCats);
    onToast("Skill added", "success");
  };

  const removeSkill = (sIdx: number) => {
    const newCats = [...categories];
    newCats[catIdx].skills = newCats[catIdx].skills.filter((_: any, i: number) => i !== sIdx);
    onChange(newCats);
    onToast("Skill removed", "info");
  };

  const updateSkillName = (sIdx: number, name: string) => {
    const newCats = [...categories];
    newCats[catIdx].skills[sIdx].name = name;
    onChange(newCats);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((c, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCatIdx(idx)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              catIdx === idx ? "bg-[#C5A059] text-white shadow-sm" : "bg-black/5 dark:bg-white/5 text-[#71717A]"
            }`}
          >
            {c.title?.fr || `Category ${idx + 1}`}
          </button>
        ))}
      </div>

      {currentCat && (
        <div className="admin-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
            <h4 className="font-playfair text-lg font-bold text-[#C5A059]">
              Skills: {currentCat.title?.fr}
            </h4>
            <button type="button" onClick={addSkill} className="admin-btn-primary py-1.5 px-3 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentCat.skills.map((skill: any, sIdx: number) => (
              <div key={sIdx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkillName(sIdx, e.target.value)}
                  className="admin-input w-full sm:w-48 text-xs font-bold"
                />
                <div className="flex items-center gap-3 w-full sm:flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => updateSkillLevel(sIdx, Number(e.target.value))}
                    className="flex-1 accent-[#C5A059] cursor-pointer"
                  />
                  <span className="w-12 text-xs font-mono font-bold text-[#C5A059] text-right">{skill.level}%</span>
                  <button type="button" onClick={() => removeSkill(sIdx)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Experience Editor ─── */
function ExperienceEditor({
  entries,
  onChange,
  onToast,
  onConfirm,
}: {
  entries: any[];
  onChange: (val: any[]) => void;
  onToast: (msg: string, type?: ToastType) => void;
  onConfirm: (modal: { title: string; message: string; onConfirm: () => void }) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const addEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      role: { fr: "Nouvelle Expérience", en: "New Position" },
      company: { fr: "Entreprise / Studio", en: "Company / Studio" },
      location: { fr: "Alger, Algérie", en: "Algiers, Algeria" },
      startDate: "2025",
      endDate: "Present",
      description: { fr: "Description des missions...", en: "Key responsibilities..." },
      type: "work",
    };
    onChange([newEntry, ...entries]);
    setEditingIdx(0);
    onToast("Experience entry created", "success");
  };

  const deleteEntry = (idx: number) => {
    onConfirm({
      title: "Delete Experience Entry",
      message: "Are you sure you want to delete this entry from your timeline?",
      onConfirm: () => {
        onChange(entries.filter((_, i) => i !== idx));
        if (editingIdx === idx) setEditingIdx(null);
        onToast("Experience deleted", "info");
      },
    });
  };

  const columns: Column<any>[] = [
    {
      header: "Role / Position",
      accessor: (e) => (
        <div>
          <p className="font-semibold text-xs text-[#0A0A0A] dark:text-[#F4F4F5]">{e.role?.fr}</p>
          <p className="text-[10px] text-[#71717A]">{e.company?.fr}</p>
        </div>
      ),
    },
    {
      header: "Period",
      accessor: (e) => <span className="font-mono text-xs">{e.startDate} – {e.endDate}</span>,
    },
    {
      header: "Actions",
      accessor: (e, idx) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => setEditingIdx(idx)} className="p-1.5 text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg cursor-pointer">
            <Edit3 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => deleteEntry(idx)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const currentEntry = editingIdx !== null ? entries[editingIdx] : null;

  return (
    <div className="space-y-6">
      <AdminTable
        data={entries}
        columns={columns}
        keyExtractor={(item, idx) => item.id || idx}
        onAddClick={addEntry}
        addLabel="Add Experience"
      />

      {currentEntry && editingIdx !== null && (
        <Modal
          isOpen={true}
          onClose={() => setEditingIdx(null)}
          title={`Edit Experience: ${currentEntry.role?.fr}`}
          size="xl"
          footer={
            <button type="button" onClick={() => setEditingIdx(null)} className="admin-btn-primary">
              Done Editing
            </button>
          }
        >
          <div className="space-y-5">
            <BilingualInput label="Job Title / Role" value={currentEntry.role} onChange={(val) => {
              const updated = [...entries];
              updated[editingIdx].role = val;
              onChange(updated);
            }} />
            <BilingualInput label="Company / School" value={currentEntry.company} onChange={(val) => {
              const updated = [...entries];
              updated[editingIdx].company = val;
              onChange(updated);
            }} />
            <BilingualInput label="Location" value={currentEntry.location} onChange={(val) => {
              const updated = [...entries];
              updated[editingIdx].location = val;
              onChange(updated);
            }} />
            <BilingualInput label="Description" value={currentEntry.description} onChange={(val) => {
              const updated = [...entries];
              updated[editingIdx].description = val;
              onChange(updated);
            }} multiline rows={3} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1">Start Date</label>
                <input
                  type="text"
                  value={currentEntry.startDate || ""}
                  onChange={(e) => {
                    const updated = [...entries];
                    updated[editingIdx].startDate = e.target.value;
                    onChange(updated);
                  }}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1">End Date</label>
                <input
                  type="text"
                  value={currentEntry.endDate || ""}
                  onChange={(e) => {
                    const updated = [...entries];
                    updated[editingIdx].endDate = e.target.value;
                    onChange(updated);
                  }}
                  className="admin-input"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Testimonials Editor ─── */
function TestimonialsEditor({
  items,
  onChange,
  onToast,
  onConfirm,
}: {
  items: any[];
  onChange: (val: any[]) => void;
  onToast: (msg: string, type?: ToastType) => void;
  onConfirm: (modal: { title: string; message: string; onConfirm: () => void }) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const addTestimonial = () => {
    const newItem = {
      id: Date.now().toString(),
      quote: { fr: "Citation du témoignage client...", en: "Client testimonial quote..." },
      author: "Client Name",
      role: { fr: "Directeur de projet", en: "Project Director" },
      company: { fr: "Société Immobilier", en: "Real Estate Inc." },
      photo: "",
    };
    onChange([...items, newItem]);
    setEditingIdx(items.length);
    onToast("Testimonial added", "success");
  };

  const deleteTestimonial = (idx: number) => {
    onConfirm({
      title: "Delete Testimonial",
      message: "Are you sure you want to delete this client testimonial?",
      onConfirm: () => {
        onChange(items.filter((_, i) => i !== idx));
        if (editingIdx === idx) setEditingIdx(null);
        onToast("Testimonial deleted", "info");
      },
    });
  };

  const columns: Column<any>[] = [
    {
      header: "Author",
      accessor: (t) => (
        <div>
          <p className="font-semibold text-xs text-[#0A0A0A] dark:text-[#F4F4F5]">{t.author}</p>
          <p className="text-[10px] text-[#71717A]">{t.role?.fr}</p>
        </div>
      ),
    },
    {
      header: "Company",
      accessor: (t) => <span className="text-xs">{t.company?.fr}</span>,
    },
    {
      header: "Actions",
      accessor: (t, idx) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => setEditingIdx(idx)} className="p-1.5 text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg cursor-pointer">
            <Edit3 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => deleteTestimonial(idx)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const currentItem = editingIdx !== null ? items[editingIdx] : null;

  return (
    <div className="space-y-6">
      <AdminTable
        data={items}
        columns={columns}
        keyExtractor={(item, idx) => item.id || idx}
        onAddClick={addTestimonial}
        addLabel="Add Testimonial"
      />

      {currentItem && editingIdx !== null && (
        <Modal
          isOpen={true}
          onClose={() => setEditingIdx(null)}
          title={`Edit Testimonial: ${currentItem.author}`}
          size="xl"
          footer={
            <button type="button" onClick={() => setEditingIdx(null)} className="admin-btn-primary">
              Done Editing
            </button>
          }
        >
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1">Author Full Name</label>
              <input
                type="text"
                value={currentItem.author || ""}
                onChange={(e) => {
                  const updated = [...items];
                  updated[editingIdx].author = e.target.value;
                  onChange(updated);
                }}
                className="admin-input"
              />
            </div>
            <BilingualInput label="Role Title" value={currentItem.role} onChange={(val) => {
              const updated = [...items];
              updated[editingIdx].role = val;
              onChange(updated);
            }} />
            <BilingualInput label="Company Name" value={currentItem.company} onChange={(val) => {
              const updated = [...items];
              updated[editingIdx].company = val;
              onChange(updated);
            }} />
            <BilingualInput label="Testimonial Quote" value={currentItem.quote} onChange={(val) => {
              const updated = [...items];
              updated[editingIdx].quote = val;
              onChange(updated);
            }} multiline rows={3} />
            <ImageUploader label="Author Photo" value={currentItem.photo || ""} onChange={(val) => {
              const updated = [...items];
              updated[editingIdx].photo = val;
              onChange(updated);
            }} aspectRatio="square" />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Blog Editor ─── */
function BlogEditor({
  posts,
  onChange,
  onToast,
  onConfirm,
}: {
  posts: any[];
  onChange: (val: any[]) => void;
  onToast: (msg: string, type?: ToastType) => void;
  onConfirm: (modal: { title: string; message: string; onConfirm: () => void }) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const addPost = () => {
    const newPost = {
      id: Date.now().toString(),
      slug: `article-${Date.now()}`,
      title: { fr: "Nouvel Article de Blog", en: "New Blog Article" },
      excerpt: { fr: "Extrait de l'article...", en: "Article excerpt..." },
      content: { fr: "Contenu rédigé...", en: "Full content..." },
      date: new Date().toISOString().split("T")[0],
      readingTime: 4,
      category: { fr: "Architecture", en: "Architecture" },
      categoryKey: "architecture",
      thumbnail: "",
      featured: false,
    };
    onChange([...posts, newPost]);
    setEditingIdx(posts.length);
    onToast("Article added", "success");
  };

  const deletePost = (idx: number) => {
    onConfirm({
      title: "Delete Article",
      message: "Are you sure you want to delete this blog post?",
      onConfirm: () => {
        onChange(posts.filter((_, i) => i !== idx));
        if (editingIdx === idx) setEditingIdx(null);
        onToast("Article deleted", "info");
      },
    });
  };

  const columns: Column<any>[] = [
    {
      header: "Article Title",
      accessor: (p) => (
        <div>
          <p className="font-semibold text-xs text-[#0A0A0A] dark:text-[#F4F4F5]">{p.title?.fr}</p>
          <p className="text-[10px] text-[#71717A] font-mono">{p.date}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (p) => (
        <span className="px-2.5 py-1 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] dark:text-[#60A5FA] font-mono uppercase text-[10px] font-bold">
          {p.categoryKey || "design"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (p, idx) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => setEditingIdx(idx)} className="p-1.5 text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg cursor-pointer">
            <Edit3 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => deletePost(idx)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const currentPost = editingIdx !== null ? posts[editingIdx] : null;

  return (
    <div className="space-y-6">
      <AdminTable
        data={posts}
        columns={columns}
        keyExtractor={(item, idx) => item.id || idx}
        onAddClick={addPost}
        addLabel="Add Article"
      />

      {currentPost && editingIdx !== null && (
        <Modal
          isOpen={true}
          onClose={() => setEditingIdx(null)}
          title={`Edit Article: ${currentPost.title?.fr}`}
          size="2xl"
          footer={
            <button type="button" onClick={() => setEditingIdx(null)} className="admin-btn-primary">
              Done Editing
            </button>
          }
        >
          <div className="space-y-5">
            <BilingualInput label="Article Title" value={currentPost.title} onChange={(val) => {
              const updated = [...posts];
              updated[editingIdx].title = val;
              onChange(updated);
            }} required />
            <BilingualInput label="Excerpt Summary" value={currentPost.excerpt} onChange={(val) => {
              const updated = [...posts];
              updated[editingIdx].excerpt = val;
              onChange(updated);
            }} multiline rows={2} />
            <BilingualInput label="Full Article Body" value={currentPost.content} onChange={(val) => {
              const updated = [...posts];
              updated[editingIdx].content = val;
              onChange(updated);
            }} multiline rows={6} />
            <ImageUploader label="Banner Thumbnail" value={currentPost.thumbnail || ""} onChange={(val) => {
              const updated = [...posts];
              updated[editingIdx].thumbnail = val;
              onChange(updated);
            }} aspectRatio="video" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1">Publication Date</label>
                <input
                  type="date"
                  value={currentPost.date || ""}
                  onChange={(e) => {
                    const updated = [...posts];
                    updated[editingIdx].date = e.target.value;
                    onChange(updated);
                  }}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#71717A] mb-1">Reading Time (Minutes)</label>
                <input
                  type="number"
                  value={currentPost.readingTime || 5}
                  onChange={(e) => {
                    const updated = [...posts];
                    updated[editingIdx].readingTime = Number(e.target.value);
                    onChange(updated);
                  }}
                  className="admin-input"
                  min="1"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Contact Editor ─── */
function ContactEditor({ data, onChange }: { data: any; onChange: (val: any) => void }) {
  const socialLinks = data.socialLinks || [];

  const updateSocial = (idx: number, field: string, value: string) => {
    const updated = [...socialLinks];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ ...data, socialLinks: updated });
  };

  const addSocial = () => {
    onChange({
      ...data,
      socialLinks: [...socialLinks, { platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" }],
    });
  };

  const deleteSocial = (idx: number) => {
    onChange({ ...data, socialLinks: socialLinks.filter((_: any, i: number) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1">Official Email Address</label>
        <input
          type="email"
          value={data.email || ""}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="admin-input"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1">Phone Number</label>
        <input
          type="text"
          value={data.phone || ""}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          className="admin-input"
        />
      </div>

      <div className="pt-4 border-t border-[#E4E4E7] dark:border-[#27272A] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Social Networks ({socialLinks.length})</h4>
          <button type="button" onClick={addSocial} className="admin-btn-primary py-1.5 px-3 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((s: any, idx: number) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-[#FAFAFA] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-lg">
              <input
                type="text"
                value={s.platform || ""}
                onChange={(e) => updateSocial(idx, "platform", e.target.value)}
                placeholder="Platform Name"
                className="admin-input w-full sm:w-36 text-xs font-bold"
              />
              <input
                type="text"
                value={s.url || ""}
                onChange={(e) => updateSocial(idx, "url", e.target.value)}
                placeholder="URL Link"
                className="admin-input flex-1 font-mono text-xs"
              />
              <button type="button" onClick={() => deleteSocial(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Resume Editor ─── */
function ResumeEditor({ data, onChange }: { data: any; onChange: (val: any) => void }) {
  return (
    <div className="space-y-6">
      <ImageUploader
        label="Upload Architect Curriculum Vitae (PDF Document)"
        value={data.resumeUrl || ""}
        onChange={(val) => onChange({ ...data, resumeUrl: val })}
        accept="application/pdf, .pdf"
      />
    </div>
  );
}
