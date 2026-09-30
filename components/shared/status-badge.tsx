import { contentStatusLabels, messageStatusLabels } from '@/lib/constants/labels';
import { cn } from '@/lib/utils';
import type { ContentStatus, MessageStatus } from '@/types/api';

const contentStyles: Record<ContentStatus, string> = {
  PUBLISHED: 'bg-emerald-500/10 text-emerald-400 ring-emerald-400/25',
  DRAFT: 'bg-amber-500/10 text-amber-300 ring-amber-400/25',
  ARCHIVED: 'bg-muted text-muted-foreground ring-white/10',
};

const messageStyles: Record<MessageStatus, string> = {
  UNREAD: 'bg-primary/15 text-primary ring-primary/30',
  READ: 'bg-muted text-muted-foreground ring-white/10',
  ARCHIVED: 'bg-muted text-muted-foreground ring-white/5',
};

const base =
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap';

export function StatusBadge({ status }: { status: ContentStatus }) {
  return <span className={cn(base, contentStyles[status])}>{contentStatusLabels[status]}</span>;
}

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  return <span className={cn(base, messageStyles[status])}>{messageStatusLabels[status]}</span>;
}
