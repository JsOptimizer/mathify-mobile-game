import type { Difficulty, Question } from '@/src/features/game/types';

// ---------------------------------------------------------------------------
// Stub — full implementation in Phase 2 (T2.1.2)
// ---------------------------------------------------------------------------

/**
 * Generates a single arithmetic question for the given difficulty.
 *
 * Guarantees:
 * - `correct_answer` matches the arithmetic result.
 * - `answer_choices` contains `correct_answer` (no duplicates).
 * - All choices are non-negative integers.
 * - `answer_choices.length` is 3 (easy/medium) or 4 (hard).
 * - Choices are shuffled into a random order.
 * - `id` is a UUID v4.
 */
export function generateQuestion(_difficulty: Difficulty): Question {
  throw new Error('generateQuestion not yet implemented (Phase 2 T2.1.2)');
}
