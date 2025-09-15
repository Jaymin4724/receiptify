import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target:
          "http://receiptify-env.eba-fvjtkj2h.ap-south-1.elasticbeanstalk.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
