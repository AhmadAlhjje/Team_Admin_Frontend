'use client';

import { PlusIcon } from 'lucide-react';
import { type Control, type FieldErrors, type UseFormRegister, useFieldArray } from 'react-hook-form';

import { ArrayItemControls } from '@/components/forms/array-item-controls';
import { NativeSelect } from '@/components/forms/native-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contentStatusLabels } from '@/lib/constants/labels';
import type { ProjectFormValues, ProjectPayload } from '@/lib/validation/schemas';
import type { ContentStatus } from '@/types/api';

export function MembersEditor({
  control,
  register,
  errors,
  teamMembers,
}: {
  control: Control<ProjectFormValues, unknown, ProjectPayload>;
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>['members'];
  teamMembers: Array<{ id: number; name: string; status: string }>;
}) {
  const { fields, append, remove, move } = useFieldArray({ control, name: 'members' });

  if (teamMembers.length === 0) {
    return <p className="text-sm text-muted-foreground">أضف أعضاء الفريق أولاً من صفحة «الفريق».</p>;
  }

  return (
    <div className="space-y-3">
      {errors?.root?.message || errors?.message ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {errors?.root?.message ?? errors?.message}
        </p>
      ) : null}
      {fields.map((field, index) => {
        const memberError = errors?.[index]?.teamMemberId?.message;
        return (
          <div key={field.id} className="flex items-start gap-2 rounded-lg border border-border p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <NativeSelect
                  aria-label={`العضو ${index + 1}`}
                  aria-invalid={Boolean(memberError)}
                  {...register(`members.${index}.teamMemberId`)}
                >
                  <option value="">اختر عضواً</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={String(member.id)}>
                      {member.name}
                      {member.status !== 'PUBLISHED' ? ` (${contentStatusLabels[member.status as ContentStatus]})` : ''}
                    </option>
                  ))}
                </NativeSelect>
                {memberError ? (
                  <p role="alert" className="text-xs font-medium text-destructive">
                    {memberError}
                  </p>
                ) : null}
              </div>
              <Input
                placeholder="دوره في المشروع، مثل: Backend & API"
                aria-label={`دور العضو ${index + 1} في المشروع`}
                {...register(`members.${index}.role`)}
              />
            </div>
            <ArrayItemControls
              index={index}
              count={fields.length}
              label={`العضو ${index + 1}`}
              onMove={move}
              onRemove={remove}
            />
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={fields.length >= teamMembers.length}
        onClick={() => append({ teamMemberId: '', role: '' })}
      >
        <PlusIcon aria-hidden="true" />
        إضافة عضو
      </Button>
      <p className="text-xs text-muted-foreground">الأعضاء غير المنشورين لا يظهرون في صفحة المشروع العامة.</p>
    </div>
  );
}
