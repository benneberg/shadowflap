
import { ActiveMode } from '../types';

export const drawBird = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  velocity: number, 
  mode: ActiveMode = ActiveMode.NORMAL,
  opacity: number = 1,
  hasShield: boolean = false
) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);

  // Luminous hexagonal shield barrier aura
  if (hasShield) {
    const time = Date.now() * 0.005;
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 2.5;
    ctx.rotate(time);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = radius * 1.5 + Math.sin(time * 2 + i) * 2;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.fill();
    ctx.restore();
  }
  
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
  const pulse = Math.sin(time) * 6;
  
  let color = '#ffffff';
  if (mode === ActiveMode.SPLIT) color = '#3b82f6';
  if (mode === ActiveMode.MIRROR) color = '#a855f7';
  if (mode === ActiveMode.GRAVITY) color = '#f97316';

  ctx.strokeStyle = color;
  ctx.shadowBlur = 24;
  ctx.shadowColor = color;
  
  // Outer swirling spiral vortex aura
  ctx.save();
  ctx.rotate(time * 0.8);
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 6]);
  ctx.beginPath();
  ctx.arc(0, 0, radius + pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Middle counter-rotating ring with energy notches
  ctx.save();
  ctx.rotate(-time * 1.2);
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.75 - pulse * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Dimensional vortex interior gradient glow
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(0.3, `${color}66`);
  grad.addColorStop(0.7, `${color}22`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Center dimensional mode glyph
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ffffff';

  if (mode === ActiveMode.SPLIT) {
    // 3 split orbiting nodes
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + time;
      const ox = Math.cos(a) * (radius * 0.32);
      const oy = Math.sin(a) * (radius * 0.32);
      ctx.beginPath();
      ctx.arc(ox, oy, radius * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (mode === ActiveMode.MIRROR) {
    // Opposing mirror chevron glyphs: < | >
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.38);
    ctx.lineTo(0, radius * 0.38);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-radius * 0.28, -radius * 0.2);
    ctx.lineTo(-radius * 0.1, 0);
    ctx.lineTo(-radius * 0.28, radius * 0.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(radius * 0.28, -radius * 0.2);
    ctx.lineTo(radius * 0.1, 0);
    ctx.lineTo(radius * 0.28, radius * 0.2);
    ctx.stroke();
  } else if (mode === ActiveMode.GRAVITY) {
    // Inverted double arrow gravity glyph
    const arrowH = radius * 0.38;
    const arrowW = radius * 0.24;
    // Up arrow
    ctx.beginPath();
    ctx.moveTo(0, -arrowH);
    ctx.lineTo(-arrowW, -arrowH * 0.4);
    ctx.lineTo(-arrowW * 0.4, -arrowH * 0.4);
    ctx.lineTo(-arrowW * 0.4, 0);
    ctx.lineTo(arrowW * 0.4, 0);
    ctx.lineTo(arrowW * 0.4, -arrowH * 0.4);
    ctx.lineTo(arrowW, -arrowH * 0.4);
    ctx.closePath();
    ctx.fill();
    // Down arrow
    ctx.beginPath();
    ctx.moveTo(0, arrowH);
    ctx.lineTo(-arrowW, arrowH * 0.4);
    ctx.lineTo(-arrowW * 0.4, arrowH * 0.4);
    ctx.lineTo(-arrowW * 0.4, 0);
    ctx.lineTo(arrowW * 0.4, 0);
    ctx.lineTo(arrowW * 0.4, arrowH * 0.4);
    ctx.lineTo(arrowW, arrowH * 0.4);
    ctx.closePath();
    ctx.fill();
  } else {
    // Normal core
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

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
      // Solid black silk suspension thread matching all-black trap aesthetic
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -y);
      ctx.stroke();

      // 8 Articulated jointed silhouette spider legs with sharp clawed tips
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const time = Date.now() * 0.008;
      for (let i = 0; i < 8; i++) {
          const isLeft = i < 4;
          const side = isLeft ? -1 : 1;
          const legIdx = i % 4;
          const cycleOffset = legIdx * 0.5;
          const twitch = Math.sin(time + cycleOffset) * 12;

          const hipX = side * radius * 0.6;
          const hipY = (legIdx - 1.5) * 8;
          const kneeX = side * (radius * 1.5 + legIdx * 4);
          const kneeY = hipY - 14 + twitch;
          const footX = side * (radius * 1.8 + legIdx * 6);
          const footY = hipY + 22 + (twitch * 0.5);

          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();
      }
  }

  ctx.rotate(rotation);
  ctx.fillStyle = '#000000';
  ctx.beginPath();

  if (type === 'gear') {
    // Heavy industrial silhouette cog with 8 rectangular notched teeth
    const teeth = 8;
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = a1 + (Math.PI / teeth) * 0.35;
      const a3 = a1 + (Math.PI / teeth) * 0.75;
      const a4 = a1 + (Math.PI / teeth) * 1.0;
      const rOuter = radius * 1.15;
      const rInner = radius * 0.8;

      if (i === 0) ctx.moveTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
      else ctx.lineTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
      ctx.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
      ctx.lineTo(Math.cos(a3) * rOuter, Math.sin(a3) * rOuter);
      ctx.lineTo(Math.cos(a4) * rInner, Math.sin(a4) * rInner);
    }
  } else if (type === 'bloat') {
    // Spiked shadow urchin with 20 razor needle spines pulsing in menace
    const spines = 20;
    const pulseScale = 1 + Math.sin(Date.now() * 0.007) * 0.06;
    for (let i = 0; i < spines * 2; i++) {
      const angle = (i / (spines * 2)) * Math.PI * 2;
      const isTip = i % 2 === 0;
      const r = isTip ? radius * 1.25 * pulseScale : radius * 0.72;
      if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
      else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
  } else if (type === 'square') {
    // Jagged Monolith Brute - Spiked fortress monster with perimeter saw-teeth and corner horns
    const half = radius * 0.85;
    const teethPerSide = 3;
    
    // Top side with saw teeth
    ctx.moveTo(-half - 12, -half - 12); // Top-left corner horn tip
    ctx.lineTo(-half, -half);
    for (let i = 1; i <= teethPerSide; i++) {
      const segStart = -half + ((i - 1) / teethPerSide) * (half * 2);
      const segMid = segStart + (half / teethPerSide);
      const segEnd = -half + (i / teethPerSide) * (half * 2);
      ctx.lineTo(segMid, -half - 12);
      ctx.lineTo(segEnd, -half);
    }
    // Top-right corner horn
    ctx.lineTo(half + 12, -half - 12);
    ctx.lineTo(half, -half);

    // Right side with saw teeth
    for (let i = 1; i <= teethPerSide; i++) {
      const segStart = -half + ((i - 1) / teethPerSide) * (half * 2);
      const segMid = segStart + (half / teethPerSide);
      const segEnd = -half + (i / teethPerSide) * (half * 2);
      ctx.lineTo(half + 12, segMid);
      ctx.lineTo(half, segEnd);
    }
    // Bottom-right corner horn
    ctx.lineTo(half + 12, half + 12);
    ctx.lineTo(half, half);

    // Bottom side with saw teeth
    for (let i = 1; i <= teethPerSide; i++) {
      const segStart = half - ((i - 1) / teethPerSide) * (half * 2);
      const segMid = segStart - (half / teethPerSide);
      const segEnd = half - (i / teethPerSide) * (half * 2);
      ctx.lineTo(segMid, half + 12);
      ctx.lineTo(segEnd, half);
    }
    // Bottom-left corner horn
    ctx.lineTo(-half - 12, half + 12);
    ctx.lineTo(-half, half);

    // Left side with saw teeth
    for (let i = 1; i <= teethPerSide; i++) {
      const segStart = half - ((i - 1) / teethPerSide) * (half * 2);
      const segMid = segStart - (half / teethPerSide);
      const segEnd = half - (i / teethPerSide) * (half * 2);
      ctx.lineTo(-half - 12, segMid);
      ctx.lineTo(-half, segEnd);
    }
  } else if (type === 'blade') {
    // 6-point curved razor scythe star with solid black hub
    const points = 6;
    const rHub = radius * 0.7;
    const rTip = radius * 1.35;
    for (let i = 0; i < points; i++) {
      const aBase = (i / points) * Math.PI * 2;
      const aTip = aBase + (Math.PI / points) * 0.7;
      const aReturn = aBase + (Math.PI / points) * 1.2;

      if (i === 0) ctx.moveTo(Math.cos(aBase) * rHub, Math.sin(aBase) * rHub);
      else ctx.lineTo(Math.cos(aBase) * rHub, Math.sin(aBase) * rHub);

      // Curved cutting edge outward to razor tip
      ctx.quadraticCurveTo(
        Math.cos(aTip - 0.2) * (rTip * 0.9), 
        Math.sin(aTip - 0.2) * (rTip * 0.9), 
        Math.cos(aTip) * rTip, 
        Math.sin(aTip) * rTip
      );
      // Curved return to hub
      ctx.quadraticCurveTo(
        Math.cos(aReturn) * (rHub * 1.1), 
        Math.sin(aReturn) * (rHub * 1.1), 
        Math.cos(aReturn) * rHub, 
        Math.sin(aReturn) * rHub
      );
    }
  } else if (type === 'chaser') {
    // Shadow Gargoyle / Winged Demon silhouette in pure black
    const wingFlap = Math.sin(Date.now() * 0.015) * 0.25;
    
    // Head with sharp demonic horns
    ctx.moveTo(0, -radius * 0.4);
    ctx.lineTo(radius * 0.2, -radius * 0.95); // Right horn tip
    ctx.lineTo(radius * 0.1, -radius * 0.4);

    // Right bat wing with sharp claw joint and scalloped trailing edge
    ctx.quadraticCurveTo(radius * 0.8, -radius * (1.3 + wingFlap), radius * 1.6, -radius * (0.6 + wingFlap)); // Wingtip claw
    ctx.lineTo(radius * 1.2, -radius * 0.1);
    ctx.lineTo(radius * 1.0, -radius * 0.4);
    ctx.lineTo(radius * 0.7, 0);
    ctx.lineTo(radius * 0.4, -radius * 0.15);

    // Torso down to barbed tail stinger
    ctx.lineTo(radius * 0.3, radius * 0.5);
    ctx.lineTo(radius * 0.1, radius * 1.1); // Tail tip
    ctx.lineTo(0, radius * 1.3); // Stinger point
    ctx.lineTo(-radius * 0.1, radius * 1.1);
    ctx.lineTo(-radius * 0.3, radius * 0.5);

    // Left bat wing
    ctx.lineTo(-radius * 0.4, -radius * 0.15);
    ctx.lineTo(-radius * 0.7, 0);
    ctx.lineTo(-radius * 1.0, -radius * 0.4);
    ctx.lineTo(-radius * 1.2, -radius * 0.1);
    ctx.quadraticCurveTo(-radius * 1.6, -radius * (0.6 + wingFlap), -radius * 0.8, -radius * (1.3 + wingFlap)); // Left wingtip claw

    // Left horn
    ctx.lineTo(-radius * 0.1, -radius * 0.4);
    ctx.lineTo(-radius * 0.2, -radius * 0.95); // Left horn tip
    ctx.lineTo(0, -radius * 0.4);
  } else {
    // Classic Shadow Buzzsaw - 16 aggressive triangular saw teeth
    const teeth = 16;
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i / teeth) * Math.PI;
      const r = i % 2 === 0 ? radius * 1.12 : radius * 0.7;
      if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
      else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
  }

  ctx.closePath();
  ctx.fill();

  // Signature menacing tracking eye - shared across all black shadow monsters
  ctx.rotate(-rotation);
  const dx = birdX - x;
  const dy = birdY - y;
  const dist = Math.hypot(dx, dy);
  const angleToBird = Math.atan2(dy, dx);
  
  // Proportional white sclera firmly nested within the solid black body
  const eyeR = radius * (type === 'chaser' ? 0.32 : type === 'square' ? 0.36 : 0.4);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
  ctx.fill();
  
  // Menacing tracking black pupil looking directly at the bird
  const maxPupilOffset = eyeR * 0.42;
  const pupilDist = Math.min(maxPupilOffset, dist * 0.04);
  const px = Math.cos(angleToBird) * pupilDist;
  const py = Math.sin(angleToBird) * pupilDist;
  const pupilR = eyeR * 0.45;
  
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(px, py, pupilR, 0, Math.PI * 2);
  ctx.fill();

  // Specular glint for animated life
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(px - pupilR * 0.35, py - pupilR * 0.35, pupilR * 0.32, 0, Math.PI * 2);
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

export const drawPowerUp = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  type: 'shield' | 'slowmo' | 'star'
) => {
  ctx.save();
  ctx.translate(x, y);
  const time = Date.now() * 0.004;
  const floatY = Math.sin(time * 3) * 4;
  ctx.translate(0, floatY);

  if (type === 'shield') {
    // Glowing Cyan Shield Rune
    const color = '#38bdf8';
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.rotate(time);
    // Outer hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = radius * 0.9;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fill();

    // Inner shield emblem
    ctx.rotate(-time * 2);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.5);
    ctx.lineTo(radius * 0.45, -radius * 0.2);
    ctx.lineTo(radius * 0.35, radius * 0.35);
    ctx.lineTo(0, radius * 0.55);
    ctx.lineTo(-radius * 0.35, radius * 0.35);
    ctx.lineTo(-radius * 0.45, -radius * 0.2);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'slowmo') {
    // Chronos Emerald Hourglass / Dial
    const color = '#34d399';
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;

    // Outer clock ring with ticks
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * radius * 0.7, Math.sin(a) * radius * 0.7);
      ctx.lineTo(Math.cos(a) * radius * 0.85, Math.sin(a) * radius * 0.85);
      ctx.stroke();
    }

    // Hourglass center
    ctx.rotate(time * 1.5);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.4, -radius * 0.45);
    ctx.lineTo(radius * 0.4, -radius * 0.45);
    ctx.lineTo(0, 0);
    ctx.lineTo(radius * 0.4, radius * 0.45);
    ctx.lineTo(-radius * 0.4, radius * 0.45);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'star') {
    // Golden Star Essence
    const color = '#fbbf24';
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.rotate(time * 2);
    ctx.fillStyle = color;

    // 5-point star
    ctx.beginPath();
    const points = 5;
    for (let i = 0; i < points * 2; i++) {
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? radius * 0.9 : radius * 0.4;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Center white spark
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

export const drawLaser = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  state: 'warning' | 'active' = 'active'
) => {
  ctx.save();
  if (state === 'warning') {
    // Warning dotted line with warning indicators
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(x, y + height / 2);
    ctx.lineTo(x + width, y + height / 2);
    ctx.stroke();

    // Pulsing warning diamond emitter nodes at ends
    const time = Date.now() * 0.01;
    const pulse = 4 + Math.sin(time) * 3;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - pulse, y + height / 2 - pulse, pulse * 2, pulse * 2);
    ctx.fillRect(x + width - pulse, y + height / 2 - pulse, pulse * 2, pulse * 2);
  } else {
    // Fully active laser beam
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 20;

    // Outer glow
    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.fillRect(x, y, width, height);

    // Mid laser beam
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x, y + height * 0.25, width, height * 0.5);

    // Inner bright white core
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y + height * 0.4, width, height * 0.2);

    // Node emitters
    ctx.fillStyle = '#111111';
    ctx.fillRect(x - 8, y - 6, 16, height + 12);
    ctx.fillRect(x + width - 8, y - 6, 16, height + 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 4, y, 8, height);
    ctx.fillRect(x + width - 4, y, 8, height);
  }
  ctx.restore();
};
