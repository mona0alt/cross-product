import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale,
    messages: await getDictionary(locale)
  };
});
