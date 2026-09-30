import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { EmptyState } from '@/components/shared/empty-state';
import { Forbidden } from '@/components/shared/forbidden';
import { PageHeader } from '@/components/shared/page-header';
import { MessageStatusBadge } from '@/components/shared/status-badge';
import { StatusTabs } from '@/components/shared/status-tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { MessageStatus } from '@/types/api';

export const metadata: Metadata = { title: 'الرسائل' };

function parseStatus(value: unknown): MessageStatus | undefined {
  return value === 'UNREAD' || value === 'READ' || value === 'ARCHIVED' ? value : undefined;
}

export default async function MessagesPage({ searchParams }: PageProps<'/messages'>) {
  if (!can(await getCurrentUser(), Permission.MessagesManage)) return <Forbidden />;

  const params = await searchParams;
  const status = parseStatus(params.status);
  const search = typeof params.search === 'string' ? params.search.slice(0, 100) : '';
  const page = Math.max(1, Number(params.page) || 1);
  const result = await loadOrRedirect(api.messages.list({ status, page, search }));
  const pages = Math.max(1, Math.ceil(result.total / result.pageSize));

  const pageHref = (target: number) => {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    if (search) query.set('search', search);
    if (target > 1) query.set('page', String(target));
    return query.size ? `/messages?${query.toString()}` : '/messages';
  };

  return (
    <>
      <PageHeader title="الرسائل" description="طلبات المشاريع الواردة من نموذج «تواصل معنا» في الموقع." />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <StatusTabs
          basePath="/messages"
          current={status}
          tabs={[
            { value: undefined, label: 'الكل' },
            { value: 'UNREAD', label: `غير مقروءة (${result.unreadCount})` },
            { value: 'READ', label: 'مقروءة' },
            { value: 'ARCHIVED', label: 'مؤرشفة' },
          ]}
        />
        <form role="search" className="flex gap-2" action="/messages">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <Input
            name="search"
            defaultValue={search}
            placeholder="بحث بالاسم أو البريد أو الشركة"
            aria-label="بحث في الرسائل"
            className="w-64"
          />
          <Button type="submit" variant="outline" size="icon" aria-label="بحث">
            <SearchIcon />
          </Button>
        </form>
      </div>

      {result.items.length === 0 ? (
        <EmptyState title="لا توجد رسائل" description={search ? 'لا توجد نتائج مطابقة للبحث.' : undefined} />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {result.items.map((message) => (
            <li key={message.id}>
              <Link
                href={`/messages/${message.id}`}
                className="flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0 flex-1">
                  <p className={cn('truncate text-foreground', message.status === 'UNREAD' && 'font-semibold')}>
                    {message.name}
                    {message.company ? (
                      <span className="font-normal text-muted-foreground"> — {message.company}</span>
                    ) : null}
                  </p>
                  <p className="truncate text-sm text-muted-foreground" dir="auto">
                    {message.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {message.projectType ?? 'بدون نوع مشروع'} · {formatDateTime(message.createdAt)}
                  </p>
                </div>
                <MessageStatusBadge status={message.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 ? (
        <nav aria-label="الصفحات" className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            صفحة {result.page} من {pages} ({result.total} رسالة)
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={pageHref(page - 1)}>السابق</Link>
              </Button>
            ) : null}
            {page < pages ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={pageHref(page + 1)}>التالي</Link>
              </Button>
            ) : null}
          </div>
        </nav>
      ) : null}
    </>
  );
}
