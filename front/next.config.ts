import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dvgnwrkvl/**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
   async rewrites() {
    return {
      
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_URL}/:path*`, 
        },
      ],
     
      fallback: []
    };
  },
};

export default nextConfig;
