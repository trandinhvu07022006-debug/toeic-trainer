import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("scheduler")) return "react-vendor";
            if (id.includes("lucide")) return "icons";
            return "vendor";
          }
          // Tách học liệu theo nhóm để mỗi màn chỉ tải phần mình cần
          if (id.includes("/src/data/vocab/")) return "data-vocab";
          if (id.includes("/src/data/reading.json") || id.includes("/src/data/grammar.json")) return "data-reading";
          if (id.includes("/src/data/listening.json")) return "data-listening";
          if (id.includes("/src/data/speaking.json")) return "data-speaking";
        },
      },
    },
    chunkSizeWarningLimit: 1700,
  },
});
