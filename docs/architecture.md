# Admin architecture

## لماذا BFF؟

| البديل                                                   | المشكلة                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| SPA تستدعي الـ API من المتصفح مع token في `localStorage` | أي XSS يسرق الجلسة                                                             |
| cookies على نطاق الـ API                                 | cross-site cookies تتعطل عند اختلاف النطاقات (Vercel + VPS) وتحتاج CSRF يدوياً |
| **BFF (المعتمد)**                                        | الرموز httpOnly على نطاق لوحة التحكم، Server Actions محمية من CSRF، بلا CORS   |

## دورة الطلب

```text
GET /projects/12
  → proxy.ts            جلسة صالحة؟ جدد إن لزم، وإلا /login?next=/projects/12
  → (dashboard)/layout  getCurrentUser()  (GET /auth/me — مرة لكل طلب)
  → projects/[id]/page  loadEntity(id, api.projects.get) + loadProjectFormOptions()
  → <ProjectForm> (client)

حفظ
  → handleSubmit (zod في المتصفح)
  → updateProject(id, payload)   Server Action
      → runAction → assertId → api.projects.update → PATCH /admin/projects/12
      → revalidatePath('/projects')
  → { ok: true } → toast + router.push('/projects')
  → { ok: false, fieldErrors } → الأخطاء على الحقول
```

## تجديد الجلسة في proxy.ts

- يقرأ `exp` من الـ access token (بدون تحقق — للتوقيت فقط) مع هامش 30 ثانية.
- عند الانتهاء: `POST /auth/refresh`، ثم `request.cookies.set(...)` (لكي ترى Server Components هذا الطلب الرمز الجديد) و `response.cookies.set(...)` (لحفظه في المتصفح).
- الطلبات المتزامنة مع نفس الـ refresh token مسموحة لمدة 10 ثوانٍ في الـ backend.

## طبقات lib

| الملف                            | المسؤولية                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `lib/api/client.ts`              | `apiRequest` (Bearer من الـ cookie، `X-Forwarded-For`، مهلة، `no-store`، `ApiError`) و `loadOrRedirect` |
| `lib/api/resources.ts`           | دوال مكتوبة الأنواع لكل endpoint (`api.projects.list()`…)                                               |
| `lib/api/errors.ts`              | ترجمة `code` إلى رسائل عربية وتحويل `details` إلى أخطاء حقول                                            |
| `lib/api/load.ts`                | `loadEntity`: معرف غير صالح أو 404 → صفحة not-found                                                     |
| `lib/actions/result.ts`          | `ActionResult`، `runAction`، `assertId(s)`                                                              |
| `lib/actions/content-actions.ts` | تنفيذ create/update/remove/reorder المشترك                                                              |
| `lib/auth/*`                     | الـ cookies، الجلسة، الصلاحيات، التحقق من `next`                                                        |

## رفع الصور

`ImageField` / `GalleryEditor` (client) → `uploadImageAction(formData)` → `POST /admin/uploads/images` → الرابط العام يُخزن في الحقل. حد جسم Server Actions `6mb` (`next.config.ts`).

## الأمان

- الـ headers: CSP بلا سكربتات خارجية، `X-Frame-Options: DENY`، `X-Robots-Tag: noindex`، HSTS في Production.
- `safeRedirectPath` يمنع open redirect بعد الدخول.
- كل Server Action تتحقق من مدخلاتها الحرجة والـ backend يتحقق من كل شيء.
