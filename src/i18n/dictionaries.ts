import type { Locale } from "./config";
import { id } from "./locales/id";
import { en } from "./locales/en";

export type Dictionary = typeof id;

const dictionaries: Record<Locale, Dictionary> = {
  id,
  en: en as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.id;
}
