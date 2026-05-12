# Real Product Category Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make admin product and category management use real database data, with storefront category and product displays staying aligned with backend settings.

**Architecture:** Reuse the existing Prisma `Category`, `Product`, and `ProductImage` models. Convert admin pages from mock/static data to server-side catalog queries and server actions, while keeping existing product create/edit routes as the write path.

**Tech Stack:** Next.js App Router, React Server Components, Prisma, Vitest, TypeScript.

---

### Task 1: Admin Product Center Real Data

**Files:**
- Modify: `src/app/admin/(protected)/products/page.tsx`
- Modify: `src/components/admin/product-center.tsx`
- Test: `tests/unit/admin-product-center.test.tsx`
- Test: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Write failing tests**
  - Update `admin-product-center.test.tsx` to pass explicit robot categories and product rows.
  - Assert no hardcoded categories such as `智能穿戴设备` render.
  - Assert add/edit links point to `/admin/products/new` and `/admin/products/<id>`.
  - Update `admin-pages.test.ts` so product page mocks `getAdminProductList()` and `getAdminCategoryTree()` and expects robot categories.

- [ ] **Step 2: Verify tests fail**
  - Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/integration/admin-pages.test.ts`
  - Expected: FAIL because product page still imports mock data and `ProductCenter` still hardcodes category UI.

- [ ] **Step 3: Implement real data mapping**
  - Make `/admin/products` async.
  - Fetch `getAdminProductList({})` and `getAdminCategoryTree()`.
  - Map Prisma products into a small `ProductCenterRow`.
  - Pass rows and category tree into `ProductCenter`.
  - Remove static `productCategories` and `categoryOptions` from `ProductCenter`.
  - Render empty states when categories or products are empty.

- [ ] **Step 4: Verify tests pass**
  - Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/integration/admin-pages.test.ts`
  - Expected: PASS.

### Task 2: Category Form Persistence

**Files:**
- Modify: `src/features/admin/category-actions.ts`
- Modify: `src/components/admin/category-form.tsx`
- Modify: `src/app/admin/(protected)/categories/page.tsx`
- Test: `tests/integration/admin-actions.test.ts`
- Test: `tests/integration/admin-pages.test.ts`

- [ ] **Step 1: Write failing tests**
  - Add action tests for `createCategoryFromForm()` and `updateCategoryFromForm()`.
  - Add category page assertions for real robot category names, slug input, active checkbox, and submit buttons.

- [ ] **Step 2: Verify tests fail**
  - Run: `npm test -- tests/integration/admin-actions.test.ts tests/integration/admin-pages.test.ts`
  - Expected: FAIL because form actions do not exist and category page remains static.

- [ ] **Step 3: Implement category actions and form**
  - Add helpers to parse category `FormData`.
  - Add `createCategoryFromForm(formData)`.
  - Add `updateCategoryFromForm(id, formData)`.
  - Render a create form plus update forms for existing categories.
  - Remove unrelated database configuration placeholder fields.

- [ ] **Step 4: Verify tests pass**
  - Run: `npm test -- tests/integration/admin-actions.test.ts tests/integration/admin-pages.test.ts`
  - Expected: PASS.

### Task 3: Default Robot Categories

**Files:**
- Modify: `prisma/seed.ts`
- Test: `tests/integration/catalog-query.test.ts` or a focused seed/static assertion if needed.

- [ ] **Step 1: Write failing test or static assertion**
  - Assert the canonical root category slugs/names are present: `humanoid-robots`, `drones`, `robot-vacuums`, `window-cleaning-robots`.

- [ ] **Step 2: Verify test fails if current seed differs**
  - Run the focused test.

- [ ] **Step 3: Adjust seed data**
  - Keep four root categories as the canonical public categories.
  - Attach existing products directly to these categories or update product category slugs accordingly.

- [ ] **Step 4: Final verification**
  - Run: `npm test -- tests/unit/admin-product-center.test.tsx tests/integration/admin-actions.test.ts tests/integration/admin-pages.test.ts tests/integration/catalog-query.test.ts`
  - Expected: PASS.
