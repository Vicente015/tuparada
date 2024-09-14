import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  output: 'static',
  server: {
    port: 4000
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true
    })]
})
