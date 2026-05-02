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
import Home from './index';
import { useGameStore } from '@/src/features/game/store/gameStore';

describe('Home screen', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText('home.title')).toBeTruthy();
  });

  it('tapping Start calls store.start and router.push("/game")', () => {
    const startSpy = jest.spyOn(useGameStore.getState(), 'start');
    render(<Home />);
    fireEvent.press(screen.getByText('home.start'));
    expect(startSpy).toHaveBeenCalledWith('easy');
    expect(mockPush).toHaveBeenCalledWith('/game');
  });
});
