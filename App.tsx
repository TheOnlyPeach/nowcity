import React, { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import CityView from '@/components/CityView';
import { CityPlot } from '@/types';
import { INITIAL_CITY_DATA } from '@/constants';

const App: React.FC = () => {
  const [view, setView] = useState<'CITY' | 'GAME'>('CITY');
  const [cityPlots, setCityPlots] = useState<CityPlot[]>(INITIAL_CITY_DATA);

  // [디버깅용] 앱 실행 시 API Key가 잘 로드되었는지 콘솔에 출력
  useEffect(() => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      console.log("✅ API Key가 성공적으로 로드되었습니다.");
    } else {
      console.warn("⚠️ API Key가 발견되지 않았습니다. .env 파일을 확인해주세요.");
    }
  }, []);

  // 게임 종료 후 점수 처리 (백엔드 전송 시뮬레이션)
  const handleGameEnd = (score: number, maxTile: number) => {
    console.log(`[API MOCK] Submitting Score: ${score}, Max Building Tier: ${maxTile}`);
    
    // 로직: 빈 땅을 찾거나 기존의 낮은 건물을 대체 (여기서는 랜덤 빈 곳에 배치)
    const newPlot: CityPlot = {
        id: Date.now().toString(),
        x: Math.floor(Math.random() * 5), // 0~4 사이 랜덤 좌표
        y: Math.floor(Math.random() * 5),
        buildingValue: maxTile,
        ownerName: "나 (건축가)",
        timestamp: Date.now()
    };

    setCityPlots(prev => {
        // 해당 좌표에 이미 건물이 있다면 덮어쓰기 위해 필터링
        const filtered = prev.filter(p => p.x !== newPlot.x || p.y !== newPlot.y);
        return [...filtered, newPlot];
    });

    // 도시 뷰로 돌아가기
    setView('CITY');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100">
      {view === 'CITY' ? (
        <CityView 
          plots={cityPlots} 
          onPlayClick={() => setView('GAME')} 
        />
      ) : (
        <GameBoard 
          onGameOver={handleGameEnd} 
          onExit={() => setView('CITY')} 
        />
      )}
    </div>
  );
};

export default App;