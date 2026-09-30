'use client';

import { ChevronDownIcon, KeyRoundIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/actions/session-actions';
import { roleLabels } from '@/lib/constants/labels';
import type { AuthUser } from '@/types/api';

export function UserMenu({ user }: { user: Pick<AuthUser, 'name' | 'email' | 'role'> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-primary-foreground"
          >
            {user.name.charAt(0)}
          </span>
          <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
          <ChevronDownIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs font-normal text-muted-foreground" dir="ltr">
            {user.email}
          </p>
          <p className="mt-1 text-xs font-normal text-muted-foreground">{roleLabels[user.role]}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <KeyRoundIcon aria-hidden="true" />
            تغيير كلمة المرور
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem asChild variant="destructive">
            <button type="submit" className="w-full">
              <LogOutIcon aria-hidden="true" />
              تسجيل الخروج
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
