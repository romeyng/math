import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const tasks = [
  { standard: "345", expanded: "300 + 40 + 5", word: "Three hundred forty-five", options: ["30 + 400 + 5", "300 + 40 + 5", "3 + 4 + 5", "340 + 5"] },
  { standard: "1,024", expanded: "1000 + 20 + 4", word: "One thousand twenty-four", options: ["100 + 20 + 4", "1000 + 200 + 40", "1000 + 20 + 4", "1000 + 24"] },
  { standard: "89", expanded: "80 + 9", word: "Eighty-nine", options: ["800 + 9", "8 + 90", "80 + 9", "8 + 9"] },
  { standard: "4,092", expanded: "4000 + 90 + 2", word: "Four thousand ninety-two", options: ["400 + 90 + 2", "4000 + 900 + 2", "4000 + 90 + 2", "40 + 9 + 2"] },
  { standard: "715", expanded: "700 + 10 + 5", word: "Seven hundred fifteen", options: ["700 + 50 + 1", "700 + 10 + 5", "70 + 10 + 5", "700 + 15"] },
  { standard: "9,999", expanded: "9000 + 900 + 90 + 9", word: "Nine thousand nine hundred ninety-nine", options: ["9000 + 900 + 90 + 9", "900 + 90 + 9", "9000 + 999", "9000 + 900 + 99"] },
  { standard: "506", expanded: "500 + 6", word: "Five hundred six", options: ["500 + 60", "50 + 6", "500 + 0 + 60", "500 + 6"] },
  { standard: "2,300", expanded: "2000 + 300", word: "Two thousand three hundred", options: ["2000 + 30", "2000 + 300", "200 + 300", "2300 + 0"] },
  { standard: "15,402", expanded: "10000 + 5000 + 400 + 2", word: "Fifteen thousand four hundred two", options: ["15000 + 400 + 2", "10000 + 5000 + 400 + 20", "10000 + 5000 + 400 + 2", "10000 + 5000 + 40 + 2"] },
  { standard: "8,080", expanded: "8000 + 80", word: "Eight thousand eighty", options: ["800 + 80", "8000 + 800", "8000 + 8", "8000 + 80"] }
];

export default function NumberForms({ onCorrect, onIncorrect }) {
  const [taskIdx, setTaskIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const task = tasks[taskIdx];
  const isFinished = taskIdx >= tasks.length;

  const handleGuess = (opt) => {
    if (feedback === 'correct') return;
    if (opt === task.expanded) {
      setFeedback('correct');
      onCorrect();
    } else {
      setFeedback('incorrect');
      onIncorrect();
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setTaskIdx(i => i + 1);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-6xl">📝</div>
        <h2 className="text-3xl font-bold text-white">Forms Mastered!</h2>
        <button onClick={() => {setTaskIdx(0); setFeedback(null);}} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold">Restart</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-3xl p-8 border border-slate-700/50 items-center justify-center relative overflow-hidden">
      <div className="text-center mb-8 z-10">
        <h2 className="text-2xl font-bold text-slate-300 mb-2">Number Forms</h2>
        <p className="text-slate-400">Question {taskIdx + 1} of {tasks.length}</p>
        <p className="text-slate-400 mt-2">Match the standard number to its expanded form.</p>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-xl border border-indigo-500/30 text-center relative shadow-xl mb-8 z-10">
        <span className="text-sm text-indigo-400 font-bold uppercase tracking-widest block mb-2">Standard Form</span>
        <div className="text-6xl font-black text-white drop-shadow-md">{task.standard}</div>
        <div className="mt-4 text-slate-400 italic text-lg">"{task.word}"</div>
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-emerald-400">
              <CheckCircle size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl z-10 mb-6">
        {task.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleGuess(opt)}
            disabled={feedback === 'correct'}
            className={`font-mono text-xl py-6 rounded-xl transition-all border ${
              feedback === 'correct' && opt === task.expanded
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : feedback === 'incorrect' && opt !== task.expanded
                ? 'bg-slate-800 border-slate-700 text-slate-600 opacity-50'
                : 'bg-slate-700/80 hover:bg-indigo-600/50 hover:border-indigo-400 border-slate-600 text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl"
          >
            <button onClick={handleNext} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
              Next Question <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
