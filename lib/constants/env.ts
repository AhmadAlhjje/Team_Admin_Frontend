/**
 * Admin configuration from environment variables.
 * NEXT_PUBLIC_API_URL is inlined at build time (rebuild after changing it).
 */

function normalize(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

function required(name: string, value: string | undefined, developmentFallback: string): string {
  if (value?.trim()) return normalize(value);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable ${name}. See .env.example.`);
  }
  return developmentFallback;
}

/** Public URL of the backend API (also used to display uploaded images). */
export const publicApiUrl = required('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL, 'http://localhost:4000');

/**
 * URL for server-to-server calls. Set API_INTERNAL_URL when the admin and the
 * backend share a private network (e.g. http://127.0.0.1:4000).
 */
export const serverApiUrl = process.env.API_INTERNAL_URL?.trim()
  ? normalize(process.env.API_INTERNAL_URL)
  : publicApiUrl;

/** Link to the public website (shown in the admin header). */
export const websiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ? normalize(process.env.NEXT_PUBLIC_SITE_URL) : null;
