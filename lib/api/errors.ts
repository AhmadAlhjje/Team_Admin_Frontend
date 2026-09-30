import type { ApiErrorBody } from '@/types/api';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: Array<{ field: string; messages: string[] }>;

  constructor(status: number, body: Partial<ApiErrorBody> | null) {
    super(body?.message ?? `API request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = body?.code ?? (status === 0 ? 'NETWORK_ERROR' : 'UNKNOWN');
    this.details = body?.details ?? [];
  }
}

/** Arabic messages for backend error codes (backend/src/common/errors/app-exception.ts). */
const MESSAGES: Record<string, string> = {
  VALIDATION_FAILED: 'بعض الحقول غير صحيحة. راجع الحقول المشار إليها.',
  BAD_REQUEST: 'الطلب غير صالح.',
  UNAUTHORIZED: 'انتهت الجلسة. سجّل الدخول مرة أخرى.',
  INVALID_CREDENTIALS: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  INVALID_REFRESH_TOKEN: 'انتهت الجلسة. سجّل الدخول مرة أخرى.',
  FORBIDDEN: 'ليست لديك صلاحية لتنفيذ هذا الإجراء.',
  NOT_FOUND: 'العنصر غير موجود أو تم حذفه.',
  CONFLICT: 'تعارض في البيانات.',
  DUPLICATE_VALUE: 'هذه القيمة مستخدمة مسبقاً.',
  IN_USE: 'لا يمكن الحذف لأن هذا العنصر مرتبط بعناصر أخرى. يمكنك أرشفته بدلاً من ذلك.',
  INVALID_REFERENCE: 'أحد العناصر المرتبطة غير موجود.',
  CONSENT_REQUIRED: 'لا يمكن النشر قبل الحصول على موافقة صاحب العلاقة على الظهور في الموقع.',
  LAST_SUPER_ADMIN: 'يجب أن يبقى مدير عام واحد نشط على الأقل.',
  SELF_MODIFICATION: 'لا يمكنك تعطيل حسابك أو تغيير دورك أو حذف حسابك.',
  INVALID_FILE: 'الملف غير صالح. المسموح: صور JPEG أو PNG أو WebP أو AVIF أو GIF.',
  INVALID_ENCODING: 'تعذّر قراءة النص المرسل: يجب أن يكون بترميز UTF-8.',
  PAYLOAD_TOO_LARGE: 'حجم الملف أكبر من المسموح.',
  TOO_MANY_REQUESTS: 'محاولات كثيرة خلال وقت قصير. حاول مرة أخرى بعد قليل.',
  SERVICE_UNAVAILABLE: 'الخدمة غير متاحة حالياً. حاول لاحقاً.',
  NETWORK_ERROR: 'تعذّر الاتصال بالخادم. تحقق من تشغيل الـ API.',
};

const FIELD_MESSAGES: Record<string, string> = {
  DUPLICATE_VALUE: 'هذه القيمة مستخدمة مسبقاً.',
  CONSENT_REQUIRED: 'مطلوبة قبل النشر.',
  INVALID_REFERENCE: 'العنصر المحدد غير موجود.',
};

export function errorMessage(error: ApiError): string {
  return MESSAGES[error.code] ?? 'حدث خطأ غير متوقع. حاول مرة أخرى.';
}

/** Maps backend field errors to form field errors (field names match the DTOs). */
export function fieldErrors(error: ApiError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const detail of error.details) {
    result[detail.field] = FIELD_MESSAGES[error.code] ?? 'القيمة غير صالحة.';
  }
  return result;
}
