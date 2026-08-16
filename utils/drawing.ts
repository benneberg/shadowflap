
import { ActiveMode } from '../types';

export const drawBird = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  velocity: number, 
  mode: ActiveMode = ActiveMode.NORMAL,
  opacity: number = 1
) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  
  const inflation = Math.max(1, 1 - (velocity * 0.08));
  ctx.scale(inflation, inflation);
  
  ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, velocity * 0.1)));

  // Body - Color change based on mode
  let bodyColor = '#000000';
  if (mode === ActiveMode.SPLIT) bodyColor = '#3b82f6';
  if (mode === ActiveMode.MIRROR) bodyColor = '#a855f7';
  if (mode === ActiveMode.GRAVITY) bodyColor = '#f97316';

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Spikes
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const spikeLen = radius * 0.3;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.lineTo(Math.cos(angle) * (radius + spikeLen), Math.sin(angle) * (radius + spikeLen));
    ctx.stroke();
  }

  // Eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(radius * 0.4, -radius * 0.2, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(radius * 0.5, -radius * 0.2, radius * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

export const drawPortal = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, mode: ActiveMode) => {
  ctx.save();
  ctx.translate(x, y);
  
  const time = Date.now() * 0.005;
  const pulse = Math.sin(time) * 8;
  
  let color = '#fff';
  if (mode === ActiveMode.SPLIT) color = '#3b82f6';
  if (mode === ActiveMode.MIRROR) color = '#a855f7';
  if (mode === ActiveMode.GRAVITY) color = '#f97316';

  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  
  // Outer spinning ring
  ctx.rotate(time * 0.5);
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  ctx.arc(0, 0, radius + pulse, 0, Math.PI * 2);
  ctx.stroke();

  // Inner pulsing ring
  ctx.setLineDash([]);
  ctx.lineWidth = 3;
  ctx.rotate(-time * 1.2);
  ctx.beginPath();
  ctx.arc(0, 0, (radius * 0.6) - pulse * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
};

export const drawTrail = (ctx: CanvasRenderingContext2D, trail: {x: number, y: number, alpha: number, scale: number}[], radius: number, mode: ActiveMode) => {
  ctx.save();
  let baseColor = '0,0,0';
  if (mode === ActiveMode.SPLIT) baseColor = '59,130,246';
  if (mode === ActiveMode.MIRROR) baseColor = '168,85,247';
  if (mode === ActiveMode.GRAVITY) baseColor = '249,115,22';

  const time = Date.now();

  trail.forEach((point, i) => {
    const fade = point.alpha * (1 - i / trail.length);
    if (fade <= 0) return;
    
    ctx.globalAlpha = fade;
    
    // Gradient glow effect
    const grad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * point.scale * 1.5);
    grad.addColorStop(0, `rgba(${baseColor}, ${fade * 0.6})`);
    grad.addColorStop(1, `rgba(${baseColor}, 0)`);
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * point.scale * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Solid core
    ctx.fillStyle = `rgba(${baseColor}, ${fade * 0.4})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * point.scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Sparkles / Embers
    if ((time + i * 10) % 3 === 0) {
      const offsetX = (Math.sin(time * 0.01 + i) * 15);
      const offsetY = (Math.cos(time * 0.01 + i) * 15);
      ctx.fillStyle = `rgba(${baseColor}, ${fade * 1.2})`;
      ctx.fillRect(point.x + offsetX, point.y + offsetY, 3, 3);
      
      // Horizontal drift line
      if (i === 0) {
          ctx.strokeStyle = `rgba(${baseColor}, ${fade * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(point.x - 40, point.y);
          ctx.stroke();
      }
    }
  });
  ctx.restore();
};

export const drawMonster = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  rotation: number, 
  birdX: number, 
  birdY: number, 
  type: string = 'saw',
  isSpider: boolean = false
) => {
  ctx.save();
  ctx.translate(x, y);

  if (isSpider) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -y);
      ctx.stroke();

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
          const side = i < 4 ? -1 : 1;
          const angle = (i % 4) * 0.4 - 0.6;
          ctx.beginPath();
          ctx.moveTo(side * radius * 0.8, 0);
          const midX = side * radius * 1.5;
          const midY = Math.sin(Date.now() * 0.01 + i) * 10 - 10;
          ctx.lineTo(midX, midY);
          ctx.lineTo(side * radius * 1.8, 20);
          ctx.stroke();
      }
  }

  ctx.rotate(rotation);
  ctx.fillStyle = '#000000';
  ctx.beginPath();

  if (type === 'gear') {
    const teeth = 10;
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i / teeth) * Math.PI;
      const r = i % 2 === 0 ? radius : radius * 0.8;
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
  } else if (type === 'bloat') {
    const spikes = 20;
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2;
      const r = radius * (1 + (i % 2 === 0 ? 0.15 : 0));
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
  } else if (type === 'square') {
    const r = radius * 1.1;
    ctx.rect(-r, -r, r * 2, r * 2);
  } else {
    const teeth = 16;
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i / teeth) * Math.PI;
      const r = i % 2 === 0 ? radius : radius * 0.65;
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
  }

  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.rotate(-rotation);
  const dx = birdX - x;
  const dy = birdY - y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angleToBird = Math.atan2(dy, dx);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
  ctx.fill();
  const px = Math.cos(angleToBird) * Math.min(radius * 0.2, dist * 0.05);
  const py = Math.sin(angleToBird) * Math.min(radius * 0.2, dist * 0.05);
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(px, py, radius * 0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

export const drawPillar = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, inverted: boolean) => {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, w, h);
  const gapEdgeY = inverted ? y + h : y;
  ctx.beginPath();
  const segments = 8;
  for (let i = 0; i <= segments; i++) {
    const sx = x + (i / segments) * w;
    const sy = gapEdgeY + (inverted ? -25 : 25) * (i % 2 === 0 ? 1 : 0.3);
    if (i === 0) ctx.moveTo(sx, gapEdgeY);
    ctx.lineTo(sx, sy);
  }
  ctx.lineTo(x + w, gapEdgeY);
  ctx.fill();
};

export const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, offset: number) => {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#10111a');
  grad.addColorStop(1, '#2a2e45');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  drawSilhouettes(ctx, width, height, offset * 0.03, 600, 200, true);

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  drawSilhouettes(ctx, width, height, offset * 0.15, 400, 100, false);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for(let i=0; i<20; i++) {
      const px = (i * 200 + offset * 0.5) % width;
      const py = (i * 150) % height;
      ctx.fillRect(px, py, 2, 2);
  }

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let i = 0; i <= width + 60; i += 60) {
    const x = i - (offset % 60);
    const y = height - 60 - Math.sin((i + offset) * 0.02) * 20;
    ctx.lineTo(x, y);
    ctx.lineTo(x + 30, y + 40);
  }
  ctx.lineTo(width, height);
  ctx.fill();

  // Ceiling line - red neon glow to show it's dangerous
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.lineTo(width, 5);
  ctx.stroke();
  ctx.shadowBlur = 0;
};

function drawSilhouettes(ctx: CanvasRenderingContext2D, w: number, h: number, offset: number, baseH: number, variance: number, isMonolith: boolean) {
    const spacing = isMonolith ? 240 : 150;
    const startX = -(offset % spacing);
    const now = Date.now();
    for (let x = startX; x < w + spacing; x += spacing) {
        const height = baseH + (Math.sin(x + offset) * variance);
        if (isMonolith) {
            ctx.fillRect(x, h - height, spacing * 0.5, height);
            if (Math.sin(now * 0.005 + x) > 0.8) {
                ctx.fillStyle = '#ff2a2a';
                ctx.fillRect(x + 5, h - height + 40, 3, 3);
                ctx.fillStyle = 'rgba(0,0,0,0.12)';
            }
        } else {
            ctx.beginPath();
            ctx.moveTo(x, h);
            ctx.lineTo(x, h - height);
            ctx.lineTo(x + 30, h - height - 30);
            ctx.lineTo(x + 60, h - height);
            ctx.lineTo(x + 90, h);
            ctx.fill();
            ctx.fillStyle = '#00d2ff';
            ctx.fillRect(x + 15, h - height + 50, 4, 2);
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
        }
    }
}
