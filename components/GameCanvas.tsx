
import React, { useRef, useEffect, useCallback } from 'react';
import { GameMode, GameState, Obstacle, MonsterType, ActiveMode, Difficulty } from '../types';
import { SeededRandom, getDailySeed } from '../utils/random';
import { drawBird, drawMonster, drawPillar, drawBackground, drawTrail, drawPortal } from '../utils/drawing';
import { sounds } from '../utils/sounds';
import { ParticleSystem } from '../utils/particles';

interface GameCanvasProps {
  mode: GameMode;
  state: GameState;
  difficulty?: Difficulty;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  startingMode?: ActiveMode;
}

interface BirdEntity {
  x: number;
  y: number;
  vel: number;
  prevVel?: number;
  active: boolean;
  trail: {x: number, y: number, alpha: number, scale: number}[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  mode, 
  state, 
  difficulty = Difficulty.MEDIUM,
  onGameOver, 
  onScoreUpdate, 
  startingMode = ActiveMode.NORMAL 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  const birds = useRef<BirdEntity[]>([]);
  const activeMode = useRef<ActiveMode>(ActiveMode.NORMAL);
  const obstacles = useRef<Obstacle[]>([]);
  const scoredGroups = useRef<Set<string>>(new Set());
  const score = useRef(0);
  const worldOffset = useRef(0);
  const lastSpawn = useRef(0);
  const lastPortalScore = useRef(0);
  const invincibilityFrames = useRef(0);
  const seededRandom = useRef<SeededRandom | null>(null);
  const hasForcedPortalSpawned = useRef(false);
  const particles = useRef<ParticleSystem>(new ParticleSystem());

  // Difficulty configs
  const getDifficultyParams = () => {
    switch (difficulty) {
      case Difficulty.EASY:
        return {
          speed: 1.75,
          speedMult: 1.035,
          gapBase: 215,
          gapShrinkRate: 0.08,
          spawnInterval: 480,
          gravity: 0.25,
          flap: -5.0
        };
      case Difficulty.HARD:
        return {
          speed: 2.8,
          speedMult: 1.065,
          gapBase: 135,
          gapShrinkRate: 0.12,
          spawnInterval: 360,
          gravity: 0.31,
          flap: -5.7
        };
      case Difficulty.MEDIUM:
      default:
        return {
          speed: 2.2,
          speedMult: 1.05,
          gapBase: 170,
          gapShrinkRate: 0.1,
          spawnInterval: 420,
          gravity: 0.28,
          flap: -5.4
        };
    }
  };

  const diffParams = getDifficultyParams();
  const BIRD_RADIUS = 16;

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    activeMode.current = ActiveMode.NORMAL;
    const startX = canvas.width * 0.25;
    const startY = canvas.height / 2;

    birds.current = [{
      x: startX,
      y: startY,
      vel: 0,
      prevVel: 0,
      active: true,
      trail: []
    }];
    
    obstacles.current = [];
    scoredGroups.current = new Set();
    score.current = 0;
    worldOffset.current = 0;
    lastSpawn.current = -diffParams.spawnInterval;
    lastPortalScore.current = 0;
    invincibilityFrames.current = 0;
    hasForcedPortalSpawned.current = false;
    particles.current.clear();
    onScoreUpdate(0);
    sounds.startBackgroundMusic();

    if (mode === GameMode.DAILY) {
      seededRandom.current = new SeededRandom(getDailySeed());
    } else {
      seededRandom.current = null;
    }
  }, [mode, onScoreUpdate, diffParams.spawnInterval]);

  const flap = useCallback((e: React.PointerEvent | PointerEvent) => {
    if (state === GameState.PLAYING) {
      if (e.cancelable) e.preventDefault();
      
      const currentFlap = activeMode.current === ActiveMode.GRAVITY ? -diffParams.flap : diffParams.flap;
      const flapDir = activeMode.current === ActiveMode.GRAVITY ? -1 : 1;
      
      birds.current.forEach(bird => {
        if (bird.active) {
          bird.vel = currentFlap;
          particles.current.emitFlapBurst(bird.x, bird.y, activeMode.current, flapDir);
        }
      });
      sounds.playFlap();
    }
  }, [state, diffParams.flap]);

  useEffect(() => {
    if (state === GameState.PLAYING) {
      initGame();
    }
  }, [state, initGame]);

  const spawnObstacle = (canvasWidth: number, canvasHeight: number) => {
    const rng = seededRandom.current ? seededRandom.current.next() : Math.random();
    let newObstacles: Obstacle[] = [];
    const monsterTypes: MonsterType[] = ['saw', 'gear', 'bloat', 'square'];
    const chosenType = monsterTypes[Math.floor(rng * monsterTypes.length)];
    const groupId = 'grp_' + Math.random().toString(36).substr(2, 9);

    if (startingMode !== ActiveMode.NORMAL && !hasForcedPortalSpawned.current) {
        hasForcedPortalSpawned.current = true;
        newObstacles.push({
            id: 'forced_portal', groupId: 'forced_grp', type: 'portal', portalType: startingMode,
            x: canvasWidth + 100, y: canvasHeight / 2, width: 150, height: 150,
            speedX: 0, speedY: 0, phase: 0, rotation: 0, passed: false
        });
        obstacles.current.push(...newObstacles);
        return;
    }

    const PORTAL_FREQ = mode === GameMode.MASTER ? 5 : 8;
    const currentThresh = Math.floor(score.current / PORTAL_FREQ);
    const lastThresh = Math.floor(lastPortalScore.current / PORTAL_FREQ);
    
    if (currentThresh > lastThresh && score.current > 0) {
      lastPortalScore.current = score.current;
      const savedHighScore = parseInt(localStorage.getItem('shadow_flap_highscore') || '0');
      
      let availableModes: ActiveMode[] = [ActiveMode.NORMAL];
      
      if (mode === GameMode.MASTER) {
          availableModes = [ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.GRAVITY, ActiveMode.NORMAL];
      } else {
          if (savedHighScore >= 1000) availableModes = [ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.GRAVITY, ActiveMode.NORMAL];
          else if (savedHighScore >= 500) availableModes = [ActiveMode.SPLIT, ActiveMode.MIRROR, ActiveMode.NORMAL];
          else if (savedHighScore >= 100) availableModes = [ActiveMode.SPLIT, ActiveMode.NORMAL];
      }

      const filteredModes = availableModes.filter(m => m !== activeMode.current);
      const portalToSpawn = filteredModes.length > 0 
        ? filteredModes[Math.floor(rng * filteredModes.length)] 
        : availableModes[Math.floor(rng * availableModes.length)];

      newObstacles.push({
          id: groupId + '_portal', groupId, type: 'portal', portalType: portalToSpawn,
          x: canvasWidth + 250, y: 150 + (rng * (canvasHeight - 300)), width: 160, height: 160,
          speedX: 0, speedY: 0, phase: 0, rotation: 0, passed: false
      });
      obstacles.current.push(...newObstacles);
      return;
    }

    if (rng < 0.15) {
      newObstacles.push({
        id: groupId, groupId, type: 'monster', monsterType: 'square',
        x: canvasWidth + 200, y: canvasHeight / 2, width: 250, height: 250,
        speedX: 0, speedY: 1, phase: 0, rotation: 0, passed: false
      });
    } else if (rng < 0.3) {
      const gapY = 250 + (rng * (canvasHeight - 500));
      const gapSize = Math.max(90, diffParams.gapBase - (Math.min(score.current, 500) * diffParams.gapShrinkRate));
      newObstacles.push({
        id: groupId + '_t', groupId, type: 'pillar', x: canvasWidth, y: 0, width: 80, height: gapY - gapSize / 2,
        speedX: 0, speedY: 0, phase: 0, rotation: 0, passed: false
      });
      newObstacles.push({
        id: groupId + '_b', groupId, type: 'pillar', x: canvasWidth, y: gapY + gapSize / 2, width: 80, height: canvasHeight - (gapY + gapSize / 2),
        speedX: 0, speedY: 0, phase: 0, rotation: 0, passed: false
      });
    } else if (rng < 0.45) {
      for (let i = 0; i < 4; i++) {
        newObstacles.push({
          id: groupId + i, groupId, type: 'monster', monsterType: chosenType,
          x: canvasWidth + (i * 100), y: 100, width: 80, height: 80,
          speedX: 0, speedY: 0, rotation: 0, passed: false, phase: i * 0.5
        });
        newObstacles.push({
          id: groupId + i + 'b', groupId, type: 'monster', monsterType: chosenType,
          x: canvasWidth + (i * 100), y: canvasHeight - 100, width: 80, height: 80,
          speedX: 0, speedY: 0, rotation: 0, passed: false, phase: i * 0.5
        });
      }
    } else if (rng < 0.6) {
      const centerX = canvasWidth + 200;
      const centerY = 300 + (rng * (canvasHeight - 600));
      for (let i = 0; i < 3; i++) {
        newObstacles.push({
          id: groupId + i, groupId, type: 'monster', monsterType: chosenType,
          x: centerX, y: centerY, width: 70, height: 70,
          speedX: 0, speedY: 0, rotation: 0, passed: false,
          orbitCenter: { x: centerX, y: centerY },
          orbitRadius: 100, orbitAngle: (i / 3) * Math.PI * 2,
          orbitSpeed: 0.05, phase: 0
        });
      }
    } else if (rng < 0.75) {
      newObstacles.push({
        id: groupId, groupId, type: 'spider', monsterType: 'bloat',
        x: canvasWidth + 100, y: 0, width: 90, height: 90,
        speedX: 0, speedY: 2.5, rotation: 0, passed: false, phase: 0
      });
    } else {
      const cx = canvasWidth + 200;
      const cy = canvasHeight / 2;
      for (let i = 0; i < 4; i++) {
        newObstacles.push({
          id: groupId + i, groupId, type: 'monster', monsterType: chosenType,
          x: cx, y: cy, width: 70, height: 70,
          speedX: 0, speedY: 0, rotation: 0, passed: false,
          orbitCenter: { x: cx, y: cy },
          orbitRadius: 180, orbitAngle: (i / 4) * Math.PI * 2,
          orbitSpeed: 0.0005, isPulsing: true, phase: i
        });
      }
    }

    obstacles.current.push(...newObstacles);
  };

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas || state !== GameState.PLAYING) return;

    const currentSpeed = diffParams.speed * Math.pow(diffParams.speedMult, Math.floor(score.current / 5));
    worldOffset.current += currentSpeed;
    if (invincibilityFrames.current > 0) invincibilityFrames.current--;

    // Bird Updates
    const curGravity = activeMode.current === ActiveMode.GRAVITY ? -diffParams.gravity : diffParams.gravity;
    birds.current.forEach(bird => {
      if (!bird.active) return;
      
      const previousVel = bird.vel;
      bird.vel += curGravity;
      bird.y += bird.vel;

      // Check for direction change (apex of flap) for subtle directional particles
      if ((previousVel < 0 && bird.vel >= 0) || (previousVel > 0 && bird.vel <= 0)) {
        particles.current.emitFlapBurst(bird.x, bird.y, activeMode.current, bird.vel > 0 ? 1 : -1);
      }

      const inflation = Math.max(1, 1 - (bird.vel * 0.08));
      bird.trail.unshift({ x: bird.x, y: bird.y, alpha: 0.4, scale: inflation });
      if (bird.trail.length > 15) bird.trail.pop();
      bird.trail.forEach(p => p.alpha -= 0.025);

      // ROOF COLLISION: Tightened boundary
      if (bird.y < 0) {
        particles.current.emitCollisionImpact(bird.x, 10, false);
        if (activeMode.current !== ActiveMode.NORMAL) {
          activeMode.current = ActiveMode.NORMAL;
          bird.y = 50;
          bird.vel = 1;
          invincibilityFrames.current = 100;
          sounds.playHit();
        } else {
          bird.active = false;
        }
      }

      // FLOOR COLLISION
      if (bird.y > canvas.height) {
          particles.current.emitCollisionImpact(bird.x, canvas.height - 10, false);
          if (activeMode.current !== ActiveMode.NORMAL) {
              activeMode.current = ActiveMode.NORMAL;
              bird.y = canvas.height / 2;
              bird.vel = 0;
              invincibilityFrames.current = 100;
              sounds.playHit();
          } else {
              bird.active = false;
          }
      }
    });

    const activeBirds = birds.current.filter(b => b.active);
    if (activeBirds.length === 0) {
      sounds.playHit();
      sounds.stopBackgroundMusic();
      onGameOver(score.current);
      return;
    }

    if (worldOffset.current - lastSpawn.current > diffParams.spawnInterval) {
      spawnObstacle(canvas.width, canvas.height);
      lastSpawn.current = worldOffset.current;
    }

    const leadBird = activeBirds.reduce((prev, curr) => (curr.x > prev.x ? curr : prev), activeBirds[0]);

    obstacles.current.forEach(obs => {
      obs.x -= currentSpeed;
      
      if (obs.orbitCenter) {
        obs.orbitAngle! += obs.orbitSpeed!;
        obs.orbitCenter.x -= currentSpeed;
        const currentRadius = obs.isPulsing ? obs.orbitRadius! + Math.sin(worldOffset.current * 0.01) * 180 : obs.orbitRadius!;
        obs.x = obs.orbitCenter.x + Math.cos(obs.orbitAngle!) * currentRadius;
        obs.y = obs.orbitCenter.y + Math.sin(obs.orbitAngle!) * currentRadius;
        obs.rotation += 0.04;
      } else if (obs.type === 'spider') {
        obs.y = (canvas.height / 2) + Math.sin((worldOffset.current * 0.012)) * (canvas.height * 0.4);
      } else if (obs.groupId.startsWith('grp') && obs.y < 200 && obs.type === 'monster') { 
        obs.y = 80 + Math.sin(worldOffset.current * 0.02 + obs.phase) * 60;
      } else if (obs.groupId.startsWith('grp') && obs.y > canvas.height - 200 && obs.type === 'monster') {
        obs.y = canvas.height - 80 - Math.sin(worldOffset.current * 0.02 + obs.phase) * 60;
      }

      if (!obs.passed && obs.x < leadBird.x) {
        obs.passed = true;
        if (!scoredGroups.current.has(obs.groupId)) {
          scoredGroups.current.add(obs.groupId);
          let multiplier = 1;
          if (activeMode.current === ActiveMode.SPLIT) multiplier = activeBirds.length;
          else if (activeMode.current === ActiveMode.MIRROR) multiplier = 3;
          else if (activeMode.current === ActiveMode.GRAVITY) multiplier = 5;
          score.current += (1 * multiplier);
          onScoreUpdate(score.current);
          sounds.playScore();
          // Trigger celebratory scoring particle explosion
          particles.current.emitScoreExplosion(leadBird.x + 20, leadBird.y, activeMode.current);
        }
      }

      activeBirds.forEach(bird => {
        if (invincibilityFrames.current > 0 && obs.type !== 'portal') return;

        const inflationScale = Math.max(1, 1 - (bird.vel * 0.08));
        const effectiveBirdR = BIRD_RADIUS * inflationScale;
        const dx = bird.x - obs.x;
        const dy = bird.y - obs.y;
        const distSq = dx*dx + dy*dy;

        if (obs.type === 'pillar') {
            if (bird.x + effectiveBirdR > obs.x && bird.x - effectiveBirdR < obs.x + obs.width &&
                bird.y + effectiveBirdR > obs.y && bird.y - effectiveBirdR < obs.y + obs.height) {
                particles.current.emitCollisionImpact(bird.x, bird.y, false);
                handleCollision(bird);
            }
        } else if (obs.type === 'portal') {
            if (Math.sqrt(distSq) < effectiveBirdR + (obs.width / 2)) {
                const prevMode = activeMode.current;
                activeMode.current = obs.portalType!;
                obs.passed = true;
                obs.x = -3000;
                
                let portalColor = 'rgba(255, 255, 255, ';
                if (obs.portalType === ActiveMode.SPLIT) portalColor = 'rgba(59, 130, 246, ';
                else if (obs.portalType === ActiveMode.MIRROR) portalColor = 'rgba(168, 85, 247, ';
                else if (obs.portalType === ActiveMode.GRAVITY) portalColor = 'rgba(249, 115, 22, ';
                
                particles.current.emitCollisionImpact(bird.x, bird.y, true, portalColor);

                if (activeMode.current === ActiveMode.SPLIT && prevMode !== ActiveMode.SPLIT) {
                    const baseBird = birds.current.find(b => b.active) || bird;
                    birds.current = [
                        { ...baseBird, x: baseBird.x, y: baseBird.y - 180, active: true, trail: [] },
                        { ...baseBird, x: baseBird.x + 80, y: baseBird.y, active: true, trail: [] },
                        { ...baseBird, x: baseBird.x, y: baseBird.y + 180, active: true, trail: [] }
                    ];
                } else if (activeMode.current === ActiveMode.NORMAL && birds.current.length > 1) {
                    const mainBird = birds.current.find(b => b.active) || bird;
                    birds.current = [{ ...mainBird, active: true, trail: [] }];
                }
            }
        } else {
            const combinedR = effectiveBirdR + (obs.width / 2) - 10;
            if (distSq < combinedR * combinedR) {
                particles.current.emitCollisionImpact(bird.x, bird.y, false);
                handleCollision(bird);
            }
        }
      });
    });

    // Update dynamic particle engine
    particles.current.update();

    obstacles.current = obstacles.current.filter(obs => obs.x + 1000 > 0);
  };

  const handleCollision = (bird: BirdEntity) => {
      if (activeMode.current === ActiveMode.SPLIT) {
          bird.active = false;
          sounds.playHit();
          const remainingCount = birds.current.filter(b => b.active).length;
          if (remainingCount <= 1) {
              activeMode.current = ActiveMode.NORMAL;
          }
      } else if (activeMode.current === ActiveMode.NORMAL) {
          bird.active = false;
      } else {
          activeMode.current = ActiveMode.NORMAL;
          invincibilityFrames.current = 120;
          sounds.playHit();
          bird.vel = 0;
      }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.save();
    if (activeMode.current === ActiveMode.MIRROR) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }

    drawBackground(ctx, canvas.width, canvas.height, worldOffset.current);
    
    birds.current.forEach(bird => {
      if (bird.active || bird.trail.length > 0) {
        drawTrail(ctx, bird.trail, BIRD_RADIUS, activeMode.current);
      }
    });

    obstacles.current.forEach(obs => {
      if (obs.type === 'pillar') {
        drawPillar(ctx, obs.x, obs.y, obs.width, obs.height, obs.y === 0);
      } else if (obs.type === 'portal') {
        drawPortal(ctx, obs.x, obs.y, obs.width / 2, obs.portalType!);
      } else {
        drawMonster(
            ctx, obs.x, obs.y, obs.width / 2, obs.rotation, 
            birds.current[0].x, birds.current[0].y, obs.monsterType,
            obs.type === 'spider'
        );
      }
    });

    birds.current.forEach(bird => {
      if (bird.active) {
        const opacity = (invincibilityFrames.current > 0 && Math.floor(Date.now() / 100) % 2 === 0) ? 0.3 : 1.0;
        drawBird(ctx, bird.x, bird.y, BIRD_RADIUS, bird.vel, activeMode.current, opacity);
      }
    });

    // Draw active particle effects
    particles.current.draw(ctx);

    ctx.restore();

    requestRef.current = requestAnimationFrame(() => {
        update();
        draw();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (state === GameState.PLAYING) initGame();
    };
    window.addEventListener('resize', resize);
    resize();
    requestRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
      sounds.stopBackgroundMusic();
    };
  }, [state, initGame]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block touch-none cursor-pointer"
      onPointerDown={flap}
    />
  );
};

export default GameCanvas;

