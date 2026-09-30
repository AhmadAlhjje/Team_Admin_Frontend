import type { Metadata } from 'next';

import { Forbidden } from '@/components/shared/forbidden';
import { PageHeader } from '@/components/shared/page-header';
import { CreateUserForm } from '@/components/users/user-forms';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'إضافة مستخدم' };

export default async function NewUserPage() {
  if (!can(await getCurrentUser(), Permission.UsersManage)) return <Forbidden />;
  return (
    <>
      <PageHeader title="إضافة مستخدم" back={{ href: '/users', label: 'المستخدمون' }} />
      <CreateUserForm />
    </>
  );
}
