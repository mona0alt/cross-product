# Admin Configurable Storefront Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a usable admin configuration loop for storefront banners, product details, image uploads, and admin UI localization.

**Architecture:** Reuse the existing Prisma `Banner`, `Category`, `Product`, and `ProductImage` models. Add local disk upload helpers and an authenticated upload route, wire existing admin forms to server actions, and introduce cookie-driven admin dictionaries without changing `/admin` routing.

**Tech Stack:** Next.js App Router, React server/client components, Prisma, PostgreSQL, Vitest, Tailwind CSS, `messages/*.json` dictionaries.

---

## File Structure

- Create: `src/lib/admin-i18n.ts`
  - Reads `ADMIN_LOCALE` from cookies, validates locale, and returns the `Admin` dictionary.
- Create: `src/features/admin/upload-storage.ts`
  - Validates image MIME/size and writes uploads under `public/uploads`.
- Create: `src/app/api/admin/uploads/product-images/route.ts`
  - Authenticated multipart upload endpoint for product and banner images.
- Create: `src/components/admin/admin-language-switcher.tsx`
  - Client-side language selector for the admin header.
- Modify: `messages/zh-CN.json`, `messages/en.json`, `messages/es.json`, `messages/pt.json`
  - Add `Admin` dictionaries for nav, common labels, login, banners, products, uploads.
- Modify: `src/app/admin/(protected)/layout.tsx`
  - Load admin dictionary and pass localized nav/header copy.
- Modify: `src/components/admin/admin-nav.tsx`
  - Keep rendering generic labels from props.
- Modify: `src/components/admin/admin-shell-header.tsx`
  - Render localized role/logout labels and language switcher.
- Modify: `src/app/admin/login/page.tsx`
  - Use a client dictionary map for login copy based on `ADMIN_LOCALE`.
- Modify: `src/features/admin/product-actions.ts`
  - Add form actions for create/update and transactional image replacement.
- Modify: `src/features/admin/banner-actions.ts`
  - Add form actions for create/update/toggle from form data.
- Modify: `src/components/admin/product-form.tsx`
  - Convert static form to real server-action form with upload controls.
- Modify: `src/components/admin/banner-form.tsx`
  - Convert static form to real server-action form with upload controls.
- Modify: `src/app/admin/(protected)/products/new/page.tsx`
  - Pass admin dictionary to product form.
- Modify: `src/app/admin/(protected)/products/[id]/page.tsx`
  - Pass admin dictionary and existing product images to product form.
- Modify: `src/app/admin/(protected)/banners/page.tsx`
  - Pass admin dictionary to banner form.
- Test: `tests/integration/admin-actions.test.ts`
  - Cover form actions and product gallery replacement.
- Test: `tests/integration/admin-upload.test.ts`
  - Cover upload route auth and file validation.
- Test: `tests/unit/admin-i18n.test.ts`
  - Cover admin locale fallback and dictionary loading.
- Test: `tests/integration/admin-pages.test.ts`
  - Cover localized admin layout/page text.

## Task 1: Admin Dictionary And Locale Plumbing

**Files:**
- Create: `src/lib/admin-i18n.ts`
- Create: `src/components/admin/admin-language-switcher.tsx`
- Modify: `messages/zh-CN.json`
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `messages/pt.json`
- Modify: `src/app/admin/(protected)/layout.tsx`
- Modify: `src/components/admin/admin-shell-header.tsx`
- Test: `tests/unit/admin-i18n.test.ts`

- [ ] **Step 1: Write failing admin i18n tests**

```ts
import { describe, expect, it, vi } from 'vitest';

const cookieStore = vi.fn();

vi.mock('next/headers', () => ({
  cookies: cookieStore
}));

describe('admin i18n', () => {
  it('falls back to zh-CN for unsupported admin locale cookies', async () => {
    cookieStore.mockResolvedValue({
      get: () => ({ value: 'fr' })
    });

    const { getAdminLocale } = await import('@/lib/admin-i18n');

    await expect(getAdminLocale()).resolves.toBe('zh-CN');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/unit/admin-i18n.test.ts`

Expected: FAIL because `@/lib/admin-i18n` does not exist.

- [ ] **Step 3: Implement admin i18n helper and dictionary keys**

Create `getAdminLocale()` and `getAdminDictionary()` using `cookies()` and existing `getDictionary(locale)`. Add `Admin` sections to all message files.

- [ ] **Step 4: Wire protected admin layout and header**

Load `dictionary.Admin` in protected layout, build localized nav items, pass localized header copy and locale to `AdminShellHeader`, and render `AdminLanguageSwitcher`.

- [ ] **Step 5: Run focused tests**

Run: `npm test tests/unit/admin-i18n.test.ts tests/integration/admin-pages.test.ts`

Expected: PASS for admin i18n and existing admin page render tests after expectations are updated where necessary.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/lib/admin-i18n.ts src/components/admin/admin-language-switcher.tsx src/app/admin/'(protected)'/layout.tsx src/components/admin/admin-shell-header.tsx messages/zh-CN.json messages/en.json messages/es.json messages/pt.json tests/unit/admin-i18n.test.ts tests/integration/admin-pages.test.ts
git commit -m "feat: localize admin shell"
```

## Task 2: Local Disk Upload Endpoint

**Files:**
- Create: `src/features/admin/upload-storage.ts`
- Create: `src/app/api/admin/uploads/product-images/route.ts`
- Test: `tests/integration/admin-upload.test.ts`

- [ ] **Step 1: Write failing upload route tests**

Tests should mock `requireAdminSession`, send `FormData` with `File`, and assert:

- unauthenticated request returns `401`
- text file returns `400` with `UNSUPPORTED_FILE_TYPE`
- valid PNG returns `200` with `/uploads/products/` URL

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/integration/admin-upload.test.ts`

Expected: FAIL because upload route does not exist.

- [ ] **Step 3: Implement storage helper**

Implement:

- `MAX_UPLOAD_BYTES = 5 * 1024 * 1024`
- `SUPPORTED_IMAGE_TYPES`
- `validateAdminImageFile(file)`
- `saveAdminImageUpload(file, scope)`

Use `arrayBuffer()`, `crypto.randomUUID()`, `fs/promises.mkdir`, and `fs/promises.writeFile`.

- [ ] **Step 4: Implement route**

Use `requireAdminSession()`, parse multipart `request.formData()`, validate `scope`, call storage helper, and return stable JSON errors.

- [ ] **Step 5: Run focused tests**

Run: `npm test tests/integration/admin-upload.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/features/admin/upload-storage.ts src/app/api/admin/uploads/product-images/route.ts tests/integration/admin-upload.test.ts
git commit -m "feat: add admin image upload endpoint"
```

## Task 3: Product Form Actions And Gallery Persistence

**Files:**
- Modify: `src/features/admin/product-actions.ts`
- Modify: `src/components/admin/product-form.tsx`
- Modify: `src/app/admin/(protected)/products/new/page.tsx`
- Modify: `src/app/admin/(protected)/products/[id]/page.tsx`
- Test: `tests/integration/admin-actions.test.ts`

- [ ] **Step 1: Write failing product action tests**

Add tests for:

- `createProductFromForm(formData)` creates a draft product with four-language fields.
- `updateProductFromForm(id, formData)` updates product fields and replaces `ProductImage` rows in sort order.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/integration/admin-actions.test.ts`

Expected: FAIL because form actions do not exist.

- [ ] **Step 3: Implement form parsing helpers**

Parse strings, booleans, numbers, status, and gallery URL lines from `FormData`. Normalize blank optional fields to `null` where Prisma expects nullable strings.

- [ ] **Step 4: Implement create and update actions**

Use `db.product.create()` for creation. Use `db.$transaction()` for update, deleting existing `ProductImage` rows and recreating submitted URLs with `sortOrder`.

- [ ] **Step 5: Wire `ProductForm`**

Set `name` attributes, `action`, hidden gallery URL textarea, upload buttons, and localized labels. Keep manual URL entry available.

- [ ] **Step 6: Pass dictionaries and images from pages**

Load `getAdminDictionary()` in product pages, pass copy and current images to `ProductForm`.

- [ ] **Step 7: Run focused tests**

Run: `npm test tests/integration/admin-actions.test.ts tests/integration/admin-pages.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```bash
git add src/features/admin/product-actions.ts src/components/admin/product-form.tsx src/app/admin/'(protected)'/products/new/page.tsx src/app/admin/'(protected)'/products/'[id]'/page.tsx tests/integration/admin-actions.test.ts tests/integration/admin-pages.test.ts
git commit -m "feat: persist admin product forms"
```

## Task 4: Banner Form Actions And Upload Wiring

**Files:**
- Modify: `src/features/admin/banner-actions.ts`
- Modify: `src/components/admin/banner-form.tsx`
- Modify: `src/app/admin/(protected)/banners/page.tsx`
- Test: `tests/integration/admin-actions.test.ts`

- [ ] **Step 1: Write failing banner action tests**

Add tests for `createBannerFromForm(formData)` and `updateBannerFromForm(id, formData)` parsing image URL, target fields, sorting, and active state.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/integration/admin-actions.test.ts`

Expected: FAIL because form actions do not exist.

- [ ] **Step 3: Implement banner form actions**

Parse target type, target ID/URL, sort order, and active checkbox. Use existing `createBanner()` and `updateBanner()` internally where possible.

- [ ] **Step 4: Wire `BannerForm`**

Set form actions, field names, upload button with `scope=banner`, localized copy, and inline edit rows or per-row edit forms.

- [ ] **Step 5: Pass dictionary from banners page**

Load `getAdminDictionary()` and pass `dictionary.Admin.banners` plus common labels to `BannerForm`.

- [ ] **Step 6: Run focused tests**

Run: `npm test tests/integration/admin-actions.test.ts tests/integration/admin-pages.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/features/admin/banner-actions.ts src/components/admin/banner-form.tsx src/app/admin/'(protected)'/banners/page.tsx tests/integration/admin-actions.test.ts tests/integration/admin-pages.test.ts
git commit -m "feat: persist admin banner forms"
```

## Task 5: Verification And Build Check

**Files:**
- Potentially modify tests updated by earlier tasks.

- [ ] **Step 1: Run full unit/integration suite**

Run: `npm test`

Expected: all non-e2e Vitest tests pass.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: no ESLint errors or warnings.

- [ ] **Step 3: Run build if lint and tests pass**

Run: `npm run build`

Expected: production build completes.

- [ ] **Step 4: Inspect git diff**

Run: `git status --short` and `git diff --stat HEAD`

Expected: only intended files changed plus pre-existing unrelated user changes still untouched.

- [ ] **Step 5: Final commit if needed**

If verification fixes were required, commit them with:

```bash
git add <changed-files>
git commit -m "test: verify admin content management"
```
