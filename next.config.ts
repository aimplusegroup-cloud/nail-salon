import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// 🔒 Content Security Policy (CSP)
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: https://bljowvueuaohttizdeir.supabase.co https://*.vercel.app https://trustseal.new-enamad.ir https://new-enamad.ir;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://bljowvueuaohttizdeir.supabase.co https://*.vercel.app;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
`.replace(/\s{2,}/g, " ").trim();

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

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: {
    unoptimized: true, // ✅ برای جلوگیری از خطای 400
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bljowvueuaohttizdeir.supabase.co",
        pathname: "/storage/v1/object/public/gallery/**", // مسیر دقیق پوشه‌ی گالری
      },
    ],
    domains: [
      "bljowvueuaohttizdeir.supabase.co", // Supabase
      "nail-salon-five.vercel.app",       // دامنه Vercel
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
