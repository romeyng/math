import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Calculator, Sparkles, Info, ArrowRight } from 'lucide-react';

const propertyDefs = {
  "Commutative": { def: "Think 'commute' or move. Numbers can travel or swap places without changing the result.", details: "a + b = b + a" },
  "Associative": { def: "Think 'associate' or group with friends. You can change how numbers group together.", details: "(a + b) + c = a + (b + c)" },
  "Distributive": { def: "Think 'distribute' or hand out. You distribute the outside number to every value in the brackets.", details: "a × (b + c) = (a × b) + (a × c)" },
  "Identity": { def: "Think 'identity' or looking in a mirror. The number keeps its original identity unchanged.", details: "a + 0 = a" },
  "Inverse": { def: "Think 'inverse' or opposite/undo. An operation that undoes a number back to zero or one.", details: "a + (-a) = 0" },
  "Undefined": { def: "Think 'undefined' or broken. The math breaks and has no definition, like dividing by zero.", details: "e.g., 12 ÷ 0" }
};

const statements = [
  { eq: "6 × (50 - 2) = 6 × 50 - 6 × 2", prop: "Distributive", exp: "Multiplies a single term across terms inside parentheses.",
    coloredEq: <><span className="text-amber-400">6</span> × (<span className="text-rose-400">50</span> - <span className="text-blue-400">2</span>) = <span className="text-amber-400">6</span> × <span className="text-rose-400">50</span> - <span className="text-amber-400">6</span> × <span className="text-blue-400">2</span></> },
  { eq: "(a + b) + c = a + (b + c)", prop: "Associative", exp: "Changing the grouping of addends does not change the sum.",
    coloredEq: <>(<span className="text-rose-400">a</span> + <span className="text-blue-400">b</span>) + <span className="text-emerald-400">c</span> = <span className="text-rose-400">a</span> + (<span className="text-blue-400">b</span> + <span className="text-emerald-400">c</span>)</> },
  { eq: "a + 0 = a", prop: "Identity", exp: "Adding zero leaves the number unchanged (Additive Identity).",
    coloredEq: <><span className="text-rose-400">a</span> + <span className="text-slate-400">0</span> = <span className="text-rose-400">a</span></> },
  { eq: "5 × 4 = 4 × 5", prop: "Commutative", exp: "Order of factors doesn't matter.",
    coloredEq: <><span className="text-rose-400">5</span> × <span className="text-blue-400">4</span> = <span className="text-blue-400">4</span> × <span className="text-rose-400">5</span></> },
  { eq: "x × (1/x) = 1", prop: "Inverse", exp: "Multiplying by the reciprocal gives the multiplicative identity (1).",
    coloredEq: <><span className="text-blue-400">x</span> × (<span className="text-blue-400">1/x</span>) = <span className="text-slate-400">1</span></> },
  { eq: "12 ÷ 0", prop: "Undefined", exp: "Division by zero has no defined value.",
    coloredEq: <><span className="text-rose-400">12</span> ÷ <span className="text-slate-400">0</span> = <span className="text-red-500 font-bold">Undefined</span></> },
  { eq: "17 + 38 = 38 + 17", prop: "Commutative", exp: "Changing the order of addition doesn't change the sum.",
    coloredEq: <><span className="text-rose-400">17</span> + <span className="text-blue-400">38</span> = <span className="text-blue-400">38</span> + <span className="text-rose-400">17</span></> },
  { eq: "(4 × 5) × 6 = 4 × (5 × 6)", prop: "Associative", exp: "Changing the grouping of multiplication doesn't change the product.",
    coloredEq: <>(<span className="text-rose-400">4</span> × <span className="text-blue-400">5</span>) × <span className="text-emerald-400">6</span> = <span className="text-rose-400">4</span> × (<span className="text-blue-400">5</span> × <span className="text-emerald-400">6</span>)</> },
  { eq: "8 × (10 + 3) = 80 + 24", prop: "Distributive", exp: "The 8 is distributed to both the 10 and the 3.",
    coloredEq: <><span className="text-amber-400">8</span> × (<span className="text-rose-400">10</span> + <span className="text-blue-400">3</span>) = <span className="text-emerald-400">80</span> + <span className="text-emerald-400">24</span></> },
  { eq: "-15 + 15 = 0", prop: "Inverse", exp: "Adding the additive inverse (opposite) yields zero.",
    coloredEq: <><span className="text-rose-400">-15</span> + <span className="text-rose-400">15</span> = <span className="text-slate-400">0</span></> },
  { eq: "99 × 1 = 99", prop: "Identity", exp: "Multiplying by one leaves the number unchanged (Multiplicative Identity).",
    coloredEq: <><span className="text-blue-400">99</span> × <span className="text-slate-400">1</span> = <span className="text-blue-400">99</span></> },
  { eq: "0 ÷ 0", prop: "Undefined", exp: "Zero divided by zero is undefined.",
    coloredEq: <><span className="text-rose-400">0</span> ÷ <span className="text-slate-400">0</span> = <span className="text-red-500 font-bold">Undefined</span></> },
  { eq: "(x + y) + z = x + (y + z)", prop: "Associative", exp: "Groups of variables can be shifted in addition.",
    coloredEq: <>(<span className="text-rose-400">x</span> + <span className="text-blue-400">y</span>) + <span className="text-emerald-400">z</span> = <span className="text-rose-400">x</span> + (<span className="text-blue-400">y</span> + <span className="text-emerald-400">z</span>)</> }
];

const Graphic = ({ type }) => {
  if (type === 'Commutative') {
    return (
      <div className="flex items-center gap-2 text-xl font-bold bg-slate-900/50 p-3 rounded-xl justify-center">
        <span className="text-rose-400">A</span> + <span className="text-blue-400">B</span> 
        <span className="text-slate-400 mx-2">=</span> 
        <span className="text-blue-400">B</span> + <span className="text-rose-400">A</span>
      </div>
    );
  }
  if (type === 'Associative') {
    return (
      <div className="flex items-center gap-2 text-xl font-bold bg-slate-900/50 p-3 rounded-xl justify-center">
        <span className="text-slate-500">(</span><span className="text-rose-400">A</span> + <span className="text-blue-400">B</span><span className="text-slate-500">)</span> + <span className="text-emerald-400">C</span>
        <span className="text-slate-400 mx-2">=</span> 
        <span className="text-rose-400">A</span> + <span className="text-slate-500">(</span><span className="text-blue-400">B</span> + <span className="text-emerald-400">C</span><span className="text-slate-500">)</span>
      </div>
    );
  }
  if (type === 'Distributive') {
    return (
      <div className="flex flex-col items-center gap-1 text-lg font-bold bg-slate-900/50 p-3 rounded-xl">
        <div><span className="text-amber-400">A</span> × (<span className="text-rose-400">B</span> + <span className="text-blue-400">C</span>)</div>
        <div className="text-slate-400 text-sm">becomes</div>
        <div>(<span className="text-amber-400">A</span>×<span className="text-rose-400">B</span>) + (<span className="text-amber-400">A</span>×<span className="text-blue-400">C</span>)</div>
      </div>
    );
  }
  if (type === 'Identity') {
    return (
      <div className="flex flex-col items-center gap-1 text-lg font-bold bg-slate-900/50 p-3 rounded-xl">
        <div><span className="text-rose-400">A</span> + <span className="text-slate-400">0</span> = <span className="text-rose-400">A</span></div>
        <div><span className="text-blue-400">A</span> × <span className="text-slate-400">1</span> = <span className="text-blue-400">A</span></div>
      </div>
    );
  }
  if (type === 'Inverse') {
    return (
      <div className="flex flex-col items-center gap-1 text-lg font-bold bg-slate-900/50 p-3 rounded-xl">
        <div><span className="text-rose-400">A</span> + (<span className="text-rose-400">-A</span>) = <span className="text-slate-400">0</span></div>
        <div><span className="text-blue-400">A</span> × (<span className="text-blue-400">1/A</span>) = <span className="text-slate-400">1</span></div>
      </div>
    );
  }
  if (type === 'Undefined') {
    return (
      <div className="flex items-center gap-2 text-xl font-bold bg-slate-900/50 p-3 rounded-xl justify-center">
        <span className="text-rose-400">A</span> ÷ <span className="text-slate-400">0</span> = <span className="text-red-500">🚫</span>
      </div>
    );
  }
  return null;
};

export default function PropertiesSorting({ onCorrect, onIncorrect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); 
  const [showMentalMath, setShowMentalMath] = useState(false);
  const [mentalMathInput, setMentalMathInput] = useState("8 × 99");

  const currentStatement = statements[currentIndex];
  const isFinished = currentIndex >= statements.length;

  const handleCategoryClick = (prop) => {
    if (feedback !== null) return;
    
    if (prop === currentStatement.prop) {
      setFeedback({ status: 'correct', clicked: prop });
      onCorrect();
    } else {
      setFeedback({ status: 'incorrect', clicked: prop });
      onIncorrect();
      // Remove the auto-dismiss so they can try again.
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setCurrentIndex(i => i + 1);
  };

  const renderMentalMath = () => {
    const match = mentalMathInput.match(/^(\d+)\s*×\s*(\d+)$/);
    let breakdown = null;
    if (match) {
      const a = parseInt(match[1]);
      const b = parseInt(match[2]);
      const roundNum = Math.ceil(b / 10) * 10;
      const diff = roundNum - b;
      
      if (diff > 0 && diff < 5) {
        breakdown = (
          <div className="mt-4 p-4 bg-indigo-900/40 rounded-xl border border-indigo-500/30 font-mono text-lg">
            <p className="text-indigo-200">{a} × {b}</p>
            <p className="text-slate-300">= {a} × ({roundNum} - {diff})</p>
            <p className="text-slate-300">= ({a} × {roundNum}) - ({a} × {diff})</p>
            <p className="text-slate-300">= {a * roundNum} - {a * diff}</p>
            <p className="text-emerald-400 font-bold">= {a * b}</p>
          </div>
        );
      } else {
        breakdown = <p className="text-slate-400 mt-4">Try something like "8 × 99" or "6 × 48" to see the magic.</p>;
      }
    }

    return (
      <div className="mt-8 bg-slate-800/80 p-6 rounded-2xl border border-indigo-500/30">
        <div className="flex items-center gap-2 mb-4 text-indigo-300 font-bold text-lg">
          <Sparkles /> Mental Math Strategy (Distributive)
        </div>
        <div className="flex gap-2">
          <input 
            value={mentalMathInput}
            onChange={(e) => setMentalMathInput(e.target.value)}
            className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex-1 text-white font-mono focus:outline-none focus:border-indigo-500"
            placeholder="e.g. 7 × 98"
          />
        </div>
        {breakdown}
      </div>
    );
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-6xl">🏆</div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Properties Mastered!
        </h2>
        <button onClick={() => {setCurrentIndex(0); setFeedback(null);}} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold">Restart</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <div className="flex-1 flex flex-col">
        <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700 mb-6 flex-1 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button 
              onClick={() => setShowMentalMath(!showMentalMath)}
              className="flex items-center gap-2 text-sm bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-full hover:bg-indigo-600/40 transition-colors"
            >
              <Calculator size={16} /> Strategy Calc
            </button>
          </div>
          
          <h3 className="text-slate-400 font-semibold mb-6 uppercase tracking-wider text-sm">Categorize this statement ({currentIndex + 1}/{statements.length})</h3>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex + (feedback?.status === 'correct' ? 'colored' : 'uncolored')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-4xl md:text-5xl font-black text-white mb-8 text-center"
            >
              {feedback?.status === 'correct' ? currentStatement.coloredEq : currentStatement.eq}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {feedback && feedback.status === 'correct' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md flex flex-col gap-4"
              >
                <div className="p-4 rounded-xl border flex items-center gap-3 bg-emerald-900/30 border-emerald-500/50 text-emerald-200">
                  <CheckCircle className="shrink-0" />
                  <div>
                    <p className="font-bold">Correct!</p>
                    <p className="text-sm opacity-90">{currentStatement.exp}</p>
                  </div>
                </div>
                <button onClick={handleNext} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                  Next Question <ArrowRight size={20} />
                </button>
              </motion.div>
            )}
            
            {feedback && feedback.status === 'incorrect' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl border flex items-center gap-3 w-full max-w-md bg-rose-900/30 border-rose-500/50 text-rose-200"
              >
                <XCircle className="shrink-0" />
                <div>
                  <p className="font-bold">Try Again!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showMentalMath && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {renderMentalMath()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full md:w-96 flex flex-col gap-3 overflow-y-auto pr-2 hide-scrollbar">
        {Object.entries(propertyDefs).map(([prop, data]) => {
          const isCorrectAndClicked = feedback?.status === 'correct' && feedback.clicked === prop;
          const isIncorrectAndClicked = feedback?.status === 'incorrect' && feedback.clicked === prop;
          
          return (
            <button
              key={prop}
              onClick={() => handleCategoryClick(prop)}
              disabled={feedback?.status === 'correct'}
              className={`p-4 rounded-xl text-left transition-all border flex flex-col gap-2 ${
                isCorrectAndClicked
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105 z-10'
                  : isIncorrectAndClicked
                  ? 'bg-rose-900/50 text-rose-300 border-rose-700/50'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-lg">{prop}</span>
                <Info size={16} className="text-slate-500" />
              </div>
              <span className="text-xs text-slate-400 line-clamp-2">{data.def}</span>
              <Graphic type={prop} />
            </button>
          )
        })}
      </div>
    </div>
  );
}
