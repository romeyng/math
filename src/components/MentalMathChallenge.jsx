import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';

const questions = [
  {
    expression: "25 × 17 × 4",
    steps: [
      { prompt: "Which two numbers should you multiply first to make it easiest?", options: ["25 × 17", "17 × 4", "25 × 4"], correctIndex: 2, explanation: "Correct! Using the Commutative Property, we rearrange to multiply 25 × 4 first, which gives 100!" },
      { prompt: "Now solve: 100 × 17", options: ["1,700", "170", "17,000"], correctIndex: 0, explanation: "Boom! Solved in under 5 seconds." }
    ]
  },
  {
    expression: "(89 + 67) + 33",
    steps: [
      { prompt: "Which two numbers should you add first to make it easiest?", options: ["89 + 67", "67 + 33", "89 + 33"], correctIndex: 1, explanation: "Correct! Using the Associative Property, regrouping to (67 + 33) gives a nice round 100!" },
      { prompt: "Now solve: 89 + 100", options: ["179", "189", "199"], correctIndex: 1, explanation: "Perfect! Mental math makes complex problems simple." }
    ]
  },
  {
    expression: "6 × 8",
    steps: [
      { prompt: "How could you split this using the Distributive Law?", options: ["6 × (5 + 3)", "6 × (4 + 5)", "6 × (6 + 2)"], correctIndex: 0, explanation: "Correct! You can break 8 into (5 + 3), so 6 × 8 = (6 × 5) + (6 × 3)." },
      { prompt: "What is (6 × 5) + (6 × 3)?", options: ["30 + 12 = 42", "30 + 18 = 48", "30 + 24 = 54"], correctIndex: 1, explanation: "Awesome! Distributive law simplifies multiplication." }
    ]
  },
  {
    expression: "5 × 98",
    steps: [
      { prompt: "Which rewrite uses the Distributive Property to make this easiest?", options: ["5 × (90 + 8)", "5 × (100 - 2)", "5 × (50 + 48)"], correctIndex: 1, explanation: "Yes! Subtracting from 100 is much easier." },
      { prompt: "Solve: (5 × 100) - (5 × 2)", options: ["500 - 10 = 490", "500 - 2 = 498", "450 - 10 = 440"], correctIndex: 0, explanation: "Great job using the distributive law for fast mental math!" }
    ]
  },
  {
    expression: "4 × 39 × 25",
    steps: [
      { prompt: "Which numbers should you multiply first?", options: ["4 × 39", "39 × 25", "4 × 25"], correctIndex: 2, explanation: "By the Commutative Property, 4 × 25 = 100." },
      { prompt: "Now solve: 100 × 39", options: ["390", "3,900", "39,000"], correctIndex: 1, explanation: "Multiplying by 100 is lightning fast." }
    ]
  },
  {
    expression: "103 + 48 + 97",
    steps: [
      { prompt: "Which two numbers should you add first?", options: ["103 + 48", "103 + 97", "48 + 97"], correctIndex: 1, explanation: "Grouping 103 and 97 makes a perfectly round 200!" },
      { prompt: "Now solve: 200 + 48", options: ["248", "68", "148"], correctIndex: 0, explanation: "Simple addition completes it." }
    ]
  },
  {
    expression: "24 × 5",
    steps: [
      { prompt: "What's the 'halve and double' mental math trick for × 5?", options: ["Double 24, halve 5", "Halve 24, double 5", "Halve both"], correctIndex: 1, explanation: "Yes! Halving 24 gives 12, doubling 5 gives 10." },
      { prompt: "Now solve: 12 × 10", options: ["120", "60", "240"], correctIndex: 0, explanation: "Halve and double is a lifesaver." }
    ]
  },
  {
    expression: "7 × 101",
    steps: [
      { prompt: "How should you break this up?", options: ["7 × (100 + 1)", "7 × (50 + 51)", "7 × (90 + 11)"], correctIndex: 0, explanation: "Correct! The Distributive property splits 101." },
      { prompt: "Solve: (7 × 100) + (7 × 1)", options: ["700 + 1 = 701", "700 + 7 = 707", "70 + 7 = 77"], correctIndex: 1, explanation: "Perfect!" }
    ]
  },
  {
    expression: "37 + 89 + 13",
    steps: [
      { prompt: "Look for friendly numbers. Which two make a round 10?", options: ["37 + 89", "89 + 13", "37 + 13"], correctIndex: 2, explanation: "37 + 13 = 50. Much easier!" },
      { prompt: "Now solve: 50 + 89", options: ["139", "149", "129"], correctIndex: 0, explanation: "Nice!" }
    ]
  },
  {
    expression: "45 × 12",
    steps: [
      { prompt: "How could you use factors to make this easier?", options: ["45 × (10 + 2)", "(45 × 2) × 6", "Both of these work!"], correctIndex: 2, explanation: "Correct! You can use Distributive (10+2) or Associative (halve/double)!" },
      { prompt: "Let's use (45 × 2) × 6. Solve it:", options: ["90 × 6 = 540", "90 × 6 = 450", "90 × 12 = 1080"], correctIndex: 0, explanation: "9 × 6 = 54, so 90 × 6 = 540. Fantastic!" }
    ]
  }
];

export default function MentalMathChallenge({ onCorrect, onIncorrect }) {
  const [qIndex, setQIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const question = questions[qIndex];
  const step = question?.steps[stepIndex];
  const isFinished = qIndex >= questions.length;

  const handleOptionClick = (idx) => {
    if (feedback) return;
    if (idx === step.correctIndex) {
      setFeedback('correct');
      onCorrect();
    } else {
      setFeedback('incorrect');
      onIncorrect();
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (stepIndex + 1 < question.steps.length) {
      setStepIndex(s => s + 1);
    } else {
      setQIndex(q => q + 1);
      setStepIndex(0);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-6xl text-yellow-400"><Zap /></div>
        <h2 className="text-3xl font-bold text-white">Mental Math Ninja!</h2>
        <button onClick={() => { setQIndex(0); setStepIndex(0); }} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold">Restart</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center relative bg-slate-900/50 rounded-3xl p-8 border border-slate-700/50">
      <h2 className="text-2xl font-bold text-slate-300 mb-2 flex items-center gap-2">
        <Zap className="text-yellow-400" /> Mental Math Shortcuts
      </h2>
      <p className="text-slate-400 mb-8 text-center max-w-lg">Question {qIndex + 1} of {questions.length}</p>
      
      <div className="text-5xl md:text-6xl font-black text-white mb-10 drop-shadow-lg text-center">
        {question.expression}
      </div>

      <div className="w-full max-w-xl bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-600 shadow-xl">
        <h3 className="text-xl font-semibold mb-6 text-indigo-200 text-center">{step.prompt}</h3>
        <div className="space-y-4">
          {step.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(i)}
              disabled={feedback !== null}
              className={`w-full p-4 rounded-xl text-lg font-bold transition-all border ${
                feedback && i === step.correctIndex
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : feedback === 'incorrect' && i !== step.correctIndex
                  ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-50'
                  : 'bg-slate-700/50 border-slate-600 hover:bg-indigo-600/30 text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0, mt: 0 }}
              animate={{ opacity: 1, height: 'auto', mt: 24 }}
              exit={{ opacity: 0, height: 0, mt: 0 }}
            >
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${feedback === 'correct' ? 'bg-emerald-900/30 border-emerald-800 text-emerald-200' : 'bg-rose-900/30 border-rose-800 text-rose-200'}`}>
                {feedback === 'correct' && <CheckCircle className="shrink-0" />}
                <p className="font-medium">{feedback === 'correct' ? step.explanation : 'Not quite. Think about making combinations of 10 or 100!'}</p>
              </div>
              {feedback === 'correct' && (
                <button onClick={handleNext} className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">
                  Next
                </button>
              )}
              {feedback === 'incorrect' && (
                <button onClick={() => setFeedback(null)} className="mt-4 w-full py-3 bg-slate-600 text-white rounded-xl font-bold">
                  Try Again
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
