import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import type { Difficulty } from '@/src/features/game/types';
import { useGameStore } from '@/src/features/game/store/gameStore';
import {
  Button,
  GlassCard,
  IconTile,
  ScreenContainer,
  SegmentedControl,
} from '@/src/shared/components';
import { usePrefsStore } from '@/src/shared/store/prefsStore';

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
    <ScreenContainer background="field">
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <View className="flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Menu"
              className="rounded-pill bg-surface border border-border items-center justify-center active:opacity-70"
              style={{ width: 48, height: 48 }}
            >
              <Ionicons name="menu" size={22} color="#5B7FFF" />
            </Pressable>
            <View style={{ width: 140 }}>
              <SegmentedControl
                variant="pill"
                options={languageOptions}
                value={language}
                onChange={setLanguage}
                accessibilityLabel={t('home.language')}
              />
            </View>
          </View>

          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <IconTile icon="calculator-outline" size={88} />
          </View>

          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text
                style={{
                  fontFamily: 'Inter_900Black_Italic',
                  fontSize: 64,
                  lineHeight: 70,
                  fontStyle: 'italic',
                  color: '#FFFFFF',
                }}
              >
                {t('home.title')}
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_900Black_Italic',
                  fontSize: 64,
                  lineHeight: 70,
                  fontStyle: 'italic',
                  color: '#5B7FFF',
                }}
              >
                .
              </Text>
            </View>
            <Text
              style={{
                marginTop: 8,
                color: '#7B8294',
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              {t('home.tagline')}
            </Text>
          </View>
        </View>

        <GlassCard className="p-xl">
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#7B8294',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              {t('home.highScore')}
            </Text>
            <Text
              style={{
                fontFamily: 'Anton_400Regular',
                fontSize: 64,
                lineHeight: 68,
                color: '#FFFFFF',
                marginTop: 8,
              }}
            >
              {bestScore.toLocaleString()}
            </Text>
          </View>
          <View style={{ marginTop: 24 }}>
            <SegmentedControl
              variant="pill"
              options={difficultyOptions}
              value={difficulty}
              onChange={setDifficulty}
              accessibilityLabel={t('difficulty.easy')}
            />
          </View>
        </GlassCard>

        <Button
          variant="gradient"
          label={t('home.playNow')}
          trailingIcon="play"
          onPress={handleStart}
        />
      </View>
    </ScreenContainer>
  );
}
