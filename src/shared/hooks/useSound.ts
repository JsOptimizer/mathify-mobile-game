import { useAudioPlayer } from 'expo-audio';
import { usePrefsStore } from '@/src/shared/store/prefsStore';

const correctSrc = require('@/src/features/game/audio/correct.mp3');
const wrongSrc = require('@/src/features/game/audio/wrong.mp3');
const tickSrc = require('@/src/features/game/audio/tick.mp3');

export interface SoundApi {
  playCorrect: () => void;
  playWrong: () => void;
  playTick: () => void;
}

export function useSound(): SoundApi {
  const enabled = usePrefsStore((s) => s.sound_enabled);
  const correct = useAudioPlayer(correctSrc);
  const wrong = useAudioPlayer(wrongSrc);
  const tick = useAudioPlayer(tickSrc);

  return {
    playCorrect: () => {
      if (!enabled) return;
      correct.seekTo(0);
      correct.play();
    },
    playWrong: () => {
      if (!enabled) return;
      wrong.seekTo(0);
      wrong.play();
    },
    playTick: () => {
      if (!enabled) return;
      tick.seekTo(0);
      tick.play();
    },
  };
}
