# Deployment

لوحة التحكم تُنشر منفصلة عن الموقع، على نطاق فرعي (مثل `admin.example.com`) **عبر HTTPS فقط** (الـ cookies `Secure`).

## VPS

```bash
cd /srv/team-platform/admin
npm ci
cp .env.example .env.production
#   NEXT_PUBLIC_API_URL=https://api.example.com
#   API_INTERNAL_URL=http://127.0.0.1:4000     (إن كان الـ API على نفس الخادم)
#   NEXT_PUBLIC_SITE_URL=https://example.com
npm run build
PORT=3001 npm start          # أو: pm2 start npm --name team-admin -- start  (مع PORT=3001)
```

Nginx:

```nginx
server {
  server_name admin.example.com;
  client_max_body_size 6m;                       # رفع الصور عبر Server Actions
  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;     # مطلوب لتحقق Server Actions من الـ Origin
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

للحد من الدخول على مستوى كل زائر، أضف IP خادم لوحة التحكم إلى `TRUST_PROXY` في الـ backend (لوحة التحكم تمرر `X-Forwarded-For`).

## Vercel

Root Directory = `admin`، المتغيرات أعلاه (بدون `API_INTERNAL_URL`). الـ API يجب أن يكون متاحاً من الإنترنت.

## حماية إضافية (اختيارية)

- تقييد الوصول بـ IP أو VPN أو Basic Auth في Nginx.
- عدم ربط لوحة التحكم من الموقع العام (غير مربوطة حالياً، و robots يمنع الفهرسة).
