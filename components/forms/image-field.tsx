'use client';

import { ImageIcon, Loader2Icon, Trash2Icon, UploadIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadImageAction } from '@/lib/actions/upload-actions';
import { cn } from '@/lib/utils';
import type { UploadedImage, UploadFolder } from '@/types/api';

export const MAX_UPLOAD_MB = 5;
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/avif,image/gif';

interface ImageFieldProps {
  id: string;
  value: string;
  onChange: (url: string, image?: UploadedImage) => void;
  folder: UploadFolder;
  invalid?: boolean;
  describedBy?: string;
  /** Preview aspect ratio. */
  aspect?: 'square' | 'video';
}

/**
 * Upload an image (optimized to WebP by the backend) or paste an existing URL.
 * The field stores the public URL.
 */
export function ImageField({ id, value, onChange, folder, invalid, describedBy, aspect = 'video' }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      toast.error(`حجم الصورة أكبر من ${MAX_UPLOAD_MB} ميغابايت.`);
      return;
    }
    const formData = new FormData();
    formData.set('file', file);
    formData.set('folder', folder);

    setUploading(true);
    const result = await uploadImageAction(formData);
    setUploading(false);

    if (result.ok) {
      onChange(result.data.url, result.data);
      toast.success('تم رفع الصورة');
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40',
            aspect === 'square' ? 'size-20' : 'h-20 w-32',
          )}
        >
          {value ? (
            // Admin previews are small and may point to any host: plain <img> is intentional.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2Icon className="animate-spin" aria-hidden="true" />
            ) : (
              <UploadIcon aria-hidden="true" />
            )}
            {uploading ? 'جارٍ الرفع…' : value ? 'استبدال الصورة' : 'رفع صورة'}
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')} className="text-destructive">
              <Trash2Icon aria-hidden="true" />
              إزالة
            </Button>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) void upload(file);
            }}
          />
        </div>
      </div>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="أو الصق رابط صورة https://…"
        dir="ltr"
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />
    </div>
  );
}
