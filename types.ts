export enum BuildingTier {
  Material = 2,
  Concrete = 4,
  Frame = 8,
  Wall = 16,
  Room = 32,
  Pavilion = 64,
  House = 128,
  Villa = 256,
  Office = 512,
  Tower = 1024,
  Landmark = 2048
}

export interface BuildingDef {
  value: number;
  label: string;
  color: string;
  textColor: string;
  description: string;
}

export interface CityPlot {
  id: string;
  x: number;
  y: number;
  buildingValue: number;
  ownerName: string;
  timestamp: number;
}

export type Grid = number[][];
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';