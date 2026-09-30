'use client';

import { XIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

interface TagInputProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxItems?: number;
  invalid?: boolean;
  describedBy?: string;
}

/**
 * Free-text tags (technologies, skills). Enter or comma adds a tag, Backspace
 * on an empty input removes the last one. Duplicates are ignored (case-insensitive).
 */
export function TagInput({
  id,
  value,
  onChange,
  suggestions = [],
  placeholder = 'اكتب ثم اضغط Enter',
  maxItems = 30,
  invalid,
  describedBy,
}: TagInputProps) {
  const [draft, setDraft] = useState('');
  const listId = useId();

  function add(raw: string) {
    const tag = raw.trim().replace(/,$/, '').trim();
    if (!tag || value.length >= maxItems) return;
    if (value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
    setDraft('');
  }

  function remove(tag: string) {
    onChange(value.filter((existing) => existing !== tag));
  }

  const available = suggestions.filter(
    (suggestion) => !value.some((existing) => existing.toLowerCase() === suggestion.toLowerCase()),
  );

  return (
    <div
      className={cn(
        'flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30',
        invalid && 'border-destructive',
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-sm text-foreground"
          dir="auto"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(tag)}
            className="rounded text-muted-foreground hover:text-foreground"
            aria-label={`إزالة ${tag}`}
          >
            <XIcon className="size-3.5" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        list={available.length ? listId : undefined}
        onChange={(event) => {
          const next = event.target.value;
          if (next.endsWith(',')) add(next);
          else setDraft(next);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            add(draft);
          } else if (event.key === 'Backspace' && !draft && value.length) {
            remove(value[value.length - 1] as string);
          }
        }}
        onBlur={() => add(draft)}
        placeholder={value.length >= maxItems ? '' : placeholder}
        disabled={value.length >= maxItems}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="min-w-32 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
        dir="auto"
      />
      {available.length ? (
        <datalist id={listId}>
          {available.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      ) : null}
    </div>
  );
}
