'use client';

import React from 'react';
import Image from 'next/image';
import {
  Box,
  ImagePlus,
  FileText,
  Save,
  Send,
  UploadCloud,
  X,
} from 'lucide-react';
import { AdminButton } from '@/components/admin/admin-button';

const inputBase =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10';

const mockImages = [
  'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop',
];

export function ProductCreateTab() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <Box className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">手动新增商品</h3>
            <p className="text-xs text-gray-500">录入任务与审核任务分开，避免在同一个工作区里相互干扰。</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          录入模式
        </div>
      </div>

      <div className="p-5">
        {/* 基础信息 */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Field label="商品名称">
              <input className={inputBase} placeholder="输入核心标题" />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="分类">
              <input className={inputBase} placeholder="选择分类" />
            </Field>
          </div>
          <div>
            <Field label="库存">
              <input className={inputBase} placeholder="0" type="number" />
            </Field>
          </div>
          <div>
            <Field label="币种">
              <input className={inputBase} placeholder="CNY / USD" />
            </Field>
          </div>
        </div>

        <hr className="my-5 border-gray-100" />

        {/* 媒体与描述 — 左右分栏 */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* 左侧：图片上传 */}
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <ImagePlus className="h-3.5 w-3.5" />
              商品图片
              <span className="ml-auto text-[10px] font-normal text-gray-400">{mockImages.length} / 9</span>
            </span>

            {/* 大上传区 */}
            <button
              type="button"
              className="group flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-8 text-gray-400 transition-all hover:border-teal-300 hover:bg-teal-50/30 hover:text-teal-600"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">点击或拖拽上传</p>
                <p className="mt-0.5 text-[11px] text-gray-400">支持 JPG、PNG，单张不超过 5MB</p>
              </div>
            </button>

            {/* 预览网格 */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {mockImages.map((src, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                >
                  <Image
                    src={src}
                    alt={`预览 ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 25vw, 120px"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：商品描述 */}
          <div className="flex flex-col">
            <span className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <FileText className="h-3.5 w-3.5" />
              商品描述
            </span>
            <textarea
              className={`${inputBase} min-h-[220px] flex-1 resize-none`}
              placeholder="输入商品描述，支持多语言内容..."
            />
            <p className="mt-1.5 text-right text-[10px] text-gray-400">支持 Markdown 语法</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-3">
        <AdminButton type="button" variant="primary">
          <Send className="h-4 w-4" />
          保存到待审核
        </AdminButton>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}
