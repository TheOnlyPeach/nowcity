import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Grid, Direction } from '../types';
import { GRID_SIZE, BUILDINGS } from '../constants';
import { createEmptyGrid, addRandomTile, moveGrid, checkGameOver, getMaxTile } from '../utils/gameLogic';

interface GameBoardProps {
  onGameOver: (score: number, maxTile: number) => void;
  onExit: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onGameOver, onExit }) => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('mergeArchitect_highScore') || '0');
  });

  const boardRef = useRef<HTMLDivElement>(null);
  
  // Touch handling refs
  const touchStart = useRef<{ x: number, y: number } | null>(null);

  // Initialize Game
  useEffect(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
  }, []);

  const updateMaxTierRecord = (currentGrid: Grid) => {
    const max = getMaxTile(currentGrid);
    const savedMax = parseInt(localStorage.getItem('mergeArchitect_maxTier') || '0');
    if (max > savedMax) {
      localStorage.setItem('mergeArchitect_maxTier', max.toString());
    }
  };

  const handleMove = useCallback((direction: Direction) => {
    if (isGameOver) return;

    const { grid: newGrid, score: moveScore, moved } = moveGrid(grid, direction);

    if (moved) {
      const gridWithRandom = addRandomTile(newGrid);
      setGrid(gridWithRandom);
      const newScore = score + moveScore;
      setScore(newScore);

      updateMaxTierRecord(gridWithRandom);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('mergeArchitect_highScore', newScore.toString());
      }

      if (checkGameOver(gridWithRandom)) {
        setIsGameOver(true);
      }
    }
  }, [grid, isGameOver, score, highScore]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp': handleMove('UP'); break;
        case 'ArrowDown': handleMove('DOWN'); break;
        case 'ArrowLeft': handleMove('LEFT'); break;
        case 'ArrowRight': handleMove('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  // Touch Event Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const deltaX = touchEnd.x - touchStart.current.x;
    const deltaY = touchEnd.y - touchStart.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const threshold = 30; // Minimum distance to trigger swipe

    if (Math.max(absDeltaX, absDeltaY) > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal
        if (deltaX > 0) handleMove('RIGHT');
        else handleMove('LEFT');
      } else {
        // Vertical
        if (deltaY > 0) handleMove('DOWN');
        else handleMove('UP');
      }
    }

    touchStart.current = null;
  };

  // Helper to render tiles
  const renderTile = (value: number, rowIndex: number, colIndex: number) => {
    if (value === 0) return null;
    const def = BUILDINGS[value];
    
    return (
      <div
        key={`${rowIndex}-${colIndex}-${value}`} 
        className={`absolute w-full h-full flex flex-col items-center justify-center rounded-sm transition-all duration-100 animate-pop ${def.color}`}
        style={{
          left: 0, top: 0, 
        }}
      >
        <span className={`font-pixel text-xs md:text-sm font-bold ${def.textColor}`}>
            {value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
        </span>
        <span className={`text-[10px] md:text-xs font-mono opacity-80 ${def.textColor}`}>
          {def.label}
        </span>
        {/* Simple "Roof" hint */}
        <div className="absolute top-0 w-full h-1 bg-white/20"></div>
      </div>
    );
  };

  const handleResultSubmit = () => {
    const maxTile = getMaxTile(grid);
    onGameOver(score, maxTile);
  };

  const maxTileValue = isGameOver ? getMaxTile(grid) : 0;
  const resultBuilding = BUILDINGS[maxTileValue];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900 w-full touch-none select-none">
      
      {/* CEO & Employee Status Header */}
      <div className="w-full max-w-md bg-slate-800 rounded-lg p-3 mb-4 border border-slate-700 flex justify-between items-center relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>

        {/* Employee (Left) */}
        <div className="flex items-center gap-2 z-10">
           <div className="relative">
             {/* Simple Pixel Art SVG: Nervous Employee */}
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-slate-700 rounded border border-slate-600">
               <rect x="0" y="0" width="24" height="24" fill="#334155"/>
               <rect x="6" y="8" width="12" height="12" fill="#FCA5A5"/> {/* Face */}
               <rect x="6" y="4" width="12" height="4" fill="#1E293B"/> {/* Hair */}
               <rect x="7" y="11" width="2" height="2" fill="#1E293B"/> {/* Eye L */}
               <rect x="15" y="11" width="2" height="2" fill="#1E293B"/> {/* Eye R */}
               <rect x="9" y="16" width="6" height="2" fill="#991B1B"/> {/* Mouth */}
               {/* Sweat Drops */}
               <rect x="4" y="9" width="2" height="2" fill="#60A5FA" className="animate-sweat" style={{animationDelay: '0s'}}/>
               <rect x="19" y="11" width="2" height="2" fill="#60A5FA" className="animate-sweat" style={{animationDelay: '0.5s'}}/>
             </svg>
           </div>
           <div>
             <div className="text-[10px] text-slate-400 font-pixel">나 (김대리)</div>
             <div className="text-xs text-yellow-400 font-pixel">"제..제발!"</div>
           </div>
        </div>

        {/* VS / Tension */}
        <div className="text-red-500 font-pixel text-xl animate-pulse z-10">VS</div>

        {/* CEO (Right) */}
        <div className="flex items-center gap-2 flex-row-reverse z-10 text-right">
           <div className="relative">
             {/* Simple Pixel Art SVG: Stern CEO */}
             <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-red-900/20 rounded border border-red-900/50 animate-angry">
               <rect x="0" y="0" width="24" height="24" fill="#450a0a"/>
               <rect x="5" y="6" width="14" height="14" fill="#FDBA74"/> {/* Face */}
               <rect x="5" y="2" width="14" height="4" fill="#9CA3AF"/> {/* Grey Hair */}
               <rect x="5" y="6" width="2" height="4" fill="#9CA3AF"/> {/* Sideburns */}
               <rect x="17" y="6" width="2" height="4" fill="#9CA3AF"/>
               
               {/* Glasses & Eyes */}
               <rect x="6" y="10" width="5" height="1" fill="#111827"/> {/* Top Frame */}
               <rect x="13" y="10" width="5" height="1" fill="#111827"/> 
               <rect x="6" y="10" width="1" height="3" fill="#111827"/> 
               <rect x="17" y="10" width="1" height="3" fill="#111827"/> 
               <rect x="11" y="11" width="2" height="1" fill="#111827"/> {/* Bridge */}
               <rect x="7" y="11" width="2" height="2" fill="#111827"/> {/* Eye L */}
               <rect x="15" y="11" width="2" height="2" fill="#111827"/> {/* Eye R */}

               {/* Angry Eyebrows */}
               <rect x="6" y="8" width="4" height="2" fill="#111827" transform="rotate(10 8 9)"/>
               <rect x="14" y="8" width="4" height="2" fill="#111827" transform="rotate(-10 16 9)"/>

               <rect x="8" y="16" width="8" height="2" fill="#111827"/> {/* Stern Mouth */}
             </svg>
           </div>
           <div>
             <div className="text-[10px] text-red-400 font-pixel">박 대표 (CEO)</div>
             <div className="text-xs text-white font-pixel">"지켜보고 있다."</div>
           </div>
        </div>
      </div>

      {/* Score HUD */}
      <div className="w-full max-w-md flex justify-between items-end mb-4">
        <div>
           {/* Tier Gauge */}
          <div className="text-[10px] text-slate-400 font-pixel mb-1">현재 등급</div>
          <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
             <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300" style={{ width: `${(getMaxTile(grid) / 2048) * 100}%`}}></div>
          </div>
        </div>
        <div className="flex gap-2">
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <p className="text-[10px] text-slate-400 font-pixel text-center">결재 서류(점수)</p>
                <p className="text-white font-bold font-pixel text-right">{score}</p>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <p className="text-[10px] text-slate-400 font-pixel text-center">최고 실적</p>
                <p className="text-white font-bold font-pixel text-right">{highScore}</p>
            </div>
        </div>
      </div>

      {/* Grid Container */}
      <div 
        ref={boardRef}
        className="relative bg-slate-800 p-2 rounded-lg border-4 border-slate-700 shadow-2xl touch-action-none" // touch-action-none prevents browser scrolling
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 400px)',
            touchAction: 'none' 
        }}
      >
        <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
          {grid.map((row, r) => 
            row.map((cell, c) => (
              <div key={`${r}-${c}`} className="relative bg-slate-700/50 rounded-sm w-full h-full overflow-hidden">
                {renderTile(cell, r, c)}
              </div>
            ))
          )}
        </div>
        
        {/* Game Over Modal Overlay */}
        {isGameOver && resultBuilding && (
             <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center animate-fade-in text-center p-6 border-4 border-red-900/50">
                 <h2 className="text-2xl font-pixel text-red-500 mb-2">야근 확정!</h2>
                 <p className="text-xs text-slate-400 font-pixel mb-4">(더 이상 합칠 공간이 없습니다)</p>
                 
                 <div className="bg-slate-800 p-4 rounded-lg border-2 border-slate-600 mb-6 w-full max-w-[200px]">
                    <div className={`w-24 h-24 mx-auto mb-3 rounded shadow-lg flex items-center justify-center ${resultBuilding.color}`}>
                       <span className="text-4xl">🏢</span>
                    </div>
                    <div className="font-pixel text-white text-lg">{resultBuilding.label}</div>
                    <div className="font-mono text-slate-400 text-xs mt-1">{resultBuilding.description}</div>
                 </div>

                 <div className="space-y-2 mb-6 font-mono text-sm text-slate-300">
                    <p>최종 성과: <span className="text-white font-bold">{score}</span></p>
                 </div>

                 <button 
                    onClick={handleResultSubmit}
                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold font-pixel rounded shadow-[0_4px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all"
                 >
                    설계안 제출하기
                 </button>
             </div>
        )}
      </div>
      
      {/* Mobile Swipe Instruction */}
      <div className="mt-4 md:hidden text-slate-500 font-pixel text-[10px] animate-pulse">
        화면을 밀어서(Swipe) 건축하세요
      </div>

      {/* Controls / Footer */}
      <div className="mt-8 flex gap-4">
         <button onClick={onExit} className="text-slate-500 hover:text-white font-pixel text-xs underline">
             퇴사하기 (나가기)
         </button>
      </div>

    </div>
  );
};

export default GameBoard;