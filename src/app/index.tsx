import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, Button, SegmentedControl } from '@/src/shared/components';
import { useGameStore } from '@/src/features/game/store/gameStore';
import type { Difficulty } from '@/src/features/game/types';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const start = useGameStore((s) => s.start);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleStart = () => {
    start(difficulty);
    router.push('/game');
  };

  const options: { label: string; value: Difficulty }[] = [
    { label: t('difficulty.easy'), value: 'easy' },
    { label: t('difficulty.medium'), value: 'medium' },
    { label: t('difficulty.hard'), value: 'hard' },
  ];

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center gap-2xl">
        <View className="items-center gap-sm">
          <Text className="text-display text-text-primary text-center">{t('home.title')}</Text>
          <Text className="text-body text-text-muted text-center">{t('home.subtitle')}</Text>
        </View>
        <View className="w-full gap-md">
          <SegmentedControl
            options={options}
            value={difficulty}
            onChange={setDifficulty}
            accessibilityLabel={t('difficulty.easy')}
          />
          <Button label={t('home.start')} onPress={handleStart} />
        </View>
      </View>
    </ScreenContainer>
  );
}
