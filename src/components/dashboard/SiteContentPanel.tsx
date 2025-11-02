"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

interface SiteContent {
  id: string;
  key: string;
  value: string;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

type Section = "hero" | "features" | "info" | "testimonials";

export default function SiteContentPanel() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingKeys, setLoadingKeys] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  // گرفتن داده‌های متنی
  useEffect(() => {
    fetch("/api/site", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else if (Array.isArray(data.items)) setItems(data.items);
      })
      .catch(() => setError("❌ خطا در دریافت داده‌های متنی"));
  }, []);

  // گرفتن نظرات
  const fetchTestimonials = useCallback(() => {
    fetch("/api/testimonials?all=true", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(() => setError("❌ خطا در دریافت نظرات"));
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // ذخیره تغییرات متن‌ها
  const handleSave = async (key: string, value: string) => {
    setLoadingKeys((prev) => [...prev, key]);
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setItems((prev) =>
          prev.map((it) => (it.key === key ? data.item : it))
        );
        toast.success("✅ تغییرات ذخیره شد");
      } else {
        toast.error(data.message || "❌ خطا در ذخیره تغییرات");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    } finally {
      setLoadingKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  // تغییر مقدار در state
  const handleChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, value } : it))
    );
  };

  // مدیریت نظرات
  const handleTestimonialChange = (
    id: string,
    field: "name" | "text" | "status",
    value: string
  ) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleTestimonialSave = async (t: Testimonial) => {
    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ تغییرات نظر ذخیره شد");
        fetchTestimonials();
      } else {
        toast.error("❌ خطا در ذخیره نظر");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    }
  };

  const handleTestimonialDelete = async (id: string) => {
    try {
      await fetch("/api/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      toast.success("🗑️ نظر حذف شد");
      fetchTestimonials();
    } catch {
      toast.error("❌ خطا در حذف نظر");
    }
  };

  const handleTestimonialAdd = async () => {
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "نام مشتری", text: "نظر جدید..." }),
      });
      const data = await res.json();
      if (data.item) {
        toast.success("➕ نظر جدید اضافه شد");
        fetchTestimonials();
      } else {
        toast.error("❌ خطا در افزودن نظر");
      }
    } catch {
      toast.error("❌ خطا در ارتباط با سرور");
    }
  };

  // دسته‌بندی کلیدها
  const sections: Record<Section, { title: string; keys?: string[] }> = {
    hero: {
      title: "بخش بنر",
      keys: ["hero_badge", "hero_title", "hero_subtitle"],
    },
    features: {
      title: "بخش ویژگی‌ها",
      keys: [
        "feature1_title", "feature1_desc",
        "feature2_title", "feature2_desc",
        "feature3_title", "feature3_desc",
        "feature4_title", "feature4_desc",
        "feature5_title", "feature5_desc",
        "feature6_title", "feature6_desc",
      ],
    },
    info: {
      title: "بخش اطلاعات تماس",
      keys: [
        "info_address_title", "info_address_text",
        "info_contact_title", "info_contact_text",
        "info_reserve_title", "info_reserve_text",
      ],
    },
    testimonials: {
      title: "بخش نظرات",
    },
  };

  const filteredItems =
    activeSection !== "testimonials"
      ? items.filter((it) => sections[activeSection].keys?.includes(it.key))
      : [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">مدیریت محتوای صفحه اول</h2>

      {/* تب‌ها */}
      <div className="flex gap-2 border-b pb-2 text-sm">
        {Object.entries(sections).map(([key, sec]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as Section)}
            className={`px-3 py-1 rounded-t ${
              activeSection === key
                ? "bg-pink-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* مدیریت متن‌ها */}
      {activeSection !== "testimonials" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((it) => {
            const isLoading = loadingKeys.includes(it.key);
            return (
              <div key={it.id} className="card p-2 space-y-1 text-sm">
                <label className="font-semibold text-gray-700 text-xs">
                  {it.key}
                </label>
                <textarea
                  value={it.value}
                  className="input w-full text-sm"
                  rows={2}
                  onChange={(e) => handleChange(it.id, e.target.value)}
                />
                <button
                  onClick={() => handleSave(it.key, it.value)}
                  className="cta-primary w-full text-xs"
                  disabled={isLoading}
                >
                  {isLoading ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* مدیریت نظرات */}
      {activeSection === "testimonials" && (
        <div className="space-y-3">
          <button onClick={handleTestimonialAdd} className="cta-primary text-sm">
            ➕ افزودن نظر جدید
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testimonials.map((t) => (
                            <div key={t.id} className="card p-2 space-y-1 text-sm">
                <input
                  value={t.name}
                  onChange={(e) =>
                    handleTestimonialChange(t.id, "name", e.target.value)
                  }
                  className="input w-full text-xs"
                  placeholder="نام مشتری"
                />
                <textarea
                  value={t.text}
                  onChange={(e) =>
                    handleTestimonialChange(t.id, "text", e.target.value)
                  }
                  className="input w-full text-xs"
                  rows={2}
                  placeholder="متن نظر"
                />
                <select
                  value={t.status}
                  onChange={(e) =>
                    handleTestimonialChange(
                      t.id,
                      "status",
                      e.target.value as Testimonial["status"]
                    )
                  }
                  className="input w-full text-xs"
                >
                  <option value="PENDING">در انتظار تایید</option>
                  <option value="APPROVED">تایید شده</option>
                  <option value="REJECTED">رد شده</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTestimonialSave(t)}
                    className="cta-primary flex-1 text-xs"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => handleTestimonialDelete(t.id)}
                    className="cta-secondary bg-red-500 text-white flex-1 text-xs"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
