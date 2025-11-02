import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// 🔍 فعال‌سازی Bundle Analyzer فقط وقتی ANALYZE=true باشه
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// 🔒 Content Security Policy (CSP)
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: https://trustseal.new-enamad.ir https://new-enamad.ir;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self';
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
`.replace(/\s{2,}/g, " ").trim();

// 🔒 Security Headers
const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
];

// ⚙️ Next.js Config
const nextConfig: NextConfig = {
  // خروجی سبک‌تر برای Vercel یا Docker
  output: "standalone",

  // جلوگیری از تولید sourcemap در production
  productionBrowserSourceMaps: false,

  // فعال کردن React Strict Mode
  reactStrictMode: true,

  // بهینه‌سازی تصاویر
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "your-new-domain.com",   // ✅ دامنه اصلی سایت جدید
      "localhost",             // برای توسعه لوکال
      "cdn.your-new-domain.com", // اگر CDN یا استوریج خارجی داری
      "trustseal.new-enamad.ir", // ✅ لوگوی اینماد جدید
      "new-enamad.ir",           // ✅ دامنه اینماد جدید
    ],
  },

  // اضافه کردن هدرهای امنیتی
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
