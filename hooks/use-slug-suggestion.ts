'use client';

import { useEffect } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormGetFieldState,
  type UseFormSetValue,
  useWatch,
} from 'react-hook-form';

import { suggestSlug } from '@/lib/slug';

/**
 * Keeps the `slug` field in sync with a latin title while creating an item,
 * until the admin edits the slug manually (the field becomes dirty).
 */
export function useSlugSuggestion<T extends FieldValues & { slug: string }, TOut extends FieldValues = T>({
  control,
  setValue,
  getFieldState,
  source,
  enabled,
}: {
  control: Control<T, unknown, TOut>;
  setValue: UseFormSetValue<T>;
  getFieldState: UseFormGetFieldState<T>;
  source: Path<T>;
  enabled: boolean;
}) {
  const sourceValue = useWatch({ control, name: source });

  useEffect(() => {
    if (!enabled || getFieldState('slug' as Path<T>).isDirty) return;
    setValue('slug' as Path<T>, suggestSlug(String(sourceValue ?? '')) as PathValue<T, Path<T>>);
  }, [enabled, getFieldState, setValue, sourceValue]);
}
