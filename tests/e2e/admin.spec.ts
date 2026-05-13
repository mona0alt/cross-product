import { expect, test } from '@playwright/test';
import { db } from '../../src/lib/db';

test.describe.configure({ mode: 'serial' });

type ProductMediaState = {
  coverImageUrl: string;
  imageUrls: string[];
};

async function getProductMediaState(slug: string): Promise<ProductMediaState> {
  const product = await db.product.findUniqueOrThrow({
    where: { slug },
    include: {
      images: {
        orderBy: {
          sortOrder: 'asc'
        }
      }
    }
  });

  return {
    coverImageUrl: product.coverImageUrl,
    imageUrls: product.images.map((image) => image.imageUrl)
  };
}

async function restoreProductMediaState(slug: string, state: ProductMediaState) {
  const product = await db.product.findUniqueOrThrow({
    where: { slug }
  });

  await db.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: product.id },
      data: {
        coverImageUrl: state.coverImageUrl
      }
    });

    await tx.productImage.deleteMany({
      where: { productId: product.id }
    });

    if (state.imageUrls.length > 0) {
      await tx.productImage.createMany({
        data: state.imageUrls.map((imageUrl, sortOrder) => ({
          productId: product.id,
          imageUrl,
          altText: product.nameEn,
          sortOrder
        }))
      });
    }
  });
}

test('admin login and product draft form flow', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
  await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
  await page.getByRole('button', { name: '登录' }).click();

  await expect(page).toHaveURL(/\/admin\/analytics$/);
  await expect(page.getByRole('heading', { name: '热门产品排名' })).toBeVisible();

  await page.goto('/admin/products');
  await expect(page.getByRole('heading', { name: '商品管理' })).toBeVisible();

  await page.getByRole('button', { name: '新增商品' }).click();
  await expect(page.getByRole('dialog', { name: '新增商品' })).toBeVisible();
  await expect(page.getByText('基础信息')).toBeVisible();
  await expect(page.getByText('产品媒体')).toBeVisible();
  await expect(page.getByRole('button', { name: '保存更改' })).toBeVisible();
});

test('admin system settings switches detail card by category', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
  await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL(/\/admin\/analytics$/);

  await page.goto('/admin/categories');
  await expect(page.getByRole('heading', { name: '配置类别' })).toBeVisible();
  await expect(page.getByTestId('system-setting-active-panel')).toContainText('邮箱配置');
  await expect(page.getByTestId('system-setting-active-panel')).toContainText('support@fbgm.com');
  await expect(page.getByTestId('system-setting-active-panel')).not.toContainText('数据库类型');

  await page.getByRole('button', { name: /数据库配置/ }).click();
  await expect(page.getByTestId('system-setting-active-panel')).toContainText('数据库配置');
  await expect(page.getByTestId('system-setting-active-panel')).toContainText('数据库类型');
  await expect(page.getByTestId('system-setting-active-panel')).not.toContainText('发件邮箱');

  await page.getByRole('button', { name: /大模型相关配置/ }).click();
  await expect(page.getByTestId('system-setting-active-panel')).toContainText('大模型相关配置');
  await expect(page.getByTestId('system-setting-active-panel')).toContainText('OPENAI_API_KEY');
});

test('product drawer shows gallery image preview after upload', async ({ page }) => {
  await page.route('**/api/admin/uploads/product-images', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ url: '/uploads/products/e2e-gallery.png' })
    });
  });

  await page.goto('/admin/login');
  await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
  await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL(/\/admin\/analytics$/);

  await page.goto('/admin/products');
  await page.getByRole('button', { name: /^编辑商品 / }).first().click();
  const drawer = page.getByRole('dialog', { name: '编辑商品' });
  await expect(drawer).toBeVisible();

  const galleryPreviews = drawer.locator('[data-product-gallery-preview="true"]');
  const previewCountBeforeUpload = await galleryPreviews.count();
  await drawer.locator('input[type="file"]').nth(1).setInputFiles('public/logo.jpg');

  await expect(galleryPreviews).toHaveCount(previewCountBeforeUpload + 1);
  await expect(galleryPreviews.last()).toHaveAttribute('src', /^blob:/);
  await expect
    .poll(async () =>
      galleryPreviews.last().evaluate((image) =>
        image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
      )
    )
    .toBe(true);
  await expect(drawer.locator('input[name="galleryImageUrls"]')).toHaveValue(
    /\/uploads\/products\/e2e-gallery\.png/
  );
});

test('product drawer shows a clear gallery upload error for oversized images', async ({ page }) => {
  await page.route('**/api/admin/uploads/product-images', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'FILE_TOO_LARGE' })
    });
  });

  await page.goto('/admin/login');
  await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
  await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL(/\/admin\/analytics$/);

  await page.goto('/admin/products');
  await page.getByRole('button', { name: /^编辑商品 / }).first().click();
  const drawer = page.getByRole('dialog', { name: '编辑商品' });
  await expect(drawer).toBeVisible();

  await drawer.locator('input[type="file"]').nth(1).setInputFiles('public/logo.jpg');

  await expect(drawer.getByRole('alert')).toContainText(
    '图片过大，单张图片不能超过 5MB。请压缩后重新上传。'
  );
});

test('product drawer keeps gallery images after delete upload save and reopen', async ({ page }) => {
  const originalMediaState = await getProductMediaState('sky-cleaner-pro');
  let releaseUpload: () => void = () => undefined;
  const uploadCanFinish = new Promise<void>((resolve) => {
    releaseUpload = resolve;
  });

  try {
    await page.route('**/api/admin/uploads/product-images', async (route) => {
      await uploadCanFinish;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: '/logo.jpg' })
      });
    });

    await page.goto('/admin/login');
    await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
    await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page).toHaveURL(/\/admin\/analytics$/);

    await page.goto('/admin/products');
    const firstProductEditButton = page.getByRole('button', { name: /^编辑商品 / }).first();
    await firstProductEditButton.click();
    let drawer = page.getByRole('dialog', { name: '编辑商品' });
    await expect(drawer).toBeVisible();

    const deleteButtons = drawer.getByRole('button', { name: /^删除商品图片 / });
    while ((await deleteButtons.count()) > 0) {
      await deleteButtons.first().click();
    }

    await drawer.locator('input[type="file"]').nth(1).setInputFiles('public/logo.jpg');
    await expect(drawer.getByRole('button', { name: '图片上传中...' })).toBeDisabled();
    await expect(drawer.getByText('图片仍在上传，完成后才能保存商品。')).toBeVisible();

    releaseUpload();
    await expect(drawer.locator('input[name="galleryImageUrls"]')).toHaveValue('/logo.jpg');
    await expect(drawer.getByRole('button', { name: '保存更改' })).toBeEnabled();
    await drawer.getByRole('button', { name: '保存更改' }).click();
    await expect(drawer).toBeHidden();

    await firstProductEditButton.click();
    drawer = page.getByRole('dialog', { name: '编辑商品' });
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('[data-product-gallery-preview="true"]')).toHaveCount(1);
    await expect(drawer.locator('[data-product-gallery-preview="true"]').first()).toHaveAttribute(
      'src',
      '/logo.jpg'
    );
  } finally {
    await restoreProductMediaState('sky-cleaner-pro', originalMediaState);
  }
});

test('product drawer persists a real uploaded gallery image after save and reopen', async ({ page }) => {
  const originalMediaState = await getProductMediaState('sky-cleaner-pro');

  try {
    await page.goto('/admin/login');
    await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
    await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page).toHaveURL(/\/admin\/analytics$/);

    await page.goto('/admin/products');
    const firstProductEditButton = page.getByRole('button', { name: /^编辑商品 / }).first();
    await firstProductEditButton.click();
    let drawer = page.getByRole('dialog', { name: '编辑商品' });
    await expect(drawer).toBeVisible();

    const deleteButtons = drawer.getByRole('button', { name: /^删除商品图片 / });
    while ((await deleteButtons.count()) > 0) {
      await deleteButtons.first().click();
    }

    await drawer.locator('input[type="file"]').nth(1).setInputFiles('public/logo.jpg');
    const galleryValue = drawer.locator('input[name="galleryImageUrls"]');
    await expect(galleryValue).toHaveValue(/^\/uploads\/products\/\d{4}\/\d{2}\/.+\.jpg$/);
    const savedGalleryUrl = await galleryValue.inputValue();

    await drawer.getByRole('button', { name: '保存更改' }).click();
    await expect(drawer).toBeHidden();

    await firstProductEditButton.click();
    drawer = page.getByRole('dialog', { name: '编辑商品' });
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('[data-product-gallery-preview="true"]')).toHaveCount(1);
    await expect(drawer.locator('[data-product-gallery-preview="true"]').first()).toHaveAttribute(
      'src',
      savedGalleryUrl
    );
  } finally {
    await restoreProductMediaState('sky-cleaner-pro', originalMediaState);
  }
});

test('sky cleaner product editor renders the second gallery image', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByRole('textbox', { name: /用户名/i }).fill('admin');
  await page.getByPlaceholder('请输入密码').fill('ChangeMe123!');
  await page.getByRole('button', { name: '登录' }).click();
  await expect(page).toHaveURL(/\/admin\/analytics$/);

  await page.goto('/admin/products');
  await page.getByRole('button', { name: '编辑商品 Sky Cleaner Pro 擦窗机器人' }).click();
  const drawer = page.getByRole('dialog', { name: '编辑商品' });
  await expect(drawer).toBeVisible();

  const galleryPreviews = drawer.locator('[data-product-gallery-preview="true"]');
  await expect(galleryPreviews).toHaveCount(2);
  await expect
    .poll(async () =>
      galleryPreviews.nth(1).evaluate((image) =>
        image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
      )
    )
    .toBe(true);
});
