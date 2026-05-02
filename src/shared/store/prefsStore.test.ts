jest.spyOn(console, 'warn').mockImplementation(() => {});

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

import { usePrefsStore, DEFAULT_PREFS } from '@/src/shared/store/prefsStore';

describe('usePrefsStore', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    usePrefsStore.setState({ ...DEFAULT_PREFS });
  });

  it('has correct defaults on a fresh store', () => {
    const s = usePrefsStore.getState();
    expect(s.language).toBe('en');
    expect(s.last_difficulty).toBe('easy');
    expect(s.sound_enabled).toBe(true);
    expect(s.haptics_enabled).toBe(true);
    expect(s.high_score).toEqual({ easy: 0, medium: 0, hard: 0 });
  });

  it('setLanguage("fr") updates state and calls i18n.changeLanguage', () => {
    usePrefsStore.getState().setLanguage('fr');
    expect(usePrefsStore.getState().language).toBe('fr');
    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
  });

  it('setDifficulty("hard") updates last_difficulty', () => {
    usePrefsStore.getState().setDifficulty('hard');
    expect(usePrefsStore.getState().last_difficulty).toBe('hard');
  });

  it('setSoundEnabled(false) updates sound_enabled', () => {
    usePrefsStore.getState().setSoundEnabled(false);
    expect(usePrefsStore.getState().sound_enabled).toBe(false);
  });

  it('setHapticsEnabled(false) updates haptics_enabled', () => {
    usePrefsStore.getState().setHapticsEnabled(false);
    expect(usePrefsStore.getState().haptics_enabled).toBe(false);
  });

  it('recordScore("medium", 10) on a fresh store sets the high score to 10', () => {
    usePrefsStore.getState().recordScore('medium', 10);
    expect(usePrefsStore.getState().high_score.medium).toBe(10);
  });

  it('recordScore does not lower an existing high score', () => {
    usePrefsStore.getState().recordScore('medium', 10);
    usePrefsStore.getState().recordScore('medium', 5);
    expect(usePrefsStore.getState().high_score.medium).toBe(10);
  });

  it('recordScore updates when the new score is higher', () => {
    usePrefsStore.getState().recordScore('medium', 10);
    usePrefsStore.getState().recordScore('medium', 15);
    expect(usePrefsStore.getState().high_score.medium).toBe(15);
  });

  it('recordScore only touches the requested difficulty', () => {
    usePrefsStore.getState().recordScore('medium', 10);
    const s = usePrefsStore.getState();
    expect(s.high_score.easy).toBe(0);
    expect(s.high_score.hard).toBe(0);
    expect(s.high_score.medium).toBe(10);
  });
});
