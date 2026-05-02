jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

import React from 'react';
import { act, render } from '@testing-library/react-native';
import Game from './game';
import { useGameStore } from '@/src/features/game/store/gameStore';

describe('Game screen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useGameStore.getState().reset();
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing when in playing state with a current question', () => {
    act(() => {
      useGameStore.getState().start('easy');
    });
    expect(() => render(<Game />)).not.toThrow();
  });

  it('navigates to /game-over when gameState becomes game_over', () => {
    act(() => {
      useGameStore.getState().start('easy');
    });
    render(<Game />);
    expect(mockReplace).not.toHaveBeenCalled();
    act(() => {
      useGameStore.setState({ gameState: 'game_over' });
    });
    expect(mockReplace).toHaveBeenCalledWith('/game-over');
  });
});
