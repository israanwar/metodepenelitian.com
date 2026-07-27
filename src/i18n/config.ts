export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const localeNames: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
