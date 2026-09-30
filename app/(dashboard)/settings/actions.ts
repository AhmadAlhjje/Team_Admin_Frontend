'use server';

import { revalidatePath } from 'next/cache';

import { runAction } from '@/lib/actions/result';
import { api } from '@/lib/api/resources';

/** Partial update of site settings; the backend whitelists and validates fields. */
export async function updateSettings(payload: Record<string, string | number | null>) {
  return runAction(async () => {
    await api.settings.update(payload);
    revalidatePath('/settings');
    return null;
  });
}

export async function replaceSocialLinks(links: Array<{ platform: string; url: string; label: string }>) {
  return runAction(async () => {
    await api.settings.replaceSocialLinks(links);
    revalidatePath('/settings');
    return null;
  });
}

export async function replaceProcessSteps(steps: Array<{ title: string; description: string }>) {
  return runAction(async () => {
    await api.settings.replaceProcessSteps(steps);
    revalidatePath('/settings');
    return null;
  });
}
