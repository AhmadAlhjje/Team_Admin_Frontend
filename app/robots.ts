import type { MetadataRoute } from 'next';

/** The admin dashboard must never be crawled or indexed. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
