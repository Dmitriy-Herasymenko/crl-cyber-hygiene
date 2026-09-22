"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Невірний пароль");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-sm"
    >
      <h1 className="text-lg font-semibold text-slate-800 mb-5">
        Вхід для адміністратора
      </h1>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Пароль
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        autoFocus
      />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Перевірка…" : "Увійти"}
      </button>
    </form>
  );
}
