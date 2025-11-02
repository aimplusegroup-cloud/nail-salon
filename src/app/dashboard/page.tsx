import ProtectedPage from "@/components/dashboard/ProtectedPage";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ReservationsPanel from "@/components/dashboard/ReservationsPanel"; // 👈 اضافه شد
import Link from "next/link";

function SessionBadge({ exp }: { exp?: number }) {
  const secondsLeft = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : null;
  const minutesLeft = secondsLeft !== null ? Math.floor(secondsLeft / 60) : null;

  return (
    <div className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm">
      <span className="font-medium">وضعیت نشست:</span>
      {minutesLeft !== null ? (
        <span className="text-green-700">حدود {minutesLeft} دقیقه باقی‌ست</span>
      ) : (
        <span className="text-gray-600">نامشخص</span>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <ProtectedPage>
      {(admin) => (
        <DashboardLayout>
          {/* Header */}
          <header className="flex items-center justify-between border-b px-6 py-4 bg-white">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">داشبورد مدیریت</h1>
              <SessionBadge exp={admin.exp} />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">مدیر:</span> {admin.email}
              </div>
              <form action="/api/admin/logout" method="POST">
                <button className="cta-secondary" type="submit">خروج</button>
              </form>
            </div>
          </header>

          {/* Main */}
          <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-gray-50 min-h-[calc(100vh-4rem)] p-4 space-y-2">
              <Link href="/dashboard" className="block hover:underline">صفحه اصلی</Link>
              <Link href="/dashboard/site" className="block hover:underline">محتوای سایت</Link>
              <Link href="/dashboard/testimonials" className="block hover:underline">نظرات مشتریان</Link>
              <Link href="/dashboard/staff" className="block hover:underline">کارکنان</Link>
              <Link href="/dashboard/settings" className="block hover:underline">تنظیمات</Link>
            </aside>

            {/* Content */}
            <section className="flex-1 p-6 space-y-8">
              <div className="card p-6 space-y-2">
                <h2 className="text-lg font-semibold">خوش آمدید 👋</h2>
                <p className="text-gray-700">
                  شما با ایمیل <span className="font-semibold">{admin.email}</span> وارد شده‌اید.
                </p>
              </div>

              {/* 👇 پنل مدیریت رزروها */}
              <ReservationsPanel />
            </section>
          </div>
        </DashboardLayout>
      )}
    </ProtectedPage>
  );
}
