import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getLocalizedText(
  text: { fr: string; en: string },
  locale: string
): string {
  return text[locale as "fr" | "en"] || text.en;
}

export function getLocalizedArray(
  text: { fr: string[]; en: string[] },
  locale: string
): string[] {
  return text[locale as "fr" | "en"] || text.en;
}
