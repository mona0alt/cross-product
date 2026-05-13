'use client';

import React from 'react';
import { useState } from 'react';

type ContactFormCopy = {
  title: string;
  name: string;
  email: string;
  content: string;
  submit: string;
  success: string;
};

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  return (
    <form
      className="rounded-[var(--mk-radius-lg)] border border-[var(--mk-border)] bg-white p-5 shadow-[0_18px_44px_rgba(112,89,81,0.08)] sm:p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(event.currentTarget);
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            content: formData.get('content')
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
      <div className="space-y-4">
        <h2 className="text-2xl font-black tracking-[-0.03em] text-[var(--mk-text)]">
          {copy.title}
        </h2>
        <input
          className="w-full rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] px-4 py-3 text-sm text-[var(--mk-text)] outline-none transition placeholder:text-[var(--mk-text-muted)] focus:border-[var(--mk-accent)] focus:bg-white"
          placeholder={copy.name}
          name="name"
        />
        <input
          className="w-full rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] px-4 py-3 text-sm text-[var(--mk-text)] outline-none transition placeholder:text-[var(--mk-text-muted)] focus:border-[var(--mk-accent)] focus:bg-white"
          placeholder={copy.email}
          name="email"
          type="email"
        />
        <textarea
          className="min-h-36 w-full rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] px-4 py-3 text-sm text-[var(--mk-text)] outline-none transition placeholder:text-[var(--mk-text-muted)] focus:border-[var(--mk-accent)] focus:bg-white"
          placeholder={copy.content}
          name="content"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[var(--mk-radius-md)] bg-[var(--mk-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--mk-text)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? '...' : copy.submit}
      </button>
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      {submitted ? <p className="mt-3 text-sm font-semibold text-[var(--mk-success)]">{copy.success}</p> : null}
    </form>
  );
}
