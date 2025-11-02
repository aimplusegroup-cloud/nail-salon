"use client";

import { useState } from "react";
import ReservationsPanel from "./ReservationsPanel";
import ServicesPanel from "./ServicesPanel";
import StaffPanel from "./StaffPanel";
import GalleryPanel from "./GalleryPanel";
import StatsPanel from "./StatsPanel";
import HomeContentPanel from "./HomeContentPanel";
import SiteContentPanel from "./SiteContentPanel"; // مدیریت متن‌ها
import ChangePasswordPanel from "./ChangePasswordPanel"; // تب تغییر رمز
import LogoutButton from "./LogoutButton"; // دکمه خروج

const tabs = [
  { key: "reservations", label: "رزروها" },
  { key: "services", label: "خدمات" },
  { key: "staff", label: "پرسنل" },
  { key: "gallery", label: "گالری" },
  { key: "stats", label: "گزارش‌ها" },
  { key: "home", label: "محتوای صفحه اول (عکس‌ها)" },
  { key: "site", label: "متن‌های صفحه اول" }, // تب جدید برای SiteContent
  { key: "change-password", label: "تغییر رمز" },
];

export default function DashboardLayout() {
  const [active, setActive] = useState("reservations");

  return (
    <div className="flex h-screen">
      {/* سایدبار */}
      <aside className="w-56 bg-gray-100 p-4 space-y-2 flex flex-col justify-between">
        <div className="space-y-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`block w-full text-right p-2 rounded transition ${
                active === t.key
                  ? "bg-pink-600 text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* دکمه خروج پایین سایدبار */}
        <LogoutButton />
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 p-6 overflow-y-auto">
        {active === "reservations" && <ReservationsPanel />}
        {active === "services" && <ServicesPanel />}
        {active === "staff" && <StaffPanel />}
        {active === "gallery" && <GalleryPanel />}
        {active === "stats" && <StatsPanel />}
        {active === "home" && <HomeContentPanel />}
        {active === "site" && <SiteContentPanel />}
        {active === "change-password" && (
          <ChangePasswordPanel email="admin@example.com" />
        )}
      </main>
    </div>
  );
}
