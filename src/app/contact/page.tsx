import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="section space-y-12">
      {/* عنوان صفحه */}
      <div className="text-center space-y-3">
        <h2 className="section-title">تماس با سالن ناخن نازی</h2>
        <p className="section-subtitle max-w-2xl mx-auto">
          برای رزرو وقت، مشاوره یا هرگونه پرسش می‌توانید از راه‌های زیر با ما در ارتباط باشید
        </p>
      </div>

      {/* اطلاعات تماس */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl bg-white shadow">
          <h3 className="font-bold text-rose-600 text-lg">آدرس</h3>
          <p className="text-sm text-gray-600 mt-2 leading-7">
            تهران، خیابان مثال، کوچه نمونه، پلاک ۱۲
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white shadow">
          <h3 className="font-bold text-rose-600 text-lg">تلفن</h3>
          <p className="text-sm text-gray-600 mt-2 leading-7">
            ۰۹۱۲ ۰۰۰ ۰۰۰۰ — پاسخگویی سریع در واتس‌اپ
          </p>
        </div>
        <div className="p-6 rounded-xl bg-white shadow">
          <h3 className="font-bold text-rose-600 text-lg">ایمیل</h3>
          <p className="text-sm text-gray-600 mt-2 leading-7">
            info@naznail.ir
          </p>
        </div>
      </div>

      {/* شبکه‌های اجتماعی */}
      <div className="flex justify-center gap-6 mt-8">
        <Link
          href="https://wa.me/989120000000"
          target="_blank"
          className="px-6 py-3 rounded-xl bg-green-500 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition-transform"
        >
          واتس‌اپ
        </Link>
        <Link
          href="https://instagram.com/rosenail"
          target="_blank"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition-transform"
        >
          اینستاگرام
        </Link>
        <Link
          href="https://t.me/rosenail"
          target="_blank"
          className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition-transform"
        >
          تلگرام
        </Link>
      </div>

      {/* نقشه گوگل */}
      <div className="rounded-xl overflow-hidden shadow-lg mt-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.123456789!2d51.3890!3d35.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0123456789%3A0xabcdef123456789!2sTehran!5e0!3m2!1sen!2s!4v1700000000000"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* دکمه‌های ناوبری پایین صفحه */}
      <div className="flex flex-wrap justify-center gap-4 mt-12">
        <Link
          href="/"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          خانه
        </Link>
        <Link
          href="/services"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          مشاهده خدمات
        </Link>
        <Link
          href="/gallery"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          مشاهده گالری
        </Link>
      </div>
    </section>
  );
}
