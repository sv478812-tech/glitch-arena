'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerStats, CompanionState } from '@/types';
import { sound } from '@/utils/audio';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

interface GameContextType {
  player: PlayerStats;
  companion: CompanionState;
  isMuted: boolean;
  crtMode: boolean;
  toasts: ToastMessage[];
  screenShaking: boolean;
  triggerScreenShake: () => void;
  toggleMute: () => void;
  toggleCrtMode: () => void;
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;
  addXp: (amount: number) => void;
  takeShieldDamage: (amount: number) => void;
  restoreShield: (amount: number) => void;
  completeChallenge: (challengeId: string, xpReward: number) => void;
  feedCompanion: () => boolean;
  purgeCompanionCorruption: () => boolean;
  trainCompanionCore: () => boolean;
  resetProgress: () => void;
}

const DEFAULT_PLAYER: PlayerStats = {
  streak: 3,
  level: 4,
  xp: 450,
  xpToNextLevel: 1000,
  shieldHp: 100,
  maxShieldHp: 100,
  solvedChallengeIds: [],
  inventory: {
    cleanCodePatches: 5,
    antiVirusDrives: 2,
    neuralCores: 1,
  },
};

const DEFAULT_COMPANION: CompanionState = {
  name: 'Byte-y',
  species: 'Cyber Owl',
  stage: 2,
  corruption: 18,
  energy: 85,
  happiness: 92,
  avatar: 'owl',
  lastFedTimestamp: Date.now(),
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerStats>(DEFAULT_PLAYER);
  const [companion, setCompanion] = useState<CompanionState>(DEFAULT_COMPANION);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [crtMode, setCrtMode] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [screenShaking, setScreenShaking] = useState<boolean>(false);

  // Load local state on mount
  useEffect(() => {
    try {
      const savedPlayer = localStorage.getItem('glitcharena_player');
      if (savedPlayer) setPlayer(JSON.parse(savedPlayer));

      const savedCompanion = localStorage.getItem('glitcharena_companion');
      if (savedCompanion) setCompanion(JSON.parse(savedCompanion));

      const savedCrt = localStorage.getItem('glitcharena_crt');
      if (savedCrt !== null) setCrtMode(savedCrt === 'true');

      setIsMuted(sound.getMuted());
    } catch {
      // Ignored
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('glitcharena_player', JSON.stringify(player));
    } catch {}
  }, [player]);

  useEffect(() => {
    try {
      localStorage.setItem('glitcharena_companion', JSON.stringify(companion));
    } catch {}
  }, [companion]);

  const triggerScreenShake = () => {
    setScreenShaking(true);
    setTimeout(() => setScreenShaking(false), 450);
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
    showToast(next ? 'Audio muted' : 'Audio synth active', 'info', 'AUDIO MATRIX');
  };

  const toggleCrtMode = () => {
    setCrtMode((prev) => {
      const next = !prev;
      localStorage.setItem('glitcharena_crt', String(next));
      sound.playClick();
      return next;
    });
  };

  const addXp = (amount: number) => {
    setPlayer((prev) => {
      let nextXp = prev.xp + amount;
      let nextLevel = prev.level;
      let nextMaxXp = prev.xpToNextLevel;

      while (nextXp >= nextMaxXp) {
        nextXp -= nextMaxXp;
        nextLevel += 1;
        nextMaxXp = Math.floor(nextMaxXp * 1.35);
        sound.playLevelUp();
        showToast(`LEVEL UP! You reached Level ${nextLevel}!`, 'success', '⚡ SYSTEM OVERCLOCK');

        // Check companion evolution
        setCompanion((comp) => {
          let nextStage = comp.stage;
          if (nextLevel >= 8) nextStage = 4;
          else if (nextLevel >= 5) nextStage = 3;
          else if (nextLevel >= 3) nextStage = 2;
          return { ...comp, stage: nextStage };
        });
      }

      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        xpToNextLevel: nextMaxXp,
      };
    });
  };

  const takeShieldDamage = (amount: number) => {
    triggerScreenShake();
    sound.playError();
    setPlayer((prev) => {
      const nextHp = Math.max(0, prev.shieldHp - amount);
      if (nextHp <= 25 && prev.shieldHp > 25) {
        sound.playShieldAlarm();
        showToast('CRITICAL: Shield Integrity below 25%!', 'warning', '⚠️ SHIELD BREACH');
      }
      return { ...prev, shieldHp: nextHp };
    });
  };

  const restoreShield = (amount: number) => {
    setPlayer((prev) => ({
      ...prev,
      shieldHp: Math.min(prev.maxShieldHp, prev.shieldHp + amount),
    }));
  };

  const completeChallenge = (challengeId: string, xpReward: number) => {
    sound.playSuccess();
    addXp(xpReward);

    setPlayer((prev) => {
      const alreadySolved = prev.solvedChallengeIds.includes(challengeId);
      const nextSolved = alreadySolved ? prev.solvedChallengeIds : [...prev.solvedChallengeIds, challengeId];
      return {
        ...prev,
        solvedChallengeIds: nextSolved,
        streak: alreadySolved ? prev.streak : prev.streak + 1,
        shieldHp: Math.min(prev.maxShieldHp, prev.shieldHp + 20),
        inventory: {
          ...prev.inventory,
          cleanCodePatches: prev.inventory.cleanCodePatches + 1,
        },
      };
    });

    setCompanion((comp) => ({
      ...comp,
      happiness: Math.min(100, comp.happiness + 8),
      corruption: Math.max(0, comp.corruption - 5),
    }));

    showToast(`Bug Exterminated! +${xpReward} XP & Clean Code Patch earned!`, 'success', '🏆 BUG HUNT COMPLETE');
  };

  const feedCompanion = (): boolean => {
    if (player.inventory.cleanCodePatches <= 0) {
      sound.playError();
      showToast('Need Clean Code Patches! Complete bug challenges to acquire more.', 'warning', 'EMPTY INVENTORY');
      return false;
    }

    sound.playClick();
    setPlayer((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        cleanCodePatches: prev.inventory.cleanCodePatches - 1,
      },
    }));

    setCompanion((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 20),
      happiness: Math.min(100, prev.happiness + 15),
      corruption: Math.max(0, prev.corruption - 4),
    }));

    addXp(40);
    showToast('Fed Byte-y clean logic blocks! +40 XP', 'success', 'PET NURTURED');
    return true;
  };

  const purgeCompanionCorruption = (): boolean => {
    if (player.inventory.antiVirusDrives <= 0) {
      sound.playError();
      showToast('Need Anti-Virus Purge Drives! Defeat PvP duelists to loot more.', 'warning', 'EMPTY INVENTORY');
      return false;
    }

    sound.playGlitchZap();
    setPlayer((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        antiVirusDrives: prev.inventory.antiVirusDrives - 1,
      },
    }));

    setCompanion((prev) => ({
      ...prev,
      corruption: Math.max(0, prev.corruption - 25),
      happiness: Math.min(100, prev.happiness + 10),
    }));

    addXp(75);
    showToast('Deep Anti-Virus scan wiped 25% corruption! +75 XP', 'success', 'CLEANSED');
    return true;
  };

  const trainCompanionCore = (): boolean => {
    if (player.inventory.neuralCores <= 0) {
      sound.playError();
      showToast('Need Neural Cores! Level up or complete Expert challenges.', 'warning', 'EMPTY INVENTORY');
      return false;
    }

    sound.playLevelUp();
    setPlayer((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        neuralCores: prev.inventory.neuralCores - 1,
      },
    }));

    setCompanion((prev) => ({
      ...prev,
      stage: Math.min(4, (prev.stage + 1) as 1 | 2 | 3 | 4) as 1 | 2 | 3 | 4,
      happiness: 100,
      energy: 100,
    }));

    addXp(200);
    showToast('Neural Core fused! Byte-y expanded cognitive matrices! +200 XP', 'success', 'EVOLUTION BURST');
    return true;
  };

  const resetProgress = () => {
    setPlayer(DEFAULT_PLAYER);
    setCompanion(DEFAULT_COMPANION);
    localStorage.removeItem('glitcharena_player');
    localStorage.removeItem('glitcharena_companion');
    showToast('All neural memory wiped to initial boot state.', 'info', 'SYSTEM REBOOT');
  };

  return (
    <GameContext.Provider
      value={{
        player,
        companion,
        isMuted,
        crtMode,
        toasts,
        screenShaking,
        triggerScreenShake,
        toggleMute,
        toggleCrtMode,
        showToast,
        removeToast,
        addXp,
        takeShieldDamage,
        restoreShield,
        completeChallenge,
        feedCompanion,
        purgeCompanionCorruption,
        trainCompanionCore,
        resetProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
