/**
 * Suggests a URL slug from latin text ("Wafeer App" → "wafeer-app").
 * Returns "" for text without latin characters (e.g. Arabic titles), in which
 * case the admin types the slug manually.
 */
export function suggestSlug(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

/** Parses a positive integer route parameter, or null. */
export function parseId(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
