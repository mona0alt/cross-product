import React from 'react';

import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { getAdminDictionary } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const { Admin } = await getAdminDictionary();

  return <AdminLoginForm copy={Admin.login} />;
}
