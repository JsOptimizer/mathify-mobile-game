import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { useSound } from '@/src/shared/hooks/useSound';

export function Timer() {
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const gameState = useGameStore((s) => s.gameState);
  const sound = useSound();
  const isUrgent = timeRemaining <= 3;

  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0 && timeRemaining <= 3) {
      sound.playTick();
    }
  }, [timeRemaining, gameState, sound]);

  return (
    <Text
      className={`text-h1 text-center ${isUrgent ? 'text-danger' : 'text-text-primary'}`}
      accessibilityRole="timer"
      accessibilityLabel={`${timeRemaining} seconds remaining`}
    >
      {timeRemaining}s
    </Text>
  );
}

export default Timer;
