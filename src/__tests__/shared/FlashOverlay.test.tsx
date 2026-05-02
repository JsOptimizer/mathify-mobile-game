jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

import React from 'react';
import { act, render } from '@testing-library/react-native';
import { FlashOverlay } from '@/src/shared/components';
import { useGameStore } from '@/src/features/game/store/gameStore';

describe('FlashOverlay', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('renders without crashing in idle state', () => {
    expect(() => render(<FlashOverlay />)).not.toThrow();
  });

  it('re-renders without crashing when lastFeedback transitions correct then wrong', () => {
    render(<FlashOverlay />);
    act(() => {
      useGameStore.setState({ lastFeedback: 'correct' });
    });
    act(() => {
      useGameStore.setState({ lastFeedback: 'wrong' });
    });
  });
});
