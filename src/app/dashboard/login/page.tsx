"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
        credentials: "include", // 👈 حیاتی برای ذخیره و ارسال کوکی
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "ورود ناموفق بود ❌");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <form
        onSubmit={handleSubmit}
        className="card p-6 max-w-sm w-full space-y-4 shadow-lg border border-gray-200 bg-white"
      >
        <h2 className="text-2xl font-bold text-center text-pink-700">ورود مدیر</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full"
          placeholder="ایمیل مدیر"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input w-full"
          placeholder="رمز عبور"
          required
        />

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          مرا به خاطر بسپار
        </label>

        {error && (
          <div className="badge bg-rose-100 text-rose-700 w-full text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="cta-primary w-full flex justify-center items-center"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>

        <div className="mt-4 text-center">
          <Link
            href="/dashboard/forgot"
            className="text-sm text-rose-600 hover:underline"
          >
            فراموشی رمز عبور؟
          </Link>
        </div>
      </form>
    </div>
  );
}
