import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

const challenges = [
  { expr: "5 × 98", target: 490, hint: "Try using the Distributive Property by breaking 98 into (100 - 2)." },
  { expr: "25 × 17 × 4", target: 1700, hint: "Use the Commutative Property to group friendly numbers first (like 25 and 4)." },
  { expr: "6 × 8", target: 48, hint: "Distribute the 6 into (5 + 3)." },
  { expr: "103 + 48 + 97", target: 248, hint: "Use Associative/Commutative to pair numbers that easily sum to 200." },
  { expr: "24 × 5", target: 120, hint: "Try the 'Halve and Double' trick! Halve the 24, double the 5." },
  { expr: "7 × 101", target: 707, hint: "Distribute the 7 into (100 + 1)." },
  { expr: "37 + 89 + 13", target: 139, hint: "Use Commutative to group the 37 and 13 first to make a round 50." },
  { expr: "45 × 12", target: 540, hint: "Try Distributive (10+2) or Halve/Double (90 × 6)." },
  { expr: "4 × 39 × 25", target: 3900, hint: "Reorder to group the 4 and 25." },
  { expr: "(89 + 67) + 33", target: 189, hint: "Regroup the parentheses to pair 67 and 33 to make a flat 100." }
];

const evaluate = (expr) => {
  try {
    const safeExpr = expr.replace(/×/g, '*').replace(/x/gi, '*').replace(/÷/g, '/');
    if (/[^0-9+\-*/()\s.]/.test(safeExpr)) return null; 
    const result = Function(`'use strict'; return (${safeExpr})`)();
    return typeof result === 'number' && !isNaN(result) ? result : null;
  } catch (e) {
    return null;
  }
};

const normalize = (str) => str.replace(/\s+/g, '').replace(/x/gi, '*').replace(/×/g, '*').replace(/÷/g, '/');

export default function MentalMathChallenge({ onCorrect, onIncorrect }) {
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState('decompose'); // 'decompose' | 'solve' | 'complete'
  const [decompInput, setDecompInput] = useState('');
  const [solveInput, setSolveInput] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const challenge = challenges[qIndex];
  const isFinished = qIndex >= challenges.length;

  const handleDecomposeSubmit = (e) => {
    e.preventDefault();
    if (!decompInput.trim() || phase !== 'decompose') return;

    const val = evaluate(decompInput);
    if (val === null) {
      setErrorMsg("Invalid mathematical expression. Use numbers, +, -, *, /, and brackets.");
      return;
    }

    if (val !== challenge.target) {
      setErrorMsg(`Your expression equals ${val}, but it needs to equal the target value (${challenge.target}). Try again!`);
      onIncorrect();
      return;
    }

    if (normalize(decompInput) === normalize(challenge.expr)) {
      setErrorMsg("You just typed the original expression! Try breaking the numbers down (e.g. use parenthesis).");
      return;
    }

    setErrorMsg(null);
    setPhase('solve');
  };

  const handleSolveSubmit = (e) => {
    e.preventDefault();
    if (!solveInput.trim() || phase !== 'solve') return;

    if (parseFloat(solveInput) === challenge.target) {
      setErrorMsg(null);
      setPhase('complete');
      onCorrect();
    } else {
      setErrorMsg("Not quite! Check your math.");
      onIncorrect();
    }
  };

  const handleNext = () => {
    setQIndex(q => q + 1);
    setPhase('decompose');
    setDecompInput('');
    setSolveInput('');
    setErrorMsg(null);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-6xl text-yellow-400"><Zap /></div>
        <h2 className="text-3xl font-bold text-white">Mental Math Ninja!</h2>
        <button onClick={() => { setQIndex(0); setPhase('decompose'); setDecompInput(''); setSolveInput(''); }} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold">Restart</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-start relative bg-slate-900/50 rounded-3xl p-6 md:p-10 border border-slate-700/50 overflow-y-auto hide-scrollbar">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-300 mb-2 flex items-center justify-center gap-2">
          <Zap className="text-yellow-400" /> Mental Math Sandbox
        </h2>
        <p className="text-slate-400">Problem {qIndex + 1} of {challenges.length}</p>
      </div>

      <div className="w-full max-w-2xl bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-600 shadow-xl flex flex-col gap-6">
        
        {/* Original Expression */}
        <div className="flex flex-col items-center">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Original Expression</span>
          <div className="text-5xl md:text-6xl font-black text-white">
            {challenge.expr}
          </div>
        </div>

        <div className="bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-xl flex items-start gap-3 text-indigo-200">
          <Lightbulb className="shrink-0 text-yellow-400 mt-1" />
          <p>{challenge.hint}</p>
        </div>

        {/* Decompose Section */}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <label className="text-lg font-bold text-slate-200 block mb-2">How would you decompose this?</label>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              You can use <strong>any</strong> method to break down the expression! 
              Whether you break it into a sum/subtraction of many figures, or into a multiplication of many factors, 
              as long as it mathematically matches the original expression, it works.
            </p>
          </div>
          <form onSubmit={handleDecomposeSubmit} className="flex gap-2">
            <input 
              type="text"
              value={decompInput}
              onChange={(e) => { setDecompInput(e.target.value); setErrorMsg(null); }}
              placeholder="e.g. 5 * (100 - 2)"
              disabled={phase !== 'decompose'}
              className={`flex-1 bg-slate-900 border-2 p-4 rounded-xl text-xl font-mono text-center transition-all outline-none ${
                phase !== 'decompose' 
                  ? 'border-emerald-500/50 text-emerald-400 font-black shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-900/10'
                  : 'border-slate-700 focus:border-indigo-500 text-white'
              }`}
              autoFocus
            />
            {phase === 'decompose' ? (
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 rounded-xl font-bold text-white transition-colors">
                Verify
              </button>
            ) : (
              <div className="bg-emerald-900/30 border border-emerald-500/50 px-6 rounded-xl flex items-center justify-center text-emerald-400 shadow-sm">
                <CheckCircle />
              </div>
            )}
          </form>
        </div>

        {/* Solve Section */}
        <AnimatePresence>
          {phase !== 'decompose' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }} 
              animate={{ opacity: 1, height: 'auto', marginTop: 8 }} 
              className="flex flex-col gap-4 overflow-hidden"
            >
              <label className="text-lg font-bold text-slate-200 text-center">Now, what is the final answer?</label>
              <form onSubmit={handleSolveSubmit} className="flex gap-2">
                <input 
                  type="number"
                  value={solveInput}
                  onChange={(e) => { setSolveInput(e.target.value); setErrorMsg(null); }}
                  placeholder="="
                  disabled={phase === 'complete'}
                  className={`flex-1 bg-slate-900 border-2 p-4 rounded-xl text-2xl font-black text-center transition-all outline-none ${
                    phase === 'complete'
                      ? 'border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-900/10'
                      : 'border-indigo-500/50 focus:border-indigo-500 text-white'
                  }`}
                  autoFocus
                />
                {phase === 'solve' ? (
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-8 rounded-xl font-bold text-white transition-colors flex items-center gap-2">
                    Submit
                  </button>
                ) : (
                  <div className="bg-emerald-900/30 border border-emerald-500/50 px-8 rounded-xl flex items-center justify-center text-emerald-400 shadow-sm">
                    <CheckCircle />
                  </div>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 mt-2 rounded-xl border flex items-start gap-3 bg-rose-900/30 border-rose-800 text-rose-200">
                <AlertTriangle className="shrink-0 mt-0.5" />
                <p className="font-bold text-sm md:text-base">{errorMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Question Button */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="mt-4"
            >
              <button 
                onClick={handleNext}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Next Problem <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
