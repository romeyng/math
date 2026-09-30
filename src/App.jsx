import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BODMASChallenge from './components/BODMASChallenge';
import PropertiesSorting from './components/PropertiesSorting';
import BaseTenVisualizer from './components/BaseTenVisualizer';
import SubitizingFlash from './components/SubitizingFlash';
import MentalMathChallenge from './components/MentalMathChallenge';
import NumberForms from './components/NumberForms';
import { Brain, Hash, Layers, Zap, Trophy, Flame, NotebookPen, SplitSquareHorizontal } from 'lucide-react';

const tabs = [
  { id: 'bodmas', label: 'BODMAS', icon: <Brain size={20} /> },
  { id: 'properties', label: 'Properties', icon: <Hash size={20} /> },
  { id: 'baseten', label: 'Base-Ten', icon: <Layers size={20} /> },
  { id: 'subitizing', label: 'Subitizing', icon: <Zap size={20} /> },
  { id: 'mentalmath', label: 'Mental Math', icon: <SplitSquareHorizontal size={20} /> },
  { id: 'forms', label: 'Number Forms', icon: <NotebookPen size={20} /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('bodmas');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleCorrect = () => {
    setScore(s => s + 10 * (streak + 1));
    setStreak(s => s + 1);
  };

  const handleIncorrect = () => {
    setStreak(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Brain className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              MathMaster Pro
            </h1>
          </div>
          
          <div className="flex gap-4 md:gap-6">
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 shadow-inner">
              <Trophy className="text-yellow-400" size={20} />
              <span className="font-bold text-lg">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 shadow-inner">
              <Flame className={streak > 2 ? "text-orange-500 animate-pulse" : "text-slate-400"} size={20} />
              <span className="font-bold text-lg">{streak} Streak</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mt-6 flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] scale-105 border border-indigo-400/50'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'bodmas' && <BODMASChallenge onCorrect={handleCorrect} onIncorrect={handleIncorrect} />}
            {activeTab === 'properties' && <PropertiesSorting onCorrect={handleCorrect} onIncorrect={handleIncorrect} />}
            {activeTab === 'baseten' && <BaseTenVisualizer onCorrect={handleCorrect} onIncorrect={handleIncorrect} />}
            {activeTab === 'subitizing' && <SubitizingFlash onCorrect={handleCorrect} onIncorrect={handleIncorrect} />}
            {activeTab === 'mentalmath' && <MentalMathChallenge onCorrect={handleCorrect} onIncorrect={handleIncorrect} />}
            {activeTab === 'forms' && <NumberForms onCorrect={handleCorrect} onIncorrect={handleIncorrect} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
