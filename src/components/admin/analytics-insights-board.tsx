import React from 'react';
import { Lightbulb } from 'lucide-react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminPageHero } from './admin-page-hero';
import { AdminTableShell } from './admin-table-shell';

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
      <AdminPageHero
        eyebrow="AI Insights"
        title="本周经营结论"
        description="用图表型信息分区和短文本建议表达分析价值，重点是帮助客户理解哪些结论会反过来影响下一轮选品与推荐位。"
        metrics={[
          {
            label: '本周结论',
            value: '便携设备更热',
            detail: data.headline
          },
          {
            label: '热门分类',
            value: '3 组',
            detail: '用演示洞察表达优先类目'
          },
          {
            label: '高跳出页面',
            value: '2 页',
            detail: '保留页面优化入口感'
          },
          {
            label: '推荐建议',
            value: '已生成',
            detail: '适合作为客户确认的 AI 输出样例'
          }
        ]}
        status={<StatusBadge label="已生成" tone="green" />}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminTableShell
          title="用户转化路径"
          description="展示从首页推荐位到商品详情的静态路径概念。"
        >
          <div className="space-y-3 p-6 text-sm text-admin-text-secondary">
            <p>首页推荐位 -&gt; 商品列表 -&gt; 商品详情 -&gt; 留言 / 订阅</p>
            <p>用于帮助客户确认后续是否需要更真实的漏斗统计。</p>
          </div>
        </AdminTableShell>

        <AdminTableShell
          title="推荐位与选品建议"
          description="把热门商品、分类和运营建议收在同一视觉模块。"
        >
          <div className="grid gap-4 p-6">
            {data.insights.map((insight, i) => (
              <div
                key={i}
                className="rounded-2xl border border-admin-border bg-admin-elevated p-4"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-admin-accent" />
                  <p className="text-sm font-medium text-admin-text-primary">{insight}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-admin-border-strong bg-admin-surface px-4 py-4 text-sm text-admin-text-secondary">
              高跳出页面：分类页与详情页的内容节奏需要在真实阶段继续验证。
            </div>
          </div>
        </AdminTableShell>
      </div>
    </section>
  );
}
