# Homepage Product Showcase Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the storefront home page and top navigation into a UBTECH-inspired blue premium robotics showcase with no search box, product-focused image sections, and social media cards.

**Architecture:** Keep catalog data and routing unchanged. Update the shared storefront header, restyle the homepage-specific display components, and add focused homepage-only components for category cards and the product image matrix so list/detail pages are not coupled to the new layout.

**Tech Stack:** Next.js App Router, React 19 server/client components, Tailwind CSS utility classes, global CSS variables, next-intl JSON dictionaries, Vitest static rendering tests.

---

## File Structure

- Modify `src/app/globals.css`
  - Update storefront `--mk-*` tokens to the white/blue brand palette.
  - Add reusable homepage utility classes only if Tailwind class strings become too long.
- Modify `src/components/storefront/header.tsx`
  - Remove desktop and mobile search inputs.
  - Restyle top information bar, main nav, dropdown, mobile menu, and CTA links.
  - Keep category navigation, dropdowns, language switcher, WhatsApp, and Portal/Inquire entry points.
- Modify `src/components/storefront/banner-carousel.tsx`
  - Convert the existing image carousel into the new blue flagship hero.
  - Keep banner data support and empty fallback.
- Create `src/components/storefront/homepage-category-grid.tsx`
  - Render the four-category product series grid using `StorefrontCategory[]`.
- Create `src/components/storefront/homepage-product-matrix.tsx`
  - Render a product image bento matrix from up to five `StorefrontProductCard` items.
  - Hide missing slots when fewer than five products exist.
- Modify `src/components/storefront/social-showcase.tsx`
  - Restyle as blue-aligned social media cards.
  - Keep current tabs/images unless a simpler fixed four-card implementation is cheaper and still uses existing copy.
- Modify `src/app/[locale]/page.tsx`
  - Replace current offer-heavy homepage ordering with: hero, category grid, product matrix, social cards.
- Modify `messages/en.json`, `messages/zh-CN.json`, `messages/es.json`, `messages/pt.json`
  - Add section labels for hero/category/product matrix/social CTA if existing keys are insufficient.
- Modify `tests/unit/storefront-layout-shell.test.tsx`
  - Assert header no longer renders search UI and still renders required navigation functions.
- Create `tests/unit/homepage-showcase-components.test.tsx`
  - Test category grid and product matrix structure, links, and short-product fallback.
- Optional modify `tests/e2e/storefront.spec.ts`
  - Add a high-level homepage assertion if existing e2e coverage is stable and cheap.

## Task 1: Header Search Removal and Blue Navigation Contract

**Files:**
- Modify: `tests/unit/storefront-layout-shell.test.tsx`
- Modify: `src/components/storefront/header.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update the failing header test**

In `tests/unit/storefront-layout-shell.test.tsx`, rename the first test to reflect the new design and change assertions:

```tsx
it('renders the blue brand header without storefront search', () => {
  const html = renderToStaticMarkup(
    <StorefrontHeader
      locale="en"
      whatsAppNumber="+1 555 123 4567"
      categoryGroups={[/* existing fixture */]}
      copy={{/* existing copy fixture */}}
    />
  );

  expect(html).toContain('Phone sales +1 555 123 4567');
  expect(html).toContain('Language:en');
  expect(html).toContain('Floors &amp; Walls');
  expect(html).toContain('Portal');
  expect(html).toContain('WhatsApp');
  expect(html).not.toContain('Search products');
  expect(html).not.toContain('Track order');
  expect(html).not.toContain('Help Center');
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- tests/unit/storefront-layout-shell.test.tsx`

Expected: FAIL because `Search products` is still rendered by the current header and `Portal` is not yet exposed as a desktop navigation action.

- [ ] **Step 3: Update global storefront color tokens**

In `src/app/globals.css`, change only the storefront tokens, not admin tokens:

```css
:root {
  --mk-bg: #ffffff;
  --mk-bg-muted: #f6f9fd;
  --mk-surface: #ffffff;
  --mk-border: #d8e6f6;
  --mk-border-strong: #9cc9f6;
  --mk-text: #0b1f3a;
  --mk-text-muted: #54708f;
  --mk-accent: #1d7eea;
  --mk-highlight: #0f63ce;
  --mk-success: #127c49;
  --mk-radius-sm: 0.25rem;
  --mk-radius-md: 0.5rem;
  --mk-radius-lg: 0.75rem;
}
```

- [ ] **Step 4: Refactor `StorefrontHeader`**

In `src/components/storefront/header.tsx`:

- Remove the `SearchIcon` function if it becomes unused.
- Remove both search input blocks.
- Replace black top bar with a shallow blue information bar.
- Add desktop Portal and WhatsApp/Inquire style links on the right.
- Keep mobile phone/WhatsApp icon and menu toggle.
- Keep category dropdown behavior.

Required behavior:

```tsx
<header className="sticky top-0 z-30 border-b border-[var(--mk-border)] bg-white/95 backdrop-blur">
  <div className="bg-[#f0f6fd] text-[var(--mk-text-muted)]">
    {/* topLinks + phoneSales */}
  </div>
  <div className="mk-container flex items-center gap-4 py-4">
    {/* mobile menu, logo, category nav on desktop, language, Portal, WhatsApp CTA */}
  </div>
</header>
```

Do not add a search icon replacement. The design decision is no search entry.

- [ ] **Step 5: Run focused test and lint**

Run:

```bash
npm test -- tests/unit/storefront-layout-shell.test.tsx
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/storefront/header.tsx tests/unit/storefront-layout-shell.test.tsx
git commit -m "feat: restyle storefront header without search"
```

## Task 2: Blue Flagship Hero

**Files:**
- Modify: `src/components/storefront/banner-carousel.tsx`
- Modify: `messages/en.json`
- Modify: `messages/zh-CN.json`
- Modify: `messages/es.json`
- Modify: `messages/pt.json`
- Test: optionally extend `tests/unit/homepage-showcase-components.test.tsx` after creating it in Task 3

- [ ] **Step 1: Add or reuse hero copy keys**

If existing `Storefront.home` copy is acceptable, update the values in all four dictionaries to robotics-specific text.

Example `messages/en.json`:

```json
"home": {
  "eyebrow": "AI ROBOTICS SHOWCASE",
  "title": "Premium robotics for modern work",
  "description": "Explore intelligent robots, drones and automation products built for global partners.",
  "primaryCta": "Browse Products",
  "secondaryCta": "Contact Us"
}
```

Keep equivalent localized values in `zh-CN`, `es`, and `pt`.

- [ ] **Step 2: Update `BannerCarousel` API**

Change `BannerCarousel` props to accept hero copy and locale-aware CTA hrefs:

```tsx
export function BannerCarousel({
  banners,
  emptyLabel,
  copy,
  primaryHref,
  secondaryHref
}: {
  banners: BannerItem[];
  emptyLabel: string;
  copy: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  primaryHref: string;
  secondaryHref: string;
}) { /* ... */ }
```

- [ ] **Step 3: Implement blue hero layout**

Inside `BannerCarousel`:

- Use a dark-to-bright blue gradient background.
- Render text on the left.
- Render the active banner image on the right in a polished image frame.
- If no banners exist, keep text and render the `emptyLabel` in the image frame.
- Keep dot controls if more than one banner exists.

Use `next/link` for CTA links:

```tsx
<Link href={primaryHref} className="... bg-white text-[#123b73] ...">
  {copy.primaryCta}
</Link>
<Link href={secondaryHref} className="... border border-white/70 text-white ...">
  {copy.secondaryCta}
</Link>
```

- [ ] **Step 4: Update home page call site**

In `src/app/[locale]/page.tsx`, pass:

```tsx
<BannerCarousel
  banners={payload.banners}
  emptyLabel={Storefront.banner.empty}
  copy={Storefront.home}
  primaryHref={`/${locale}/products`}
  secondaryHref={`/${locale}/contact`}
/>
```

- [ ] **Step 5: Run checks**

Run:

```bash
npm test -- tests/unit/home-page.test.tsx
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/storefront/banner-carousel.tsx src/app/[locale]/page.tsx messages/en.json messages/zh-CN.json messages/es.json messages/pt.json
git commit -m "feat: add blue flagship storefront hero"
```

## Task 3: Homepage Category Grid

**Files:**
- Create: `src/components/storefront/homepage-category-grid.tsx`
- Create: `tests/unit/homepage-showcase-components.test.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/zh-CN.json`
- Modify: `messages/es.json`
- Modify: `messages/pt.json`

- [ ] **Step 1: Write failing tests for category grid**

Create `tests/unit/homepage-showcase-components.test.tsx`:

```tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { HomepageCategoryGrid } from '@/components/storefront/homepage-category-grid';

const categories = [
  {
    id: 'cat-1',
    slug: 'humanoids',
    iconImageUrl: '/show/robot_humanoid.png',
    name: 'Humanoids',
    description: 'Human-centered robots'
  },
  {
    id: 'cat-2',
    slug: 'drones',
    iconImageUrl: '/show/robot_drone.png',
    name: 'Drones',
    description: 'Flying robots'
  }
];

describe('homepage showcase components', () => {
  it('renders category cards linked to product filters', () => {
    const html = renderToStaticMarkup(
      <HomepageCategoryGrid
        locale="en"
        title="Product Series"
        categories={categories}
      />
    );

    expect(html).toContain('Product Series');
    expect(html).toContain('Humanoids');
    expect(html).toContain('/en/products?category=humanoids');
    expect(html).toContain('/show/robot_humanoid.png');
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm test -- tests/unit/homepage-showcase-components.test.tsx`

Expected: FAIL because `HomepageCategoryGrid` does not exist.

- [ ] **Step 3: Implement `HomepageCategoryGrid`**

Create `src/components/storefront/homepage-category-grid.tsx`:

```tsx
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { StorefrontCategory } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function HomepageCategoryGrid({
  locale,
  title,
  categories
}: {
  locale: Locale;
  title: string;
  categories: StorefrontCategory[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mk-container">
        <h2 className="text-center text-2xl font-bold text-[var(--mk-text)]">
          {title}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/products?category=${category.slug}`}
              className="group rounded-xl border border-[var(--mk-border)] bg-white p-3 shadow-[0_14px_36px_rgba(29,126,234,0.07)] transition hover:-translate-y-1 hover:border-[var(--mk-border-strong)]"
            >
              {category.iconImageUrl ? (
                <img
                  src={category.iconImageUrl}
                  alt={category.name}
                  className="aspect-[4/3] w-full rounded-lg bg-[var(--mk-bg-muted)] object-cover"
                />
              ) : null}
              <h3 className="mt-3 text-center text-base font-semibold text-[var(--mk-text)]">
                {category.name}
              </h3>
              {category.description ? (
                <p className="mt-1 line-clamp-2 text-center text-xs text-[var(--mk-text-muted)]">
                  {category.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add section copy and call from home page**

Add dictionary key if needed:

```json
"sections": {
  "productSeries": "Product Series"
}
```

Then in `src/app/[locale]/page.tsx`:

```tsx
<HomepageCategoryGrid
  locale={locale}
  title={Storefront.sections.productSeries}
  categories={payload.featuredCategories}
/>
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- tests/unit/homepage-showcase-components.test.tsx
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/storefront/homepage-category-grid.tsx tests/unit/homepage-showcase-components.test.tsx src/app/[locale]/page.tsx messages/en.json messages/zh-CN.json messages/es.json messages/pt.json
git commit -m "feat: add homepage product series grid"
```

## Task 4: Product Image Matrix

**Files:**
- Create: `src/components/storefront/homepage-product-matrix.tsx`
- Modify: `tests/unit/homepage-showcase-components.test.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/zh-CN.json`
- Modify: `messages/es.json`
- Modify: `messages/pt.json`

- [ ] **Step 1: Add failing product matrix tests**

Extend `tests/unit/homepage-showcase-components.test.tsx`:

```tsx
import { HomepageProductMatrix } from '@/components/storefront/homepage-product-matrix';

const products = [
  {
    id: 'product-1',
    slug: 'alpha',
    productCode: 'A-1',
    coverImageUrl: '/show/robot_humanoid.png',
    priceUsd: 100,
    isRecommended: true,
    name: 'Alpha Robot',
    intro: 'Intro',
    detail: 'Detail',
    images: [],
    category: { slug: 'humanoids', name: 'Humanoids' }
  },
  {
    id: 'product-2',
    slug: 'drone',
    productCode: 'D-1',
    coverImageUrl: '/show/robot_drone.png',
    priceUsd: 200,
    isRecommended: true,
    name: 'Drone Robot',
    intro: 'Intro',
    detail: 'Detail',
    images: [],
    category: { slug: 'drones', name: 'Drones' }
  }
];

it('renders a product image matrix without empty placeholders', () => {
  const html = renderToStaticMarkup(
    <HomepageProductMatrix
      locale="en"
      eyebrow="Product Gallery"
      title="More Product Images"
      viewAllLabel="View all"
      products={products}
    />
  );

  expect(html).toContain('More Product Images');
  expect(html).toContain('/en/products/alpha');
  expect(html).toContain('/show/robot_drone.png');
  expect(html).not.toContain('empty-slot');
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm test -- tests/unit/homepage-showcase-components.test.tsx`

Expected: FAIL because `HomepageProductMatrix` does not exist.

- [ ] **Step 3: Implement `HomepageProductMatrix`**

Create `src/components/storefront/homepage-product-matrix.tsx`:

```tsx
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import type { StorefrontProductCard } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function HomepageProductMatrix({
  locale,
  eyebrow,
  title,
  viewAllLabel,
  products
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  viewAllLabel: string;
  products: StorefrontProductCard[];
}) {
  const visibleProducts = products.slice(0, 5);
  if (visibleProducts.length === 0) return null;

  return (
    <section className="bg-[var(--mk-bg-muted)] py-10 sm:py-12">
      <div className="mk-container">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--mk-accent)]">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--mk-text)]">
              {title}
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="rounded-full border border-[var(--mk-accent)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--mk-accent)]"
          >
            {viewAllLabel}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {visibleProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className={`group overflow-hidden rounded-xl border border-[var(--mk-border)] bg-white ${
                index === 0 ? 'md:row-span-2' : ''
              }`}
            >
              <img
                src={product.coverImageUrl}
                alt={product.name}
                className={`w-full object-cover transition duration-300 group-hover:scale-105 ${
                  index === 0 ? 'h-full min-h-[280px]' : 'h-44'
                }`}
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[var(--mk-text)]">
                  {product.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add dictionary labels and call from home page**

Add section labels in all dictionaries:

```json
"productGalleryEyebrow": "PRODUCT GALLERY",
"productGallery": "More Product Images",
"viewAll": "VIEW ALL"
```

Then in `src/app/[locale]/page.tsx`:

```tsx
<HomepageProductMatrix
  locale={locale}
  eyebrow={Storefront.sections.productGalleryEyebrow}
  title={Storefront.sections.productGallery}
  viewAllLabel={Storefront.sections.viewAll}
  products={payload.recommendedProducts}
/>
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- tests/unit/homepage-showcase-components.test.tsx
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/storefront/homepage-product-matrix.tsx tests/unit/homepage-showcase-components.test.tsx src/app/[locale]/page.tsx messages/en.json messages/zh-CN.json messages/es.json messages/pt.json
git commit -m "feat: add homepage product image matrix"
```

## Task 5: Social Media Card Restyle

**Files:**
- Modify: `src/components/storefront/social-showcase.tsx`
- Modify: `tests/unit/homepage-showcase-components.test.tsx` or create focused test if needed

- [ ] **Step 1: Add a social showcase rendering test**

Extend `tests/unit/homepage-showcase-components.test.tsx`:

```tsx
import { SocialShowcase } from '@/components/storefront/social-showcase';

it('renders social media cards with platform tabs', () => {
  const html = renderToStaticMarkup(
    <SocialShowcase
      copy={{
        title: 'Social Media',
        handle: '@fbgm_robotics',
        tabs: {
          windowRobots: 'Window Robots',
          drones: 'Drones',
          humanoidRobots: 'Humanoids',
          vacuumRobots: 'Vacuum Robots',
          scenes: 'Scenes'
        }
      }}
    />
  );

  expect(html).toContain('Social Media');
  expect(html).toContain('@fbgm_robotics');
  expect(html).toContain('Window Robots');
});
```

- [ ] **Step 2: Run test before implementation**

Run: `npm test -- tests/unit/homepage-showcase-components.test.tsx`

Expected: PASS before styling changes. This establishes a regression guard.

- [ ] **Step 3: Restyle `SocialShowcase`**

In `src/components/storefront/social-showcase.tsx`:

- Keep existing image sources and active tab behavior.
- Change section background to white.
- Add blue eyebrow text.
- Render four image cards in a compact grid.
- Use dark/blue gradient overlay for text readability.
- Keep arrow buttons if scrolling remains; if not currently functional, keep visual buttons only if they do not imply broken behavior.

Do not introduce application-scenario copy. This is social media content only.

- [ ] **Step 4: Run tests and lint**

Run:

```bash
npm test -- tests/unit/homepage-showcase-components.test.tsx
npm run lint
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/storefront/social-showcase.tsx tests/unit/homepage-showcase-components.test.tsx
git commit -m "feat: restyle homepage social media cards"
```

## Task 6: Home Page Composition Cleanup

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Optionally modify: `src/components/storefront/product-carousel.tsx`, `src/components/storefront/product-card.tsx`, `src/components/storefront/catalog-carousel.tsx`

- [ ] **Step 1: Remove old offer-heavy homepage sections**

In `src/app/[locale]/page.tsx`, remove:

- Simulated discounts block.
- First `ProductCarousel` offers section.
- Second `ProductCarousel` featured section.
- Wide banner section.
- `CatalogCarousel` section.

Keep:

- `BannerCarousel`
- `HomepageCategoryGrid`
- `HomepageProductMatrix`
- `SocialShowcase`

Expected final structure:

```tsx
return (
  <div>
    <BannerCarousel ... />
    <HomepageCategoryGrid ... />
    <HomepageProductMatrix ... />
    <SocialShowcase copy={Storefront.socialShowcase} />
  </div>
);
```

- [ ] **Step 2: Remove unused imports**

Remove unused imports from `src/app/[locale]/page.tsx`:

```tsx
import { CatalogCarousel } from '@/components/storefront/catalog-carousel';
import { ProductCarousel } from '@/components/storefront/product-carousel';
```

Keep or add:

```tsx
import { HomepageCategoryGrid } from '@/components/storefront/homepage-category-grid';
import { HomepageProductMatrix } from '@/components/storefront/homepage-product-matrix';
```

- [ ] **Step 3: Run full unit tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 4: Run lint**

Run: `npm run lint`

Expected: PASS with no unused imports.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: compose product-focused storefront homepage"
```

## Task 7: Responsive and Visual Verification

**Files:**
- Modify only files needed to fix verification issues.

- [ ] **Step 1: Start the development server**

Run: `npm run dev`

Expected: Next.js dev server starts successfully. If port 3000 is occupied, use `npm run dev -- -p 3001`.

- [ ] **Step 2: Manually verify desktop**

Open `http://localhost:3000/zh-CN`.

Verify:

- Header has no search box.
- Category nav, language switcher, WhatsApp/Portal/Inquire entries are visible.
- Blue flagship hero renders.
- Series products render.
- More product image matrix renders.
- Social media cards render.
- No application-scenario matrix appears.

- [ ] **Step 3: Manually verify mobile**

Use browser responsive mode around 390px wide.

Verify:

- Header does not overflow horizontally.
- Mobile menu opens.
- No mobile search field appears.
- Hero text and image do not overlap.
- Product matrix cards remain legible.
- Social cards are usable.

- [ ] **Step 4: Run e2e smoke tests if dev server is compatible**

Run: `npm run test:e2e -- tests/e2e/storefront.spec.ts`

Expected: PASS. If the existing e2e setup expects a specific server command, follow the project’s current Playwright config.

- [ ] **Step 5: Fix issues and rerun checks**

For any layout/test issue:

```bash
npm test
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Final commit**

If verification fixes were required:

```bash
git add <changed-files>
git commit -m "fix: polish responsive storefront showcase"
```

If no fixes were required, no commit is needed.

## Final Acceptance Checklist

- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] Header contains no search box on desktop or mobile.
- [ ] Header retains category navigation, dropdowns, language switcher, WhatsApp/Portal/Inquire entry points.
- [ ] Homepage order is hero, series products, product image matrix, social media cards.
- [ ] Product image matrix uses product images only and adapts when fewer than five products exist.
- [ ] Social media cards remain visible.
- [ ] No application-scenario matrix or copy is present.
- [ ] Mobile and desktop layouts have no obvious overlap or horizontal overflow.
