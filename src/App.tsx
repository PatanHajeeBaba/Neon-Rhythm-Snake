import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Gamepad2, Music as MusicIcon, Zap, Terminal, AlertTriangle } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [systemStatus, setSystemStatus] = useState('STABLE');

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
    if (newScore > 0 && newScore % 100 === 0) {
      setSystemStatus('UNSTABLE');
      setTimeout(() => setSystemStatus('STABLE'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan selection:bg-magenta/50 overflow-hidden font-sans relative">
      {/* Glitch Overlays */}
      <div className="noise" />
      <div className="scanline" />
      
      {/* CRT Border */}
      <div className="fixed inset-0 border-[20px] border-black z-[10001] pointer-events-none shadow-[inset_0_0_100px_rgba(0,255,255,0.1)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex flex-col min-h-screen">
        {/* Header - Cryptic/Machine Tone */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 border-b-2 border-cyan/20 pb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-cyan/10 border-2 border-cyan flex items-center justify-center animate-pulse">
              <Terminal className="text-cyan" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-pixel glitch tracking-tighter uppercase" data-text="NEON_RHYTHM.EXE">
                NEON_RHYTHM.EXE
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-magenta animate-ping" />
                <p className="text-xs font-mono text-magenta uppercase tracking-widest">
                  SYSTEM_STATUS: {systemStatus} // KERNEL_V1.0.4
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-12 font-pixel">
            <div className="text-left md:text-right">
              <p className="text-[10px] text-cyan/40 uppercase mb-2 tracking-tighter">DATA_STREAM_SCORE</p>
              <div className="flex items-center md:justify-end gap-3">
                <Gamepad2 size={18} className="text-magenta" />
                <span className="text-3xl text-magenta glitch" data-text={score.toString().padStart(4, '0')}>
                  {score.toString().padStart(4, '0')}
                </span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] text-cyan/40 uppercase mb-2 tracking-tighter">MAX_BUFFER_REACHED</p>
              <div className="flex items-center md:justify-end gap-3">
                <Trophy size={18} className="text-white" />
                <span className="text-3xl text-white glitch" data-text={highScore.toString().padStart(4, '0')}>
                  {highScore.toString().padStart(4, '0')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Jarring Contrast */}
        <main className="flex-1 grid lg:grid-cols-[300px_1fr_300px] gap-8 items-start">
          {/* Left Panel - System Logs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden lg:block space-y-6 border-r-2 border-cyan/10 pr-6 h-full"
          >
            <div className="bg-magenta/5 border-2 border-magenta/20 p-4">
              <div className="flex items-center gap-2 text-magenta mb-3">
                <AlertTriangle size={16} />
                <h3 className="text-xs font-pixel uppercase">WARNING_LOG</h3>
              </div>
              <div className="font-mono text-[10px] space-y-2 text-magenta/60">
                <p>&gt; INITIALIZING_SNAKE_PROTOCOL...</p>
                <p>&gt; DETECTING_RHYTHM_SYNC...</p>
                <p>&gt; BUFFER_OVERFLOW_IMMINENT</p>
                <p className="text-magenta animate-pulse">&gt; AWAITING_INPUT_COMMAND</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-pixel leading-tight uppercase text-white">
                SYNC_OR_ <br />
                <span className="bg-cyan text-black px-1">TERMINATE</span>
              </h2>
              <p className="text-cyan/60 text-xs leading-relaxed font-mono">
                THE GRID IS A CONSTRUCT. THE RHYTHM IS THE KEY. DO NOT DISCONNECT.
              </p>
            </div>
          </motion.div>

          {/* Center - The Construct (Game) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-4"
          >
            <div className="relative p-2 border-4 border-cyan/30 bg-cyan/5">
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-magenta" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-magenta" />
              <SnakeGame onScoreChange={handleScoreChange} />
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-8 font-pixel text-[10px]">
              <div className="flex items-center gap-3 text-cyan/80">
                <div className="w-3 h-3 bg-cyan" />
                CMD: ARROWS_TO_NAVIGATE
              </div>
              <div className="flex items-center gap-3 text-magenta/80">
                <div className="w-3 h-3 bg-magenta" />
                CMD: SPACE_TO_HALT
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Audio Interface */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center lg:items-end gap-8 border-l-2 border-cyan/10 pl-6 h-full"
          >
            <div className="w-full text-left lg:text-right hidden lg:block">
              <h3 className="text-xs font-pixel uppercase text-cyan mb-4 tracking-widest">AUDIO_DECODER</h3>
              <div className="h-1 w-full bg-cyan/20 relative overflow-hidden">
                <motion.div 
                  animate={{ left: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute top-0 w-1/2 h-full bg-magenta"
                />
              </div>
            </div>
            <MusicPlayer />
          </motion.div>
        </main>

        {/* Footer - Machine Metadata */}
        <footer className="mt-12 pt-6 border-t-2 border-cyan/20 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-cyan/30 tracking-widest">
          <p>ENCRYPTION_KEY: 0x7F_NEON_RHYTHM // ALL_DATA_PERSISTED</p>
          <div className="flex gap-8 uppercase">
            <span className="hover:text-magenta cursor-crosshair transition-colors">SEC_PROTOCOL</span>
            <span className="hover:text-magenta cursor-crosshair transition-colors">DATA_USAGE</span>
            <span className="hover:text-magenta cursor-crosshair transition-colors">UPLINK_STATUS</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
