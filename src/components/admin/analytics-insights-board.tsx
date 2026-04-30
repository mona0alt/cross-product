import React from 'react';

import { StatusBadge } from '@/components/admin/status-badge';

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
      <div className="rounded-[2rem] bg-emerald-950 p-8 text-white shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
          AI Insights
        </p>
        <h2 className="mt-3 text-3xl font-semibold">AI 经营分析台</h2>
        <p className="mt-3 text-lg text-white">{data.headline}</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-100">
          {data.summary}
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Insight Blocks
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              用户转化路径与推荐建议
            </h3>
          </div>
          <StatusBadge label="已生成" tone="green" />
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {data.insights.map((insight) => (
            <div key={insight} className="rounded-3xl bg-slate-100 p-5">
              <p className="font-semibold text-slate-950">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
