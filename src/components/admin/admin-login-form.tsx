'use client';

import { useState } from 'react';
import { Lock, Shield, User } from 'lucide-react';

type AdminLoginCopy = {
  tagline: string;
  eyebrow: string;
  title: string;
  username: string;
  password: string;
  passwordPlaceholder: string;
  submit: string;
  submitting: string;
  invalidCredentials: string;
  genericError: string;
  networkError: string;
};

export function AdminLoginForm({ copy }: { copy: AdminLoginCopy }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error === 'INVALID_CREDENTIALS' ? copy.invalidCredentials : copy.genericError);
        return;
      }

      window.location.href = '/admin/analytics';
    } catch (err) {
      setError(copy.networkError);
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-3 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

  return (
    <main className="flex min-h-screen items-center justify-center bg-admin-bg px-6 py-12 text-admin-text-primary font-body">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-admin-accent/10">
            <Shield className="h-6 w-6 text-admin-accent" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight font-display">
            Cross Admin
          </h1>
          <p className="mt-1 text-sm text-admin-text-secondary">
            {copy.tagline}
          </p>
        </div>

        <form
          className="space-y-5 rounded-xl border border-admin-border bg-admin-surface p-8 shadow-lg shadow-black/5"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
              {copy.eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
              {copy.title}
            </h2>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-admin-text-secondary">{copy.username}</span>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
              <input
                className={`${inputClass} pl-10`}
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-admin-text-secondary">{copy.password}</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
              <input
                className={`${inputClass} pl-10`}
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={copy.passwordPlaceholder}
                autoComplete="current-password"
              />
            </div>
          </label>

          {error ? (
            <p className="rounded-lg border border-admin-danger/20 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
              {error}
            </p>
          ) : null}

          <button
            className="w-full rounded-lg bg-admin-accent px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-admin-accent-hover disabled:cursor-not-allowed disabled:opacity-70 shadow-sm shadow-admin-accent/20"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? copy.submitting : copy.submit}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-admin-text-muted">
          Cross Platform &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
