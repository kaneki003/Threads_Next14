/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  }
  ,
    images: {
      domains: [
        "img.clerk.com",
        "images.clerk.dev",
        "uploadthing.com",
        "placehold.co",
      ],
    },
    // experimental: {
    //   serverComponents: true,
    //   serverComponentsExternalPackages: ["mongoose"],
    // },
  };
  
  export default nextConfig;
