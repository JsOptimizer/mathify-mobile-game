import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useGameStore } from '@/src/features/game/store/gameStore';

const PEAK_OPACITY = 0.4;
const FLASH_IN_MS = 60;
const FLASH_OUT_MS = 200;

export function FlashOverlay() {
  const lastFeedback = useGameStore((s) => s.lastFeedback);
  const questionId = useGameStore((s) => s.currentQuestion?.id);

  const greenOpacity = useSharedValue(0);
  const redOpacity = useSharedValue(0);

  const greenStyle = useAnimatedStyle(() => ({ opacity: greenOpacity.value }));
  const redStyle = useAnimatedStyle(() => ({ opacity: redOpacity.value }));

  useEffect(() => {
    if (lastFeedback === 'correct') {
      greenOpacity.value = withSequence(
        withTiming(PEAK_OPACITY, { duration: FLASH_IN_MS }),
        withTiming(0, { duration: FLASH_OUT_MS }),
      );
    } else if (lastFeedback === 'wrong') {
      redOpacity.value = withSequence(
        withTiming(PEAK_OPACITY, { duration: FLASH_IN_MS }),
        withTiming(0, { duration: FLASH_OUT_MS }),
      );
    }
  }, [lastFeedback, questionId, greenOpacity, redOpacity]);

  return (
    <>
      <Animated.View
        pointerEvents="none"
        className="absolute inset-0 bg-success"
        style={greenStyle}
      />
      <Animated.View
        pointerEvents="none"
        className="absolute inset-0 bg-danger"
        style={redStyle}
      />
    </>
  );
}

export default FlashOverlay;
