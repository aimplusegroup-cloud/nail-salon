"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  status: string;
  user?: { name?: string; phone?: string } | null;
  service?: { name?: string } | null;
  staff?: { name?: string } | null;
  startsAt: string;
  endsAt: string;
  notes?: string | null;
};

export default function ReservationsPanel() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // گرفتن لیست رزروها از API
  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations", { cache: "no-store" });
      if (!res.ok) throw new Error("خطا در دریافت رزروها");
      const data = await res.json();
      if (Array.isArray(data)) {
        setReservations(data);
      }
    } catch (err) {
      console.error("❌ Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  // تغییر وضعیت رزرو
  const updateStatus = async (id: string, status: "CONFIRMED" | "CANCELED") => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        console.error("❌ Error updating status:", await res.text());
        return;
      }

      // بعد از تغییر وضعیت، دوباره داده‌ها رو از API بگیر
      await fetchReservations();
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return <div className="card p-6">⏳ در حال بارگذاری...</div>;
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold mb-4">مدیریت رزروها</h2>

      {reservations.length === 0 ? (
        <p className="text-gray-500">هیچ رزروی ثبت نشده است.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">مشتری</th>
              <th className="p-2 border">موبایل</th>
              <th className="p-2 border">خدمت</th>
              <th className="p-2 border">پرسنل</th>
              <th className="p-2 border">تاریخ</th>
              <th className="p-2 border">ساعت</th>
              <th className="p-2 border">وضعیت</th>
              <th className="p-2 border">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => {
              const [date, time] = r.startsAt.split(" ");
              return (
                <tr key={r.id}>
                  <td className="p-2 border">{r.user?.name || "-"}</td>
                  <td className="p-2 border">{r.user?.phone || "-"}</td>
                  <td className="p-2 border">{r.service?.name || "-"}</td>
                  <td className="p-2 border">{r.staff?.name || "-"}</td>
                  <td className="p-2 border">{date}</td>
                  <td className="p-2 border">{time}</td>
                  <td className="p-2 border">{r.status}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => updateStatus(r.id, "CONFIRMED")}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      تایید
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "CANCELED")}
                      className="px-2 py-1 bg-red-500 text-white rounded ml-2"
                    >
                      لغو
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
