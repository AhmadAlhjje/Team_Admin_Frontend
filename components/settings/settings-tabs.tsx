'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { replaceProcessSteps, replaceSocialLinks, updateSettings } from '@/app/(dashboard)/settings/actions';
import { ArrayItemControls } from '@/components/forms/array-item-controls';
import { TextAreaField, TextField } from '@/components/forms/fields';
import { describedBy, FormField } from '@/components/forms/form-field';
import { FormSection } from '@/components/forms/form-section';
import { ImageField } from '@/components/forms/image-field';
import { SocialLinksEditor } from '@/components/forms/social-links-editor';
import { SubmitButton } from '@/components/forms/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActionFeedback } from '@/hooks/use-action-feedback';
import {
  contactSettingsSchema,
  generalSettingsSchema,
  homepageSettingsSchema,
  processStepsSchema,
  settingsDefaults,
  socialLinksSchema,
} from '@/lib/validation/schemas';
import type { SiteSettings } from '@/types/api';

type Defaults = ReturnType<typeof settingsDefaults>;

export function SettingsTabs({ settings }: { settings: SiteSettings }) {
  const defaults = settingsDefaults(settings);

  return (
    <Tabs defaultValue="general" dir="rtl">
      <TabsList className="mb-4 flex h-auto flex-wrap">
        <TabsTrigger value="general">عام</TabsTrigger>
        <TabsTrigger value="contact">التواصل</TabsTrigger>
        <TabsTrigger value="homepage">نصوص الموقع</TabsTrigger>
        <TabsTrigger value="steps">كيف نعمل</TabsTrigger>
        <TabsTrigger value="social">روابط التواصل</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralForm defaults={defaults.general} />
      </TabsContent>
      <TabsContent value="contact">
        <ContactForm defaults={defaults.contact} />
      </TabsContent>
      <TabsContent value="homepage">
        <HomepageForm defaults={defaults.homepage} />
      </TabsContent>
      <TabsContent value="steps">
        <StepsForm defaults={defaults.steps} />
      </TabsContent>
      <TabsContent value="social">
        <SocialForm defaults={defaults.social} />
      </TabsContent>
    </Tabs>
  );
}

function GeneralForm({ defaults }: { defaults: Defaults['general'] }) {
  const router = useRouter();
  const form = useForm<z.input<typeof generalSettingsSchema>, unknown, z.output<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: defaults,
  });
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    if (feedback(await updateSettings(payload), 'تم حفظ الإعدادات')) {
      form.reset(form.getValues());
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormSection title="هوية الموقع" actions={<SubmitButton submitting={formState.isSubmitting} />}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="siteName"
            label="اسم الفريق"
            required
            error={errors.siteName?.message}
            registration={register('siteName')}
          />
          <TextField
            id="tagline"
            label="الشعار النصي (Tagline)"
            hint="يظهر بجانب الاسم في عنوان الصفحة الرئيسية."
            error={errors.tagline?.message}
            registration={register('tagline')}
          />
        </div>
        <TextAreaField
          id="description"
          label="الوصف الافتراضي"
          rows={3}
          hint="يُستخدم في وصف الموقع لمحركات البحث (≈155 حرفاً)."
          error={errors.description?.message}
          registration={register('description')}
        />
        <TextField
          id="foundedYear"
          label="سنة تأسيس الفريق"
          inputMode="numeric"
          dir="ltr"
          hint="تُستخدم لحساب «سنوات العمل». اتركها فارغة لإخفاء هذا الرقم."
          error={errors.foundedYear?.message}
          registration={register('foundedYear')}
          className="sm:max-w-xs"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <Controller
            control={control}
            name="logoUrl"
            render={({ field }) => (
              <FormField label="الشعار" htmlFor="logoUrl" error={errors.logoUrl?.message}>
                <ImageField
                  id="logoUrl"
                  folder="settings"
                  aspect="square"
                  value={field.value}
                  onChange={(url) => field.onChange(url)}
                  describedBy={describedBy('logoUrl', errors.logoUrl?.message)}
                />
              </FormField>
            )}
          />
          <Controller
            control={control}
            name="defaultOgImageUrl"
            render={({ field }) => (
              <FormField
                label="صورة المشاركة الافتراضية"
                htmlFor="defaultOgImageUrl"
                hint="1200×630، تظهر عند مشاركة روابط الموقع."
                error={errors.defaultOgImageUrl?.message}
              >
                <ImageField
                  id="defaultOgImageUrl"
                  folder="settings"
                  value={field.value}
                  onChange={(url) => field.onChange(url)}
                  describedBy={describedBy('defaultOgImageUrl', errors.defaultOgImageUrl?.message, true)}
                />
              </FormField>
            )}
          />
        </div>
      </FormSection>
    </form>
  );
}

function ContactForm({ defaults }: { defaults: Defaults['contact'] }) {
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(contactSettingsSchema), defaultValues: defaults });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    if (feedback(await updateSettings(payload), 'تم حفظ بيانات التواصل')) {
      form.reset(form.getValues());
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormSection
        title="بيانات التواصل"
        description="تظهر في صفحة التواصل وتذييل الموقع. الحقول الفارغة لا تظهر."
        actions={<SubmitButton submitting={formState.isSubmitting} />}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="email"
            label="البريد الإلكتروني"
            type="email"
            dir="ltr"
            error={errors.email?.message}
            registration={register('email')}
          />
          <TextField
            id="phone"
            label="الهاتف"
            dir="ltr"
            placeholder="+963 …"
            error={errors.phone?.message}
            registration={register('phone')}
          />
          <TextField
            id="whatsapp"
            label="واتساب"
            dir="ltr"
            placeholder="+963 …"
            hint="مع رمز الدولة."
            error={errors.whatsapp?.message}
            registration={register('whatsapp')}
          />
          <TextField
            id="location"
            label="الموقع"
            placeholder="المدينة، الدولة"
            error={errors.location?.message}
            registration={register('location')}
          />
        </div>
      </FormSection>
    </form>
  );
}

function HomepageForm({ defaults }: { defaults: Defaults['homepage'] }) {
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(homepageSettingsSchema), defaultValues: defaults });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    if (feedback(await updateSettings(payload), 'تم حفظ النصوص')) {
      form.reset(form.getValues());
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormSection
        title="الواجهة الرئيسية (Hero)"
        description="أول ما يراه الزائر. اتركها فارغة لاستخدام النص الافتراضي."
        actions={<SubmitButton submitting={formState.isSubmitting} />}
      >
        <TextField
          id="heroTitle"
          label="العنوان"
          placeholder="نبني منتجات رقمية *تحل مشاكل حقيقية*."
          hint="لتمييز كلمات بلون الهوية ضعها بين نجمتين، مثل: نبني منتجات *متينة*."
          error={errors.heroTitle?.message}
          registration={register('heroTitle')}
        />
        <TextAreaField
          id="heroSubtitle"
          label="الوصف"
          rows={2}
          error={errors.heroSubtitle?.message}
          registration={register('heroSubtitle')}
        />
      </FormSection>
      <FormSection title="من نحن">
        <TextField
          id="aboutTitle"
          label="العنوان"
          error={errors.aboutTitle?.message}
          registration={register('aboutTitle')}
        />
        <TextAreaField
          id="aboutSummary"
          label="نبذة مختصرة (الصفحة الرئيسية)"
          rows={3}
          error={errors.aboutSummary?.message}
          registration={register('aboutSummary')}
        />
        <TextAreaField
          id="aboutContent"
          label="قصة الفريق (صفحة من نحن)"
          rows={10}
          hint="كيف بدأ الفريق، ما الذي يجمعكم، ما الذي تركزون عليه. افصل الفقرات بسطر فارغ."
          error={errors.aboutContent?.message}
          registration={register('aboutContent')}
        />
      </FormSection>
      <FormSection title="دعوة للتواصل (CTA)">
        <TextField
          id="ctaTitle"
          label="العنوان"
          placeholder="عندك مشروع؟ احكيلنا عنه."
          error={errors.ctaTitle?.message}
          registration={register('ctaTitle')}
        />
        <TextAreaField
          id="ctaSubtitle"
          label="الوصف"
          rows={2}
          error={errors.ctaSubtitle?.message}
          registration={register('ctaSubtitle')}
        />
      </FormSection>
    </form>
  );
}

function StepsForm({ defaults }: { defaults: Defaults['steps'] }) {
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(processStepsSchema), defaultValues: defaults });
  const { register, control, handleSubmit, formState } = form;
  const { fields, append, remove, move } = useFieldArray({ control, name: 'steps' });
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    if (feedback(await replaceProcessSteps(payload.steps), 'تم حفظ الخطوات')) {
      form.reset(form.getValues());
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormSection
        title="كيف نعمل"
        description="الخطوات التي يمر بها العميل معكم. تُرقَّم تلقائياً بحسب الترتيب."
        actions={<SubmitButton submitting={formState.isSubmitting} />}
      >
        {fields.map((field, index) => {
          const titleError = formState.errors.steps?.[index]?.title?.message;
          return (
            <div key={field.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <span className="mt-2 w-6 shrink-0 text-center font-semibold text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="grid flex-1 gap-2">
                <Input
                  placeholder="عنوان الخطوة"
                  aria-label={`عنوان الخطوة ${index + 1}`}
                  aria-invalid={Boolean(titleError)}
                  {...register(`steps.${index}.title`)}
                />
                {titleError ? (
                  <p role="alert" className="text-xs font-medium text-destructive">
                    {titleError}
                  </p>
                ) : null}
                <Input
                  placeholder="شرح مختصر"
                  aria-label={`شرح الخطوة ${index + 1}`}
                  {...register(`steps.${index}.description`)}
                />
              </div>
              <ArrayItemControls
                index={index}
                count={fields.length}
                label={`الخطوة ${index + 1}`}
                onMove={move}
                onRemove={remove}
              />
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={fields.length >= 12}
          onClick={() => append({ title: '', description: '' })}
        >
          <PlusIcon aria-hidden="true" />
          إضافة خطوة
        </Button>
      </FormSection>
    </form>
  );
}

function SocialForm({ defaults }: { defaults: Defaults['social'] }) {
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(socialLinksSchema), defaultValues: defaults });
  const { register, control, handleSubmit, formState } = form;
  const feedback = useActionFeedback(form.setError);

  const onSubmit = handleSubmit(async (payload) => {
    if (feedback(await replaceSocialLinks(payload.links), 'تم حفظ الروابط')) {
      form.reset(form.getValues());
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormSection
        title="روابط الفريق على المنصات"
        description="تظهر في تذييل الموقع وصفحة التواصل."
        actions={<SubmitButton submitting={formState.isSubmitting} />}
      >
        <SocialLinksEditor
          control={control}
          register={register}
          name="links"
          errors={formState.errors.links as never}
          max={20}
        />
      </FormSection>
    </form>
  );
}
