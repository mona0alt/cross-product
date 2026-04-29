import type { Locale } from '@/lib/i18n/config';

const dictionaries = {
  'zh-CN': () => import('../../../messages/zh-CN.json').then((module) => module.default),
  en: () => import('../../../messages/en.json').then((module) => module.default),
  es: () => import('../../../messages/es.json').then((module) => module.default),
  pt: () => import('../../../messages/pt.json').then((module) => module.default)
} as const;

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
