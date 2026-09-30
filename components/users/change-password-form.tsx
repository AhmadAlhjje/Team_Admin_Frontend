'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { changePassword } from '@/app/(dashboard)/account/actions';
import { TextField } from '@/components/forms/fields';
import { FormSection } from '@/components/forms/form-section';
import { SubmitButton } from '@/components/forms/submit-button';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { type ChangePasswordValues, changePasswordSchema, PASSWORD_MIN_LENGTH } from '@/lib/validation/schemas';

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (values) => {
    const result = await changePassword(values.currentPassword, values.newPassword);
    if (feedback(result, 'تم تغيير كلمة المرور. تم تسجيل الخروج من الأجهزة الأخرى.')) reset();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      <FormSection title="تغيير كلمة المرور" actions={<SubmitButton submitting={isSubmitting} label="تغيير" />}>
        <TextField
          id="currentPassword"
          label="كلمة المرور الحالية"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          error={errors.currentPassword?.message}
          registration={register('currentPassword')}
        />
        <TextField
          id="newPassword"
          label="كلمة المرور الجديدة"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          hint={`${PASSWORD_MIN_LENGTH} حرفاً على الأقل. جملة طويلة يسهل تذكرها خيار جيد.`}
          error={errors.newPassword?.message}
          registration={register('newPassword')}
        />
        <TextField
          id="confirmPassword"
          label="تأكيد كلمة المرور"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          registration={register('confirmPassword')}
        />
      </FormSection>
    </form>
  );
}
