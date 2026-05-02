import React from 'react';
import { Text } from 'react-native';
import { useGameStore } from '@/src/features/game/store/gameStore';

export function Timer() {
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const isUrgent = timeRemaining <= 3;

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
