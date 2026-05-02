import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, type } from '@/src/shared/constants/theme';
import type { Question } from '@/src/features/game/types';

// ---------------------------------------------------------------------------
// Stub — full implementation in Phase 2 (T2.5.1)
// ---------------------------------------------------------------------------

export interface QuestionCardProps {
  question: Question;
}

/**
 * Renders the current arithmetic question in large display type.
 * Format: `{operand_left} {operator} {operand_right} = ?`
 */
export function QuestionCard({ question }: QuestionCardProps) {
  const { operand_left, operator, operand_right } = question;

  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.text} adjustsFontSizeToFit numberOfLines={1}>
        {operand_left} {operator} {operand_right} = ?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  text: {
    ...type.display,
    color: colors.text.primary,
    textAlign: 'center',
  },
});

export default QuestionCard;
