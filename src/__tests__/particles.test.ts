import { describe, it, expect, beforeEach } from 'vitest';
import { ParticleSystem } from '../../utils/particles';
import { ActiveMode } from '../../types';

describe('ParticleSystem', () => {
  let particles: ParticleSystem;

  beforeEach(() => {
    particles = new ParticleSystem();
  });

  it('should initialize with empty particles', () => {
    expect(particles.getCount()).toBe(0);
  });

  it('should emit flap burst particles', () => {
    particles.emitFlapBurst(100, 200, ActiveMode.NORMAL, 1);
    expect(particles.getCount()).toBeGreaterThan(0);
  });

  it('should emit score celebration explosions with multiple shapes', () => {
    particles.emitScoreExplosion(150, 250, ActiveMode.SPLIT);
    expect(particles.getCount()).toBeGreaterThanOrEqual(24);
  });

  it('should emit power-up pickup particles for each powerup type', () => {
    particles.emitPowerUpPickup(100, 100, 'shield');
    const shieldCount = particles.getCount();
    expect(shieldCount).toBeGreaterThan(0);

    particles.clear();
    particles.emitPowerUpPickup(100, 100, 'slowmo');
    expect(particles.getCount()).toBeGreaterThan(0);

    particles.clear();
    particles.emitPowerUpPickup(100, 100, 'star');
    expect(particles.getCount()).toBeGreaterThan(0);
  });

  it('should emit shield shatter shard particles', () => {
    particles.emitShieldShatter(120, 180);
    expect(particles.getCount()).toBe(24);
  });

  it('should decrease particle life and clean up expired particles on update', () => {
    particles.emitFlapBurst(100, 100, ActiveMode.NORMAL, 1);
    const initialCount = particles.getCount();
    expect(initialCount).toBeGreaterThan(0);

    // Update repeatedly past particle lifespans
    for (let i = 0; i < 60; i++) {
      particles.update();
    }

    expect(particles.getCount()).toBeLessThan(initialCount);
  });

  it('should clear all particles when reset', () => {
    particles.emitScoreExplosion(100, 100, ActiveMode.NORMAL);
    expect(particles.getCount()).toBeGreaterThan(0);
    particles.clear();
    expect(particles.getCount()).toBe(0);
  });
});
