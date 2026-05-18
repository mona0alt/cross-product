'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ADMIN_IMAGE_ACCEPT,
  ADMIN_IMAGE_UPLOAD_HINT,
  getAdminUploadErrorMessage,
  validateAdminUploadFile,
  type AdminUploadErrorCopy,
  type AdminUploadStatusTone
} from '@/features/admin/upload-rules';

type UploadScope = 'product' | 'banner' | 'category';
type UploadStatus = {
  tone: AdminUploadStatusTone;
  message: string;
};

export type AdminImageUploadCopy = {
  hint: string;
  currentImage: string;
  configuredImage: string;
  emptyImage: string;
  uploading: string;
  uploaded: string;
  uploadedToInput: string;
  removeImage: string;
  errors: AdminUploadErrorCopy;
};

const defaultAdminImageUploadCopy: AdminImageUploadCopy = {
  hint: ADMIN_IMAGE_UPLOAD_HINT,
  currentImage: '当前图片',
  configuredImage: '本地图片已配置',
  emptyImage: '暂未配置图片',
  uploading: '正在上传图片...',
  uploaded: '图片已上传。',
  uploadedToInput: '图片已上传，地址已写入输入框。',
  removeImage: '移除图片',
  errors: {
    missingFile: '请选择一张图片后再上传。',
    fileTooLarge: '图片过大，单张图片不能超过 5MB。请压缩后重新上传。',
    unsupportedFileType: '图片格式不支持。请上传 JPG、PNG、WebP 或 GIF。',
    uploadFailed: '上传失败，请稍后重试。'
  }
};

export function getAdminUploadedValue({
  currentValue,
  uploadedUrl,
  multiline
}: {
  currentValue: string;
  uploadedUrl: string;
  multiline: boolean;
}) {
  if (!multiline) {
    return uploadedUrl;
  }

  const trimmedValue = currentValue.trim();

  return trimmedValue ? `${trimmedValue}\n${uploadedUrl}` : uploadedUrl;
}

export function getAdminImagePreviewSrc({
  committedValue,
  localPreviewUrl
}: {
  committedValue: string;
  localPreviewUrl?: string | null;
}) {
  return localPreviewUrl || committedValue.trim();
}

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
  clearLabel,
  allowManualEntry = scope === 'banner',
  uploadCopy = defaultAdminImageUploadCopy
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
  allowManualEntry?: boolean;
  uploadCopy?: AdminImageUploadCopy;
}) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const localPreviewUrlRef = useRef<string | null>(null);
  const previewSrc = getAdminImagePreviewSrc({
    committedValue: value,
    localPreviewUrl
  });
  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

  const clearLocalPreviewUrl = () => {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }
    setLocalPreviewUrl(null);
  };

  useEffect(() => {
    setValue(defaultValue ?? '');
    clearLocalPreviewUrl();
  }, [defaultValue]);

  useEffect(
    () => () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    },
    []
  );

  function showLocalPreview(file: File) {
    if (!showPreview || typeof URL.createObjectURL !== 'function') {
      return;
    }

    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    localPreviewUrlRef.current = nextPreviewUrl;
    setLocalPreviewUrl(nextPreviewUrl);
  }

  async function upload(file: File) {
    const validationError = validateAdminUploadFile(file);
    if (validationError) {
      setStatus({
        tone: 'error',
        message: getAdminUploadErrorMessage(validationError, uploadCopy.errors)
      });
      clearLocalPreviewUrl();
      return;
    }

    const formData = new FormData();
    formData.set('file', file);
    formData.set('scope', scope);
    setStatus({ tone: 'info', message: uploadCopy.uploading });

    const response = await fetch('/api/admin/uploads/product-images', {
      method: 'POST',
      body: formData
    });

    const payload = (await response.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
    };

    if (!response.ok || !payload.url) {
      setStatus({
        tone: 'error',
        message: getAdminUploadErrorMessage(
          payload.error ?? 'UPLOAD_FAILED',
          uploadCopy.errors
        )
      });
      clearLocalPreviewUrl();
      return;
    }

    setValue((current) =>
      getAdminUploadedValue({
        currentValue: current,
        uploadedUrl: payload.url ?? current,
        multiline
      })
    );
    setStatus({
      tone: 'success',
      message: scope === 'banner' ? uploadCopy.uploadedToInput : uploadCopy.uploaded
    });
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
        accept={ADMIN_IMAGE_ACCEPT}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            showLocalPreview(file);
            void upload(file);
          }
          event.target.value = '';
        }}
      />
      {allowManualEntry && multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={`${inputClass} min-h-[100px] resize-y`}
          placeholder={placeholder}
        />
      ) : allowManualEntry ? (
        <input
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={inputClass}
          placeholder={placeholder}
        />
      ) : (
        <input name={name} type="hidden" value={value} readOnly />
      )}
      <p className="text-xs text-admin-text-muted">{uploadCopy.hint}</p>
      {showPreview ? (
        <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-elevated">
          {previewSrc ? (
            <div className="grid gap-3 p-3 sm:grid-cols-[112px_minmax(0,1fr)]">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-admin-border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element -- Admin upload previews must support local blob URLs before the file is served publicly. */}
                <img
                  data-admin-upload-preview="true"
                  src={previewSrc}
                  alt={previewAlt ?? label}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-admin-text-muted">
                    {uploadCopy.currentImage}
                  </p>
                  <p className="mt-1 text-sm text-admin-text-secondary">
                    {uploadCopy.configuredImage}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setValue('');
                    clearLocalPreviewUrl();
                  }}
                  className="self-start rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
                >
                  {clearLabel ?? uploadCopy.removeImage}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[112px] items-center justify-center px-4 py-6 text-sm text-admin-text-muted">
              {uploadCopy.emptyImage}
            </div>
          )}
        </div>
      ) : null}
      {status ? (
        <p
          role={status.tone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={
            status.tone === 'error'
              ? 'rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700'
              : status.tone === 'success'
              ? 'rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700'
              : 'rounded-lg border border-admin-border bg-admin-elevated px-3 py-2 text-xs font-medium text-admin-text-secondary'
          }
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
