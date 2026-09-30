'use client';

/** Last-resort boundary when the root layout itself fails. Must render <html>. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          margin: 0,
          background: '#070b14',
          colorScheme: 'dark',
        }}
      >
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', color: '#f3f6fc' }}>حدث خطأ غير متوقع</h1>
          <p style={{ color: '#8e9bb4' }}>أعد تحميل الصفحة. إذا استمرت المشكلة تحقق من تشغيل الخادم.</p>
          <button
            type="button"
            onClick={retry}
            style={{
              marginTop: '1rem',
              padding: '0.625rem 1.25rem',
              background: 'linear-gradient(120deg, #67e8f9, #60a5fa 48%, #818cf8)',
              color: '#04101f',
              fontWeight: 700,
              border: 0,
              borderRadius: 999,
              cursor: 'pointer',
            }}
          >
            حاول مجدداً
          </button>
        </div>
      </body>
    </html>
  );
}
