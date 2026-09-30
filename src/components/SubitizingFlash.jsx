import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const generateDots = (count) => {
  // Generate positions for dots in a grid-like or ten-frame manner
  const positions = [];
  const availableSlots = Array.from({ length: 10 }, (_, i) => i);
  
  // Shuffle slots
  for (let i = availableSlots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableSlots[i], availableSlots[j]] = [availableSlots[j], availableSlots[i]];
  }
  
  return availableSlots.slice(0, count);
};

export default function SubitizingFlash({ onCorrect, onIncorrect }) {
  const [gameState, setGameState] = useState('idle'); // 'idle', 'flashing', 'guessing', 'result'
  const [targetCount, setTargetCount] = useState(0);
  const [dots, setDots] = useState([]);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const inputRef = useRef(null);
  const isFinished = roundsCompleted >= 12;

  const startRound = () => {
    const count = Math.floor(Math.random() * 8) + 3; // 3 to 10
    setTargetCount(count);
    setDots(generateDots(count));
    setGameState('flashing');
    setGuess('');
    setFeedback(null);

    setTimeout(() => {
      setGameState('guessing');
    }, 1000); // Flash for 1 second
  };

  useEffect(() => {
    if (gameState === 'guessing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess) return;

    const numGuess = parseInt(guess, 10);
    if (numGuess === targetCount) {
      setFeedback('correct');
      onCorrect();
    } else {
      setFeedback('incorrect');
      onIncorrect();
    }
    setGameState('result');
  };

  const handleNext = () => {
    setRoundsCompleted(r => r + 1);
    if (roundsCompleted + 1 < 12) {
      startRound();
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-6xl">⚡</div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
          Subitizing Speedster!
        </h2>
        <button onClick={() => {setRoundsCompleted(0); setGameState('idle');}} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold">Play Again</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center relative">
      <div className="w-full max-w-2xl bg-slate-800/80 rounded-3xl border border-slate-700 p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center">
        
        {/* Round Counter */}
        <div className="absolute top-4 left-4 right-4 flex justify-between text-slate-400 font-bold text-sm">
          <span>Speed Flash Training</span>
          <span>Round {roundsCompleted + 1} / 12</span>
        </div>

        {gameState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <EyeOff className="text-indigo-400 w-20 h-20 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Subitize?</h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Dots will flash on the screen for exactly 1 second. Don't count them individually—try to recognize the pattern instantly!
            </p>
            <button 
              onClick={startRound}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-bold py-4 px-12 rounded-full flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
            >
              <Play fill="currentColor" /> Start Flash
            </button>
          </motion.div>
        )}

        {gameState === 'flashing' && (
          <div className="grid grid-cols-5 gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-16 h-16 flex items-center justify-center">
                <AnimatePresence>
                  {dots.includes(i) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-12 h-12 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {(gameState === 'guessing' || gameState === 'result') && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <h3 className="text-2xl font-bold text-white mb-6">How many dots did you see?</h3>
            
            <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
              <input
                ref={inputRef}
                type="number"
                min="1"
                max="20"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                disabled={gameState === 'result'}
                className="flex-1 bg-slate-900 border-2 border-indigo-500/50 rounded-xl text-center text-4xl font-bold text-white py-4 focus:outline-none focus:border-indigo-400 disabled:opacity-50"
                autoFocus
              />
              {gameState === 'guessing' && (
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 rounded-xl transition-colors">
                  Check
                </button>
              )}
            </form>

            <AnimatePresence>
              {gameState === 'result' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 w-full mb-6 ${
                    feedback === 'correct' ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300' : 'bg-rose-900/40 border-rose-500 text-rose-300'
                  }`}>
                    {feedback === 'correct' ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                    <span className="text-xl font-bold">
                      {feedback === 'correct' ? 'Spot on!' : `Missed it! There were ${targetCount} dots.`}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-12 rounded-xl w-full"
                  >
                    Next Round
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
