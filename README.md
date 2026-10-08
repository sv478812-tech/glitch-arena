# ⚔️ GlitchArena

> **An AI-powered gamified debugging platform where beginners learn to code by hunting bugs and competing in asymmetric "Glitch & Shield" card duels.**

---

## 🚀 Live Server & Workspace
- **Local URL:** `http://localhost:3000`
- **Project Directory:** `C:\Users\Admin\.gemini\antigravity\scratch\glitch-arena`
- *(Recommended: Set `C:\Users\Admin\.gemini\antigravity\scratch\glitch-arena` as your active workspace)*

---

## 👾 Core Features

### 1. 🎯 Single Player Arena (Daily Debugging Hunt)
- **Problem Header:** Daily hunt challenges across **Beginner**, **Intermediate**, and **Expert** tiers for both **JavaScript** and **Python**.
  - **Tier 1 (Beginner):** Off-by-one array indexing error (`<` vs `<=`, `range(len(items) + 1)` out-of-bounds).
  - **Tier 2 (Intermediate):** Type coercion in string concatenation inside dictionary & loop tallies (`total = "0"` or `str + int`).
  - **Tier 3 (Expert):** Shallow copy array mutation bug (`[...matrix]` or `events.copy()` mutating nested records).
- **Code Editor Panel:**
  - Dual-engine editor: **Monaco IDE** and **Retro Terminal Hacker Editor**.
  - Syntax highlighting for JavaScript and Python.
  - Reset code, copy code, tab indentation support.
- **Control Bar:**
  - `[Run Code & Tests]` button: Executes code in isolated client sandbox against public and hidden test cases.
  - `[Ask Cyber Mentor]` button: Unlocks progressive 3-tier Socratic hints:
    - **Tier 1:** Subtle direction (Line hint).
    - **Tier 2:** Socratic inquiry about state values.
    - **Tier 3:** Visual highlight directly on the buggy code region.
- **Terminal Output Window:**
  - Real-time stdout console logs.
  - Pass/fail assertion badges with execution timing (ms).
  - Comprehensive stack trace inspection and error explanations.

---

### 2. 🛡️ Glitch & Shield PvP (Asymmetric Turn-Based Duel)
- **Phase 1: Attacker Corrupts Code**
  - Select 1 or 2 **Bug Cards** from the attacker's hand:
    1. *Off-by-One Curse* (Corrupts array loop bounds)
    2. *Type Coercion Poison* (Converts int to string)
    3. *Scope Mutator* (Leaks variables or shadows state)
    4. *Null Pointer Wraith* (Removes guards on missing properties)
    5. *Logic Inverter Hex* (Reverses boolean filter conditions)
    6. *Shallow Mutation Hex* (Pointers mutate source data)
  - Choose target clean function (`calculateCartTotal` or `filterActivePilots`).
  - `[Inject Glitches & Transmit]` launches corrupted code to Defender!
- **Phase 2: Defender Repairs Code (90s Shield Timer)**
  - Defender receives the corrupted code and must inspect output, run tests, and fix bugs before Shield HP drains to 0.
  - Submitting passing tests restores Shield HP and deals 50 damage to the Attacker core!
- **Duel Modes:**
  - **Vs AI Glitch Phantom:** Battle against automated synthetic adversaries.
  - **Hotseat 2-Player ("Pass the Terminal"):** Local PvP duel between two operators.

---

### 3. 🦉 Cyber Companion (Tamagotchi Pet: Byte-y)
- **Animated SVG & ASCII Glitch Sprite:**
  - **Clean Glowing Form:** High streak / healthy state with glowing cyan visor, holographic halo, and energetic dialogue.
  - **Corrupted Pixel Form:** Low streak / low health with flickering red CRT glitch shaders and alarm states.
- **Evolution Stages:**
  - Stage 1: *Byte Hatchling*
  - Stage 2: *Cyber Owlet*
  - Stage 3: *Void Strigiformes*
  - Stage 4: *Chrono Archon*
- **Tamagotchi Interactions:**
  - 🧩 **Feed Clean Code Patch:** Restores Energy & Happiness, lowers Corruption.
  - 🛡️ **Run Anti-Virus Purge:** Purges 25% corruption with sound effects.
  - ⚡ **Evolve Neural Core:** Upgrades evolution stage and awards +200 XP.

---

### 4. 🎛️ Audio FX & Micro-Interactions
- **Web Audio API Synthesizer:** 100% client-side retro 8-bit sound effects (keystrokes, victory fanfare, error buzzer, glitch zap, shield alarm, level up chords).
- **Retro CRT Scanlines:** Toggleable scanlines filter.
- **Haptic Screen Shake:** Visual screen-shake on test failures and damage.
- **Toast Notifications:** Crisp cyberpunk toasts for rank-ups, item drops, and card actions.
