import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useGameStore } from '@/src/features/game/store/gameStore';
import { colors, type } from '@/src/shared/constants/theme';

// ---------------------------------------------------------------------------
// Stub — full implementation in Phase 2 (T2.5.3)
// ---------------------------------------------------------------------------

/**
 * Displays the seconds remaining in the current round.
 * Subscribes only to `timeRemaining` to avoid re-rendering the whole screen
 * on every tick.
 */
export function Timer() {
  const timeRemaining = useGameStore((s) => s.timeRemaining);

  return (
    <Text
      style={[styles.text, timeRemaining <= 3 && styles.urgent]}
      accessibilityRole="timer"
      accessibilityLabel={`${timeRemaining} seconds remaining`}
    >
      {timeRemaining}s
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...type.h1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  urgent: {
    color: colors.danger,
  },
});

export default Timer;
