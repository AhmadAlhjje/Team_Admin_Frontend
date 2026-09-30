'use client';

import { PlusIcon } from 'lucide-react';
import { type Control, type FieldErrors, type UseFormRegister, useFieldArray } from 'react-hook-form';

import { ArrayItemControls } from '@/components/forms/array-item-controls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ProjectFormValues, ProjectPayload } from '@/lib/validation/schemas';

export function FeaturesEditor({
  control,
  register,
  errors,
}: {
  control: Control<ProjectFormValues, unknown, ProjectPayload>;
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>['features'];
}) {
  const { fields, append, remove, move } = useFieldArray({ control, name: 'features' });

  return (
    <div className="space-y-3">
      {fields.length === 0 ? <p className="text-sm text-muted-foreground">لا توجد ميزات بعد.</p> : null}
      {fields.map((field, index) => {
        const titleError = errors?.[index]?.title?.message;
        return (
          <div key={field.id} className="flex items-start gap-2 rounded-lg border border-border p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_1.5fr]">
              <div className="space-y-1">
                <Input
                  placeholder="الميزة"
                  aria-label={`عنوان الميزة ${index + 1}`}
                  aria-invalid={Boolean(titleError)}
                  {...register(`features.${index}.title`)}
                />
                {titleError ? (
                  <p role="alert" className="text-xs font-medium text-destructive">
                    {titleError}
                  </p>
                ) : null}
              </div>
              <Input
                placeholder="شرح مختصر (اختياري)"
                aria-label={`شرح الميزة ${index + 1}`}
                {...register(`features.${index}.description`)}
              />
            </div>
            <ArrayItemControls
              index={index}
              count={fields.length}
              label={`الميزة ${index + 1}`}
              onMove={move}
              onRemove={remove}
            />
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={fields.length >= 30}
        onClick={() => append({ title: '', description: '' })}
      >
        <PlusIcon aria-hidden="true" />
        إضافة ميزة
      </Button>
    </div>
  );
}
