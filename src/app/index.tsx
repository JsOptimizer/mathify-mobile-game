import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer, Button, SegmentedControl } from '@/src/shared/components';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { usePrefsStore } from '@/src/shared/store/prefsStore';
import type { Difficulty } from '@/src/features/game/types';

type Language = 'en' | 'fr';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const start = useGameStore((s) => s.start);

  const difficulty = usePrefsStore((s) => s.last_difficulty);
  const setDifficulty = usePrefsStore((s) => s.setDifficulty);
  const language = usePrefsStore((s) => s.language);
  const setLanguage = usePrefsStore((s) => s.setLanguage);
  const bestScore = usePrefsStore((s) => s.high_score[s.last_difficulty]);

  const handleStart = () => {
    start(difficulty);
    router.push('/game');
  };

  const difficultyOptions: { label: string; value: Difficulty }[] = [
    { label: t('difficulty.easy'), value: 'easy' },
    { label: t('difficulty.medium'), value: 'medium' },
    { label: t('difficulty.hard'), value: 'hard' },
  ];

  const languageOptions: { label: string; value: Language }[] = [
    { label: t('languages.en'), value: 'en' },
    { label: t('languages.fr'), value: 'fr' },
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
            options={difficultyOptions}
            value={difficulty}
            onChange={setDifficulty}
            accessibilityLabel={t('difficulty.easy')}
          />
          <Text className="text-caption text-text-muted text-center">
            {t('home.bestScore', { score: bestScore })}
          </Text>
          <SegmentedControl
            options={languageOptions}
            value={language}
            onChange={setLanguage}
            accessibilityLabel={t('home.language')}
          />
          <Button label={t('home.start')} onPress={handleStart} />
        </View>
      </View>
    </ScreenContainer>
  );
}
