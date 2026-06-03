import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  optimizeDeps: {
    exclude: [
      'react-chartjs-2',
      'chart.js',
      'react-select'
    ]
  }
=======
  plugins: [react()],
>>>>>>> origin/pa2/ibu-anak-develop3
})
