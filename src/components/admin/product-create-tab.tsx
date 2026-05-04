import React from 'react';
import { AdminButton } from '@/components/admin/admin-button';
import { AdminTableShell } from '@/components/admin/admin-table-shell';
import { StatusBadge } from '@/components/admin/status-badge';

type ChecklistItem = {
  label: string;
  detail: string;
  status: string;
};

const inputClass =
  'w-full rounded-lg border border-admin-border bg-white px-4 py-2.5 text-sm text-admin-text-primary outline-none';

function getChecklistTone(status: string) {
  if (status === '通过') return 'green';
  if (status === '说明') return 'slate';
  return 'amber';
}

export function ProductCreateTab({
  checklist
}: {
  checklist: ReadonlyArray<ChecklistItem>;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <AdminTableShell
          title="手动新增"
          description="录入任务与审核任务分开，避免在同一个工作区里相互干扰。"
        >
          <div className="grid gap-6 p-6">
            <section className="grid gap-4">
              <h4 className="text-lg font-semibold text-admin-text-primary font-display">基础信息</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input className={inputClass} placeholder="输入核心标题" />
                <input className={inputClass} placeholder="输入 SKU / 来源标记" />
                <input className={inputClass} placeholder="选择分类" />
                <input className={inputClass} placeholder="来源类型" />
              </div>
            </section>

            <section className="grid gap-4">
              <h4 className="text-lg font-semibold text-admin-text-primary font-display">交易信息</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input className={inputClass} placeholder="价格" />
                <input className={inputClass} placeholder="库存" />
                <input className={inputClass} placeholder="币种" />
                <input className={inputClass} placeholder="上架语言" />
              </div>
            </section>

            <section className="grid gap-4">
              <h4 className="text-lg font-semibold text-admin-text-primary font-display">媒体与描述</h4>
              <textarea
                className={`${inputClass} min-h-[120px] resize-none`}
                placeholder="点击或拖拽图片上传"
              />
              <textarea
                className={`${inputClass} min-h-[120px] resize-none`}
                placeholder="商品描述 / 多语言内容"
              />
            </section>
          </div>

          <div className="flex justify-end gap-3 border-t border-admin-border bg-slate-50 p-4">
            <AdminButton type="button" variant="secondary">
              保存草稿
            </AdminButton>
            <AdminButton type="button" variant="primary">
              保存到待审核
            </AdminButton>
          </div>
        </AdminTableShell>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <AdminTableShell
          title="提交前检查"
          description="用轻量检查卡提示当前录入结果是否适合提交到审核池。"
        >
          <div className="grid gap-3 p-4">
            {checklist.map((item) => (
              <article key={item.label} className="rounded-xl border border-admin-border bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-admin-text-primary">{item.label}</p>
                  <StatusBadge
                    label={item.status}
                    tone={getChecklistTone(item.status) as 'green' | 'slate' | 'amber'}
                  />
                </div>
                <p className="mt-2 text-xs leading-6 text-admin-text-secondary">{item.detail}</p>
              </article>
            ))}
          </div>
        </AdminTableShell>
      </div>
    </div>
  );
}
