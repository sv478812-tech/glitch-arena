import { CodeChallenge } from '@/types';

export const CHALLENGES: CodeChallenge[] = [
  // ==========================================
  // TIER 1: BEGINNER (Off-by-One Array Indexing)
  // ==========================================
  {
    id: 'js-tier-1-off-by-one',
    title: 'The Out-of-Bounds Spectre',
    difficulty: 'Beginner',
    language: 'javascript',
    category: 'Array Bounds',
    summary: 'Fix an off-by-one loop boundary causing undefined values and array overshoots.',
    description: `A cyber bank's ledger auditing script is failing when summing customer transaction amounts.
The function \`calculateTransactionSum(amounts)\` is iterating one index past the end of the array, introducing \`undefined\` into the sum and producing \`NaN\`.

Locate the loop boundary condition and fix it so only valid indices are processed.`,
    functionName: 'calculateTransactionSum',
    buggyLineRange: [4, 5],
    hints: {
      tier1: 'Inspect line 4 where the for-loop condition evaluates array length.',
      tier2: 'Remember that an array of length N has valid indices from 0 up to N - 1. What does `i <= amounts.length` evaluate to on the final pass?',
      tier3: 'Change `i <= amounts.length` to `i < amounts.length` (or `i <= amounts.length - 1`) so `amounts[i]` is never evaluated out-of-bounds.',
    },
    initialCode: `// Glitch Challenge: Fix the out-of-bounds loop condition
function calculateTransactionSum(amounts) {
  let total = 0;
  
  // BUG: Loop condition iterates beyond valid array index
  for (let i = 0; i <= amounts.length; i++) {
    total += amounts[i];
  }
  
  return total;
}`,
    solutionCode: `function calculateTransactionSum(amounts) {
  let total = 0;
  
  for (let i = 0; i < amounts.length; i++) {
    total += amounts[i];
  }
  
  return total;
}`,
    testCases: [
      {
        id: 'tc-1',
        inputDescription: '[10, 20, 30, 40]',
        args: [[10, 20, 30, 40]],
        expected: 100,
      },
      {
        id: 'tc-2',
        inputDescription: '[500]',
        args: [[500]],
        expected: 500,
      },
      {
        id: 'tc-3',
        inputDescription: '[] (empty ledger)',
        args: [[]],
        expected: 0,
      },
      {
        id: 'tc-4',
        inputDescription: '[15, 25, 35, 45, 55, 65] (hidden test)',
        args: [[15, 25, 35, 45, 55, 65]],
        expected: 240,
        isHidden: true,
      },
    ],
    xpReward: 150,
  },

  {
    id: 'py-tier-1-off-by-one',
    title: 'The Edge of Index Space',
    difficulty: 'Beginner',
    language: 'python',
    category: 'Array Bounds',
    summary: 'Fix a range bounds overflow causing an IndexError in Python.',
    description: `A spacecraft navigation module must calculate the maximum energy reading from a series of telemetry probes.
The function \`find_maximum_reading(readings)\` crashes with an \`IndexError: list index out of range\` because the range parameter is oversized.

Correct the loop bounds so the scanner terminates before escaping the array.`,
    functionName: 'find_maximum_reading',
    buggyLineRange: [5, 6],
    hints: {
      tier1: 'Notice the parameter passed to `range(...)` on line 5.',
      tier2: 'In Python, `range(len(items))` already yields all valid indices from `0` to `len - 1`. Why is `+ 1` added?',
      tier3: 'Remove the `+ 1` from `range(len(readings) + 1)` so it becomes `range(len(readings))`.',
    },
    initialCode: `# Glitch Challenge: Fix range bounds overflow
def find_maximum_reading(readings):
    if len(readings) == 0:
        return 0
        
    highest = readings[0]
    # BUG: Iterates past the last index of readings
    for i in range(len(readings) + 1):
        if readings[i] > highest:
            highest = readings[i]
            
    return highest`,
    solutionCode: `def find_maximum_reading(readings):
    if len(readings) == 0:
        return 0
        
    highest = readings[0]
    for i in range(len(readings)):
        if readings[i] > highest:
            highest = readings[i]
            
    return highest`,
    testCases: [
      {
        id: 'py-tc-1',
        inputDescription: '[12, 45, 78, 23]',
        args: [[12, 45, 78, 23]],
        expected: 78,
      },
      {
        id: 'py-tc-2',
        inputDescription: '[99]',
        args: [[99]],
        expected: 99,
      },
      {
        id: 'py-tc-3',
        inputDescription: '[]',
        args: [[]],
        expected: 0,
      },
      {
        id: 'py-tc-4',
        inputDescription: '[-10, -5, -2, -20] (hidden)',
        args: [[-10, -5, -2, -20]],
        expected: -2,
        isHidden: true,
      },
    ],
    xpReward: 150,
  },

  // ==========================================
  // TIER 2: INTERMEDIATE (Type Coercion in Loop)
  // ==========================================
  {
    id: 'js-tier-2-type-coercion',
    title: 'The Coercion Alchemy Poison',
    difficulty: 'Intermediate',
    language: 'javascript',
    category: 'Type System',
    summary: 'Resolve unintended string coercion inside a shopping cart tally loop.',
    description: `A cyber bazaar checkout terminal is over-charging customers or outputting bizarre string totals like \`"Total: 01020"\` instead of numeric values.
The item objects contain numeric \`price\` properties, but someone injected a string delimiter \`""\` or string concatenation in the tally accumulator, causing JavaScript to silently coerce integers into text.

Fix \`computeCartSummary(items)\` to compute the accurate arithmetic sum of all items multiplied by their quantity.`,
    functionName: 'computeCartSummary',
    buggyLineRange: [3, 7],
    hints: {
      tier1: 'Notice the starting value of `total` on line 3. Is it a number or string?',
      tier2: 'In JavaScript, `"" + 10` results in `"10"`, and `"10" + 20` results in `"1020"`. What type should `total` start as?',
      tier3: 'Initialize `total = 0` (numeric zero instead of string `"0"` or empty string), and ensure `total += item.price * item.quantity` performs numeric addition.',
    },
    initialCode: `// Glitch Challenge: Fix unexpected type coercion
function computeCartSummary(items) {
  // BUG: String initialization forces all subsequent + operations into string concatenation
  let total = "0";
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // BUG: String concatenation instead of arithmetic addition
    total = total + (item.price * item.quantity);
  }
  
  return Number(total);
}`,
    solutionCode: `function computeCartSummary(items) {
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    total += item.price * item.quantity;
  }
  
  return total;
}`,
    testCases: [
      {
        id: 'tc-2-1',
        inputDescription: '[{ price: 10, quantity: 2 }, { price: 5, quantity: 4 }]',
        args: [[{ price: 10, quantity: 2 }, { price: 5, quantity: 4 }]],
        expected: 40,
      },
      {
        id: 'tc-2-2',
        inputDescription: '[{ price: 100, quantity: 1 }]',
        args: [[{ price: 100, quantity: 1 }]],
        expected: 100,
      },
      {
        id: 'tc-2-3',
        inputDescription: '[] (empty cart)',
        args: [[]],
        expected: 0,
      },
      {
        id: 'tc-2-4',
        inputDescription: '[{ price: 3, quantity: 3 }, { price: 7, quantity: 2 }] (hidden)',
        args: [[{ price: 3, quantity: 3 }, { price: 7, quantity: 2 }]],
        expected: 23,
        isHidden: true,
      },
    ],
    xpReward: 250,
  },

  {
    id: 'py-tier-2-type-coercion',
    title: 'The Polyglot Type Fracture',
    difficulty: 'Intermediate',
    language: 'python',
    category: 'Type System',
    summary: 'Fix a TypeError when concatenating integer dictionary values with strings.',
    description: `A security drone logs intrusion alerts by iterating over a list of agent telemetry dictionaries.
The function \`format_security_report(records)\` attempts to join a player's ID with their numeric threat level using the \`+\` operator:
\`"Agent " + r["id"] + " Threat: " + r["threat"]\`.
Because Python is strongly typed, adding an \`int\` directly to a \`str\` throws a fatal \`TypeError: can only concatenate str (not "int") to str\`.

Convert the integer into string format or use \`str()\` to construct the report safely.`,
    functionName: 'format_security_report',
    buggyLineRange: [5, 6],
    hints: {
      tier1: 'Look at line 5 where `r["threat"]` is added to a string with `+`.',
      tier2: 'What is the type of `r["threat"]`? Can Python implicitly coerce numbers into strings when adding?',
      tier3: 'Wrap the numeric value in `str(r["threat"])` or use formatted string interpolation so both operands are strings.',
    },
    initialCode: `# Glitch Challenge: Resolve unhandled string + int concatenation
def format_security_report(records):
    report_lines = []
    
    for r in records:
        # BUG: r["threat"] is an integer, causing TypeError: can only concatenate str to str
        entry = "Agent " + r["id"] + " Threat: " + r["threat"]
        report_lines.append(entry)
        
    return report_lines`,
    solutionCode: `def format_security_report(records):
    report_lines = []
    
    for r in records:
        entry = "Agent " + r["id"] + " Threat: " + str(r["threat"])
        report_lines.append(entry)
        
    return report_lines`,
    testCases: [
      {
        id: 'py-tc-2-1',
        inputDescription: '[{"id": "007", "threat": 5}, {"id": "X1", "threat": 9}]',
        args: [[{ id: "007", threat: 5 }, { id: "X1", threat: 9 }]],
        expected: ["Agent 007 Threat: 5", "Agent X1 Threat: 9"],
      },
      {
        id: 'py-tc-2-2',
        inputDescription: '[] (empty)',
        args: [[]],
        expected: [],
      },
      {
        id: 'py-tc-2-3',
        inputDescription: '[{"id": "NEO", "threat": 99}] (hidden)',
        args: [[{ id: "NEO", threat: 99 }]],
        expected: ["Agent NEO Threat: 99"],
        isHidden: true,
      },
    ],
    xpReward: 250,
  },

  // ==========================================
  // TIER 3: EXPERT (Shallow Copy Mutation Bug)
  // ==========================================
  {
    id: 'js-tier-3-shallow-copy',
    title: 'The Phantom Reference Clone',
    difficulty: 'Expert',
    language: 'javascript',
    category: 'Memory & Mutation',
    summary: 'Fix a shallow copy array mutation that corrupts the original master data structure.',
    description: `A neural firewall must simulate sandbox security policies by duplicating an array of firewall rule matrices.
The function \`applyFirewallModifications(matrix, newRule)\` creates what appears to be a copy of the 2D matrix using \`const copy = [...matrix]\`.
However, because this is only a **shallow copy**, mutating inner row arrays like \`copy[0].push(newRule)\` silently mutates the original \`matrix\` passed in!

Return a genuine independent deep copy with the new rule appended to the specified index without mutating the original matrix.`,
    functionName: 'applyFirewallModifications',
    buggyLineRange: [3, 7],
    hints: {
      tier1: 'Notice how `const copy = [...matrix]` handles nested arrays. The outer array is cloned, but what do the elements point to?',
      tier2: 'If matrix contains sub-arrays, spreading only the top level leaves inner array references shared between copy and source.',
      tier3: 'Deep clone each row by mapping: `const copy = matrix.map(row => [...row]);` before modifying `copy[targetRow]`.',
    },
    initialCode: `// Glitch Challenge: Fix shallow copy array mutation
function applyFirewallModifications(matrix, targetRow, newRule) {
  // BUG: Shallow spread copy leaves nested array references linked to original!
  const copy = [...matrix];
  
  if (targetRow >= 0 && targetRow < copy.length) {
    // This mutates the original matrix's inner array in-place!
    copy[targetRow].push(newRule);
  }
  
  return copy;
}`,
    solutionCode: `function applyFirewallModifications(matrix, targetRow, newRule) {
  // Deep copy nested arrays so the original remains pristine
  const copy = matrix.map(row => [...row]);
  
  if (targetRow >= 0 && targetRow < copy.length) {
    copy[targetRow].push(newRule);
  }
  
  return copy;
}`,
    testCases: [
      {
        id: 'tc-3-1',
        inputDescription: 'matrix: [[1, 2], [3, 4]], targetRow: 0, newRule: 99',
        args: [[[1, 2], [3, 4]], 0, 99],
        expected: [[1, 2, 99], [3, 4]],
      },
      {
        id: 'tc-3-2',
        inputDescription: 'matrix: [[10], [20]], targetRow: 1, newRule: 50',
        args: [[[10], [20]], 1, 50],
        expected: [[10], [20, 50]],
      },
      {
        id: 'tc-3-3',
        inputDescription: 'matrix: [[5]], targetRow: 5 (out of bounds), newRule: 10',
        args: [[[5]], 5, 10],
        expected: [[5]],
      },
    ],
    xpReward: 400,
  },

  {
    id: 'py-tier-3-shallow-copy',
    title: 'The Leaking Sentinel Cache',
    difficulty: 'Expert',
    language: 'python',
    category: 'Memory & Mutation',
    summary: 'Fix a mutable default argument or shallow list reference retaining state across runs.',
    description: `A server audit system processes user security events using a caching list.
In Python, lists are mutable reference objects. The function \`audit_event_batch(events, batch_tag)\` is mutating nested event bundles directly:
\`cloned = events.copy()\`
\`cloned[0]["tags"].append(batch_tag)\`
This mutates the inner dictionary in the caller's memory, contaminating the historical audit trail!

Create an independent clone of the event dictionaries before tagging them.`,
    functionName: 'audit_event_batch',
    buggyLineRange: [4, 6],
    hints: {
      tier1: 'Notice what `events.copy()` creates. Does it duplicate nested dictionaries or share their references?',
      tier2: 'In Python, `.copy()` on a list is shallow: the dictionary objects inside still point to the original memory locations.',
      tier3: 'Use a list comprehension with dictionary copy: `[dict(e) for e in events]` or manually construct a fresh dictionary for each record before appending tags.',
    },
    initialCode: `# Glitch Challenge: Fix shallow list & dict mutation
def audit_event_batch(events, batch_tag):
    # BUG: Shallow copy shares dictionary references with caller
    cloned = events.copy()
    
    result = []
    for item in cloned:
        # Mutating dictionary in-place corrupts original data!
        new_item = item.copy()
        new_item["tag"] = batch_tag
        result.append(new_item)
        
    return result`,
    solutionCode: `def audit_event_batch(events, batch_tag):
    result = []
    for item in events:
        new_item = item.copy()
        new_item["tag"] = batch_tag
        result.append(new_item)
        
    return result`,
    testCases: [
      {
        id: 'py-tc-3-1',
        inputDescription: '[{"id": 1}], tag: "SEC_ALPHA"',
        args: [[{ id: 1 }], "SEC_ALPHA"],
        expected: [{ id: 1, tag: "SEC_ALPHA" }],
      },
      {
        id: 'py-tc-3-2',
        inputDescription: '[{"id": 10}, {"id": 20}], tag: "VERIFIED"',
        args: [[{ id: 10 }, { id: 20 }], "VERIFIED"],
        expected: [{ id: 10, tag: "VERIFIED" }, { id: 20, tag: "VERIFIED" }],
      },
    ],
    xpReward: 400,
  },
];
