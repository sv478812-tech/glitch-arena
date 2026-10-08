'use client';

import React, { useState } from 'react';
import { ExecutionOutput } from '@/types';
import {
  CheckCircle2,
  XCircle,
  Terminal,
  Clock,
  AlertOctagon,
  FileText,
  Check,
  X,
} from 'lucide-react';

interface TerminalOutputProps {
  output: ExecutionOutput | null;
  isRunning: boolean;
  onClear: () => void;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  output,
  isRunning,
  onClear,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'stdout' | 'raw'>('tests');

  return (
    <div className="flex flex-col h-full bg-slate-950/95 border border-slate-800 rounded-xl overflow-hidden font-mono shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
          <span className="font-bold text-slate-300">TERMINAL OUTPUT</span>
          {output && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                output.allPassed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {output.allPassed ? 'ALL TESTS PASSED' : 'ASSERTIONS FAILED'}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {output && (
            <span className="text-[11px] text-slate-400 flex items-center">
              <Clock className="w-3 h-3 mr-1 text-cyber-cyan" />
              {output.executionTimeMs}ms
            </span>
          )}
          <button
            onClick={onClear}
            className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Subtabs */}
      <div className="flex items-center space-x-1 px-3 py-1.5 bg-slate-950 border-b border-slate-800/80 text-[11px]">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeTab === 'tests'
              ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Test Assertions {output ? `(${output.results.filter(r => r.passed).length}/${output.results.length})` : ''}
        </button>
        <button
          onClick={() => setActiveTab('stdout')}
          className={`px-2.5 py-1 rounded transition-colors ${
            activeTab === 'stdout'
              ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Console Logs {output?.stdout.length ? `(${output.stdout.length})` : ''}
        </button>
      </div>

      {/* Terminal Content Area */}
      <div className="flex-1 p-3 overflow-y-auto text-xs min-h-[180px]">
        {isRunning ? (
          <div className="flex items-center space-x-2 text-cyber-cyan animate-pulse py-4">
            <span className="w-3 h-3 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            <span>&gt; Executing test suite against client sandbox...</span>
          </div>
        ) : !output ? (
          <div className="text-slate-500 py-6 text-center italic">
            &gt; Ready. Click &quot;Run Code &amp; Tests&quot; to execute function against test assertions.
          </div>
        ) : output.syntaxError ? (
          <div className="bg-rose-950/40 border border-rose-500/50 p-3 rounded-lg text-rose-300 space-y-2">
            <div className="flex items-center font-bold text-rose-400 text-sm">
              <AlertOctagon className="w-4 h-4 mr-2" />
              Runtime / Syntax Exception
            </div>
            <pre className="text-xs bg-slate-950 p-2 rounded border border-rose-900/50 text-rose-200 whitespace-pre-wrap font-mono">
              {output.syntaxError}
            </pre>
            <p className="text-[11px] text-rose-300/80">
              Check your syntax, variable declarations, or index boundaries.
            </p>
          </div>
        ) : activeTab === 'tests' ? (
          <div className="space-y-2.5">
            {output.results.map((res, idx) => (
              <div
                key={res.testId || idx}
                className={`p-2.5 rounded-lg border transition-all ${
                  res.passed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/25 border-rose-500/50 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-200">
                      Test #{idx + 1}: {res.inputDescription}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-black ${
                      res.passed
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/30 text-rose-300'
                    }`}
                  >
                    {res.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                {/* Test details */}
                <div className="text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 bg-slate-950/70 p-2 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Output:</span>
                    <span className="text-cyber-cyan font-bold break-all">
                      {JSON.stringify(res.expected)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Your Output:</span>
                    <span
                      className={`font-bold break-all ${
                        res.passed ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {res.error ? (
                        <span className="text-rose-400 italic">Error: {res.error}</span>
                      ) : (
                        JSON.stringify(res.actual)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Stdout Tab */
          <div className="space-y-1.5">
            {output.stdout.length === 0 ? (
              <div className="text-slate-500 italic py-2">
                &gt; No console output generated. Add console.log / print statements to trace variable state.
              </div>
            ) : (
              output.stdout.map((line, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-slate-300">
                  <span className="text-cyber-cyan select-none">&gt;</span>
                  <span className="break-all">{line}</span>
                </div>
              ))
            )}
            {output.stderr.length > 0 && (
              <div className="mt-3 pt-2 border-t border-rose-900/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400">Standard Error (stderr):</span>
                {output.stderr.map((line, idx) => (
                  <div key={idx} className="text-rose-400 text-xs">
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
