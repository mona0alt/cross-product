'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type AdminSelectOption = {
  value: string;
  label: string;
};

export function AdminSelect({
  name,
  options,
  defaultValue = '',
  placeholder,
  className = '',
  compact = false,
  disabled = false
}: {
  name: string;
  options: AdminSelectOption[];
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  compact?: boolean;
  disabled?: boolean;
}) {
  const selectId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );
  const visibleLabel = selectedOption?.label ?? placeholder ?? options[0]?.label ?? '';

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const chooseOption = (value: string) => {
    if (disabled) {
      return;
    }

    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input type="hidden" name={name} value={selectedValue} />
      <select
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
        disabled={disabled}
        defaultValue={selectedValue || undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${selectId}-listbox`}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((current) => !current);
          }
        }}
        onKeyDown={(event) => {
          if (disabled) {
            return;
          }

          if (event.key === 'Escape') {
            setIsOpen(false);
            return;
          }

          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            return;
          }

          event.preventDefault();
          const selectedIndex = options.findIndex((option) => option.value === selectedValue);
          const direction = event.key === 'ArrowDown' ? 1 : -1;
          const nextIndex =
            selectedIndex === -1
              ? 0
              : (selectedIndex + direction + options.length) % options.length;

          setSelectedValue(options[nextIndex]?.value ?? selectedValue);
          setIsOpen(true);
        }}
        className={`group flex w-full items-center justify-between gap-3 rounded-lg border border-admin-border bg-admin-surface text-left text-sm font-medium text-admin-text-primary shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-all duration-200 hover:border-admin-border-strong hover:bg-admin-elevated focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/15 disabled:cursor-not-allowed disabled:bg-admin-elevated disabled:text-admin-text-muted disabled:hover:border-admin-border ${
          compact ? 'px-3 py-2' : 'px-4 py-2.5'
        }`}
      >
        <span className={selectedOption ? 'truncate' : 'truncate text-admin-text-muted'}>
          {visibleLabel}
        </span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-admin-elevated text-admin-text-muted transition group-hover:bg-white group-hover:text-admin-text-secondary">
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {isOpen ? (
        <div
          id={`${selectId}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 z-40 mt-2 max-h-64 overflow-y-auto rounded-xl border border-admin-border bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => chooseOption(option.value)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? 'bg-admin-accent/10 font-semibold text-admin-accent'
                    : 'text-admin-text-secondary hover:bg-admin-elevated hover:text-admin-text-primary'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
