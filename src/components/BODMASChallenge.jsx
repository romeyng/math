import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const problems = [
  {
    expression: "8 + 2 × (5 - 3)",
    steps: [
      { options: ["Addition (8 + 2)", "Multiplication (2 × ...)", "Brackets (5 - 3)"], correctIndex: 2, trap: "Brackets always come first!", htmlExpression: "8 + 2 × <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>2</span>" },
      { options: ["Addition (8 + 2)", "Multiplication (2 × 2)"], correctIndex: 1, trap: "Multiplication comes before Addition!", htmlExpression: "8 + <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>4</span>" },
      { options: ["Addition (8 + 4)", "Subtraction (8 - 4)"], correctIndex: 0, trap: "Just simple addition now.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>12</span>" }
    ]
  },
  {
    expression: "12 ÷ 4 × 3",
    steps: [
      { options: ["Division (12 ÷ 4)", "Multiplication (4 × 3)"], correctIndex: 0, trap: "Division and Multiplication have SAME priority. Left-to-Right!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>3</span> × 3" },
      { options: ["Multiplication (3 × 3)", "Addition (3 + 3)"], correctIndex: 0, trap: "Multiply!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>9</span>" }
    ]
  },
  {
    expression: "20 - 4 + 6",
    steps: [
      { options: ["Subtraction (20 - 4)", "Addition (4 + 6)"], correctIndex: 0, trap: "Addition and Subtraction have SAME priority. Left-to-Right!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>16</span> + 6" },
      { options: ["Addition (16 + 6)", "Subtraction (16 - 6)"], correctIndex: 0, trap: "Add!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>22</span>" }
    ]
  },
  {
    expression: "5 × 2² - 8",
    steps: [
      { options: ["Multiplication (5 × 2)", "Orders / Exponents (2²)", "Subtraction (2 - 8)"], correctIndex: 1, trap: "Orders (Exponents) come right after Brackets!", htmlExpression: "5 × <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>4</span> - 8" },
      { options: ["Multiplication (5 × 4)", "Subtraction (4 - 8)"], correctIndex: 0, trap: "Multiplication comes before Subtraction.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>20</span> - 8" },
      { options: ["Subtraction (20 - 8)", "Addition (20 + 8)"], correctIndex: 0, trap: "Subtract!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>12</span>" }
    ]
  },
  {
    expression: "15 - (3 + 2) × 2",
    steps: [
      { options: ["Subtraction (15 - 3)", "Brackets (3 + 2)", "Multiplication (2 × 2)"], correctIndex: 1, trap: "Brackets first!", htmlExpression: "15 - <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>5</span> × 2" },
      { options: ["Subtraction (15 - 5)", "Multiplication (5 × 2)"], correctIndex: 1, trap: "Multiplication is higher priority than Subtraction.", htmlExpression: "15 - <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>10</span>" },
      { options: ["Subtraction (15 - 10)", "Multiplication (15 × 10)"], correctIndex: 0, trap: "Basic subtraction.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>5</span>" }
    ]
  },
  {
    expression: "40 ÷ (2 × 4)",
    steps: [
      { options: ["Division (40 ÷ 2)", "Brackets (2 × 4)"], correctIndex: 1, trap: "Brackets force you to multiply first!", htmlExpression: "40 ÷ <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>8</span>" },
      { options: ["Division (40 ÷ 8)", "Multiplication (40 × 8)"], correctIndex: 0, trap: "Basic division.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>5</span>" }
    ]
  },
  {
    expression: "18 + 6 ÷ 2 - 3",
    steps: [
      { options: ["Addition (18 + 6)", "Division (6 ÷ 2)", "Subtraction (2 - 3)"], correctIndex: 1, trap: "Division has the highest priority here.", htmlExpression: "18 + <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>3</span> - 3" },
      { options: ["Addition (18 + 3)", "Subtraction (3 - 3)"], correctIndex: 0, trap: "Addition and Subtraction are equal priority, go Left-to-Right!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>21</span> - 3" },
      { options: ["Subtraction (21 - 3)", "Division (21 ÷ 3)"], correctIndex: 0, trap: "Basic subtraction.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>18</span>" }
    ]
  },
  {
    expression: "(10 - 2) ÷ 2 + 5",
    steps: [
      { options: ["Brackets (10 - 2)", "Division (2 ÷ 2)", "Addition (2 + 5)"], correctIndex: 0, trap: "Brackets always lead.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>8</span> ÷ 2 + 5" },
      { options: ["Division (8 ÷ 2)", "Addition (2 + 5)"], correctIndex: 0, trap: "Division is before Addition.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>4</span> + 5" },
      { options: ["Addition (4 + 5)", "Multiplication (4 × 5)"], correctIndex: 0, trap: "Basic addition.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>9</span>" }
    ]
  },
  {
    expression: "3 × (4 + 6) ÷ 5",
    steps: [
      { options: ["Multiplication (3 × 4)", "Brackets (4 + 6)", "Division (6 ÷ 5)"], correctIndex: 1, trap: "Brackets resolve first.", htmlExpression: "3 × <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>10</span> ÷ 5" },
      { options: ["Multiplication (3 × 10)", "Division (10 ÷ 5)"], correctIndex: 0, trap: "Left-to-Right for equal priority!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>30</span> ÷ 5" },
      { options: ["Division (30 ÷ 5)", "Multiplication (30 × 5)"], correctIndex: 0, trap: "Basic division.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>6</span>" }
    ]
  },
  {
    expression: "100 - 20 × 3 + 10",
    steps: [
      { options: ["Subtraction (100 - 20)", "Multiplication (20 × 3)", "Addition (3 + 10)"], correctIndex: 1, trap: "Multiplication beats addition/subtraction.", htmlExpression: "100 - <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>60</span> + 10" },
      { options: ["Subtraction (100 - 60)", "Addition (60 + 10)"], correctIndex: 0, trap: "Left-to-Right for subtraction and addition.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>40</span> + 10" },
      { options: ["Addition (40 + 10)", "Subtraction (40 - 10)"], correctIndex: 0, trap: "Basic addition.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>50</span>" }
    ]
  },
  {
    expression: "36 ÷ (12 - 3 × 2) + 4² × 2",
    steps: [
      { options: ["Division (36 ÷ 12)", "Brackets Subtraction (12 - 3)", "Brackets Multiplication (3 × 2)"], correctIndex: 2, trap: "Inside the brackets, multiplication comes before subtraction!", htmlExpression: "36 ÷ (12 - <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>6</span>) + 4² × 2" },
      { options: ["Division (36 ÷ 12)", "Brackets Subtraction (12 - 6)", "Exponents (4²)"], correctIndex: 1, trap: "Finish solving the entire bracket first!", htmlExpression: "36 ÷ <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>6</span> + 4² × 2" },
      { options: ["Division (36 ÷ 6)", "Exponents (4²)", "Multiplication (4² × 2)"], correctIndex: 1, trap: "Exponents (Orders) come before Division and Multiplication!", htmlExpression: "36 ÷ 6 + <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>16</span> × 2" },
      { options: ["Division (36 ÷ 6)", "Addition (6 + 16)", "Multiplication (16 × 2)"], correctIndex: 0, trap: "Division and Multiplication are equal priority, process Left-to-Right!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>6</span> + 16 × 2" },
      { options: ["Addition (6 + 16)", "Multiplication (16 × 2)"], correctIndex: 1, trap: "Multiplication comes before addition!", htmlExpression: "6 + <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>32</span>" },
      { options: ["Addition (6 + 32)", "Subtraction (32 - 6)"], correctIndex: 0, trap: "Final step is addition.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>38</span>" }
    ]
  },
  {
    expression: "100 - (50 + 2) ÷ 2 + 3 × (4² - 6)",
    steps: [
      { options: ["Left Brackets (50 + 2)", "Right Brackets Exponent (4²)", "Right Brackets Subtraction (4 - 6)"], correctIndex: 0, trap: "Both brackets can be solved, but solving the left one first is standard Left-to-Right.", htmlExpression: "100 - <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>52</span> ÷ 2 + 3 × (4² - 6)" },
      { options: ["Division (52 ÷ 2)", "Right Brackets Exponent (4²)", "Right Brackets Subtraction (4² - 6)"], correctIndex: 1, trap: "Must finish the remaining brackets, and exponents go first inside!", htmlExpression: "100 - 52 ÷ 2 + 3 × (<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>16</span> - 6)" },
      { options: ["Subtraction (100 - 52)", "Division (52 ÷ 2)", "Right Brackets Subtraction (16 - 6)"], correctIndex: 2, trap: "Finish the brackets before doing outside division!", htmlExpression: "100 - 52 ÷ 2 + 3 × <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>10</span>" },
      { options: ["Subtraction (100 - 52)", "Division (52 ÷ 2)", "Multiplication (3 × 10)"], correctIndex: 1, trap: "Division and Multiplication are equal priority, process Left-to-Right!", htmlExpression: "100 - <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>26</span> + 3 × 10" },
      { options: ["Subtraction (100 - 26)", "Addition (26 + 3)", "Multiplication (3 × 10)"], correctIndex: 2, trap: "Multiplication comes before addition or subtraction!", htmlExpression: "100 - 26 + <span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>30</span>" },
      { options: ["Subtraction (100 - 26)", "Addition (26 + 30)"], correctIndex: 0, trap: "Addition and Subtraction are equal priority. Must process Left-to-Right!", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>74</span> + 30" },
      { options: ["Addition (74 + 30)", "Subtraction (74 - 30)"], correctIndex: 0, trap: "Final addition step.", htmlExpression: "<span class='text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'>104</span>" }
    ]
  }
];

export default function BODMASChallenge({ onCorrect, onIncorrect }) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [history, setHistory] = useState([]); // { optionText: "", htmlExpression: "" }
  const [errorMsg, setErrorMsg] = useState(null);

  const problem = problems[problemIndex];
  const isFinished = problemIndex >= problems.length;
  const isProblemComplete = problem && stepIndex >= problem.steps.length;

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 bg-slate-900 rounded-3xl p-8 border border-slate-800">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
          BODMAS Master!
        </h2>
        <button onClick={() => { setProblemIndex(0); setStepIndex(0); setHistory([]); setErrorMsg(null); }} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all">
          Restart Challenge
        </button>
      </div>
    );
  }

  const currentStep = !isProblemComplete ? problem.steps[stepIndex] : null;

  const handleOptionClick = (idx) => {
    if (isProblemComplete) return;
    
    if (idx === currentStep.correctIndex) {
      setErrorMsg(null);
      setHistory([
        ...history, 
        { optionText: currentStep.options[idx], htmlExpression: currentStep.htmlExpression }
      ]);
      setStepIndex(stepIndex + 1);
      onCorrect();
    } else {
      setErrorMsg(currentStep.trap);
      onIncorrect();
    }
  };

  const handleNextProblem = () => {
    setProblemIndex(p => p + 1);
    setStepIndex(0);
    setHistory([]);
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-3xl p-6 md:p-10 border border-slate-800/50 backdrop-blur-sm relative overflow-y-auto hide-scrollbar">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-300 mb-2">Order of Operations</h2>
          <p className="text-slate-400 text-sm">Problem {problemIndex + 1} of {problems.length}</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start max-w-2xl mx-auto w-full">
          
          <div className="flex flex-col w-full px-4 mb-8">
            {/* Original Expression */}
            <div className="text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-md text-left mb-4 pb-4 border-b border-slate-700/50">
              {problem.expression}
            </div>

            {/* Evaluated Lines History */}
            <AnimatePresence>
              {history.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-3 gap-2 sm:gap-0"
                >
                  <div className="text-3xl font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-slate-500">=</span> 
                    <span dangerouslySetInnerHTML={{ __html: item.htmlExpression }} />
                  </div>
                  <div className="text-sm font-medium text-emerald-300 bg-emerald-900/30 px-4 py-1.5 rounded-full border border-emerald-800/50 flex items-center gap-2 self-start sm:self-auto shadow-sm">
                    <CheckCircle size={14} className="shrink-0" /> {item.optionText}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="w-full bg-slate-800/80 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-md flex flex-col gap-6">

            {/* Current Options */}
            {!isProblemComplete && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-indigo-200 mb-4">What operation is next?</h3>
                {currentStep.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className="w-full p-4 bg-slate-700/50 hover:bg-indigo-600/30 border border-slate-600 rounded-xl text-left font-bold text-lg text-slate-200 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && !isProblemComplete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 mt-2 rounded-xl border flex items-start gap-3 bg-rose-900/30 border-rose-800 text-rose-200">
                    <AlertTriangle className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-1">Not quite!</p>
                      <p className="text-sm opacity-90">{errorMsg}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Problem Button */}
            <AnimatePresence>
              {isProblemComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2"
                >
                  <div className="p-4 mb-6 rounded-xl border flex items-center justify-center text-xl font-bold bg-emerald-900/30 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    Problem Solved!
                  </div>
                  <button 
                    onClick={handleNextProblem} 
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Next Problem <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </div>
    </div>
  );
}
