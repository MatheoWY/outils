import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: true,
    proxy: {
      // API Signatures (dev) -> Express local
      "/api": {
        // Utilise une variable d'env si présente (Docker), sinon 127.0.0.1 (évite ::1)
        target: process.env.VITE_PROXY_API_TARGET || "http://127.0.0.1:5174",
        changeOrigin: true,
        secure: false
      },
      // Proxy de dev pour contourner le CORS sur le flux Hellowork
      "/proxy/hellowork": {
        target: "https://master.nicoka.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/proxy\/hellowork/, "/jobboards/hellowork"),
      },
      // Proxy de dev pour le flux Directemploi
      "/proxy/directemploi": {
        target: "https://master.nicoka.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/proxy\/directemploi/, "/jobboards/directemploi"),
      },
      // Proxy de dev pour le flux Meteojob
      "/proxy/meteojob": {
        target: "https://master.nicoka.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/proxy\/meteojob/, "/jobboards/meteojob"),
      },
      // Proxy de dev pour le flux Indeed
      "/proxy/indeed": {
        target: "https://master.nicoka.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/proxy\/indeed/, "/jobboards/indeed"),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
