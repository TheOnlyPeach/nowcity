import { BuildingDef, BuildingTier, CityPlot } from '@/types';

// 게임 플레이 보드 크기 (2048 게임은 보통 4x4)
export const GRID_SIZE = 4;

// 메인 화면(로비) 도시 뷰 크기 (5x5)
export const CITY_GRID_SIZE = 5;

// 건물 단계별 정의 (데이터 + 비주얼)
export const BUILDINGS: Record<number, BuildingDef> = {
  [BuildingTier.Material]: { 
    value: 2, 
    label: "벽돌", 
    color: "bg-stone-400", 
    textColor: "text-stone-800",
    description: "기초 자재" 
  },
  [BuildingTier.Concrete]: { 
    value: 4, 
    label: "콘크리트", 
    color: "bg-stone-500", 
    textColor: "text-stone-100",
    description: "기초 공사" 
  },
  [BuildingTier.Frame]: { 
    value: 8, 
    label: "철골", 
    color: "bg-orange-700", 
    textColor: "text-white",
    description: "구조체" 
  },
  [BuildingTier.Wall]: { 
    value: 16, 
    label: "벽체", 
    color: "bg-orange-600", 
    textColor: "text-white",
    description: "마감 공사" 
  },
  [BuildingTier.Room]: { 
    value: 32, 
    label: "공간", 
    color: "bg-yellow-600", 
    textColor: "text-white",
    description: "단위 공간" 
  },
  [BuildingTier.Pavilion]: { 
    value: 64, 
    label: "파빌리온", 
    color: "bg-teal-600", 
    textColor: "text-white",
    description: "소형 건축" 
  },
  [BuildingTier.House]: { 
    value: 128, 
    label: "주택", 
    color: "bg-teal-500", 
    textColor: "text-white",
    description: "주거 시설" 
  },
  [BuildingTier.Villa]: { 
    value: 256, 
    label: "빌라", 
    color: "bg-cyan-600", 
    textColor: "text-white",
    description: "고급 주택" 
  },
  [BuildingTier.Office]: { 
    value: 512, 
    label: "오피스", 
    color: "bg-blue-600", 
    textColor: "text-white",
    description: "업무 시설" 
  },
  [BuildingTier.Tower]: { 
    value: 1024, 
    label: "타워", 
    color: "bg-indigo-600", 
    textColor: "text-white",
    description: "마천루" 
  },
  [BuildingTier.Landmark]: { 
    value: 2048, 
    label: "랜드마크", 
    color: "bg-purple-600", 
    textColor: "text-white",
    description: "도시의 상징" 
  }
};

// 초기 도시 데이터 (더미 데이터)
export const INITIAL_CITY_DATA: CityPlot[] = [
  { id: '1', x: 2, y: 3, buildingValue: 512, ownerName: "김대리 (설계1팀)", timestamp: Date.now() },
  { id: '2', x: 1, y: 1, buildingValue: 128, ownerName: "이인턴 (디자인)", timestamp: Date.now() },
  { id: '3', x: 3, y: 3, buildingValue: 1024, ownerName: "박대표 (CEO)", timestamp: Date.now() },
  { id: '4', x: 0, y: 4, buildingValue: 256, ownerName: "최팀장 (개발팀)", timestamp: Date.now() },
];