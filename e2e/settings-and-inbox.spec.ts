import { expect, test } from '@playwright/test';

import { apiUrl } from './env';

test('saves site settings and keeps them after reload', async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('tab', { name: 'التواصل', exact: true }).click();

  const location = page.getByLabel('الموقع', { exact: true });
  const original = await location.inputValue();
  const updated = `دمشق ${Date.now()}`;

  await location.fill(updated);
  await page.getByRole('button', { name: 'حفظ' }).click();
  await expect(page.getByText('تم حفظ بيانات التواصل')).toBeVisible();

  await page.reload();
  await page.getByRole('tab', { name: 'التواصل', exact: true }).click();
  await expect(page.getByLabel('الموقع', { exact: true })).toHaveValue(updated);

  await page.getByLabel('الموقع', { exact: true }).fill(original);
  await page.getByRole('button', { name: 'حفظ' }).click();
  await expect(page.getByText('تم حفظ بيانات التواصل')).toBeVisible();
});

test('opening a new contact message marks it as read', async ({ page, request }) => {
  const name = `E2E Visitor ${Date.now()}`;
  const submitted = await request.post(`${apiUrl}/api/v1/contact`, {
    data: {
      name,
      email: 'visitor@example.com',
      message: 'A message sent by the admin end-to-end tests.',
      elapsedMs: 10_000,
    },
  });
  expect(submitted.status()).toBe(201);

  await page.goto('/messages?status=UNREAD');
  await page.getByRole('link', { name: new RegExp(name) }).click();
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
  await expect(page.getByText('مقروءة', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'حذف' }).click();
  await page.getByRole('button', { name: 'حذف', exact: true }).last().click();
  await expect(page.getByText('تم حذف الرسالة')).toBeVisible();
});
