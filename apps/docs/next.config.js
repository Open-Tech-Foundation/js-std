const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true
  },
  distDir: 'build',
  headers: () => {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

module.exports = withNextra({ ...nextConfig });

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
