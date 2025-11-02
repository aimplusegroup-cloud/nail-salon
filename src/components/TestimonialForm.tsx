"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import AuthWithPhone from "./AuthWithPhone";

export default function TestimonialForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    typeof document !== "undefined" && document.cookie.includes("user_token=")
  );
  const [showAuth, setShowAuth] = useState(false);

  const submitTestimonial = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      if (res.ok && json?.success) {
        toast.success("✅ نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود");
        setText("");
      } else {
        toast.error(json?.message || "❌ خطا در ثبت نظر");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("❌ متن نظر را وارد کنید");
      return;
    }
    if (!loggedIn) {
      setShowAuth(true);
      return;
    }
    await submitTestimonial();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center gap-3 bg-white/90 border border-rose-100 rounded-xl shadow p-3"
      >
        <textarea
          placeholder="نظر شما..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input flex-1 text-sm resize-none"
          rows={2}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="cta-primary px-4 py-2 text-sm whitespace-nowrap"
        >
          {loading ? "در حال ارسال..." : "ارسال نظر"}
        </button>
      </form>

      {/* مودال OTP */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full relative">
            {/* دکمه بستن */}
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <AuthWithPhone
              onSuccess={async () => {
                setLoggedIn(true);
                setShowAuth(false);
                await submitTestimonial();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
