import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { z } from 'zod';
import i18n from '@/src/shared/config/i18n';
import type { Difficulty } from '@/src/features/game/types';
import { safeAsyncStorage } from './safeAsyncStorage';

const PrefsSchema = z.object({
  language: z.enum(['en', 'fr']),
  last_difficulty: z.enum(['easy', 'medium', 'hard']),
  sound_enabled: z.boolean(),
  haptics_enabled: z.boolean(),
  high_score: z.object({
    easy: z.number().int().nonnegative(),
    medium: z.number().int().nonnegative(),
    hard: z.number().int().nonnegative(),
  }),
});

export type Prefs = z.infer<typeof PrefsSchema>;

export const DEFAULT_PREFS: Prefs = {
  language: 'en',
  last_difficulty: 'easy',
  sound_enabled: true,
  haptics_enabled: true,
  high_score: { easy: 0, medium: 0, hard: 0 },
};

export interface PrefsActions {
  setLanguage: (lang: Prefs['language']) => void;
  setDifficulty: (d: Difficulty) => void;
  setSoundEnabled: (b: boolean) => void;
  setHapticsEnabled: (b: boolean) => void;
  recordScore: (d: Difficulty, score: number) => void;
}

export type PrefsStore = Prefs & PrefsActions;

const STORAGE_KEY = 'mathify-prefs';

export const usePrefsStore = create<PrefsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PREFS,

      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },

      setDifficulty: (d) => {
        set({ last_difficulty: d });
      },

      setSoundEnabled: (b) => {
        set({ sound_enabled: b });
      },

      setHapticsEnabled: (b) => {
        set({ haptics_enabled: b });
      },

      recordScore: (d, score) => {
        const current = get().high_score[d];
        if (score > current) {
          set({ high_score: { ...get().high_score, [d]: score } });
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeAsyncStorage),
      merge: (persistedState, currentState) => {
        const parsed = PrefsSchema.safeParse(persistedState);
        if (!parsed.success) {
          if (__DEV__) {
            console.warn('[prefsStore] rehydrate validation failed; falling back to defaults', parsed.error);
          }
          return { ...currentState, ...DEFAULT_PREFS };
        }
        return { ...currentState, ...parsed.data };
      },
    },
  ),
);
