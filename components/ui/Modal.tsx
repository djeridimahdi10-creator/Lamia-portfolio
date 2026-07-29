"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "full";
}

const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "lg",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Body scroll lock & focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      // Focus the dialog after render
      const timer = setTimeout(() => {
        if (dialogRef.current) {
          const firstFocusable = dialogRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
          firstFocusable?.focus();
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
        previousFocusRef.current?.focus();
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Focus trap
  const handleTabKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    full: "max-w-[95vw] min-h-[90vh]",
  }[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onKeyDown={handleTabKey}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0A0A0A]/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Dialog Window */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${sizeClasses} bg-white dark:bg-[#0D0D0D] border border-[#E4E4E7] dark:border-[#1C1C1C] rounded-xl shadow-2xl overflow-hidden my-auto pointer-events-auto flex flex-col max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 sm:px-6 py-4.5 border-b border-[#E4E4E7] dark:border-[#1C1C1C] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
                <div className="min-w-0 flex-1">
                  <h3 className="font-playfair text-base sm:text-lg font-bold text-[#0A0A0A] dark:text-[#EDEDEF] truncate">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-[#71717A] mt-0.5 font-sans font-normal">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#EDEDEF] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0 ml-3"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-sans">{children}</div>

            {/* Footer Actions */}
            {footer && (
              <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-[#E4E4E7] dark:border-[#1C1C1C] bg-[#FAFAFA] dark:bg-[#0D0D0D]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
