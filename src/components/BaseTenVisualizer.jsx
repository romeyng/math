import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight, CheckCircle, ArrowLeftRight } from 'lucide-react';

const challenges = [
  { target: 53, req: { standard: { tt: 0, th: 0, h: 0, t: 5, o: 3 }, flexible: { tt: 0, th: 0, h: 0, t: 4, o: 13 } } },
  { target: 134, req: { standard: { tt: 0, th: 0, h: 1, t: 3, o: 4 }, flexible: { tt: 0, th: 0, h: 0, t: 13, o: 4 } } },
  { target: 61, req: { standard: { tt: 0, th: 0, h: 0, t: 6, o: 1 }, flexible: { tt: 0, th: 0, h: 0, t: 5, o: 11 } } },
  { target: 4092, req: { standard: { tt: 0, th: 4, h: 0, t: 9, o: 2 }, flexible: { tt: 0, th: 3, h: 10, t: 9, o: 2 } } },
  { target: 12050, req: { standard: { tt: 1, th: 2, h: 0, t: 5, o: 0 }, flexible: { tt: 0, th: 12, h: 0, t: 5, o: 0 } } },
  { target: 300, req: { standard: { tt: 0, th: 0, h: 3, t: 0, o: 0 }, flexible: { tt: 0, th: 0, h: 2, t: 10, o: 0 } } },
  { target: 1024, req: { standard: { tt: 0, th: 1, h: 0, t: 2, o: 4 }, flexible: { tt: 0, th: 0, h: 10, t: 2, o: 4 } } },
  { target: 2500, req: { standard: { tt: 0, th: 2, h: 5, t: 0, o: 0 }, flexible: { tt: 0, th: 1, h: 15, t: 0, o: 0 } } },
  { target: 10001, req: { standard: { tt: 1, th: 0, h: 0, t: 0, o: 1 }, flexible: { tt: 0, th: 10, h: 0, t: 0, o: 1 } } },
  { target: 405, req: { standard: { tt: 0, th: 0, h: 4, t: 0, o: 5 }, flexible: { tt: 0, th: 0, h: 3, t: 10, o: 5 } } }
];

export default function BaseTenVisualizer({ onCorrect, onIncorrect }) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [vals, setVals] = useState({ tt: 0, th: 0, h: 0, t: 0, o: 0 });
  const [mode, setMode] = useState('standard');
  const [success, setSuccess] = useState(false);

  const currentChallenge = challenges[challengeIdx];
  const isFinished = challengeIdx >= challenges.length;

  useEffect(() => {
    if (!currentChallenge || success) return;
    const req = currentChallenge.req[mode];
    if (vals.tt === req.tt && vals.th === req.th && vals.h === req.h && vals.t === req.t && vals.o === req.o) {
      setSuccess(true);
      onCorrect();
    }
  }, [vals, mode, currentChallenge, success, onCorrect]);

  const handleNextPhase = () => {
    if (mode === 'standard') {
      setMode('flexible');
      setSuccess(false);
    } else {
      setMode('standard');
      setSuccess(false);
      setChallengeIdx(i => i + 1);
      setVals({ tt: 0, th: 0, h: 0, t: 0, o: 0 });
    }
  };

  const exchange = (from, to, multiplier) => {
    setVals(prev => {
      if (prev[from] >= 1) {
        return { ...prev, [from]: prev[from] - 1, [to]: prev[to] + multiplier };
      }
      return prev;
    });
  };

  const group = (from, to, amount) => {
    setVals(prev => {
      if (prev[from] >= amount) {
        return { ...prev, [from]: prev[from] - amount, [to]: prev[to] + 1 };
      }
      return prev;
    });
  };

  const modify = (place, delta) => {
    setVals(prev => ({ ...prev, [place]: Math.max(0, prev[place] + delta) }));
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-6xl">🧩</div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
          Base-Ten Mastered!
        </h2>
        <button onClick={() => {setChallengeIdx(0); setMode('standard'); setVals({ tt: 0, th: 0, h: 0, t: 0, o: 0 });}} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold">Restart</button>
      </div>
    );
  }

  const currentValue = vals.tt * 10000 + vals.th * 1000 + vals.h * 100 + vals.t * 10 + vals.o;

  const Column = ({ title, valKey, color, bg, breakTo, groupTo }) => (
    <div className={`flex-1 flex flex-col items-center border border-slate-700/50 rounded-xl ${bg} relative overflow-hidden`}>
      <div className="w-full bg-slate-800/80 p-2 text-center border-b border-slate-700/50 relative z-10">
        <h3 className={`font-bold text-xs uppercase tracking-wider ${color}`}>{title}</h3>
        <div className="flex justify-center gap-1 mt-2">
          <button onClick={() => modify(valKey, -1)} className="bg-slate-700 hover:bg-slate-600 rounded p-1 w-8 flex justify-center text-white"><Minus size={16}/></button>
          <div className="w-10 text-center font-bold text-lg bg-slate-900 rounded">{vals[valKey]}</div>
          <button onClick={() => modify(valKey, 1)} className="bg-slate-700 hover:bg-slate-600 rounded p-1 w-8 flex justify-center text-white"><Plus size={16}/></button>
        </div>
        <div className="flex justify-center gap-1 mt-2 text-xs">
          {breakTo && <button onClick={() => exchange(valKey, breakTo, 10)} disabled={vals[valKey] === 0} className="bg-amber-600/20 text-amber-400 px-2 py-1 rounded hover:bg-amber-600/40 disabled:opacity-30">Break</button>}
          {groupTo && <button onClick={() => group(valKey, groupTo, 10)} disabled={vals[valKey] < 10} className="bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded hover:bg-indigo-600/40 disabled:opacity-30">Group</button>}
        </div>
      </div>
      
      <div className="flex-1 w-full p-2 flex flex-wrap gap-1 content-start overflow-y-auto max-h-[300px]">
        <AnimatePresence>
          {Array.from({ length: vals[valKey] }).map((_, i) => (
            <motion.div
              key={`${valKey}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={`flex items-center justify-center font-bold text-xs shadow-md border ${color.replace('text-', 'bg-').replace('300', '600')} ${color.replace('text-', 'border-').replace('300', '400')} text-white rounded`}
              style={{
                width: valKey === 'tt' ? '100%' : valKey === 'th' ? '100%' : valKey === 'h' ? '45%' : valKey === 't' ? '8px' : '16px',
                height: valKey === 't' ? '80px' : '16px',
                padding: valKey === 'tt' || valKey === 'th' || valKey === 'h' ? '2px' : '0'
              }}
            >
              {(valKey === 'tt' || valKey === 'th' || valKey === 'h') && (valKey === 'tt' ? '10K' : valKey === 'th' ? '1K' : '100')}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-4 relative">
      <div className="bg-slate-800/80 p-4 md:p-6 rounded-3xl border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Target: <span className="text-4xl text-amber-400 ml-2">{currentChallenge.target.toLocaleString()}</span></h2>
          <p className="text-slate-400 mt-1">
            Mode: <span className="text-indigo-400 font-bold uppercase tracking-wider">{mode} Form</span>
          </p>
          <p className="text-sm text-slate-500">
            {mode === 'standard' 
              ? "Use the standard number of places (e.g. 5 tens, 3 ones)." 
              : "Regroup! Break a larger place value into smaller ones to match the target value."}
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center bg-slate-900 p-4 rounded-2xl min-w-[150px]">
          <span className="text-sm text-slate-400 font-bold mb-1">Current Value</span>
          <span className={`text-5xl font-black ${currentValue === currentChallenge.target ? 'text-emerald-400' : 'text-white'}`}>
            {currentValue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex-1 flex gap-2 w-full overflow-x-auto min-h-[400px]">
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl"
          >
            <div className="bg-emerald-900/50 border border-emerald-500 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <CheckCircle className="text-emerald-400 w-20 h-20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Perfect Representation!</h3>
              <p className="text-emerald-200 mb-6">You modeled {currentChallenge.target.toLocaleString()} correctly in {mode} form.</p>
              <button 
                onClick={handleNextPhase}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-8 rounded-xl flex items-center gap-2 mx-auto transition-all"
              >
                {mode === 'standard' ? 'Next: Flexible Form' : 'Next Challenge'} <ArrowRight />
              </button>
            </div>
          </motion.div>
        )}

        <Column title="10,000s" valKey="tt" color="text-purple-300" bg="bg-purple-900/10" breakTo="th" groupTo={null} />
        <Column title="1,000s" valKey="th" color="text-blue-300" bg="bg-blue-900/10" breakTo="h" groupTo="tt" />
        <Column title="100s" valKey="h" color="text-emerald-300" bg="bg-emerald-900/10" breakTo="t" groupTo="th" />
        <Column title="10s" valKey="t" color="text-amber-300" bg="bg-amber-900/10" breakTo="o" groupTo="h" />
        <Column title="1s" valKey="o" color="text-rose-300" bg="bg-rose-900/10" breakTo={null} groupTo="t" />
      </div>
    </div>
  );
}
