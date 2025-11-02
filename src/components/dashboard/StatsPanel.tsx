"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Stats = {
  totalReservations: number;
  confirmed: number;
  canceled: number;
  revenue: number;
  newCustomers: number;
  retentionRate: number;
  avgRating: number | null;
};

type TrendPoint = {
  date: string;
  reservations: number;
  confirmed: number;
  canceled: number;
  revenue: number;
  retentionRate: number;
};

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (!res.ok) throw new Error("خطا در دریافت آمار");
      const data = await res.json();

      // API ممکن است stats یا مستقیم داده‌ها را برگرداند
      setStats(data.stats || data);
      setTrend(data.trend || []);
    } catch (err) {
      console.error("❌ خطا در دریافت آمار:", err);
      setError(true);
      toast.error("خطا در دریافت آمار");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500">⏳ در حال بارگذاری آمار...</p>;
  }

  if (error || !stats) {
    return (
      <div className="card p-6 text-center">
        <p className="text-rose-600 font-bold mb-2">خطا در دریافت داده‌ها</p>
        <button onClick={fetchStats} className="cta-primary">
          تلاش مجدد
        </button>
      </div>
    );
  }

  const safeNumber = (val: number | null | undefined) =>
    typeof val === "number" ? val.toLocaleString("fa-IR") : "۰";

  const cards = [
    {
      label: "کل رزروها",
      value: safeNumber(stats.totalReservations),
      icon: "📊",
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "رزروهای تأییدشده",
      value: safeNumber(stats.confirmed),
      icon: "✅",
      color: "bg-green-100 text-green-700",
    },
    {
      label: "رزروهای لغوشده",
      value: safeNumber(stats.canceled),
      icon: "❌",
      color: "bg-rose-100 text-rose-700",
    },
    {
      label: "درآمد کل",
      value: `${safeNumber(stats.revenue)} تومان`,
      icon: "💰",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "مشتریان جدید (۳۰ روز اخیر)",
      value: safeNumber(stats.newCustomers),
      icon: "👩‍🦰",
      color: "bg-pink-100 text-pink-700",
    },
    {
      label: "نرخ بازگشت مشتری",
      value: `${stats.retentionRate ?? 0}%`,
      icon: "🔁",
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "میانگین رضایت",
      value: stats.avgRating ? stats.avgRating.toFixed(1) + " / 5" : "—",
      icon: "⭐",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div>
      <h2 className="section-title mb-6">شاخص‌های عملکرد سالن</h2>

      {/* کارت‌ها */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="card p-4 flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-xl ${c.color}`}
            >
              {c.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-lg font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* نمودار روند */}
      <div className="card p-4">
        <h3 className="font-bold mb-4">📈 روند عملکرد سالن در طول زمان</h3>
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => v.toLocaleString("fa-IR")} />
              <Tooltip
                formatter={(value: any) =>
                  typeof value === "number"
                    ? value.toLocaleString("fa-IR")
                    : value
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reservations"
                stroke="#2563eb"
                name="کل رزروها"
              />
              <Line
                type="monotone"
                dataKey="confirmed"
                stroke="#16a34a"
                name="تأییدشده"
              />
              <Line
                type="monotone"
                dataKey="canceled"
                stroke="#dc2626"
                name="لغوشده"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#eab308"
                name="درآمد"
              />
              <Line
                type="monotone"
                dataKey="retentionRate"
                stroke="#9333ea"
                name="نرخ بازگشت"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">داده‌ای برای نمایش روند وجود ندارد.</p>
        )}
      </div>
    </div>
  );
}
