import { expect, test } from '@playwright/test';

test('admin login and product draft form flow', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
  await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
  await page.getByRole('button', { name: '登录' }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: '先处理待审核商品，再回看通知和数据' })).toBeVisible();

  await page.goto('/admin/products');
  await expect(page.getByRole('heading', { name: '商品中心' })).toBeVisible();

  await page.getByRole('link', { name: '新建商品' }).click();
  await expect(page).toHaveURL(/\/admin\/products\/new$/);
  await expect(page.getByRole('heading', { name: '手动新建商品' })).toBeVisible();
  await expect(page.getByText('基础信息')).toBeVisible();
  await expect(page.getByText('审核提示')).toBeVisible();
  await expect(page.getByRole('button', { name: '提交审核' })).toBeVisible();
});
