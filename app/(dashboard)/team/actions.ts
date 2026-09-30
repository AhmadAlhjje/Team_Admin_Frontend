'use server';

import { contentActions } from '@/lib/actions/content-actions';
import { api } from '@/lib/api/resources';
import type { TeamMemberPayload } from '@/lib/validation/schemas';

const team = contentActions<TeamMemberPayload>(api.team, '/team');

export async function createTeamMember(payload: TeamMemberPayload) {
  return team.create(payload);
}

export async function updateTeamMember(id: number, payload: TeamMemberPayload) {
  return team.update(id, payload);
}

export async function deleteTeamMember(id: number) {
  return team.remove(id);
}

export async function reorderTeam(ids: number[]) {
  return team.reorder(ids);
}
