// src/components/AdminDashboard.tsx
"use client";

import { useEffect, useState } from "react";

type ReservationRow = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  customer?: { name?: string; phone?: string };
  service?: { name?: string };
  staff?: { name?: string };
  startsAt?: string; // ISO string
};

function StatusBadge({ status }: { status: ReservationRow["status"] }) {
  const map: Record<ReservationRow["status"], string> = {
    PENDING: "در انتظار",
    CONFIRMED: "تایید شده",
    CANCELED: "لغو شده",
    COMPLETED: "انجام شده",
  };
  const styles: Record<ReservationRow["status"], string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CONFIRMED: "bg-green-50 text-green-700 border-green-200",
    CANCELED: "bg-rose-50 text-rose-700 border-rose-200",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return <span className={`badge ${styles[status]}`}>{map[status]}</span>;
}

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/reservations", { cache: "no-store" });
        const data = await res.json();
        setReservations(data || []);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="section">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">رزروهای ثبت شده</h2>
        <div className="badge">نمایش لحظه‌ای</div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>نام مشتری</th>
              <th>شماره تماس</th>
              <th>خدمت</th>
              <th>پرسنل</th>
              <th>وضعیت</th>
              <th>شروع</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-center" colSpan={6}>
                  در حال بارگذاری...
                </td>
              </tr>
            ) : reservations.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={6}>
                  رزروی یافت نشد
                </td>
              </tr>
            ) : (
              reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer?.name || "-"}</td>
                  <td>{r.customer?.phone || "-"}</td>
                  <td>{r.service?.name || "-"}</td>
                  <td>{r.staff?.name || "-"}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    {r.startsAt
                      ? new Date(r.startsAt).toLocaleString("fa-IR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="card-soft p-4 mt-4">
        <div className="text-xs text-gray-500">
          برای ویرایش وضعیت رزروها و مدیریت زمان‌بندی، نسخه‌های بعدی پنل اضافه خواهند شد.
        </div>
      </div>
    </section>
  );
}
