"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string | number;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string | number) => void;
}

function ToastSingle({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string | number) => void }) {
  const duration = toast.duration || 3500;
  const type = toast.type || "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const config = {
    success: {
      bg: "bg-emerald-600 dark:bg-emerald-700",
      icon: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />,
      border: "border-emerald-500",
    },
    error: {
      bg: "bg-red-600 dark:bg-red-700",
      icon: <XCircle className="w-5 h-5 text-white shrink-0" />,
      border: "border-red-500",
    },
    warning: {
      bg: "bg-amber-600 dark:bg-amber-700",
      icon: <AlertTriangle className="w-5 h-5 text-white shrink-0" />,
      border: "border-amber-500",
    },
    info: {
      bg: "bg-[#C5A059]",
      icon: <Info className="w-5 h-5 text-white shrink-0" />,
      border: "border-[#C5A059]",
    },
  }[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg shadow-xl text-white ${config.bg} border ${config.border} min-w-[300px] max-w-md pointer-events-auto`}
    >
      <div className="flex items-center gap-3">
        {config.icon}
        <span className="text-xs font-semibold tracking-wide leading-snug">{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/20 rounded-md transition-colors opacity-80 hover:opacity-100 cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
      />
    </motion.div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-5 right-5 z-[120] flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastSingle key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
