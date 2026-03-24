import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300",
    color: "cyan"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Glitch Master",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300",
    color: "fuchsia"
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "Lo-Fi Bot",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300",
    color: "purple"
  }
];

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-cyan/30 p-6 font-mono relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan/10" />
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-start gap-4 mb-8">
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-24 h-24 border-2 border-magenta p-1 bg-black"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-end justify-center pb-2 bg-magenta/10">
              <div className="flex gap-1 items-end h-8">
                {[1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 24, 8, 20, 4] }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }}
                    className="w-1.5 bg-magenta"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
        
        <div className="flex-1 space-y-2">
          <div className="bg-cyan/10 px-2 py-1 inline-block">
            <h3 className="text-cyan font-pixel text-[10px] leading-tight uppercase glitch" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
          </div>
          <p className="text-magenta text-xs uppercase tracking-tighter">&gt; {currentTrack.artist}</p>
          <div className="text-[8px] text-cyan/40 uppercase">BITRATE: 128KBPS // STEREO</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative h-4 bg-cyan/5 border border-cyan/20">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyan/40"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] text-cyan font-bold mix-blend-difference">
            {Math.floor(progress)}%_DECODED
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={skipBackward}
            className="p-2 border-2 border-cyan/20 text-cyan hover:border-cyan hover:bg-cyan/10 transition-all cursor-crosshair"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-8 py-2 border-2 border-magenta text-magenta hover:bg-magenta hover:text-black transition-all font-pixel text-[10px] uppercase cursor-crosshair shadow-[4px_4px_0_rgba(255,0,255,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            {isPlaying ? 'HALT_AUDIO' : 'EXEC_AUDIO'}
          </button>
          
          <button 
            onClick={skipForward}
            className="p-2 border-2 border-cyan/20 text-cyan hover:border-cyan hover:bg-cyan/10 transition-all cursor-crosshair"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-cyan/20">
          <Music size={14} />
          <div className="flex-1 h-0.5 bg-cyan/10 relative">
            <div className="absolute top-0 left-0 w-2/3 h-full bg-cyan/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
