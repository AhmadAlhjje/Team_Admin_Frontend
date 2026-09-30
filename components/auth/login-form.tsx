'use client';

import { Loader2Icon } from 'lucide-react';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction, type LoginState } from '@/lib/actions/session-actions';

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <Card className="border border-border bg-card/90 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)] backdrop-blur">
      <CardContent>
        <form action={formAction} className="space-y-4" noValidate>
          <input type="hidden" name="next" value={next} />

          {state.error ? (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="username"
              required
              autoFocus
              defaultValue={state.email}
              aria-invalid={Boolean(state.error)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              required
              aria-invalid={Boolean(state.error)}
            />
          </div>

          <Button type="submit" className="h-10 w-full" disabled={pending}>
            {pending ? <Loader2Icon className="animate-spin" aria-hidden="true" /> : null}
            {pending ? 'جارٍ تسجيل الدخول…' : 'تسجيل الدخول'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
