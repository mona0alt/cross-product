'use client';

import React, { useEffect, useRef, useState } from 'react';

export type FilterSelectGroup = {
  label?: string;
  options: Array<{ value: string; label: string }>;
};

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function FilterSelect({
  name,
  defaultValue = '',
  allLabel,
  groups
}: {
  name: string;
  defaultValue?: string;
  allLabel: string;
  groups: FilterSelectGroup[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = groups
    .flatMap((group) => group.options)
    .find((option) => option.value === selectedValue);

  const chooseOption = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const renderOption = (value: string, label: string) => {
    const isSelected = value === selectedValue;

    return (
      <button
        key={value || '__all__'}
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={() => chooseOption(value)}
        className={`flex w-full items-center justify-between gap-2 rounded-[10px] px-3 py-2 text-left text-sm transition ${
          isSelected
            ? 'bg-[var(--mk-bg-muted)] font-semibold text-[var(--mk-accent)]'
            : 'text-[var(--mk-text)] hover:bg-[#f8f5f2]'
        }`}
      >
        <span className="truncate">{label}</span>
        {isSelected ? (
          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[var(--mk-accent)]" />
        ) : null}
      </button>
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={selectedValue} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-[18px] border border-[#e2d9d3] bg-[#f8f5f2] px-4 py-3 text-left text-sm text-[var(--mk-text)] outline-none transition hover:border-[#d8cec7] focus:border-[var(--mk-accent)] focus:bg-white"
      >
        <span
          className={
            selectedOption
              ? 'truncate'
              : 'truncate text-[var(--mk-text-muted)]'
          }
        >
          {selectedOption?.label ?? allLabel}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-[var(--mk-text-muted)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-y-auto rounded-[16px] border border-[#e2d9d3] bg-white p-1.5 shadow-[0_18px_48px_rgba(32,26,25,0.14)]"
        >
          {renderOption('', allLabel)}
          {groups.map((group, groupIndex) => (
            <div key={group.label ?? groupIndex}>
              {group.label ? (
                <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--mk-text-muted)]">
                  {group.label}
                </p>
              ) : null}
              {group.options.map((option) =>
                renderOption(option.value, option.label)
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
