"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Service {
  id: string;
  name: string;
  durationMin: number;
  price: number;
}

export default function ServicesPanel() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ name: "", durationMin: 30, price: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", durationMin: 30, price: 0 });

  // گرفتن لیست خدمات
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch {
      toast.error("خطا در دریافت خدمات");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // افزودن خدمت جدید
  const addService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json?.id) {
        toast.success("خدمت جدید اضافه شد");
        setForm({ name: "", durationMin: 30, price: 0 });
        fetchServices();
      } else {
        toast.error("خطا در افزودن خدمت");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  // حذف خدمت
  const deleteService = async (id: string) => {
    if (!confirm("آیا از حذف این خدمت مطمئن هستید؟")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("خدمت حذف شد");
        fetchServices();
      } else {
        toast.error("خطا در حذف خدمت");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  // شروع ویرایش
  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setEditForm({ name: s.name, durationMin: s.durationMin, price: s.price });
  };

  // ذخیره ویرایش
  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("تغییرات ذخیره شد");
        setEditingId(null);
        fetchServices();
      } else {
        toast.error("خطا در ذخیره تغییرات");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div>
      <h2 className="section-title mb-4">مدیریت خدمات</h2>

      {/* فرم افزودن خدمت */}
      <form onSubmit={addService} className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col flex-1">
          <label className="text-xs text-gray-500 mb-1">نام خدمت</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder="مثلا: مانیکور"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">مدت (دقیقه)</label>
          <input
            type="number"
            value={form.durationMin}
            onChange={(e) => setForm({ ...form, durationMin: +e.target.value })}
            className="input w-28"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">قیمت (تومان)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
            className="input w-32"
            required
          />
        </div>
        <button className="cta-primary self-end">افزودن</button>
      </form>

      {/* لیست خدمات */}
      <ul className="space-y-2">
        {services.map((s) => (
          <li key={s.id} className="card p-3 flex items-center justify-between">
            {editingId === s.id ? (
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">نام خدمت</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">مدت (دقیقه)</label>
                    <input
                      type="number"
                      value={editForm.durationMin}
                      onChange={(e) =>
                        setEditForm({ ...editForm, durationMin: +e.target.value })
                      }
                      className="input w-28"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">قیمت (تومان)</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: +e.target.value })
                      }
                      className="input w-32"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(s.id)} className="cta-primary">
                    ذخیره
                  </button>
                  <button onClick={() => setEditingId(null)} className="cta-secondary">
                    انصراف
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="font-bold">{s.name}</span>
                  <div className="text-gray-600 text-sm">مدت: {s.durationMin} دقیقه</div>
                  <div className="text-pink-600 font-semibold">
                    {typeof s.price === "number"
                      ? s.price.toLocaleString("fa-IR")
                      : "0"}{" "}
                    تومان
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(s)} className="cta-secondary">
                    ویرایش
                  </button>
                  <button
                    onClick={() => deleteService(s.id)}
                    className="cta-secondary bg-red-500 text-white"
                  >
                    حذف
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
