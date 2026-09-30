# Team Platform — Admin Dashboard

لوحة التحكم لإدارة محتوى الموقع: **Next.js 16 + shadcn/ui + react-hook-form/zod**، بالعربية (RTL).
تعمل كـ Backend-for-Frontend: الرموز في httpOnly cookies ولا تصل إلى JavaScript المتصفح.

> قبل أي تعديل اقرأ [`ROLE.md`](./ROLE.md).

|             |                                                                 |
| ----------- | --------------------------------------------------------------- |
| Development | `http://localhost:3001`                                         |
| يحتاج       | Backend API يعمل + حساب مدير (`npm run db:seed` في الـ backend) |
| Node.js     | 20.9+                                                           |

## التشغيل (Development)

```bash
npm install
cp .env.example .env.local
#   NEXT_PUBLIC_API_URL=http://localhost:4000
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000   (اختياري: رابط «عرض الموقع»)
npm run dev
```

ثم افتح `http://localhost:3001` وسجّل الدخول ببيانات `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` من الـ backend.

## Production

```bash
npm ci
npm run build
PORT=3001 npm start
```

## الأوامر

| الأمر                         | الوظيفة                                |
| ----------------------------- | -------------------------------------- |
| `npm run dev`                 | خادم التطوير على 3001                  |
| `npm run build` / `npm start` | Production (`PORT` للمنفذ)             |
| `npm run lint`                | ESLint                                 |
| `npm run typecheck`           | أنواع الـ routes + TypeScript          |
| `npm test`                    | Vitest (منطق + مكونات)                 |
| `npm run test:e2e`            | Playwright (يحتاج backend + حساب مدير) |
| `npm run format`              | Prettier                               |

## متغيرات البيئة

| المتغير                 | إلزامي | الوصف                                                    |
| ----------------------- | ------ | -------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`   | ✅     | رابط الـ API (للطلبات من الخادم وعرض الصور المرفوعة)     |
| `API_INTERNAL_URL`      |        | رابط داخلي للـ API على نفس الشبكة                        |
| `NEXT_PUBLIC_SITE_URL`  |        | رابط الموقع العام لأزرار «عرض الموقع»                    |
| `ADMIN_ALLOWED_ORIGINS` |        | نطاقات إضافية لـ Server Actions خلف proxy يغيّر الـ Host |

## الأقسام

الرئيسية · المشاريع · الفريق · الخدمات · الإنجازات · العملاء · آراء العملاء · الأسئلة الشائعة · الرسائل · إعدادات الموقع (مدير عام) · المستخدمون (مدير عام) · حسابي.

كل قسم محتوى يدعم: إضافة، تعديل، حذف (مع حماية المرتبط)، أرشفة/نشر/مسودة، ترتيب الظهور، رفع الصور.

## التوثيق

| الملف                                              | المحتوى                         |
| -------------------------------------------------- | ------------------------------- |
| [`ROLE.md`](./ROLE.md)                             | القواعد والمعمارية              |
| [`docs/architecture.md`](./docs/architecture.md)   | BFF، الجلسات، Server Actions    |
| [`docs/adding-a-page.md`](./docs/adding-a-page.md) | إضافة قسم إدارة جديد خطوة بخطوة |
| [`docs/testing.md`](./docs/testing.md)             | Vitest و Playwright             |
| [`docs/deployment.md`](./docs/deployment.md)       | VPS و Vercel                    |

## حل المشاكل

| المشكلة                                    | الحل                                                                                           |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| إعادة توجيه دائمة إلى `/login`             | الـ API غير متاح أو `NEXT_PUBLIC_API_URL` خاطئ؛ جرّب `curl $NEXT_PUBLIC_API_URL/api/v1/health` |
| «تعذّر الاتصال بالخادم»                    | الـ backend متوقف                                                                              |
| الجلسة لا تبقى في Production               | يجب HTTPS (الـ cookies `Secure`)                                                               |
| `Invalid Server Actions request` خلف proxy | الـ proxy يجب أن يمرر `X-Forwarded-Host`، أو أضف النطاق إلى `ADMIN_ALLOWED_ORIGINS`            |
| رفع صورة يفشل للصور الكبيرة                | الحد 5 MB (`UPLOAD_MAX_FILE_SIZE_MB` في الـ backend، و `client_max_body_size` في Nginx)        |
| «محاولات كثيرة» عند الدخول                 | انتظر 15 دقيقة، أو اضبط `TRUST_PROXY` في الـ backend إذا كان الجميع يتشارك IP واحداً           |
