import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { colors, radii, spacing, type } from '@/src/shared/constants/theme';

// ---------------------------------------------------------------------------
// Stub — full implementation in Phase 2 (T2.5.4)
// ---------------------------------------------------------------------------

/**
 * Displays the current in-game score.
 * Subscribes only to `score` to minimise re-renders.
 */
export function ScoreBadge() {
  const score = useGameStore((s) => s.score);

  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={`Score ${score}`}>
      <Text style={styles.text}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    ...type.h2,
    color: '#FFFFFF',
  },
});

export default ScoreBadge;
