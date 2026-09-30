import { z } from 'zod';

/**
 * Shared field rules. They mirror the backend DTO constraints so most mistakes
 * are caught in the browser with Arabic messages; the backend still validates
 * everything.
 */

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const requiredText = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, 'هذا الحقل مطلوب.')
    .min(min, `يجب ألا يقل عن ${min} أحرف.`)
    .max(max, `يجب ألا يزيد عن ${max} حرفاً.`);

/** Optional text: an empty string clears the value (the backend stores null). */
export const optionalText = (max: number) => z.string().trim().max(max, `يجب ألا يزيد عن ${max} حرفاً.`);

export const slug = (max = 160) =>
  z
    .string()
    .trim()
    .min(1, 'هذا الحقل مطلوب.')
    .max(max, `يجب ألا يزيد عن ${max} حرفاً.`)
    .regex(SLUG_PATTERN, 'استخدم أحرفاً إنجليزية صغيرة وأرقاماً وشرطات فقط، مثل: my-project');

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const optionalUrl = z
  .string()
  .trim()
  .max(500, 'الرابط طويل جداً.')
  .refine((value) => value === '' || isHttpUrl(value), 'أدخل رابطاً صحيحاً يبدأ بـ https://');

export const requiredUrl = z
  .string()
  .trim()
  .min(1, 'هذا الحقل مطلوب.')
  .max(500, 'الرابط طويل جداً.')
  .refine(isHttpUrl, 'أدخل رابطاً صحيحاً يبدأ بـ https://');

export const optionalDate = z
  .string()
  .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'أدخل تاريخاً صحيحاً.');

export const contentStatus = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

/** A <select> holding an optional numeric ID: "" → null, "12" → 12. */
export const optionalId = z.string().transform((value) => (value === '' ? null : Number(value)));

export const PHONE_PATTERN = /^\+?[\d\s()-]{6,40}$/;

export const optionalPhone = z
  .string()
  .trim()
  .refine((value) => value === '' || PHONE_PATTERN.test(value), 'أدخل رقم هاتف صحيحاً، مثل: +963 900 000 000');

export const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === '' || z.email().safeParse(value).success, 'أدخل بريداً إلكترونياً صحيحاً.');

export const socialPlatforms = [
  'WEBSITE',
  'GITHUB',
  'LINKEDIN',
  'X',
  'INSTAGRAM',
  'FACEBOOK',
  'YOUTUBE',
  'BEHANCE',
  'DRIBBBLE',
  'TELEGRAM',
  'WHATSAPP',
  'OTHER',
] as const;

export const socialLinkSchema = z.object({
  platform: z.enum(socialPlatforms),
  url: requiredUrl,
  label: optionalText(80),
});

export const tagList = (maxItems: number) =>
  z.array(z.string().trim().min(1).max(80, 'الوسم طويل جداً.')).max(maxItems, `الحد الأقصى ${maxItems} عنصراً.`);

/** Converts `null` from the API into the empty string used by inputs. */
export const text = (value: string | null | undefined): string => value ?? '';
