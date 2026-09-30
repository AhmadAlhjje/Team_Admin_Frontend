'use client';

import { PlusIcon } from 'lucide-react';
import {
  type ArrayPath,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
  useFieldArray,
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { socialPlatformLabels } from '@/lib/constants/labels';
import { socialPlatforms } from '@/lib/validation/common';

import { ArrayItemControls } from './array-item-controls';
import { NativeSelect } from './native-select';

interface SocialLinksEditorProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  name: ArrayPath<T>;
  errors?: FieldErrors;
  max?: number;
}

type LinkErrors = Array<{ url?: { message?: string }; label?: { message?: string } } | undefined>;

export function SocialLinksEditor<T extends FieldValues>({
  control,
  register,
  name,
  errors,
  max = 12,
}: SocialLinksEditorProps<T>) {
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const rowErrors = (errors as unknown as LinkErrors | undefined) ?? [];

  return (
    <div className="space-y-3">
      {fields.length === 0 ? <p className="text-sm text-muted-foreground">لا توجد روابط بعد.</p> : null}
      {fields.map((field, index) => {
        const urlError = rowErrors[index]?.url?.message;
        return (
          <div key={field.id} className="rounded-lg border border-border p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="sm:w-44">
                <NativeSelect
                  aria-label={`منصة الرابط ${index + 1}`}
                  {...register(`${name}.${index}.platform` as Path<T>)}
                >
                  {socialPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {socialPlatformLabels[platform]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="flex-1 space-y-1">
                <Input
                  dir="ltr"
                  placeholder="https://…"
                  aria-label={`عنوان الرابط ${index + 1}`}
                  aria-invalid={Boolean(urlError)}
                  {...register(`${name}.${index}.url` as Path<T>)}
                />
                {urlError ? (
                  <p role="alert" className="text-xs font-medium text-destructive">
                    {urlError}
                  </p>
                ) : null}
              </div>
              <div className="sm:w-40">
                <Input
                  placeholder="تسمية (اختياري)"
                  aria-label={`تسمية الرابط ${index + 1}`}
                  {...register(`${name}.${index}.label` as Path<T>)}
                />
              </div>
              <ArrayItemControls
                index={index}
                count={fields.length}
                label={`الرابط ${index + 1}`}
                onMove={move}
                onRemove={remove}
              />
            </div>
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={fields.length >= max}
        onClick={() => append({ platform: 'WEBSITE', url: '', label: '' } as never)}
      >
        <PlusIcon aria-hidden="true" />
        إضافة رابط
      </Button>
    </div>
  );
}
