# Shadow Flap: Monster Chase

A high-octane silhouette arcade game where you navigate through treacherous monster patterns. Shadow Flap takes the classic endless runner formula and injects it with adaptive difficulty, daily seeded challenges, and procedural audio.

## 🎮 Features

- **Endless Random Mode**: Test your reflexes against procedurally generated obstacle courses.
- **Daily Seeded Track**: Compete against yourself on a unique, globally seeded track that changes every 24 hours.
- **Chaos Master Mode**: An unlockable extreme difficulty mode for elite players.
- **Adaptive Difficulty**: The game speed increases by 5% for every 5 obstacles cleared, constantly pushing your limits.
- **Performance Registry**: Track your progress with local high scores and a history of your last 5 runs.
- **Achievement Medals**: Unlock badges like "100 Point Streak" and "Speed Demon" as you hit specific milestones.
- **Procedural Audio**: Features a dark, mystic electronic ambient drone and synthesized sound effects powered entirely by the Web Audio API.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Rendering**: HTML5 `<canvas>` API for high-performance 60fps game loops
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Web Audio API (Zero external audio assets)

## 🚀 Getting Started

To run this project locally, follow these steps:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
3. **Play the game**: Open your browser and navigate to the local host URL provided by Vite (typically `http://localhost:3000`).

## 🕹️ How to Play

- **Click, Tap, or press Spacebar** to flap and gain altitude.
- Navigate your character through the safe zones between the silhouette monster obstacles.
- Each pair of obstacles successfully passed grants **1 point**.
- As your score increases, the game speed will accelerate. Survive as long as you can!

## 📜 License

This project is open-source and available under the MIT License.
