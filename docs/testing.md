# Testing

## Unit & component — `npm test`

Vitest (Node افتراضياً، و jsdom لملفات المكونات عبر `// @vitest-environment jsdom`):

| الملف                                 | ما يثبته                                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `lib/auth/auth.test.ts`               | قراءة انتهاء الـ JWT، هامش التجديد، الحماية من open redirect، الصلاحيات                |
| `lib/validation/schemas.test.ts`      | تحويل قيم النماذج إلى payload، slugs، روابط غير آمنة، التواريخ، الموافقة، كلمات المرور |
| `lib/helpers.test.ts`                 | إعادة الترتيب، اقتراح الـ slug، `parseId`، ترجمة أخطاء الـ API                         |
| `components/forms/tag-input.test.tsx` | إضافة/حذف الوسوم بلوحة المفاتيح ومنع التكرار                                           |

## End-to-end — `npm run test:e2e`

Playwright في متصفح حقيقي، يشغّل `next dev` تلقائياً. يحتاج الـ backend يعمل وحساب `SUPER_ADMIN`:

```bash
E2E_ADMIN_EMAIL=admin@example.com E2E_ADMIN_PASSWORD='…' npm run test:e2e
# لاستخدام Chrome المثبت بدل Chromium المرفق:
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

- `auth.setup.ts` يسجل الدخول مرة واحدة ويحفظ الجلسة (الـ backend يحد الدخول بـ 10/دقيقة).
- `auth.spec.ts`: التحويل إلى الدخول، كلمة مرور خاطئة، العودة للصفحة المطلوبة، cookies httpOnly، الخروج.
- `content.spec.ts`: عضو فريق كامل مع رفع صورة وتعديل وحذف، رسائل التحقق العربية، منع نشر عميل بلا موافقة، نشر مشروع والتحقق منه عبر الـ API العام.
- `settings-and-inbox.spec.ts`: حفظ الإعدادات واستمرارها، فتح رسالة جديدة يعلّمها مقروءة.

الاختبارات تنشئ بياناتها وتحذفها؛ شغّلها على بيئة تطوير/اختبار وليس Production.
