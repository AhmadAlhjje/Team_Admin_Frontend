import type { Metadata } from 'next';

import { LoginForm } from '@/components/auth/login-form';
import { BrandMark } from '@/components/brand/brand-mark';
import { safeRedirectPath } from '@/lib/auth/redirect';

export const metadata: Metadata = { title: 'تسجيل الدخول' };

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next } = await searchParams;

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-grid" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <BrandMark className="mx-auto mb-5 size-14 drop-shadow-[0_16px_30px_rgb(34_211_238/0.3)]" />
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="mt-2 text-sm text-muted-foreground">سجّل الدخول لإدارة محتوى الموقع</p>
        </div>
        <LoginForm next={safeRedirectPath(next)} />
      </div>
    </main>
  );
}
