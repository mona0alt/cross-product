import React from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminCard } from './admin-card';
import { AdminPageHero } from './admin-page-hero';
import { AdminTableShell } from './admin-table-shell';

type SubscriberNotificationData = {
  total: string;
  openRate: string;
  failed: string;
  campaigns: ReadonlyArray<{
    title: string;
    status: string;
    detail: string;
  }>;
};

export function SubscriberNotificationBoard({
  data
}: {
  data: SubscriberNotificationData;
}) {
  return (
    <section className="space-y-6">
      <AdminPageHero
        eyebrow="Subscribers"
        title="订阅规模与通知节奏"
        description="把新品发布后的通知规模、待发送活动和失败重发集中在首屏，方便客户理解通知闭环。"
        metrics={[
          {
            label: '订阅规模',
            value: data.total,
            detail: '前台订阅邮箱统一汇总'
          },
          {
            label: '邮件打开率',
            value: data.openRate,
            detail: '演示口径，不代表真实发送数据'
          },
          {
            label: '待发送活动',
            value: '1',
            detail: '待确认或自动发送的新品活动'
          },
          {
            label: '失败重发',
            value: data.failed,
            detail: '保留失败队列入口感'
          }
        ]}
      />

      <AdminTableShell
        title="通知活动与失败队列"
        description="活动列表、失败重发和订阅用户入口在同一视觉模块中统一呈现。"
      >
        <div className="grid gap-4 p-6 xl:grid-cols-2">
          {data.campaigns.map((campaign, i) => (
            <AdminCard key={campaign.title} delay={i + 2}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-admin-text-primary font-display">
                  {campaign.title}
                </h3>
                <StatusBadge
                  label={campaign.status}
                  tone={campaign.status === '待发送' ? 'amber' : 'slate'}
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-admin-text-secondary">
                {campaign.detail}
              </p>
            </AdminCard>
          ))}
        </div>
      </AdminTableShell>
    </section>
  );
}
