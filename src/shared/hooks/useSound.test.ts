jest.spyOn(console, 'warn').mockImplementation(() => {});

const mockPlayers = {
  correct: { seekTo: jest.fn(), play: jest.fn() },
  wrong: { seekTo: jest.fn(), play: jest.fn() },
  tick: { seekTo: jest.fn(), play: jest.fn() },
};
let mockCallIndex = 0;

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => {
    const ordered = [mockPlayers.correct, mockPlayers.wrong, mockPlayers.tick];
    const p = ordered[mockCallIndex % 3];
    mockCallIndex++;
    return p;
  }),
}));

jest.mock('@/src/features/game/audio/correct.mp3', () => 1, { virtual: true });
jest.mock('@/src/features/game/audio/wrong.mp3', () => 2, { virtual: true });
jest.mock('@/src/features/game/audio/tick.mp3', () => 3, { virtual: true });

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

import { renderHook } from '@testing-library/react-native';
import { useSound } from '@/src/shared/hooks/useSound';
import { usePrefsStore, DEFAULT_PREFS } from '@/src/shared/store/prefsStore';

describe('useSound', () => {
  beforeEach(() => {
    mockCallIndex = 0;
    mockPlayers.correct.seekTo.mockClear();
    mockPlayers.correct.play.mockClear();
    mockPlayers.wrong.seekTo.mockClear();
    mockPlayers.wrong.play.mockClear();
    mockPlayers.tick.seekTo.mockClear();
    mockPlayers.tick.play.mockClear();
    usePrefsStore.setState({ ...DEFAULT_PREFS });
  });

  it('playCorrect() calls seekTo(0) then play() on the correct player when sound_enabled is true', () => {
    const { result } = renderHook(() => useSound());
    result.current.playCorrect();
    expect(mockPlayers.correct.seekTo).toHaveBeenCalledTimes(1);
    expect(mockPlayers.correct.seekTo).toHaveBeenCalledWith(0);
    expect(mockPlayers.correct.play).toHaveBeenCalledTimes(1);
    expect(mockPlayers.correct.seekTo.mock.invocationCallOrder[0]).toBeLessThan(
      mockPlayers.correct.play.mock.invocationCallOrder[0],
    );
  });

  it('playCorrect() does not call play when sound_enabled is false', () => {
    usePrefsStore.setState({ sound_enabled: false });
    const { result } = renderHook(() => useSound());
    result.current.playCorrect();
    expect(mockPlayers.correct.seekTo).not.toHaveBeenCalled();
    expect(mockPlayers.correct.play).not.toHaveBeenCalled();
  });

  it('playWrong() calls seekTo(0) and play() on the wrong player when sound_enabled is true', () => {
    const { result } = renderHook(() => useSound());
    result.current.playWrong();
    expect(mockPlayers.wrong.seekTo).toHaveBeenCalledWith(0);
    expect(mockPlayers.wrong.play).toHaveBeenCalledTimes(1);
  });

  it('playWrong() does not call play when sound_enabled is false', () => {
    usePrefsStore.setState({ sound_enabled: false });
    const { result } = renderHook(() => useSound());
    result.current.playWrong();
    expect(mockPlayers.wrong.play).not.toHaveBeenCalled();
  });

  it('playTick() calls seekTo(0) and play() on the tick player when sound_enabled is true', () => {
    const { result } = renderHook(() => useSound());
    result.current.playTick();
    expect(mockPlayers.tick.seekTo).toHaveBeenCalledWith(0);
    expect(mockPlayers.tick.play).toHaveBeenCalledTimes(1);
  });

  it('playTick() does not call play when sound_enabled is false', () => {
    usePrefsStore.setState({ sound_enabled: false });
    const { result } = renderHook(() => useSound());
    result.current.playTick();
    expect(mockPlayers.tick.play).not.toHaveBeenCalled();
  });
});
