jest.spyOn(console, 'warn').mockImplementation(() => {});

const mockNotificationAsync = jest.fn();
jest.mock('expo-haptics', () => ({
  notificationAsync: (...args: unknown[]) => mockNotificationAsync(...args),
  NotificationFeedbackType: { Success: 'Success', Error: 'Error' },
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

import { renderHook } from '@testing-library/react-native';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { usePrefsStore, DEFAULT_PREFS } from '@/src/shared/store/prefsStore';

describe('useHaptics', () => {
  beforeEach(() => {
    mockNotificationAsync.mockClear();
    usePrefsStore.setState({ ...DEFAULT_PREFS });
  });

  it('success() fires Haptics.notificationAsync(Success) when haptics_enabled is true', () => {
    const { result } = renderHook(() => useHaptics());
    result.current.success();
    expect(mockNotificationAsync).toHaveBeenCalledTimes(1);
    expect(mockNotificationAsync).toHaveBeenCalledWith('Success');
  });

  it('success() does not fire when haptics_enabled is false', () => {
    usePrefsStore.setState({ haptics_enabled: false });
    const { result } = renderHook(() => useHaptics());
    result.current.success();
    expect(mockNotificationAsync).not.toHaveBeenCalled();
  });

  it('error() fires Haptics.notificationAsync(Error) when haptics_enabled is true', () => {
    const { result } = renderHook(() => useHaptics());
    result.current.error();
    expect(mockNotificationAsync).toHaveBeenCalledTimes(1);
    expect(mockNotificationAsync).toHaveBeenCalledWith('Error');
  });

  it('error() does not fire when haptics_enabled is false', () => {
    usePrefsStore.setState({ haptics_enabled: false });
    const { result } = renderHook(() => useHaptics());
    result.current.error();
    expect(mockNotificationAsync).not.toHaveBeenCalled();
  });
});
