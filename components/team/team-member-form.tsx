'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createTeamMember, updateTeamMember } from '@/app/(dashboard)/team/actions';
import { StatusField, TextAreaField, TextField } from '@/components/forms/fields';
import { FormActions } from '@/components/forms/form-actions';
import { describedBy, FormField } from '@/components/forms/form-field';
import { FormSection } from '@/components/forms/form-section';
import { ImageField } from '@/components/forms/image-field';
import { SocialLinksEditor } from '@/components/forms/social-links-editor';
import { TagInput } from '@/components/forms/tag-input';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { useSlugSuggestion } from '@/hooks/use-slug-suggestion';
import {
  type TeamMemberFormValues,
  type TeamMemberPayload,
  teamMemberDefaults,
  teamMemberSchema,
} from '@/lib/validation/schemas';
import type { TeamMember } from '@/types/api';

export function TeamMemberForm({ member }: { member?: TeamMember }) {
  const router = useRouter();
  const form = useForm<TeamMemberFormValues, unknown, TeamMemberPayload>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: teamMemberDefaults(member),
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getFieldState,
    formState: { errors, isSubmitting, isDirty },
  } = form;
  const feedback = useActionFeedback(form.setError);
  useSlugSuggestion({ control, setValue, getFieldState, source: 'name', enabled: !member });

  const onSubmit = handleSubmit(async (payload) => {
    const result = member ? await updateTeamMember(member.id, payload) : await createTeamMember(payload);
    if (feedback(result, member ? 'تم حفظ التعديلات' : 'تمت إضافة العضو')) {
      router.push('/team');
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="البيانات الأساسية">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="name" label="الاسم" required error={errors.name?.message} registration={register('name')} />
          <TextField
            id="slug"
            label="المعرّف (Slug)"
            required
            dir="ltr"
            hint="بالأحرف الإنجليزية، يُستخدم في رابط العضو. مثال: ahmad-ali"
            error={errors.slug?.message}
            registration={register('slug')}
          />
          <TextField
            id="role"
            label="الدور"
            required
            placeholder="Software Engineer"
            error={errors.role?.message}
            registration={register('role')}
          />
          <TextField
            id="specialization"
            label="التخصص"
            placeholder="Frontend / Backend / AI"
            error={errors.specialization?.message}
            registration={register('specialization')}
          />
        </div>
        <TextAreaField
          id="bio"
          label="نبذة"
          rows={5}
          hint="فقرة قصيرة وحقيقية عن خبرة العضو وما يعمل عليه."
          error={errors.bio?.message}
          registration={register('bio')}
        />
        <StatusField id="status" error={errors.status?.message} registration={register('status')} />
      </FormSection>

      <FormSection title="الصورة الشخصية" description="صورة مربعة بخلفية بسيطة تعطي أفضل نتيجة.">
        <Controller
          control={control}
          name="avatarUrl"
          render={({ field }) => (
            <FormField label="الصورة" htmlFor="avatarUrl" error={errors.avatarUrl?.message}>
              <ImageField
                id="avatarUrl"
                folder="team"
                aspect="square"
                value={field.value}
                onChange={(url) => field.onChange(url)}
                invalid={Boolean(errors.avatarUrl)}
                describedBy={describedBy('avatarUrl', errors.avatarUrl?.message)}
              />
            </FormField>
          )}
        />
      </FormSection>

      <FormSection title="المهارات وروابط التواصل">
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <FormField label="المهارات" htmlFor="skills" hint="اضغط Enter بعد كل مهارة." error={errors.skills?.message}>
              <TagInput
                id="skills"
                value={field.value}
                onChange={field.onChange}
                describedBy={describedBy('skills', errors.skills?.message, true)}
              />
            </FormField>
          )}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium">روابط التواصل</p>
          <SocialLinksEditor
            control={control}
            register={register}
            name="socialLinks"
            errors={errors.socialLinks as never}
          />
        </div>
      </FormSection>

      <FormActions submitting={isSubmitting} cancelHref="/team" dirty={!member || isDirty} />
    </form>
  );
}
