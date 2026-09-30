import { ExternalLinkIcon } from 'lucide-react';

import { MobileNav } from '@/components/layout/mobile-nav';
import { SidebarBrand } from '@/components/layout/sidebar-brand';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { UserMenu } from '@/components/layout/user-menu';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';
import { websiteUrl } from '@/lib/constants/env';

async function unreadMessagesCount(permitted: boolean): Promise<number> {
  if (!permitted) return 0;
  try {
    return (await api.messages.list({ status: 'UNREAD' })).unreadCount;
  } catch {
    return 0;
  }
}

export default async function DashboardLayout({ children }: LayoutProps<'/'>) {
  const user = await getCurrentUser();
  const unreadMessages = await unreadMessagesCount(can(user, Permission.MessagesManage));
  const navProps = { permissions: user.permissions, unreadMessages };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen overflow-y-auto border-e border-sidebar-border bg-sidebar p-4 lg:block">
        <SidebarBrand />
        <SidebarNav {...navProps} />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/75 px-4 backdrop-blur-xl sm:px-6">
          <MobileNav {...navProps} />
          <div className="flex-1" />
          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              عرض الموقع
              <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
            </a>
          ) : null}
          <UserMenu user={user} />
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
