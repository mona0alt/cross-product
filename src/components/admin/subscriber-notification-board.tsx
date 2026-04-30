import React from 'react';
import { Mail, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminCard } from './admin-card';

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
  const stats = [
    { label: '订阅用户', value: data.total, icon: Mail },
    { label: '邮件打开率', value: data.openRate, icon: TrendingUp },
    { label: '失败重发', value: data.failed, icon: AlertTriangle }
  ];

  return (
    <section className="space-y-6">
      <AdminCard delay={1}>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-accent/10">
            <Mail className="h-5 w-5 text-admin-accent" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
              Subscribers
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-admin-text-primary font-display">
              订阅与通知
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-admin-border bg-admin-elevated px-5 py-4"
            >
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-admin-text-muted" />
                <p className="text-sm text-admin-text-secondary">{stat.label}</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-admin-text-primary font-mono">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
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
    </section>
  );
}
