'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { createFaq, updateFaq } from '@/app/(dashboard)/faqs/actions';
import { StatusField, TextAreaField, TextField } from '@/components/forms/fields';
import { FormActions } from '@/components/forms/form-actions';
import { FormSection } from '@/components/forms/form-section';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { type FaqFormValues, type FaqPayload, faqDefaults, faqSchema } from '@/lib/validation/schemas';
import type { Faq } from '@/types/api';

export function FaqForm({ faq }: { faq?: Faq }) {
  const router = useRouter();
  const form = useForm<FaqFormValues, unknown, FaqPayload>({
    resolver: zodResolver(faqSchema),
    defaultValues: faqDefaults(faq),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = form;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    const result = faq ? await updateFaq(faq.id, payload) : await createFaq(payload);
    if (feedback(result, faq ? 'تم حفظ التعديلات' : 'تمت إضافة السؤال')) {
      router.push('/faqs');
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="السؤال والإجابة">
        <TextField
          id="question"
          label="السؤال"
          required
          error={errors.question?.message}
          registration={register('question')}
        />
        <TextAreaField
          id="answer"
          label="الإجابة"
          required
          rows={6}
          hint="إجابة واضحة ومختصرة، بدون وعود لا يمكن الالتزام بها."
          error={errors.answer?.message}
          registration={register('answer')}
        />
        <StatusField id="status" error={errors.status?.message} registration={register('status')} />
      </FormSection>
      <FormActions submitting={isSubmitting} cancelHref="/faqs" dirty={!faq || isDirty} />
    </form>
  );
}
