import React from 'react';
import { Button } from '@/src/shared/components';

// ---------------------------------------------------------------------------
// Stub — full implementation in Phase 2 (T2.5.2)
// ---------------------------------------------------------------------------

export interface AnswerButtonProps {
  value: number;
  onPress: (value: number) => void;
  disabled?: boolean;
}

/**
 * A large, accessible button that the player taps to submit an answer.
 * Wraps the shared `Button` primitive with game-specific behaviour.
 */
export function AnswerButton({ value, onPress, disabled = false }: AnswerButtonProps) {
  return (
    <Button
      label={String(value)}
      onPress={() => onPress(value)}
      disabled={disabled}
      accessibilityLabel={`Answer ${value}`}
      accessibilityHint="Double-tap to choose this answer"
    />
  );
}

export default AnswerButton;
