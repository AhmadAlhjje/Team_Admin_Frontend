import localFont from 'next/font/local';

/*
 * IBM Plex Sans Arabic, self-hosted from assets/fonts (SIL Open Font License,
 * see OFL.txt there) so the dashboard never depends on reaching Google Fonts.
 * Split per script like Google Fonts serves it: Latin first in the stack
 * (digits, emails, technology names), Arabic preloaded.
 *
 * Font loader options must be written as literals (no shared constants).
 */

export const plexLatin = localFont({
  src: [
    { path: '../assets/fonts/ibm-plex-sans-arabic/latin-400.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-arabic/latin-500.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-arabic/latin-600.woff2', weight: '600', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-arabic/latin-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-plex-latin',
  display: 'swap',
  preload: false,
  // The Arabic family below provides the metric-adjusted fallback.
  adjustFontFallback: false,
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
  ],
});

export const plexArabic = localFont({
  src: [
    { path: '../assets/fonts/ibm-plex-sans-arabic/arabic-400.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-arabic/arabic-500.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-arabic/arabic-600.woff2', weight: '600', style: 'normal' },
    { path: '../assets/fonts/ibm-plex-sans-arabic/arabic-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-plex-arabic',
  display: 'swap',
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC',
    },
  ],
});

/** Class names that declare both CSS variables on <html>. */
export const fontVariables = `${plexLatin.variable} ${plexArabic.variable}`;
