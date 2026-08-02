import { expect, test } from '@playwright/test';

test('desktop mega menu opens from the root category nav item and shows leaf category cards', async ({
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/zh-CN');

  const categoryLink = page.locator(
    'header nav > div:has([data-testid="desktop-mega-menu"]) > a[href="/zh-CN/categories/tech"]'
  );
  await expect(categoryLink).toContainText('科技类');

  const dropdown = categoryLink.locator(
    'xpath=following-sibling::*[@data-testid="desktop-mega-menu"]'
  );
  await categoryLink.hover();
  await expect(dropdown).toHaveCSS('opacity', '1');
  await expect(dropdown).toHaveCSS('pointer-events', 'auto');

  const leafLink = dropdown.locator('a[href="/zh-CN/categories/window-cleaning-robots"]');
  await expect(leafLink).toBeVisible();
  await expect(leafLink).toContainText('擦窗机器人');
  await expect(dropdown.locator('a[href="/zh-CN/categories/humanoid-robots"]')).toBeVisible();
  // 一级类目的 mega menu 只展示二级类目卡片，不展示商品
  await expect(dropdown.locator('a[href*="/zh-CN/products/"]')).toHaveCount(0);

  await leafLink.click();
  await expect(page).toHaveURL(/\/zh-CN\/categories\/window-cleaning-robots$/);
  // Move the pointer off the mega menu so the dropdown can settle closed;
  // while the pointer stays over the panel, group-hover keeps it visible.
  await page.mouse.move(640, 780);
  await expect(dropdown).toHaveCSS('opacity', '0');
});

test('root category page shows child category cards and no product grid', async ({ page }) => {
  await page.goto('/zh-CN');

  await page
    .locator('header nav > div:has([data-testid="desktop-mega-menu"]) > a[href="/zh-CN/categories/tech"]')
    .click();
  await expect(page).toHaveURL(/\/zh-CN\/categories\/tech$/);

  const main = page.locator('main');
  const breadcrumb = main.locator('nav[aria-label="breadcrumb"]');
  await expect(breadcrumb).toContainText('首页');
  await expect(breadcrumb).toContainText('科技类');

  for (const slug of [
    'window-cleaning-robots',
    'drones',
    'humanoid-robots',
    'robot-vacuums'
  ]) {
    await expect(main.locator(`a[href="/zh-CN/categories/${slug}"]`)).toBeVisible();
  }

  // 一级类目页只展示二级类目卡片，不直接展示商品列表
  await expect(main.locator('a[href*="/zh-CN/products/"]')).toHaveCount(0);

  await main.locator('a[href="/zh-CN/categories/window-cleaning-robots"]').click();
  await expect(page).toHaveURL(/\/zh-CN\/categories\/window-cleaning-robots$/);
});

test('leaf category page shows products and a two-level breadcrumb', async ({ page }) => {
  await page.goto('/zh-CN/categories/humanoid-robots');

  const main = page.locator('main');
  const breadcrumb = main.locator('nav[aria-label="breadcrumb"]');
  await expect(breadcrumb).toContainText('首页');
  await expect(breadcrumb).toContainText('科技类');
  await expect(breadcrumb).toContainText('人形机器人');
  await expect(breadcrumb.locator('a[href="/zh-CN/categories/tech"]')).toBeVisible();

  await expect(main.locator('a[href="/zh-CN/products/alpha-humanoid"]')).toBeVisible();
  await expect(main.locator('a[href="/zh-CN/products/edu-bot-mini"]')).toBeVisible();

  await main.locator('a[href="/zh-CN/products/alpha-humanoid"]').click();
  await expect(page).toHaveURL(/\/zh-CN\/products\/alpha-humanoid$/);
});

test('product detail breadcrumb shows the root and leaf category path', async ({ page }) => {
  await page.goto('/zh-CN/products/alpha-humanoid');

  const breadcrumb = page.locator('main nav[aria-label="breadcrumb"]');
  await expect(breadcrumb).toContainText('首页');
  await expect(breadcrumb).toContainText('Alpha Humanoid 服务机器人');

  const rootLink = breadcrumb.locator('a[href="/zh-CN/categories/tech"]');
  const leafLink = breadcrumb.locator('a[href="/zh-CN/categories/humanoid-robots"]');
  await expect(rootLink).toContainText('科技类');
  await expect(leafLink).toContainText('人形机器人');

  await leafLink.click();
  await expect(page).toHaveURL(/\/zh-CN\/categories\/humanoid-robots$/);
});
