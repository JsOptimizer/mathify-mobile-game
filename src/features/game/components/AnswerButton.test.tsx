import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AnswerButton } from '@/src/features/game/components/AnswerButton';

describe('AnswerButton', () => {
  it('calls onPress with the numeric value when pressed', () => {
    const onPress = jest.fn();
    render(<AnswerButton value={42} onPress={onPress} />);
    fireEvent.press(screen.getByText('42'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(42);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<AnswerButton value={7} onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('7'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
