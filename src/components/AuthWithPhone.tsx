"use client";

import { useState } from "react";

export default function AuthWithPhone({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function requestOtp() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        setMessage("کد تایید ارسال شد");
      } else {
        setMessage(data.message || "خطا در ارسال کد");
      }
    } catch (err) {
      setMessage("خطای شبکه");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("ورود موفقیت‌آمیز بود");
        if (onSuccess) onSuccess();
      } else {
        setMessage(data.message || "کد نامعتبر است");
      }
    } catch (err) {
      setMessage("خطای شبکه");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4 border rounded">
      {step === "phone" && (
        <>
          <h2 className="text-lg font-bold mb-2">ورود با شماره موبایل</h2>
          <input
            type="tel"
            placeholder="شماره موبایل"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 mb-2"
          />
          <button
            onClick={requestOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "در حال ارسال..." : "ارسال کد تایید"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <h2 className="text-lg font-bold mb-2">کد تایید</h2>
          <input
            type="text"
            placeholder="کد دریافتی"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border p-2 mb-2"
          />
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            {loading ? "در حال بررسی..." : "تایید و ورود"}
          </button>
        </>
      )}

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
