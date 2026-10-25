import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  // cho phép vite sử dụng process.env, mặc định thì phải import.meta.env
  define: {
    'process.env': process.env
  },
  plugins: [
    react(),
    svgr()
  ],
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/material/styles',
      '@mui/icons-material',
      '@mui/system',
      '@emotion/react',
      '@emotion/styled',
      'dayjs'
    ]
  },
  // thay đổi đường dẫn tới thư mục
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui'
            }
            if (id.includes('@uiw') || id.includes('rehype') || id.includes('codemirror')) {
              return 'vendor-editor'
            }
            if (id.includes('@dnd-kit')) {
              return 'vendor-dnd'
            }
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom') ||
              id.includes('react-redux') ||
              id.includes('@reduxjs/toolkit') ||
              id.includes('redux-persist')
            ) {
              return 'vendor-react'
            }
          }
        }
      }
    }
  }
})
