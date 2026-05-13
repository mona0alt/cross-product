import { expect, test } from '@playwright/test';

test('storefront flow across locale, listing and detail', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/(zh-CN|en|es|pt)$/);

  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.goto('/en/products');
  await expect(page.getByRole('heading', { name: /Products|商品/ })).toBeVisible();

  const languageSelect = page.getByLabel(/Language|语言|Idioma/);
  await languageSelect.selectOption('es');
  await expect(page).toHaveURL(/\/es\/products$/);
});

test('desktop category dropdown stays open while moving pointer into the panel', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/en');

  const categoryLink = page.locator('header nav a[href*="/en/products?category="]').first();
  await categoryLink.hover();

  const dropdown = page.getByTestId('desktop-mega-menu').first();
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
  await page.mouse.move(dropdownBox.x + 24, dropdownBox.y + 24, { steps: 12 });

  await expect(dropdown).toHaveCSS('opacity', '1');
  await expect(dropdown).toHaveCSS('pointer-events', 'auto');
});
