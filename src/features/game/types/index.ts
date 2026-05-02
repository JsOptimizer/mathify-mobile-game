export type Difficulty = 'easy' | 'medium' | 'hard';

export type Operator = '+' | '-' | '*';

export type GameState = 'idle' | 'playing' | 'game_over';

export type Feedback = 'correct' | 'wrong';

export interface Question {
  id: string;
  operand_left: number;
  operator: Operator;
  operand_right: number;
  correct_answer: number;
  answer_choices: number[];
}
