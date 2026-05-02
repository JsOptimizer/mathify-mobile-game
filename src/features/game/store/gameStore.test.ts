jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

import { useGameStore } from '@/src/features/game/store/gameStore';
import { pointsFor } from '@/src/features/game/lib/scoring';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('start(difficulty) puts the store into a playing state with defaults', () => {
    useGameStore.getState().start('medium');
    const s = useGameStore.getState();
    expect(s.gameState).toBe('playing');
    expect(s.score).toBe(0);
    expect(s.timeRemaining).toBe(60);
    expect(s.streak).toBe(0);
    expect(s.lastFeedback).toBeNull();
    expect(s.difficulty).toBe('medium');
    expect(s.currentQuestion).not.toBeNull();
  });

  it('answer(correct) adds points, increments streak, sets feedback, replaces question', () => {
    useGameStore.getState().start('hard');
    const before = useGameStore.getState();
    const prevQuestion = before.currentQuestion!;
    useGameStore.getState().answer(prevQuestion.correct_answer);
    const after = useGameStore.getState();
    expect(after.score).toBe(before.score + pointsFor('hard'));
    expect(after.streak).toBe(before.streak + 1);
    expect(after.lastFeedback).toBe('correct');
    expect(after.currentQuestion).not.toBeNull();
    expect(after.currentQuestion).not.toBe(prevQuestion);
  });

  it('answer(wrong) keeps score, zeros streak, sets feedback to wrong, replaces question', () => {
    useGameStore.getState().start('easy');
    useGameStore.setState({ streak: 3, score: 5 });
    const before = useGameStore.getState();
    const prevQuestion = before.currentQuestion!;
    const wrong = prevQuestion.correct_answer + 999;
    useGameStore.getState().answer(wrong);
    const after = useGameStore.getState();
    expect(after.score).toBe(before.score);
    expect(after.streak).toBe(0);
    expect(after.lastFeedback).toBe('wrong');
    expect(after.currentQuestion).not.toBeNull();
    expect(after.currentQuestion).not.toBe(prevQuestion);
  });

  it('answer(...) is a no-op when gameState is idle', () => {
    const before = useGameStore.getState();
    useGameStore.getState().answer(42);
    const after = useGameStore.getState();
    expect(after.gameState).toBe(before.gameState);
    expect(after.score).toBe(before.score);
    expect(after.streak).toBe(before.streak);
    expect(after.lastFeedback).toBe(before.lastFeedback);
    expect(after.currentQuestion).toBe(before.currentQuestion);
    expect(after.timeRemaining).toBe(before.timeRemaining);
  });

  it('tick() decrements timeRemaining by 1', () => {
    useGameStore.getState().start('easy');
    const before = useGameStore.getState().timeRemaining;
    useGameStore.getState().tick();
    expect(useGameStore.getState().timeRemaining).toBe(before - 1);
  });

  it('tick() from timeRemaining === 1 sets timeRemaining = 0 and gameState = game_over', () => {
    useGameStore.getState().start('easy');
    useGameStore.setState({ timeRemaining: 1 });
    useGameStore.getState().tick();
    const s = useGameStore.getState();
    expect(s.timeRemaining).toBe(0);
    expect(s.gameState).toBe('game_over');
  });

  it('reset() returns to defaults', () => {
    useGameStore.getState().start('hard');
    useGameStore.getState().tick();
    useGameStore.getState().reset();
    const s = useGameStore.getState();
    expect(s.gameState).toBe('idle');
    expect(s.score).toBe(0);
    expect(s.timeRemaining).toBe(60);
    expect(s.streak).toBe(0);
    expect(s.lastFeedback).toBeNull();
    expect(s.currentQuestion).toBeNull();
    expect(s.difficulty).toBe('easy');
  });
});
