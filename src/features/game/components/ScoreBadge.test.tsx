jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ScoreBadge } from '@/src/features/game/components/ScoreBadge';
import { useGameStore } from '@/src/features/game/store/gameStore';

describe('ScoreBadge', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('renders the current score from the store', () => {
    useGameStore.setState({ score: 17 });
    render(<ScoreBadge />);
    expect(screen.getByText('17')).toBeTruthy();
  });
});
