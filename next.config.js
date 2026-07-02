/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // dipakai karena gambar produk berasal dari API eksternal/CDN apa saja
    ],
  },
};

module.exports = nextConfig;
