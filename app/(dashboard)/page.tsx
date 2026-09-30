import {
  BriefcaseBusinessIcon,
  FolderKanbanIcon,
  HelpCircleIcon,
  MailIcon,
  MessageSquareQuoteIcon,
  PlusIcon,
  TrophyIcon,
  UsersIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/shared/page-header';
import { MessageStatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';
import { formatDateTime } from '@/lib/format';

export const metadata: Metadata = { title: 'الرئيسية' };

function StatCard({
  label,
  value,
  detail,
  href,
  icon: Icon,
}: {
  label: string;
  value: number;
  detail?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </Link>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const summary = await loadOrRedirect(api.dashboard());
  const canManageContent = can(user, Permission.ContentManage);

  return (
    <>
      <PageHeader
        title={`أهلاً ${user.name}`}
        description="نظرة سريعة على محتوى الموقع والرسائل الواردة."
        actions={
          canManageContent ? (
            <>
              <Button asChild variant="outline">
                <Link href="/team/new">
                  <PlusIcon aria-hidden="true" />
                  عضو جديد
                </Link>
              </Button>
              <Button asChild>
                <Link href="/projects/new">
                  <PlusIcon aria-hidden="true" />
                  مشروع جديد
                </Link>
              </Button>
            </>
          ) : null
        }
      />

      <section aria-label="إحصائيات المحتوى" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="المشاريع المنشورة"
          value={summary.projects.published}
          detail={`${summary.projects.draft} مسودة · ${summary.projects.archived} مؤرشف`}
          href="/projects"
          icon={FolderKanbanIcon}
        />
        <StatCard
          label="أعضاء الفريق الظاهرون"
          value={summary.teamMembers.published}
          detail={`${summary.teamMembers.draft} معطّل · ${summary.teamMembers.archived} مؤرشف`}
          href="/team"
          icon={UsersIcon}
        />
        <StatCard
          label="الخدمات المنشورة"
          value={summary.publishedServices}
          href="/services"
          icon={BriefcaseBusinessIcon}
        />
        {summary.messages ? (
          <StatCard
            label="رسائل غير مقروءة"
            value={summary.messages.unread}
            detail={`${summary.messages.total} رسالة إجمالاً`}
            href="/messages?status=UNREAD"
            icon={MailIcon}
          />
        ) : (
          <StatCard
            label="الإنجازات المنشورة"
            value={summary.publishedAchievements}
            href="/achievements"
            icon={TrophyIcon}
          />
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {summary.messages ? (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">آخر الرسائل</CardTitle>
              <Link href="/messages" className="text-sm text-primary hover:underline">
                كل الرسائل
              </Link>
            </CardHeader>
            <CardContent>
              {summary.recentMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد رسائل بعد.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {summary.recentMessages.map((message) => (
                    <li key={message.id}>
                      <Link
                        href={`/messages/${message.id}`}
                        className="flex items-center justify-between gap-4 py-3 hover:bg-muted/60"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{message.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {message.projectType ?? 'بدون نوع مشروع'} · {formatDateTime(message.createdAt)}
                          </p>
                        </div>
                        <MessageStatusBadge status={message.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">محتوى منشور</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'الإنجازات', value: summary.publishedAchievements, href: '/achievements', icon: TrophyIcon },
                {
                  label: 'آراء العملاء',
                  value: summary.publishedTestimonials,
                  href: '/testimonials',
                  icon: MessageSquareQuoteIcon,
                },
                { label: 'العملاء', value: summary.publishedClients, href: '/clients', icon: UsersIcon },
                { label: 'الأسئلة الشائعة', value: summary.publishedFaqs, href: '/faqs', icon: HelpCircleIcon },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <dt>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <item.icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </dt>
                  <dd className="font-semibold tabular-nums">{item.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
