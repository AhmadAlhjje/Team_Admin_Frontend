import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/shared/page-header';
import { TeamMemberForm } from '@/components/team/team-member-form';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'تعديل عضو' };

export default async function EditTeamMemberPage({ params }: PageProps<'/team/[id]'>) {
  const member = await loadEntity((await params).id, api.team.get);

  return (
    <>
      <PageHeader title={member.name} description={member.role} back={{ href: '/team', label: 'الفريق' }} />
      {member.projects.length ? (
        <p className="mb-4 text-sm text-muted-foreground">
          شارك في:{' '}
          {member.projects.map((project, index) => (
            <span key={project.id}>
              {index > 0 ? '، ' : ''}
              <Link href={`/projects/${project.id}`} className="text-primary hover:underline">
                {project.title}
              </Link>
            </span>
          ))}
          <span className="text-muted-foreground"> — تُدار المشاركة من صفحة كل مشروع.</span>
        </p>
      ) : null}
      <TeamMemberForm member={member} />
    </>
  );
}
