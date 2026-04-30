import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminCard } from './admin-card';

type AnalyticsInsightsData = {
  headline: string;
  summary: string;
  insights: readonly string[];
};

export function AnalyticsInsightsBoard({
  data
}: {
  data: AnalyticsInsightsData;
}) {
  return (
    <section className="space-y-6">
      <AdminCard delay={1} className="border-l-2 border-l-admin-success">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-success/10">
            <Sparkles className="h-5 w-5 text-admin-success" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
              AI Insights
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-admin-text-primary font-display">
              AI 经营分析台
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
              Insight Blocks
            </p>
            <h3 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
              用户转化路径与推荐建议
            </h3>
          </div>
          <StatusBadge label="已生成" tone="green" />
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {data.insights.map((insight, i) => (
            <div
              key={i}
              className="rounded-lg border border-admin-border bg-admin-elevated p-5 transition-all duration-200 hover:border-admin-border-strong"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-admin-accent" />
                <p className="text-sm font-medium text-admin-text-primary">{insight}</p>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </section>
  );
}
