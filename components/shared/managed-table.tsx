'use client';

import { ArrowDownIcon, ArrowUpIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ActionResult } from '@/lib/actions/result';
import { moveItem } from '@/lib/list';

import { ConfirmDialog } from './confirm-dialog';

export interface ManagedRow {
  id: number;
  /** Used in confirmation messages. */
  label: string;
  cells: React.ReactNode[];
  editHref: string;
}

interface ManagedTableProps {
  /** The first column is the primary one; the others are hidden on small screens. */
  columns: string[];
  rows: ManagedRow[];
  /** Enables the up/down ordering controls. */
  reorderAction?: (ids: number[]) => Promise<ActionResult>;
  deleteAction: (id: number) => Promise<ActionResult>;
  deleteHint?: string;
}

/** Secondary columns give way on phones so the actions stay reachable. */
const secondaryColumn = 'hidden md:table-cell';

/**
 * Generic content table: edit links, delete with confirmation and optimistic
 * reordering. Cells are rendered on the server and passed in as elements.
 */
export function ManagedTable({ columns, rows, reorderAction, deleteAction, deleteHint }: ManagedTableProps) {
  const router = useRouter();
  const [order, setOrder] = useState(() => rows.map((row) => row.id));
  const [pending, startTransition] = useTransition();

  // Keep local order in sync when the server sends new rows.
  const rowIds = rows.map((row) => row.id).join(',');
  const [syncedIds, setSyncedIds] = useState(rowIds);
  if (syncedIds !== rowIds) {
    setSyncedIds(rowIds);
    setOrder(rows.map((row) => row.id));
  }

  const byId = new Map(rows.map((row) => [row.id, row]));
  const ordered = order.map((id) => byId.get(id)).filter((row): row is ManagedRow => Boolean(row));

  function move(index: number, direction: -1 | 1) {
    if (!reorderAction) return;
    const previous = order;
    const next = moveItem(order, index, index + direction);
    setOrder(next);
    startTransition(async () => {
      const result = await reorderAction(next);
      if (!result.ok) {
        setOrder(previous);
        toast.error(result.message);
      } else {
        toast.success('تم حفظ الترتيب');
      }
    });
  }

  function remove(row: ManagedRow) {
    startTransition(async () => {
      const result = await deleteAction(row.id);
      if (result.ok) {
        toast.success(`تم حذف «${row.label}»`);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {reorderAction ? <TableHead className="w-20">الترتيب</TableHead> : null}
            {columns.map((column, columnIndex) => (
              <TableHead key={column} className={columnIndex > 0 ? secondaryColumn : undefined}>
                {column}
              </TableHead>
            ))}
            <TableHead className="w-28 text-end">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordered.map((row, index) => (
            <TableRow key={row.id}>
              {reorderAction ? (
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={pending || index === 0}
                      onClick={() => move(index, -1)}
                      aria-label={`نقل «${row.label}» للأعلى`}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={pending || index === ordered.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label={`نقل «${row.label}» للأسفل`}
                    >
                      <ArrowDownIcon />
                    </Button>
                  </div>
                </TableCell>
              ) : null}
              {row.cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className={cellIndex > 0 ? secondaryColumn : 'whitespace-normal'}>
                  {cell}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href={row.editHref} aria-label={`تعديل «${row.label}»`}>
                      <PencilIcon />
                    </Link>
                  </Button>
                  <ConfirmDialog
                    title={`حذف «${row.label}»؟`}
                    description={
                      deleteHint ?? 'سيتم حذف هذا العنصر نهائياً. لإخفائه مع الاحتفاظ به استخدم حالة «مؤرشف».'
                    }
                    confirmLabel="حذف نهائياً"
                    onConfirm={() => remove(row)}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={pending}
                        aria-label={`حذف «${row.label}»`}
                      >
                        <Trash2Icon />
                      </Button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
