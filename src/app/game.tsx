import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AnswerButton } from '@/src/features/game/components/AnswerButton';
import { QuestionCard } from '@/src/features/game/components/QuestionCard';
import { ScoreBadge } from '@/src/features/game/components/ScoreBadge';
import { Timer } from '@/src/features/game/components/Timer';
import { useGameLoop } from '@/src/features/game/hooks/useGameLoop';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { FlashOverlay, ScreenContainer } from '@/src/shared/components';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { useSound } from '@/src/shared/hooks/useSound';

export default function Game() {
  const router = useRouter();
  useGameLoop();
  const haptics = useHaptics();
  const sound = useSound();

  const gameState = useGameStore((s) => s.gameState);
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const lastFeedback = useGameStore((s) => s.lastFeedback);
  const answer = useGameStore((s) => s.answer);

  useEffect(() => {
    if (gameState === 'game_over') {
      router.replace('/game-over');
    }
  }, [gameState, router]);

  useEffect(() => {
    if (lastFeedback === 'correct') {
      haptics.success();
      sound.playCorrect();
    } else if (lastFeedback === 'wrong') {
      haptics.error();
      sound.playWrong();
    }
  }, [lastFeedback, currentQuestion?.id, haptics, sound]);

  const choices = currentQuestion?.answer_choices ?? [];
  const rows: number[][] = [];
  for (let i = 0; i < choices.length; i += 2) {
    rows.push(choices.slice(i, i + 2));
  }

  return (
    <ScreenContainer background="field">
      <FlashOverlay />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Timer />
          <ScoreBadge />
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {currentQuestion && <QuestionCard question={currentQuestion} />}
        </View>

        <View style={{ gap: 16 }}>
          {rows.map((row, idx) => (
            <View key={idx} style={{ flexDirection: 'row', gap: 16 }}>
              {row.map((choice) => (
                <AnswerButton key={choice} value={choice} onPress={answer} />
              ))}
              {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
