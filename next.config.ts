import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Which kind of deployment this build is for, so the newsletter form can tell
  // a preview from the public site. Vercel sets VERCEL_ENV ("preview" or
  // "production"). Netlify sets CONTEXT ("deploy-preview", "branch-deploy" or
  // "production"), but only while building, so it's saved into the build here.
  env: {
    DEPLOY_CONTEXT: process.env.VERCEL_ENV ?? process.env.CONTEXT ?? "",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
