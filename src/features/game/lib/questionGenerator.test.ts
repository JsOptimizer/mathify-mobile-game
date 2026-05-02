jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

import { generateQuestion } from '@/src/features/game/lib/questionGenerator';
import type { Difficulty, Operator } from '@/src/features/game/types';

function compute(left: number, op: Operator, right: number): number {
  switch (op) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
  }
}

const SAMPLES = 100;
const cases: { difficulty: Difficulty; expectedChoiceCount: number }[] = [
  { difficulty: 'easy', expectedChoiceCount: 3 },
  { difficulty: 'medium', expectedChoiceCount: 3 },
  { difficulty: 'hard', expectedChoiceCount: 4 },
];

describe.each(cases)('generateQuestion($difficulty)', ({ difficulty, expectedChoiceCount }) => {
  it(`produces ${SAMPLES} valid questions`, () => {
    for (let i = 0; i < SAMPLES; i++) {
      const q = generateQuestion(difficulty);

      expect(q.correct_answer).toBe(compute(q.operand_left, q.operator, q.operand_right));

      expect(q.answer_choices).toHaveLength(expectedChoiceCount);

      expect(q.answer_choices).toContain(q.correct_answer);

      expect(new Set(q.answer_choices).size).toBe(q.answer_choices.length);

      for (const choice of q.answer_choices) {
        expect(Number.isInteger(choice)).toBe(true);
        expect(choice).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
