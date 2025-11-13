"use client";

import { useState } from "react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  tags?: string | null;
}

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return (
      <p className="text-center text-gray-500">
        هنوز عکسی ثبت نشده است.
      </p>
    );
  }

  const selected = selectedIndex !== null ? items[selectedIndex] : null;

  const showPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
    }
  };

  const showNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % items.length);
    }
  };

  return (
    <div>
      {/* 📱 موبایل: آلبوم عکس */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 md:hidden">
        {items.map((it, idx) => (
          <div
            key={it.id}
            className="relative w-full aspect-square overflow-hidden cursor-pointer"
            onClick={() => setSelectedIndex(idx)}
          >
            <img
              src={it.imageUrl || "/sample.png"}
              alt={it.title || "نمونه کار"}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* 💻 دسکتاپ: سه‌ستونه با متن و توضیح */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="group overflow-hidden rounded-xl shadow hover:shadow-xl transition flex flex-col bg-white"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <img
                src={it.imageUrl || "/sample.png"}
                alt={it.title || "نمونه کار"}
                className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="p-3 text-center bg-white">
              <p className="text-sm font-bold truncate">
                {it.title || "بدون عنوان"}
              </p>
              {it.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {it.description}
                </p>
              )}
              {it.tags && (
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {it.tags.split(",").map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs border"
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

      {/* 📱 مودال فقط روی موبایل */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn md:hidden"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative bg-white rounded-xl overflow-hidden max-w-md w-full shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* دکمه بستن */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-3xl font-bold z-10"
            >
              ×
            </button>

            {/* تصویر */}
            <div className="bg-black flex items-center justify-center relative w-full h-[70vh]">
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="object-contain max-h-full transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* متن زیر عکس */}
            <div className="p-5 text-center bg-white">
              <h2 className="font-bold text-lg text-gray-800">
                {selected.title}
              </h2>
              {selected.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {selected.description}
                </p>
              )}
              {selected.tags && (
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {selected.tags.split(",").map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border"
                    >
                      #{t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* دکمه‌های قبلی/بعدی */}
            <button
              onClick={showPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/80 transition"
            >
              ‹
            </button>
            <button
              onClick={showNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/80 transition"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
