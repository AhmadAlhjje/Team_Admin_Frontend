'use client';

import { MenuIcon } from 'lucide-react';
import { useState } from 'react';

import { BrandMark } from '@/components/brand/brand-mark';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { SidebarNav } from './sidebar-nav';

export function MobileNav(props: { permissions: string[]; unreadMessages: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="فتح القائمة">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
        <SheetHeader className="p-0 pb-4">
          <SheetTitle className="flex items-center gap-2.5 text-white">
            <BrandMark className="size-7" />
            لوحة التحكم
          </SheetTitle>
        </SheetHeader>
        <SidebarNav {...props} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
