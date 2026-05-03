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

const mockChangeLanguage = jest.fn();
jest.mock('@/src/shared/config/i18n', () => ({
  __esModule: true,
  default: { changeLanguage: (...args: unknown[]) => mockChangeLanguage(...args) },
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
import Home from '@/src/app/index';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { usePrefsStore, DEFAULT_PREFS } from '@/src/shared/store/prefsStore';

describe('Home screen', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
    usePrefsStore.setState({ ...DEFAULT_PREFS });
    mockPush.mockClear();
    mockReplace.mockClear();
    mockChangeLanguage.mockClear();
  });

  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText(/home\.title/)).toBeTruthy();
  });

  it('tapping Play Now calls store.start and router.push("/game")', () => {
    const startSpy = jest.spyOn(useGameStore.getState(), 'start');
    render(<Home />);
    fireEvent.press(screen.getByText('home.playNow'));
    expect(startSpy).toHaveBeenCalledWith('easy');
    expect(mockPush).toHaveBeenCalledWith('/game');
  });

  it('tapping the FR language option updates prefs.language to "fr"', () => {
    render(<Home />);
    fireEvent.press(screen.getByText('languages.fr'));
    expect(usePrefsStore.getState().language).toBe('fr');
    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
  });

  it('renders the high score for the current difficulty', () => {
    usePrefsStore.setState({
      ...DEFAULT_PREFS,
      last_difficulty: 'easy',
      high_score: { easy: 7, medium: 0, hard: 0 },
    });
    render(<Home />);
    expect(screen.getByText('home.highScore')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
  });
});
