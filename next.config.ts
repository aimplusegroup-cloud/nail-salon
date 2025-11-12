import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

// 🔍 فعال‌سازی Bundle Analyzer فقط وقتی ANALYZE=true باشه
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// 🔒 Content Security Policy (CSP)
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: https://trustseal.new-enamad.ir https://new-enamad.ir https://*.supabase.co https://*.vercel.app;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co https://*.vercel.app;
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
  output: "standalone",
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: {
    // ✅ برای رفع فوری مشکل لود، Optimizer را غیرفعال کن
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bljowvueuaohttizdeir.supabase.co", // دامنه پروژه Supabase
        // ✅ عمومی‌تر تا تمام فایل‌های پابلیک پوشش داده شوند
        pathname: "/storage/v1/object/public/**",
      },
    ],
    domains: [
      "bljowvueuaohttizdeir.supabase.co", // Supabase
      "nail-salon-five.vercel.app",       // دامنه موقت Vercel
      "trustseal.new-enamad.ir",
      "new-enamad.ir",
      "localhost",
    ],
  },
  experimental: {
    optimizeCss: false,
  },
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
