import { expect, test as setup } from '@playwright/test';

import { adminCredentials } from './env';

const storageState = 'e2e/.auth/admin.json';

/** Signs in once through the real login form and stores the session cookies. */
setup('authenticate', async ({ page }) => {
  const { email, password } = adminCredentials();

  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel('البريد الإلكتروني').fill(email);
  await page.getByLabel('كلمة المرور').fill(password);
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toContainText('أهلاً');
  await page.context().storageState({ path: storageState });
});
