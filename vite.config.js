import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_BASE_URL || 'https://tutorials.avideo.com/';

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      // Proxies API calls through the dev server so the browser sees a same-origin
      // request, avoiding CORS rejections from the AVideo backend (see config.jsx).
      proxy: {
        '/avideo-api': {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/avideo-api/, ''),
        },
      },
    },
  };
})
