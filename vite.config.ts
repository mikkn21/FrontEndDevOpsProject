import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv("all", process.cwd());
  const BACKEND_URL = env.VITE_BACKEND_URL;

  return {
    plugins: [react()],
    server: {
      proxy: {
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
      },
    },
  };
});
