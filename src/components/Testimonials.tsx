"use client";

import { useEffect, useState, useCallback } from "react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
}

export default function Testimonials({ refreshKey = 0 }: { refreshKey?: number }) {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);

  // گرفتن فقط نظرات تایید شده
  const fetchTestimonials = useCallback(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error("❌ Error fetching testimonials:", err));
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials, refreshKey]);

  // اسلاید خودکار
  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items]);

  if (items.length === 0) {
    return (
      <section className="mt-16">
        <h2 className="text-center text-xl font-bold text-rose-700">
          نظرات مشتریان
        </h2>
        <div className="text-center text-gray-500 mt-4 text-sm">
          هنوز نظری ثبت نشده است.
        </div>
      </section>
    );
  }

  const current = items[index];

  return (
    <section className="mt-16">
      <h2 className="text-center text-xl font-bold text-rose-700">
        نظرات مشتریان
      </h2>

      <div className="relative max-w-3xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center border border-rose-100">
        <p className="text-base leading-relaxed text-gray-700">“{current.text}”</p>
        <span className="mt-3 block text-sm font-semibold text-pink-600">
          {current.name}
        </span>

        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === index ? "bg-pink-600" : "bg-rose-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
