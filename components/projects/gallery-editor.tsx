'use client';

import { ImagePlusIcon, Loader2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { type Control, type UseFormRegister, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';

import { ArrayItemControls } from '@/components/forms/array-item-controls';
import { MAX_UPLOAD_MB } from '@/components/forms/image-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadImageAction } from '@/lib/actions/upload-actions';
import type { ProjectFormValues, ProjectPayload } from '@/lib/validation/schemas';

const MAX_IMAGES = 30;

/** Project screenshots: multi-upload, alt text for each image, ordering. */
export function GalleryEditor({
  control,
  register,
}: {
  control: Control<ProjectFormValues, unknown, ProjectPayload>;
  register: UseFormRegister<ProjectFormValues>;
}) {
  const { fields, append, remove, move } = useFieldArray({ control, name: 'images' });
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  async function uploadFiles(files: File[]) {
    const room = MAX_IMAGES - fields.length;
    const selected = files.slice(0, room);
    if (files.length > room) toast.warning(`الحد الأقصى ${MAX_IMAGES} صورة.`);

    for (const file of selected) {
      if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        toast.error(`«${file.name}» أكبر من ${MAX_UPLOAD_MB} ميغابايت.`);
        continue;
      }
      setUploading((count) => count + 1);
      const formData = new FormData();
      formData.set('file', file);
      formData.set('folder', 'projects');
      const result = await uploadImageAction(formData);
      setUploading((count) => count - 1);

      if (result.ok) {
        append({ url: result.data.url, alt: '', width: result.data.width, height: result.data.height });
      } else {
        toast.error(`«${file.name}»: ${result.message}`);
      }
    }
  }

  return (
    <div className="space-y-3">
      {fields.length === 0 ? <p className="text-sm text-muted-foreground">لم تُضف صور بعد.</p> : null}
      <ul className="space-y-3">
        {fields.map((field, index) => (
          <li key={field.id} className="flex items-center gap-3 rounded-lg border border-border p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={field.url} alt="" className="h-16 w-24 shrink-0 rounded-md bg-muted object-cover" />
            <Input
              placeholder="وصف الصورة (للقارئات الصوتية ومحركات البحث)"
              aria-label={`وصف الصورة ${index + 1}`}
              {...register(`images.${index}.alt`)}
            />
            <ArrayItemControls
              index={index}
              count={fields.length}
              label={`الصورة ${index + 1}`}
              onMove={move}
              onRemove={remove}
            />
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading > 0 || fields.length >= MAX_IMAGES}
        onClick={() => inputRef.current?.click()}
      >
        {uploading > 0 ? (
          <Loader2Icon className="animate-spin" aria-hidden="true" />
        ) : (
          <ImagePlusIcon aria-hidden="true" />
        )}
        {uploading > 0 ? `جارٍ رفع ${uploading}…` : 'إضافة صور'}
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = '';
          void uploadFiles(files);
        }}
      />
    </div>
  );
}
