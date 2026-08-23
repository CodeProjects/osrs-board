import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves project sites at https://<user>.github.io/<repo>/,
  // so built asset paths need the repo name prefixed. Dev server stays at
  // the root so `npm start` is unaffected.
  base: command === 'build' ? '/osrs-board/' : '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    // Lets the client call relative `/api/...` paths in local dev without
    // hitting CORS, even when VITE_API_BASE_URL isn't set. Production
    // builds have no dev server, so they rely on VITE_API_BASE_URL instead.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
}))
