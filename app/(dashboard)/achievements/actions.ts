'use server';

import { contentActions } from '@/lib/actions/content-actions';
import { api } from '@/lib/api/resources';
import type { AchievementPayload } from '@/lib/validation/schemas';

const achievements = contentActions<AchievementPayload>(api.achievements, '/achievements');

export async function createAchievement(payload: AchievementPayload) {
  return achievements.create(payload);
}

export async function updateAchievement(id: number, payload: AchievementPayload) {
  return achievements.update(id, payload);
}

export async function deleteAchievement(id: number) {
  return achievements.remove(id);
}

export async function reorderAchievements(ids: number[]) {
  return achievements.reorder(ids);
}
