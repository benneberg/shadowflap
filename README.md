# ShadowFlap - Monster Chase

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> *"Identify the portals, master the chaos."*

A high-octane dark silhouette arcade precision flapper built with React 19, TypeScript, and HTML5 Canvas. Dodge lurking shadow monsters, master shifting dimensional portals (Split, Mirror, Gravity Inversion), and compete across procedural endless runs and synchronized daily tracks.

---

## 🚀 Features

- **⚡ 3 Shifting Dimensions**:
  - **Split Dimension**: Multiplies your character into three coordinated orbs.
  - **Mirror Dimension**: Reverses directional controls for high-intensity maneuvering.
  - **Gravity Dimension**: Flips global gravity upside-down.
- **🎯 3 Difficulty Tiers**: Easy, Medium (Standard), and Hard (Hyper-Velocity).
- **📅 Daily Seeded Tracks**: Synchronized global seed where all players encounter identical obstacle patterns.
- **✨ Dynamic Particle Engine**: Real-time flap bursts, scoring explosions, and portal shockwaves.
- **📱 Fully Responsive**: Single-viewport portrait and desktop responsive layout with instant redeploy loop.

---

## 🛠️ Development & Building

### Prerequisites
- Node.js 22+ (`.nvmrc` included)
- npm 10+

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/shadowflap-monster-chase.git
cd shadowflap-monster-chase

# Use correct Node version
nvm use

# Install dependencies
npm ci
```

### Scripts
```bash
# Start local development server
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Build production static bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🐳 Docker Deployment

Build and run using the lightweight, unprivileged multi-stage container:

```bash
# Build container image
docker build -t shadowflap:latest .

# Run on port 8080
docker run -p 8080:8080 shadowflap:latest
```

---

## 📄 License

This project is licensed under the MIT License.
