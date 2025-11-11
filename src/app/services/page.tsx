import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";

const services = [
  {
    id: "svc1",
    name: "مانیکور لوکس",
    price: 240000,
    duration: 50,
    desc: "پاکسازی، فرمدهی، کوتیکول‌برداری و ماساژ سبک برای دستانی زیبا",
  },
  {
    id: "svc2",
    name: "پدیکور حرفه‌ای",
    price: 320000,
    duration: 60,
    desc: "ترمیم پاشنه، اسکراب، کوتیکول‌برداری و لاک با ماندگاری بالا",
  },
  {
    id: "svc3",
    name: "لاک ژل رزگلد",
    price: 380000,
    duration: 55,
    desc: "دوام بالا، جلوه لوکس رزگلد و براقیت خیره‌کننده",
  },
  {
    id: "svc4",
    name: "فرنچ کلاسیک",
    price: 290000,
    duration: 40,
    desc: "لبه‌های ظریف و تمیز برای استایلی همیشه شیک",
  },
  {
    id: "svc5",
    name: "دیزاین نگین‌دار",
    price: 450000,
    duration: 70,
    desc: "طراحی اختصاصی، نگین‌گذاری و جزئیات دقیق برای ناخن‌های خاص",
  },
  {
    id: "svc6",
    name: "مینیمال صورتی",
    price: 260000,
    duration: 45,
    desc: "سادگی شیک با رنگ‌بندی مینیمال و ملایم",
  },
];

export default function ServicesPage() {
  return (
    <section className="section space-y-12">
      {/* عنوان صفحه */}
      <div className="text-center space-y-3">
        <h2 className="section-title">خدمات سالن ناخن نازی</h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          منتخب محبوب‌ترین سرویس‌ها برای تجربه‌ای جذاب، زنانه و حرفه‌ای
        </p>
      </div>

      {/* لیست خدمات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {services.map((s) => (
          <ServiceCard key={s.id} {...s} />
        ))}
      </div>

      {/* دکمه‌های ناوبری پایین صفحه */}
      <div className="flex flex-wrap justify-center gap-4 mt-12">
        <Link
          href="/gallery"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          مشاهده گالری
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
