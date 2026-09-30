'use client';

import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';

/** Move up / move down / remove buttons for a row of a react-hook-form field array. */
export function ArrayItemControls({
  index,
  count,
  label,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  label: string;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        aria-label={`نقل ${label} للأعلى`}
      >
        <ArrowUpIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        aria-label={`نقل ${label} للأسفل`}
      >
        <ArrowDownIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:bg-destructive/10"
        onClick={() => onRemove(index)}
        aria-label={`حذف ${label}`}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
