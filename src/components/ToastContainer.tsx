'use client';

import React from 'react';
import { useGame, ToastMessage } from '@/context/GameContext';
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none font-mono">
      {toasts.map((toast) => {
        let borderColor = 'border-cyber-cyan/60';
        let bgColor = 'bg-slate-900/95';
        let textColor = 'text-cyan-300';
        let Icon = Info;

        if (toast.type === 'success') {
          borderColor = 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
          textColor = 'text-emerald-400';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          borderColor = 'border-rose-500/80 shadow-[0_0_15px_rgba(239,68,68,0.35)]';
          textColor = 'text-rose-400';
          Icon = AlertOctagon;
        } else if (toast.type === 'warning') {
          borderColor = 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
          textColor = 'text-amber-400';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-md shadow-2xl flex items-start space-x-2.5 transition-all animate-in slide-in-from-bottom-2`}
          >
            <Icon className={`w-4 h-4 ${textColor} shrink-0 mt-0.5`} />
            <div className="flex-1">
              {toast.title && (
                <div className={`text-[10px] uppercase font-bold tracking-wider ${textColor}`}>
                  {toast.title}
                </div>
              )}
              <div className="text-xs text-slate-200 leading-snug">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
