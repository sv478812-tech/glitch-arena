'use client';

import React, { useState } from 'react';
import { CodeChallenge } from '@/types';
import {
  Sparkles,
  Bot,
  HelpCircle,
  Eye,
  CheckCircle,
  Send,
  MessageSquare,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';
import { sound } from '@/utils/audio';

interface CyberMentorProps {
  challenge: CodeChallenge;
  unlockedTier: 0 | 1 | 2 | 3;
  onUnlockNextTier: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'mentor' | 'user';
  text: string;
  time: string;
}

export const CyberMentor: React.FC<CyberMentorProps> = ({
  challenge,
  unlockedTier,
  onUnlockNextTier,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'mentor',
      text: `Greetings, Operator. I am CYBER-SOCRATES v3.1. I guide you toward bugs through inquiry, not by spoon-feeding solutions. Review the code anomalies or request progressive hint tiers below.`,
      time: 'ONLINE',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      time: 'NOW',
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // AI Socratic reasoning engine
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('off by one') || lower.includes('bounds') || lower.includes('length')) {
        reply = `Examine how indexing begins at 0. When an array has 4 items, what is the index of the 4th item? What happens if your loop reaches i = 4?`;
      } else if (lower.includes('coercion') || lower.includes('nan') || lower.includes('string')) {
        reply = `Observe the '+' operator in JavaScript and Python. When you combine a string with a number, does the runtime perform arithmetic addition or lexicographical concatenation?`;
      } else if (lower.includes('shallow') || lower.includes('copy') || lower.includes('mutation')) {
        reply = `Consider memory addresses. When you copy an array with the spread operator [...matrix], the outer array is cloned, but what happens to the objects or sub-arrays stored inside it?`;
      } else if (lower.includes('hint') || lower.includes('help')) {
        reply = `Unlock Tier ${unlockedTier + 1} hints using the diagnostic button above, or inspect the terminal test assertion failure to compare expected vs actual values.`;
      } else {
        reply = `A keen query. Trace the values of each variable across the first two iterations of your loop. Where does the program state first diverge from your mental model?`;
      }

      const mentorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'mentor',
        text: reply,
        time: 'SYNC',
      };
      setMessages((prev) => [...prev, mentorMsg]);
      setIsTyping(false);
      sound.playClick();
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/95 border border-slate-800 rounded-xl overflow-hidden font-mono shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-cyber-purple animate-pulse" />
          <span className="font-bold text-slate-200">CYBER-SOCRATES // AI MENTOR</span>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] text-cyber-purple font-bold">
          <span className="w-2 h-2 rounded-full bg-cyber-purple animate-ping inline-block" />
          <span>NEURAL MENTOR ACTIVE</span>
        </div>
      </div>

      {/* 3-Tier Progressive Socratic Hint System */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Progressive Socratic Hints ({unlockedTier}/3)
          </span>

          {unlockedTier < 3 ? (
            <button
              onClick={() => {
                sound.playGlitchZap();
                onUnlockNextTier();
              }}
              className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-cyber-purple/20 text-cyber-purple hover:bg-cyber-purple/30 border border-cyber-purple/40 font-bold transition-all shadow-sm shadow-cyber-purple/20"
            >
              <Unlock className="w-3 h-3 mr-1" />
              <span>Unlock Tier {unlockedTier + 1} Hint</span>
            </button>
          ) : (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              ALL HINTS UNLOCKED
            </span>
          )}
        </div>

        {/* Tier Cards List */}
        <div className="grid grid-cols-1 gap-2">
          {/* Tier 1: Subtle Direction */}
          <div
            className={`p-2.5 rounded-lg border text-xs transition-all ${
              unlockedTier >= 1
                ? 'bg-cyan-950/20 border-cyber-cyan/40 text-cyan-200'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="flex items-center text-[11px]">
                {unlockedTier >= 1 ? (
                  <Unlock className="w-3 h-3 mr-1.5 text-cyber-cyan" />
                ) : (
                  <Lock className="w-3 h-3 mr-1.5" />
                )}
                Tier 1: Subtle Direction
              </span>
              <span className="text-[10px] uppercase opacity-75">Line Pointer</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {unlockedTier >= 1 ? challenge.hints.tier1 : 'Locked. Unlock to receive subtle guidance toward buggy logic.'}
            </p>
          </div>

          {/* Tier 2: Socratic Question */}
          <div
            className={`p-2.5 rounded-lg border text-xs transition-all ${
              unlockedTier >= 2
                ? 'bg-purple-950/25 border-cyber-purple/40 text-purple-200'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="flex items-center text-[11px]">
                {unlockedTier >= 2 ? (
                  <Unlock className="w-3 h-3 mr-1.5 text-cyber-purple" />
                ) : (
                  <Lock className="w-3 h-3 mr-1.5" />
                )}
                Tier 2: Socratic Inquiry
              </span>
              <span className="text-[10px] uppercase opacity-75">State Questions</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {unlockedTier >= 2 ? challenge.hints.tier2 : 'Locked. Unlock to receive a targeted inquiry about variable states.'}
            </p>
          </div>

          {/* Tier 3: Visual Highlight & Region Fix */}
          <div
            className={`p-2.5 rounded-lg border text-xs transition-all ${
              unlockedTier >= 3
                ? 'bg-amber-950/25 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/20'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="flex items-center text-[11px]">
                {unlockedTier >= 3 ? (
                  <Eye className="w-3 h-3 mr-1.5 text-amber-400" />
                ) : (
                  <Lock className="w-3 h-3 mr-1.5" />
                )}
                Tier 3: Visual Zone Highlight
              </span>
              <span className="text-[10px] uppercase opacity-75">Exact Remedy</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {unlockedTier >= 3
                ? challenge.hints.tier3
                : 'Locked. Highlights the exact buggy line range in the editor.'}
            </p>
          </div>
        </div>
      </div>

      {/* Socratic Dialogue Chat Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs min-h-[160px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="text-[10px] text-slate-500 mb-0.5 px-1">
              {m.sender === 'mentor' ? 'CYBER-SOCRATES' : 'YOU'} &bull; {m.time}
            </div>
            <div
              className={`p-2.5 rounded-xl max-w-[90%] text-[11px] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-cyber-cyan/20 text-cyan-200 border border-cyber-cyan/40'
                  : 'bg-slate-900 text-slate-200 border border-slate-800'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-1.5 text-cyber-purple text-[11px] p-2">
            <span className="w-2 h-2 rounded-full bg-cyber-purple animate-ping" />
            <span>Cyber-Socrates synthesizing Socratic inquiry...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto text-[10px]">
        <button
          onClick={() => handleSendMessage('Why is my test failing?')}
          className="whitespace-nowrap px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Why is my test failing?
        </button>
        <button
          onClick={() => handleSendMessage('Explain the bug in simple terms')}
          className="whitespace-nowrap px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Explain the bug
        </button>
        <button
          onClick={() => handleSendMessage('What is the difference between shallow and deep copy?')}
          className="whitespace-nowrap px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Shallow vs Deep Copy
        </button>
      </div>

      {/* Chat Input Field */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask Cyber Mentor for Socratic advice..."
          className="flex-1 bg-slate-950 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-cyber-purple font-mono"
        />
        <button
          onClick={() => handleSendMessage()}
          className="p-2 rounded-lg bg-cyber-purple/20 text-cyber-purple hover:bg-cyber-purple/40 border border-cyber-purple/50 transition-colors"
          title="Send message to mentor"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
