import { describe, it, expect } from 'vitest';
import { SeededRandom, getDailySeed } from '../../utils/random';

describe('SeededRandom', () => {
  it('should generate deterministic sequences for the same seed', () => {
    const rng1 = new SeededRandom(12345);
    const rng2 = new SeededRandom(12345);

    const values1 = [rng1.next(), rng1.next(), rng1.next(), rng1.next()];
    const values2 = [rng2.next(), rng2.next(), rng2.next(), rng2.next()];

    expect(values1).toEqual(values2);
  });

  it('should generate different sequences for different seeds', () => {
    const rng1 = new SeededRandom(11111);
    const rng2 = new SeededRandom(99999);

    const val1 = rng1.next();
    const val2 = rng2.next();

    expect(val1).not.toEqual(val2);
  });

  it('should generate numbers strictly within the range [0, 1)', () => {
    const rng = new SeededRandom(42);
    for (let i = 0; i < 500; i++) {
      const val = rng.next();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it('should calculate consistent daily seeds based on current date', () => {
    const seed = getDailySeed();
    expect(typeof seed).toBe('number');
    expect(seed).toBeGreaterThan(20200000);
    // Calling immediately again should yield the exact same daily seed
    expect(getDailySeed()).toBe(seed);
  });
});
