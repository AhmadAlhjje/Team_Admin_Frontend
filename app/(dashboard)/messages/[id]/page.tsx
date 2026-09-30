import type { Metadata } from 'next';

import { MessageActions } from '@/components/messages/message-actions';
import { Forbidden } from '@/components/shared/forbidden';
import { PageHeader } from '@/components/shared/page-header';
import { MessageStatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';

export const metadata: Metadata = { title: 'رسالة' };

export default async function MessagePage({ params }: PageProps<'/messages/[id]'>) {
  if (!can(await getCurrentUser(), Permission.MessagesManage)) return <Forbidden />;
  const message = await loadEntity((await params).id, api.messages.get);

  const details = [
    { label: 'البريد الإلكتروني', value: message.email, ltr: true },
    { label: 'الهاتف / واتساب', value: message.phone, ltr: true },
    { label: 'الشركة', value: message.company },
    { label: 'نوع المشروع', value: message.projectType },
    { label: 'الميزانية', value: message.budget },
    { label: 'تاريخ الإرسال', value: formatDateTime(message.createdAt) },
  ];

  return (
    <>
      <PageHeader
        title={message.name}
        back={{ href: '/messages', label: 'الرسائل' }}
        actions={<MessageStatusBadge status={message.status} />}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">تفاصيل المشروع</h2>
            <p className="leading-relaxed whitespace-pre-line text-foreground" dir="auto">
              {message.message}
            </p>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardContent>
              <dl className="space-y-3 text-sm">
                {details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-muted-foreground">{detail.label}</dt>
                    <dd className="font-medium text-foreground" dir={detail.ltr ? 'ltr' : undefined}>
                      {detail.value || '—'}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <MessageActions message={message} />
        </div>
      </div>
    </>
  );
}
