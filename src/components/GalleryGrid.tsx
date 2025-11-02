"use client";

import { useMemo, useState, useEffect } from "react";

type Item = {
  id: string;
  title: string;
  description?: string | null;
  style?: string | null;
  imageUrl: string;
  tags?: string | null;
  createdAt?: string;
};

function Tag({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-xs transition ${
        active
          ? "bg-pink-600 text-white border-pink-600 shadow"
          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
      }`}
      aria-pressed={active}
    >
      #{label}
    </button>
  );
}

export default function GalleryGrid() {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // گرفتن داده‌ها از API
  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else if (Array.isArray(data.items)) setItems(data.items);
      })
      .catch((err) => console.error("❌ Fetch /api/gallery error:", err));
  }, []);

  // استخراج همه‌ی تگ‌ها
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      item.tags?.split(",").forEach((t) => set.add(t.trim()));
    }
    return Array.from(set);
  }, [items]);

  // فیلتر بر اساس جستجو و تگ فعال
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.style?.toLowerCase().includes(q) ||
        item.tags?.toLowerCase().includes(q);

      const matchesTag =
        !activeTag ||
        item.tags?.split(",").map((t) => t.trim()).includes(activeTag);

      return matchesQuery && matchesTag;
    });
  }, [items, query, activeTag]);

  return (
    <section className="space-y-6">
      {/* جستجو و فیلتر */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="border rounded px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-pink-500 max-w-xs"
          placeholder="جستجو در عنوان/توضیح/سبک/تگ‌ها"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Tag label="همه" active={!activeTag} onClick={() => setActiveTag(null)} />
          {allTags.map((t) => (
            <Tag
              key={t}
              label={t}
              active={activeTag === t}
              onClick={() => setActiveTag(t)}
            />
          ))}
        </div>
      </div>

      {/* گالری مدرن با کارت‌های هم‌قد */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition bg-white flex flex-col"
            style={{ height: 320 }} // 👈 ارتفاع ثابت کارت
          >
            {/* تصویر با انیمیشن نرم */}
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* متن زیر عکس */}
            <div className="flex-1 flex flex-col justify-between px-3 py-3 text-center">
              <h3 className="font-semibold text-sm text-gray-800">{item.title}</h3>

              {/* توضیح فقط اگر وجود داشته باشه */}
              {item.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* تگ‌ها */}
              {item.tags && (
                <div className="flex flex-wrap gap-1 justify-center mt-2">
                  {item.tags.split(",").map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] border"
                    >
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* پیام خالی */}
      {filtered.length === 0 && (
        <div className="p-6 text-center border rounded-lg shadow-sm bg-gray-50">
          <div className="text-pink-700 font-bold">موردی یافت نشد</div>
          <div className="text-sm text-gray-600 mt-1">
            عبارت جستجو یا تگ دیگری را امتحان کنید.
          </div>
        </div>
      )}
    </section>
  );
}
