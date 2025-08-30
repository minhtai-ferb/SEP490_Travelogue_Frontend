import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['dulich.tayninh.gov.vn', 'example.com',
      'res.cloudinary.com', 'i.imgur.com', 'img.freepik.com', 'travelogue.homes', 'static.vecteezy.com'],
    remotePatterns: [
      { protocol: 'http', hostname: 'travelogue.homes', pathname: '/images/**' },
      { protocol: 'https', hostname: 'static.vecteezy.com', pathname: '/**' }
    ]
  },

};

export default nextConfig;
