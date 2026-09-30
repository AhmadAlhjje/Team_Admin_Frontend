import Link from 'next/link';

import { BrandMark } from '@/components/brand/brand-mark';

/** Brand block at the top of the sidebar (desktop sidebar and mobile sheet). */
export function SidebarBrand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="mb-6 flex items-center gap-2.5 rounded-lg px-3 py-1">
      <BrandMark className="size-8" />
      <span className="text-base font-bold text-white">لوحة التحكم</span>
    </Link>
  );
}
