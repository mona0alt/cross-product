import React from 'react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50">
      <section className="max-w-2xl space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Cross</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Next.js skeleton is ready.</h1>
        <p className="max-w-xl text-base leading-7 text-slate-300">
          Edit <code className="rounded bg-white/10 px-1.5 py-0.5">src/app/page.tsx</code> to start building.
        </p>
      </section>
    </main>
  );
}
