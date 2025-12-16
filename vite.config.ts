import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리에서 .env 파일 로드
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // -----------------------------------------------------------------------
    // [수정 완료] GitHub Pages 배포 경로 설정
    // 리포지토리 이름 'nowcity'에 맞춰 경로를 지정했습니다.
    // -----------------------------------------------------------------------
    base: '/nowcity/', 

    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    
    // 환경 변수 주입 설정
    define: {
      // 코드 내에서 process.env.GEMINI_API_KEY로 접근 가능하게 설정
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    resolve: {
      alias: {
        // src 폴더가 없고 루트에 파일들이 있으므로,
        // '@'를 현재 루트 디렉토리('.')로 연결합니다.
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});