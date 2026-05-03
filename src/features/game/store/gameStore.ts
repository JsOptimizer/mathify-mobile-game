import { create } from 'zustand';
import type { Difficulty, GameState, Question, Feedback } from '@/src/features/game/types';
import { generateQuestion } from '@/src/features/game/lib/questionGenerator';
import { applyAnswer } from '@/src/features/game/lib/scoring';

export interface GameStoreState {
  gameState: GameState;
  score: number;
  timeRemaining: number;
  currentQuestion: Question | null;
  streak: number;
  lastFeedback: Feedback | null;
  difficulty: Difficulty;
  problemsAnswered: number;
  correctAnswered: number;
}

export interface GameStoreActions {
  start: (difficulty: Difficulty) => void;
  answer: (choice: number) => void;
  tick: () => void;
  reset: () => void;
}

export type GameStore = GameStoreState & GameStoreActions;

const ROUND_SECONDS = 60;

const DEFAULT_STATE: GameStoreState = {
  gameState: 'idle',
  score: 0,
  timeRemaining: ROUND_SECONDS,
  currentQuestion: null,
  streak: 0,
  lastFeedback: null,
  difficulty: 'easy',
  problemsAnswered: 0,
  correctAnswered: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  ...DEFAULT_STATE,

  start: (difficulty: Difficulty) => {
    set({
      gameState: 'playing',
      score: 0,
      timeRemaining: ROUND_SECONDS,
      streak: 0,
      lastFeedback: null,
      difficulty,
      currentQuestion: generateQuestion(difficulty),
      problemsAnswered: 0,
      correctAnswered: 0,
    });
  },

  answer: (choice: number) => {
    set((state) => {
      if (state.gameState !== 'playing' || state.currentQuestion === null) {
        return {};
      }
      const isCorrect = choice === state.currentQuestion.correct_answer;
      const next = applyAnswer(
        {
          score: state.score,
          streak: state.streak,
          lastFeedback: state.lastFeedback,
          difficulty: state.difficulty,
        },
        choice,
        state.currentQuestion.correct_answer,
      );
      return {
        score: next.score,
        streak: next.streak,
        lastFeedback: next.lastFeedback,
        currentQuestion: generateQuestion(state.difficulty),
        problemsAnswered: state.problemsAnswered + 1,
        correctAnswered: state.correctAnswered + (isCorrect ? 1 : 0),
      };
    });
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
