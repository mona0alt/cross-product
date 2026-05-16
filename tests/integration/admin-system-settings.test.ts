import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();
const revalidatePath = vi.fn();
const systemSettingFindMany = vi.fn();
const systemSettingUpsert = vi.fn();
const databaseQueryRaw = vi.fn();

vi.mock('@/lib/auth', () => ({
  requireAdminSession
}));

vi.mock('next/cache', () => ({
  revalidatePath
}));

vi.mock('@/lib/db', () => ({
  db: {
    $queryRaw: databaseQueryRaw,
    systemSetting: {
      findMany: systemSettingFindMany,
      upsert: systemSettingUpsert
    }
  }
}));

describe('admin system settings', () => {
  beforeEach(() => {
    requireAdminSession.mockReset();
    revalidatePath.mockReset();
    systemSettingFindMany.mockReset();
    systemSettingUpsert.mockReset();
    databaseQueryRaw.mockReset();
    requireAdminSession.mockResolvedValue({ id: 'admin-1', username: 'admin' });
    process.env.WHATSAPP_NUMBER = '15551234567';
    process.env.SMTP_HOST = '';
    process.env.SMTP_PORT = '465';
    process.env.SMTP_USER = '';
    process.env.SMTP_PASSWORD = '';
    process.env.MAIL_FROM = '';
    process.env.LLM_PROVIDER = '';
    process.env.LLM_MODEL = '';
    process.env.OPENAI_BASE_URL = '';
    process.env.OPENAI_API_KEY = '';
    process.env.DATABASE_URL = 'file:./dev.db';
  });

  it('builds the admin settings view from persisted values before environment fallbacks', async () => {
    systemSettingFindMany.mockResolvedValue([
      { key: 'contact.whatsappNumber', value: '+86 188 0000 9999', updatedAt: new Date('2026-05-15T00:00:00Z') },
      { key: 'email.smtpHost', value: 'smtp.real.example', updatedAt: new Date('2026-05-15T00:00:00Z') },
      { key: 'email.smtpPassword', value: 'secret-password', updatedAt: new Date('2026-05-15T00:00:00Z') },
      { key: 'llm.model', value: 'gpt-4.1-mini', updatedAt: new Date('2026-05-15T00:00:00Z') }
    ]);

    const { getAdminSystemSettingsViewModel } = await import('@/features/admin/system-settings-actions');
    const viewModel = await getAdminSystemSettingsViewModel();

    expect(systemSettingFindMany).toHaveBeenCalled();
    expect(viewModel.groups.map((group) => group.title)).toContain('联系配置');
    expect(viewModel.groups.map((group) => group.title)).toContain('邮箱配置');
    expect(viewModel.groups.map((group) => group.title)).toContain('大模型相关配置');
    expect(viewModel.groups.find((group) => group.key === 'contact')?.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'contact.whatsappNumber',
          value: '+86 188 0000 9999'
        })
      ])
    );
    expect(
      viewModel.groups.flatMap((group) => group.fields)
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'email.smtpHost',
          value: 'smtp.real.example'
        }),
        expect.objectContaining({
          key: 'email.smtpPassword',
          configured: true,
          value: ''
        }),
        expect.objectContaining({
          key: 'llm.model',
          value: 'gpt-4.1-mini'
        })
      ])
    );
    expect(viewModel.groups.flatMap((group) => group.fields).map((field) => field.key)).not.toContain(
      'email.smtpUser'
    );
  });

  it('persists editable settings and keeps blank secrets unchanged', async () => {
    const formData = new FormData();
    formData.set('contact.whatsappNumber', '+86 188 0000 9999');
    formData.set('email.mailFrom', 'sales@example.com');
    formData.set('email.smtpHost', 'smtp.real.example');
    formData.set('email.smtpPort', '587');
    formData.set('email.smtpUser', 'mailer@example.com');
    formData.set('email.smtpPassword', '');
    formData.set('llm.provider', 'OpenAI compatible');
    formData.set('llm.model', 'gpt-4.1-mini');
    formData.set('llm.apiBaseUrl', 'https://llm.example/v1');
    formData.set('llm.apiKey', '');
    formData.set('upload.productSegment', 'catalog/products');
    formData.set('upload.categorySegment', 'catalog/categories');
    formData.set('upload.bannerSegment', 'catalog/banners');

    const { updateAdminSystemSettings } = await import('@/features/admin/system-settings-actions');
    const result = await updateAdminSystemSettings(formData);

    expect(result).toEqual({ ok: true });
    expect(requireAdminSession).toHaveBeenCalled();
    expect(systemSettingUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'contact.whatsappNumber' },
        update: { value: '+86 188 0000 9999' },
        create: { key: 'contact.whatsappNumber', value: '+86 188 0000 9999' }
      })
    );
    expect(systemSettingUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'email.smtpHost' },
        update: { value: 'smtp.real.example' }
      })
    );
    expect(systemSettingUpsert).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'email.smtpUser' }
      })
    );
    expect(systemSettingUpsert).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'email.smtpPassword' }
      })
    );
    expect(systemSettingUpsert).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'llm.apiKey' }
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith('/admin/categories');
  });

  it('does not expose a separate SMTP user in runtime settings', async () => {
    systemSettingFindMany.mockResolvedValue([
      { key: 'email.mailFrom', value: 'sales@example.com' },
      { key: 'email.smtpHost', value: 'smtp.real.example' },
      { key: 'email.smtpPort', value: '587' },
      { key: 'email.smtpPassword', value: 'secret-password' }
    ]);

    const { getRuntimeSystemSettings } = await import('@/features/admin/system-settings-actions');
    const settings = await getRuntimeSystemSettings();

    expect(settings.email.mailFrom).toBe('sales@example.com');
    expect(settings.email).not.toHaveProperty('smtpUser');
  });

  it('tests the current database connection through an authenticated admin API route', async () => {
    databaseQueryRaw.mockResolvedValue([{ ok: 1 }]);

    const { POST } = await import('@/app/api/admin/system-settings/database-connection/route');
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
        provider: 'SQLite'
      })
    );
    expect(body.latencyMs).toEqual(expect.any(Number));
    expect(requireAdminSession).toHaveBeenCalled();
    expect(databaseQueryRaw).toHaveBeenCalled();
  });

  it('returns a failed connection test without exposing database secrets', async () => {
    process.env.DATABASE_URL = 'postgresql://user:secret-password@db.example.com/app';
    databaseQueryRaw.mockRejectedValue(new Error('password authentication failed for user'));

    const { POST } = await import('@/app/api/admin/system-settings/database-connection/route');
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual(
      expect.objectContaining({
        ok: false,
        provider: 'PostgreSQL',
        error: 'DATABASE_CONNECTION_FAILED'
      })
    );
    expect(JSON.stringify(body)).not.toContain('secret-password');
  });

  it('returns a failed SMTP test when email delivery settings are incomplete', async () => {
    systemSettingFindMany.mockResolvedValue([]);

    const { POST } = await import('@/app/api/admin/system-settings/smtp-connection/route');
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual(
      expect.objectContaining({
        ok: false,
        configured: false,
        error: 'SMTP_NOT_CONFIGURED'
      })
    );
    expect(JSON.stringify(body)).not.toContain('SMTP_PASSWORD');
    expect(requireAdminSession).toHaveBeenCalled();
  });

  it('classifies common SMTP verification failures without exposing secrets', async () => {
    const { getSmtpConnectionErrorCode } = await import('@/features/admin/system-settings-actions');
    const tlsError = Object.assign(new Error('unable to verify the first certificate'), {
      code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
    });

    expect(getSmtpConnectionErrorCode(tlsError)).toBe('SMTP_TLS_CERTIFICATE_FAILED');
    expect(getSmtpConnectionErrorCode(new Error('535 Error: authentication failed'))).toBe(
      'SMTP_AUTH_FAILED'
    );
    expect(getSmtpConnectionErrorCode(new Error('SMTP_CONNECT_TIMEOUT'))).toBe('SMTP_CONNECT_TIMEOUT');
  });

  it('builds SMTP TLS options that tolerate incomplete certificate chains', async () => {
    const { getSmtpTlsConnectionOptions } = await import('@/features/admin/system-settings-actions');

    expect(getSmtpTlsConnectionOptions('smtp.163.com')).toEqual({
      servername: 'smtp.163.com',
      rejectUnauthorized: false
    });
  });

  it('treats common SSL SMTP ports as implicit TLS connections', async () => {
    const { isImplicitTlsSmtpPort } = await import('@/features/admin/system-settings-actions');

    expect(isImplicitTlsSmtpPort(465)).toBe(true);
    expect(isImplicitTlsSmtpPort(994)).toBe(true);
    expect(isImplicitTlsSmtpPort(587)).toBe(false);
  });
});
