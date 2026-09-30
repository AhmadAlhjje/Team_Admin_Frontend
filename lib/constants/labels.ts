import type { AchievementType, ContentStatus, MessageStatus, ProjectPhase, Role, SocialPlatform } from '@/types/api';

export const contentStatusLabels: Record<ContentStatus, string> = {
  PUBLISHED: 'منشور',
  DRAFT: 'مسودة',
  ARCHIVED: 'مؤرشف',
};

export const contentStatusHints: Record<ContentStatus, string> = {
  PUBLISHED: 'يظهر في الموقع',
  DRAFT: 'مخفي — قيد التحضير',
  ARCHIVED: 'مخفي — محفوظ للأرشيف',
};

export const projectPhaseLabels: Record<ProjectPhase, string> = {
  IN_PROGRESS: 'قيد التطوير',
  LIVE: 'قيد الاستخدام',
  COMPLETED: 'مكتمل',
};

export const achievementTypeLabels: Record<AchievementType, string> = {
  COMPETITION: 'مسابقة',
  AWARD: 'جائزة',
  CERTIFICATION: 'شهادة',
  MILESTONE: 'محطة',
  OTHER: 'أخرى',
};

export const messageStatusLabels: Record<MessageStatus, string> = {
  UNREAD: 'غير مقروءة',
  READ: 'مقروءة',
  ARCHIVED: 'مؤرشفة',
};

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: 'مدير عام',
  ADMIN: 'مشرف محتوى',
};

export const roleDescriptions: Record<Role, string> = {
  SUPER_ADMIN: 'كل الصلاحيات، بما فيها إعدادات الموقع وإدارة المستخدمين.',
  ADMIN: 'إدارة المحتوى والرسائل ورفع الصور.',
};

export const socialPlatformLabels: Record<SocialPlatform, string> = {
  WEBSITE: 'موقع إلكتروني',
  GITHUB: 'GitHub',
  LINKEDIN: 'LinkedIn',
  X: 'X (Twitter)',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  YOUTUBE: 'YouTube',
  BEHANCE: 'Behance',
  DRIBBBLE: 'Dribbble',
  TELEGRAM: 'Telegram',
  WHATSAPP: 'WhatsApp',
  OTHER: 'أخرى',
};

export const serviceIconLabels: Record<string, string> = {
  web: 'ويب',
  mobile: 'موبايل',
  system: 'أنظمة',
  desktop: 'سطح المكتب',
  ai: 'ذكاء اصطناعي',
  custom: 'برمجيات مخصصة',
  design: 'تصميم',
  cloud: 'سحابة',
  api: 'API وتكامل',
  consulting: 'استشارات',
};
