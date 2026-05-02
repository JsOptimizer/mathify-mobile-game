import React from 'react';
import { View, Text } from 'react-native';
import { useGameStore } from '@/src/features/game/store/gameStore';

export function ScoreBadge() {
  const score = useGameStore((s) => s.score);

  return (
    <View
      className="bg-primary rounded-pill px-md py-xs self-start"
      accessibilityRole="text"
      accessibilityLabel={`Score ${score}`}
    >
      <Text className="text-h2 text-white">{score}</Text>
    </View>
  );
}

export default ScoreBadge;
