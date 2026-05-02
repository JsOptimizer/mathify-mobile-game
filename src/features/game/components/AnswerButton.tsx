import React from 'react';
import { Button } from '@/src/shared/components';

export interface AnswerButtonProps {
  value: number;
  onPress: (value: number) => void;
  disabled?: boolean;
}

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
