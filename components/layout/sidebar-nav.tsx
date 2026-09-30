'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isActivePath, navigation } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  permissions: string[];
  unreadMessages: number;
  onNavigate?: () => void;
}

export function SidebarNav({ permissions, unreadMessages, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="القائمة الرئيسية" className="space-y-6">
      {navigation.map((group, index) => {
        const items = group.items.filter((item) => !item.permission || permissions.includes(item.permission));
        if (items.length === 0) return null;

        return (
          <div key={group.label ?? index}>
            {group.label ? (
              <p className="mb-2 px-3 text-xs font-medium tracking-wide text-muted-foreground">{group.label}</p>
            ) : null}
            <ul className="space-y-1">
              {items.map((item) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;
                const badge = item.badge === 'unreadMessages' && unreadMessages > 0 ? unreadMessages : null;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        active
                          ? 'bg-sidebar-accent font-medium text-white before:absolute before:inset-y-2 before:inset-s-0 before:w-0.5 before:rounded-full before:bg-brand'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white',
                      )}
                    >
                      <Icon className={cn('size-4 shrink-0', active && 'text-aqua')} aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {badge ? (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                          {badge > 99 ? '99+' : badge}
                          <span className="sr-only"> رسالة غير مقروءة</span>
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
