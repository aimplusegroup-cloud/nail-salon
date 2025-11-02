export default function ContactPage() {
  return (
    <section className="section">
      {/* عنوان */}
      <div className="text-center space-y-3 mb-8">
        <h2 className="section-title">تماس با ما</h2>
        <p className="section-subtitle max-w-xl mx-auto">
          برای هماهنگی وقت، پرسش درباره خدمات یا هرگونه مشاوره، از راه‌های زیر با ما در ارتباط باشید.
        </p>
      </div>

      {/* اطلاعات تماس */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="font-bold text-pink-600 text-lg">اطلاعات تماس</h3>
          <p className="text-sm text-gray-700 leading-6">
            📍 تهران، ایران — همه روزه از ۱۰ صبح تا ۸ شب
            <br />
            📞 تلفن: <span className="font-semibold">۰۹۱۲-۰۰۰-۰۰۰۰</span>
            <br />
            💬 واتس‌اپ: <span className="font-semibold">۰۹۱۲-۰۰۰-۰۰۰۰</span>
            <br />
            📧 ایمیل: <span className="font-semibold">info@nailsalonrose.ir</span>
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://wa.me/989120000000"
              target="_blank"
              className="cta-secondary"
            >
              واتس‌اپ
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              className="cta-secondary"
            >
              اینستاگرام
            </a>
          </div>
        </div>

        {/* نقشه گوگل */}
        <div className="rounded-xl overflow-hidden shadow">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18..."
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
