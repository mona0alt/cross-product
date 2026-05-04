'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { ProductAuditTable } from '@/components/admin/product-audit-table';
import { ProductAuditModal } from '@/components/admin/product-audit-modal';
import { ProductCreateTab } from '@/components/admin/product-create-tab';
import { AdminLinkButton } from './admin-button';

type LangCompletion = {
  en: 'ok' | 'missing';
  es: 'ok' | 'missing';
  pt: 'ok' | 'missing';
};

type ProductCenterData = {
  summary: {
    pending: number;
    todayProcessed: number;
  };
  rows: ReadonlyArray<{
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
  }>;
  createChecklist: ReadonlyArray<{
    label: string;
    detail: string;
    status: string;
  }>;
};

export function ProductCenter({
  data,
  defaultSelectedProductId,
  defaultTab = 'audit'
}: {
  data: ProductCenterData;
  defaultSelectedProductId?: string;
  defaultTab?: 'audit' | 'create';
}) {
  const [activeTab, setActiveTab] = useState<'audit' | 'create'>(defaultTab);
  const [isModalOpen, setIsModalOpen] = useState(!!defaultSelectedProductId);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    defaultSelectedProductId ?? null
  );

  const selectedProduct = data.rows.find((r) => r.id === selectedProductId) ?? null;
  const isCreateTab = activeTab === 'create';

  const handleAudit = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  const handleApprove = (productId: string) => {
    // eslint-disable-next-line no-console
    console.log('Approved:', productId);
    handleClose();
  };

  const handleDelete = (productId: string) => {
    // eslint-disable-next-line no-console
    console.log('Deleted:', productId);
    handleClose();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-sm font-medium rounded-full shadow-sm transition-colors ${
              isCreateTab
                ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                : 'bg-gray-900 text-white'
            }`}
          >
            商品审核
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-medium rounded-full shadow-sm transition-colors ${
              isCreateTab
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            手动新增
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <AdminLinkButton href="/admin/crawl-tasks" variant="secondary" size="sm">
            <Globe className="h-3.5 w-3.5" />
            抓取日志
          </AdminLinkButton>
        </div>
      </div>

      {isCreateTab ? (
        <ProductCreateTab checklist={data.createChecklist} />
      ) : (
        <>
          <ProductAuditTable
            rows={data.rows}
            summary={data.summary}
            onAudit={handleAudit}
          />
          <ProductAuditModal
            isOpen={isModalOpen}
            product={selectedProduct}
            onClose={handleClose}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        </>
      )}
    </section>
  );
}
