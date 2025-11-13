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

  // ✅ Fallback استاتیک با توجه به فایل‌های موجود در public/image
  const staticItems: GalleryItem[] = [
    { id: "s1", title: "نمونه 1", imageUrl: "/image/1.jfif" },
    { id: "s2", title: "نمونه 2", imageUrl: "/image/2.jfif" },
    { id: "s3", title: "نمونه 3", imageUrl: "/image/3.jfif" },
    { id: "s4", title: "نمونه 4", imageUrl: "/image/4.jfif" },
    { id: "s5", title: "نمونه 5", imageUrl: "/image/5.jfif" },
    { id: "s6", title: "نمونه 6", imageUrl: "/image/6.jfif" },
    { id: "s7", title: "نمونه 7", imageUrl: "/image/7.jfif" },
    { id: "s8", title: "نمونه 8", imageUrl: "/image/8.jfif" },
    { id: "s9", title: "نمونه 9", imageUrl: "/image/9.jfif" },
    { id: "s10", title: "نمونه 10", imageUrl: "/image/10.jfif" },
    { id: "s11", title: "نمونه 11", imageUrl: "/image/11.jfif" },
    { id: "s12", title: "نمونه 12", imageUrl: "/image/12.jfif" },
    { id: "s13", title: "نمونه 13", imageUrl: "/image/13.jfif" },
    { id: "s14", title: "نمونه 14", imageUrl: "/image/14.jfif" },
    { id: "s15", title: "نمونه 15", imageUrl: "/image/15.jfif" },
    { id: "s16", title: "نمونه 16", imageUrl: "/image/16.jfif" },
    { id: "s17", title: "نمونه 17", imageUrl: "/image/17.jfif" },
    { id: "s18", title: "نمونه 18", imageUrl: "/image/18.jfif" },
    { id: "s19", title: "نمونه 19", imageUrl: "/image/19.jfif" },
    { id: "s20", title: "نمونه 20", imageUrl: "/image/20.jfif" },
    { id: "s21", title: "نمونه 21", imageUrl: "/image/21.jfif" },
    { id: "s22", title: "نمونه 22", imageUrl: "/image/22.jfif" },
    { id: "s23", title: "نمونه 23", imageUrl: "/image/23.jfif" },
    { id: "s24", title: "نمونه 24", imageUrl: "/image/24.jfif" },
    { id: "s25", title: "نمونه 25", imageUrl: "/image/25.jfif" },
    { id: "s26", title: "نمونه 26", imageUrl: "/image/26.jfif" },
    { id: "s27", title: "نمونه 27", imageUrl: "/image/27.jfif" },
    { id: "s28", title: "نمونه 28", imageUrl: "/image/28.jfif" },
    { id: "s29", title: "نمونه 29", imageUrl: "/image/29.jfif" },
    { id: "s30", title: "نمونه 30", imageUrl: "/image/30.jfif" },
    { id: "s31", title: "نمونه 31", imageUrl: "/image/31.jfif" },
    { id: "s32", title: "نمونه 32", imageUrl: "/image/32.jfif" },
    { id: "s33", title: "نمونه 33", imageUrl: "/image/33.jfif" },
    { id: "s34", title: "نمونه 34", imageUrl: "/image/34.jfif" },
    { id: "s35", title: "نمونه 35", imageUrl: "/image/35.jfif" },
    { id: "s36", title: "نمونه 36", imageUrl: "/image/36.jfif" },
    { id: "s37", title: "نمونه 37", imageUrl: "/image/37.jfif" },
    { id: "s38", title: "نمونه 38", imageUrl: "/image/38.jfif" },
    { id: "s39", title: "نمونه 39", imageUrl: "/image/39.jfif" },
    { id: "s40", title: "نمونه 40", imageUrl: "/image/40.jfif" },
    { id: "s42", title: "نمونه 42", imageUrl: "/image/42.jfif" },
    { id: "s43", title: "نمونه 43", imageUrl: "/image/43.jfif" },
    { id: "s44", title: "نمونه 44", imageUrl: "/image/44.jfif" },
    { id: "s46", title: "نمونه 46", imageUrl: "/image/46.jfif" },
    { id: "s47", title: "نمونه 47", imageUrl: "/image/47.jfif" },
    { id: "s48", title: "نمونه 48", imageUrl: "/image/48.jfif" },
    { id: "s49", title: "نمونه 49", imageUrl: "/image/49.jfif" },
    { id: "s53", title: "نمونه 53", imageUrl: "/image/53.jfif" },
    { id: "s54", title: "نمونه 54", imageUrl: "/image/54.jfif" },
    { id: "s55", title: "نمونه 55", imageUrl: "/image/55.jfif" },
    { id: "s56", title: "نمونه 56", imageUrl: "/image/56.jfif" },
    { id: "s57", title: "نمونه 57", imageUrl: "/image/57.jfif" },
    { id: "s58", title: "نمونه 58", imageUrl: "/image/58.jfif" },
    { id: "s59", title: "نمونه 59", imageUrl: "/image/59.jfif" },
    { id: "s60", title: "نمونه 60", imageUrl: "/image/60.jfif" },
    { id: "s61", title: "نمونه 61", imageUrl: "/image/61.jfif" },
    { id: "s62", title: "نمونه 62", imageUrl: "/image/62.jfif" },
    { id: "hero", title: "تصویر اصلی", imageUrl: "/image/hero.jpg" },
    { id: "S1", title: "نمونه S1", imageUrl: "/image/S1.jpg" },
    { id: "S2", title: "نمونه S2", imageUrl: "/image/S2.jpg" },
    { id: "S3", title: "نمونه S3", imageUrl: "/image/S3.jpg" },
    { id: "S4", title: "نمونه S4", imageUrl: "/image/S4.jpg" },
  ];

    return (
    <section className="section space-y-12">
      {/* عنوان صفحه */}
      <h1 className="section-title text-center">گالری نمونه‌کارها</h1>
      <p className="section-subtitle text-center max-w-2xl mx-auto">
        مجموعه‌ای از جدیدترین و محبوب‌ترین طراحی‌های سالن ناخن نازی برای الهام گرفتن
        و انتخاب استایل دلخواه شما
      </p>

      {/* گالری */}
      <GalleryClient items={items.length > 0 ? items : staticItems} />

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
