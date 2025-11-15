import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg", "robots.txt", "safari-pinned-tab.svg"],
            manifest: {
                name: "AgriSense",
                short_name: "AgriSense",
                description: "AI crop health & pest predictor — early alerts for farmers.",
                theme_color: "#10B981",
                background_color: "#ffffff",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "pwa-192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "pwa-512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "pwa-512-maskable.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable"
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) => request.destination === "document" || request.destination === "script" || request.destination === "style",
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "html-and-assets",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // 1 day
                            }
                        }
                    },
                    {
                        urlPattern: ({ request }) => request.destination === "image",
                        handler: "CacheFirst",
                        options: {
                            cacheName: "images",
                            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 } // 30 days
                        }
                    }
                ]
            }
        })
    ],
    build: {
        rollupOptions: {
            // customize rollup if needed
        }
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5000", // your local backend or proxy
                changeOrigin: true,
                secure: false,
                rewrite: (p) => p.replace(/^\/api/, "")
            }
        }
    }

});
