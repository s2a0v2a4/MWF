import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const baseConfig = {
    plugins: [react()],
    server: {
      port: 3000,
    }
  }
  
  if (mode === 'development') {
    return {



      ...baseConfig,
      server: {
        ...baseConfig.server,
        proxy: {
          '/api': {
            target: env.VITE_API_URL || 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
            // return {
          }
        }
      }
    }
  }

  return baseConfig
})
