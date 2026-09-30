'use client';

import { Direction } from 'radix-ui';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

/** App-wide client providers: RTL for Radix primitives, tooltips and toasts. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Direction.Provider dir="rtl">
      <TooltipProvider delayDuration={300}>
        {children}
        <Toaster theme="dark" position="top-center" richColors closeButton dir="rtl" />
      </TooltipProvider>
    </Direction.Provider>
  );
}
