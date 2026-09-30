import { expect, test } from '@playwright/test';

import { apiUrl, tinyPng } from './env';

test.describe('content management', () => {
  test('creates a team member with an uploaded photo, edits it and deletes it', async ({ page }) => {
    const name = `E2E Member ${Date.now()}`;

    await page.goto('/team/new');
    await page.getByRole('textbox', { name: 'الاسم', exact: true }).fill(name);
    // The slug follows the latin name until it is edited manually.
    await expect(page.getByRole('textbox', { name: 'المعرّف (Slug)' })).toHaveValue(/^e2e-member-\d+$/);
    await page.getByRole('textbox', { name: 'الدور', exact: true }).fill('QA Engineer');

    await page.getByLabel('المهارات').fill('Playwright');
    await page.getByLabel('المهارات').press('Enter');
    await expect(page.getByRole('button', { name: 'إزالة Playwright' })).toBeVisible();

    await page
      .locator('input[type="file"]')
      .setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: tinyPng });
    await expect(page.getByText('تم رفع الصورة')).toBeVisible();
    await expect(page.locator('#avatarUrl')).toHaveValue(/\/uploads\/team\/.+\.webp$/);

    await page.getByRole('button', { name: 'حفظ', exact: true }).click();
    await expect(page.getByText('تمت إضافة العضو')).toBeVisible();
    await expect(page).toHaveURL(/\/team$/);

    const row = page.getByRole('row', { name: new RegExp(name) });
    await expect(row).toBeVisible();

    await row.getByRole('link', { name: `تعديل «${name}»` }).click();
    await page.getByRole('textbox', { name: 'التخصص' }).fill('Testing');
    await page.getByRole('button', { name: 'حفظ', exact: true }).click();
    await expect(page.getByText('تم حفظ التعديلات')).toBeVisible();

    await page
      .getByRole('row', { name: new RegExp(name) })
      .getByRole('button', { name: `حذف «${name}»` })
      .click();
    await page.getByRole('button', { name: 'حذف نهائياً' }).click();
    await expect(page.getByText(`تم حذف «${name}»`)).toBeVisible();
    await expect(page.getByRole('row', { name: new RegExp(name) })).toHaveCount(0);
  });

  test('shows Arabic validation errors before submitting', async ({ page }) => {
    await page.goto('/projects/new');
    await page.getByLabel('اسم المشروع').fill('ا');
    await page.getByLabel('رابط المشروع (Slug)').fill('Bad Slug');
    await page.getByRole('button', { name: 'حفظ', exact: true }).click();

    await expect(page.getByText('يجب ألا يقل عن 2 أحرف.')).toBeVisible();
    await expect(page.getByText('استخدم أحرفاً إنجليزية صغيرة وأرقاماً وشرطات فقط')).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/new$/);
  });

  test('refuses to publish a client without consent', async ({ page }) => {
    await page.goto('/clients/new');
    await page.getByLabel('اسم الجهة').fill('E2E Client');
    await page.getByLabel('الحالة').selectOption('PUBLISHED');
    await page.getByRole('button', { name: 'حفظ', exact: true }).click();
    await expect(page.getByText('لا يمكن النشر قبل الحصول على موافقة العميل.')).toBeVisible();
  });

  test('publishes a project that becomes available on the public API', async ({ page, request }) => {
    const slug = `e2e-project-${Date.now()}`;

    await page.goto('/projects/new');
    await page.getByLabel('اسم المشروع').fill('E2E Project');
    await page.getByLabel('رابط المشروع (Slug)').fill(slug);
    await page.getByLabel('وصف مختصر').fill('Project created by the admin end-to-end tests.');
    await page.getByLabel('حالة النشر').selectOption('PUBLISHED');
    await page.getByRole('button', { name: 'إضافة ميزة' }).click();
    await page.getByLabel('عنوان الميزة 1').fill('Automated');
    await page.getByLabel('التقنيات').fill('Playwright');
    await page.getByLabel('التقنيات').press('Enter');
    await page.getByRole('button', { name: 'حفظ', exact: true }).click();
    await expect(page.getByText('تمت إضافة المشروع')).toBeVisible();

    const response = await request.get(`${apiUrl}/api/v1/projects/${slug}`);
    expect(response.status()).toBe(200);
    const project = await response.json();
    expect(project.features).toEqual([{ title: 'Automated', description: null }]);
    expect(project.technologies.map((technology: { name: string }) => technology.name)).toEqual(['Playwright']);

    // Clean up through the UI.
    await page
      .getByRole('row', { name: /E2E Project/ })
      .getByRole('button', { name: 'حذف «E2E Project»' })
      .click();
    await page.getByRole('button', { name: 'حذف نهائياً' }).click();
    await expect(page.getByText('تم حذف «E2E Project»')).toBeVisible();
    expect((await request.get(`${apiUrl}/api/v1/projects/${slug}`)).status()).toBe(404);
  });
});
