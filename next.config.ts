/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // এই অংশটি যোগ করা হয়েছে
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;