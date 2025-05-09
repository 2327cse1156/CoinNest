import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    nodePolyfills(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeManifestIcons: true,
      devOptions: {
        enabled: true, // Enable the PWA features in development for testing
      },
      manifest: {
        name: "CoinNest",
        short_name: "CoinNest",
        description: "CoinNest - A React-based cryptocurrency wallet interface leveraging Vite for fast development. Includes Ethereum wallet integration and modern React components for a seamless user experience.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/icons/favicon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/icons/favicon.svg",
            sizes: "any",
            type: "image/svg+xml"
          },
          {
            src: "/icons/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: [
          "**/*.{html,js,css,png,jpg,jpeg,svg,woff,woff2,eot,ttf,otf}"
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB limit
        navigateFallback: "/index.html",
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.coinnest\.com/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // Cache images for 30 days
              },
            },
          }
        ]
      }
    })
  ],
});
