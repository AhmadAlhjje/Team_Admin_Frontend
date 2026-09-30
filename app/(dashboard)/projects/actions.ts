'use server';

import { contentActions } from '@/lib/actions/content-actions';
import { api } from '@/lib/api/resources';
import type { ProjectPayload } from '@/lib/validation/schemas';

const projects = contentActions<ProjectPayload>(api.projects, '/projects');

export async function createProject(payload: ProjectPayload) {
  return projects.create(payload);
}

export async function updateProject(id: number, payload: ProjectPayload) {
  return projects.update(id, payload);
}

export async function deleteProject(id: number) {
  return projects.remove(id);
}

export async function reorderProjects(ids: number[]) {
  return projects.reorder(ids);
}
