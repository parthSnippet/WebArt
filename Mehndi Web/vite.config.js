import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'oxc' : false,
      target: 'es2015',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
            if (id.includes('node_modules/react-router-dom')) return 'router';
            if (id.includes('node_modules/@reduxjs') || id.includes('node_modules/react-redux')) return 'redux';
            if (id.includes('node_modules/react-hot-toast') || id.includes('node_modules/react-icons')) return 'ui';
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    
    // Development server
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    
    // Preview server (for production build testing)
    preview: {
      port: 4173,
      host: true
    },
    
    // Resolve aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@services': resolve(__dirname, 'src/services'),
        '@utils': resolve(__dirname, 'src/utils')
      }
    },
    
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
    }
  }
})
