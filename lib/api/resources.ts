import 'server-only';

import type {
  AchievementPayload,
  ClientPayload,
  CreateUserPayload,
  FaqPayload,
  ProjectPayload,
  ServicePayload,
  TeamMemberPayload,
  TestimonialPayload,
} from '@/lib/validation/schemas';
import type {
  Achievement,
  AdminUser,
  AuthSession,
  AuthUser,
  Client,
  ContactMessage,
  ContactMessagePage,
  ContentStatus,
  Dashboard,
  Faq,
  MessageStatus,
  Project,
  Service,
  SiteSettings,
  TeamMember,
  Technology,
  Testimonial,
  UploadedImage,
} from '@/types/api';

import { apiRequest } from './client';

/** Standard CRUD + ordering endpoints of a content module (`/admin/<resource>`). */
function contentResource<TEntity, TPayload extends object>(base: string) {
  return {
    list: (status?: ContentStatus) => apiRequest<TEntity[]>(status ? `${base}?status=${status}` : base),
    get: (id: number) => apiRequest<TEntity>(`${base}/${id}`),
    create: (payload: TPayload) => apiRequest<TEntity>(base, { method: 'POST', body: { ...payload } }),
    update: (id: number, payload: Partial<TPayload>) =>
      apiRequest<TEntity>(`${base}/${id}`, { method: 'PATCH', body: { ...payload } }),
    remove: (id: number) => apiRequest<void>(`${base}/${id}`, { method: 'DELETE' }),
    reorder: (ids: number[]) => apiRequest<void>(`${base}/order`, { method: 'PUT', body: { ids } }),
  };
}

/** The subset of a content resource used by the generic Server Actions. */
export interface ContentResource<TPayload> {
  create(payload: TPayload): Promise<{ id: number }>;
  update(id: number, payload: Partial<TPayload>): Promise<unknown>;
  remove(id: number): Promise<void>;
  reorder(ids: number[]): Promise<void>;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiRequest<AuthSession>('/auth/login', { method: 'POST', body: { email, password }, anonymous: true }),
    logout: (refreshToken: string) =>
      apiRequest<void>('/auth/logout', { method: 'POST', body: { refreshToken }, anonymous: true }),
    me: () => apiRequest<AuthUser>('/auth/me'),
    changePassword: (currentPassword: string, newPassword: string) =>
      apiRequest<AuthSession>('/auth/password', { method: 'PATCH', body: { currentPassword, newPassword } }),
  },
  dashboard: () => apiRequest<Dashboard>('/admin/dashboard'),
  team: contentResource<TeamMember, TeamMemberPayload>('/admin/team'),
  projects: contentResource<Project, ProjectPayload>('/admin/projects'),
  services: contentResource<Service, ServicePayload>('/admin/services'),
  achievements: contentResource<Achievement, AchievementPayload>('/admin/achievements'),
  clients: contentResource<Client, ClientPayload>('/admin/clients'),
  testimonials: contentResource<Testimonial, TestimonialPayload>('/admin/testimonials'),
  faqs: contentResource<Faq, FaqPayload>('/admin/faqs'),
  technologies: () => apiRequest<Technology[]>('/admin/technologies'),
  messages: {
    list: (params: { status?: MessageStatus; page?: number; search?: string }) => {
      const query = new URLSearchParams();
      if (params.status) query.set('status', params.status);
      if (params.page && params.page > 1) query.set('page', String(params.page));
      if (params.search) query.set('search', params.search);
      const suffix = query.size ? `?${query.toString()}` : '';
      return apiRequest<ContactMessagePage>(`/admin/contact-messages${suffix}`);
    },
    get: (id: number) => apiRequest<ContactMessage>(`/admin/contact-messages/${id}`),
    setStatus: (id: number, status: MessageStatus) =>
      apiRequest<ContactMessage>(`/admin/contact-messages/${id}`, { method: 'PATCH', body: { status } }),
    remove: (id: number) => apiRequest<void>(`/admin/contact-messages/${id}`, { method: 'DELETE' }),
  },
  settings: {
    get: () => apiRequest<SiteSettings>('/admin/settings'),
    update: (payload: Record<string, unknown>) =>
      apiRequest<SiteSettings>('/admin/settings', { method: 'PATCH', body: payload }),
    replaceSocialLinks: (links: unknown[]) =>
      apiRequest<SiteSettings>('/admin/settings/social-links', { method: 'PUT', body: { links } }),
    replaceProcessSteps: (steps: unknown[]) =>
      apiRequest<SiteSettings>('/admin/settings/process-steps', { method: 'PUT', body: { steps } }),
  },
  users: {
    list: () => apiRequest<AdminUser[]>('/admin/users'),
    get: (id: number) => apiRequest<AdminUser>(`/admin/users/${id}`),
    create: (payload: CreateUserPayload) => apiRequest<AdminUser>('/admin/users', { method: 'POST', body: payload }),
    update: (id: number, payload: Record<string, unknown>) =>
      apiRequest<AdminUser>(`/admin/users/${id}`, { method: 'PATCH', body: payload }),
    remove: (id: number) => apiRequest<void>(`/admin/users/${id}`, { method: 'DELETE' }),
  },
  uploads: {
    image: (formData: FormData) =>
      apiRequest<UploadedImage>('/admin/uploads/images', { method: 'POST', body: formData }),
  },
};
