import { PlusIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Forbidden } from '@/components/shared/forbidden';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';
import { roleLabels } from '@/lib/constants/labels';
import { formatDateTime } from '@/lib/format';

export const metadata: Metadata = { title: 'المستخدمون' };

export default async function UsersPage() {
  const currentUser = await getCurrentUser();
  if (!can(currentUser, Permission.UsersManage)) return <Forbidden />;
  const users = await loadOrRedirect(api.users.list());

  return (
    <>
      <PageHeader
        title="المستخدمون"
        description="حسابات الدخول إلى لوحة التحكم وأدوارها."
        actions={
          <Button asChild>
            <Link href="/users/new">
              <PlusIcon aria-hidden="true" />
              إضافة مستخدم
            </Link>
          </Button>
        }
      />
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المستخدم</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="hidden md:table-cell">آخر دخول</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/users/${user.id}`} className="font-medium text-foreground hover:text-primary">
                    {user.name}
                    {user.id === currentUser.id ? <span className="text-xs text-muted-foreground"> (أنت)</span> : null}
                  </Link>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {user.email}
                  </p>
                </TableCell>
                <TableCell>{roleLabels[user.role]}</TableCell>
                <TableCell>
                  {user.isActive ? (
                    <span className="text-emerald-400">نشط</span>
                  ) : (
                    <span className="text-muted-foreground">معطّل</span>
                  )}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'لم يسجل الدخول'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
