"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Staff {
  id: string;
  name: string;
  bio?: string;
  phone?: string;
  email?: string;
  role?: string;
  skills?: string;
  avatarUrl?: string;
  employmentType?: string;
  baseSalary?: number;
  commission?: number;
}

export default function StaffPanel() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [form, setForm] = useState<Partial<Staff>>({
    name: "",
    bio: "",
    phone: "",
    email: "",
    role: "",
    skills: "",
    avatarUrl: "",
    employmentType: "FULLTIME",
    baseSalary: undefined,
    commission: undefined,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Staff>>(form);

  // گرفتن لیست پرسنل
  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setStaff(data);
    } catch {
      toast.error("خطا در دریافت پرسنل");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // افزودن پرسنل
  const addStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json?.id) {
        toast.success("پرسنل جدید اضافه شد");
        setForm({
          name: "",
          bio: "",
          phone: "",
          email: "",
          role: "",
          skills: "",
          avatarUrl: "",
          employmentType: "FULLTIME",
          baseSalary: undefined,
          commission: undefined,
        });
        fetchStaff();
      } else {
        toast.error("خطا در افزودن پرسنل");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  // حذف پرسنل
  const deleteStaff = async (id: string) => {
    if (!confirm("آیا از حذف این پرسنل مطمئن هستید؟")) return;
    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("پرسنل حذف شد");
        fetchStaff();
      } else {
        toast.error("خطا در حذف پرسنل");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  // شروع ویرایش
  const startEdit = (st: Staff) => {
    setEditingId(st.id);
    setEditForm(st);
  };

  // ذخیره ویرایش
  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("تغییرات ذخیره شد");
        setEditingId(null);
        fetchStaff();
      } else {
        toast.error("خطا در ذخیره تغییرات");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div>
      <h2 className="section-title mb-4">مدیریت پرسنل</h2>

      {/* فرم افزودن پرسنل */}
      <form
        onSubmit={addStaff}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-sm"
      >
        <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="نام" required />
        <input value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input" placeholder="توضیحات" />
        <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="شماره تماس" />
        <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="ایمیل" />
        <input value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input" placeholder="نقش" />
        <input value={form.skills || ""} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="input" placeholder="مهارت‌ها" />
        <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="input">
          <option value="FULLTIME">تمام وقت</option>
          <option value="PARTTIME">پاره وقت</option>
          <option value="REMOTE">دورکار</option>
          <option value="CONTRACT">قراردادی</option>
          <option value="COMMISSION_ONLY">فقط پورسانتی</option>
        </select>
        <input type="number" value={form.baseSalary ?? ""} onChange={(e) => setForm({ ...form, baseSalary: e.target.value ? +e.target.value : undefined })} className="input" placeholder="حقوق ثابت" />
        <input type="number" value={form.commission ?? ""} onChange={(e) => setForm({ ...form, commission: e.target.value ? +e.target.value : undefined })} className="input" placeholder="پورسانت (%)" />
        <button className="cta-primary col-span-2 md:col-span-3">افزودن</button>
      </form>

      {/* گرید پرسنل */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {staff.map((st) => (
          <div
            key={st.id}
            className={`card group relative overflow-hidden rounded-lg shadow hover:shadow-md transition ${
              editingId === st.id ? "col-span-full" : ""
            }`}
          >
            {editingId === st.id ? (
              // فرم ویرایش
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 text-sm">
                <input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input" placeholder="نام" />
                <input value={editForm.bio || ""} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className="input" placeholder="توضیحات" />
                <input value={editForm.phone || ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="input" placeholder="شماره تماس" />
                <input value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="input" placeholder="ایمیل" />
                <input value={editForm.role || ""} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="input" placeholder="نقش" />
                <input value={editForm.skills || ""} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} className="input" placeholder="مهارت‌ها" />
                <select value={editForm.employmentType} onChange={(e) => setEditForm({ ...editForm, employmentType: e.target.value })} className="input">
                  <option value="FULLTIME">تمام وقت</option>
                  <option value="PARTTIME">پاره وقت</option>
                  <option value="REMOTE">دورکار</option>
                  <option value="CONTRACT">قراردادی</option>
                  <option value="COMMISSION_ONLY">فقط پورسانتی</option>
                </select>
                <input type="number" value={editForm.baseSalary ?? ""} onChange={(e) => setEditForm({ ...editForm, baseSalary: e.target.value ? +e.target.value : undefined })} className="input" placeholder="حقوق ثابت" />
                                <input
                  type="number"
                  value={editForm.commission ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      commission: e.target.value
                        ? +e.target.value
                        : undefined,
                    })
                  }
                  className="input"
                  placeholder="پورسانت (%)"
                />

                {/* دکمه‌های ذخیره و انصراف */}
                <div className="col-span-2 md:col-span-3 flex gap-2 mt-3">
                  <button
                    onClick={() => saveEdit(st.id)}
                    className="cta-primary flex-1"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="cta-secondary flex-1"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            ) : (
              // حالت نمایش مربعی با عکس
              <div className="aspect-square w-full relative overflow-hidden rounded-lg">
                <img
                  src={st.avatarUrl || "/default-avatar.png"}
                  alt={st.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-center p-2">
                  <h3 className="font-bold text-sm">{st.name}</h3>
                  {st.role && <p className="text-xs">{st.role}</p>}
                  {st.phone && <p className="text-xs">📞 {st.phone}</p>}
                  {st.email && <p className="text-xs">✉️ {st.email}</p>}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEdit(st)}
                      className="cta-secondary text-xs px-2 py-1"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => deleteStaff(st.id)}
                      className="cta-secondary bg-rose-500 text-white text-xs px-2 py-1"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
