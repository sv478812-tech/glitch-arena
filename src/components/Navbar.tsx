'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import {
  Flame,
  Zap,
  Shield,
  Volume2,
  VolumeX,
  Tv,
  RotateCcw,
  Sparkles,
  Swords,
  Bug,
  Bot,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'arena' | 'pvp' | 'companion';
  setActiveTab: (tab: 'arena' | 'pvp' | 'companion') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    player,
    isMuted,
    crtMode,
    toggleMute,
    toggleCrtMode,
    resetProgress,
  } = useGame();

  const xpPercent = Math.min(100, Math.floor((player.xp / player.xpToNextLevel) * 100));
  const hpPercent = Math.min(100, Math.max(0, Math.floor((player.shieldHp / player.maxShieldHp) * 100)));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-border/70 bg-cyber-bg/95 backdrop-blur-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Animated Glitch Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('arena')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyber-card border border-cyber-cyan/50 shadow-lg shadow-cyber-cyan/20 overflow-hidden">
              <span className="text-xl font-black text-cyber-cyan font-mono tracking-tighter">
                &gt;_
              </span>
              <div className="absolute inset-0 bg-cyber-cyan/10 animate-pulse pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span
                  className="font-mono text-xl md:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-cyan animate-pulse glitch-text"
                  data-text="GlitchArena"
                >
                  GlitchArena
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/40 uppercase tracking-widest font-bold">
                  v1.0 MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Hunting Bugs &bull; Glitch &amp; Shield Duels
              </p>
            </div>
          </div>

          {/* Mobile Utility Controls */}
          <div className="flex items-center space-x-1.5 md:hidden">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-cyber-cyan transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyber-cyan" />}
            </button>
            <button
              onClick={toggleCrtMode}
              className={`p-1.5 rounded transition-colors ${
                crtMode ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'bg-slate-800 text-slate-400'
              }`}
              title="Toggle CRT Scanline Overlay"
            >
              <Tv className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 self-center">
          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-mono font-medium transition-all ${
              activeTab === 'arena'
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 shadow-md shadow-cyber-cyan/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>Single Player</span>
          </button>

          <button
            onClick={() => setActiveTab('pvp')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-mono font-medium transition-all ${
              activeTab === 'pvp'
                ? 'bg-cyber-purple/25 text-cyber-purple border border-cyber-purple/50 shadow-md shadow-cyber-purple/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Glitch &amp; Shield PvP</span>
          </button>

          <button
            onClick={() => setActiveTab('companion')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-mono font-medium transition-all ${
              activeTab === 'companion'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Cyber Companion</span>
          </button>
        </nav>

        {/* Player Stats & HUD Indicators */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 text-xs font-mono">
          {/* Current Streak */}
          <div
            className="flex items-center space-x-1.5 bg-slate-900/90 border border-amber-500/30 px-2.5 py-1 rounded-lg"
            title="Daily Debugging Streak"
          >
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-amber-300 font-bold">{player.streak} Days</span>
          </div>

          {/* Level & XP Bar */}
          <div
            className="flex flex-col min-w-[120px] bg-slate-900/90 border border-cyber-cyan/30 px-2.5 py-1 rounded-lg"
            title={`Level ${player.level} (${player.xp} / ${player.xpToNextLevel} XP)`}
          >
            <div className="flex items-center justify-between mb-0.5 text-[11px]">
              <span className="flex items-center text-cyber-cyan font-bold">
                <Zap className="w-3 h-3 mr-1 text-cyber-cyan fill-cyber-cyan" />
                Lvl {player.level}
              </span>
              <span className="text-slate-400 text-[10px]">
                {player.xp}/{player.xpToNextLevel}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyber-cyan to-cyber-purple h-full transition-all duration-500 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Shield HP Bar */}
          <div
            className="flex flex-col min-w-[110px] bg-slate-900/90 border border-emerald-500/30 px-2.5 py-1 rounded-lg"
            title={`Shield Integrity: ${player.shieldHp}/${player.maxShieldHp}`}
          >
            <div className="flex items-center justify-between mb-0.5 text-[11px]">
              <span className="flex items-center text-emerald-400 font-bold">
                <Shield className="w-3 h-3 mr-1 text-emerald-400 fill-emerald-400/30" />
                HP
              </span>
              <span
                className={`font-bold text-[10px] ${
                  hpPercent > 50
                    ? 'text-emerald-400'
                    : hpPercent > 25
                    ? 'text-amber-400'
                    : 'text-rose-500 animate-pulse'
                }`}
              >
                {player.shieldHp}/{player.maxShieldHp}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  hpPercent > 50
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : hpPercent > 25
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Desktop Utilities */}
          <div className="hidden md:flex items-center space-x-1.5 border-l border-slate-800 pl-2">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyber-cyan transition-colors"
              title={isMuted ? 'Unmute Audio Synth' : 'Mute Audio Synth'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyber-cyan" />}
            </button>

            <button
              onClick={toggleCrtMode}
              className={`p-1.5 rounded-lg transition-colors ${
                crtMode
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 shadow-sm shadow-cyber-cyan/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'
              }`}
              title="Toggle Retro CRT Scanlines"
            >
              <Tv className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all player stats and inventory to factory defaults?')) {
                  resetProgress();
                }
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 transition-colors"
              title="Reset Player Progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
