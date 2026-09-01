// Auto-extracted TypeScript type definitions
// Generated: 2026-08-27 18:26 UTC
// Types annotated with 'used in:' show cross-file import relationships.


// -- types.ts --
export enum GameMode {
  RANDOM = 'RANDOM',
  DAILY = 'DAILY',
  MASTER = 'MASTER'
}
// used in: App.tsx, components/GameCanvas.tsx

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}
// used in: App.tsx, components/GameCanvas.tsx

export enum ActiveMode {
  NORMAL = 'NORMAL',
  SPLIT = 'SPLIT',
  MIRROR = 'MIRROR',
  GRAVITY = 'GRAVITY'
}
// used in: App.tsx, components/GameCanvas.tsx, utils/drawing.ts

export interface Point {
  x: number;
  y: number;
}

export type MonsterType = 'saw' | 'gear' | 'bloat' | 'square';
// used in: components/GameCanvas.tsx

export interface Obstacle {
  id: string;
  groupId: string;
  type: 'pillar' | 'monster' | 'spider' | 'portal';
  portalType?: ActiveMode;
  monsterType?: MonsterType;
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  phase: number;
  rotation: number;
  passed: boolean;
  orbitCenter?: Point;
  orbitRadius?: number;
  orbitAngle?: number;
  orbitSpeed?: number;
  isPulsing?: boolean;
}
// used in: components/GameCanvas.tsx

export interface GameSettings {
  gravity: number;
  flapStrength: number;
  speed: number;
  gapSize: number;
}
