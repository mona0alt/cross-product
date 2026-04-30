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
      className="storefront-surface space-y-4 rounded-[var(--store-radius-lg)] p-6"
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
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        {copy.title}
      </h2>
      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        placeholder={copy.name}
        name="name"
      />
      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        placeholder={copy.email}
        name="email"
        type="email"
      />
      <textarea
        className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        placeholder={copy.content}
        name="content"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
      >
        {isSubmitting ? '...' : copy.submit}
      </button>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {submitted ? <p className="text-sm text-emerald-600">{copy.success}</p> : null}
    </form>
  );
}
