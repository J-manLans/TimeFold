import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/ and https://v2.tauri.app/start/frontend/vite/
export default defineConfig({
  plugins: [svelte()],
  // $lib is src/lib and $tests is tests, from anywhere; tsconfig.app.json says the same for TypeScript
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
      $tests: fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },
  // Keep Rust's compile errors on screen when Vite starts
  clearScreen: false,
  server: {
    // Tauri's window loads this port (devUrl in tauri.conf.json): fail if it is taken rather than move
    port: 5173,
    strictPort: true,
    // Rust's build writes into src-tauri; reloading the page for it would be noise
    watch: { ignored: ['**/src-tauri/**'] },
  },
})
