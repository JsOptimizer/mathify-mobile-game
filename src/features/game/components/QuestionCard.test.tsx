import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QuestionCard } from '@/src/features/game/components/QuestionCard';
import type { Question } from '@/src/features/game/types';

describe('QuestionCard', () => {
  it('renders the equation text including operands and operator', () => {
    const question: Question = {
      id: 'q1',
      operand_left: 3,
      operator: '+',
      operand_right: 5,
      correct_answer: 8,
      answer_choices: [8, 7, 9, 10],
    };
    render(<QuestionCard question={question} />);
    expect(screen.getByText('3 + 5 = ?')).toBeTruthy();
  });
});
