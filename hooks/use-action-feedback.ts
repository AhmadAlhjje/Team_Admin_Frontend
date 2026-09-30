'use client';

import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { toast } from 'sonner';

import type { ActionResult } from '@/lib/actions/result';

/**
 * Handles a Server Action result in a form: success toast, error toast and
 * backend field errors mapped onto the matching form fields.
 */
export function useActionFeedback<TValues extends FieldValues>(setError: UseFormSetError<TValues>) {
  return function handle<T>(result: ActionResult<T>, successMessage: string): result is { ok: true; data: T } {
    if (result.ok) {
      toast.success(successMessage);
      return true;
    }
    toast.error(result.message);
    for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
      setError(field as Path<TValues>, { type: 'server', message });
    }
    return false;
  };
}
