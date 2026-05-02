import type { Difficulty, Operator } from '@/src/features/game/types';

const POOLS: Record<Difficulty, Operator[]> = {
  easy: ['+'],
  medium: ['+', '-'],
  hard: ['+', '-', '*'],
};

const RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 1, max: 10 },
  medium: { min: 1, max: 20 },
  hard: { min: 1, max: 20 },
};

export function operatorPool(difficulty: Difficulty): Operator[] {
  return POOLS[difficulty];
}

export function operandRange(difficulty: Difficulty): { min: number; max: number } {
  return RANGES[difficulty];
}
