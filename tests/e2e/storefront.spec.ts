import { expect, test } from '@playwright/test';

test('storefront flow across locale, listing and detail', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/(zh-CN|en|es|pt)$/);

  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.goto('/en/products');
  await expect(page.locator('main')).toBeVisible();

  await page.getByTestId('language-switcher-trigger').click();
  await page.getByRole('option', { name: /Español/ }).click();
  await expect(page).toHaveURL(/\/es\/products$/);
});

test('desktop category dropdown stays open while moving pointer into the panel', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/en');

  const categoryLink = page
    .locator('header nav > div:has([data-testid="desktop-mega-menu"]) > a[href*="/en/categories/"]')
    .first();
  const dropdown = categoryLink.locator('xpath=following-sibling::*[@data-testid="desktop-mega-menu"]').first();
  await categoryLink.hover();

  await expect(dropdown).toHaveCSS('opacity', '1');
  await expect(dropdown).toHaveCSS('pointer-events', 'auto');

  const linkBox = await categoryLink.boundingBox();
  const dropdownBox = await dropdown.boundingBox();

  expect(linkBox).not.toBeNull();
  expect(dropdownBox).not.toBeNull();

  if (!linkBox || !dropdownBox) {
    return;
  }

  await page.mouse.move(linkBox.x + linkBox.width / 2, linkBox.y + linkBox.height / 2);
  // Move straight down from the nav link into the panel: the full-width mega
  // menu extends past the viewport edge, and diagonal shortcuts that leave the
  // header bounds close the dropdown before the pointer reaches the panel.
  await page.mouse.move(linkBox.x + linkBox.width / 2, dropdownBox.y + 100, { steps: 12 });

  await expect(dropdown).toHaveCSS('opacity', '1');
  await expect(dropdown).toHaveCSS('pointer-events', 'auto');
});

test('desktop category dropdown closes after choosing a product', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/en');

  const categoryLink = page
    .locator('header nav > div:has([data-testid="desktop-mega-menu"]) > a[href*="/en/categories/"]')
    .first();
  const dropdown = categoryLink.locator('xpath=following-sibling::*[@data-testid="desktop-mega-menu"]').first();

  await categoryLink.hover();
  await expect(dropdown).toHaveCSS('opacity', '1');

  await dropdown.locator('a[href*="/en/products/"]').first().click();
  await expect(page).toHaveURL(/\/en\/products\/[^/?#]+$/);
  // Move the pointer off the mega menu so the dropdown can settle closed;
  // while the pointer stays over the panel, group-hover keeps it visible.
  await page.mouse.move(640, 780);
  await expect(dropdown).toHaveCSS('opacity', '0');
  await expect(dropdown).toHaveCSS('visibility', 'hidden');

  await page.mouse.move(20, 500);
  await categoryLink.hover();
  await expect(dropdown).toHaveCSS('opacity', '1');

  const secondProduct = dropdown.locator('a[href*="/en/products/"]').nth(1);
  const secondHref = await secondProduct.getAttribute('href');
  expect(secondHref).toBeTruthy();

  await secondProduct.click();
  await expect(page).toHaveURL(new RegExp(`${secondHref?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  await page.mouse.move(640, 780);
  await expect(dropdown).toHaveCSS('opacity', '0');
  await expect(dropdown).toHaveCSS('visibility', 'hidden');
});

test('desktop category navigation is clamped between logo and contact controls', async ({ page }) => {
  for (const width of [1024, 1440, 1800, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/zh-CN');

    const header = page.locator('header').first();
    const logo = header.locator('a:has(img)').first();
    const nav = header.locator('nav').first();
    const navLinks = nav.locator('a[href*="/zh-CN/categories/"]');
    const emailLink = header.locator('a[href="/zh-CN/subscribe"]').first();
    const languageTrigger = header.getByTestId('language-switcher-trigger');

    await expect(navLinks.first()).toBeVisible();
    await expect(emailLink).toBeVisible();
    await expect(languageTrigger).toBeVisible();

    const logoBox = await logo.boundingBox();
    const navBox = await nav.boundingBox();
    const firstCategoryBox = await navLinks.first().boundingBox();
    const lastCategoryBox = await navLinks.last().boundingBox();
    const emailBox = await emailLink.boundingBox();
    const languageBox = await languageTrigger.boundingBox();

    expect(logoBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(firstCategoryBox).not.toBeNull();
    expect(lastCategoryBox).not.toBeNull();
    expect(emailBox).not.toBeNull();
    expect(languageBox).not.toBeNull();

    if (!logoBox || !navBox || !firstCategoryBox || !lastCategoryBox || !emailBox || !languageBox) {
      return;
    }

    const minimumGap = 0;
    const maximumGap = width === 1024 ? 24 : 32;
    const logoToFirstCategoryGap = firstCategoryBox.x - (logoBox.x + logoBox.width);
    const lastCategoryToEmailGap = emailBox.x - (lastCategoryBox.x + lastCategoryBox.width);

    expect(logoToFirstCategoryGap, `logo to first category gap at ${width}px`).toBeGreaterThanOrEqual(minimumGap);
    expect(logoToFirstCategoryGap, `logo to first category gap at ${width}px`).toBeLessThanOrEqual(maximumGap);
    expect(lastCategoryToEmailGap, `last category to email gap at ${width}px`).toBeGreaterThanOrEqual(minimumGap);
    expect(lastCategoryToEmailGap, `last category to email gap at ${width}px`).toBeLessThanOrEqual(maximumGap);
    expect(navBox.x, `nav left at ${width}px`).toBeGreaterThanOrEqual(logoBox.x + logoBox.width);
    expect(navBox.x + navBox.width, `nav right at ${width}px`).toBeLessThanOrEqual(emailBox.x);
  }
});
