import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "سالن ناخن رز | رزرو آنلاین و گالری لوکس",
  description:
    "تجربه‌ای لوکس از خدمات مانیکور، پدیکور و طراحی ناخن با رزرو آنلاین و گالری حرفه‌ای.",
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className="nav-link py-2 px-4">
    {label}
  </Link>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 text-gray-900 antialiased font-bnazanin">
        {/* هدر */}
        <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-rose-100 shadow-sm">
          <div className="container mx-auto max-w-6xl px-4 flex items-center justify-between h-20">
            {/* لوگو */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 shadow-md" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold text-pink-600 tracking-wide">
                  سالن ناخن رز
                </span>
                <span className="text-xs text-gray-500">
                  زیبایی لوکس | مانیکور و طراحی حرفه‌ای
                </span>
              </div>
            </Link>

            {/* منوی اصلی */}
            <nav className="hidden md:flex items-center gap-4">
              <NavLink href="/" label="خانه" />
              <NavLink href="/services" label="خدمات" />
              <NavLink href="/gallery" label="گالری" />
              <NavLink href="/reserve" label="رزرو" />
              <NavLink href="/contact" label="تماس با ما" />
              <NavLink href="/dashboard/login" label="پنل مدیریت" />

            </nav>

            {/* CTA همیشه نمایش داده شود (بالا سمت چپ) */}
            <Link href="/reserve" className="cta-primary inline-flex">
              شروع رزرو
            </Link>
          </div>
        </header>

        {/* محتوای اصلی */}
        <main className="container mx-auto max-w-6xl px-4 py-8">{children}</main>

        {/* فوتر */}
        <footer className="mt-16 bg-white/80 backdrop-blur border-t border-rose-100">
          <div className="container mx-auto max-w-6xl px-4 py-10 text-center text-sm text-gray-600">
            ©{" "}
            <span suppressHydrationWarning>
              {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
                new Date()
              )}
            </span>{" "}
            سالن ناخن رز — تمامی حقوق محفوظ است
          </div>
        </footer>

        {/* Toast Container */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
