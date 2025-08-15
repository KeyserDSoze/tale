import it from './it.json';
import en from './en.json';
import es from './es.json';

export const LOCALES = ['it', 'en', 'es'] as const;
export type Locale = typeof LOCALES[number];

const dicts: Record<Locale, any> = { it, en, es };

export function t(lang: Locale, key: string) {
  const d = dicts[lang] ?? dicts.en;
  return key.split('.').reduce((acc, k) => acc?.[k], d) ?? key;
}

export function getAlternateUrls(currentPath: string, baseUrl?: string) {
  const base = baseUrl || '';
  return LOCALES.map(lang => ({
    lang,
    url: `${base}/${lang}${currentPath}`
  }));
}
