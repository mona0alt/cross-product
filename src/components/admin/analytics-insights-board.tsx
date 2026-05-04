'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  PackageCheck,
  Send,
  Sparkles,
  TrendingUp,
  Wifi
} from 'lucide-react';
import { AdminCard } from './admin-card';

const metrics = [
  {
    title: '总 PV',
    value: '128,421',
    delta: '12.5%',
    deltaTone: 'emerald' as const,
    note: '较上月增长',
    icon: Eye,
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    title: '总商品数量',
    value: '8,632',
    delta: '3.2%',
    deltaTone: 'emerald' as const,
    note: '本月新增 256 件',
    icon: PackageCheck,
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  {
    title: '页面访问成功率',
    value: '99.8%',
    delta: '0.1%',
    deltaTone: 'emerald' as const,
    note: '系统运行稳定',
    icon: Wifi,
    accent: 'bg-slate-700',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600'
  }
];

const productRows = [
  {
    title: '星河 Pro 手机',
    share: '42%',
    growth: '+15.2%',
    revenue: '¥1,797,600',
    up: true
  },
  {
    title: '智能空气净化器',
    share: '28%',
    growth: '+8.4%',
    revenue: '¥1,198,400',
    up: true
  },
  {
    title: '复古运动跑鞋',
    share: '15%',
    growth: '-2.1%',
    revenue: '¥642,000',
    up: false
  },
  {
    title: '便携露营帐篷',
    share: '10%',
    growth: '+24.0%',
    revenue: '¥428,000',
    up: true
  }
];

function deltaClasses(tone: 'emerald' | 'red') {
  return tone === 'red'
    ? 'bg-red-50 text-red-600'
    : 'bg-emerald-50 text-emerald-600';
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
    <section className="flex flex-col gap-5 min-h-[calc(100vh-104px)]">
      <div className="flex-1 flex flex-col gap-5">
        {/* Metrics */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className={`relative overflow-hidden rounded-[20px] border border-admin-border bg-admin-surface p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] opacity-0 animate-fade-in-up admin-stagger-${index + 1}`}
              >
                <div className={`absolute left-0 top-0 h-full w-[3px] ${metric.accent}`} />
                <div className="flex items-center justify-between">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${metric.iconBg}`}>
                    <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${deltaClasses(metric.deltaTone)}`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {metric.delta}
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-[28px] font-bold tracking-tight text-admin-text-primary font-display">
                    {metric.value}
                  </span>
                </div>
                <div className="mt-1 text-[12px] font-semibold text-admin-text-secondary">
                  {metric.title}
                </div>
                <div className="mt-3 flex items-center border-t border-admin-border pt-2.5 text-[11px] text-admin-text-muted">
                  <span className={`mr-2 h-1.5 w-1.5 rounded-full ${metric.accent}`} />
                  {metric.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 flex-1">
          {/* Table */}
          <AdminCard className="lg:col-span-2 flex flex-col" delay={4}>
            <div className="flex items-center justify-between border-b border-admin-border pb-4">
              <h3 className="text-[15px] font-semibold text-admin-text-primary">
                热门产品排名
              </h3>
              <button
                type="button"
                className="rounded-md border border-admin-border bg-admin-elevated px-2.5 py-1 text-[11px] font-semibold text-admin-text-secondary transition-colors hover:bg-admin-border"
              >
                导出表格
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-admin-border">
                    <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-admin-text-muted">
                      产品名称
                    </th>
                    <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-admin-text-muted">
                      市场份额占比
                    </th>
                    <th className="pb-3 text-[10px] font-bold uppercase tracking-wider text-admin-text-muted">
                      季度增长
                    </th>
                    <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-wider text-admin-text-muted">
                      总营收贡献
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {productRows.map((row) => (
                    <tr key={row.title} className="group transition-colors hover:bg-admin-elevated">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-md bg-admin-elevated group-hover:bg-admin-border">
                            <PackageCheck className="h-3.5 w-3.5 text-admin-text-muted" />
                          </div>
                          <span className="text-[13px] font-semibold text-admin-text-primary">
                            {row.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 text-[12px] font-bold text-admin-text-primary">
                            {row.share}
                          </span>
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-admin-elevated">
                            <div
                              className="h-full rounded-full bg-admin-accent"
                              style={{ width: row.share }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-0.5 text-[12px] font-bold ${
                            row.up ? 'text-admin-success' : 'text-admin-danger'
                          }`}
                        >
                          {row.up ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {row.growth}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[13px] font-bold text-admin-text-primary">
                        {row.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>

          {/* AI Chat */}
          <AdminCard className="flex flex-col" delay={5} hover={false}>
            <div className="flex items-center justify-between border-b border-admin-border pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-admin-accent" />
                <h3 className="text-[15px] font-semibold text-admin-text-primary">
                  AI 数据分析助手
                </h3>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-admin-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-admin-accent animate-pulse" />
                实时扫描中
              </span>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3 min-h-[200px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] px-3.5 py-2 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-2xl rounded-tr-sm bg-admin-accent text-white'
                        : 'rounded-2xl rounded-tl-sm bg-admin-elevated text-admin-text-secondary'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 border-t border-admin-border pt-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入问题，按回车发送..."
                  className="flex-1 rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-[13px] text-admin-text-primary placeholder:text-admin-text-muted focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="rounded-lg bg-admin-accent p-2 text-white transition-colors hover:bg-admin-accent-hover disabled:cursor-not-allowed disabled:bg-admin-border"
                  aria-label="发送"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

    </section>
  );
}
