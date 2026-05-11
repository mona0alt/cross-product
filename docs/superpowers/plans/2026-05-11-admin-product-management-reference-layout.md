# Admin Product Management Reference Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework `/admin/products` to match the `docs/design` product management layout while keeping the existing admin shell and product data.

**Architecture:** Update `ProductCenter` as the page-level interactive workbench: left table plus right edit drawer. Keep `AdminProductsPage` lightweight and update tests to assert the new layout contract.

**Tech Stack:** React client component, Next.js App Router, Tailwind CSS, lucide-react, Vitest.

---

## Tasks

- [x] Write failing tests in `tests/unit/admin-product-center.test.tsx` for the new reference layout.
- [x] Update `tests/integration/admin-pages.test.ts` expectations for `/admin/products`.
- [x] Implement the new `ProductCenter` workbench using existing mock product data.
- [x] Keep add/edit navigation discoverable via `/admin/products/new` and selected product drawer controls.
- [x] Run `npm test tests/unit/admin-product-center.test.tsx tests/integration/admin-pages.test.ts`.
- [x] Run `npm test`, `npm run lint`, and `npm run build`.
