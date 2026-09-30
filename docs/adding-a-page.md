# إضافة قسم إدارة جديد

مثال: قسم **«الشركاء» (partners)**.

## 1. Backend

أنشئ الوحدة بنفس نمط `modules/faqs` (model + migration + DTOs + service + public/admin controllers + revalidation tag). انظر `backend/ROLE.md`.

## 2. النوع — `types/api.ts`

```ts
export interface Partner {
  id: number;
  name: string;
  status: ContentStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

## 3. الـ API — `lib/api/resources.ts`

```ts
partners: contentResource<Partner, PartnerPayload>('/admin/partners'),
```

## 4. التحقق — `lib/validation/schemas.ts`

```ts
export const partnerSchema = z.object({
  name: requiredText(2, 150),
  status: contentStatus,
});
export type PartnerFormValues = z.input<typeof partnerSchema>;
export type PartnerPayload = z.output<typeof partnerSchema>;
export function partnerDefaults(partner?: Partner): PartnerFormValues {
  return { name: text(partner?.name), status: partner?.status ?? 'DRAFT' };
}
```

اجعل القيود مطابقة للـ DTO في الـ backend.

## 5. Server Actions — `app/(dashboard)/partners/actions.ts`

```ts
'use server';

import { contentActions } from '@/lib/actions/content-actions';
import { api } from '@/lib/api/resources';
import type { PartnerPayload } from '@/lib/validation/schemas';

const partners = contentActions<PartnerPayload>(api.partners, '/partners');

export async function createPartner(payload: PartnerPayload) {
  return partners.create(payload);
}
export async function updatePartner(id: number, payload: PartnerPayload) {
  return partners.update(id, payload);
}
export async function deletePartner(id: number) {
  return partners.remove(id);
}
export async function reorderPartners(ids: number[]) {
  return partners.reorder(ids);
}
```

## 6. الصفحات

انسخ من `app/(dashboard)/faqs/`:

- `page.tsx`: `can(user, Permission.ContentManage)` ← `api.partners.list(status)` ← `ManagedTable` + `StatusTabs`.
- `new/page.tsx` و `[id]/page.tsx` (`loadEntity(id, api.partners.get)`).
- `components/partners/partner-form.tsx`: `useForm` + `zodResolver(partnerSchema)` + `useActionFeedback` + `FormActions`.

## 7. التنقل — `lib/constants/navigation.ts`

```ts
{ href: '/partners', label: 'الشركاء', icon: HandshakeIcon, permission: Permission.ContentManage },
```

## 8. التحقق

```bash
npm run typecheck && npm run lint && npm test
```

أضف اختبار Playwright للمسار الأساسي إذا كان القسم مهماً (انظر `e2e/content.spec.ts`).

## قواعد

- النصوص بالعربية، والحالات من `labels.ts`.
- لا تستدعِ `fetch` مباشرة — `apiRequest` عبر `resources.ts`.
- حذف مع `deleteHint` يشرح البديل إذا كان للعنصر ارتباطات.
