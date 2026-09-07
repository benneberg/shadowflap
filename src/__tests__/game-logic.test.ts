import { describe, it, expect } from 'vitest';
import { GameMode, Difficulty, ActiveMode, Obstacle } from '../../types';

describe('Game Mechanics & Scoring Multipliers', () => {
  it('should apply accurate score multipliers per dimension mode', () => {
    const calculateScoreGain = (mode: ActiveMode, birdCount: number = 1): number => {
      if (mode === ActiveMode.SPLIT) return birdCount;
      if (mode === ActiveMode.MIRROR) return 3;
      if (mode === ActiveMode.GRAVITY) return 5;
      return 1;
    };

    expect(calculateScoreGain(ActiveMode.NORMAL)).toBe(1);
    expect(calculateScoreGain(ActiveMode.SPLIT, 3)).toBe(3);
    expect(calculateScoreGain(ActiveMode.SPLIT, 2)).toBe(2);
    expect(calculateScoreGain(ActiveMode.MIRROR)).toBe(3);
    expect(calculateScoreGain(ActiveMode.GRAVITY)).toBe(5);
  });

  it('should calculate difficulty speed scaling exponentially', () => {
    const getSpeed = (baseSpeed: number, speedMult: number, score: number, isSlowMo: boolean = false) => {
      const slowMoFactor = isSlowMo ? 0.55 : 1.0;
      return baseSpeed * Math.pow(speedMult, Math.floor(score / 5)) * slowMoFactor;
    };

    const easyBase = 1.75;
    const easyMult = 1.035;

    const speedAtScore0 = getSpeed(easyBase, easyMult, 0);
    const speedAtScore20 = getSpeed(easyBase, easyMult, 20);
    const speedInSlowMo = getSpeed(easyBase, easyMult, 20, true);

    expect(speedAtScore0).toBe(1.75);
    expect(speedAtScore20).toBeGreaterThan(speedAtScore0);
    expect(speedInSlowMo).toBeCloseTo(speedAtScore20 * 0.55, 3);
  });

  it('should shrink pillar gap sizes progressively with score cap', () => {
    const getGapSize = (baseGap: number, shrinkRate: number, score: number) => {
      return Math.max(90, baseGap - (Math.min(score, 500) * shrinkRate));
    };

    const initialGap = getGapSize(180, 0.1, 0);
    const midGap = getGapSize(180, 0.1, 200);
    const cappedGap = getGapSize(180, 0.1, 1000);

    expect(initialGap).toBe(180);
    expect(midGap).toBe(160);
    expect(cappedGap).toBe(130); // 180 - (500 * 0.1) = 130
  });

  it('should correctly filter available portal modes based on high score', () => {
    const getAvailableModes = (mode: GameMode, highScore: number): ActiveMode[] => {
      if (mode === GameMode.MASTER) {
        return [ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.GRAVITY, ActiveMode.NORMAL];
      }
      if (highScore >= 1000) return [ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.GRAVITY, ActiveMode.NORMAL];
      if (highScore >= 500) return [ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.NORMAL];
      if (highScore >= 100) return [ActiveMode.SPLIT, ActiveMode.NORMAL];
      return [ActiveMode.NORMAL];
    };

    expect(getAvailableModes(GameMode.RANDOM, 50)).toEqual([ActiveMode.NORMAL]);
    expect(getAvailableModes(GameMode.RANDOM, 150)).toEqual([ActiveMode.SPLIT, ActiveMode.NORMAL]);
    expect(getAvailableModes(GameMode.RANDOM, 600)).toEqual([ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.NORMAL]);
    expect(getAvailableModes(GameMode.RANDOM, 1200)).toEqual([ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.GRAVITY, ActiveMode.NORMAL]);
    expect(getAvailableModes(GameMode.MASTER, 0)).toEqual([ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.GRAVITY, ActiveMode.NORMAL]);
  });

  it('should correctly evaluate circular collision detection', () => {
    const checkCircleCollision = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean => {
      const dx = x1 - x2;
      const dy = y1 - y2;
      return (dx * dx + dy * dy) < (r1 + r2) * (r1 + r2);
    };

    // Overlapping
    expect(checkCircleCollision(100, 100, 20, 110, 100, 20)).toBe(true);
    // Touching distance
    expect(checkCircleCollision(100, 100, 20, 140, 100, 20)).toBe(false);
    // Far away
    expect(checkCircleCollision(100, 100, 20, 300, 300, 20)).toBe(false);
  });
});
