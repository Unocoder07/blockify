/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the file-tracing root to this app (a parent lockfile exists in the repo).
  outputFileTracingRoot: import.meta.dirname,
  images: {
    // Allow future remote screenshot hosts here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
