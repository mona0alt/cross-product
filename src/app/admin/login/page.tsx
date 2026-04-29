'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
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
        setError('用户名或密码错误。');
        return;
      }

      router.push('/admin');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-50">
      <form
        className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Cross Admin
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">管理员登录</h1>
          <p className="text-sm text-slate-300">
            使用单管理员账户进入后台。
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-slate-200">用户名</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-500"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
            autoComplete="username"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-slate-200">密码</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none ring-0 placeholder:text-slate-500"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="请输入密码"
            autoComplete="current-password"
          />
        </label>

        {error ? (
          <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <button
          className="w-full rounded-xl bg-amber-300 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '登录中...' : '登录'}
        </button>
      </form>
    </main>
  );
}
