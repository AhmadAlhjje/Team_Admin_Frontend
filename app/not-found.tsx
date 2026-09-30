import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">الصفحة غير موجودة</h1>
      <p className="mt-2 text-muted-foreground">ربما حُذف العنصر أو أن الرابط غير صحيح.</p>
      <Button asChild className="mt-6">
        <Link href="/">العودة إلى لوحة التحكم</Link>
      </Button>
    </main>
  );
}
