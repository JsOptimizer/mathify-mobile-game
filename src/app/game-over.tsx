import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useGameStore } from '@/src/features/game/store/gameStore';
import {
  Button,
  GlassCard,
  IconTile,
  ScreenContainer,
  StatCard,
} from '@/src/shared/components';
import { usePrefsStore } from '@/src/shared/store/prefsStore';

export default function GameOver() {
  const { t } = useTranslation();
  const router = useRouter();
  const score = useGameStore((s) => s.score);
  const difficulty = useGameStore((s) => s.difficulty);
  const problemsAnswered = useGameStore((s) => s.problemsAnswered);
  const correctAnswered = useGameStore((s) => s.correctAnswered);
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

  const accuracy = useMemo(
    () =>
      problemsAnswered === 0
        ? 100
        : Math.round((correctAnswered / problemsAnswered) * 100),
    [problemsAnswered, correctAnswered],
  );

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
    <ScreenContainer background="field">
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <IconTile icon="ribbon" size={88} />
            {wasNewBest && (
              <View
                accessibilityRole="text"
                accessibilityLabel={t('gameOver.newBest')}
                style={{
                  backgroundColor: '#22C55E',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                  }}
                >
                  {t('gameOver.newBest')}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 32,
            }}
          >
            <View
              style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#5B7FFF',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              {t('gameOver.sessionFinalized')}
            </Text>
            <View
              style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }}
            />
          </View>

          <Text
            style={{
              fontFamily: 'Inter_900Black_Italic',
              fontSize: 72,
              lineHeight: 76,
              fontStyle: 'italic',
              color: '#FFFFFF',
              marginTop: 16,
            }}
          >
            {t('gameOver.wellDone')}
          </Text>
        </View>

        <View>
          <GlassCard className="p-xl">
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#7B8294',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              {t('gameOver.finalScore')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 8,
                marginTop: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Anton_400Regular',
                  fontSize: 80,
                  lineHeight: 84,
                  color: '#FFFFFF',
                }}
              >
                {score.toLocaleString()}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#5B7FFF',
                  marginBottom: 8,
                }}
              >
                {t('gameOver.pts')}
              </Text>
            </View>
          </GlassCard>

          <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
            <View style={{ flex: 1 }}>
              <StatCard
                icon="locate"
                iconColor="#22C55E"
                caption={t('gameOver.accuracy')}
                value={`${accuracy}%`}
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard
                icon="flash"
                iconColor="#A06BFF"
                caption={t('gameOver.problems')}
                value={String(problemsAnswered)}
              />
            </View>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Button
            variant="gradient"
            label={t('gameOver.playAgain')}
            trailingIcon="refresh"
            onPress={handleReplay}
          />
          <Button variant="ghost" label={t('gameOver.home')} onPress={handleHome} />
        </View>
      </View>
    </ScreenContainer>
  );
}
