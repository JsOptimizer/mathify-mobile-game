import React from 'react';
import { View, Text } from 'react-native';
import type { Question } from '@/src/features/game/types';

export interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { operand_left, operator, operand_right } = question;

  return (
    <View className="items-center justify-center py-xl px-md" accessibilityRole="text">
      <Text
        className="text-display text-text-primary text-center"
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {operand_left} {operator} {operand_right} = ?
      </Text>
    </View>
  );
}

export default QuestionCard;
