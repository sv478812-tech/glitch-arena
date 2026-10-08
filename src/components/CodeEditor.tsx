'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '@/types';
import {
  Code,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { sound } from '@/utils/audio';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: Language;
  onReset: () => void;
  buggyLineRange?: [number, number];
  isTier3Unlocked?: boolean;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onReset,
  buggyLineRange,
  isTier3Unlocked = false,
  readOnly = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<'terminal' | 'monaco'>('terminal');
  const [monacoLoaded, setMonacoLoaded] = useState<boolean>(false);
  const monacoContainerRef = useRef<HTMLDivElement>(null);
  const monacoInstanceRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load Monaco via AMD loader from CDN when user switches to Monaco mode
  useEffect(() => {
    if (editorMode === 'monaco' && !monacoLoaded) {
      if (typeof window !== 'undefined') {
        const win = window as any;
        if (!win.require) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
          script.async = true;
          script.onload = () => {
            win.require.config({
              paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' },
            });
            win.require(['vs/editor/editor.main'], () => {
              setMonacoLoaded(true);
            });
          };
          script.onerror = () => {
            // Fall back to terminal mode if CDN fails
            setEditorMode('terminal');
          };
          document.body.appendChild(script);
        } else if (win.monaco) {
          setMonacoLoaded(true);
        } else {
          win.require(['vs/editor/editor.main'], () => {
            setMonacoLoaded(true);
          });
        }
      }
    }
  }, [editorMode, monacoLoaded]);

  // Mount Monaco editor instance
  useEffect(() => {
    if (editorMode === 'monaco' && monacoLoaded && monacoContainerRef.current) {
      const win = window as any;
      if (win.monaco && !monacoInstanceRef.current) {
        monacoInstanceRef.current = win.monaco.editor.create(monacoContainerRef.current, {
          value: code,
          language: language === 'python' ? 'python' : 'javascript',
          theme: 'vs-dark',
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
          tabSize: language === 'python' ? 4 : 2,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
        });

        monacoInstanceRef.current.onDidChangeModelContent(() => {
          const val = monacoInstanceRef.current.getValue();
          onChange(val);
        });
      }
    }

    return () => {
      if (monacoInstanceRef.current) {
        monacoInstanceRef.current.dispose();
        monacoInstanceRef.current = null;
      }
    };
  }, [editorMode, monacoLoaded]);

  // Sync external code changes to Monaco
  useEffect(() => {
    if (monacoInstanceRef.current && monacoInstanceRef.current.getValue() !== code) {
      monacoInstanceRef.current.setValue(code);
    }
  }, [code]);

  // Sync language to Monaco
  useEffect(() => {
    const win = window as any;
    if (monacoInstanceRef.current && win.monaco) {
      const model = monacoInstanceRef.current.getModel();
      if (model) {
        win.monaco.editor.setModelLanguage(model, language === 'python' ? 'python' : 'javascript');
      }
    }
  }, [language]);

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const indent = language === 'python' ? '    ' : '  ';
      const nextValue = code.substring(0, start) + indent + code.substring(end);
      onChange(nextValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + indent.length;
      }, 0);
    }
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-slate-400 flex items-center font-bold">
            <Code className="w-3.5 h-3.5 mr-1 text-cyber-cyan" />
            solution.{language === 'python' ? 'py' : 'js'}
          </span>
          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyber-cyan border border-cyber-cyan/30">
            {language}
          </span>
          {isTier3Unlocked && buggyLineRange && (
            <span className="flex items-center text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse font-bold">
              <AlertTriangle className="w-3 h-3 mr-1" />
              BUG ZONE: L{buggyLineRange[0]}-L{buggyLineRange[1]}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px]">
            <button
              onClick={() => {
                sound.playClick();
                setEditorMode('terminal');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                editorMode === 'terminal'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Retro Terminal Code Editor"
            >
              Terminal
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setEditorMode('monaco');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                editorMode === 'monaco'
                  ? 'bg-cyber-purple/20 text-cyber-purple font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Monaco IDE Engine"
            >
              Monaco
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onReset();
            }}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset code to original broken state"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Copy snippet"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 min-h-[320px] font-mono">
        {editorMode === 'monaco' ? (
          <div className="w-full h-full min-h-[320px] relative">
            {!monacoLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs z-20">
                <div className="w-6 h-6 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-2" />
                <span>CONNECTING MONACO MATRIX VIA CDN...</span>
              </div>
            )}
            <div ref={monacoContainerRef} className="w-full h-full min-h-[320px]" />
          </div>
        ) : (
          /* Retro Terminal Hacker Editor */
          <div className="flex h-full min-h-[320px] bg-slate-950 font-mono text-xs overflow-auto">
            {/* Line numbers column */}
            <div className="select-none py-3 px-2 bg-slate-900/60 text-slate-600 border-r border-slate-800/80 text-right min-w-[40px]">
              {lines.map((_, idx) => {
                const lineNum = idx + 1;
                const isBuggy =
                  isTier3Unlocked &&
                  buggyLineRange &&
                  lineNum >= buggyLineRange[0] &&
                  lineNum <= buggyLineRange[1];

                return (
                  <div
                    key={idx}
                    className={`leading-6 ${
                      isBuggy ? 'text-amber-400 font-bold bg-amber-500/20 px-1 rounded' : ''
                    }`}
                  >
                    {lineNum}
                  </div>
                );
              })}
            </div>

            {/* Editable code text area */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              disabled={readOnly}
              spellCheck={false}
              className="flex-1 bg-transparent text-slate-200 p-3 outline-none resize-none leading-6 whitespace-pre font-mono selection:bg-cyber-cyan/30 selection:text-white"
            />
          </div>
        )}

        {/* Tier 3 Bug Zone Indicator Overlay */}
        {isTier3Unlocked && buggyLineRange && (
          <div className="absolute bottom-3 right-3 bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-2 backdrop-blur-md pointer-events-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Bug localized between lines {buggyLineRange[0]} and {buggyLineRange[1]}!</span>
          </div>
        )}
      </div>
    </div>
  );
};
