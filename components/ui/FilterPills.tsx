"use client";

import { motion } from "framer-motion";

interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface FilterPillsProps {
  options: FilterOption[];
  active: string;
  onChange: (key: string) => void;
}

export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((option) => {
        const isActive = active === option.key;
        return (
          <motion.button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`relative px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors duration-250 cursor-pointer ${
              isActive
                ? "text-white"
                : "text-[#52525B] dark:text-[#A1A1AA] bg-white dark:bg-[#111111] border border-[#E4E4E7] dark:border-[#1C1C1C] hover:border-[#C5A059] hover:text-[#C5A059]"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 bg-[#C5A059] rounded-full shadow-md shadow-[#C5A059]/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.label}
              {option.count !== undefined && (
                <span className={`text-[10px] font-mono ${isActive ? "text-white/80" : "text-[#71717A] dark:text-[#71717A]"}`}>
                  {option.count}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
