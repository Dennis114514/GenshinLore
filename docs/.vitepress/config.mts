import { defineConfig } from 'vitepress'
import tailwindcss from "@tailwindcss/vite";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "日月全事",
  description: "最详尽的原神世界观手册",
  vite: {
    plugins: [tailwindcss()]
  }
})
