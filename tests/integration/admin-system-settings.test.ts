import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();
const revalidatePath = vi.fn();
const systemSettingFindMany = vi.fn();
const systemSettingUpsert = vi.fn();

vi.mock('@/lib/auth', () => ({
  requireAdminSession
}));

vi.mock('next/cache', () => ({
  revalidatePath
}));

vi.mock('@/lib/db', () => ({
  db: {
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
});
