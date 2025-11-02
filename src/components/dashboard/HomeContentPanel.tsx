"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface HomeContent {
  id: string;
  title: string;
  text?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export default function HomeContentPanel() {
  const [items, setItems] = useState<HomeContent[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  // دریافت لیست محتواها
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/home", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data)) setItems(data);
        else if (Array.isArray(data.items)) setItems(data.items);
        else setItems([]);
      } catch {
        toast.error("❌ خطا در دریافت داده‌ها");
        setItems([]);
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, []);

  // انتخاب فایل و پیش‌نمایش
  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  // افزودن آیتم جدید
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/home", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.item) {
        setItems((prev) => [data.item, ...prev]);
        setTitle("");
        setText("");
        setFile(null);
        setPreview(null);
        toast.success("✅ آیتم با موفقیت اضافه شد");
      } else {
        toast.error(data.message || "❌ خطا در افزودن محتوا");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // حذف آیتم
  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    try {
      const res = await fetch(`/api/home/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        toast.success("🗑️ آیتم با موفقیت حذف شد");
      } else {
        toast.error(data.message || "❌ خطا در حذف محتوا");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    }
  };

  // شروع ویرایش
  const startEdit = (item: HomeContent) => {
    setEditId(item.id);
    setEditTitle(item.title);
    setEditText(item.text || "");
  };

  // ذخیره ویرایش
  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/home/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, text: editText }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));
        setEditId(null);
        toast.success("✏️ تغییرات ذخیره شد");
      } else {
        toast.error(data.message || "❌ خطا در ویرایش محتوا");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="space-y-6">
      {/* فرم افزودن */}
      <form onSubmit={handleSubmit} className="card p-3 space-y-2 text-sm">
        <h2 className="text-base font-bold">➕ افزودن محتوای جدید</h2>

        <input
          type="text"
          placeholder="عنوان"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full text-sm"
          required
        />
        <textarea
          placeholder="متن (اختیاری)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input w-full text-sm"
          rows={2}
        />

        {/* آپلود عکس جمع‌وجور با پیش‌نمایش */}
        <div className="flex items-center gap-3">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="input text-xs w-40"
          />
          {preview && (
            <div className="relative w-20 h-16">
              <img
                src={preview}
                alt="پیش‌نمایش"
                className="w-20 h-16 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => handleFileChange(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="cta-primary w-full text-sm" disabled={loading}>
          {loading ? "در حال ذخیره..." : "افزودن"}
        </button>
      </form>

      {/* گالری محتواها */}
      {fetching ? (
        <p className="text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-5 gap-3">
          {items.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              هیچ محتوایی ثبت نشده است.
            </p>
          )}
          {items.map((it) => (
            <div key={it.id} className="card p-2 space-y-1 text-xs flex flex-col">
              {editId === it.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input w-full text-xs"
                  />
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input w-full text-xs"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdate(it.id)}
                      className="cta-primary flex-1 text-xs"
                    >
                      ذخیره
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="cta-secondary flex-1 text-xs"
                    >
                      انصراف
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {it.imageUrl && (
                    <img
                      src={it.imageUrl}
                      alt={it.title}
                      className="w-full h-24 object-cover rounded"
                    />
                  )}
                  <h3 className="font-bold truncate">{it.title}</h3>
                  {it.text && (
                    <p className="text-gray-600 line-clamp-2">{it.text}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEdit(it)}
                      className="cta-secondary flex-1 text-xs"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(it.id)}
                      className="cta-danger flex-1 text-xs"
                    >
                      حذف
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
