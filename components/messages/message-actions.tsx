'use client';

import { ArchiveIcon, MailIcon, MailOpenIcon, MessageCircleIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useTransition } from 'react';
import { toast } from 'sonner';

import { deleteMessage, setMessageStatus } from '@/app/(dashboard)/messages/actions';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ContactMessage, MessageStatus } from '@/types/api';

function whatsappLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
}

export function MessageActions({ message }: { message: ContactMessage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const markedRead = useRef(false);

  // Opening an unread message marks it as read (a real user action, not a prefetch).
  useEffect(() => {
    if (message.status !== 'UNREAD' || markedRead.current) return;
    markedRead.current = true;
    void setMessageStatus(message.id, 'READ').then((result) => {
      if (result.ok) router.refresh();
    });
  }, [message.id, message.status, router]);

  function changeStatus(status: MessageStatus, successMessage: string) {
    startTransition(async () => {
      const result = await setMessageStatus(message.id, status);
      if (result.ok) {
        toast.success(successMessage);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteMessage(message.id);
      if (result.ok) {
        toast.success('تم حذف الرسالة');
        router.push('/messages');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  const subject = encodeURIComponent(`بخصوص طلبك${message.projectType ? `: ${message.projectType}` : ''}`);

  return (
    <Card>
      <CardContent className="space-y-2">
        <Button asChild className="w-full">
          <a href={`mailto:${message.email}?subject=${subject}`}>
            <MailIcon aria-hidden="true" />
            الرد بالبريد
          </a>
        </Button>
        {message.phone ? (
          <Button asChild variant="outline" className="w-full">
            <a href={whatsappLink(message.phone)} target="_blank" rel="noopener noreferrer">
              <MessageCircleIcon aria-hidden="true" />
              مراسلة عبر واتساب
            </a>
          </Button>
        ) : null}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {message.status === 'ARCHIVED' ? (
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => changeStatus('READ', 'أُعيدت الرسالة إلى البريد')}
            >
              <MailOpenIcon aria-hidden="true" />
              إلغاء الأرشفة
            </Button>
          ) : (
            <Button variant="outline" disabled={pending} onClick={() => changeStatus('ARCHIVED', 'تمت أرشفة الرسالة')}>
              <ArchiveIcon aria-hidden="true" />
              أرشفة
            </Button>
          )}
          <Button
            variant="outline"
            disabled={pending || message.status === 'UNREAD'}
            onClick={() => changeStatus('UNREAD', 'عُلّمت كغير مقروءة')}
          >
            <MailIcon aria-hidden="true" />
            غير مقروءة
          </Button>
        </div>
        <ConfirmDialog
          title="حذف الرسالة نهائياً؟"
          description="لا يمكن التراجع عن الحذف. استخدم الأرشفة للاحتفاظ بالرسالة."
          confirmLabel="حذف"
          onConfirm={remove}
          trigger={
            <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10" disabled={pending}>
              <Trash2Icon aria-hidden="true" />
              حذف
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
