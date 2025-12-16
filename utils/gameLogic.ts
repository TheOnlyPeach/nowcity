import { Grid, Direction } from '../types';
import { GRID_SIZE } from '../constants';

// Create empty grid
export const createEmptyGrid = (): Grid => {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
};

// Add a random tile (2 or 4) to an empty spot
export const addRandomTile = (grid: Grid): Grid => {
  const emptyCells: { r: number; c: number }[] = [];
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 0) emptyCells.push({ r, c });
    });
  });

  if (emptyCells.length === 0) return grid;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

// Slide and Merge Logic for a single row (Left Direction)
const slideRowLeft = (row: number[]): { newRow: number[]; score: number } => {
  let score = 0;
  // 1. Remove zeros
  let filtered = row.filter(val => val !== 0);
  
  // 2. Merge adjacent equals
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered[i + 1] = 0;
    }
  }
  
  // 3. Remove zeros created by merge and pad with zeros
  filtered = filtered.filter(val => val !== 0);
  while (filtered.length < GRID_SIZE) {
    filtered.push(0);
  }
  
  return { newRow: filtered, score };
};

// Rotate matrix to apply the Left-Slide logic to other directions
const rotateGrid = (grid: Grid): Grid => {
  const newGrid = createEmptyGrid();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      newGrid[i][j] = grid[GRID_SIZE - 1 - j][i];
    }
  }
  return newGrid;
};

const rotateGridCounterClockwise = (grid: Grid): Grid => {
  const newGrid = createEmptyGrid();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      newGrid[i][j] = grid[j][GRID_SIZE - 1 - i];
    }
  }
  return newGrid;
};

export const moveGrid = (grid: Grid, direction: Direction): { grid: Grid; score: number; moved: boolean } => {
  let rotatedGrid = [...grid.map(row => [...row])];
  let rotations = 0;

  // Rotate until "Left" is the correct direction
  if (direction === 'UP') {
    rotatedGrid = rotateGridCounterClockwise(rotatedGrid); // Top becomes Left
    rotations = 1;
  } else if (direction === 'RIGHT') {
    rotatedGrid = rotateGrid(rotatedGrid);
    rotatedGrid = rotateGrid(rotatedGrid); // 180 flip
    rotations = 2;
  } else if (direction === 'DOWN') {
    rotatedGrid = rotateGrid(rotatedGrid); // Bottom becomes Left
    rotations = 3;
  }

  let totalScore = 0;
  let hasMoved = false;

  const processedGrid = rotatedGrid.map(row => {
    const { newRow, score } = slideRowLeft(row);
    totalScore += score;
    if (JSON.stringify(newRow) !== JSON.stringify(row)) hasMoved = true;
    return newRow;
  });

  // Restore orientation
  let finalGrid = processedGrid;
  if (rotations === 1) finalGrid = rotateGrid(finalGrid); // Rotate CW 1 to undo CCW 1
  if (rotations === 2) { finalGrid = rotateGrid(finalGrid); finalGrid = rotateGrid(finalGrid); }
  if (rotations === 3) finalGrid = rotateGridCounterClockwise(finalGrid); // Rotate CCW 1 to undo CW 1

  return { grid: finalGrid, score: totalScore, moved: hasMoved };
};

export const checkGameOver = (grid: Grid): boolean => {
  // Check for zeros
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return false;
    }
  }

  // Check for adjacent matches
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const val = grid[r][c];
      if (c < GRID_SIZE - 1 && grid[r][c + 1] === val) return false; // Check right
      if (r < GRID_SIZE - 1 && grid[r + 1][c] === val) return false; // Check down
    }
  }

  return true;
};

// Get max tile value
export const getMaxTile = (grid: Grid): number => {
  let max = 0;
  grid.forEach(row => row.forEach(val => {
    if (val > max) max = val;
  }));
  return max;
};