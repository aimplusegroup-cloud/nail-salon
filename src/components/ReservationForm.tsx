"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AuthWithPhone from "./AuthWithPhone";

type ServiceOption = { id: string; name: string; durationMin: number; price: number };
type StaffOption = { id: string; name: string; bio?: string };

const services: ServiceOption[] = [
  { id: "svc_manicure", name: "مانیکور لوکس", durationMin: 45, price: 200000 },
  { id: "svc_pedicure", name: "پدیکور حرفه‌ای", durationMin: 60, price: 250000 },
  { id: "svc_gel", name: "لاک ژل رزگلد", durationMin: 50, price: 300000 },
  { id: "svc_french", name: "فرنچ کلاسیک", durationMin: 40, price: 220000 },
];

const staff: StaffOption[] = [
  { id: "stf_sara", name: "سارا", bio: "تخصص در ژل و فرنچ" },
  { id: "stf_nazanin", name: "نازنین", bio: "طراحی مینیمال و نگین‌گذاری" },
  { id: "stf_hanie", name: "هانیه", bio: "مانیکور و پدیکور حرفه‌ای" },
];

// ساعات کاری (۱۰ تا ۲۰ هر نیم ساعت)
const workingHours = Array.from({ length: 20 - 10 }, (_, i) => i + 10)
  .flatMap((h) => [`${h.toString().padStart(2, "0")}:00`, `${h.toString().padStart(2, "0")}:30`]);

export default function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    serviceId: services[0].id,
    staffId: staff[0].id,
    date: "",
    time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    setLoggedIn(document.cookie.includes("user_token="));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "نام را وارد کنید";
    if (!/^0\d{9,10}$/.test(form.phone)) return "شماره موبایل معتبر وارد کنید (با 0 شروع شود)";
    if (!form.date) return "تاریخ را وارد کنید (مثلاً 1404/08/01)";
    if (!form.time) return "ساعت را انتخاب کنید";
    return null;
  };

  const submitReservation = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        startsAt: `${form.date} ${form.time}`,
        endsAt: "",
      };

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json?.success) {
        toast.success("رزرو شما با موفقیت ثبت شد ✅");
        setForm((prev) => ({ ...prev, notes: "" }));
      } else {
        toast.error(json?.error || "خطا در ثبت رزرو ❌");
      }
    } catch {
      toast.error("اتصال به سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    if (!loggedIn) {
      setShowAuth(true);
      return;
    }
    await submitReservation();
  };

  const selectedService = services.find((s) => s.id === form.serviceId)!;

  return (
    <>
      <form
        id="reservation-form"
        onSubmit={handleSubmit}
        className="card p-6 space-y-6 max-w-2xl mx-auto"
      >
        {/* نام */}
        <div className="space-y-1">
          <label className="label">نام و نام خانوادگی</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="مثلاً: نگار محمدی"
          />
        </div>

        {/* موبایل */}
        <div className="space-y-1">
          <label className="label">شماره موبایل</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input"
            placeholder="مثلاً: 0912xxxxxxx"
          />
        </div>

        {/* سرویس و پرسنل */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="label">خدمت مورد نظر</label>
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              className="input"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <p className="help">
              مدت: {selectedService.durationMin} دقیقه — هزینه:{" "}
              {selectedService.price.toLocaleString("fa-IR")} تومان
            </p>
          </div>

          <div className="space-y-1">
            <label className="label">انتخاب پرسنل</label>
            <select
              name="staffId"
              value={form.staffId}
              onChange={handleChange}
              className="input"
            >
              {staff.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* تاریخ و ساعت */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="label">تاریخ (شمسی)</label>
            <input
              name="date"
              value={form.date}
              onChange={handleChange}
              className="input"
              placeholder="مثلاً: 1404/08/01"
            />
          </div>

          <div className="space-y-1">
            <label className="label">ساعت</label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              className="input"
            >
              <option value="">انتخاب کنید</option>
              {workingHours.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* توضیحات */}
        <div className="space-y-1">
          <label className="label">توضیحات (اختیاری)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="input min-h-[100px]"
            placeholder="ترجیح رنگ، طرح دلخواه یا نکته‌ای که لازم است بدانیم"
          />
        </div>

        {/* دکمه ثبت */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            با ثبت رزرو، پیامک تایید برای شما ارسال می‌شود
          </div>
          <button type="submit" disabled={loading} className="cta-primary">
            {loading ? "در حال ثبت..." : "ثبت رزرو"}
          </button>
        </div>
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
                await submitReservation();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
