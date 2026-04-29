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
