'use client';

import type { UseFormRegisterReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contentStatusHints, contentStatusLabels } from '@/lib/constants/labels';
import { cn } from '@/lib/utils';

import { describedBy, FormField } from './form-field';
import { NativeSelect } from './native-select';

interface BaseFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  required?: boolean;
  className?: string;
  registration: UseFormRegisterReturn;
}

export function TextField({
  id,
  label,
  error,
  hint,
  required,
  className,
  registration,
  ...inputProps
}: BaseFieldProps & Omit<React.ComponentProps<'input'>, 'id' | 'name'>) {
  return (
    <FormField label={label} htmlFor={id} error={error} hint={hint} required={required} className={className}>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={required}
        {...inputProps}
        {...registration}
      />
    </FormField>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  required,
  className,
  registration,
  maxLength,
  currentLength,
  ...textareaProps
}: BaseFieldProps & { currentLength?: number } & Omit<React.ComponentProps<'textarea'>, 'id' | 'name'>) {
  const counter =
    maxLength !== undefined && currentLength !== undefined ? (
      <span className={cn(currentLength > maxLength && 'text-destructive')}>
        {currentLength} / {maxLength}
      </span>
    ) : null;

  return (
    <FormField
      label={label}
      htmlFor={id}
      error={error}
      hint={
        hint || counter ? (
          <span className="flex justify-between gap-4">
            <span>{hint}</span>
            {counter}
          </span>
        ) : undefined
      }
      required={required}
      className={className}
    >
      <Textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint || counter)}
        aria-required={required}
        {...textareaProps}
        {...registration}
      />
    </FormField>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  required,
  className,
  registration,
  options,
  placeholder,
}: BaseFieldProps & { options: Array<{ value: string; label: string }>; placeholder?: string }) {
  return (
    <FormField label={label} htmlFor={id} error={error} hint={hint} required={required} className={className}>
      <NativeSelect
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        {...registration}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </FormField>
  );
}

const statusOptions = (['PUBLISHED', 'DRAFT', 'ARCHIVED'] as const).map((status) => ({
  value: status,
  label: `${contentStatusLabels[status]} — ${contentStatusHints[status]}`,
}));

export function StatusField(props: Omit<BaseFieldProps, 'label'> & { label?: string }) {
  return <SelectField {...props} label={props.label ?? 'الحالة'} options={statusOptions} />;
}

export function CheckboxField({
  id,
  label,
  error,
  hint,
  registration,
}: Omit<BaseFieldProps, 'required' | 'className'>) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 size-4 rounded border-input accent-primary"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          {...registration}
        />
        <span>
          <span className="font-medium text-foreground">{label}</span>
          {hint ? (
            <span id={`${id}-hint`} className="block text-xs text-muted-foreground">
              {hint}
            </span>
          ) : null}
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
