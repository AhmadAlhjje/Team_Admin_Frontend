'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { createService, updateService } from '@/app/(dashboard)/services/actions';
import { SelectField, StatusField, TextAreaField, TextField } from '@/components/forms/fields';
import { FormActions } from '@/components/forms/form-actions';
import { describedBy, FormField } from '@/components/forms/form-field';
import { FormSection } from '@/components/forms/form-section';
import { TagInput } from '@/components/forms/tag-input';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { useSlugSuggestion } from '@/hooks/use-slug-suggestion';
import { serviceIconLabels } from '@/lib/constants/labels';
import {
  type ServiceFormValues,
  type ServicePayload,
  serviceDefaults,
  serviceIcons,
  serviceSchema,
} from '@/lib/validation/schemas';
import type { Service } from '@/types/api';

export function ServiceForm({
  service,
  technologySuggestions,
}: {
  service?: Service;
  technologySuggestions: string[];
}) {
  const router = useRouter();
  const form = useForm<ServiceFormValues, unknown, ServicePayload>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceDefaults(service),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = form;
  const feedback = useActionFeedback(form.setError);
  const summary = useWatch({ control, name: 'summary' });
  useSlugSuggestion({
    control,
    setValue: form.setValue,
    getFieldState: form.getFieldState,
    source: 'title',
    enabled: !service,
  });

  const onSubmit = handleSubmit(async (payload) => {
    const result = service ? await updateService(service.id, payload) : await createService(payload);
    if (feedback(result, service ? 'تم حفظ التعديلات' : 'تمت إضافة الخدمة')) {
      router.push('/services');
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="الخدمة">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="title"
            label="اسم الخدمة"
            required
            placeholder="تطوير تطبيقات الويب"
            error={errors.title?.message}
            registration={register('title')}
          />
          <TextField
            id="slug"
            label="المعرّف (Slug)"
            required
            dir="ltr"
            hint="مثال: web-development"
            error={errors.slug?.message}
            registration={register('slug')}
          />
        </div>
        <TextAreaField
          id="summary"
          label="وصف مختصر"
          required
          rows={2}
          maxLength={400}
          currentLength={summary.length}
          hint="جملة أو جملتان تظهران على بطاقة الخدمة."
          error={errors.summary?.message}
          registration={register('summary')}
        />
        <TextAreaField
          id="description"
          label="التفاصيل"
          rows={6}
          hint="ما الذي تشمله الخدمة؟ لمن تناسب؟ يمكنك كتابة نقاط تبدأ بـ «-»."
          error={errors.description?.message}
          registration={register('description')}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id="icon"
            label="الأيقونة"
            options={serviceIcons.map((icon) => ({ value: icon, label: serviceIconLabels[icon] ?? icon }))}
            error={errors.icon?.message}
            registration={register('icon')}
          />
          <StatusField id="status" error={errors.status?.message} registration={register('status')} />
        </div>
      </FormSection>

      <FormSection title="التقنيات المستخدمة" description="تظهر داخل تفاصيل الخدمة في الموقع.">
        <Controller
          control={control}
          name="technologies"
          render={({ field }) => (
            <FormField
              label="التقنيات"
              htmlFor="technologies"
              hint="اضغط Enter بعد كل تقنية."
              error={errors.technologies?.message}
            >
              <TagInput
                id="technologies"
                value={field.value}
                onChange={field.onChange}
                suggestions={technologySuggestions}
                describedBy={describedBy('technologies', errors.technologies?.message, true)}
              />
            </FormField>
          )}
        />
      </FormSection>

      <FormActions submitting={isSubmitting} cancelHref="/services" dirty={!service || isDirty} />
    </form>
  );
}
