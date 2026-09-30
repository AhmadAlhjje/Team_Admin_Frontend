import {
  BriefcaseBusinessIcon,
  FolderKanbanIcon,
  HandshakeIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  MailIcon,
  MessageSquareQuoteIcon,
  SettingsIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UsersIcon,
} from 'lucide-react';

import { Permission } from '@/lib/auth/permissions';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
  /** Shows the unread messages counter. */
  badge?: 'unreadMessages';
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

/** Admin navigation. Items are hidden when the user lacks the permission. */
export const navigation: NavGroup[] = [
  { items: [{ href: '/', label: 'الرئيسية', icon: LayoutDashboardIcon }] },
  {
    label: 'المحتوى',
    items: [
      { href: '/projects', label: 'المشاريع', icon: FolderKanbanIcon, permission: Permission.ContentManage },
      { href: '/team', label: 'الفريق', icon: UsersIcon, permission: Permission.ContentManage },
      { href: '/services', label: 'الخدمات', icon: BriefcaseBusinessIcon, permission: Permission.ContentManage },
      { href: '/achievements', label: 'الإنجازات', icon: TrophyIcon, permission: Permission.ContentManage },
      { href: '/clients', label: 'العملاء', icon: HandshakeIcon, permission: Permission.ContentManage },
      {
        href: '/testimonials',
        label: 'آراء العملاء',
        icon: MessageSquareQuoteIcon,
        permission: Permission.ContentManage,
      },
      { href: '/faqs', label: 'الأسئلة الشائعة', icon: HelpCircleIcon, permission: Permission.ContentManage },
    ],
  },
  {
    label: 'التواصل',
    items: [
      {
        href: '/messages',
        label: 'الرسائل',
        icon: MailIcon,
        permission: Permission.MessagesManage,
        badge: 'unreadMessages',
      },
    ],
  },
  {
    label: 'النظام',
    items: [
      { href: '/settings', label: 'إعدادات الموقع', icon: SettingsIcon, permission: Permission.SettingsManage },
      { href: '/users', label: 'المستخدمون', icon: ShieldCheckIcon, permission: Permission.UsersManage },
    ],
  },
];

export function isActivePath(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}
