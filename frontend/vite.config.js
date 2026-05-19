import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    // Per DEC-020: frontend coverage threshold = 40%.
    //
    // `include` is scoped to files that have direct unit tests today
    // (Sprint 5 FE-5.3). Pages and components without tests are out of
    // scope for the threshold gate. As more tests are added in Sprint 6+,
    // expand the `include` glob to cover the broader codebase.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/components/PageState.jsx',
        'src/components/ui/StatusBadge.jsx',
        'src/components/ui/dialog.jsx',
        'src/pages/LoginPage.jsx',
        'src/pages/ItemListPage.jsx',
      ],
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/**/__tests__/**',
        'src/setupTests.js',
        'src/main.jsx',
      ],
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 40,
        statements: 40,
      },
    },
  },
});
