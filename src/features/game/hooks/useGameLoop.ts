import { useEffect } from 'react';
import { useGameStore } from '@/src/features/game/store/gameStore';

// ---------------------------------------------------------------------------
// Stub — full implementation in Phase 2 (T2.4.1)
// ---------------------------------------------------------------------------

/**
 * Drives the game timer while `gameState === 'playing'`.
 *
 * - Starts a 1-second interval that calls `tick()`.
 * - Clears the interval when `gameState` is no longer `'playing'`.
 * - Clears the interval on unmount.
 *
 * Mount this hook once at the top of the game screen.
 */
export function useGameLoop(): void {
  const gameState = useGameStore((s) => s.gameState);
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, tick]);
}
