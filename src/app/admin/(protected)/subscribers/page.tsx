import React from 'react';

import { SubscriberMailWorkspace } from '@/components/admin/subscriber-mail-workspace';
import {
  mapMailCampaign,
  mapMailTemplate,
  mapSubscriberRow
} from '@/features/admin/subscriber-actions';
import { getAdminDictionary } from '@/lib/admin-i18n';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

function getOpenRate(campaigns: Array<{ recipientCount: number; successCount: number }>) {
  const totalRecipients = campaigns.reduce((total, campaign) => total + campaign.recipientCount, 0);
  const totalSuccess = campaigns.reduce((total, campaign) => total + campaign.successCount, 0);

  if (totalRecipients === 0) {
    return '0%';
  }

  return `${Math.round((totalSuccess / totalRecipients) * 100)}%`;
}

function mapAutomationSetting(
  setting: {
    trigger: string;
    frequencyCap: string;
    enabled: boolean;
  } | null
) {
  return {
    trigger:
      setting?.trigger === 'restock' || setting?.trigger === 'manual'
        ? setting.trigger
        : 'product_new',
    frequencyCap:
      setting?.frequencyCap === 'weekly' || setting?.frequencyCap === 'unlimited'
        ? setting.frequencyCap
        : 'daily',
    enabled: setting?.enabled ?? true
  } as const;
}

function formatCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function getCampaignStatusLabel(
  status: '成功' | '部分成功' | '失败' | '待发送',
  copy: Awaited<ReturnType<typeof getAdminDictionary>>['Admin']['subscribers']
) {
  if (status === '成功') {
    return copy.statusSuccess;
  }

  if (status === '部分成功') {
    return copy.statusPartial;
  }

  if (status === '失败') {
    return copy.statusFailed;
  }

  return copy.statusPending;
}

export default async function AdminSubscribersPage() {
  const [subscribers, templates, campaigns, automationSetting, { locale, Admin }] = await Promise.all([
    db.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    db.mailTemplate.findMany({
      orderBy: { updatedAt: 'desc' }
    }),
    db.mailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    }),
    db.mailAutomationSetting.findFirst({
      where: { singletonKey: 'default' }
    }),
    getAdminDictionary()
  ]);

  const subscriberRows = subscribers.map(mapSubscriberRow);
  const templateRows = templates.map(mapMailTemplate);
  const sentRecords = campaigns.map((campaign) => mapMailCampaign(campaign, locale));
  const failedCount = campaigns.reduce((total, campaign) => total + campaign.failureCount, 0);
  const data = {
    total: formatNumber(subscriberRows.length, locale),
    openRate: getOpenRate(campaigns),
    failed: formatNumber(failedCount, locale),
    campaigns: sentRecords.slice(0, 5).map((campaign) => ({
      title: campaign.templateName,
      status: getCampaignStatusLabel(campaign.status, Admin.subscribers),
      detail: `${formatCopy(Admin.subscribers.campaignDetail, {
        recipients: campaign.recipients,
        success: campaign.success,
        failed: campaign.failed
      })}${campaign.errorMessage ? ` ${campaign.errorMessage}` : ''}`
    })),
    templates: templateRows
  };

  return (
    <section className="flex h-[calc(100vh-104px)] min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 animate-fade-in-up">
        <SubscriberMailWorkspace
          data={data}
          subscribers={subscriberRows}
          templates={templateRows}
          sentRecords={sentRecords}
          automation={mapAutomationSetting(automationSetting)}
          initialTab="subscribers"
          copy={Admin.subscribers}
        />
      </div>
    </section>
  );
}
