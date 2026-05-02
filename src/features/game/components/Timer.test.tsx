jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

import React from 'react';
import { act, render, screen } from '@testing-library/react-native';
import { Timer } from '@/src/features/game/components/Timer';
import { useGameStore } from '@/src/features/game/store/gameStore';

describe('Timer', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('renders timeRemaining from the store with an "s" suffix', () => {
    useGameStore.setState({ timeRemaining: 42 });
    render(<Timer />);
    expect(screen.getByText('42s')).toBeTruthy();
  });

  it('applies the danger color class when timeRemaining <= 3 (urgent)', () => {
    useGameStore.setState({ timeRemaining: 2 });
    render(<Timer />);
    const urgent = screen.getByText('2s');
    expect(urgent.props.className).toContain('text-danger');

    act(() => {
      useGameStore.setState({ timeRemaining: 30 });
    });
    render(<Timer />);
    const calm = screen.getByText('30s');
    expect(calm.props.className).not.toContain('text-danger');
    expect(calm.props.className).toContain('text-text-primary');
  });
});
