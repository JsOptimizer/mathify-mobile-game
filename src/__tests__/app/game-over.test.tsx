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
import { render, fireEvent, screen } from '@testing-library/react-native';
import GameOver from '@/src/app/game-over';
import { useGameStore } from '@/src/features/game/store/gameStore';

describe('GameOver screen', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('renders the final score', () => {
    useGameStore.setState({ score: 42, difficulty: 'medium' });
    render(<GameOver />);
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('tapping Replay resets, starts with current difficulty, and navigates to /game', () => {
    useGameStore.setState({ score: 10, difficulty: 'hard' });
    const resetSpy = jest.spyOn(useGameStore.getState(), 'reset');
    const startSpy = jest.spyOn(useGameStore.getState(), 'start');
    render(<GameOver />);
    fireEvent.press(screen.getByText('gameOver.replay'));
    expect(resetSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalledWith('hard');
    expect(mockReplace).toHaveBeenCalledWith('/game');
  });
});
