export type WordDirection = 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';

export type Position = {
  row: number;
  col: number;
};

export type WordPlacement = {
  word: string;
  positions: Position[];
  direction: WordDirection;
  found: boolean;
  color?: string; 
  category?: string; 
};

export type GameState = {
  grid: string[][];
  words: WordPlacement[];
  size: number;
  startPosition: Position | null;
  currentPosition: Position | null;
  selectedPositions: Position[];
  loading: boolean;
};

export type DifficultyLevel = {
  level: number;
  name: string;
  gridSize: number;
  wordCount: number;
  allowBackwards: boolean;
  description: string;
};

export const NEWS_CATEGORIES = [
  'headlines',
  'sports',
  'technology',
  'entertainment',
  'business',
  'health',
  'science',
  'politics',
  'environment'
];