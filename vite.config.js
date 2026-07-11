import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Where the site is mounted. '/' everywhere except GitHub Pages project
  // hosting, where the deploy workflow sets DEPLOY_BASE=/playersstudio/.
  // Moving to a custom domain later: just stop setting DEPLOY_BASE.
  base: process.env.DEPLOY_BASE || '/',
  plugins: [react()],
})
