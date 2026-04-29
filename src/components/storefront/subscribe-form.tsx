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
      className="space-y-4 rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)]"
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
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        {copy.title}
      </h2>
      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        placeholder={copy.email}
        name="email"
        type="email"
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
