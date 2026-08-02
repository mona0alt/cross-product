import { expect, test } from '@playwright/test';

test('category editor parent dropdown only offers root categories', async ({ page, baseURL }) => {
  // The admin UI renders in the ADMIN_LOCALE cookie locale (default: es);
  // pin it to zh-CN so the Chinese labels below are deterministic.
  await page
    .context()
    .addCookies([{ name: 'ADMIN_LOCALE', value: 'zh-CN', url: baseURL ?? 'http://127.0.0.1:3000' }]);

  await page.goto('/admin/login');
  await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
  await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);

  await page.goto('/admin/products');
  await page.getByRole('button', { name: '添加类目' }).click();
  const drawer = page.getByRole('dialog', { name: '新建类目' });
  await expect(drawer).toBeVisible();

  await drawer.getByRole('button', { name: '一级类目' }).click();
  const parentOptions = drawer.getByRole('listbox').getByRole('option');

  // 只能选“一级类目”（新建根）或现有根类目，二级类目不可作为父级，
  // 因此无法通过界面创建第三级类目。
  await expect(parentOptions).toHaveCount(2);
  await expect(parentOptions.nth(0)).toHaveText('一级类目');
  await expect(parentOptions.nth(1)).toHaveText('科技类');
  await expect(drawer.getByRole('option', { name: '擦窗机器人' })).toHaveCount(0);
  await expect(drawer.getByRole('option', { name: '人形机器人' })).toHaveCount(0);
});
