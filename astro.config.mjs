import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  site: "https://moralex74.duckdns.org",
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
    minify: true,
  },
  vite: {
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: false,
    },
  },
});