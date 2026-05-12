'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

type UploadScope = 'product' | 'banner' | 'category';

export function AdminImageUploadInput({
  name,
  label,
  uploadLabel,
  defaultValue,
  placeholder,
  scope,
  multiline = false,
  showPreview = false,
  previewAlt,
  clearLabel = '移除图片'
}: {
  name: string;
  label: string;
  uploadLabel: string;
  defaultValue?: string;
  placeholder?: string;
  scope: UploadScope;
  multiline?: boolean;
  showPreview?: boolean;
  previewAlt?: string;
  clearLabel?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [status, setStatus] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

  async function upload(file: File) {
    const formData = new FormData();
    formData.set('file', file);
    formData.set('scope', scope);
    setStatus('Uploading...');

    const response = await fetch('/api/admin/uploads/product-images', {
      method: 'POST',
      body: formData
    });

    const payload = (await response.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
    };

    if (!response.ok || !payload.url) {
      setStatus(payload.error ?? 'UPLOAD_FAILED');
      return;
    }

    setValue((current) => {
      if (!multiline) {
        return payload.url ?? current;
      }

      return current ? `${current.trim()}\n${payload.url}` : payload.url ?? current;
    });
    setStatus(payload.url);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-admin-text-secondary">
          {label}
        </label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-admin-border bg-admin-elevated px-3 py-1.5 text-xs font-semibold text-admin-text-secondary transition hover:border-admin-border-strong hover:text-admin-text-primary"
        >
          {uploadLabel}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void upload(file);
          }
          event.target.value = '';
        }}
      />
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={`${inputClass} min-h-[100px] resize-y`}
          placeholder={placeholder}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={inputClass}
          placeholder={placeholder}
        />
      )}
      {showPreview ? (
        <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-elevated">
          {value ? (
            <div className="grid gap-3 p-3 sm:grid-cols-[112px_minmax(0,1fr)]">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-admin-border bg-white">
                <Image
                  src={value}
                  alt={previewAlt ?? label}
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex min-w-0 flex-col justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-admin-text-muted">
                    当前图片
                  </p>
                  <p className="mt-1 break-all text-sm text-admin-text-secondary">
                    {value}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('')}
                  className="self-start rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
                >
                  {clearLabel}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[112px] items-center justify-center px-4 py-6 text-sm text-admin-text-muted">
              暂未配置图片
            </div>
          )}
        </div>
      ) : null}
      {status ? (
        <p className="text-xs text-admin-text-muted">{status}</p>
      ) : null}
    </div>
  );
}
