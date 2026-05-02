import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/src/shared/components';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { useGameLoop } from '@/src/features/game/hooks/useGameLoop';
import { Timer } from '@/src/features/game/components/Timer';
import { ScoreBadge } from '@/src/features/game/components/ScoreBadge';
import { QuestionCard } from '@/src/features/game/components/QuestionCard';
import { AnswerButton } from '@/src/features/game/components/AnswerButton';

export default function Game() {
  const router = useRouter();
  useGameLoop();

  const gameState = useGameStore((s) => s.gameState);
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const answer = useGameStore((s) => s.answer);

  useEffect(() => {
    if (gameState === 'game_over') {
      router.replace('/game-over');
    }
  }, [gameState, router]);

  return (
    <ScreenContainer>
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <ScoreBadge />
          <Timer />
        </View>
        <View className="flex-1 items-center justify-center">
          {currentQuestion && <QuestionCard question={currentQuestion} />}
        </View>
        <View className="gap-md">
          {currentQuestion?.answer_choices.map((choice) => (
            <AnswerButton key={choice} value={choice} onPress={answer} />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
