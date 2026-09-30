import { z } from 'zod';

import type { Achievement, Client, Faq, Project, Service, SiteSettings, TeamMember, Testimonial } from '@/types/api';

import {
  contentStatus,
  optionalDate,
  optionalEmail,
  optionalId,
  optionalPhone,
  optionalText,
  optionalUrl,
  requiredText,
  requiredUrl,
  slug,
  socialLinkSchema,
  tagList,
  text,
} from './common';

// -----------------------------------------------------------------------------
// Team
// -----------------------------------------------------------------------------

export const teamMemberSchema = z.object({
  name: requiredText(2, 120),
  slug: slug(120),
  role: requiredText(2, 120),
  specialization: optionalText(191),
  bio: optionalText(5000),
  avatarUrl: optionalUrl,
  status: contentStatus,
  skills: tagList(30),
  socialLinks: z.array(socialLinkSchema).max(12),
});

export type TeamMemberFormValues = z.input<typeof teamMemberSchema>;
export type TeamMemberPayload = z.output<typeof teamMemberSchema>;

export function teamMemberDefaults(member?: TeamMember): TeamMemberFormValues {
  return {
    name: text(member?.name),
    slug: text(member?.slug),
    role: text(member?.role),
    specialization: text(member?.specialization),
    bio: text(member?.bio),
    avatarUrl: text(member?.avatarUrl),
    status: member?.status ?? 'DRAFT',
    skills: member?.skills ?? [],
    socialLinks: (member?.socialLinks ?? []).map((link) => ({ ...link, label: text(link.label) })),
  };
}

// -----------------------------------------------------------------------------
// Services
// -----------------------------------------------------------------------------

export const serviceIcons = [
  'web',
  'mobile',
  'system',
  'desktop',
  'ai',
  'custom',
  'design',
  'cloud',
  'api',
  'consulting',
] as const;

export const serviceSchema = z.object({
  title: requiredText(2, 150),
  slug: slug(120),
  summary: requiredText(10, 400),
  description: optionalText(10000),
  icon: z.enum(serviceIcons),
  status: contentStatus,
  technologies: tagList(30),
});

export type ServiceFormValues = z.input<typeof serviceSchema>;
export type ServicePayload = z.output<typeof serviceSchema>;

export function serviceDefaults(service?: Service): ServiceFormValues {
  return {
    title: text(service?.title),
    slug: text(service?.slug),
    summary: text(service?.summary),
    description: text(service?.description),
    icon: (serviceIcons as readonly string[]).includes(service?.icon ?? '')
      ? (service?.icon as ServiceFormValues['icon'])
      : 'custom',
    status: service?.status ?? 'DRAFT',
    technologies: service?.technologies.map((technology) => technology.name) ?? [],
  };
}

// -----------------------------------------------------------------------------
// Projects
// -----------------------------------------------------------------------------

const projectImageSchema = z.object({
  url: requiredUrl,
  alt: optionalText(200),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
});

const projectFeatureSchema = z.object({
  title: requiredText(1, 200),
  description: optionalText(500),
});

const projectMemberSchema = z.object({
  teamMemberId: z
    .string()
    .min(1, 'اختر عضواً.')
    .transform((value) => Number(value)),
  role: optionalText(120),
});

export const projectSchema = z
  .object({
    title: requiredText(2, 160),
    slug: slug(160),
    summary: requiredText(10, 400),
    category: optionalText(100),
    phase: z.enum(['IN_PROGRESS', 'LIVE', 'COMPLETED']),
    status: contentStatus,
    isFeatured: z.boolean(),
    startDate: optionalDate,
    endDate: optionalDate,
    description: optionalText(20000),
    problem: optionalText(20000),
    solution: optionalText(20000),
    ourRole: optionalText(20000),
    results: optionalText(20000),
    coverImageUrl: optionalUrl,
    liveUrl: optionalUrl,
    repositoryUrl: optionalUrl,
    clientId: optionalId,
    seoTitle: optionalText(120),
    seoDescription: optionalText(200),
    ogImageUrl: optionalUrl,
    technologies: tagList(30),
    serviceIds: z.array(z.number().int().positive()).max(20),
    members: z
      .array(projectMemberSchema)
      .max(30)
      .refine(
        (members) => new Set(members.map((member) => member.teamMemberId)).size === members.length,
        'لا يمكن إضافة العضو نفسه مرتين.',
      ),
    images: z.array(projectImageSchema).max(30, 'الحد الأقصى 30 صورة.'),
    features: z.array(projectFeatureSchema).max(30),
  })
  .refine((project) => !project.startDate || !project.endDate || project.endDate >= project.startDate, {
    path: ['endDate'],
    message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.',
  });

export type ProjectFormValues = z.input<typeof projectSchema>;
export type ProjectPayload = z.output<typeof projectSchema>;

export function projectDefaults(project?: Project): ProjectFormValues {
  return {
    title: text(project?.title),
    slug: text(project?.slug),
    summary: text(project?.summary),
    category: text(project?.category),
    phase: project?.phase ?? 'COMPLETED',
    status: project?.status ?? 'DRAFT',
    isFeatured: project?.isFeatured ?? false,
    startDate: text(project?.startDate),
    endDate: text(project?.endDate),
    description: text(project?.description),
    problem: text(project?.problem),
    solution: text(project?.solution),
    ourRole: text(project?.ourRole),
    results: text(project?.results),
    coverImageUrl: text(project?.coverImageUrl),
    liveUrl: text(project?.liveUrl),
    repositoryUrl: text(project?.repositoryUrl),
    clientId: project?.clientId ? String(project.clientId) : '',
    seoTitle: text(project?.seoTitle),
    seoDescription: text(project?.seoDescription),
    ogImageUrl: text(project?.ogImageUrl),
    technologies: project?.technologies ?? [],
    serviceIds: project?.services.map((service) => service.id) ?? [],
    members: (project?.members ?? []).map((member) => ({
      teamMemberId: String(member.teamMemberId),
      role: text(member.role),
    })),
    images: (project?.images ?? []).map((image) => ({ ...image, alt: text(image.alt) })),
    features: (project?.features ?? []).map((feature) => ({ ...feature, description: text(feature.description) })),
  };
}

// -----------------------------------------------------------------------------
// Achievements
// -----------------------------------------------------------------------------

export const achievementTypes = ['COMPETITION', 'AWARD', 'CERTIFICATION', 'MILESTONE', 'OTHER'] as const;

export const achievementSchema = z.object({
  title: requiredText(2, 200),
  type: z.enum(achievementTypes),
  highlight: optionalText(120),
  issuer: optionalText(150),
  date: optionalDate,
  description: optionalText(5000),
  imageUrl: optionalUrl,
  proofUrl: optionalUrl,
  projectId: optionalId,
  status: contentStatus,
});

export type AchievementFormValues = z.input<typeof achievementSchema>;
export type AchievementPayload = z.output<typeof achievementSchema>;

export function achievementDefaults(achievement?: Achievement): AchievementFormValues {
  return {
    title: text(achievement?.title),
    type: achievement?.type ?? 'OTHER',
    highlight: text(achievement?.highlight),
    issuer: text(achievement?.issuer),
    date: text(achievement?.date),
    description: text(achievement?.description),
    imageUrl: text(achievement?.imageUrl),
    proofUrl: text(achievement?.proofUrl),
    projectId: achievement?.projectId ? String(achievement.projectId) : '',
    status: achievement?.status ?? 'DRAFT',
  };
}

// -----------------------------------------------------------------------------
// Clients
// -----------------------------------------------------------------------------

export const clientSchema = z
  .object({
    name: requiredText(1, 150),
    logoUrl: optionalUrl,
    websiteUrl: optionalUrl,
    industry: optionalText(120),
    description: optionalText(2000),
    hasDisplayConsent: z.boolean(),
    status: contentStatus,
  })
  .refine((client) => client.status !== 'PUBLISHED' || client.hasDisplayConsent, {
    path: ['hasDisplayConsent'],
    message: 'لا يمكن النشر قبل الحصول على موافقة العميل.',
  });

export type ClientFormValues = z.input<typeof clientSchema>;
export type ClientPayload = z.output<typeof clientSchema>;

export function clientDefaults(client?: Client): ClientFormValues {
  return {
    name: text(client?.name),
    logoUrl: text(client?.logoUrl),
    websiteUrl: text(client?.websiteUrl),
    industry: text(client?.industry),
    description: text(client?.description),
    hasDisplayConsent: client?.hasDisplayConsent ?? false,
    status: client?.status ?? 'DRAFT',
  };
}

// -----------------------------------------------------------------------------
// Testimonials
// -----------------------------------------------------------------------------

export const testimonialSchema = z
  .object({
    authorName: requiredText(2, 120),
    authorTitle: optionalText(120),
    company: optionalText(150),
    content: requiredText(10, 3000),
    avatarUrl: optionalUrl,
    projectId: optionalId,
    hasDisplayConsent: z.boolean(),
    status: contentStatus,
  })
  .refine((testimonial) => testimonial.status !== 'PUBLISHED' || testimonial.hasDisplayConsent, {
    path: ['hasDisplayConsent'],
    message: 'لا يمكن النشر قبل الحصول على موافقة العميل.',
  });

export type TestimonialFormValues = z.input<typeof testimonialSchema>;
export type TestimonialPayload = z.output<typeof testimonialSchema>;

export function testimonialDefaults(testimonial?: Testimonial): TestimonialFormValues {
  return {
    authorName: text(testimonial?.authorName),
    authorTitle: text(testimonial?.authorTitle),
    company: text(testimonial?.company),
    content: text(testimonial?.content),
    avatarUrl: text(testimonial?.avatarUrl),
    projectId: testimonial?.projectId ? String(testimonial.projectId) : '',
    hasDisplayConsent: testimonial?.hasDisplayConsent ?? false,
    status: testimonial?.status ?? 'DRAFT',
  };
}

// -----------------------------------------------------------------------------
// FAQs
// -----------------------------------------------------------------------------

export const faqSchema = z.object({
  question: requiredText(5, 300),
  answer: requiredText(5, 5000),
  status: contentStatus,
});

export type FaqFormValues = z.input<typeof faqSchema>;
export type FaqPayload = z.output<typeof faqSchema>;

export function faqDefaults(faq?: Faq): FaqFormValues {
  return { question: text(faq?.question), answer: text(faq?.answer), status: faq?.status ?? 'DRAFT' };
}

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------

const currentYear = new Date().getFullYear();

export const generalSettingsSchema = z.object({
  siteName: requiredText(1, 120),
  tagline: optionalText(200),
  description: optionalText(500),
  logoUrl: optionalUrl,
  defaultOgImageUrl: optionalUrl,
  foundedYear: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || (/^\d{4}$/.test(value) && Number(value) >= 1990 && Number(value) <= currentYear),
      `أدخل سنة بين 1990 و ${currentYear}.`,
    )
    .transform((value) => (value === '' ? null : Number(value))),
});

export const contactSettingsSchema = z.object({
  email: optionalEmail,
  phone: optionalPhone,
  whatsapp: optionalPhone,
  location: optionalText(200),
});

export const homepageSettingsSchema = z.object({
  heroTitle: optionalText(200),
  heroSubtitle: optionalText(500),
  aboutTitle: optionalText(200),
  aboutSummary: optionalText(1000),
  aboutContent: optionalText(20000),
  ctaTitle: optionalText(200),
  ctaSubtitle: optionalText(500),
});

export const processStepsSchema = z.object({
  steps: z.array(z.object({ title: requiredText(1, 150), description: optionalText(500) })).max(12),
});

export const socialLinksSchema = z.object({ links: z.array(socialLinkSchema).max(20) });

export function settingsDefaults(settings: SiteSettings) {
  return {
    general: {
      siteName: settings.siteName,
      tagline: text(settings.tagline),
      description: text(settings.description),
      logoUrl: text(settings.logoUrl),
      defaultOgImageUrl: text(settings.defaultOgImageUrl),
      foundedYear: settings.foundedYear ? String(settings.foundedYear) : '',
    },
    contact: {
      email: text(settings.email),
      phone: text(settings.phone),
      whatsapp: text(settings.whatsapp),
      location: text(settings.location),
    },
    homepage: {
      heroTitle: text(settings.heroTitle),
      heroSubtitle: text(settings.heroSubtitle),
      aboutTitle: text(settings.aboutTitle),
      aboutSummary: text(settings.aboutSummary),
      aboutContent: text(settings.aboutContent),
      ctaTitle: text(settings.ctaTitle),
      ctaSubtitle: text(settings.ctaSubtitle),
    },
    steps: { steps: settings.processSteps.map((step) => ({ title: step.title, description: text(step.description) })) },
    social: { links: settings.socialLinks.map((link) => ({ ...link, label: text(link.label) })) },
  };
}

// -----------------------------------------------------------------------------
// Users & account
// -----------------------------------------------------------------------------

export const PASSWORD_MIN_LENGTH = 12;

const password = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `كلمة المرور يجب ألا تقل عن ${PASSWORD_MIN_LENGTH} حرفاً.`)
  .max(128, 'كلمة المرور طويلة جداً.');

export const createUserSchema = z.object({
  name: requiredText(2, 120),
  email: z.string().trim().toLowerCase().pipe(z.email('أدخل بريداً إلكترونياً صحيحاً.')),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
  password,
});

export const updateUserSchema = z.object({
  name: requiredText(2, 120),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
  isActive: z.boolean(),
  password: z.union([z.literal(''), password]),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'أدخل كلمة المرور الحالية.'),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'كلمتا المرور غير متطابقتين.',
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: 'اختر كلمة مرور مختلفة عن الحالية.',
  });

export type CreateUserPayload = z.output<typeof createUserSchema>;
export type UpdateUserFormValues = z.input<typeof updateUserSchema>;
export type ChangePasswordValues = z.input<typeof changePasswordSchema>;
