jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

import { act, renderHook } from '@testing-library/react-native';
import { useGameLoop } from '@/src/features/game/hooks/useGameLoop';
import { useGameStore } from '@/src/features/game/store/gameStore';

describe('useGameLoop', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useGameStore.getState().reset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not tick when gameState is idle', () => {
    renderHook(() => useGameLoop());
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(useGameStore.getState().timeRemaining).toBe(60);
    expect(useGameStore.getState().gameState).toBe('idle');
  });

  it('ticks once per second when gameState is playing', () => {
    act(() => {
      useGameStore.getState().start('easy');
    });
    renderHook(() => useGameLoop());
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(useGameStore.getState().timeRemaining).toBe(57);
  });

  it('stops ticking when gameState transitions to game_over', () => {
    act(() => {
      useGameStore.getState().start('easy');
    });
    renderHook(() => useGameLoop());
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(useGameStore.getState().gameState).toBe('game_over');
    expect(useGameStore.getState().timeRemaining).toBe(0);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(useGameStore.getState().timeRemaining).toBe(0);
  });

  it('cleans up interval on unmount', () => {
    act(() => {
      useGameStore.getState().start('easy');
    });
    const { unmount } = renderHook(() => useGameLoop());
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    const beforeUnmount = useGameStore.getState().timeRemaining;
    unmount();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(useGameStore.getState().timeRemaining).toBe(beforeUnmount);
  });
});
