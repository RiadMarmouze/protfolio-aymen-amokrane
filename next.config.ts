import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack (prod and when not using Turbopack)
  webpack(config) {
    // If you ever need file-URL imports: import iconUrl from './icon.svg?url'
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /url/,
      type: "asset",
    });

    // Default: import Icon from './icon.svg' -> React component via SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: [/url/] },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            // Let Tailwind control color with `text-*`
            replaceAttrValues: {
              "#000": "currentColor",
              "#000000": "currentColor",
              black: "currentColor",
            },
            svgProps: { fill: "currentColor" }, // or { stroke: 'currentColor' } for outlines
          },
        },
      ],
    });

    return config;
  },

  // Turbopack (dev / Next 15+)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
              replaceAttrValues: {
                "#000": "currentColor",
                "#000000": "currentColor",
                black: "currentColor",
              },
              svgProps: { fill: "currentColor" },
            },
          },
        ],
        as: "*.js",
      },
      // Optional: support ?url under turbo as asset URL (no extra config needed)
    },
  },
};

export default nextConfig;
