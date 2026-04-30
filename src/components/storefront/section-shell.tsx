import React from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type SectionShellProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  children: ReactNode;
};

export function SectionShell({
  title,
  eyebrow,
  description,
  actionLabel,
  actionHref,
  children
}: SectionShellProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="storefront-eyebrow">{eyebrow}</p> : null}
          <h2 className="storefront-section-title">{title}</h2>
          {description ? (
            <p className="storefront-section-copy">{description}</p>
          ) : null}
        </div>
        {actionLabel && actionHref ? (
          <Link href={actionHref} className="storefront-action-link">
            {actionLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
