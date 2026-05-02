import { create } from 'zustand';
import type { Difficulty, GameState, Question, Feedback } from '@/src/features/game/types';

export interface GameStoreState {
  gameState: GameState;
  score: number;
  timeRemaining: number;
  currentQuestion: Question | null;
  streak: number;
  lastFeedback: Feedback | null;
  difficulty: Difficulty;
}

export interface GameStoreActions {
  start: (difficulty: Difficulty) => void;
  answer: (choice: number) => void;
  tick: () => void;
  reset: () => void;
}

export type GameStore = GameStoreState & GameStoreActions;

const DEFAULT_STATE: GameStoreState = {
  gameState: 'idle',
  score: 0,
  timeRemaining: 60,
  currentQuestion: null,
  streak: 0,
  lastFeedback: null,
  difficulty: 'easy',
};

export const useGameStore = create<GameStore>((set) => ({
  ...DEFAULT_STATE,

  start: (_difficulty: Difficulty) => {
    throw new Error('gameStore.start not yet implemented (Phase 2 T2.3.2)');
  },

  answer: (_choice: number) => {
    throw new Error('gameStore.answer not yet implemented (Phase 2 T2.3.2)');
  },

  tick: () => {
    set((state) => {
      if (state.timeRemaining <= 1) {
        return { timeRemaining: 0, gameState: 'game_over' as GameState };
      }
      return { timeRemaining: state.timeRemaining - 1 };
    });
  },

  reset: () => {
    set(DEFAULT_STATE);
  },
}));
