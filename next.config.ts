import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['dulich.tayninh.gov.vn', 'example.com', '.svg',
      'res.cloudinary.com', 'i.imgur.com', 'img.freepik.com', 'travelogue.homes'],
    remotePatterns: [new URL("http://travelogue.homes/images/")]
  },

};

export default nextConfig;
