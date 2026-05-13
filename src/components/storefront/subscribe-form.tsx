'use client';

import React from 'react';
import { useState } from 'react';

type SubscribeFormCopy = {
  title: string;
  email: string;
  submit: string;
  success: string;
};

export function SubscribeForm({ copy }: { copy: SubscribeFormCopy }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  return (
    <form
      className="w-full rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-6 shadow-[0_18px_50px_rgba(112,89,81,0.08)] sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(event.currentTarget);
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.get('email'),
            source: 'storefront'
          })
        });

        if (!response.ok) {
          setError('提交失败，请稍后再试。');
          setIsSubmitting(false);
          return;
        }

        setSubmitted(true);
        setIsSubmitting(false);
        event.currentTarget.reset();
      }}
    >
      <div className="space-y-5">
        <h2 className="text-center text-2xl font-bold text-[var(--mk-text)] sm:text-3xl">
          {copy.title}
        </h2>
        <input
          className="min-h-12 w-full rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] px-4 py-3 text-sm text-[var(--mk-text)] outline-none transition placeholder:text-[var(--mk-text-muted)] focus:border-[var(--mk-accent)] focus:bg-white"
          placeholder={copy.email}
          name="email"
          type="email"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--mk-radius-md)] bg-[var(--mk-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--mk-text)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? '...' : copy.submit}
      </button>
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      {submitted ? <p className="mt-3 text-sm font-semibold text-[var(--mk-success)]">{copy.success}</p> : null}
    </form>
  );
}
