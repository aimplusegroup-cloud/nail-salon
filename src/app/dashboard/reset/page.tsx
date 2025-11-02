"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMsg("توکن معتبر نیست ❌");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setMsg("رمزها یکسان نیستند ❌");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }), // 👈 هر سه فیلد ارسال می‌شوند
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("رمز عبور با موفقیت تغییر کرد ✅");
        setTimeout(() => router.push("/dashboard/login"), 2000);
      } else {
        setMsg(data.message || "خطا در تغییر رمز ❌");
      }
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
          تغییر رمز عبور
        </h2>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input w-full"
          placeholder="رمز عبور جدید"
          required
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input w-full"
          placeholder="تکرار رمز عبور"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="cta-primary w-full flex justify-center items-center"
        >
          {loading ? "در حال تغییر..." : "تغییر رمز"}
        </button>

        {msg && (
          <div className="mt-4 text-sm text-center text-gray-700">{msg}</div>
        )}
      </form>
    </div>
  );
}
