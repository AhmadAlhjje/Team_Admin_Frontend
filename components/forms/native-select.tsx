import { ChevronDownIcon } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/** Styled native <select>: accessible, keyboard friendly and works with react-hook-form `register`. */
export const NativeSelect = forwardRef<HTMLSelectElement, React.ComponentProps<'select'>>(function NativeSelect(
  { className, children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-9 w-full appearance-none rounded-lg border border-input bg-card ps-3 pe-9 text-sm transition-colors outline-none',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30',
          'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
});
