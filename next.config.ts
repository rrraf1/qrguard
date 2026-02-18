import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/_next/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://pseudoenthusiastic-honouredly-jordy.ngrok-free.dev" },
        ],
      },
    ];
  },
};

export default nextConfig;