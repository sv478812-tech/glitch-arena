'use client';

import React, { useState, useEffect } from 'react';
import { BUG_CARDS, DUEL_TARGET_FUNCTIONS, corruptCodeWithCards } from '@/data/duelCards';
import { BugCard, TargetFunction, ExecutionOutput } from '@/types';
import { runCodeSuite } from '@/utils/runner';
import { useGame } from '@/context/GameContext';
import { CodeEditor } from './CodeEditor';
import { TerminalOutput } from './TerminalOutput';
import {
  Swords,
  Shield,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  Maximize2,
  Layers,
  Skull,
  Repeat,
  CopyX,
  AlertOctagon,
  Trophy,
  Skull as SkullIcon,
  CheckCircle2,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { sound } from '@/utils/audio';

export const PvpDuel: React.FC = () => {
  const { addXp, showToast, triggerScreenShake } = useGame();

  // Duel Setup & State
  const [pvpMode, setPvpMode] = useState<'vs_ai' | 'hotseat'>('vs_ai');
  const [phase, setPhase] = useState<'attacker_select' | 'defender_repair' | 'match_won' | 'match_lost'>('attacker_select');
  const [turn, setTurn] = useState<number>(1);

  // Health Stats
  const [attackerHp, setAttackerHp] = useState<number>(100);
  const [defenderShieldHp, setDefenderShieldHp] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(90);

  // Cards & Target
  const [selectedCards, setSelectedCards] = useState<BugCard[]>([]);
  const [targetFunction, setTargetFunction] = useState<TargetFunction>(DUEL_TARGET_FUNCTIONS[0]);
  const [currentCode, setCurrentCode] = useState<string>(DUEL_TARGET_FUNCTIONS[0].cleanCode);
  const [injectedCode, setInjectedCode] = useState<string>('');

  // Execution
  const [executionOutput, setExecutionOutput] = useState<ExecutionOutput | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Timer Effect for Defender Phase
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'defender_repair') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });

        // Shield slowly drains under systemic pressure (1 HP every 2 seconds)
        setDefenderShieldHp((prev) => {
          const next = Math.max(0, prev - 0.5);
          if (next <= 0) {
            handleDefenderDefeated();
            return 0;
          }
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [phase]);

  const handleCardToggle = (card: BugCard) => {
    sound.playCardSelect();
    if (selectedCards.some((c) => c.id === card.id)) {
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id));
    } else {
      if (selectedCards.length >= 2) {
        showToast('Maximum 2 Bug Cards can be deployed per turn!', 'warning', 'CARD SLOTS FULL');
        return;
      }
      setSelectedCards((prev) => [...prev, card]);
    }
  };

  const handleInjectAndTransmit = () => {
    if (selectedCards.length === 0) {
      showToast('Select at least 1 Bug Card to corrupt the target code!', 'warning', 'SELECT BUG CARD');
      return;
    }

    sound.playGlitchZap();
    const corrupted = corruptCodeWithCards(targetFunction.cleanCode, selectedCards);
    setInjectedCode(corrupted);
    setCurrentCode(corrupted);
    setExecutionOutput(null);
    setTimeLeft(90);
    setDefenderShieldHp(100);
    setPhase('defender_repair');

    showToast(
      `Phase 2 Initiated! Defender must repair ${selectedCards.length} injected glitch(es) before Shield drains to 0!`,
      'info',
      '⚡ GLITCH TRANSMITTED'
    );
  };

  const handleRunDefenderTests = () => {
    sound.playClick();
    setIsRunning(true);

    setTimeout(() => {
      const result = runCodeSuite(
        currentCode,
        'javascript',
        targetFunction.name,
        targetFunction.testCases
      );
      setExecutionOutput(result);
      setIsRunning(false);

      if (result.allPassed) {
        // Defender successfully patched the bug!
        sound.playSuccess();
        const nextAttackerHp = Math.max(0, attackerHp - 50);
        setAttackerHp(nextAttackerHp);
        setDefenderShieldHp((prev) => Math.min(100, prev + 25));

        showToast(
          'COUNTER-ATTACK! Glitch purged, +25 Shield restored, 50 Damage dealt to Attacker!',
          'success',
          '🛡️ REPAIR SUCCESS'
        );

        if (nextAttackerHp <= 0) {
          setPhase('match_won');
          addXp(350);
          sound.playLevelUp();
        } else {
          // Advance turn
          setTimeout(() => {
            setTurn((t) => t + 1);
            setSelectedCards([]);
            setPhase('attacker_select');
            setCurrentCode(targetFunction.cleanCode);
            showToast('Turn advanced! Attacker drafting next payload.', 'info', 'PHASE RESET');
          }, 2000);
        }
      } else {
        // Test failed!
        sound.playError();
        triggerScreenShake();
        setDefenderShieldHp((prev) => {
          const next = Math.max(0, prev - 15);
          if (next <= 0) {
            handleDefenderDefeated();
          }
          return next;
        });
        showToast('Repair failed assertion! -15 Shield HP lost!', 'error', 'TEST BREACH');
      }
    }, 200);
  };

  const handleTimeExpired = () => {
    sound.playError();
    triggerScreenShake();
    setPhase('match_lost');
    showToast('Time expired! Defender Shield breached.', 'error', 'TIME OUT');
  };

  const handleDefenderDefeated = () => {
    sound.playError();
    triggerScreenShake();
    setPhase('match_lost');
    showToast('Defender Shield collapsed to 0 HP!', 'error', 'SHIELD COLLAPSED');
  };

  const handleRestartDuel = () => {
    setAttackerHp(100);
    setDefenderShieldHp(100);
    setSelectedCards([]);
    setPhase('attacker_select');
    setCurrentCode(targetFunction.cleanCode);
    setExecutionOutput(null);
    setTimeLeft(90);
    setTurn(1);
  };

  const renderCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Maximize2':
        return <Maximize2 className="w-4 h-4 text-cyan-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'Skull':
        return <Skull className="w-4 h-4 text-rose-400" />;
      case 'Repeat':
        return <Repeat className="w-4 h-4 text-emerald-400" />;
      case 'CopyX':
        return <CopyX className="w-4 h-4 text-pink-400" />;
      default:
        return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-7xl mx-auto pb-12 font-mono">
      {/* PvP Duel Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40 font-bold uppercase">
                Turn {turn} &bull; Asymmetric Duel
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {pvpMode === 'vs_ai' ? 'Vs AI Glitch Phantom' : 'Hotseat 2-Player'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight flex items-center">
              <Swords className="w-5 h-5 mr-2 text-cyber-purple" />
              Glitch &amp; Shield PvP Arena
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {phase === 'attacker_select'
                ? 'Phase 1: Attacker drafts Bug Cards to corrupt the target code.'
                : 'Phase 2: Defender must inspect tests and repair the corrupted code before Shield HP reaches 0!'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start md:self-auto">
            <button
              onClick={() => {
                sound.playClick();
                setPvpMode('vs_ai');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all font-bold ${
                pvpMode === 'vs_ai'
                  ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Vs AI Bot</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setPvpMode('hotseat');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all font-bold ${
                pvpMode === 'hotseat'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Hotseat 2P</span>
            </button>
          </div>
        </div>

        {/* Duel HUD Bars (Attacker HP & Defender Shield) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80">
          {/* Attacker HP */}
          <div className="bg-slate-950 p-3 rounded-xl border border-rose-950/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center text-rose-400 font-bold">
                <SkullIcon className="w-3.5 h-3.5 mr-1" />
                Attacker Core HP
              </span>
              <span className="font-bold text-rose-400">{attackerHp}/100</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${attackerHp}%` }}
              />
            </div>
          </div>

          {/* Defender Shield HP & Countdown */}
          <div className="bg-slate-950 p-3 rounded-xl border border-cyan-950/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center text-cyan-400 font-bold">
                <Shield className="w-3.5 h-3.5 mr-1" />
                Defender Shield Integrity
              </span>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-amber-400 text-xs font-bold">
                  <Clock className="w-3 h-3 mr-1" />
                  {timeLeft}s
                </span>
                <span className="font-bold text-cyan-400">{Math.floor(defenderShieldHp)}/100 HP</span>
              </div>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  defenderShieldHp > 50
                    ? 'bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                    : defenderShieldHp > 25
                    ? 'bg-amber-400'
                    : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${Math.max(0, defenderShieldHp)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 1: ATTACKER HAND & BUG CARDS SELECTION */}
      {phase === 'attacker_select' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-cyber-purple uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Phase 1: Draft Bug Cards ({selectedCards.length}/2 Selected)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Function: <span className="text-cyber-cyan font-bold">{targetFunction.name}</span> &bull; Click 1 or 2 cards to corrupt.
              </p>
            </div>

            <button
              onClick={handleInjectAndTransmit}
              disabled={selectedCards.length === 0}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyber-purple to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-xs tracking-wider transition-all shadow-lg shadow-cyber-purple/30 disabled:opacity-40 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Inject Glitches &amp; Transmit</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BUG_CARDS.map((card) => {
              const isSelected = selectedCards.some((c) => c.id === card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardToggle(card)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all relative overflow-hidden select-none ${
                    isSelected
                      ? 'bg-purple-950/40 border-cyber-purple shadow-lg shadow-cyber-purple/20 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                        {renderCardIcon(card.iconName)}
                      </div>
                      <span className="font-bold text-xs text-slate-100">{card.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-950 text-slate-400 border border-slate-800">
                      {card.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                    {card.description}
                  </p>

                  <div className="text-[10px] text-cyber-purple/90 font-bold bg-slate-950/80 p-1.5 rounded border border-purple-900/40">
                    Effect: {card.effect}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyber-purple shadow-[0_0_8px_#A855F7]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Clean Target Code Preview */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-slate-400 font-bold">TARGET FUNCTION SOURCE (CLEAN STATE)</span>
              <span className="text-[10px] text-slate-500">Unmodified Baseline</span>
            </div>
            <pre className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 overflow-x-auto leading-5">
              {targetFunction.cleanCode}
            </pre>
          </div>
        </div>
      )}

      {/* PHASE 2: DEFENDER 90s REPAIR ARENA */}
      {phase === 'defender_repair' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-rose-400 font-bold flex items-center">
                <AlertOctagon className="w-4 h-4 mr-1.5 animate-pulse" />
                SYSTEM CORRUPTED WITH {selectedCards.length} GLITCH CARD(S)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunDefenderTests}
                disabled={isRunning}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyber-cyan to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black uppercase text-xs tracking-wider transition-all shadow-lg shadow-cyber-cyan/30 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Test &amp; Purge Bugs</span>
              </button>
            </div>
          </div>

          {/* Split Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[500px]">
            <div className="lg:col-span-7 flex flex-col h-[500px]">
              <CodeEditor
                code={currentCode}
                onChange={setCurrentCode}
                language="javascript"
                onReset={() => setCurrentCode(injectedCode)}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col h-[500px]">
              <TerminalOutput
                output={executionOutput}
                isRunning={isRunning}
                onClear={() => setExecutionOutput(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* MATCH OUTCOME OVERLAYS */}
      {phase === 'match_won' && (
        <div className="bg-emerald-950/30 border border-emerald-500/50 rounded-xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <Trophy className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black text-emerald-300">DUEL VICTORIOUS!</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            All injected bug vectors eradicated. Attacker core completely dismantled. You earned +350 XP and 1 Anti-Virus Drive!
          </p>
          <button
            onClick={handleRestartDuel}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/30"
          >
            Start New Duel Match
          </button>
        </div>
      )}

      {phase === 'match_lost' && (
        <div className="bg-rose-950/30 border border-rose-500/50 rounded-xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <SkullIcon className="w-16 h-16 text-rose-400 mx-auto animate-pulse" />
          <h2 className="text-2xl font-black text-rose-300">SHIELD SYSTEM COLLAPSED</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Glitch vectors overwhelmed the runtime before tests could be satisfied. Study the bug cards and fortify your defenses!
          </p>
          <button
            onClick={handleRestartDuel}
            className="px-6 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-500/30"
          >
            Reboot Duel Matrix
          </button>
        </div>
      )}
    </div>
  );
};
