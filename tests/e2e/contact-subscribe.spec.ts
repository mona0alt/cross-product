import { expect, test } from '@playwright/test';

test('contact and subscribe forms submit successfully', async ({ page }) => {
  await page.goto('/en/contact');
  await page.getByPlaceholder('Name').fill('Alice Buyer');
  await page.getByPlaceholder('Email').fill('alice@example.com');
  await page.getByPlaceholder('Message').fill('Need a wholesale quote.');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Demo mode: the contact form was submitted locally.')).toBeVisible();

  await page.goto('/en/subscribe');
  await page.getByPlaceholder('Email').fill('buyer@example.com');
  await page.getByRole('button', { name: 'Subscribe' }).click();
  await expect(page.getByText('Demo mode: the subscription form was submitted locally.')).toBeVisible();
});
