import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep your existing webpack rule if you also run non-turbo builds
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /url/, // allow `import icon from './icon.svg?url'`
      type: 'asset',        // let Next handle it as a file
    });

    // SVGR for non-`?url` imports in webpack builds
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: [/url/] },
      use: [{
        loader: '@svgr/webpack',
        options: {
          icon: true,
          // Force black strokes/fills to follow currentColor
          replaceAttrValues: {
            '#000': 'currentColor',
            '#000000': 'currentColor',
            'black': 'currentColor',
          },
          svgProps: { stroke: 'currentColor' }
        }
      }],
    });

    return config;
  },

  // Turbopack config (dev & Next 15+ builds)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              replaceAttrValues: {
                '#000': 'currentColor',
                '#000000': 'currentColor',
                'black': 'currentColor',
              },
              svgProps: { stroke: 'currentColor' }
            }
          }
        ],
        as: '*.js',
      },
      // Optional: also support `?url` imports under turbo
      '*.svg?url': {
        // no svgr -> treat as file url (handled natively)
        // Leave this block empty; Turbopack will emit an asset URL.
      }
    },
  },
};

export default nextConfig;
