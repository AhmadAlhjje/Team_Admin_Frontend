import { ShieldAlertIcon } from 'lucide-react';

export function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
      <ShieldAlertIcon className="mb-3 size-8 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-lg font-semibold text-foreground">لا تملك صلاحية الوصول</h1>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        هذه الصفحة متاحة لأدوار أخرى فقط. تواصل مع المدير العام إذا كنت تحتاج هذه الصلاحية.
      </p>
    </div>
  );
}
