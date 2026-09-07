# ShadowFlap: Monster Chase — System Architecture

## 1. System Overview

**ShadowFlap: Monster Chase** is a high-performance, single-button dimensional arcade survival runner built natively for modern web browsers. It operates strictly client-side with zero external backend dependencies, ensuring instant startup, offline capability, and seamless sandboxing within gaming platforms like itch.io and mobile webviews.

- **Primary Language & Runtime**: TypeScript (strict mode) on Node.js 22 (build) and modern ECMAScript browsers (runtime).
- **Core Framework & View**: React 18+ paired with HTML5 Canvas (Hardware-accelerated 2D context).
- **Audio Subsystem**: Web Audio API with 100% procedural waveform synthesis (zero external audio assets).
- **Styling & UI**: Tailwind CSS utility design system with responsive safe areas and touch-optimized pointer handlers.
- **Testing & Quality Assurance**: Vitest unit testing suite + TypeScript compiler (`tsc --noEmit`) type checks.
- **Build & Bundler**: Vite (ESM dev server & rollup-based static production distribution).

---

## 2. Component Hierarchy & Modular Architecture

```
src/
├── App.tsx                     # Main application orchestrator & UI overlay layer
├── components/
│   ├── GameCanvas.tsx          # 60 FPS requestAnimationFrame game loop & canvas controller
├── types.ts                    # Canonical TypeScript interfaces, enums, and data models
├── utils/
│   ├── drawing.ts              # 2D Canvas rendering routines (Bird, Monsters, Portals, Lasers, Pillars)
│   ├── particles.ts            # High-throughput visual FX engine (dust, sparks, rings, celebrations)
│   ├── sounds.ts               # Web Audio API procedural sound effects & background soundscapes
│   └── random.ts               # Seeded Pseudo-Random Number Generator (PRNG) for deterministic daily runs
└── __tests__/
    ├── random.test.ts          # Determinism, repeatability, and seed boundary tests
    ├── particles.test.ts       # Particle lifecycle, pooling, emission, and cleanup tests
    └── game-logic.test.ts      # Scoring multipliers, difficulty curves, and collision geometry
```

### Component Roles

1. **`App.tsx` (Application Shell & UI State Manager)**:
   - Manages top-level application state: `GameState.MENU`, `GameState.PLAYING`, `GameState.GAMEOVER`.
   - Handles game configuration: `GameMode` (`RANDOM`, `DAILY`, `MASTER`) and `Difficulty` (`EASY`, `MEDIUM`, `HARD`).
   - Persists high scores and unlocks to browser `localStorage` (`shadow_flap_highscore`, `shadow_flap_daily_high`, etc.).
   - Renders touch-optimized overlay controls, difficulty selectors, mode badges, scoreboards, and how-to-play instruction panels.

2. **`GameCanvas.tsx` (Core Game Engine)**:
   - Mounts full-screen canvas with dynamic DPR and `ResizeObserver` listener.
   - Executes the synchronized `update()` and `draw()` lifecycle via `requestAnimationFrame`.
   - Simulates physical gravity, flap impulses, dimensional velocity inversion, and multi-bird synchronization.
   - Spawns and manages dynamic obstacle arrays (pillars, monsters, spiders, rotating satellites, lasers, portals, power-ups).
   - Resolves circular and axis-aligned bounding box (AABB) collisions with invincibility buffering and shield absorption.

---

## 3. Subsystem Specifications

### 3.1 Physics & Bird Dynamics
- **Mass & Velocity**: Velocity changes continuously via gravity parameters determined by the current `Difficulty` setting.
- **Flap Mechanics**: On click / tap / spacebar pointer events, a negative impulse is applied to bird velocity. If in `ActiveMode.GRAVITY`, gravity and flap direction are inverted.
- **Inflation & Squash**: Bird sprite dynamically squashes and inflates based on current vertical velocity (`Math.max(1, 1 - (vel * 0.08))`), imparting tactile organic weight.
- **Trail Buffer**: Stores the previous 15 coordinates per active bird, rendering fading trailing ghost silhouettes.

### 3.2 Dimensional Portal System
Passing through dimensional portals alters the runtime physics rules:
- **`NORMAL`**: Standard single-bird traversal.
- **`SPLIT`**: Triplicates the bird into 3 simultaneous parallel entities; surviving with multiple birds multiplies all score gains by the active bird count.
- **`MIRROR`**: Horizontally flips the canvas rendering matrix (`scale(-1, 1)`), testing inverted reflex coordination (x3 score multiplier).
- **`GRAVITY`**: Inverts the gravitational constant, pulling birds upward and requiring downward flaps (x5 score multiplier).

### 3.3 Obstacles & Dynamic Hazards
- **Jagged Shadow Pillars**: Top and bottom terrain columns with dynamic gaps that shrink progressively as scores increase.
- **Animated Shadow Monsters**:
  - `saw`: 16-tooth spinning shadow saw with pupil targeting the player.
  - `gear`: 10-tooth industrial rotating grinder.
  - `bloat`: 20-spike pulsing creature with organic undulating radii.
  - `square`: Heavy monolithic crusher block with pulsating eye.
  - `chaser`: Winged phantom entity executing sinusoidal swooping intercept paths.
  - `blade`: 4-point high-velocity razor shuriken satellite.
- **Hanging Spiders**: Vertical sinusoidal oscillating ambush predators.
- **Laser Barriers**: Horizontal energy beam corridors cycling between a dashed warning stage and an active lethal beam phase.

### 3.4 Power-Up System
- **Shield Rune (`shield`)**: Surrounds the player with a luminous rotating cyan hexagonal forcefield, granting immunity to one collision impact or boundary hit.
- **Chronos Time Dilation (`slowmo`)**: Slows global world speed by 45% for ~6 seconds with emerald chronos particle trails, enabling tight corridor navigation.
- **Score Star (`star`)**: Instant +50 score burst with golden celebratory fireworks.

### 3.5 Procedural Audio Synthesizer (`utils/sounds.ts`)
Zero MP3/WAV files are required. All sounds are generated via Web Audio API:
- **Flap**: High-to-low triangle wave frequency drop.
- **Score**: Pure sine chime arpeggio with exponential gain decay.
- **Hit**: Sawtooth burst + low-frequency impact drop.
- **PowerUp Pickup**: Multi-oscillator major arpeggio cascade.
- **Shield Shatter**: Downward frequency distortion buzz.
- **Ambient Drone**: Dual detuned lowpass sine oscillators with continuous LFO modulation for ominous atmospheric immersion.

---

## 4. Deterministic Seeding (`utils/random.ts`)
For `GameMode.DAILY`, all obstacle distributions, gap placements, and hazard types use a deterministic Lehmer/LCG pseudo-random generator seeded with the current calendar date (`YYYYMMDD`). Every player worldwide receives the exact same track sequence on any given day, enabling fair global daily challenges.

---

## 5. Performance & Resource Optimization

1. **Zero Garbage Collection Spikes**: Obstacles and particles utilize structured array recycling and filter clipping rather than continuous heap reallocations.
2. **Double-Buffering & Hardware Acceleration**: Canvas uses single-pass composite rendering with alpha channel caching for static silhouettes.
3. **Responsive Scaling**: Dynamic coordinate systems adapt seamlessly to ultra-wide desktop monitors, tablets, and portrait mobile screens.
4. **Offline Resilience**: Static production build consists entirely of HTML, JS, and CSS with no backend dependencies, allowing 100% offline play.

---

## 6. Testing & Quality Assurance

- **Vitest**: Unit testing suite covering core deterministic PRNG math, particle systems, score gain multipliers, exponential difficulty ramping, and collision detection geometry.
- **TypeScript Static Verification**: Automated type checks (`tsc --noEmit`) integrated into GitHub Actions CI pipeline.
- **ESLint & Prettier**: Automated linting enforcing clean TypeScript semantics.
