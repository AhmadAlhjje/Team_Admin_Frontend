import 'server-only';

import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';

export interface ProjectFormOptions {
  teamMembers: Array<{ id: number; name: string; status: string }>;
  services: Array<{ id: number; title: string }>;
  clients: Array<{ id: number; name: string }>;
  technologies: string[];
}

/** Choices needed by the project form (members, services, clients, known technologies). */
export async function loadProjectFormOptions(): Promise<ProjectFormOptions> {
  const [teamMembers, services, clients, technologies] = await Promise.all([
    loadOrRedirect(api.team.list()),
    loadOrRedirect(api.services.list()),
    loadOrRedirect(api.clients.list()),
    loadOrRedirect(api.technologies()),
  ]);

  return {
    teamMembers: teamMembers.map((member) => ({ id: member.id, name: member.name, status: member.status })),
    services: services.map((service) => ({ id: service.id, title: service.title })),
    clients: clients.map((client) => ({ id: client.id, name: client.name })),
    technologies: technologies.map((technology) => technology.name),
  };
}
