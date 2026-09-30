# ROLE.md — Admin (لوحة التحكم)

> **قبل تعديل أي جزء من المشروع، اقرأ ROLE.md الخاص بهذا المشروع.**
>
> لا يجوز تغيير الـ Architecture بشكل عشوائي. إذا كان هناك سبب قوي لتغييرها:
> افهم النظام الحالي ← ادرس التأثير ← اختر الحل الأبسط ← حدّث ROLE.md والـ Documentation.

---

## 1. دور المشروع

`admin/` لوحة تحكم مستقلة لإدارة كل محتوى الموقع **بدون تعديل الكود**: الفريق، المشاريع، الخدمات، الإنجازات، العملاء، آراء العملاء، الأسئلة الشائعة، الرسائل، إعدادات الموقع، والمستخدمين.

- لا تتصل بقاعدة البيانات أبداً — كل شيء عبر الـ Backend API.
- لا علاقة لها بـ `frontend/` (لا ملفات مشتركة).
- لا تحتاج SEO: `noindex` في الـ metadata والـ headers و robots.txt.
- الأولويات: الإنتاجية ← تجربة الاستخدام ← الموثوقية ← الأمان.
- الواجهة بالعربية (RTL).

## 2. التقنيات

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · shadcn/ui (Radix، RTL) · react-hook-form + zod · sonner · lucide-react · Vitest + Testing Library · Playwright.

## 3. المعمارية: Backend-for-Frontend (BFF)

```text
المتصفح ──(cookies httpOnly على نطاق لوحة التحكم)──► admin (Next.js server)
                                                        │  Server Components تقرأ البيانات
                                                        │  Server Actions تنفذ التعديلات
                                                        ▼  Authorization: Bearer <access token>
                                                     backend /api/v1
```

- **الرموز لا تصل إلى JavaScript المتصفح أبداً**: تُخزن في `tp_admin_at` / `tp_admin_rt` (httpOnly, SameSite=Lax, Secure في Production).
- المتصفح لا يتصل بالـ API مباشرة → لا حاجة لـ CORS للوحة التحكم.
- CSRF: Server Actions تتحقق من الـ Origin تلقائياً + SameSite cookies.
- قراءة البيانات: Server Components عبر `lib/api/resources.ts` (`cache: 'no-store'` — بيانات حية دائماً).
- الكتابة: Server Actions في `app/(dashboard)/<section>/actions.ts`.

## 4. هيكل المجلدات

```text
admin/
├── app/
│   ├── layout.tsx               ← lang="ar" dir="rtl"، الخط، Providers
│   ├── login/                   ← صفحة الدخول (useActionState)
│   ├── (dashboard)/             ← كل الصفحات المحمية
│   │   ├── layout.tsx           ← يتحقق من الجلسة، Sidebar + Header
│   │   ├── page.tsx             ← الرئيسية (إحصائيات + آخر الرسائل)
│   │   ├── <section>/page.tsx   ← القائمة
│   │   ├── <section>/new/       ← إنشاء
│   │   ├── <section>/[id]/      ← تعديل
│   │   ├── <section>/actions.ts ← Server Actions للقسم
│   │   ├── loading.tsx  error.tsx
│   ├── not-found.tsx  global-error.tsx  robots.ts
├── proxy.ts                     ← بوابة الجلسة + تجديد الرموز تلقائياً
├── assets/fonts/                ← IBM Plex Sans Arabic (woff2) + OFL.txt
├── components/
│   ├── brand/                   ← BrandMark (رمز الهوية، مطابق للموقع)
│   ├── ui/                      ← shadcn/ui (لا تعدّلها إلا عند الضرورة)
│   ├── layout/                  ← Sidebar, MobileNav, UserMenu, Providers
│   ├── forms/                   ← FormField, TextField, ImageField, TagInput, SocialLinksEditor…
│   ├── shared/                  ← ManagedTable, StatusBadge, PageHeader, ConfirmDialog…
│   └── <section>/               ← نموذج كل قسم (<entity>-form.tsx)
├── lib/
│   ├── api/                     ← client.ts (BFF fetch), resources.ts, errors.ts, load.ts
│   ├── actions/                 ← result.ts, content-actions.ts, session-actions.ts, upload-actions.ts
│   ├── auth/                    ← tokens.ts, session.ts, permissions.ts, redirect.ts
│   ├── validation/              ← schemas.ts (zod) + common.ts
│   ├── constants/               ← env, labels (عربي), navigation
│   └── fonts.ts                 ← الخطوط المحلية (next/font/local)
├── hooks/                       ← use-action-feedback, use-slug-suggestion
├── types/api.ts                 ← عقد الـ Admin API
├── e2e/                         ← Playwright
└── docs/
```

## 5. Authentication

| الحالة                             | ما يحدث                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| تسجيل الدخول                       | `loginAction` → `POST /auth/login` → كتابة الـ cookies → `redirect(next)` (مسار داخلي آمن فقط) |
| كل طلب                             | `proxy.ts`: access token صالح → متابعة                                                         |
| access token منتهٍ + refresh موجود | `proxy.ts` يستدعي `/auth/refresh`، يكتب الرموز الجديدة في الطلب الحالي والاستجابة              |
| لا جلسة صالحة                      | redirect إلى `/login?next=...` وحذف الـ cookies                                                |
| 401 أثناء render أو action         | `loadOrRedirect` / `runAction` → `/login`                                                      |
| تسجيل الخروج                       | `logoutAction` → إلغاء الجلسة في الـ backend + حذف الـ cookies                                 |
| تغيير كلمة المرور                  | الـ backend ينهي الجلسات الأخرى ويعيد جلسة جديدة تُكتب في الـ cookies                          |

الـ proxy للراحة فقط: **الـ backend يتحقق من كل طلب**.

## 6. Permissions

- `getCurrentUser()` (مرة واحدة لكل طلب) يعيد `permissions` من الـ backend.
- القائمة الجانبية تخفي ما لا يملكه المستخدم؛ الصفحات تعرض `<Forbidden />` عبر `can(user, Permission.X)`.
- الـ backend هو من يفرض الصلاحيات فعلياً. `ADMIN`: المحتوى + الرسائل + الصور. `SUPER_ADMIN`: + الإعدادات + المستخدمين.

## 7. نمط CRUD

| الجزء           | الملف                                             | القاعدة                                                                                  |
| --------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| القائمة         | `page.tsx` (server)                               | `api.<resource>.list(status)` → `ManagedTable` (ترتيب + حذف) + `StatusTabs`              |
| الإنشاء/التعديل | `new/page.tsx`, `[id]/page.tsx`                   | يحمّل البيانات والخيارات ويمرر للنموذج                                                   |
| النموذج         | `components/<section>/<entity>-form.tsx` (client) | react-hook-form + `zodResolver(schema)` + `<entity>Defaults(entity)`                     |
| الحفظ           | `actions.ts`                                      | wrappers صريحة حول `contentActions(api.resource, '/path')`                               |
| النتيجة         | `ActionResult`                                    | `{ ok: true, data }` أو `{ ok: false, message, fieldErrors }` — لا ترمي للأخطاء المتوقعة |
| الرسائل         | `useActionFeedback(setError)`                     | toast نجاح/خطأ + أخطاء الحقول من الـ backend على الحقول                                  |

- الترتيب بأزرار أعلى/أسفل (accessible، بلا مكتبة drag-and-drop)، معطّل عند تصفية القائمة.
- الحذف دائماً مع تأكيد يشرح البديل (الأرشفة).
- المعرفات في Server Actions تُتحقق دائماً (`assertId`) — Server Actions endpoints عامة.

## 8. النماذج والتحقق

- مخطط zod لكل نموذج في `lib/validation/schemas.ts` يطابق قيود الـ DTO في الـ backend، برسائل عربية.
- قيم النموذج نصوص (`''` لحقل فارغ)؛ التحويلات (`optionalId`، السنة…) في الـ schema. `''` يُرسل كما هو والـ backend يحوله إلى `null`.
- `input` type للنموذج و `output` type للـ payload: `useForm<FormValues, unknown, Payload>`.
- الـ backend يتحقق مرة أخرى؛ أخطاؤه تُعرض على الحقول عبر `fieldErrors`.
- الـ slug يُقترح تلقائياً من العنوان اللاتيني أثناء الإنشاء حتى يعدّله المستخدم (`useSlugSuggestion`).
- `useWatch` لا `watch()` (متوافق مع React Compiler).

## 9. الواجهة

- shadcn/ui مع `rtl: true` و `Direction.Provider dir="rtl"` لـ Radix.
- **نفس هوية الموقع (dark)**: tokens shadcn في `app/globals.css` بألوان الموقع، و `<html class="dark">` حتى تتبع متغيرات `dark:` في shadcn الكلاس لا إعداد النظام. الأزرار الرئيسية بتدرج العلامة (CSS على `[data-slot=button][data-variant=default]`) ونصها داكن. الرمز `components/brand/brand-mark.tsx` في الشريط الجانبي وصفحة الدخول.
- لا ألوان `slate/white/gray` مباشرة: `text-foreground`، `text-muted-foreground`، `bg-card`، `bg-muted`، `text-destructive`… (ألوان الحالة: `emerald-400` / `amber-300`).
- الخط IBM Plex Sans Arabic محلي من `assets/fonts` عبر `lib/fonts.ts` (لا يعتمد على Google Fonts).
- `NativeSelect` للقوائم المنسدلة البسيطة (أسهل وأكثر وصولاً مع react-hook-form).
- كل حقل عبر `FormField`/`TextField`… (label + hint + خطأ مرتبط بـ `aria-describedby`).
- الصور في لوحة التحكم `<img>` عادية (معاينات صغيرة من أي مصدر) — مسموح هنا فقط.
- كل النصوص بالعربية؛ تسميات الحالات والأدوار في `lib/constants/labels.ts`.

## 10. متغيرات البيئة

`NEXT_PUBLIC_API_URL` (إلزامي)، `API_INTERNAL_URL`، `NEXT_PUBLIC_SITE_URL`، `ADMIN_ALLOWED_ORIGINS` — موثقة في `.env.example`.

## 11. النشر

VPS أو Vercel، منفصلة عن الموقع (نطاق فرعي مثل `admin.example.com`). انظر `docs/deployment.md`.

## 12. إضافة صفحة إدارة جديدة

الخطوات الكاملة مع أمثلة: [`docs/adding-a-page.md`](./docs/adding-a-page.md). باختصار:
endpoint + DTO في الـ backend ← النوع في `types/api.ts` ← `api.<resource>` في `resources.ts` ← schema + defaults ← `actions.ts` ← الصفحات الثلاث + النموذج ← عنصر في `navigation.ts` ← اختبار.

## 13. ممنوعات

- ❌ الاتصال بقاعدة البيانات، أو استدعاء الـ API من المتصفح مباشرة، أو تخزين الرموز في `localStorage`/cookies غير httpOnly.
- ❌ الاعتماد على `proxy.ts` وحده للحماية (الـ backend يتحقق دائماً).
- ❌ Server Action بدون التحقق من المعرفات أو بدون `runAction`.
- ❌ رمي أخطاء متوقعة من Server Actions بدل إرجاع `ActionResult`.
- ❌ نصوص إنجليزية في الواجهة، أو رسائل الـ backend الخام للمستخدم (استخدم `errorMessage`).
- ❌ Redux أو مكتبات state عامة — react-hook-form للنماذج وServer Components للبيانات.
- ❌ تعديل `components/ui` بدون سبب (هي كود shadcn قابل للتحديث).
