'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { createProject, updateProject } from '@/app/(dashboard)/projects/actions';
import type { ProjectFormOptions } from '@/app/(dashboard)/projects/options';
import { CheckboxField, SelectField, StatusField, TextAreaField, TextField } from '@/components/forms/fields';
import { FormActions } from '@/components/forms/form-actions';
import { describedBy, FormField } from '@/components/forms/form-field';
import { FormSection } from '@/components/forms/form-section';
import { ImageField } from '@/components/forms/image-field';
import { TagInput } from '@/components/forms/tag-input';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import { useSlugSuggestion } from '@/hooks/use-slug-suggestion';
import { projectPhaseLabels } from '@/lib/constants/labels';
import { type ProjectFormValues, type ProjectPayload, projectDefaults, projectSchema } from '@/lib/validation/schemas';
import type { Project, ProjectPhase } from '@/types/api';

import { FeaturesEditor } from './features-editor';
import { GalleryEditor } from './gallery-editor';
import { MembersEditor } from './members-editor';

const phases: ProjectPhase[] = ['COMPLETED', 'LIVE', 'IN_PROGRESS'];
const SEO_TITLE_RECOMMENDED = 60;
const SEO_DESCRIPTION_RECOMMENDED = 155;

export function ProjectForm({ project, options }: { project?: Project; options: ProjectFormOptions }) {
  const router = useRouter();
  const form = useForm<ProjectFormValues, unknown, ProjectPayload>({
    resolver: zodResolver(projectSchema),
    defaultValues: projectDefaults(project),
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getFieldState,
    formState: { errors, isSubmitting, isDirty },
  } = form;
  const feedback = useActionFeedback(form.setError);
  useSlugSuggestion({ control, setValue, getFieldState, source: 'title', enabled: !project });

  const onSubmit = handleSubmit(async (payload) => {
    const result = project ? await updateProject(project.id, payload) : await createProject(payload);
    if (feedback(result, project ? 'تم حفظ التعديلات' : 'تمت إضافة المشروع')) {
      router.push('/projects');
      router.refresh();
    }
  });

  const [slug, summary, seoTitle, seoDescription] = useWatch({
    control,
    name: ['slug', 'summary', 'seoTitle', 'seoDescription'],
  });
  const seoTitleLength = seoTitle.length;
  const seoDescriptionLength = seoDescription.length;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection title="البيانات الأساسية">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="title"
            label="اسم المشروع"
            required
            error={errors.title?.message}
            registration={register('title')}
          />
          <TextField
            id="slug"
            label="رابط المشروع (Slug)"
            required
            dir="ltr"
            hint={<span dir="ltr">/projects/{slug || 'my-project'}</span>}
            error={errors.slug?.message}
            registration={register('slug')}
          />
        </div>
        <TextAreaField
          id="summary"
          label="وصف مختصر"
          required
          rows={2}
          maxLength={400}
          currentLength={summary.length}
          hint="يظهر على بطاقة المشروع وفي نتائج البحث."
          error={errors.summary?.message}
          registration={register('summary')}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            id="category"
            label="نوع المشروع"
            placeholder="تطبيق موبايل"
            error={errors.category?.message}
            registration={register('category')}
          />
          <SelectField
            id="phase"
            label="مرحلة المشروع"
            options={phases.map((phase) => ({ value: phase, label: projectPhaseLabels[phase] }))}
            error={errors.phase?.message}
            registration={register('phase')}
          />
          <StatusField
            id="status"
            label="حالة النشر"
            error={errors.status?.message}
            registration={register('status')}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            id="startDate"
            label="تاريخ البدء"
            type="date"
            dir="ltr"
            error={errors.startDate?.message}
            registration={register('startDate')}
          />
          <TextField
            id="endDate"
            label="تاريخ الانتهاء"
            type="date"
            dir="ltr"
            hint="اتركه فارغاً إذا كان المشروع مستمراً."
            error={errors.endDate?.message}
            registration={register('endDate')}
          />
          <div className="flex items-end pb-2">
            <CheckboxField
              id="isFeatured"
              label="مشروع مميز"
              hint="يظهر في الصفحة الرئيسية."
              registration={register('isFeatured')}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="قصة المشروع"
        description="اكتب بوضوح وبدون مبالغة. افصل الفقرات بسطر فارغ، وابدأ السطر بـ «-» لإنشاء قائمة."
      >
        <TextAreaField
          id="description"
          label="نظرة عامة"
          rows={5}
          error={errors.description?.message}
          registration={register('description')}
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <TextAreaField
            id="problem"
            label="المشكلة"
            rows={5}
            error={errors.problem?.message}
            registration={register('problem')}
          />
          <TextAreaField
            id="solution"
            label="الحل"
            rows={5}
            error={errors.solution?.message}
            registration={register('solution')}
          />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <TextAreaField
            id="ourRole"
            label="دورنا في المشروع"
            rows={4}
            error={errors.ourRole?.message}
            registration={register('ourRole')}
          />
          <TextAreaField
            id="results"
            label="النتائج"
            rows={4}
            hint="أرقام ونتائج حقيقية يمكن إثباتها فقط."
            error={errors.results?.message}
            registration={register('results')}
          />
        </div>
      </FormSection>

      <FormSection title="الميزات">
        <FeaturesEditor control={control} register={register} errors={errors.features} />
      </FormSection>

      <FormSection
        title="الصور"
        description="صورة الغلاف تظهر في البطاقات وأعلى صفحة المشروع. الصور تُحوَّل تلقائياً إلى WebP."
      >
        <Controller
          control={control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormField
              label="صورة الغلاف"
              htmlFor="coverImageUrl"
              hint="نسبة 16:9 مقترحة."
              error={errors.coverImageUrl?.message}
            >
              <ImageField
                id="coverImageUrl"
                folder="projects"
                value={field.value}
                onChange={(url) => field.onChange(url)}
                invalid={Boolean(errors.coverImageUrl)}
                describedBy={describedBy('coverImageUrl', errors.coverImageUrl?.message, true)}
              />
            </FormField>
          )}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium">صور من المشروع</p>
          <GalleryEditor control={control} register={register} />
        </div>
      </FormSection>

      <FormSection title="التقنيات والخدمات">
        <Controller
          control={control}
          name="technologies"
          render={({ field }) => (
            <FormField
              label="التقنيات"
              htmlFor="technologies"
              hint="اضغط Enter بعد كل تقنية."
              error={errors.technologies?.message}
            >
              <TagInput
                id="technologies"
                value={field.value}
                onChange={field.onChange}
                suggestions={options.technologies}
                describedBy={describedBy('technologies', errors.technologies?.message, true)}
              />
            </FormField>
          )}
        />
        {options.services.length ? (
          <Controller
            control={control}
            name="serviceIds"
            render={({ field }) => (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">الخدمات المرتبطة</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.services.map((service) => {
                    const checked = field.value.includes(service.id);
                    return (
                      <label key={service.id} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 accent-primary"
                          checked={checked}
                          onChange={() =>
                            field.onChange(
                              checked ? field.value.filter((id) => id !== service.id) : [...field.value, service.id],
                            )
                          }
                        />
                        {service.title}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}
          />
        ) : null}
      </FormSection>

      <FormSection title="فريق العمل">
        <MembersEditor
          control={control}
          register={register}
          errors={errors.members}
          teamMembers={options.teamMembers}
        />
      </FormSection>

      <FormSection title="العميل والروابط">
        <SelectField
          id="clientId"
          label="العميل"
          placeholder="بدون عميل"
          hint="لا يظهر اسم العميل في الموقع إلا إذا كان منشوراً مع موافقته."
          options={options.clients.map((client) => ({ value: String(client.id), label: client.name }))}
          error={errors.clientId?.message}
          registration={register('clientId')}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="liveUrl"
            label="رابط المشروع"
            dir="ltr"
            placeholder="https://"
            error={errors.liveUrl?.message}
            registration={register('liveUrl')}
          />
          <TextField
            id="repositoryUrl"
            label="رابط الكود (GitHub)"
            dir="ltr"
            placeholder="https://github.com/…"
            error={errors.repositoryUrl?.message}
            registration={register('repositoryUrl')}
          />
        </div>
      </FormSection>

      <FormSection title="محركات البحث (SEO)" description="اختياري. عند تركها فارغة تُستخدم بيانات المشروع تلقائياً.">
        <TextField
          id="seoTitle"
          label="عنوان SEO"
          hint={`${seoTitleLength} / ${SEO_TITLE_RECOMMENDED} حرفاً مقترحاً`}
          error={errors.seoTitle?.message}
          registration={register('seoTitle')}
        />
        <TextAreaField
          id="seoDescription"
          label="وصف SEO"
          rows={2}
          hint={`${seoDescriptionLength} / ${SEO_DESCRIPTION_RECOMMENDED} حرفاً مقترحاً`}
          error={errors.seoDescription?.message}
          registration={register('seoDescription')}
        />
        <Controller
          control={control}
          name="ogImageUrl"
          render={({ field }) => (
            <FormField
              label="صورة المشاركة (Open Graph)"
              htmlFor="ogImageUrl"
              hint="1200×630 مقترحة. تُستخدم صورة الغلاف إذا تُركت فارغة."
              error={errors.ogImageUrl?.message}
            >
              <ImageField
                id="ogImageUrl"
                folder="projects"
                value={field.value}
                onChange={(url) => field.onChange(url)}
                invalid={Boolean(errors.ogImageUrl)}
                describedBy={describedBy('ogImageUrl', errors.ogImageUrl?.message, true)}
              />
            </FormField>
          )}
        />
      </FormSection>

      <FormActions submitting={isSubmitting} cancelHref="/projects" dirty={!project || isDirty} />
    </form>
  );
}
