"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  source?: string; // supabase یا static
  createdAt: string;
}

type Tab = "upload" | "list";

export default function GalleryPanel() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [activeTab, setActiveTab] = useState<Tab>("upload");

  // گرفتن لیست تصاویر
  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const res = await fetch("/api/gallery", { cache: "no-store" });
        if (!res.ok) throw new Error(`API error ${res.status}`);

        const data = await res.json();
        console.log("Gallery API response:", data);

        if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data.items)) {
          setItems(data.items);
        } else if (Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
        toast.error("❌ خطا در دریافت داده‌ها");
        setItems([]);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  // پیش‌نمایش فایل انتخاب‌شده
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // آپلود عکس جدید
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("لطفاً یک فایل انتخاب کنید");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    if (description.trim()) formData.append("description", description.trim());
    formData.append("file", file);

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success && json.item) {
        setItems((prev) => [json.item, ...prev]);
        setTitle("");
        setDescription("");
        setFile(null);
        setPreview(null);
        toast.success("✅ عکس با موفقیت اضافه شد");
        setActiveTab("list");
      } else {
        toast.error(json.message || "❌ خطا در افزودن عکس");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // حذف عکس
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این عکس مطمئن هستید؟")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((x) => x.id !== id));
        if (editId === id) setEditId(null);
        toast.success("🗑 عکس حذف شد");
      } else {
        toast.error(json.message || "❌ خطا در حذف عکس");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    }
  };

  // شروع ویرایش
  const startEdit = (item: GalleryItem) => {
    setEditId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description || "");
  };

  // ذخیره تغییرات
  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim(), description: editDescription.trim() }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));
        setEditId(null);
        toast.success("✅ تغییرات ذخیره شد");
      } else {
        toast.error(data.message || "❌ خطا در ویرایش آیتم");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    }
  };

  return (
    <div>
      <h2 className="section-title mb-4">مدیریت گالری</h2>

      {/* تب‌ها */}
      <div className="flex gap-3 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 rounded-t ${activeTab === "upload" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          آپلود جدید
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-t ${activeTab === "list" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          لیست تصاویر
        </button>
      </div>

      {/* فرم آپلود */}
      {activeTab === "upload" && (
        <form onSubmit={handleUpload} className="card p-4 space-y-3 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="عنوان عکس" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input" placeholder="توضیحات (اختیاری)" rows={3} />
              <input id="galleryFileInput" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input" required />
              <button type="submit" className="cta-primary w-full" disabled={loading}>
                {loading ? "⏳ در حال آپلود..." : "آپلود"}
              </button>
            </div>
            <div className="card-soft p-3 flex items-center justify-center">
              {preview ? (
                <Image src={preview} alt="پیش‌نمایش" width={160} height={112} className="rounded-xl object-cover shadow" />
              ) : (
                <div className="text-xs text-gray-500">پیش‌نمایش فایل انتخاب‌شده اینجا نمایش داده می‌شود</div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* لیست عکس‌ها */}
      {activeTab === "list" && (
        <>
          {fetching ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="card p-2 animate-pulse">
                  <div className="w-full h-24 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded mt-2" />
                  <div className="h-3 bg-gray-200 rounded mt-1 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                           {items.length === 0 && (
                <p className="text-gray-500 col-span-full text-center">
                  هنوز عکسی ثبت نشده است.
                </p>
              )}
              {items.map((it) => (
                <div key={it.id} className="card p-2 flex flex-col">
                  {editId === it.id ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input w-full"
                        placeholder="عنوان"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="input w-full mt-2"
                        rows={2}
                        placeholder="توضیحات"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdate(it.id)}
                          className="cta-primary flex-1"
                        >
                          ذخیره
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="cta-secondary flex-1"
                        >
                          انصراف
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Thumbnail کوچک برای داشبورد */}
                      <div className="relative w-full h-24">
                        <Image
                          src={it.imageUrl}
                          alt={it.title}
                          fill
                          className="rounded-xl object-cover"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="mt-2 font-bold text-xs truncate">
                        {it.title}
                      </h3>
                      {it.description && (
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">
                          {it.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEdit(it)}
                          className="cta-secondary px-2 py-1 text-xs"
                        >
                          ✏️ ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(it.id)}
                          className="cta-secondary bg-rose-500 text-white px-2 py-1 text-xs"
                        >
                          🗑 حذف
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
