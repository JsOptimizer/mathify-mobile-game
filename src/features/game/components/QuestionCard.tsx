import React from 'react';
import { Text, View } from 'react-native';
import type { Operator, Question } from '@/src/features/game/types';
import { OperatorBadge } from './OperatorBadge';

export interface QuestionCardProps {
  question: Question;
}

const OPERATOR_LABEL: Record<Operator, string> = {
  '+': 'plus',
  '-': 'minus',
  '*': 'times',
};

export function QuestionCard({ question }: QuestionCardProps) {
  const { operand_left, operator, operand_right } = question;
  const a11yLabel = `${operand_left} ${OPERATOR_LABEL[operator]} ${operand_right}`;

  return (
    <View
      className="flex-row items-center justify-center gap-md py-xl px-md"
      accessibilityRole="text"
      accessibilityLabel={a11yLabel}
    >
      <Text
        className="text-text-primary"
        style={{ fontFamily: 'Anton_400Regular', fontSize: 96, lineHeight: 100 }}
        numberOfLines={1}
      >
        {operand_left}
      </Text>
      <OperatorBadge operator={operator} />
      <Text
        className="text-text-primary"
        style={{ fontFamily: 'Anton_400Regular', fontSize: 96, lineHeight: 100 }}
        numberOfLines={1}
      >
        {operand_right}
      </Text>
    </View>
  );
}

export default QuestionCard;
