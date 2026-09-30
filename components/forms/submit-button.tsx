import { Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SubmitButton({ submitting, label = 'حفظ' }: { submitting: boolean; label?: string }) {
  return (
    <Button type="submit" size="sm" disabled={submitting} className="min-w-20">
      {submitting ? <Loader2Icon className="animate-spin" aria-hidden="true" /> : null}
      {submitting ? 'جارٍ الحفظ…' : label}
    </Button>
  );
}
