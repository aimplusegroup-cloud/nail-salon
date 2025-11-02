"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordPanel({ email }: { email: string }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("❌ رمز جدید و تکرار آن یکسان نیست");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ رمز عبور با موفقیت تغییر کرد");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "❌ خطا در تغییر رمز عبور");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card p-4 w-full max-w-sm space-y-4 text-sm">
        <h2 className="text-base font-bold text-center">🔑 تغییر رمز عبور</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="password"
            placeholder="رمز فعلی"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input w-full text-sm"
            required
          />
          <input
            type="password"
            placeholder="رمز جدید"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input w-full text-sm"
            required
          />
          <input
            type="password"
            placeholder="تکرار رمز جدید"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input w-full text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="cta-primary w-full text-sm"
          >
            {loading ? "در حال تغییر..." : "تغییر رمز"}
          </button>
        </form>
      </div>
    </div>
  );
}
