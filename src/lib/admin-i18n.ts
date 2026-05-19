import { cookies } from 'next/headers';

import { ADMIN_LOCALE_COOKIE } from '@/lib/admin-locale-constants';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export async function getAdminLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_LOCALE_COOKIE)?.value;

  return isLocale(value) ? value : defaultLocale;
}

export async function getAdminDictionary() {
  const locale = await getAdminLocale();
  const dictionary = await getDictionary(locale);

  return {
    locale,
    Admin: dictionary.Admin
  };
}
