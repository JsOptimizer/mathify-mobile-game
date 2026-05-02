import { applyAnswer, pointsFor, type ScoreState } from '@/src/features/game/lib/scoring';
import type { Difficulty } from '@/src/features/game/types';

describe('pointsFor', () => {
  it('returns 1 for easy', () => {
    expect(pointsFor('easy')).toBe(1);
  });

  it('returns 2 for medium', () => {
    expect(pointsFor('medium')).toBe(2);
  });

  it('returns 3 for hard', () => {
    expect(pointsFor('hard')).toBe(3);
  });
});

describe('applyAnswer', () => {
  const baseState = (difficulty: Difficulty): ScoreState => ({
    score: 10,
    streak: 2,
    lastFeedback: null,
    difficulty,
  });

  describe.each<Difficulty>(['easy', 'medium', 'hard'])('correct answer for %s', (difficulty) => {
    it('adds points, increments streak, sets feedback to "correct"', () => {
      const state = baseState(difficulty);
      const next = applyAnswer(state, 7, 7);
      expect(next.score).toBe(state.score + pointsFor(difficulty));
      expect(next.streak).toBe(state.streak + 1);
      expect(next.lastFeedback).toBe('correct');
      expect(next.difficulty).toBe(difficulty);
    });
  });

  it('on wrong answer leaves score, resets streak, sets feedback to "wrong"', () => {
    const state = baseState('medium');
    const next = applyAnswer(state, 5, 7);
    expect(next.score).toBe(state.score);
    expect(next.streak).toBe(0);
    expect(next.lastFeedback).toBe('wrong');
    expect(next.difficulty).toBe('medium');
  });

  it('does not mutate the input state on correct answer', () => {
    const state = Object.freeze<ScoreState>({
      score: 4,
      streak: 1,
      lastFeedback: null,
      difficulty: 'hard',
    });
    const snapshot = JSON.stringify(state);
    const next = applyAnswer(state, 9, 9);
    expect(JSON.stringify(state)).toBe(snapshot);
    expect(next).not.toBe(state);
  });

  it('does not mutate the input state on wrong answer', () => {
    const state = Object.freeze<ScoreState>({
      score: 4,
      streak: 3,
      lastFeedback: 'correct',
      difficulty: 'easy',
    });
    const snapshot = JSON.stringify(state);
    const next = applyAnswer(state, 1, 2);
    expect(JSON.stringify(state)).toBe(snapshot);
    expect(next).not.toBe(state);
  });
});
