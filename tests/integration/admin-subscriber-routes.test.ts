import { beforeEach, describe, expect, it, vi } from 'vitest';

const requireAdminSession = vi.fn();
const subscriberCreate = vi.fn();
const subscriberUpdate = vi.fn();
const subscriberDelete = vi.fn();
const mailTemplateCreate = vi.fn();
const mailTemplateUpdate = vi.fn();
const mailTemplateDelete = vi.fn();
const mailTemplateFindUnique = vi.fn();
const subscriberFindMany = vi.fn();
const mailCampaignCreate = vi.fn();
const mailCampaignDeleteMany = vi.fn();
const mailAutomationSettingUpsert = vi.fn();

vi.mock('@/lib/auth', () => ({
  requireAdminSession
}));

vi.mock('@/features/admin/system-settings-actions', () => ({
  getRuntimeSystemSettings: vi.fn().mockResolvedValue({
    contact: {
      whatsappNumber: '15551234567'
    },
    email: {
      mailFrom: '',
      smtpHost: '',
      smtpPort: 465,
      smtpUser: '',
      smtpPassword: ''
    },
    llm: {
      provider: 'OpenAI compatible',
      model: 'gpt-4o-mini',
      apiBaseUrl: 'https://api.openai.com/v1',
      apiKey: ''
    },
    upload: {
      productSegment: 'products',
      categorySegment: 'categories',
      bannerSegment: 'banners'
    }
  })
}));

vi.mock('@/lib/db', () => ({
  db: {
    subscriber: {
      create: subscriberCreate,
      update: subscriberUpdate,
      delete: subscriberDelete,
      findMany: subscriberFindMany
    },
    mailTemplate: {
      create: mailTemplateCreate,
      update: mailTemplateUpdate,
      delete: mailTemplateDelete,
      findUnique: mailTemplateFindUnique
    },
    mailCampaign: {
      create: mailCampaignCreate,
      deleteMany: mailCampaignDeleteMany
    },
    mailAutomationSetting: {
      upsert: mailAutomationSettingUpsert
    }
  }
}));

describe('admin subscriber routes', () => {
  beforeEach(() => {
    requireAdminSession.mockReset();
    subscriberCreate.mockReset();
    subscriberUpdate.mockReset();
    subscriberDelete.mockReset();
    mailTemplateCreate.mockReset();
    mailTemplateUpdate.mockReset();
    mailTemplateDelete.mockReset();
    mailTemplateFindUnique.mockReset();
    subscriberFindMany.mockReset();
    mailCampaignCreate.mockReset();
    mailCampaignDeleteMany.mockReset();
    mailAutomationSettingUpsert.mockReset();
    requireAdminSession.mockResolvedValue({ id: 'admin-1', username: 'admin' });
  });

  it('creates and deletes subscribers through authenticated API routes', async () => {
    subscriberCreate.mockResolvedValue({
      id: 'subscriber-1',
      email: 'buyer@example.com',
      status: 'active',
      source: 'admin',
      createdAt: new Date('2026-05-15T00:00:00.000Z')
    });
    subscriberDelete.mockResolvedValue({ id: 'subscriber-1' });

    const subscribersRoute = await import('@/app/api/admin/subscribers/route');
    const subscriberRoute = await import('@/app/api/admin/subscribers/[id]/route');

    const createResponse = await subscribersRoute.POST(
      new Request('http://localhost/api/admin/subscribers', {
        method: 'POST',
        body: JSON.stringify({ email: 'buyer@example.com' })
      })
    );
    const createJson = await createResponse.json();

    await subscriberRoute.DELETE(new Request('http://localhost/api/admin/subscribers/subscriber-1'), {
      params: Promise.resolve({ id: 'subscriber-1' })
    });

    expect(requireAdminSession).toHaveBeenCalledTimes(2);
    expect(subscriberCreate).toHaveBeenCalledWith({
      data: {
        email: 'buyer@example.com',
        source: 'admin',
        status: 'active'
      }
    });
    expect(subscriberDelete).toHaveBeenCalledWith({
      where: { id: 'subscriber-1' }
    });
    expect(createJson).toMatchObject({
      ok: true,
      subscriber: {
        id: 'subscriber-1',
        email: 'buyer@example.com',
        status: 'active'
      }
    });
  });

  it('persists mail templates through authenticated API routes', async () => {
    mailTemplateCreate.mockResolvedValue({
      id: 'template-1',
      name: '新品通知',
      subject: '新品上架',
      body: '正文',
      createdAt: new Date('2026-05-15T00:00:00.000Z'),
      updatedAt: new Date('2026-05-15T00:00:00.000Z')
    });
    mailTemplateUpdate.mockResolvedValue({
      id: 'template-1',
      name: '新品通知更新',
      subject: '新品上架',
      body: '正文',
      createdAt: new Date('2026-05-15T00:00:00.000Z'),
      updatedAt: new Date('2026-05-15T00:00:00.000Z')
    });
    mailTemplateDelete.mockResolvedValue({ id: 'template-1' });

    const templatesRoute = await import('@/app/api/admin/mail-templates/route');
    const templateRoute = await import('@/app/api/admin/mail-templates/[id]/route');

    await templatesRoute.POST(
      new Request('http://localhost/api/admin/mail-templates', {
        method: 'POST',
        body: JSON.stringify({
          name: '新品通知',
          subject: '新品上架',
          body: '正文'
        })
      })
    );
    await templateRoute.PATCH(
      new Request('http://localhost/api/admin/mail-templates/template-1', {
        method: 'PATCH',
        body: JSON.stringify({
          name: '新品通知更新',
          subject: '新品上架',
          body: '正文'
        })
      }),
      { params: Promise.resolve({ id: 'template-1' }) }
    );
    await templateRoute.DELETE(
      new Request('http://localhost/api/admin/mail-templates/template-1'),
      { params: Promise.resolve({ id: 'template-1' }) }
    );

    expect(mailTemplateCreate).toHaveBeenCalledWith({
      data: {
        name: '新品通知',
        subject: '新品上架',
        body: '正文'
      }
    });
    expect(mailTemplateUpdate).toHaveBeenCalledWith({
      where: { id: 'template-1' },
      data: {
        name: '新品通知更新',
        subject: '新品上架',
        body: '正文'
      }
    });
    expect(mailTemplateDelete).toHaveBeenCalledWith({
      where: { id: 'template-1' }
    });
  });

  it('creates real campaign records and marks delivery failure when SMTP is not configured', async () => {
    subscriberFindMany.mockResolvedValue([
      {
        id: 'subscriber-1',
        email: 'buyer@example.com',
        status: 'active'
      }
    ]);
    mailTemplateFindUnique.mockResolvedValue({
      id: 'template-1',
      name: '新品通知',
      subject: '新品上架',
      body: '正文'
    });
    mailCampaignCreate.mockResolvedValue({
      id: 'campaign-1',
      status: 'failed',
      recipientCount: 1,
      successCount: 0,
      failureCount: 1,
      errorMessage: 'SMTP_NOT_CONFIGURED',
      createdAt: new Date('2026-05-15T00:00:00.000Z'),
      sentAt: new Date('2026-05-15T00:00:00.000Z')
    });

    const campaignsRoute = await import('@/app/api/admin/mail-campaigns/route');

    const response = await campaignsRoute.POST(
      new Request('http://localhost/api/admin/mail-campaigns', {
        method: 'POST',
        body: JSON.stringify({ templateId: 'template-1' })
      })
    );
    const json = await response.json();

    expect(mailTemplateFindUnique).toHaveBeenCalledWith({
      where: { id: 'template-1' }
    });
    expect(subscriberFindMany).toHaveBeenCalledWith({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' }
    });
    expect(mailCampaignCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          templateId: 'template-1',
          status: 'failed',
          recipientCount: 1,
          successCount: 0,
          failureCount: 1,
          errorMessage: 'SMTP_NOT_CONFIGURED'
        })
      })
    );
    expect(json).toMatchObject({
      ok: true,
      campaign: {
        id: 'campaign-1',
        status: '失败'
      }
    });
  });

  it('deletes selected sent mail campaign records through an authenticated API route', async () => {
    mailCampaignDeleteMany.mockResolvedValue({ count: 2 });

    const campaignsRoute = await import('@/app/api/admin/mail-campaigns/route');

    const response = await campaignsRoute.DELETE(
      new Request('http://localhost/api/admin/mail-campaigns', {
        method: 'DELETE',
        body: JSON.stringify({ ids: ['campaign-1', 'campaign-2'] })
      })
    );
    const json = await response.json();

    expect(requireAdminSession).toHaveBeenCalledOnce();
    expect(mailCampaignDeleteMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['campaign-1', 'campaign-2']
        }
      }
    });
    expect(json).toEqual({
      ok: true,
      deletedCount: 2
    });
  });

  it('persists automation rule settings through an authenticated API route', async () => {
    mailAutomationSettingUpsert.mockResolvedValue({
      id: 'automation-1',
      trigger: 'restock',
      frequencyCap: 'weekly',
      enabled: true
    });

    const route = await import('@/app/api/admin/mail-automation/route');

    await route.PUT(
      new Request('http://localhost/api/admin/mail-automation', {
        method: 'PUT',
        body: JSON.stringify({
          trigger: 'restock',
          frequencyCap: 'weekly',
          enabled: true
        })
      })
    );

    expect(mailAutomationSettingUpsert).toHaveBeenCalledWith({
      where: { singletonKey: 'default' },
      update: {
        trigger: 'restock',
        frequencyCap: 'weekly',
        enabled: true
      },
      create: {
        singletonKey: 'default',
        trigger: 'restock',
        frequencyCap: 'weekly',
        enabled: true
      }
    });
  });
});
