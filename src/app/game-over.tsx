import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, Button } from '@/src/shared/components';
import { useGameStore } from '@/src/features/game/store/gameStore';

export default function GameOver() {
  const { t } = useTranslation();
  const router = useRouter();
  const score = useGameStore((s) => s.score);
  const difficulty = useGameStore((s) => s.difficulty);
  const start = useGameStore((s) => s.start);
  const reset = useGameStore((s) => s.reset);

  const handleReplay = () => {
    reset();
    start(difficulty);
    router.replace('/game');
  };

  const handleHome = () => {
    reset();
    router.replace('/');
  };

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center gap-2xl">
        <View className="items-center gap-md">
          <Text className="text-h1 text-text-primary">{t('gameOver.title')}</Text>
          <Text className="text-display text-primary">{score}</Text>
        </View>
        <View className="w-full gap-md">
          <Button label={t('gameOver.replay')} onPress={handleReplay} />
          <Button label={t('gameOver.home')} variant="ghost" onPress={handleHome} />
        </View>
      </View>
    </ScreenContainer>
  );
}
