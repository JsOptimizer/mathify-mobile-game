import AsyncStorage from '@react-native-async-storage/async-storage';

const memory = new Map<string, string>();
let nativeAvailable = true;
let warned = false;

function fallbackOnce(reason: unknown) {
  if (nativeAvailable) {
    nativeAvailable = false;
    if (__DEV__ && !warned) {
      warned = true;
      console.warn(
        '[prefsStore] AsyncStorage native module is unavailable in this runtime. ' +
          'Falling back to in-memory storage — preferences will not persist across app restarts. ' +
          'Rebuild the dev client (expo run:ios / expo run:android) to enable persistence.',
        reason,
      );
    }
  }
}

export const safeAsyncStorage = {
  async getItem(key: string): Promise<string | null> {
    if (!nativeAvailable) return memory.get(key) ?? null;
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      fallbackOnce(e);
      return memory.get(key) ?? null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    if (!nativeAvailable) {
      memory.set(key, value);
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      fallbackOnce(e);
      memory.set(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (!nativeAvailable) {
      memory.delete(key);
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      fallbackOnce(e);
      memory.delete(key);
    }
  },
};
