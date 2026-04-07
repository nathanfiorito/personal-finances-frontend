import type { NextConfig } from "next";

// TODO(security/F-05): Add security headers via the `headers()` async function below.
// Missing headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Content-Security-Policy.
// Example:
// async headers() {
//   return [{
//     source: "/(.*)",
//     headers: [
//       { key: "X-Frame-Options", value: "DENY" },
//       { key: "X-Content-Type-Options", value: "nosniff" },
//       { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//       { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
//       { key: "Content-Security-Policy", value: "default-src 'self'; ..." },
//     ],
//   }];
// }

// TODO(security/F-03): Restrict CORS on static pages — Vercel currently serves them with
// Access-Control-Allow-Origin: * which is unnecessary for HTML. Configure via vercel.json:
// { "headers": [{ "source": "/(.*)", "headers": [{ "key": "Access-Control-Allow-Origin", "value": "https://finances.nathanfiorito.com.br" }] }] }

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
