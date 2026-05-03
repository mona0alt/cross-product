'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  Cpu,
  Dumbbell,
  Download,
  DoorOpen,
  Group,
  Home,
  MoveRight,
  Percent,
  Send,
  Shirt,
  Sparkles,
  TrendingUp,
  Wallet
} from 'lucide-react';

const metrics = [
  {
    title: '总营收 (Total Revenue)',
    value: '¥4,280,000',
    delta: '12.5%',
    deltaTone: 'emerald' as const,
    note: '已完成本月目标的 72%',
    icon: Wallet,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    dotClassName: 'bg-emerald-500'
  },
  {
    title: '转化率 (Conversion Rate)',
    value: '3.48%',
    delta: '2.1%',
    deltaTone: 'emerald' as const,
    note: '行业基准值为 2.8%',
    icon: Percent,
    iconClassName: 'bg-blue-50 text-blue-600',
    dotClassName: 'bg-blue-400'
  },
  {
    title: '跳出率 (Bounce Rate)',
    value: '24.12%',
    delta: '0.4%',
    deltaTone: 'red' as const,
    note: '异常警告：移动端波动',
    icon: DoorOpen,
    iconClassName: 'bg-red-50 text-red-600',
    dotClassName: 'bg-red-400'
  },
  {
    title: '活跃用户 (Active Users)',
    value: '12,842',
    delta: '8.3%',
    deltaTone: 'emerald' as const,
    note: '当前实时在线: 421',
    icon: Group,
    iconClassName: 'bg-slate-50 text-slate-600',
    dotClassName: 'bg-slate-800'
  }
];

const funnelSteps = [
  {
    label: '网站总访问量',
    users: '128,421 用户',
    share: '100%',
    width: '100%'
  },
  {
    label: '产品列表/搜索',
    users: '82,189 用户',
    share: '64%',
    width: '82%'
  },
  {
    label: '加入购物车',
    users: '28,252 用户',
    share: '22%',
    width: '56%'
  },
  {
    label: '成功支付完成',
    users: '4,366 用户',
    share: '3.4%',
    width: '28%'
  }
];


const categoryRows = [
  {
    title: '电子数码',
    share: '42%',
    growth: '+15.2%',
    revenue: '¥1,797,600',
    up: true,
    icon: Cpu
  },
  {
    title: '智能家居',
    share: '28%',
    growth: '+8.4%',
    revenue: '¥1,198,400',
    up: true,
    icon: Home
  },
  {
    title: '时尚服饰',
    share: '15%',
    growth: '-2.1%',
    revenue: '¥642,000',
    up: false,
    icon: Shirt
  },
  {
    title: '户外运动',
    share: '10%',
    growth: '+24.0%',
    revenue: '¥428,000',
    up: true,
    icon: Dumbbell
  }
];

function deltaClasses(tone: 'emerald' | 'red') {
  return tone === 'red'
    ? 'bg-red-100 text-red-700'
    : 'bg-emerald-100 text-emerald-700';
}

export function AnalyticsInsightsBoard() {
  type Message = { id: string; role: 'assistant' | 'user'; content: string };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好，我是数据分析助手，可以帮你解读报表数据、分析趋势并提供优化建议。'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: 'user', content: inputValue.trim() }
    ]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-slate-900">
            企业级 AI 数据分析概览
          </h2>
          <p className="mt-1 text-[14px] text-slate-500">
            实时监控全球业务绩效与 AI 智能决策建议
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
            <span>2023年10月01日 - 2023年10月31日</span>
            <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
          </div>
          <button
            type="button"
            className="rounded border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-emerald-600"
            aria-label="下载分析报表"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-lg p-2 ${metric.iconClassName}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={`flex items-center rounded-full px-2 py-1 text-[10px] font-bold ${deltaClasses(metric.deltaTone)}`}
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {metric.delta}
                </div>
              </div>
              <span className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                {metric.title}
              </span>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {metric.value}
                </span>
              </div>
              <div className="mt-4 flex items-center text-[11px] font-medium text-slate-400">
                <span className={`mr-2 h-2 w-2 rounded-full ${metric.dotClassName}`} />
                {metric.note}
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 space-y-8 lg:col-span-8">
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-[18px] font-semibold text-slate-900">
                用户转化漏斗 (Sankey 分析)
              </h3>
              <button
                type="button"
                className="rounded px-2 py-1 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                详细报表
              </button>
            </div>
            <div className="space-y-6 p-8">
              {funnelSteps.map((step, index) => (
                <div key={step.label} className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800">{step.label}</span>
                      <span className="ml-2 text-xs text-slate-400">{step.users}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{step.share}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="flex h-3 items-center justify-end rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-emerald-500 pr-2"
                      style={{ width: step.width }}
                    >
                      {index < funnelSteps.length - 1 ? (
                        <MoveRight className="h-3 w-3 text-white/80" />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/30 px-6 py-4">
              <h3 className="text-[18px] font-semibold text-slate-900">热门产品类别排名</h3>
              <button
                type="button"
                className="rounded border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-50"
              >
                导出表格
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      类别名称
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      市场份额占比
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      季度增长 (QoQ)
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      总营收贡献
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoryRows.map((row) => {
                    const Icon = row.icon;

                    return (
                      <tr key={row.title} className="transition-colors hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded bg-slate-100">
                              <Icon className="h-4 w-4 text-slate-500" />
                            </div>
                            <span className="text-sm font-bold text-slate-800">{row.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="mr-2 w-10 text-xs font-bold text-slate-700">
                              {row.share}
                            </span>
                            <div className="h-2 max-w-[120px] flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: row.share }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`flex items-center text-xs font-bold ${
                              row.up ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            {row.up ? (
                              <ArrowUp className="mr-1 h-3.5 w-3.5" />
                            ) : (
                              <ArrowDown className="mr-1 h-3.5 w-3.5" />
                            )}
                            {row.growth}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                          {row.revenue}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <aside className="col-span-12 flex flex-col lg:col-span-4">
          <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-[72px]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h3 className="text-[18px] font-semibold text-slate-900">AI 数据分析助手</h3>
              </div>
              <span className="flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                实时扫描中
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'rounded-2xl rounded-tr-sm bg-emerald-600 text-white'
                        : 'rounded-2xl rounded-tl-sm bg-slate-50 text-slate-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-100 p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入问题，按回车发送..."
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="rounded-lg bg-emerald-600 p-2.5 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  aria-label="发送"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        </aside>
      </div>

      <footer className="mt-12 flex flex-col items-center justify-between space-y-4 border-t border-slate-200 pt-8 text-[11px] font-medium text-slate-400 md:flex-row md:space-y-0">
        <div className="flex items-center space-x-6">
          <span>© 2023 Enterprise Global Manager. 版权所有。</span>
          <span className="transition-colors hover:text-slate-900">隐私政策</span>
          <span className="transition-colors hover:text-slate-900">服务条款</span>
          <span className="transition-colors hover:text-slate-900">系统架构日志</span>
        </div>
        <div className="flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5">
          <span className="mr-3">最后数据同步: 2023-10-27 14:32:01 (GMT+8)</span>
          <div className="flex items-center text-emerald-500">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
            系统连接正常
          </div>
        </div>
      </footer>
    </section>
  );
}
