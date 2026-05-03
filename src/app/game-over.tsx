import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, Button } from '@/src/shared/components';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { usePrefsStore } from '@/src/shared/store/prefsStore';

export default function GameOver() {
  const { t } = useTranslation();
  const router = useRouter();
  const score = useGameStore((s) => s.score);
  const difficulty = useGameStore((s) => s.difficulty);
  const start = useGameStore((s) => s.start);
  const reset = useGameStore((s) => s.reset);
  const recordScore = usePrefsStore((s) => s.recordScore);

  const [wasNewBest, setWasNewBest] = useState(false);
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    const previousBest = usePrefsStore.getState().high_score[difficulty];
    if (score > previousBest) {
      setWasNewBest(true);
    }
    recordScore(difficulty, score);
  }, [difficulty, score, recordScore]);

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
          {wasNewBest && (
            <Text className="text-h2 text-success" accessibilityRole="text">
              {t('gameOver.newBest')}
            </Text>
          )}
        </View>
        <View className="w-full gap-md">
          <Button label={t('gameOver.replay')} onPress={handleReplay} />
          <Button label={t('gameOver.home')} variant="ghost" onPress={handleHome} />
        </View>
      </View>
    </ScreenContainer>
  );
}
