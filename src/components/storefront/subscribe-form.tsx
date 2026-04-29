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

  return (
    <form
      className="space-y-4 rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)]"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
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
        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
      >
        {copy.submit}
      </button>
      {submitted ? <p className="text-sm text-emerald-600">{copy.success}</p> : null}
    </form>
  );
}
