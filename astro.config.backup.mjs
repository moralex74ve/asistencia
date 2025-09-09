import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [tailwind(), svelte()],
  site: "https://moralex74.duckdns.org",
  output: "server",
  build: {
    format: "directory",
    inlineStylesheets: "always",
    minify: true,
  },
  vite: {
    build: {
      target: "esnext",
      minify: "esbuild",
      cssMinify: true,
      sourcemap: false,
    },
  },
});
