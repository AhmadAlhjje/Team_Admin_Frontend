import { describe, expect, it } from 'vitest';

import {
  changePasswordSchema,
  clientSchema,
  generalSettingsSchema,
  projectDefaults,
  projectSchema,
  teamMemberDefaults,
  teamMemberSchema,
} from './schemas';

const validProject = {
  ...projectDefaults(),
  title: 'Wafeer',
  slug: 'wafeer',
  summary: 'An ordering platform for local shops.',
};

describe('projectSchema', () => {
  it('converts form values into the API payload', () => {
    const payload = projectSchema.parse({
      ...validProject,
      clientId: '7',
      members: [{ teamMemberId: '3', role: 'Backend' }],
    });
    expect(payload.clientId).toBe(7);
    expect(payload.members).toEqual([{ teamMemberId: 3, role: 'Backend' }]);
  });

  it('maps an empty client select to null', () => {
    expect(projectSchema.parse(validProject).clientId).toBeNull();
  });

  it('rejects invalid slugs, unsafe URLs and inverted dates', () => {
    const result = projectSchema.safeParse({
      ...validProject,
      slug: 'Wafeer App',
      liveUrl: 'javascript:alert(1)',
      startDate: '2026-05-01',
      endDate: '2026-01-01',
    });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((issue) => issue.path.join('.'));
    expect(paths).toEqual(expect.arrayContaining(['slug', 'liveUrl', 'endDate']));
  });

  it('rejects the same team member twice', () => {
    const result = projectSchema.safeParse({
      ...validProject,
      members: [
        { teamMemberId: '3', role: '' },
        { teamMemberId: '3', role: '' },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe('clientSchema', () => {
  it('requires display consent before publishing', () => {
    const base = { name: 'Acme', logoUrl: '', websiteUrl: '', industry: '', description: '' };
    expect(clientSchema.safeParse({ ...base, hasDisplayConsent: false, status: 'PUBLISHED' }).success).toBe(false);
    expect(clientSchema.safeParse({ ...base, hasDisplayConsent: true, status: 'PUBLISHED' }).success).toBe(true);
    expect(clientSchema.safeParse({ ...base, hasDisplayConsent: false, status: 'DRAFT' }).success).toBe(true);
  });
});

describe('teamMemberSchema', () => {
  it('round-trips an existing member through the form defaults', () => {
    const values = teamMemberDefaults({
      id: 1,
      slug: 'ahmad',
      name: 'Ahmad',
      role: 'Software Engineer',
      specialization: null,
      bio: null,
      avatarUrl: null,
      status: 'PUBLISHED',
      sortOrder: 0,
      skills: ['TypeScript'],
      socialLinks: [{ platform: 'GITHUB', url: 'https://github.com/ahmad', label: null }],
      projects: [],
      createdAt: '',
      updatedAt: '',
    });
    expect(values.specialization).toBe('');
    expect(teamMemberSchema.safeParse(values).success).toBe(true);
  });
});

describe('settings & passwords', () => {
  it('parses the founding year and allows clearing it', () => {
    const base = { siteName: 'Team', tagline: '', description: '', logoUrl: '', defaultOgImageUrl: '' };
    expect(generalSettingsSchema.parse({ ...base, foundedYear: '2021' }).foundedYear).toBe(2021);
    expect(generalSettingsSchema.parse({ ...base, foundedYear: '' }).foundedYear).toBeNull();
    expect(generalSettingsSchema.safeParse({ ...base, foundedYear: '1850' }).success).toBe(false);
  });

  it('requires a long, confirmed and different new password', () => {
    const ok = {
      currentPassword: 'old-password-123',
      newPassword: 'new-password-456',
      confirmPassword: 'new-password-456',
    };
    expect(changePasswordSchema.safeParse(ok).success).toBe(true);
    expect(changePasswordSchema.safeParse({ ...ok, newPassword: 'short', confirmPassword: 'short' }).success).toBe(
      false,
    );
    expect(changePasswordSchema.safeParse({ ...ok, confirmPassword: 'different-password' }).success).toBe(false);
    expect(
      changePasswordSchema.safeParse({ ...ok, newPassword: ok.currentPassword, confirmPassword: ok.currentPassword })
        .success,
    ).toBe(false);
  });
});
