import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { useSound } from '@/src/shared/hooks/useSound';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function Timer() {
  const { t } = useTranslation();
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const gameState = useGameStore((s) => s.gameState);
  const sound = useSound();
  const isUrgent = timeRemaining <= 3;
  const formatted = formatTime(timeRemaining);

  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0 && timeRemaining <= 3) {
      sound.playTick();
    }
  }, [timeRemaining, gameState, sound]);

  return (
    <View
      accessibilityRole="timer"
      accessibilityLabel={`${timeRemaining} seconds remaining`}
    >
      <View className="flex-row items-center gap-xs">
        <Ionicons name="time-outline" size={16} color="#5B7FFF" />
        <Text className="text-caption text-text-muted font-bold uppercase">
          {t('game.time')}
        </Text>
      </View>
      <Text
        className={`text-h1 ${isUrgent ? 'text-danger' : 'text-text-primary'}`}
        style={{ fontFamily: 'Anton_400Regular' }}
      >
        {formatted}
      </Text>
    </View>
  );
}

export default Timer;
