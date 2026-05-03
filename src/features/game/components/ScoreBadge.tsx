import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/src/features/game/store/gameStore';

export function ScoreBadge() {
  const { t } = useTranslation();
  const score = useGameStore((s) => s.score);

  return (
    <View
      className="items-end"
      accessibilityRole="text"
      accessibilityLabel={`Score ${score}`}
    >
      <View className="flex-row items-center gap-xs">
        <Text className="text-caption text-text-muted font-bold uppercase">
          {t('game.score')}
        </Text>
        <Ionicons name="star" size={16} color="#A06BFF" />
      </View>
      <Text
        className="text-h1 text-text-primary"
        style={{ fontFamily: 'Anton_400Regular' }}
      >
        {score.toLocaleString()}
      </Text>
    </View>
  );
}

export default ScoreBadge;
