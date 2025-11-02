"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMsg(data.message);
    } catch (err) {
      setMsg("خطا در ارتباط با سرور ❌");
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
        <h2 className="text-2xl font-bold text-center text-pink-700">
          بازیابی رمز عبور
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full"
          placeholder="ایمیل مدیر"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="cta-primary w-full flex justify-center items-center"
        >
          {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
        </button>

        {msg && (
          <div className="mt-4 text-sm text-center text-gray-700">{msg}</div>
        )}
      </form>
    </div>
  );
}
