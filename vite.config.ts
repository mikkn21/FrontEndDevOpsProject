import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv("all", process.cwd());
  const BACKEND_URL = env.VITE_BACKEND_URL;
  const isBackendOnline = env.VITE_BACKEND_ONLINE === 'true'; // this is for front-end testing without backend

  return {
    plugins: [react()],
    server: {
      proxy: isBackendOnline ? {
        "/api": {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
        "/login": {
          target: BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
    } : undefined,
    },
  };
});
