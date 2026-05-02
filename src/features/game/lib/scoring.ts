import type { Difficulty, Feedback } from '@/src/features/game/types';

export interface ScoreState {
  score: number;
  streak: number;
  lastFeedback: Feedback | null;
  difficulty: Difficulty;
}

const POINTS: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function pointsFor(difficulty: Difficulty): number {
  return POINTS[difficulty];
}

export function applyAnswer(state: ScoreState, choice: number, correctAnswer: number): ScoreState {
  const isCorrect = choice === correctAnswer;
  if (isCorrect) {
    return {
      ...state,
      score: state.score + pointsFor(state.difficulty),
      streak: state.streak + 1,
      lastFeedback: 'correct',
    };
  }
  return {
    ...state,
    streak: 0,
    lastFeedback: 'wrong',
  };
}
