# itch.io Complete Publishing Kit: ShadowFlap - Monster Chase

## 1. Game Analysis & Positioning

- **Game Title**: ShadowFlap: Monster Chase
- **Game Type & Sub-Genre**: Single-button Arcade Runner / Precision Flapper / Dimensional Survival.
- **Genre**: Arcade, Action, Precision Platformer, Survival.
- **Core Gameplay Loop**: 
  1. Tap / click / press spacebar to flap against dynamic gravity.
  2. Dodge jagged shadow pillars, oscillating spiders, animated spiked monsters, and cycling laser corridors.
  3. Collect strategic power-ups: Shield forcefields, Chronos time dilation, and bonus score stars.
  4. Pass through dimensional portals (Split into 3 orbs, Invert gravity, or Mirror controls) to amplify score multipliers.
  5. Survive progressive exponential speed ramping to establish world-record scores in Daily Seeded or Master runs.
- **Target Audience**: Fans of *Flappy Bird*, *Badland*, *Geometry Dash*, high-difficulty reflex platformers, speedrunners, and daily seeded puzzle/score chasers.
- **Unique Selling Propositions (USPs)**:
  - **Dynamic Dimension Warping**: Portals dynamically split the player into 3 separate entities, flip horizontal coordinates, or invert gravity.
  - **100% Procedural Web Audio**: No external audio files or streaming overhead; every sound effect and ominous ambient drone is generated mathematically in real time.
  - **Deterministic Daily Challenge**: A global daily seed ensures every player on Earth tackles the exact same hazard layout every calendar day.
  - **Rich Obstacle & Power-Up System**: Features laser corridors, chaser phantoms, rotating satellite shurikens, shield barriers, and Chronos slow-motion.
  - **Zero-Install, Pure Client-Side**: Instant 60 FPS performance across desktop and mobile browsers with zero backend dependencies.

---

## 2. Storefront Metadata & Tagging Strategy

### 2.1 itch.io Project Details
- **Project URL**: `https://[developer-name].itch.io/shadowflap-monster-chase`
- **Classification**: Games
- **Kind of Project**: HTML (playable in browser)
- **Release Status**: Released / In Production (v1.0.0)
- **Pricing**: Free / Name Your Own Price ($0 or voluntary tip of $2–$5)
- **Short Tagline**: *Survive the dark dimension in this pulse-pounding, portal-shifting arcade precision flapper.*

### 2.2 Tags & Discoverability Keywords
`arcade`, `difficult`, `fast-paced`, `flappy-bird`, `single-button`, `one-button`, `runner`, `shadow`, `atmospheric`, `procedural`, `daily-challenge`, `dark-fantasy`, `html5`, `webgl`, `score-attack`, `endless-runner`, `casual`, `reflexes`, `survival`.

---

## 3. Storefront Description (HTML / Markdown Ready)

```markdown
# SHADOWFLAP: MONSTER CHASE

### Can you survive when the dark dimension shifts beneath your wings?

**ShadowFlap: Monster Chase** is a relentless single-button precision survival runner. Navigate jagged shadow monoliths, avoid pulsing abyssal monstrosities, and harness shifting dimensional portals that split your soul, reverse gravity, and invert your reality.

---

###  CORE FEATURES

- ** Dimensional Portal Warps**:
  - **Split Dimension**: Fracture into three simultaneous entities. Survive with all three to multiply your score by 3x!
  - **Mirror Dimension**: Invert your screen horizontally—re-wire your reflexes under sudden inverted controls (3x multiplier).
  - **Gravity Inversion**: Gravity pulls toward the ceiling! Flap downward to avoid the spiked floor (5x multiplier).
- ** Dynamic Obstacles & Abyssal Hazards**:
  - Rotating sawblades, grinding gears, pulsing spiked monstrosities, oscillating wall spiders, dynamic laser barriers, and sweeping chaser phantoms.
- ** Strategic Power-Ups**:
  - **Shield Forcefield**: Protects against one lethal hazard or ceiling/floor impact.
  - **Chronos Slow-Mo**: Dilates time by 45% for 6 seconds with emerald trail effects for surgical navigation.
  - **Score Star**: Grants an instant +50 score boost.
- ** Deterministic Daily Seeded Challenge**:
  - Compete on the exact same daily track as players worldwide.
- ** Procedural Web Audio Synthesis**:
  - Atmospheric dark drones and reactive retro synth chords synthesized purely in real time.
- ** Responsive & Mobile Ready**:
  - Play on desktop with Mouse / Spacebar or tap on mobile with full touch acceleration.

---

### 🕹️ CONTROLS
- **Desktop**: Click Mouse, Spacebar, or Up Arrow.
- **Mobile & Touch**: Tap anywhere on screen.
- **Pause / Audio**: On-screen control bar toggles audio and exits to menu.
```

---

## 4. Visual Assets & Packaging Checklist

| Asset | Dimensions | Usage | Format |
|---|---|---|---|
| **Cover Image** | 630 × 500 px | itch.io store listing thumbnail | PNG / WebP |
| **Banner / Header** | 960 × 400 px | itch.io page header banner | PNG |
| **Screenshot 1: Normal Run** | 1920 × 1080 px | Standard shadow pillar traversal | PNG |
| **Screenshot 2: Portal Warp** | 1920 × 1080 px | Split dimension with 3 parallel orbs | PNG |
| **Screenshot 3: Laser Corridors** | 1920 × 1080 px | High-intensity laser & chaser encounter | PNG |
| **Screenshot 4: Power-Up Action** | 1920 × 1080 px | Shield aura and Chronos slow-mo effects | PNG |
| **Animated GIF** | 600 × 338 px | 5-second dynamic flap & portal transition | GIF (< 10MB) |

---

## 5. itch.io Build & Deployment Guide

### 5.1 Build Command
```bash
# 1. Run full unit testing suite & type checking
npm test
npm run lint

# 2. Build production static bundle
npm run build
```

### 5.2 Packaging for itch.io
1. Navigate to the generated `dist/` directory.
2. Ensure `dist/index.html` is located at the root of the ZIP file (do **NOT** zip the outer folder itself).
3. Create a ZIP archive:
   ```bash
   cd dist && zip -r ../shadowflap-itch-v1.0.0.zip . && cd ..
   ```

### 5.3 itch.io Embed Settings
In the itch.io project dashboard under **Embed options**:
- **Embed in page**: Checked
- **Viewport Dimensions**: 960 × 600 (or set to Fullscreen with standard 16:9 ratio)
- **Automatically start on page load**: Checked
- **Enable Fullscreen button**: Checked
- **Orientation**: Both (Landscape preferred on desktop, Portrait supported on mobile)

### 5.4 Butler Automated Upload (Optional)
```bash
# Install Butler CLI from itch.io, then push directly:
butler push dist/ your-itch-username/shadowflap-monster-chase:html5 --userversion 1.0.0
```

---

## 6. Production Readiness Status

- [x] **Varied Obstacles Implemented**: Added Laser corridors, Chaser phantoms, and Satellite Blades.
- [x] **Power-Up System Implemented**: Added Shield forcefields, Chronos slow-mo, and Golden Stars.
- [x] **Procedural Audio Enhanced**: Sound synthesis for power-ups, shield shattering, star collecting, and slow-mo.
- [x] **Particle Engine Extended**: Pickup rings, shield shard bursts, star sparks, and apex flap bursts.
- [x] **Formal Testing Suite**: Vitest unit tests covering RNG determinism, scoring multipliers, difficulty formulas, and particle systems (16 passing tests).
- [x] **CI/CD Workflow**: GitHub Actions configured with type check (`tsc --noEmit`), unit tests (`npm test`), and production build (`npm run build`).
- [x] **Zero Placeholder Architecture**: Comprehensive `ARCHITECTURE.md` documenting client-side systems, data flows, and subsystem specifications.
- [x] **Audit & Documentation**: `REPOSITORY_STATUS.md` and `LAUNCH_PLAN.md` established in project root.
