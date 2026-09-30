import type { Metadata } from 'next';

import { SettingsTabs } from '@/components/settings/settings-tabs';
import { Forbidden } from '@/components/shared/forbidden';
import { PageHeader } from '@/components/shared/page-header';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'إعدادات الموقع' };

export default async function SettingsPage() {
  if (!can(await getCurrentUser(), Permission.SettingsManage)) return <Forbidden />;
  const settings = await loadOrRedirect(api.settings.get());

  return (
    <>
      <PageHeader
        title="إعدادات الموقع"
        description="اسم الفريق وبيانات التواصل ونصوص الصفحة الرئيسية. يتم تحديث الموقع تلقائياً بعد الحفظ."
      />
      <SettingsTabs settings={settings} />
    </>
  );
}
