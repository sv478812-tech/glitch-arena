'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Navbar } from '@/components/Navbar';
import { SinglePlayerArena } from '@/components/SinglePlayerArena';
import { PvpDuel } from '@/components/PvpDuel';
import { CyberCompanion } from '@/components/CyberCompanion';
import { Bug, Swords, Bot, Terminal, Shield, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'arena' | 'pvp' | 'companion'>('arena');
  const { crtMode, screenShaking } = useGame();

  return (
    <div
      className={`min-h-screen bg-cyber-bg text-slate-100 flex flex-col transition-transform duration-100 ${
        screenShaking ? 'shake-screen' : ''
      }`}
    >
      {/* Optional Retro CRT Scanlines Overlay */}
      {crtMode && <div className="crt-overlay" />}

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'arena' && <SinglePlayerArena />}
        {activeTab === 'pvp' && <PvpDuel />}
        {activeTab === 'companion' && <CyberCompanion />}
      </main>

      {/* Retro Cyberpunk Terminal Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-3 px-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">
              GLITCH_ARENA // CORE MATRIX ONLINE
            </span>
            <span className="hidden md:inline text-slate-600">&bull;</span>
            <span className="hidden md:inline text-slate-500">
              Sandboxed Client Execution Engine
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Tab: Hotkey Switch</span>
            <span>&bull;</span>
            <span className="text-cyber-cyan">Retro WebAudio Synthesizer Active</span>
            <span>&bull;</span>
            <span className="text-cyber-purple">Next.js + Monaco + Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
