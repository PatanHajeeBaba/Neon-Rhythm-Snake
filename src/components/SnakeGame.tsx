import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(true);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className="grid bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full transition-all duration-200 ${
                isSnakeHead 
                  ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' 
                  : isSnakeBody 
                    ? 'bg-cyan-600/60' 
                    : isFood 
                      ? 'bg-fuchsia-500 shadow-[0_0_10px_#d946ef] rounded-full scale-75 animate-pulse' 
                      : 'border-[0.5px] border-white/5'
              }`}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {(isPaused || isGameOver) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-lg"
          >
            <div className="text-center p-8 flex flex-col items-center justify-between min-h-[300px] font-pixel">
              <div className="flex-1 flex flex-col items-center justify-center">
                {isGameOver ? (
                  <h2 className="text-3xl font-black mb-6 text-magenta glitch tracking-tighter uppercase" data-text="FATAL_ERROR">
                    FATAL_ERROR
                  </h2>
                ) : (
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="text-cyan mb-12"
                  >
                    <Pause size={80} fill="currentColor" strokeWidth={0} />
                  </motion.div>
                )}

                {isGameOver && (
                  <div className="space-y-4 mb-8">
                    <p className="text-white/70 font-mono text-sm tracking-widest">
                      BUFFER_SCORE: <span className="text-magenta">{score.toString().padStart(4, '0')}</span>
                    </p>
                    <p className="text-magenta/40 text-[8px] animate-pulse">RECOVERY_MODE_AVAILABLE</p>
                  </div>
                )}

                <button
                  onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                  className="w-20 h-20 flex items-center justify-center bg-transparent border-4 border-cyan text-cyan hover:bg-cyan hover:text-black transition-all shadow-[4px_4px_0_rgba(0,255,255,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none group relative cursor-crosshair"
                >
                  {isGameOver ? (
                    <RotateCcw size={32} className="group-hover:rotate-180 transition-transform duration-500" />
                  ) : (
                    <Play size={32} fill="currentColor" className="ml-1" />
                  )}
                </button>
              </div>

              <p className="mt-12 text-cyan/30 text-[8px] font-bold uppercase tracking-[0.4em] animate-pulse">
                {isGameOver ? 'EXECUTE_RESTART' : 'AWAITING_RESUME_CMD'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;
