import type { Metadata } from 'next';

import { ChangePasswordForm } from '@/components/users/change-password-form';
import { PageHeader } from '@/components/shared/page-header';
import { getCurrentUser } from '@/lib/auth/session';
import { roleLabels } from '@/lib/constants/labels';

export const metadata: Metadata = { title: 'حسابي' };

export default async function AccountPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PageHeader title="حسابي" description={`${user.email} · ${roleLabels[user.role]}`} />
      <ChangePasswordForm />
    </>
  );
}
