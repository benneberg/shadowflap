
export enum GameMode {
  RANDOM = 'RANDOM',
  DAILY = 'DAILY',
  MASTER = 'MASTER'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

export enum ActiveMode {
  NORMAL = 'NORMAL',
  SPLIT = 'SPLIT',
  MIRROR = 'MIRROR',
  GRAVITY = 'GRAVITY'
}

export interface Point {
  x: number;
  y: number;
}

export type MonsterType = 'saw' | 'gear' | 'bloat' | 'square';

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

export interface GameSettings {
  gravity: number;
  flapStrength: number;
  speed: number;
  gapSize: number;
}
