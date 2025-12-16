import React, { useState, useEffect } from 'react';
import { CityPlot, BuildingTier } from '../types';
import { BUILDINGS } from '../constants';

interface CityViewProps {
  plots: CityPlot[];
  onPlayClick: () => void;
}

const CityView: React.FC<CityViewProps> = ({ plots, onPlayClick }) => {
  const [showManual, setShowManual] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [maxUnlockedTier, setMaxUnlockedTier] = useState<number>(2);

  useEffect(() => {
    const saved = localStorage.getItem('mergeArchitect_maxTier');
    if (saved) {
      setMaxUnlockedTier(parseInt(saved));
    }
  }, [showInventory]); // Update when inventory opens

  // Define grid size for the city view (e.g., 5x5)
  const cityGridSize = 5;
  const gridCells = Array.from({ length: cityGridSize * cityGridSize }, (_, i) => {
    const x = i % cityGridSize;
    const y = Math.floor(i / cityGridSize);
    return { x, y };
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="z-10 text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-pixel text-yellow-400 mb-2 drop-shadow-lg">
          NOW CITY
        </h1>
        <p className="font-mono text-slate-400 text-sm md:text-base">
          우리 손으로 만드는 미래 도시 플랫폼
        </p>
      </div>

      {/* Isometric Container */}
      <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[400px] flex items-center justify-center">
        <div 
          className="relative preserve-3d transition-transform duration-700 ease-out"
          style={{ 
            transform: 'rotateX(60deg) rotateZ(-45deg)',
            transformStyle: 'preserve-3d',
            width: '300px',
            height: '300px'
          }}
        >
          {gridCells.map((cell) => {
            const plot = plots.find(p => p.x === cell.x && p.y === cell.y);
            const buildingDef = plot ? BUILDINGS[plot.buildingValue] : null;
            
            // Calculate height based on building value (logarithmic scale approx)
            const heightMultiplier = plot ? Math.log2(plot.buildingValue) : 0;
            const heightPx = heightMultiplier * 8 + 4; // Base height

            return (
              <div
                key={`${cell.x}-${cell.y}`}
                className="absolute border border-slate-700/50 transition-all duration-500 hover:brightness-110 group"
                style={{
                  width: '60px',
                  height: '60px',
                  left: `${cell.x * 60}px`,
                  top: `${cell.y * 60}px`,
                  backgroundColor: plot ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.5)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Floor */}
                <div className="w-full h-full bg-slate-800/50"></div>

                {/* Building Block (3D CSS) */}
                {plot && buildingDef && (
                  <div 
                    className={`absolute bottom-0 left-0 w-full transition-all duration-500 ${buildingDef.color}`}
                    style={{
                      height: `${heightPx}px`,
                      transform: `translateZ(${heightPx}px)`, 
                    }}
                  >
                     {/* Top Face */}
                    <div 
                      className={`absolute w-full h-full ${buildingDef.color} brightness-110 flex items-center justify-center border-t border-l border-white/20`}
                      style={{
                        transform: `translateZ(${heightPx}px)`,
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <span className="text-[10px] font-bold text-white/80 rotate-45 transform -scale-y-100">
                         {buildingDef.value >= 64 ? '🏢' : ''}
                      </span>
                    </div>

                    {/* Side Face (Right) */}
                    <div 
                      className={`absolute bottom-0 right-0 h-full w-full ${buildingDef.color} brightness-75 origin-bottom-right`}
                      style={{
                        transform: 'rotateY(90deg) translateX(100%)', // Simplified transform
                        height: `${heightPx}px`,
                        width: '60px'
                      }}
                    ></div>

                    {/* Side Face (Front) */}
                    <div 
                       className={`absolute bottom-0 left-0 w-full ${buildingDef.color} brightness-90 origin-bottom`}
                       style={{
                         transform: 'rotateX(-90deg) translateY(100%)',
                         height: `${heightPx}px`
                       }}
                    ></div>
                    
                    {/* Tooltip on Hover (Counter-rotated) */}
                    <div className="absolute -top-10 left-0 w-[120px] bg-black/90 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-normal"
                        style={{ transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(100px)' }}
                    >
                      <p className="font-bold text-yellow-400">{buildingDef.label}</p>
                      <p className="text-[10px] text-gray-300">건축가: {plot.ownerName}</p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 z-20 flex flex-col gap-3 w-full max-w-xs px-4">
        <button
          onClick={onPlayClick}
          className="w-full px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-pixel font-bold text-lg rounded shadow-[0_4px_0_rgb(161,98,7)] active:shadow-none active:translate-y-1 transition-all"
        >
          프로젝트 시작
        </button>
        <div className="flex gap-3">
            <button
            onClick={() => setShowInventory(true)}
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs rounded border border-slate-600 transition-all"
            >
            인벤토리
            </button>
            <button
            onClick={() => setShowManual(true)}
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs rounded border border-slate-600 transition-all"
            >
            매뉴얼
            </button>
        </div>
        <div className="text-center font-mono text-xs text-slate-500 mt-2">
           주간 랭킹 마감: 2일 남음
        </div>
      </div>

      {/* Manual Modal */}
      {showManual && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border-2 border-slate-600 rounded-lg max-w-md w-full p-6 shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => setShowManual(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-pixel text-yellow-400 mb-6 text-center border-b border-slate-700 pb-4">
              건축 매뉴얼
            </h2>
            
            <div className="space-y-4 font-mono text-sm text-slate-300">
              <div className="flex gap-4 items-start">
                <div className="bg-slate-700 p-2 rounded text-xl">🎮</div>
                <div>
                  <h3 className="text-white font-bold mb-1">조작 방법</h3>
                  <p>방향키(PC) 또는 화면 드래그(모바일)로 모든 블록을 이동시킵니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-slate-700 p-2 rounded text-xl">🧱</div>
                <div>
                  <h3 className="text-white font-bold mb-1">건축 과정 (Merge)</h3>
                  <p>같은 단계의 블록이 충돌하면 합쳐져서 <span className="text-yellow-400">상위 단계 건물</span>로 진화합니다.</p>
                  <div className="mt-2 text-xs text-slate-500 bg-slate-900/50 p-2 rounded">
                    벽돌 → 콘크리트 → 철골 → 벽체 ... → 랜드마크
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-slate-700 p-2 rounded text-xl">🏙️</div>
                <div>
                  <h3 className="text-white font-bold mb-1">NOW CITY 건설</h3>
                  <p>게임이 끝나면 가장 높게 쌓아 올린 건물이 <span className="text-yellow-400">NOW CITY</span>의 빈 땅에 건설됩니다.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowManual(false)}
              className="w-full mt-8 py-3 bg-yellow-500 text-slate-900 font-bold rounded hover:bg-yellow-400 transition-colors"
            >
              알겠습니다
            </button>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventory && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border-2 border-slate-600 rounded-lg max-w-2xl w-full p-6 shadow-2xl animate-fade-in relative flex flex-col max-h-[90vh]">
                <button 
                onClick={() => setShowInventory(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                ✕
                </button>

                <h2 className="text-xl font-pixel text-yellow-400 mb-2 text-center">
                    건축 도감
                </h2>
                <p className="text-center font-mono text-xs text-slate-400 mb-6 border-b border-slate-700 pb-4">
                    해금된 건물 목록
                </p>

                <div className="overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.values(BUILDINGS).map((b) => {
                        const isUnlocked = b.value <= maxUnlockedTier;
                        return (
                            <div key={b.value} className={`relative p-3 rounded border ${isUnlocked ? 'border-slate-600 bg-slate-700' : 'border-slate-800 bg-slate-800 opacity-50'}`}>
                                <div className={`w-full aspect-square rounded mb-2 flex items-center justify-center ${isUnlocked ? b.color : 'bg-slate-900'}`}>
                                    <span className="text-2xl">{isUnlocked ? (b.value >= 64 ? '🏢' : '🧱') : '?'}</span>
                                </div>
                                <div className="text-center">
                                    <p className={`font-pixel text-[10px] ${isUnlocked ? 'text-yellow-400' : 'text-slate-600'}`}>
                                        {isUnlocked ? b.label : '???'}
                                    </p>
                                    <p className="font-mono text-[9px] text-slate-400 mt-1">
                                        {isUnlocked ? b.description : '잠김'}
                                    </p>
                                </div>
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <span className="text-slate-700 text-2xl font-bold">🔒</span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default CityView;