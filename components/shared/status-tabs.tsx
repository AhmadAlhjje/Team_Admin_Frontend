import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface StatusTab {
  value: string | undefined;
  label: string;
}

/** Server-rendered filter tabs driven by the `?status=` query parameter. */
export function StatusTabs({ basePath, tabs, current }: { basePath: string; tabs: StatusTab[]; current?: string }) {
  return (
    <nav aria-label="تصفية حسب الحالة" className="mb-4 flex w-fit flex-wrap gap-1 rounded-lg bg-muted p-1 text-sm">
      {tabs.map((tab) => {
        const active = tab.value === current;
        const href = tab.value ? `${basePath}?status=${tab.value}` : basePath;
        return (
          <Link
            key={tab.label}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-1.5 transition-colors',
              active ? 'bg-card font-medium text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export const contentStatusTabs: StatusTab[] = [
  { value: undefined, label: 'الكل' },
  { value: 'PUBLISHED', label: 'منشور' },
  { value: 'DRAFT', label: 'مسودة' },
  { value: 'ARCHIVED', label: 'مؤرشف' },
];

export function parseContentStatus(value: unknown): 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | undefined {
  return value === 'PUBLISHED' || value === 'DRAFT' || value === 'ARCHIVED' ? value : undefined;
}
