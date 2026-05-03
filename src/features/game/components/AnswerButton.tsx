import React from 'react';
import { Pressable, Text } from 'react-native';

export interface AnswerButtonProps {
  value: number;
  onPress: (value: number) => void;
  disabled?: boolean;
}

export function AnswerButton({ value, onPress, disabled = false }: AnswerButtonProps) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Answer ${value}`}
      accessibilityHint="Double-tap to choose this answer"
      accessibilityState={{ disabled }}
      style={{
        flex: 1,
        minHeight: 100,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
      className="active:opacity-80"
    >
      <Text
        className="text-text-primary"
        style={{ fontFamily: 'Anton_400Regular', fontSize: 56, lineHeight: 60 }}
      >
        {value}
      </Text>
    </Pressable>
  );
}

export default AnswerButton;
