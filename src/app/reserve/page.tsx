import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";

export default function ReservePage() {
  return (
    <section className="section space-y-12">
      {/* عنوان صفحه */}
      <div className="text-center space-y-3 mb-8">
        <h2 className="section-title">رزرو آنلاین</h2>
        <p className="section-subtitle max-w-xl mx-auto">
          اطلاعات خود را وارد کنید تا وقت شما ثبت شود. پیامک تأیید برایتان ارسال خواهد شد.
        </p>
      </div>

      {/* فرم رزرو */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <ReservationForm />
      </div>

      {/* دکمه CTA ثابت در موبایل */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center md:hidden">
        <button
          type="submit"
          form="reservation-form"
          className="w-11/12 bg-rose-600 text-white py-3 rounded-xl shadow-xl font-semibold hover:bg-rose-700 transition"
        >
          تایید رزرو
        </button>
      </div>

      {/* دکمه‌های ناوبری پایین صفحه */}
      <div className="flex flex-wrap justify-center gap-4 mt-16">
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
