import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node'

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    port: 4321,
    host: true,
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
})
