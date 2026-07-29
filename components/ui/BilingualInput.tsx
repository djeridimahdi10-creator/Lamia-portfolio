"use client";

import React, { useState } from "react";

interface BilingualInputProps {
  label: string;
  value: { fr: string; en: string };
  onChange: (val: { fr: string; en: string }) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: { fr?: string; en?: string };
  required?: boolean;
}

export function BilingualInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  required = false,
}: BilingualInputProps) {
  const [activeTab, setActiveTab] = useState<"fr" | "en">("fr");
  const [mode, setMode] = useState<"split" | "tabs">("split");

  const frVal = value?.fr || "";
  const enVal = value?.en || "";

  const Component = multiline ? "textarea" : "input";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-md text-[10px]">
          <button
            type="button"
            onClick={() => setMode("split")}
            className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              mode === "split" ? "bg-white dark:bg-[#27272A] text-[#0A0A0A] dark:text-[#F4F4F5] shadow-xs" : "text-[#71717A]"
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setMode("tabs")}
            className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              mode === "tabs" ? "bg-white dark:bg-[#27272A] text-[#0A0A0A] dark:text-[#F4F4F5] shadow-xs" : "text-[#71717A]"
            }`}
          >
            Tabs
          </button>
        </div>
      </div>

      {mode === "split" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* FR Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">French (FR)</span>
              {multiline && <span className="text-[10px] text-[#71717A]">{frVal.length} chars</span>}
            </div>
            <Component
              value={frVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...value, fr: e.target.value })
              }
              placeholder={placeholder?.fr || "Version française..."}
              className={multiline ? "admin-textarea" : "admin-input"}
              rows={multiline ? rows : undefined}
            />
          </div>

          {/* EN Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#1E3A8A] dark:text-[#60A5FA] uppercase tracking-wider">English (EN)</span>
              {multiline && <span className="text-[10px] text-[#71717A]">{enVal.length} chars</span>}
            </div>
            <Component
              value={enVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...value, en: e.target.value })
              }
              placeholder={placeholder?.en || "English version..."}
              className={multiline ? "admin-textarea" : "admin-input"}
              rows={multiline ? rows : undefined}
            />
          </div>
        </div>
      ) : (
        /* Tabbed mode */
        <div className="space-y-2">
          <div className="flex items-center gap-2 border-b border-[#E4E4E7] dark:border-[#1C1C1C] pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("fr")}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === "fr"
                  ? "border-[#C5A059] text-[#C5A059]"
                  : "border-transparent text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#F4F4F5]"
              }`}
            >
              French (FR)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === "en"
                  ? "border-[#1E3A8A] dark:border-[#60A5FA] text-[#1E3A8A] dark:text-[#60A5FA]"
                  : "border-transparent text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#F4F4F5]"
              }`}
            >
              English (EN)
            </button>
          </div>

          {activeTab === "fr" ? (
            <Component
              value={frVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...value, fr: e.target.value })
              }
              placeholder={placeholder?.fr || "Version française..."}
              className={multiline ? "admin-textarea" : "admin-input"}
              rows={multiline ? rows : undefined}
            />
          ) : (
            <Component
              value={enVal}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...value, en: e.target.value })
              }
              placeholder={placeholder?.en || "English version..."}
              className={multiline ? "admin-textarea" : "admin-input"}
              rows={multiline ? rows : undefined}
            />
          )}
        </div>
      )}
    </div>
  );
}
