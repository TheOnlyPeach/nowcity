import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. 현재 디렉토리의 .env 파일에서 환경 변수를 로드합니다.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // -----------------------------------------------------------------------
    // [핵심] GitHub Pages 배포 경로 설정
    // 리포지토리 이름이 'nowcity'이므로 반드시 '/nowcity/'로 설정해야 합니다.
    // -----------------------------------------------------------------------
    base: '/nowcity/',

    plugins: [react()],

    // 2. Vite에서 process.env를 사용할 수 있도록 변환 설정
    // (App.tsx에서 process.env.GEMINI_API_KEY를 읽을 수 있게 해줍니다)
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        // 3. 경로 별칭 설정 (@ -> 현재 루트 폴더)
        // 파일들이 src 폴더 없이 루트에 있으므로 '.'으로 연결합니다.
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    
    // 빌드 시 출력 폴더 설정 (GitHub Pages 배포용)
    build: {
      outDir: 'dist',
    }
  };
});