import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { Difficulty, Operator, Question } from '@/src/features/game/types';
import { operandRange, operatorPool } from '@/src/features/game/lib/difficulty';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOperator(pool: Operator[]): Operator {
  return pool[randInt(0, pool.length - 1)]!;
}

function compute(left: number, op: Operator, right: number): number {
  switch (op) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
  }
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function generateDistractors(correct: number, count: number): number[] {
  const distractors = new Set<number>();
  const offsets = [-3, -2, -1, 1, 2, 3, 4, 5, -4, -5, 6, -6, 7, -7, 10, -10];
  for (const offset of offsets) {
    if (distractors.size >= count) break;
    const candidate = correct + offset;
    if (candidate >= 0 && candidate !== correct) {
      distractors.add(candidate);
    }
  }
  let probe = correct + offsets.length + 1;
  while (distractors.size < count) {
    if (probe !== correct && probe >= 0) distractors.add(probe);
    probe++;
  }
  return Array.from(distractors);
}

export function generateQuestion(difficulty: Difficulty): Question {
  const operator = pickOperator(operatorPool(difficulty));
  const { min, max } = operandRange(difficulty);

  let left = randInt(min, max);
  let right = randInt(min, max);

  if (operator === '-' && left < right) {
    [left, right] = [right, left];
  }

  const correct = compute(left, operator, right);
  const choiceCount = difficulty === 'hard' ? 4 : 3;
  const distractors = generateDistractors(correct, choiceCount - 1);
  const choices = shuffle([correct, ...distractors]);

  return {
    id: uuidv4(),
    operand_left: left,
    operator,
    operand_right: right,
    correct_answer: correct,
    answer_choices: choices,
  };
}
