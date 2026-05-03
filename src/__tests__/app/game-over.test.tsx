jest.spyOn(console, 'warn').mockImplementation(() => {});

jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, vars?: Record<string, unknown>) =>
      vars ? `${k} ${JSON.stringify(vars)}` : k,
  }),
}));

jest.mock('@/src/shared/config/i18n', () => ({
  __esModule: true,
  default: { changeLanguage: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        for (const k of Object.keys(store)) delete store[k];
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
      multiGet: jest.fn((keys: string[]) =>
        Promise.resolve(keys.map((k) => [k, store[k] ?? null])),
      ),
      multiSet: jest.fn((pairs: [string, string][]) => {
        for (const [k, v] of pairs) store[k] = v;
        return Promise.resolve();
      }),
      multiRemove: jest.fn((keys: string[]) => {
        for (const k of keys) delete store[k];
        return Promise.resolve();
      }),
    },
  };
});

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import GameOver from '@/src/app/game-over';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { usePrefsStore, DEFAULT_PREFS } from '@/src/shared/store/prefsStore';

describe('GameOver screen', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
    usePrefsStore.setState({ ...DEFAULT_PREFS });
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('renders the final score', () => {
    useGameStore.setState({ score: 42, difficulty: 'medium' });
    render(<GameOver />);
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('tapping Play Again resets, starts with current difficulty, and navigates to /game', () => {
    useGameStore.setState({ score: 10, difficulty: 'hard' });
    const resetSpy = jest.spyOn(useGameStore.getState(), 'reset');
    const startSpy = jest.spyOn(useGameStore.getState(), 'start');
    render(<GameOver />);
    fireEvent.press(screen.getByText('gameOver.playAgain'));
    expect(resetSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalledWith('hard');
    expect(mockReplace).toHaveBeenCalledWith('/game');
  });

  it('renders the newBest badge when score beats the previous high score', () => {
    usePrefsStore.setState({
      ...DEFAULT_PREFS,
      high_score: { easy: 5, medium: 0, hard: 0 },
    });
    useGameStore.setState({ score: 10, difficulty: 'easy' });
    render(<GameOver />);
    expect(screen.getByText('gameOver.newBest')).toBeTruthy();
  });

  it('does not render the newBest badge when score does not beat the previous high score', () => {
    usePrefsStore.setState({
      ...DEFAULT_PREFS,
      high_score: { easy: 20, medium: 0, hard: 0 },
    });
    useGameStore.setState({ score: 10, difficulty: 'easy' });
    render(<GameOver />);
    expect(screen.queryByText('gameOver.newBest')).toBeNull();
  });

  it('calls recordScore(difficulty, score) on mount', () => {
    useGameStore.setState({ score: 13, difficulty: 'medium' });
    const recordSpy = jest.spyOn(usePrefsStore.getState(), 'recordScore');
    render(<GameOver />);
    expect(recordSpy).toHaveBeenCalledWith('medium', 13);
  });
});
