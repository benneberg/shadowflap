
import React, { useState, useEffect, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import { GameMode, GameState, ActiveMode, Difficulty } from './types';
import { Trophy, Play, Calendar, RotateCcw, Zap, Check, Flame, Star, History, Award, FastForward, Shield, Gauge } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.RANDOM);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [selectedBonusMode, setSelectedBonusMode] = useState<ActiveMode>(ActiveMode.NORMAL);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1500); 
  const [dailyHighScore, setDailyHighScore] = useState(0);
  const [recentScores, setRecentScores] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('shadow_flap_highscore');
    if (saved) {
        const val = parseInt(saved, 10);
        setHighScore(Math.max(1500, val));
    } else {
        localStorage.setItem('shadow_flap_highscore', '1500');
        setHighScore(1500);
    }
    
    const dailyKey = `daily_${new Date().toDateString()}`;
    const dailyData = localStorage.getItem(dailyKey);
    if (dailyData) setDailyHighScore(parseInt(dailyData, 10));

    const recent = localStorage.getItem('shadow_flap_recent');
    if (recent) setRecentScores(JSON.parse(recent));
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setGameState(GameState.GAMEOVER);
    
    // Update recent scores
    setRecentScores(prev => {
      const updated = [finalScore, ...prev].slice(0, 5);
      localStorage.setItem('shadow_flap_recent', JSON.stringify(updated));
      return updated;
    });

    if (gameMode === GameMode.RANDOM || gameMode === GameMode.MASTER) {
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('shadow_flap_highscore', finalScore.toString());
      }
    } else {
      const dailyKey = `daily_${new Date().toDateString()}`;
      if (finalScore > dailyHighScore) {
        setDailyHighScore(finalScore);
        localStorage.setItem(dailyKey, finalScore.toString());
      }
    }
  }, [gameMode, highScore, dailyHighScore]);

  const getRank = (s: number) => {
      if (s >= 5000) return { label: 'S+', color: 'text-yellow-400' };
      if (s >= 2500) return { label: 'S', color: 'text-red-500' };
      if (s >= 1000) return { label: 'A', color: 'text-purple-500' };
      if (s >= 500) return { label: 'B', color: 'text-blue-500' };
      if (s >= 200) return { label: 'C', color: 'text-green-500' };
      return { label: 'D', color: 'text-gray-400' };
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState(GameState.PLAYING);
    setScore(0);
  };

  const toggleMode = (mode: ActiveMode) => {
    if (selectedBonusMode === mode) {
      setSelectedBonusMode(ActiveMode.NORMAL);
    } else {
      setSelectedBonusMode(mode);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black font-sans text-white select-none">
      <div className="absolute inset-0 z-0">
        <GameCanvas 
          mode={gameMode} 
          state={gameState} 
          difficulty={difficulty}
          onGameOver={handleGameOver} 
          onScoreUpdate={setScore}
          startingMode={selectedBonusMode}
        />
      </div>

      {gameState === GameState.MENU && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md px-4 py-6 text-center animate-in fade-in duration-300 overflow-y-auto">
          {/* Logo with clean top/bottom margins and balanced typography */}
          <div className="my-3 sm:my-4 flex flex-col items-center max-w-sm px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase italic drop-shadow-[0_4px_20px_rgba(255,255,255,0.15)] leading-tight">
              Shadow<span className="text-red-500">Flap</span>
            </h1>
            <span className="text-xs uppercase tracking-[0.25em] text-red-400/80 font-bold mt-0.5">Monster Chase</span>
            <p className="text-gray-400 mt-2 text-sm sm:text-base italic opacity-85">"Identify the portals, master the chaos."</p>
          </div>

          {/* Difficulty Selector */}
          <div className="w-full max-w-xs mb-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">
              <span className="flex items-center gap-1.5"><Gauge size={13} /> Difficulty</span>
              <span className="text-gray-500 text-[10px]">
                {difficulty === Difficulty.EASY && "Wider Gaps & Slower"}
                {difficulty === Difficulty.MEDIUM && "Standard Balance"}
                {difficulty === Difficulty.HARD && "Hyper Speed & Tight Gaps"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setDifficulty(Difficulty.EASY)}
                className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  difficulty === Difficulty.EASY
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Easy
              </button>
              <button
                type="button"
                onClick={() => setDifficulty(Difficulty.MEDIUM)}
                className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  difficulty === Difficulty.MEDIUM
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setDifficulty(Difficulty.HARD)}
                className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  difficulty === Difficulty.HARD
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Hard
              </button>
            </div>
          </div>

          {/* Mode Selection Buttons */}
          <div className="grid grid-cols-1 gap-2.5 w-full max-w-xs mb-3">
            <button 
              onClick={() => startGame(GameMode.RANDOM)}
              className="group flex items-center justify-between bg-white text-black px-5 py-3 rounded-2xl font-bold text-base active:scale-95 hover:bg-gray-100 transition-all shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <Play className="fill-current text-black" size={18} />
                <span>{selectedBonusMode !== ActiveMode.NORMAL ? `Start ${selectedBonusMode}` : 'Endless Run'}</span>
              </div>
              <span className="text-[10px] opacity-60 font-black tracking-widest">#{highScore}</span>
            </button>

            <button 
              onClick={() => startGame(GameMode.DAILY)}
              className="group flex items-center justify-between bg-gray-900/90 text-white px-5 py-3 rounded-2xl font-bold text-base border border-white/15 active:scale-95 hover:bg-gray-800 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Calendar size={18} className="text-blue-400" />
                <span>Daily Track</span>
              </div>
              <span className="text-[10px] opacity-60 font-black tracking-widest">#{dailyHighScore}</span>
            </button>

            <button 
              onClick={() => startGame(GameMode.MASTER)}
              className={`group flex items-center justify-between px-5 py-3 rounded-2xl font-bold text-base transition-all ${highScore >= 1500 ? 'bg-red-600 text-white active:scale-95 hover:bg-red-500 shadow-md shadow-red-600/20' : 'bg-gray-900 text-gray-600 border border-white/5 opacity-50 cursor-not-allowed'}`}
              disabled={highScore < 1500}
            >
              <div className="flex items-center gap-2.5">
                <Flame size={18} className={highScore >= 1500 ? "animate-pulse text-yellow-300" : ""} />
                <span>Chaos Master</span>
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest">{highScore >= 1500 ? 'Chaos' : 'LOCKED'}</span>
            </button>
          </div>

          {/* Dev/Bonus Portal Selection */}
          <div className="flex flex-col items-center w-full max-w-xs my-2">
              <span className="text-[9px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Select Start Portal (Practice)</span>
              <div className="grid grid-cols-3 gap-2 w-full">
                  <button 
                    onClick={() => toggleMode(ActiveMode.SPLIT)}
                    className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${highScore >= 100 ? 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20' : 'border-white/10 opacity-30 bg-black/50 pointer-events-none'} ${selectedBonusMode === ActiveMode.SPLIT ? 'bg-blue-600 border-blue-400 ring-2 ring-blue-400/50' : 'bg-black/50'}`}
                  >
                      {selectedBonusMode === ActiveMode.SPLIT && <Check size={12} className="absolute top-1 right-1 text-white" />}
                      <Zap size={18} className={selectedBonusMode === ActiveMode.SPLIT ? "text-white" : "text-blue-400"} />
                      <span className="text-[9px] font-bold mt-1 uppercase">Split</span>
                  </button>
                  <button 
                    onClick={() => toggleMode(ActiveMode.MIRROR)}
                    className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${highScore >= 500 ? 'border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20' : 'border-white/10 opacity-30 bg-black/50 pointer-events-none'} ${selectedBonusMode === ActiveMode.MIRROR ? 'bg-purple-600 border-purple-400 ring-2 ring-purple-400/50' : 'bg-black/50'}`}
                  >
                      {selectedBonusMode === ActiveMode.MIRROR && <Check size={12} className="absolute top-1 right-1 text-white" />}
                      <Zap size={18} className={selectedBonusMode === ActiveMode.MIRROR ? "text-white" : "text-purple-400"} />
                      <span className="text-[9px] font-bold mt-1 uppercase">Mirror</span>
                  </button>
                  <button 
                    onClick={() => toggleMode(ActiveMode.GRAVITY)}
                    className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${highScore >= 1000 ? 'border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20' : 'border-white/10 opacity-30 bg-black/50 pointer-events-none'} ${selectedBonusMode === ActiveMode.GRAVITY ? 'bg-orange-600 border-orange-400 ring-2 ring-orange-400/50' : 'bg-black/50'}`}
                  >
                      {selectedBonusMode === ActiveMode.GRAVITY && <Check size={12} className="absolute top-1 right-1 text-white" />}
                      <Zap size={18} className={selectedBonusMode === ActiveMode.GRAVITY ? "text-white" : "text-orange-400"} />
                      <span className="text-[9px] font-bold mt-1 uppercase">Gravity</span>
                  </button>
              </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-gray-500">
             <Trophy size={13} />
             <span className="text-[9px] font-semibold uppercase tracking-widest">Global Seeded Survival</span>
          </div>
        </div>
      )}

      {gameState === GameState.PLAYING && (
        <div className="absolute top-0 inset-x-0 z-10 flex flex-col items-center pt-8 sm:pt-10 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-6 py-1.5 rounded-full border border-white/20 shadow-xl">
             <span className="text-3xl sm:text-4xl font-black tabular-nums">{score}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.25em] opacity-60">
             <span>{gameMode === GameMode.DAILY ? "Daily Track" : gameMode === GameMode.MASTER ? "Chaos Track" : "Random Mode"}</span>
             <span className="text-white/40">•</span>
             <span className={difficulty === Difficulty.HARD ? "text-red-400" : difficulty === Difficulty.EASY ? "text-emerald-400" : "text-blue-400"}>
               {difficulty}
             </span>
          </div>
        </div>
      )}

      {/* GAMEOVER SCREEN: Compact single-viewport layout with zero required scrolling */}
      {gameState === GameState.GAMEOVER && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-between bg-black/90 backdrop-blur-md p-4 sm:p-6 text-center animate-in zoom-in duration-200">
          
          {/* Header */}
          <div className="flex items-center gap-2 text-red-500 font-black text-base sm:text-lg uppercase tracking-widest pt-2">
            <Flame size={18} className="animate-pulse" />
            Run Terminated
          </div>
          
          {/* Main Registry Card */}
          <div className="relative p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10 w-full max-w-sm my-auto">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-black px-3 py-0.5 rounded-full border border-white/20 text-[9px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
              Performance Registry
            </div>
            
            <div className="grid grid-cols-2 gap-4 items-center">
              {/* Score & Rank */}
              <div className="flex flex-col items-center justify-center border-r border-white/10 pr-2">
                <div className="text-gray-400 uppercase text-[9px] font-bold tracking-widest mb-0.5">Score</div>
                <div className="text-5xl sm:text-6xl font-black tabular-nums leading-none tracking-tight my-1">{score}</div>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                        <span className="text-[8px] font-bold uppercase text-gray-500">Rank</span>
                        <span className={`text-xl font-black ${getRank(score).color}`}>{getRank(score).label}</span>
                    </div>
                    {score >= highScore && score > 0 && (
                        <div className="flex items-center gap-0.5 text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                            <Star className="fill-current" size={10} />
                            <span>Record</span>
                        </div>
                    )}
                </div>
              </div>

              {/* High Scores & History Summary */}
              <div className="flex flex-col gap-1.5 pl-1 text-left">
                <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Best</span>
                  <span className="text-sm font-black tabular-nums">{highScore}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Daily</span>
                  <span className="text-sm font-black tabular-nums">{dailyHighScore}</span>
                </div>
                
                {/* Recent scores pill row */}
                <div className="mt-1">
                  <div className="flex items-center gap-1 text-[8px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                    <History size={10} /> Recent Runs
                  </div>
                  <div className="flex gap-1 overflow-hidden">
                    {recentScores.slice(0, 4).map((s, i) => (
                      <span key={i} className="bg-white/10 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-gray-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Medals Strip */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
              <div className={`p-2 rounded-xl border flex items-center gap-2 ${score >= 100 ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400' : 'bg-white/5 border-white/5 text-gray-600'}`}>
                <Trophy size={16} />
                <div className="text-left leading-none">
                  <div className="text-[9px] font-black uppercase">100 Streak</div>
                  <div className="text-[7px] opacity-70">Survivor Medal</div>
                </div>
              </div>
              <div className={`p-2 rounded-xl border flex items-center gap-2 ${score >= 25 ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/5 text-gray-600'}`}>
                <FastForward size={16} />
                <div className="text-left leading-none">
                  <div className="text-[9px] font-black uppercase">Speed Demon</div>
                  <div className="text-[7px] opacity-70">Velocity Nav</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Always in full viewport visibility */}
          <div className="flex flex-col gap-2 w-full max-w-xs pb-2">
            <button 
              type="button"
              onClick={() => startGame(gameMode)}
              className="flex items-center justify-center gap-2.5 bg-white text-black px-6 py-3.5 rounded-2xl font-black text-lg active:scale-95 hover:bg-gray-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)]"
            >
              <RotateCcw size={20} />
              Redeploy
            </button>
            <button 
              type="button"
              onClick={() => setGameState(GameState.MENU)}
              className="py-2 text-gray-400 font-bold uppercase text-[11px] tracking-[0.2em] hover:text-white transition-colors"
            >
              Return to Interface
            </button>
          </div>
        </div>
      )}

      {gameState === GameState.PLAYING && score === 0 && (
          <div className="absolute bottom-20 inset-x-0 flex flex-col items-center animate-pulse pointer-events-none opacity-60">
             <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center mb-1.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Tap to Flap</span>
          </div>
      )}
    </div>
  );
};

export default App;

