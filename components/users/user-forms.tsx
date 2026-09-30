'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { createUser, deleteUser, updateUser } from '@/app/(dashboard)/users/actions';
import { CheckboxField, SelectField, TextField } from '@/components/forms/fields';
import { FormActions } from '@/components/forms/form-actions';
import { FormSection } from '@/components/forms/form-section';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { roleDescriptions, roleLabels } from '@/lib/constants/labels';
import {
  createUserSchema,
  PASSWORD_MIN_LENGTH,
  type UpdateUserFormValues,
  updateUserSchema,
} from '@/lib/validation/schemas';
import type { AdminUser } from '@/types/api';

const roleOptions = (['ADMIN', 'SUPER_ADMIN'] as const).map((role) => ({
  value: role,
  label: `${roleLabels[role]} — ${roleDescriptions[role]}`,
}));

export function CreateUserForm() {
  const router = useRouter();
  const form = useForm<z.input<typeof createUserSchema>, unknown, z.output<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', role: 'ADMIN', password: '' },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    if (feedback(await createUser(payload), 'تم إنشاء الحساب')) {
      router.push('/users');
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="الحساب" description="شارك كلمة المرور بطريقة آمنة واطلب من المستخدم تغييرها بعد أول دخول.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="name" label="الاسم" required error={errors.name?.message} registration={register('name')} />
          <TextField
            id="email"
            label="البريد الإلكتروني"
            type="email"
            dir="ltr"
            required
            autoComplete="off"
            error={errors.email?.message}
            registration={register('email')}
          />
        </div>
        <SelectField
          id="role"
          label="الدور"
          options={roleOptions}
          error={errors.role?.message}
          registration={register('role')}
        />
        <TextField
          id="password"
          label="كلمة المرور المبدئية"
          type="password"
          dir="ltr"
          required
          autoComplete="new-password"
          hint={`${PASSWORD_MIN_LENGTH} حرفاً على الأقل.`}
          error={errors.password?.message}
          registration={register('password')}
        />
      </FormSection>
      <FormActions submitting={isSubmitting} cancelHref="/users" submitLabel="إنشاء الحساب" />
    </form>
  );
}

export function EditUserForm({ user, isSelf }: { user: AdminUser; isSelf: boolean }) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();
  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: user.name, role: user.role, isActive: user.isActive, password: '' },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = form;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (values) => {
    const result = await updateUser(user.id, { ...values, password: values.password || undefined });
    if (feedback(result, 'تم حفظ التعديلات')) {
      router.push('/users');
      router.refresh();
    }
  });

  function remove() {
    startDelete(async () => {
      const result = await deleteUser(user.id);
      if (result.ok) {
        toast.success('تم حذف الحساب');
        router.push('/users');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="الحساب">
        <TextField id="name" label="الاسم" required error={errors.name?.message} registration={register('name')} />
        <SelectField
          id="role"
          label="الدور"
          options={roleOptions}
          hint={isSelf ? 'لا يمكنك تغيير دورك.' : undefined}
          error={errors.role?.message}
          registration={register('role', { disabled: isSelf })}
        />
        <CheckboxField
          id="isActive"
          label="الحساب نشط"
          hint={isSelf ? 'لا يمكنك تعطيل حسابك.' : 'تعطيل الحساب يُنهي جلساته فوراً.'}
          registration={register('isActive', { disabled: isSelf })}
        />
      </FormSection>
      <FormSection
        title="إعادة تعيين كلمة المرور"
        description="اتركه فارغاً للإبقاء على كلمة المرور الحالية. سيتم إنهاء جلسات المستخدم."
      >
        <TextField
          id="password"
          label="كلمة مرور جديدة"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          error={errors.password?.message}
          registration={register('password')}
        />
      </FormSection>
      {!isSelf ? (
        <FormSection title="حذف الحساب">
          <ConfirmDialog
            title={`حذف حساب ${user.name}؟`}
            description="لا يمكن التراجع عن الحذف. يمكنك تعطيل الحساب بدلاً من حذفه."
            confirmLabel="حذف الحساب"
            onConfirm={remove}
            trigger={
              <Button type="button" variant="destructive" disabled={deleting}>
                <Trash2Icon aria-hidden="true" />
                حذف الحساب
              </Button>
            }
          />
        </FormSection>
      ) : null}
      <FormActions submitting={isSubmitting} cancelHref="/users" dirty={isDirty} />
    </form>
  );
}
