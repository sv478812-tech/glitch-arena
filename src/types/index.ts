export type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';
export type Language = 'javascript' | 'python';

export interface TestCase {
  id: string;
  inputDescription: string;
  args: any[];
  expected: any;
  isHidden?: boolean;
}

export interface TestResult {
  testId: string;
  inputDescription: string;
  passed: boolean;
  actual?: any;
  expected: any;
  error?: string;
  executionTimeMs: number;
}

export interface ExecutionOutput {
  stdout: string[];
  stderr: string[];
  results: TestResult[];
  allPassed: boolean;
  executionTimeMs: number;
  syntaxError?: string;
}

export interface CodeChallenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  language: Language;
  category: string;
  summary: string;
  description: string;
  initialCode: string;
  solutionCode: string;
  functionName: string;
  buggyLineRange: [number, number]; // 1-indexed lines for Tier 3 highlight
  hints: {
    tier1: string; // Subtle direction (Line hint)
    tier2: string; // Socratic question about state values
    tier3: string; // Visual highlight & direct fix explanation
  };
  testCases: TestCase[];
  xpReward: number;
}

export interface PlayerStats {
  streak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  shieldHp: number;
  maxShieldHp: number;
  solvedChallengeIds: string[];
  inventory: {
    cleanCodePatches: number;
    antiVirusDrives: number;
    neuralCores: number;
  };
}

export type GlitchType =
  | 'off_by_one'
  | 'type_coercion'
  | 'scope_mutator'
  | 'null_pointer'
  | 'shallow_mutation'
  | 'inverted_logic';

export interface BugCard {
  id: string;
  name: string;
  glitchType: GlitchType;
  cost: number;
  category: string;
  badge: string;
  description: string;
  effect: string;
  iconName: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
}

export interface TargetFunction {
  id: string;
  name: string;
  description: string;
  cleanCode: string;
  testCases: TestCase[];
}

export interface DuelState {
  mode: 'vs_ai' | 'hotseat';
  phase: 'attacker_turn' | 'injection_animation' | 'defender_turn' | 'victory' | 'defeat';
  turnNumber: number;
  attackerName: string;
  defenderName: string;
  attackerHp: number;
  maxAttackerHp: number;
  defenderHp: number;
  maxDefenderHp: number;
  selectedCards: BugCard[];
  targetFunction: TargetFunction;
  currentCode: string;
  baseCode: string;
  timeLeft: number;
  duelLogs: string[];
  bugsInjectedCount: number;
}

export interface CompanionState {
  name: string;
  species: string;
  stage: 1 | 2 | 3 | 4;
  corruption: number; // 0 to 100
  energy: number;     // 0 to 100
  happiness: number;  // 0 to 100
  avatar: string;
  lastFedTimestamp: number;
}
