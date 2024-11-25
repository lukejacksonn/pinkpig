// Loading environment variables from .env files
// https://docs.astro.build/en/guides/configuring-astro/#environment-variables
import { loadEnv } from "vite";
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_API_TOKEN } =
  loadEnv(import.meta.env.MODE, process.cwd(), "");

import { defineConfig } from "astro/config";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  prefetch: false,
  output: "server",
  adapter: cloudflare(),
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      token: SANITY_API_TOKEN,
      studioBasePath: "/admin",
      useCdn: true,
      apiVersion: "2023-03-20",
    }),
    react(),
    tailwind(),
  ],
  vite: {
    optimizeDeps: { exclude: ["fsevents"] },
    plugins: [mkcert()],
    server: { port: 4321 },
  },
});
