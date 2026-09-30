'use server';

import { api } from '@/lib/api/resources';
import type { UploadedImage } from '@/types/api';

import { type ActionResult, runAction } from './result';

const FOLDERS = new Set(['team', 'projects', 'clients', 'achievements', 'testimonials', 'settings']);

/** Forwards an image to the backend, which validates and optimizes it. */
export async function uploadImageAction(formData: FormData): Promise<ActionResult<UploadedImage>> {
  const file = formData.get('file');
  const folder = formData.get('folder');

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: 'اختر صورة لرفعها.' };
  }
  if (typeof folder !== 'string' || !FOLDERS.has(folder)) {
    return { ok: false, message: 'وجهة الرفع غير صالحة.' };
  }

  const payload = new FormData();
  payload.set('folder', folder);
  payload.set('file', file, file.name);

  return runAction(() => api.uploads.image(payload));
}
