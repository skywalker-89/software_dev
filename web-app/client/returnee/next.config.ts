import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "st.depositphotos.com",
      "via.placeholder.com",
      "example.com",
      "res.cloudinary.com",
    ], // Add the domain of your image source
  },
};

export default nextConfig;
