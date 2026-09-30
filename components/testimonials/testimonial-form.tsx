'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createTestimonial, updateTestimonial } from '@/app/(dashboard)/testimonials/actions';
import { CheckboxField, SelectField, StatusField, TextAreaField, TextField } from '@/components/forms/fields';
import { FormActions } from '@/components/forms/form-actions';
import { describedBy, FormField } from '@/components/forms/form-field';
import { FormSection } from '@/components/forms/form-section';
import { ImageField } from '@/components/forms/image-field';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import {
  type TestimonialFormValues,
  type TestimonialPayload,
  testimonialDefaults,
  testimonialSchema,
} from '@/lib/validation/schemas';
import type { Testimonial } from '@/types/api';

interface TestimonialFormProps {
  testimonial?: Testimonial;
  projects: Array<{ id: number; title: string }>;
}

export function TestimonialForm({ testimonial, projects }: TestimonialFormProps) {
  const router = useRouter();
  const form = useForm<TestimonialFormValues, unknown, TestimonialPayload>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonialDefaults(testimonial),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = form;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    const result = testimonial ? await updateTestimonial(testimonial.id, payload) : await createTestimonial(payload);
    if (feedback(result, testimonial ? 'تم حفظ التعديلات' : 'تمت إضافة الرأي')) {
      router.push('/testimonials');
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="الرأي">
        <TextAreaField
          id="content"
          label="نص الرأي"
          required
          rows={5}
          hint="انقل كلام العميل كما قاله، بدون تجميل أو إضافات."
          error={errors.content?.message}
          registration={register('content')}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            id="authorName"
            label="اسم العميل"
            required
            error={errors.authorName?.message}
            registration={register('authorName')}
          />
          <TextField
            id="authorTitle"
            label="المنصب"
            error={errors.authorTitle?.message}
            registration={register('authorTitle')}
          />
          <TextField id="company" label="الشركة" error={errors.company?.message} registration={register('company')} />
        </div>
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
          name="avatarUrl"
          render={({ field }) => (
            <FormField label="صورة العميل (اختياري)" htmlFor="avatarUrl" error={errors.avatarUrl?.message}>
              <ImageField
                id="avatarUrl"
                folder="testimonials"
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

      <FormSection title="النشر">
        <CheckboxField
          id="hasDisplayConsent"
          label="حصلنا على موافقة العميل على نشر هذا الرأي"
          hint="مطلوبة قبل النشر."
          error={errors.hasDisplayConsent?.message}
          registration={register('hasDisplayConsent')}
        />
        <StatusField id="status" error={errors.status?.message} registration={register('status')} />
      </FormSection>

      <FormActions submitting={isSubmitting} cancelHref="/testimonials" dirty={!testimonial || isDirty} />
    </form>
  );
}
