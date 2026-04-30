import React from 'react';
import { Globe, Activity } from 'lucide-react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminCard } from './admin-card';

type CrawlTaskData = {
  headline: string;
  summary: string;
  sourceSites: ReadonlyArray<{
    label: string;
    status: string;
    detail: string;
  }>;
};

export function CrawlTaskBoard({
  data
}: {
  data: CrawlTaskData;
}) {
  return (
    <section className="space-y-6">
      <AdminCard delay={1}>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-accent/10">
            <Globe className="h-5 w-5 text-admin-accent" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
              Crawler
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-admin-text-primary font-display">
              抓取任务看板
            </h2>
            <p className="mt-2 text-lg text-admin-text-primary">{data.headline}</p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-admin-text-secondary">
              {data.summary}
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminCard delay={2}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
              Sources
            </p>
            <h3 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
              来源站点
            </h3>
          </div>
          <StatusBadge label="入审核池" tone="blue" />
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {data.sourceSites.map((site) => (
            <div
              key={site.label}
              className="rounded-lg border border-admin-border bg-admin-elevated p-5 transition-all duration-200 hover:border-admin-border-strong"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-admin-text-primary">{site.label}</p>
                <div className="flex items-center gap-2">
                  <Activity className={`h-3.5 w-3.5 ${site.status === '正常' ? 'text-admin-success' : 'text-admin-warning'}`} />
                  <StatusBadge
                    label={site.status}
                    tone={site.status === '正常' ? 'green' : 'amber'}
                  />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-admin-text-secondary">
                {site.detail}
              </p>
            </div>
          ))}
        </div>
      </AdminCard>
    </section>
  );
}
