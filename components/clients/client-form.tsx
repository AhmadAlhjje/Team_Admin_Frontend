'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createClient, updateClient } from '@/app/(dashboard)/clients/actions';
import { CheckboxField, StatusField, TextAreaField, TextField } from '@/components/forms/fields';
import { FormActions } from '@/components/forms/form-actions';
import { describedBy, FormField } from '@/components/forms/form-field';
import { FormSection } from '@/components/forms/form-section';
import { ImageField } from '@/components/forms/image-field';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { type ClientFormValues, type ClientPayload, clientDefaults, clientSchema } from '@/lib/validation/schemas';
import type { Client } from '@/types/api';

export function ClientForm({ client }: { client?: Client }) {
  const router = useRouter();
  const form = useForm<ClientFormValues, unknown, ClientPayload>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientDefaults(client),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = form;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    const result = client ? await updateClient(client.id, payload) : await createClient(payload);
    if (feedback(result, client ? 'تم حفظ التعديلات' : 'تمت إضافة العميل')) {
      router.push('/clients');
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="بيانات العميل">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="name"
            label="اسم الجهة"
            required
            error={errors.name?.message}
            registration={register('name')}
          />
          <TextField
            id="industry"
            label="المجال"
            placeholder="تجارة إلكترونية"
            error={errors.industry?.message}
            registration={register('industry')}
          />
          <TextField
            id="websiteUrl"
            label="الموقع الإلكتروني"
            dir="ltr"
            placeholder="https://"
            error={errors.websiteUrl?.message}
            registration={register('websiteUrl')}
          />
        </div>
        <TextAreaField
          id="description"
          label="ملاحظات"
          rows={3}
          hint="للاستخدام الداخلي."
          error={errors.description?.message}
          registration={register('description')}
        />
        <Controller
          control={control}
          name="logoUrl"
          render={({ field }) => (
            <FormField label="الشعار" htmlFor="logoUrl" error={errors.logoUrl?.message}>
              <ImageField
                id="logoUrl"
                folder="clients"
                value={field.value}
                onChange={(url) => field.onChange(url)}
                invalid={Boolean(errors.logoUrl)}
                describedBy={describedBy('logoUrl', errors.logoUrl?.message)}
              />
            </FormField>
          )}
        />
      </FormSection>

      <FormSection title="الظهور في الموقع">
        <CheckboxField
          id="hasDisplayConsent"
          label="حصلنا على موافقة العميل على عرض اسمه وشعاره"
          hint="مطلوبة قبل النشر."
          error={errors.hasDisplayConsent?.message}
          registration={register('hasDisplayConsent')}
        />
        <StatusField id="status" error={errors.status?.message} registration={register('status')} />
      </FormSection>

      <FormActions submitting={isSubmitting} cancelHref="/clients" dirty={!client || isDirty} />
    </form>
  );
}
