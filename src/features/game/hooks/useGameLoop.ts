import { useEffect } from 'react';
import { useGameStore } from '@/src/features/game/store/gameStore';

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
