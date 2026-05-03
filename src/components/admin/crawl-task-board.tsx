import React from 'react';
import { Activity } from 'lucide-react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminCard } from './admin-card';
import { AdminPageHero } from './admin-page-hero';

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
  const healthySources = data.sourceSites.filter((site) => site.status === '正常').length;

  return (
    <section className="space-y-6">
      <AdminPageHero
        eyebrow="Crawler"
        title="候选商品入口页"
        description="抓取任务只负责把候选商品送入审核池，不直接承担最终发布动作，便于用户理解来源配置和解析质量。"
        metrics={[
          {
            label: '今日抓取摘要',
            value: '11',
            detail: data.headline
          },
          {
            label: '来源站点健康状态',
            value: `${healthySources} 正常`,
            detail: '其余来源需人工修复解析规则'
          },
          {
            label: '入审核池说明',
            value: '统一入池',
            detail: data.summary
          },
          {
            label: '异常修复',
            value: '3 项',
            detail: '图片字段或分类映射待修正'
          }
        ]}
      />

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
