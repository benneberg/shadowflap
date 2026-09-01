import { ActiveMode } from '../types';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  maxLife: number;
  life: number;
  shape: 'circle' | 'spark' | 'ring' | 'shard' | 'star';
  rotation?: number;
  rotSpeed?: number;
  drag?: number;
  gravity?: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  public clear() {
    this.particles = [];
  }

  public emitFlapBurst(x: number, y: number, mode: ActiveMode, flapDir: number = 1) {
    let color = 'rgba(255, 255, 255, ';
    if (mode === ActiveMode.SPLIT) color = 'rgba(59, 130, 246, ';
    else if (mode === ActiveMode.MIRROR) color = 'rgba(168, 85, 247, ';
    else if (mode === ActiveMode.GRAVITY) color = 'rgba(249, 115, 22, ';

    // Downward/Upward burst puffs and sparks
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 2) * flapDir + (Math.random() - 0.5) * 1.6;
      const speed = 1.5 + Math.random() * 3.5;
      const life = 14 + Math.floor(Math.random() * 12);
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed - 1.2, // slight leftward drift from world movement
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3.5,
        alpha: 0.9,
        color,
        maxLife: life,
        life,
        shape: Math.random() > 0.4 ? 'circle' : 'spark',
        drag: 0.93,
        gravity: 0.05 * flapDir
      });
    }

    // Expanding shock ring
    this.particles.push({
      x,
      y,
      vx: -1.0,
      vy: 0,
      size: 6,
      alpha: 0.75,
      color,
      maxLife: 15,
      life: 15,
      shape: 'ring',
      drag: 0.95
    });
  }

  public emitScoreExplosion(x: number, y: number, mode: ActiveMode) {
    let baseColor = 'rgba(255, 215, 0, '; // Golden default
    if (mode === ActiveMode.SPLIT) baseColor = 'rgba(96, 165, 250, ';
    else if (mode === ActiveMode.MIRROR) baseColor = 'rgba(192, 132, 252, ';
    else if (mode === ActiveMode.GRAVITY) baseColor = 'rgba(251, 146, 60, ';

    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 2.0 + Math.random() * 5.0;
      const life = 22 + Math.floor(Math.random() * 16);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3.5,
        alpha: 1.0,
        color: Math.random() > 0.3 ? baseColor : 'rgba(255, 255, 255, ',
        maxLife: life,
        life,
        shape: i % 3 === 0 ? 'star' : i % 2 === 0 ? 'spark' : 'circle',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        drag: 0.92,
        gravity: 0.04
      });
    }

    // Double expanding celebratory rings
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 10,
      alpha: 0.9,
      color: baseColor,
      maxLife: 20,
      life: 20,
      shape: 'ring'
    });
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 4,
      alpha: 0.7,
      color: 'rgba(255, 255, 255, ',
      maxLife: 28,
      life: 28,
      shape: 'ring'
    });
  }

  public emitCollisionImpact(x: number, y: number, isPortal: boolean = false, portalColor?: string) {
    if (isPortal) {
      // Portal entry vortex burst
      const color = portalColor || 'rgba(168, 85, 247, ';
      const count = 28;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 3.0 + Math.random() * 4.0;
        const life = 25 + Math.floor(Math.random() * 15);
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 4,
          alpha: 1.0,
          color,
          maxLife: life,
          life,
          shape: 'spark',
          rotation: angle,
          rotSpeed: 0.15,
          drag: 0.91
        });
      }
      this.particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: 12,
        alpha: 1.0,
        color,
        maxLife: 24,
        life: 24,
        shape: 'ring'
      });
      return;
    }

    // Hazard collision impact (red & dark shards + flash sparks)
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 6.5;
      const life = 18 + Math.floor(Math.random() * 18);
      const isRed = Math.random() > 0.4;
      const color = isRed ? 'rgba(239, 68, 68, ' : 'rgba(255, 255, 255, ';
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        alpha: 1.0,
        color,
        maxLife: life,
        life,
        shape: Math.random() > 0.5 ? 'shard' : 'spark',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.35,
        drag: 0.92,
        gravity: 0.1
      });
    }

    // Impact flash ring
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 15,
      alpha: 1.0,
      color: 'rgba(239, 68, 68, ',
      maxLife: 18,
      life: 18,
      shape: 'ring'
    });
  }

  public update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.drag) {
        p.vx *= p.drag;
        p.vy *= p.drag;
      }
      if (p.gravity) {
        p.vy += p.gravity;
      }
      p.x += p.vx;
      p.y += p.vy;

      if (p.rotation !== undefined && p.rotSpeed !== undefined) {
        p.rotation += p.rotSpeed;
      }

      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.shape === 'ring') {
        p.size += 2.2;
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.particles.length === 0) return;

    ctx.save();
    for (const p of this.particles) {
      if (p.alpha <= 0.01) continue;

      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.rotation) ctx.rotate(p.rotation);

      if (p.shape === 'ring') {
        ctx.strokeStyle = `${p.color}${p.alpha})`;
        ctx.lineWidth = Math.max(1, 2.5 * p.alpha);
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === 'star') {
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        const spikes = 4;
        const outer = p.size;
        const inner = p.size * 0.4;
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outer : inner;
          const a = (i / (spikes * 2)) * Math.PI * 2;
          const sx = Math.cos(a) * r;
          const sy = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'shard') {
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.moveTo(-p.size, -p.size * 0.5);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(-p.size * 0.5, p.size);
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'spark') {
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      } else {
        // Circle
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }
}
