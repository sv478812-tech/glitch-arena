'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import {
  Bot,
  Zap,
  Shield,
  Flame,
  Heart,
  Battery,
  AlertTriangle,
  Sparkles,
  Cpu,
  RefreshCw,
  Award,
  Terminal,
} from 'lucide-react';
import { sound } from '@/utils/audio';

export const CyberCompanion: React.FC = () => {
  const {
    player,
    companion,
    feedCompanion,
    purgeCompanionCorruption,
    trainCompanionCore,
  } = useGame();

  const isCorrupted = player.streak === 0 || companion.corruption > 30;

  // Stages metadata
  const STAGE_NAMES = [
    'Byte Hatchling',
    'Cyber Owlet',
    'Void Strigiformes',
    'Chrono Archon',
  ];

  // Dynamic quote
  const getCompanionDialogue = () => {
    if (isCorrupted) {
      return 'WARNING: Neural matrix glitching! Bit-rot detected in sector 7... Solve daily bugs or apply Anti-Virus Purge!';
    }
    if (companion.happiness > 80) {
      return `Hoot! Neural synthesis at peak frequency! Streak is blazing at ${player.streak} days. Let's hunt more glitches!`;
    }
    return 'Systems nominal. Ready for debugging drills, Operator.';
  };

  return (
    <div className="flex flex-col space-y-4 max-w-5xl mx-auto pb-12 font-mono">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold uppercase">
              Autonomous AI Pet &bull; Stage {companion.stage}/4
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                isCorrupted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
              }`}
            >
              {isCorrupted ? 'CORRUPTED PIXEL FORM' : 'CLEAN HOLOGRAPHIC FORM'}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight flex items-center">
            <Bot className="w-5 h-5 mr-2 text-amber-400" />
            {companion.name} the {companion.species}
          </h1>

          <p className="text-slate-400 text-xs mt-1">
            Evolution: <span className="text-amber-400 font-bold">{STAGE_NAMES[companion.stage - 1]}</span> &bull; Synchronized to your debugging streak and shield HP.
          </p>
        </div>

        {/* Inventory Summary */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="text-center px-2 border-r border-slate-800">
            <span className="text-[10px] text-slate-500 block">Patches</span>
            <span className="text-cyber-cyan font-bold">{player.inventory.cleanCodePatches}</span>
          </div>
          <div className="text-center px-2 border-r border-slate-800">
            <span className="text-[10px] text-slate-500 block">AV Drives</span>
            <span className="text-cyber-purple font-bold">{player.inventory.antiVirusDrives}</span>
          </div>
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-500 block">Neural Cores</span>
            <span className="text-amber-400 font-bold">{player.inventory.neuralCores}</span>
          </div>
        </div>
      </div>

      {/* Main Companion Showcase Chamber */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Animated Sprite Container */}
        <div className="md:col-span-7 bg-slate-950/90 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden shadow-2xl">
          {/* Cyber Chamber Ambient Glow */}
          <div
            className={`absolute inset-0 pointer-events-none opacity-20 transition-all duration-700 ${
              isCorrupted
                ? 'bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950'
                : 'bg-gradient-to-b from-cyan-950 via-purple-950/30 to-slate-950'
            }`}
          />

          {/* Dialogue Speech Bubble */}
          <div
            className={`w-full p-3 rounded-xl border text-xs z-10 transition-all ${
              isCorrupted
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                : 'bg-slate-900/90 border-cyber-cyan/40 text-cyan-200 shadow-md shadow-cyber-cyan/10'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-bold flex items-center">
                <Terminal className="w-3 h-3 mr-1" />
                {companion.name} Transceiver:
              </span>
              <span className="uppercase">{isCorrupted ? 'ANOMALY DETECTED' : 'ONLINE'}</span>
            </div>
            <p className="leading-relaxed text-[11px]">&quot;{getCompanionDialogue()}&quot;</p>
          </div>

          {/* Animated SVG Cyber Owl Sprite */}
          <div className="relative my-8 z-10 select-none flex items-center justify-center">
            {/* Halo ring for Clean Form */}
            {!isCorrupted && (
              <div className="absolute w-56 h-56 rounded-full border border-cyber-cyan/30 animate-pulse pointer-events-none" />
            )}

            {/* SVG Sprite */}
            <svg
              className={`w-48 h-48 transition-all duration-300 ${
                isCorrupted ? 'animate-glitch filter drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]' : 'filter drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]'
              }`}
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ears / Antennas */}
              <polygon
                points={isCorrupted ? '55,30 75,70 45,75' : '60,35 80,70 50,75'}
                fill={isCorrupted ? '#EF4444' : '#06B6D4'}
              />
              <polygon
                points={isCorrupted ? '145,30 155,75 125,70' : '140,35 150,75 120,70'}
                fill={isCorrupted ? '#EF4444' : '#06B6D4'}
              />

              {/* Head & Body Chassis */}
              <rect
                x="50"
                y="60"
                width="100"
                height="95"
                rx={isCorrupted ? '4' : '20'}
                fill={isCorrupted ? '#1E1B2E' : '#0F172A'}
                stroke={isCorrupted ? '#EF4444' : '#06B6D4'}
                strokeWidth="3"
              />

              {/* Visor Screen */}
              <rect
                x="65"
                y="75"
                width="70"
                height="32"
                rx={isCorrupted ? '2' : '8'}
                fill="#000000"
                stroke={isCorrupted ? '#F59E0B' : '#A855F7'}
                strokeWidth="2"
              />

              {/* Optics / Eyes */}
              {isCorrupted ? (
                <>
                  {/* Corrupted Red Glitch Eyes */}
                  <text x="75" y="96" fill="#EF4444" fontSize="18" fontWeight="bold">
                    &times;
                  </text>
                  <text x="110" y="96" fill="#EF4444" fontSize="18" fontWeight="bold">
                    &times;
                  </text>
                </>
              ) : (
                <>
                  {/* Glowing Cyan Cyber Visor Eyes */}
                  <circle cx="82" cy="91" r="7" fill="#06B6D4" />
                  <circle cx="82" cy="91" r="3" fill="#FFFFFF" />
                  <circle cx="118" cy="91" r="7" fill="#06B6D4" />
                  <circle cx="118" cy="91" r="3" fill="#FFFFFF" />
                </>
              )}

              {/* Mechanical Beak */}
              <polygon
                points="100,112 92,122 108,122"
                fill={isCorrupted ? '#F59E0B' : '#38BDF8'}
              />

              {/* Chest Core Matrix */}
              <rect
                x="80"
                y="130"
                width="40"
                height="15"
                rx="4"
                fill="#000000"
                stroke={isCorrupted ? '#EF4444' : '#10B981'}
                strokeWidth="1.5"
              />
              <rect
                x="83"
                y="133"
                width={isCorrupted ? '12' : '34'}
                height="9"
                rx="2"
                fill={isCorrupted ? '#EF4444' : '#10B981'}
              />

              {/* Wings */}
              <path
                d="M 45 85 Q 25 120 45 140"
                stroke={isCorrupted ? '#EF4444' : '#06B6D4'}
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 155 85 Q 175 120 155 140"
                stroke={isCorrupted ? '#EF4444' : '#06B6D4'}
                strokeWidth="4"
                fill="none"
              />

              {/* Claws */}
              <line x1="75" y1="155" x2="75" y2="168" stroke={isCorrupted ? '#EF4444' : '#06B6D4'} strokeWidth="3" />
              <line x1="125" y1="155" x2="125" y2="168" stroke={isCorrupted ? '#EF4444' : '#06B6D4'} strokeWidth="3" />
            </svg>
          </div>

          {/* Sprite Stage Info Bar */}
          <div className="z-10 flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-amber-400 font-bold">{STAGE_NAMES[companion.stage - 1]}</span>
            <span>&bull;</span>
            <span>Happiness: {companion.happiness}%</span>
            <span>&bull;</span>
            <span>Energy: {companion.energy}%</span>
          </div>
        </div>

        {/* Right Column: Companion Care Controls & Evolution Chamber */}
        <div className="md:col-span-5 flex flex-col space-y-4">
          {/* Status Telemetry Meters */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <Zap className="w-3.5 h-3.5 mr-1 text-cyber-cyan" />
              Neural Telemetry
            </h3>

            {/* Corruption Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center text-rose-400 font-bold">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Corruption Level
                </span>
                <span className="font-bold text-rose-400">{companion.corruption}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${companion.corruption}%` }}
                />
              </div>
            </div>

            {/* Energy Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center text-cyber-cyan font-bold">
                  <Battery className="w-3 h-3 mr-1" />
                  Energy Reserves
                </span>
                <span className="font-bold text-cyber-cyan">{companion.energy}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-cyber-cyan h-full transition-all duration-300 rounded-full"
                  style={{ width: `${companion.energy}%` }}
                />
              </div>
            </div>

            {/* Happiness Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center text-emerald-400 font-bold">
                  <Heart className="w-3 h-3 mr-1" />
                  Affinity / Happiness
                </span>
                <span className="font-bold text-emerald-400">{companion.happiness}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${companion.happiness}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Care Actions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Cyber Nurturing Protocols
            </h3>

            {/* Action 1: Feed Clean Code */}
            <button
              onClick={feedCompanion}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-cyber-cyan/30 text-xs transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded bg-cyber-cyan/20 text-cyber-cyan">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-200 group-hover:text-cyber-cyan transition-colors">
                    Feed Clean Code Patch
                  </div>
                  <div className="text-[10px] text-slate-400">
                    +20 Energy, +15 Happiness, -4% Corruption
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-cyber-cyan">
                Cost: 1 Patch
              </span>
            </button>

            {/* Action 2: Anti-Virus Purge */}
            <button
              onClick={purgeCompanionCorruption}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-cyber-purple/30 text-xs transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded bg-cyber-purple/20 text-cyber-purple">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-200 group-hover:text-cyber-purple transition-colors">
                    Run Anti-Virus Purge
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Purges 25% corruption immediately &bull; +75 XP
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-cyber-purple">
                Cost: 1 AV Drive
              </span>
            </button>

            {/* Action 3: Train Neural Core */}
            <button
              onClick={trainCompanionCore}
              disabled={companion.stage >= 4}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-amber-500/30 text-xs transition-all group disabled:opacity-50"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded bg-amber-500/20 text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                    Evolve Neural Core
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {companion.stage >= 4
                      ? 'Maximum Evolution Stage Reached'
                      : `Advance to Stage ${companion.stage + 1} &bull; +200 XP`}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-amber-400">
                {companion.stage >= 4 ? 'MAX' : 'Cost: 1 Core'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
