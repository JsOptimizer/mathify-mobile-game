import type { Difficulty, Operator } from '@/src/features/game/types';

// ---------------------------------------------------------------------------
// Stub — full implementation in Phase 2 (T2.1.1)
// ---------------------------------------------------------------------------

/**
 * Returns the set of operators available at a given difficulty.
 *
 * easy   → ['+', '-']
 * medium → ['+', '-', '*']
 * hard   → ['+', '-', '*']
 */
export function operatorPool(_difficulty: Difficulty): Operator[] {
  throw new Error('operatorPool not yet implemented (Phase 2 T2.1.1)');
}

/**
 * Returns the inclusive [min, max] range for operands at a given difficulty.
 *
 * easy   → { min: 1, max: 10 }
 * medium → { min: 1, max: 20 }
 * hard   → { min: 1, max: 20 }
 */
export function operandRange(_difficulty: Difficulty): { min: number; max: number } {
  throw new Error('operandRange not yet implemented (Phase 2 T2.1.1)');
}
