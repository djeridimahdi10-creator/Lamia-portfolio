"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, CheckCircle, Copy, Check } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { getLocalizedText } from "@/lib/utils";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { useTranslations } from "next-intl";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface ContactProps {
  locale: string;
}

export function Contact({ locale }: ContactProps) {
  const { data: portfolioData } = usePortfolioData();
  const data = portfolioData.contact;
  const t = useTranslations("contact");
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setFormState("sending");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setFormState("success");
    form.reset();
    setTimeout(() => setFormState("idle"), 4000);
  };

  return (
    <section id="contact" className="relative py-28 lg:py-36 bg-[#FAF9F6] dark:bg-[#0B0B0C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          title={getLocalizedText(data.sectionTitle, locale)}
          subtitle={getLocalizedText(data.subtitle, locale)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Info Side */}
          <SectionReveal direction="left" className="lg:col-span-5">
            <div className="space-y-4">
              {/* Email */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#121214] border border-[#E4E4E7] dark:border-[#1F1F24] shadow-sm flex items-center justify-between group hover:border-[#C5A059]/40 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#71717A]">Email</p>
                    <a
                      href={`mailto:${data.email}`}
                      className="text-xs sm:text-sm font-semibold text-[#0A0A0A] dark:text-[#EDEDEF] hover:text-[#C5A059] transition-colors duration-300"
                    >
                      {data.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(data.email, "email")}
                  className="p-2 text-[#71717A] hover:text-[#C5A059] transition-colors duration-300 cursor-pointer"
                  title="Copy email"
                >
                  {copiedField === "email" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#121214] border border-[#E4E4E7] dark:border-[#1F1F24] shadow-sm flex items-center justify-between group hover:border-[#C5A059]/40 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#71717A]">
                      {locale === "fr" ? "Téléphone" : "Phone"}
                    </p>
                    <a
                      href={`tel:${data.phone}`}
                      className="text-xs sm:text-sm font-semibold text-[#0A0A0A] dark:text-[#EDEDEF] hover:text-[#C5A059] transition-colors duration-300"
                    >
                      {data.phone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(data.phone, "phone")}
                  className="p-2 text-[#71717A] hover:text-[#C5A059] transition-colors duration-300 cursor-pointer"
                  title="Copy phone"
                >
                  {copiedField === "phone" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Location */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#121214] border border-[#E4E4E7] dark:border-[#1F1F24] shadow-sm flex items-center gap-3.5 hover:border-[#C5A059]/40 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#71717A]">
                    {locale === "fr" ? "Localisation" : "Location"}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#0A0A0A] dark:text-[#EDEDEF]">
                    {getLocalizedText(data.location, locale)}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-[#E4E4E7] dark:border-[#1F1F24]">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#71717A] mb-3">
                  {locale === "fr" ? "Réseaux sociaux" : "Social Links"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(data.socialLinks || []).map((social: any) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white dark:bg-[#121214] border border-[#E4E4E7] dark:border-[#1F1F24] text-[#52525B] dark:text-[#A1A1AA] hover:text-[#C5A059] hover:border-[#C5A059]/40 hover:shadow-md transition-all duration-300 shadow-sm"
                      aria-label={social.platform}
                    >
                      <SocialIcon platform={social.platform} size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Form Side */}
          <SectionReveal direction="right" className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#121214] border border-[#E4E4E7] dark:border-[#1F1F24] shadow-xl">
              <h3 className="font-playfair text-2xl font-bold text-[#0A0A0A] dark:text-[#EDEDEF] mb-6">
                {locale === "fr" ? "Envoyez-moi un message" : "Send me a message"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#71717A] mb-2">
                      {t("name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={getLocalizedText(data.namePlaceholder, locale)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#71717A] mb-2">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={getLocalizedText(data.emailPlaceholder, locale)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#71717A] mb-2">
                    {t("message")}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder={getLocalizedText(data.messagePlaceholder, locale)}
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="btn-primary w-full cursor-pointer"
                >
                  {formState === "sending" ? (
                    <span>{t("sending")}...</span>
                  ) : formState === "success" ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {t("success")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {getLocalizedText(data.sendButton, locale)}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
