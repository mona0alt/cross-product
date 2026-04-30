import React from 'react';
import Link from 'next/link';

type QuickLinkItem = {
  href: string;
  label: string;
};

export function QuickLinksRow({ items }: { items: QuickLinkItem[] }) {
  return (
    <div className="border-b border-[var(--store-border)] bg-white/88 backdrop-blur">
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-full border border-[var(--store-border)] bg-[var(--store-surface-muted)] px-4 py-2 text-sm font-medium text-[var(--store-accent)] transition hover:border-[var(--store-border-strong)] hover:bg-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
