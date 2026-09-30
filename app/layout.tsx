import type { Metadata, Viewport } from 'next';

import { Providers } from '@/components/layout/providers';
import { fontVariables } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: { default: 'لوحة التحكم', template: '%s | لوحة التحكم' },
  description: 'لوحة إدارة محتوى موقع الفريق.',
  // The dashboard must never be indexed.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: '#070b14',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ar" dir="rtl" className={`${fontVariables} dark h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
