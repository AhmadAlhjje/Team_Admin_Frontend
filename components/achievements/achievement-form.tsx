'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createAchievement, updateAchievement } from '@/app/(dashboard)/achievements/actions';
import { SelectField, StatusField, TextAreaField, TextField } from '@/components/forms/fields';
import { FormActions } from '@/components/forms/form-actions';
import { describedBy, FormField } from '@/components/forms/form-field';
import { FormSection } from '@/components/forms/form-section';
import { ImageField } from '@/components/forms/image-field';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { achievementTypeLabels } from '@/lib/constants/labels';
import {
  type AchievementFormValues,
  type AchievementPayload,
  achievementDefaults,
  achievementSchema,
  achievementTypes,
} from '@/lib/validation/schemas';
import type { Achievement } from '@/types/api';

interface AchievementFormProps {
  achievement?: Achievement;
  projects: Array<{ id: number; title: string }>;
}

export function AchievementForm({ achievement, projects }: AchievementFormProps) {
  const router = useRouter();
  const form = useForm<AchievementFormValues, unknown, AchievementPayload>({
    resolver: zodResolver(achievementSchema),
    defaultValues: achievementDefaults(achievement),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = form;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    const result = achievement ? await updateAchievement(achievement.id, payload) : await createAchievement(payload);
    if (feedback(result, achievement ? 'تم حفظ التعديلات' : 'تمت إضافة الإنجاز')) {
      router.push('/achievements');
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="الإنجاز">
        <TextField id="title" label="العنوان" required error={errors.title?.message} registration={register('title')} />
        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            id="type"
            label="النوع"
            options={achievementTypes.map((type) => ({ value: type, label: achievementTypeLabels[type] }))}
            error={errors.type?.message}
            registration={register('type')}
          />
          <TextField
            id="highlight"
            label="أبرز نقطة"
            placeholder="المركز الأول"
            error={errors.highlight?.message}
            registration={register('highlight')}
          />
          <TextField
            id="date"
            label="التاريخ"
            type="date"
            dir="ltr"
            error={errors.date?.message}
            registration={register('date')}
          />
        </div>
        <TextField
          id="issuer"
          label="الجهة المنظمة / المانحة"
          error={errors.issuer?.message}
          registration={register('issuer')}
        />
        <TextAreaField
          id="description"
          label="الوصف"
          rows={4}
          error={errors.description?.message}
          registration={register('description')}
        />
      </FormSection>

      <FormSection title="الإثبات والربط">
        <TextField
          id="proofUrl"
          label="رابط الإثبات"
          dir="ltr"
          placeholder="https://"
          hint="شهادة أو إعلان أو خبر منشور يثبت الإنجاز."
          error={errors.proofUrl?.message}
          registration={register('proofUrl')}
        />
        <SelectField
          id="projectId"
          label="المشروع المرتبط"
          placeholder="بدون مشروع"
          options={projects.map((project) => ({ value: String(project.id), label: project.title }))}
          error={errors.projectId?.message}
          registration={register('projectId')}
        />
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <FormField label="صورة (اختياري)" htmlFor="imageUrl" error={errors.imageUrl?.message}>
              <ImageField
                id="imageUrl"
                folder="achievements"
                value={field.value}
                onChange={(url) => field.onChange(url)}
                invalid={Boolean(errors.imageUrl)}
                describedBy={describedBy('imageUrl', errors.imageUrl?.message)}
              />
            </FormField>
          )}
        />
        <StatusField id="status" error={errors.status?.message} registration={register('status')} />
      </FormSection>

      <FormActions submitting={isSubmitting} cancelHref="/achievements" dirty={!achievement || isDirty} />
    </form>
  );
}
