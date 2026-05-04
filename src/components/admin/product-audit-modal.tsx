'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Bold, Italic, List, Link, ImagePlus, Upload, CheckCircle } from 'lucide-react';

type Lang = 'zh' | 'en' | 'es' | 'pt';

type ModalProduct = {
  id: string;
  name: string;
  content?: Record<Lang, { name: string; copy: string }>;
  gallery?: ReadonlyArray<{ id: string; url: string; isPrimary: boolean }>;
};

interface ProductAuditModalProps {
  isOpen: boolean;
  product: ModalProduct | null;
  onClose: () => void;
  onApprove: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function ProductAuditModal({ isOpen, product, onClose, onApprove, onDelete }: ProductAuditModalProps) {
  const [activeLang, setActiveLang] = useState<Lang>('zh');

  if (!isOpen || !product) return null;

  const currentContent = product.content?.[activeLang];
  const maxGallery = 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl rounded-lg overflow-hidden border border-slate-300">
        {/* Header */}
        <header className="flex-none bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{product.content?.zh.name ?? product.name}</h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mt-1">
              ID: {product.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="grid grid-cols-12 gap-0">
            {/* Left: Editor */}
            <div className="col-span-12 lg:col-span-7 border-r border-slate-200 p-6 space-y-6">
              {/* Language Switcher */}
              <div className="inline-flex p-1 bg-slate-100 rounded-lg">
                {(['zh', 'en', 'es', 'pt'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${
                      activeLang === lang
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Product Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  产品名称 ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  defaultValue={currentContent?.name ?? ''}
                  className="w-full border-slate-200 focus:ring-teal-500 focus:border-teal-500 rounded-md p-3 bg-slate-50/50 text-sm"
                />
              </div>

              {/* Marketing Copy Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  营销文案 ({activeLang.toUpperCase()})
                </label>
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-4 text-slate-400">
                    <Bold className="w-4 h-4 cursor-pointer hover:text-slate-900" />
                    <Italic className="w-4 h-4 cursor-pointer hover:text-slate-900" />
                    <List className="w-4 h-4 cursor-pointer hover:text-slate-900" />
                    <Link className="w-4 h-4 cursor-pointer hover:text-slate-900" />
                  </div>
                  <textarea
                    defaultValue={currentContent?.copy ?? ''}
                    rows={8}
                    className="w-full border-none focus:ring-0 p-4 bg-white text-sm leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right: Gallery */}
            <div className="col-span-12 lg:col-span-5 bg-slate-50/30 p-6">
              <label className="block text-xs font-semibold text-slate-600 mb-4">
                产品图库 ({product.gallery?.length ?? 0}/{maxGallery})
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(product.gallery ?? []).map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square bg-white border border-slate-200 rounded-lg overflow-hidden relative"
                  >
                    <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                    {img.isPrimary && (
                      <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        主图
                      </span>
                    )}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - (product.gallery?.length ?? 0)) }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="aspect-square bg-slate-100 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <ImagePlus className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">上传</span>
                  </div>
                ))}
                <div className="aspect-square bg-slate-100 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">上传新图</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-none bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="px-6 py-2.5 border border-red-200 text-red-600 font-bold text-sm rounded-md hover:bg-red-50 transition-colors"
          >
            删除
          </button>
          <button
            type="button"
            onClick={() => onApprove(product.id)}
            className="px-8 py-2.5 bg-teal-600 text-white font-bold text-sm rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            审核通过并上架
          </button>
        </footer>
      </div>
    </div>
  );
}
