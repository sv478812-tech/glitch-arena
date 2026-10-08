'use client';

import React, { useState, useEffect } from 'react';
import { CHALLENGES } from '@/data/challenges';
import { CodeChallenge, ExecutionOutput, Language } from '@/types';
import { runCodeSuite } from '@/utils/runner';
import { useGame } from '@/context/GameContext';
import { CodeEditor } from './CodeEditor';
import { TerminalOutput } from './TerminalOutput';
import { CyberMentor } from './CyberMentor';
import {
  Play,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Bug,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '@/utils/audio';

export const SinglePlayerArena: React.FC = () => {
  const {
    completeChallenge,
    takeShieldDamage,
    triggerScreenShake,
    showToast,
  } = useGame();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Beginner');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);

  // Filtered challenges based on chosen language and difficulty
  const availableChallenges = CHALLENGES.filter(
    (c) => c.language === selectedLanguage && c.difficulty === selectedDifficulty
  );

  const activeChallenge: CodeChallenge =
    availableChallenges[currentChallengeIndex] ||
    CHALLENGES.find((c) => c.language === selectedLanguage) ||
    CHALLENGES[0];

  const [userCode, setUserCode] = useState<string>(activeChallenge.initialCode);
  const [unlockedTier, setUnlockedTier] = useState<0 | 1 | 2 | 3>(0);
  const [executionOutput, setExecutionOutput] = useState<ExecutionOutput | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasSolvedCurrent, setHasSolvedCurrent] = useState<boolean>(false);
  const [rightPanelTab, setRightPanelTab] = useState<'terminal' | 'mentor'>('terminal');

  // Reset state when active challenge changes
  useEffect(() => {
    setUserCode(activeChallenge.initialCode);
    setUnlockedTier(0);
    setExecutionOutput(null);
    setHasSolvedCurrent(false);
  }, [activeChallenge.id]);

  const handleResetCode = () => {
    setUserCode(activeChallenge.initialCode);
    setExecutionOutput(null);
    showToast('Code reset to corrupted glitch state.', 'info', 'REVERSION');
  };

  const handleUnlockNextTier = () => {
    if (unlockedTier < 3) {
      const next = (unlockedTier + 1) as 1 | 2 | 3;
      setUnlockedTier(next);
      setRightPanelTab('mentor');

      if (next === 1) {
        showToast('Tier 1 Hint unlocked: Subtle direction.', 'info', 'AI MENTOR');
      } else if (next === 2) {
        showToast('Tier 2 Hint unlocked: Socratic state inquiry.', 'info', 'AI MENTOR');
      } else if (next === 3) {
        showToast('Tier 3 Hint unlocked: Visual bug zone highlighted in editor!', 'warning', 'AI MENTOR');
      }
    }
  };

  const handleRunCode = () => {
    sound.playClick();
    setIsRunning(true);
    setRightPanelTab('terminal');

    setTimeout(() => {
      const result = runCodeSuite(
        userCode,
        activeChallenge.language,
        activeChallenge.functionName,
        activeChallenge.testCases
      );
      setExecutionOutput(result);
      setIsRunning(false);

      if (result.allPassed) {
        setHasSolvedCurrent(true);
        completeChallenge(activeChallenge.id, activeChallenge.xpReward);

        // Fire confetti celebratory burst
        try {
          const confetti = (window as any).confetti;
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#06B6D4', '#A855F7', '#10B981'],
            });
          }
        } catch {}
      } else {
        sound.playError();
        triggerScreenShake();
        takeShieldDamage(5);
        showToast('Test assertions failed! -5 Shield HP drained.', 'error', 'ASSERTION REJECTED');
      }
    }, 250);
  };

  return (
    <div className="flex flex-col space-y-4 max-w-7xl mx-auto pb-12">
      {/* Problem Header Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-bold uppercase tracking-wider">
                Daily Hunt #104
              </span>

              {/* Difficulty Badge */}
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-black uppercase tracking-wider ${
                  activeChallenge.difficulty === 'Beginner'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : activeChallenge.difficulty === 'Intermediate'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {activeChallenge.difficulty}
              </span>

              {/* Category Tag */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {activeChallenge.category}
              </span>

              {hasSolvedCurrent && (
                <span className="flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/60 font-bold">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  CLEARED (+{activeChallenge.xpReward} XP)
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center">
              <Bug className="w-5 h-5 mr-2 text-cyber-cyan" />
              {activeChallenge.title}
            </h1>

            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
              {activeChallenge.description}
            </p>
          </div>

          {/* Language & Difficulty Selectors */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedLanguage('javascript');
                  setCurrentChallengeIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md transition-all font-bold ${
                  selectedLanguage === 'javascript'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 shadow-sm shadow-cyber-cyan/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JavaScript
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedLanguage('python');
                  setCurrentChallengeIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md transition-all font-bold ${
                  selectedLanguage === 'python'
                    ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40 shadow-sm shadow-cyber-purple/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python
              </button>
            </div>

            {/* Difficulty Tier Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              {(['Beginner', 'Intermediate', 'Expert'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    sound.playClick();
                    setSelectedDifficulty(diff);
                    setCurrentChallengeIndex(0);
                  }}
                  className={`px-2.5 py-1.5 rounded-md transition-all font-bold ${
                    selectedDifficulty === diff
                      ? diff === 'Beginner'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : diff === 'Intermediate'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-mono">
        <div className="flex items-center space-x-2">
          {/* Run Code & Tests Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyber-cyan to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black tracking-wider uppercase transition-all shadow-lg shadow-cyber-cyan/30 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Run Code &amp; Tests</span>
          </button>

          {/* Ask Cyber Mentor Button */}
          <button
            onClick={handleUnlockNextTier}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple border border-cyber-purple/50 font-bold tracking-wide transition-all shadow-md shadow-cyber-purple/20 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-cyber-purple" />
            <span>
              Ask Cyber Mentor {unlockedTier < 3 ? `(Tier ${unlockedTier + 1})` : '(3/3)'}
            </span>
          </button>
        </div>

        {/* Right side tab switcher for Terminal / Mentor */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setRightPanelTab('terminal')}
            className={`px-3 py-1 rounded text-xs transition-colors font-bold ${
              rightPanelTab === 'terminal'
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terminal Output
          </button>
          <button
            onClick={() => setRightPanelTab('mentor')}
            className={`px-3 py-1 rounded text-xs transition-colors font-bold ${
              rightPanelTab === 'mentor'
                ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cyber Mentor {unlockedTier > 0 ? `(${unlockedTier} hints)` : ''}
          </button>
        </div>
      </div>

      {/* Main Workspace Split (Editor on Left, Terminal/Mentor on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[520px]">
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-7 flex flex-col h-[520px]">
          <CodeEditor
            code={userCode}
            onChange={setUserCode}
            language={activeChallenge.language}
            onReset={handleResetCode}
            buggyLineRange={activeChallenge.buggyLineRange}
            isTier3Unlocked={unlockedTier >= 3}
          />
        </div>

        {/* Right Column: Terminal Output or Cyber Mentor */}
        <div className="lg:col-span-5 flex flex-col h-[520px]">
          {rightPanelTab === 'terminal' ? (
            <TerminalOutput
              output={executionOutput}
              isRunning={isRunning}
              onClear={() => setExecutionOutput(null)}
            />
          ) : (
            <CyberMentor
              challenge={activeChallenge}
              unlockedTier={unlockedTier}
              onUnlockNextTier={handleUnlockNextTier}
            />
          )}
        </div>
      </div>
    </div>
  );
};
