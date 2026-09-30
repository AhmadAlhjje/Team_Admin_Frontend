import type { Metadata } from 'next';

import { PageHeader } from '@/components/shared/page-header';
import { TeamMemberForm } from '@/components/team/team-member-form';

export const metadata: Metadata = { title: 'إضافة عضو' };

export default function NewTeamMemberPage() {
  return (
    <>
      <PageHeader title="إضافة عضو" back={{ href: '/team', label: 'الفريق' }} />
      <TeamMemberForm />
    </>
  );
}
