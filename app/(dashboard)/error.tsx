'use client';

import { AlertTriangleIcon } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center"
    >
      <AlertTriangleIcon className="mb-3 size-8 text-amber-500" aria-hidden="true" />
      <h1 className="text-lg font-semibold text-foreground">تعذّر تحميل الصفحة</h1>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        قد يكون الخادم غير متاح مؤقتاً. حاول مرة أخرى، وإذا استمرت المشكلة تحقق من تشغيل الـ API.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-muted-foreground" dir="ltr">
          Ref: {error.digest}
        </p>
      ) : null}
      <Button className="mt-5" onClick={retry}>
        حاول مجدداً
      </Button>
    </div>
  );
}
