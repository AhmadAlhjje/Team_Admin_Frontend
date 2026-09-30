import type { Metadata } from 'next';

import { Forbidden } from '@/components/shared/forbidden';
import { PageHeader } from '@/components/shared/page-header';
import { EditUserForm } from '@/components/users/user-forms';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'تعديل مستخدم' };

export default async function EditUserPage({ params }: PageProps<'/users/[id]'>) {
  const currentUser = await getCurrentUser();
  if (!can(currentUser, Permission.UsersManage)) return <Forbidden />;
  const user = await loadEntity((await params).id, api.users.get);

  return (
    <>
      <PageHeader title={user.name} description={user.email} back={{ href: '/users', label: 'المستخدمون' }} />
      <EditUserForm user={user} isSelf={user.id === currentUser.id} />
    </>
  );
}
