import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  output: 'static',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true
    })]
})
