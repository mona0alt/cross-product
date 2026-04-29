export const locales = ['zh-CN', 'en', 'es', 'pt'] as const;
export const defaultLocale = 'zh-CN';

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}

export function getPreferredLocale(
  headerValue: string | null | undefined
): Locale {
  if (!headerValue) {
    return defaultLocale;
  }

  const normalized = headerValue.toLowerCase();

  if (normalized.includes('zh')) {
    return 'zh-CN';
  }

  if (normalized.includes('es')) {
    return 'es';
  }

  if (normalized.includes('pt')) {
    return 'pt';
  }

  if (normalized.includes('en')) {
    return 'en';
  }

  return defaultLocale;
}
