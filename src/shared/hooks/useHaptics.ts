import * as Haptics from 'expo-haptics';
import { usePrefsStore } from '@/src/shared/store/prefsStore';

export interface HapticsApi {
  success: () => void;
  error: () => void;
}

export function useHaptics(): HapticsApi {
  const enabled = usePrefsStore((s) => s.haptics_enabled);

  return {
    success: () => {
      if (!enabled) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    error: () => {
      if (!enabled) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  };
}
