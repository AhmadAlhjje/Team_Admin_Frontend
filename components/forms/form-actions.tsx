import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/** Sticky save bar shown at the bottom of every edit form. */
export function FormActions({
  submitting,
  cancelHref,
  submitLabel = 'حفظ',
  dirty = true,
}: {
  submitting: boolean;
  cancelHref: string;
  submitLabel?: string;
  dirty?: boolean;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-background/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={cancelHref}>إلغاء</Link>
        </Button>
        <Button type="submit" disabled={submitting || !dirty} className="min-w-24">
          {submitting ? <Loader2Icon className="animate-spin" aria-hidden="true" /> : null}
          {submitting ? 'جارٍ الحفظ…' : submitLabel}
        </Button>
      </div>
    </div>
  );
}
