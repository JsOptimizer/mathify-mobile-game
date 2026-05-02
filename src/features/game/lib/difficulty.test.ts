import { operandRange, operatorPool } from '@/src/features/game/lib/difficulty';

describe('operatorPool', () => {
  it('returns ["+"] for easy', () => {
    expect(operatorPool('easy')).toEqual(['+']);
  });

  it('returns ["+", "-"] for medium', () => {
    expect(operatorPool('medium')).toEqual(['+', '-']);
  });

  it('returns ["+", "-", "*"] for hard', () => {
    expect(operatorPool('hard')).toEqual(['+', '-', '*']);
  });
});

describe('operandRange', () => {
  it('returns {min:1, max:10} for easy', () => {
    expect(operandRange('easy')).toEqual({ min: 1, max: 10 });
  });

  it('returns {min:1, max:20} for medium', () => {
    expect(operandRange('medium')).toEqual({ min: 1, max: 20 });
  });

  it('returns {min:1, max:20} for hard', () => {
    expect(operandRange('hard')).toEqual({ min: 1, max: 20 });
  });
});
