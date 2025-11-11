import { headers } from "next/headers";
import Link from "next/link";
import GalleryClient from "./GalleryClient";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  tags?: string | null;
  createdAt?: string;
}

export default async function GalleryPage() {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let items: GalleryItem[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/gallery`, { cache: "no-store" });
    if (res.ok) {
      items = await res.json();
    }
  } catch (err) {
    console.error("❌ Error fetching /api/gallery:", err);
  }

  return (
    <section className="section space-y-12">
      {/* عنوان صفحه */}
      <h1 className="section-title text-center">گالری نمونه‌کارها</h1>
      <p className="section-subtitle text-center max-w-2xl mx-auto">
        مجموعه‌ای از جدیدترین و محبوب‌ترین طراحی‌های سالن نازی برای الهام گرفتن
        و انتخاب استایل دلخواه شما
      </p>

      {/* گالری */}
      <GalleryClient items={items || []} />

      {/* دکمه‌های ناوبری پایین صفحه */}
      <div className="flex flex-wrap justify-center gap-4 mt-12">
        <Link
          href="/services"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          مشاهده خدمات
        </Link>
        <Link
          href="/"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          خانه
        </Link>
      </div>
    </section>
  );
}
