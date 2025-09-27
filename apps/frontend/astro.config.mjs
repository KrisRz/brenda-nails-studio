import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node'

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
  server: {
    port: 4321,
    host: true,
  },
  build: {
    format: 'directory'
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
})
