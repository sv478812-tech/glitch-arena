import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '@/context/GameContext';
import { ToastContainer } from '@/components/ToastContainer';

export const metadata: Metadata = {
  title: 'GlitchArena | Gamified Debugging & PvP Duel Platform',
  description:
    'An AI-powered gamified debugging platform where beginners learn to code by hunting bugs and competing in asymmetric Glitch & Shield card duels.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-cyber-bg text-slate-100 min-h-screen selection:bg-cyber-cyan selection:text-slate-950">
        <GameProvider>
          {children}
          <ToastContainer />
        </GameProvider>
      </body>
    </html>
  );
}
