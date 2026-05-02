import type { Difficulty, Feedback } from '@/src/features/game/types';

// ---------------------------------------------------------------------------
// Stub — full implementation in Phase 2 (T2.1.3)
// ---------------------------------------------------------------------------

/** Partial slice of gameStore state relevant to scoring. */
export interface ScoreState {
  score: number;
  streak: number;
  lastFeedback: Feedback | null;
  difficulty: Difficulty;
}

/**
 * Returns the points awarded for a correct answer at the given difficulty.
 *
 * easy   → 1
 * medium → 2
 * hard   → 3
 */
export function pointsFor(_difficulty: Difficulty): number {
  throw new Error('pointsFor not yet implemented (Phase 2 T2.1.3)');
}

/**
 * Pure reducer: given the current score state and the player's chosen answer,
 * returns the next score state.
 *
 * Does NOT mutate the input object.
 */
export function applyAnswer(
  _state: ScoreState,
  _choice: number,
  _correctAnswer: number,
): ScoreState {
  throw new Error('applyAnswer not yet implemented (Phase 2 T2.1.3)');
}
