import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Testimonials from "@/components/Testimonials";
import TestimonialForm from "@/components/TestimonialForm";
import { FaInstagram, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

// 🚀 این خط باعث می‌شود صفحه همیشه داده تازه بگیرد
export const revalidate = 0;

// تبدیل اعداد به فارسی
const toFa = (val: string | number) => {
  return val
    .toString()
    .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)]);
};

type FeatureProps = {
  title: string;
  desc: string;
  icon: string;
};

function Feature({ title, desc, icon }: FeatureProps) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 via-rose-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-md">
        {icon}
      </div>
      <div>
        <h3 className="font-extrabold text-rose-700 text-base tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-2 leading-6">{desc}</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [homeItems, siteContents] = await Promise.all([
    prisma.homeContent.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.siteContent.findMany(),
  ]);

  const contentMap = new Map(siteContents.map((c) => [c.key, c.value]));
  const getText = (key: string, fallback: string) =>
    contentMap.get(key) || fallback;

  return (
    <section className="section space-y-16">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 items-center gap-12">
        {/* متن سمت چپ */}
        <div className="space-y-6">
          <span className="badge">
            {getText("hero_badge", "لوکس و حرفه‌ای")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-rose-700 to-pink-600">
            {getText("hero_title", "سالن ناخن نازی")}
          </h1>
          <p className="section-subtitle text-gray-700 leading-8">
            {getText(
              "hero_subtitle",
              "تجربه‌ای متفاوت از زیبایی ناخن با تیم حرفه‌ای، متریال‌های درجه‌یک و محیطی لوکس — همه با رزرو آنلاین و گالری الهام‌بخش."
            )}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/gallery" className="cta-secondary">
              {getText("hero_cta2", "مشاهده گالری")}
            </Link>
            <Link href="/services" className="cta-secondary">
              {getText("hero_cta3", "مشاهده خدمات")}
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <Feature
              title={getText("feature1_title", "محیط لوکس و آرامش‌بخش")}
              desc={getText(
                "feature1_desc",
                "طراحی داخلی مدرن و فضایی آرام برای تجربه‌ای متفاوت از زیبایی"
              )}
              icon="🏛️"
            />
            <Feature
              title={getText("feature2_title", "مواد و ابزار درجه‌یک")}
              desc={getText(
                "feature2_desc",
                "استفاده از بهترین برندهای جهانی برای سلامت و ماندگاری بیشتر"
              )}
              icon="🌸"
            />
            <Feature
              title={getText("feature3_title", "تیم حرفه‌ای و آموزش‌دیده")}
              desc={getText(
                "feature3_desc",
                "ناخن‌کاران متخصص با تجربه‌ی بالا و دقت در جزئیات"
              )}
              icon="👩‍🎨"
            />
            <Feature
              title={getText("feature4_title", "رزرو آنلاین سریع")}
              desc={getText(
                "feature4_desc",
                "انتخاب زمان دلخواه و دریافت پیامک یادآور به‌صورت خودکار"
              )}
              icon="📆"
            />
            <Feature
              title={getText("feature5_title", "گالری الهام‌بخش")}
              desc={getText(
                "feature5_desc",
                "مشاهده‌ی نمونه‌کارهای متنوع برای انتخاب راحت‌تر سبک دلخواه"
              )}
              icon="📸"
            />
            <Feature
              title={getText("feature6_title", "بهداشت و ایمنی کامل")}
              desc={getText(
                "feature6_desc",
                "استریل‌کردن ابزارها و رعایت کامل پروتکل‌های بهداشتی"
              )}
              icon="🧴"
            />
          </div>
        </div>

        {/* گالری سمت راست */}
        <div className="relative">
          {homeItems.length > 0 ? (
            <>
              <div className="gallery-item rounded-2xl overflow-hidden shadow-xl relative w-full h-[400px]">
                <Image
                  src={homeItems[0].imageUrl || "/image/fallback-hero.png"}
                  alt={homeItems[0].title || "نمونه کار"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="gallery-overlay">
                  <div className="overlay-title text-xl font-bold">
                    {homeItems[0].title}
                  </div>
                </div>
              </div>
              {homeItems.length > 1 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {homeItems.slice(1, 5).map((it) => (
                    <div
                      key={it.id}
                      className="gallery-item rounded-xl overflow-hidden shadow relative w-full h-[200px]"
                    >
                      <Image
                        src={it.imageUrl || "/image/fallback.png"}
                        alt={it.title || "نمونه"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="gallery-overlay">
                        <div className="overlay-title text-sm font-medium">
                          {it.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center">
              هنوز محتوایی ثبت نشده است.
            </p>
          )}
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />
      <TestimonialForm />

      {/* Info / Footer Section */}
      <footer className="mt-20 bg-gradient-to-br from-rose-50 to-pink-50 border-t border-rose-100">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-center md:text-right">
          {/* آدرس */}
          <div>
            <h4 className="text-rose-700 font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
              📍 {getText("info_address_title", "آدرس")}
            </h4>
            <p className="text-sm text-gray-600 leading-7">
              {getText(
                "info_address_text",
                "تهران، ایران — همه روزه از " +
                  toFa(10) +
                  " صبح تا " +
                  toFa(8) +
                  " شب"
              )}
            </p>
          </div>

          {/* تماس */}
          <div>
            <h4 className="text-rose-700 font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
              ☎️ {getText("info_contact_title", "تماس")}
            </h4>
            <p className="text-sm text-gray-600 leading-7">
              {getText(
                "info_contact_text",
                toFa("09120000000") + " — واتس‌اپ فعال، پاسخگویی سریع"
              )}
            </p>
          </div>

          {/* رزرو آنلاین */}
          <div>
            <h4 className="text-rose-700 font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                           📅 {getText("info_reserve_title", "رزرو آنلاین")}
            </h4>
            <p className="text-sm text-gray-600 leading-7">
              {getText(
                "info_reserve_text",
                "با چند کلیک زمان خودت رو هماهنگ کن و پیامک تأیید دریافت کن"
              )}
            </p>
          </div>
        </div>

        {/* شبکه‌های اجتماعی */}
        <div className="flex justify-center gap-6 mt-6 pb-6">
          <Link
            href="https://instagram.com"
            target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow hover:scale-110 transition-transform"
          >
            <FaInstagram className="text-lg" />
          </Link>
          <Link
            href="https://wa.me/989120000000"
            target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white shadow hover:scale-110 transition-transform"
          >
            <FaWhatsapp className="text-lg" />
          </Link>
          <Link
            href="https://t.me/yourchannel"
            target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 text-white shadow hover:scale-110 transition-transform"
          >
            <FaTelegramPlane className="text-lg" />
          </Link>
        </div>

        {/* کپی‌رایت */}
        <div className="text-center text-xs text-gray-500 border-t border-rose-100 py-4">
          © {new Date().getFullYear()} سالن ناخن نازی — همه حقوق محفوظ است
        </div>
      </footer>
    </section>
  );
}
