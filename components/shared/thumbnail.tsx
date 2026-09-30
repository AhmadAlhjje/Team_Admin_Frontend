import { ImageIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Small preview image for tables. Plain <img>: sources may be on any host. */
export function Thumbnail({
  src,
  alt,
  shape = 'rounded',
}: {
  src: string | null;
  alt: string;
  shape?: 'rounded' | 'circle';
}) {
  const classes = cn(
    'size-10 shrink-0 overflow-hidden bg-muted object-cover',
    shape === 'circle' ? 'rounded-full' : 'rounded-lg',
  );
  if (!src) {
    return (
      <span className={cn(classes, 'flex items-center justify-center')}>
        <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={classes} loading="lazy" />;
}
