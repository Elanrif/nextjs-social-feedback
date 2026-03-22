import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Keep pino and pino-pretty as native Node modules — never bundled by webpack.
  // This lets the logger.config.ts lazy-require work on the server,
  // while the browser receives only the console fallback.
  serverExternalPackages: ["pino", "pino-pretty"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          // CORS headers are intentionally omitted here.
          // "Access-Control-Allow-Origin: *" combined with "credentials: true" is
          // invalid per the CORS spec and will be rejected by browsers.
          // CORS for Next.js API routes is handled per-route when needed.
        ],
      },
    ];
  },
};

export default nextConfig;
