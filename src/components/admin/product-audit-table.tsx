import React from 'react';
import { Bot, Factory, Plane } from 'lucide-react';

type LangCompletion = {
  en: 'ok' | 'missing';
  es: 'ok' | 'missing';
  pt: 'ok' | 'missing';
};

type AuditRow = {
  id: string;
  name: string;
  productCode: string;
  category: string;
  source: string;
  status: string;
  aiScore: number;
  langCompletion: LangCompletion;
  action: string;
  content?: Record<'zh' | 'en' | 'es' | 'pt', { name: string; copy: string }>;
  gallery?: ReadonlyArray<{ id: string; url: string; isPrimary: boolean }>;
};

interface ProductAuditTableProps {
  rows: ReadonlyArray<AuditRow>;
  summary: { pending: number; todayProcessed: number };
  onAudit: (productId: string) => void;
}

function getSourceStyle(source: string) {
  if (source === '自动抓取') {
    return 'bg-green-50 text-green-700 border-green-100';
  }
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function getStatusStyle(status: string) {
  if (status === '待审核') return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  if (status === '补充信息') return 'bg-orange-50 text-orange-700 border-orange-100';
  if (status === '可发布') return 'bg-blue-50 text-blue-700 border-blue-100';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function getScoreStyle(score: number) {
  if (score >= 90) return 'bg-blue-50 text-blue-700 border-blue-100';
  if (score >= 80) return 'bg-teal-50 text-teal-700 border-teal-100';
  return 'bg-yellow-50 text-yellow-700 border-yellow-100';
}

function getLangStyle(status: 'ok' | 'missing') {
  if (status === 'ok') return 'bg-gray-100 text-gray-600';
  return 'bg-red-50 text-red-600 border border-red-100';
}

function ProductIcon({ category }: { category: string }) {
  const iconClass = 'w-6 h-6 text-gray-400';
  if (category.includes('机器人')) return <Bot className={iconClass} />;
  if (category.includes('无人机')) return <Plane className={iconClass} />;
  if (category.includes('机械')) return <Factory className={iconClass} />;
  return <Bot className={iconClass} />;
}

export function ProductAuditTable({ rows, summary, onAudit }: ProductAuditTableProps) {
  return (
    <section className="space-y-6">
      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">待审核</p>
          <p className="text-2xl font-bold text-gray-900">{summary.pending}</p>
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">今日已处理</p>
          <p className="text-2xl font-bold text-gray-900">{summary.todayProcessed}</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">待审核队列</h3>
            <p className="text-xs text-gray-500">点击「审核」按钮进入内容校验详情页。</p>
          </div>
          <div className="flex gap-2">
            <select className="text-sm border-gray-200 rounded-md text-gray-600 py-1.5 pl-3 pr-8 focus:ring-teal-500 focus:border-teal-500 border">
              <option>所有状态</option>
              <option>待审核</option>
              <option>补充信息</option>
            </select>
            <select className="text-sm border-gray-200 rounded-md text-gray-600 py-1.5 pl-3 pr-8 focus:ring-teal-500 focus:border-teal-500 border">
              <option>按完整度排序 (降序)</option>
              <option>按时间排序 (最新)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Source / Status</th>
                <th className="px-6 py-3 font-medium text-center">AI Score</th>
                <th className="px-6 py-3 font-medium">Completion (EN/ES/PT)</th>
                <th className="px-6 py-3 font-medium">Issue</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 border border-gray-200">
                        <ProductIcon category={row.category} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                          {row.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          SKU {row.productCode} · {row.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getSourceStyle(row.source)}`}>
                        {row.source}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm border ${getScoreStyle(row.aiScore)}`}>
                      {row.aiScore}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {(['en', 'es', 'pt'] as const).map((lang) => (
                        <span
                          key={lang}
                          className={`flex items-center justify-center w-6 h-6 rounded text-xs font-medium ${getLangStyle(row.langCompletion[lang])}`}
                          title={`${lang.toUpperCase()} - ${row.langCompletion[lang] === 'ok' ? 'OK' : 'Missing'}`}
                        >
                          {lang.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-600 max-w-xs truncate" title={row.action}>
                      {row.action}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAudit(row.id);
                      }}
                      className="px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors shadow-sm"
                    >
                      审核
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1 to {rows.length} of {rows.length} entries</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed text-sm">Prev</button>
            <button className="px-3 py-1 rounded border border-teal-500 bg-teal-50 text-teal-700 font-medium text-sm">1</button>
            <button className="px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">Next</button>
          </div>
        </div>
      </div>
    </section>
  );
}
