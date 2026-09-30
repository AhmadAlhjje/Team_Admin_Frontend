import { expect, test } from '@playwright/test';

import { adminCredentials } from './env';

test.describe('authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('redirects anonymous visitors to login and rejects a wrong password', async ({ page }) => {
    await page.goto('/team');
    await expect(page).toHaveURL(/\/login\?next=%2Fteam/);

    await page.getByLabel('البريد الإلكتروني').fill(adminCredentials().email);
    await page.getByLabel('كلمة المرور').fill('definitely-wrong-password');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    await expect(page.getByText('البريد الإلكتروني أو كلمة المرور غير صحيحة')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('returns to the requested page after signing in, and signs out', async ({ page }) => {
    const { email, password } = adminCredentials();
    await page.goto('/faqs');
    await page.getByLabel('البريد الإلكتروني').fill(email);
    await page.getByLabel('كلمة المرور').fill(password);
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    await expect(page).toHaveURL(/\/faqs$/);
    await expect(page.getByRole('heading', { level: 1, name: 'الأسئلة الشائعة' })).toBeVisible();

    // Session cookies are httpOnly: not readable from page JavaScript.
    expect(await page.evaluate(() => document.cookie)).not.toContain('tp_admin');

    await page
      .getByRole('button', { name: /Super Admin|admin/i })
      .first()
      .click();
    await page.getByRole('menuitem', { name: 'تسجيل الخروج' }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/faqs');
    await expect(page).toHaveURL(/\/login/);
  });
});
