/**
 * Admin API contract. Mirrors backend/src/modules/<module>/dto/*.dto.ts
 * (admin response DTOs). Update together with the backend.
 */

export type Role = 'SUPER_ADMIN' | 'ADMIN';
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ProjectPhase = 'IN_PROGRESS' | 'LIVE' | 'COMPLETED';
export type AchievementType = 'COMPETITION' | 'AWARD' | 'CERTIFICATION' | 'MILESTONE' | 'OTHER';
export type MessageStatus = 'UNREAD' | 'READ' | 'ARCHIVED';
export type SocialPlatform =
  | 'WEBSITE'
  | 'GITHUB'
  | 'LINKEDIN'
  | 'X'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'YOUTUBE'
  | 'BEHANCE'
  | 'DRIBBBLE'
  | 'TELEGRAM'
  | 'WHATSAPP'
  | 'OTHER';

export type UploadFolder = 'team' | 'projects' | 'clients' | 'achievements' | 'testimonials' | 'settings';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: Role;
  permissions: string[];
}

export interface AuthSession {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string | null;
}

export interface TeamMember {
  id: number;
  slug: string;
  name: string;
  role: string;
  specialization: string | null;
  bio: string | null;
  avatarUrl: string | null;
  status: ContentStatus;
  sortOrder: number;
  skills: string[];
  socialLinks: SocialLink[];
  projects: Array<{ id: number; slug: string; title: string; status: ContentStatus; contribution: string | null }>;
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  id: number;
  name: string;
  slug: string;
}

export interface Service {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  icon: string;
  status: ContentStatus;
  sortOrder: number;
  technologies: Array<{ name: string; slug: string }>;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export interface ProjectFeature {
  title: string;
  description: string | null;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  ourRole: string | null;
  results: string | null;
  category: string | null;
  coverImageUrl: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  phase: ProjectPhase;
  status: ContentStatus;
  isFeatured: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  publishedAt: string | null;
  clientId: number | null;
  client: { id: number; name: string } | null;
  technologies: string[];
  services: Array<{ id: number; title: string }>;
  members: Array<{ teamMemberId: number; name: string; role: string | null }>;
  images: ProjectImage[];
  features: ProjectFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string | null;
  type: AchievementType;
  issuer: string | null;
  highlight: string | null;
  date: string | null;
  imageUrl: string | null;
  proofUrl: string | null;
  projectId: number | null;
  project: { id: number; slug: string; title: string } | null;
  status: ContentStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  industry: string | null;
  description: string | null;
  hasDisplayConsent: boolean;
  status: ContentStatus;
  sortOrder: number;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: number;
  authorName: string;
  authorTitle: string | null;
  company: string | null;
  content: string;
  avatarUrl: string | null;
  hasDisplayConsent: boolean;
  projectId: number | null;
  project: { id: number; slug: string; title: string } | null;
  status: ContentStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  status: ContentStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectType: string | null;
  budget: string | null;
  message: string;
  status: MessageStatus;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessagePage {
  items: ContactMessage[];
  total: number;
  page: number;
  pageSize: number;
  unreadCount: number;
}

export interface ProcessStep {
  title: string;
  description: string | null;
}

export interface SiteSettings {
  siteName: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  aboutTitle: string | null;
  aboutSummary: string | null;
  aboutContent: string | null;
  ctaTitle: string | null;
  ctaSubtitle: string | null;
  foundedYear: number | null;
  defaultOgImageUrl: string | null;
  socialLinks: SocialLink[];
  processSteps: ProcessStep[];
  updatedAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StatusCounts {
  published: number;
  draft: number;
  archived: number;
}

export interface Dashboard {
  projects: StatusCounts;
  teamMembers: StatusCounts;
  publishedServices: number;
  publishedAchievements: number;
  publishedTestimonials: number;
  publishedClients: number;
  publishedFaqs: number;
  messages: { unread: number; total: number } | null;
  recentMessages: Array<{
    id: number;
    name: string;
    projectType: string | null;
    status: MessageStatus;
    createdAt: string;
  }>;
}

export interface UploadedImage {
  url: string;
  key: string;
  width: number;
  height: number;
  size: number;
  contentType: string;
}

export interface ApiErrorBody {
  statusCode: number;
  code: string;
  error: string;
  message: string;
  details?: Array<{ field: string; messages: string[] }>;
  requestId?: string;
}
