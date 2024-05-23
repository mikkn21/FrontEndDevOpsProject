/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vitest/config";

const vitestConfig: UserConfig = {
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: "./src/test/setup.ts"
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv("all", process.cwd());
  const BACKEND_URL = env.VITE_BACKEND_URL;
  const isBackendOnline = env.VITE_BACKEND_ONLINE === 'true'; // this is for front-end testing without backend
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`isBackendOnline: ${isBackendOnline}`);

  test: vitestConfig.test

  const unavailableBackend = {}
  const proxy = {
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
    "/users": {
      target: BACKEND_URL,
      changeOrigin: true,
      secure: false,
    },
    "/assignment": {
      target: BACKEND_URL,
      changeOrigin: true,
      secure: false,
    },
    "/solution": {
      target: BACKEND_URL,
      changeOrigin: true,
      secure: false,
    },
  }

  return {
    plugins: [react()],
    server: isBackendOnline ? proxy : unavailableBackend,
  };
});
