import { BugCard, TargetFunction } from '@/types';

export const BUG_CARDS: BugCard[] = [
  {
    id: 'card-off-by-one',
    name: 'Off-by-One Curse',
    glitchType: 'off_by_one',
    cost: 1,
    category: 'Bounds Glitch',
    badge: 'INDEX OVERFLOW',
    description: 'Corrupts array loop bounds from `< length` to `<= length` or shifts index pointers.',
    effect: 'Causes undefined lookups or out-of-bounds index exceptions.',
    iconName: 'Maximize2',
    rarity: 'Common',
  },
  {
    id: 'card-type-coercion',
    name: 'Type Coercion Poison',
    glitchType: 'type_coercion',
    cost: 1,
    category: 'Type Poison',
    badge: 'STRING MUTATION',
    description: 'Injects string coercion delimiters into arithmetic summations.',
    effect: 'Converts integers to text, turning 10 + 20 into "1020".',
    iconName: 'Sparkles',
    rarity: 'Common',
  },
  {
    id: 'card-scope-mutator',
    name: 'Scope Mutator',
    glitchType: 'scope_mutator',
    cost: 2,
    category: 'Lexical Rift',
    badge: 'VARIABLE SHADOW',
    description: 'Strips variable declarations or reassigns scoped accumulators outside closure.',
    effect: 'Leaks state across iterations or overwrites global counters.',
    iconName: 'Layers',
    rarity: 'Rare',
  },
  {
    id: 'card-null-pointer',
    name: 'Null Pointer Wraith',
    glitchType: 'null_pointer',
    cost: 2,
    category: 'Memory Fault',
    badge: 'UNGUARDED ACCESS',
    description: 'Removes fallback null checks, triggering cannot read property of undefined.',
    effect: 'Crashes immediately on empty or optional payload fields.',
    iconName: 'Skull',
    rarity: 'Rare',
  },
  {
    id: 'card-inverted-logic',
    name: 'Logic Inverter Hex',
    glitchType: 'inverted_logic',
    cost: 1,
    category: 'Boolean Inversion',
    badge: 'CONDITIONAL FLIP',
    description: 'Flips boolean comparison operators from strict match to inverted mismatch.',
    effect: 'Reverses filters, excluding matching data and accepting junk.',
    iconName: 'Repeat',
    rarity: 'Common',
  },
  {
    id: 'card-shallow-mutation',
    name: 'Shallow Mutation Hex',
    glitchType: 'shallow_mutation',
    cost: 3,
    category: 'Reference Leak',
    badge: 'POINTER HIJACK',
    description: 'Replaces defensive array clones with direct reference assignments.',
    effect: 'Mutates source array, creating side effects across runs.',
    iconName: 'CopyX',
    rarity: 'Legendary',
  },
];

export const DUEL_TARGET_FUNCTIONS: TargetFunction[] = [
  {
    id: 'fn-calculate-cart',
    name: 'calculateCartTotal',
    description: 'Clean e-commerce order tallying engine with item quantities and discount multiplier.',
    cleanCode: `function calculateCartTotal(items, discountRate) {
  let subtotal = 0;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    subtotal += item.price * item.quantity;
  }
  
  const discount = subtotal * (discountRate || 0);
  return subtotal - discount;
}`,
    testCases: [
      {
        id: 'duel-tc-1',
        inputDescription: '2 items without discount',
        args: [[{ price: 20, quantity: 2 }, { price: 10, quantity: 1 }], 0],
        expected: 50,
      },
      {
        id: 'duel-tc-2',
        inputDescription: 'Single item with 10% discount',
        args: [[{ price: 100, quantity: 1 }], 0.1],
        expected: 90,
      },
      {
        id: 'duel-tc-3',
        inputDescription: 'Empty item list',
        args: [[], 0.2],
        expected: 0,
      },
    ],
  },
  {
    id: 'fn-filter-active',
    name: 'filterActivePilots',
    description: 'Pilots filtering engine that extracts active squad members with positive shield levels.',
    cleanCode: `function filterActivePilots(pilots, minShield) {
  const verified = [];
  
  for (let i = 0; i < pilots.length; i++) {
    const pilot = pilots[i];
    if (pilot.status === "ACTIVE" && pilot.shield >= minShield) {
      verified.push(pilot.callsign);
    }
  }
  
  return verified;
}`,
    testCases: [
      {
        id: 'duel-tc-2-1',
        inputDescription: 'Mixed active & inactive pilots',
        args: [
          [
            { callsign: 'Apex', status: 'ACTIVE', shield: 80 },
            { callsign: 'Cipher', status: 'OFFLINE', shield: 90 },
            { callsign: 'Ghost', status: 'ACTIVE', shield: 20 },
          ],
          50,
        ],
        expected: ['Apex'],
      },
      {
        id: 'duel-tc-2-2',
        inputDescription: 'No pilots meeting shield limit',
        args: [[{ callsign: 'Zero', status: 'ACTIVE', shield: 10 }], 50],
        expected: [],
      },
      {
        id: 'duel-tc-2-3',
        inputDescription: 'Empty pilot roster',
        args: [[], 0],
        expected: [],
      },
    ],
  },
];

/**
 * Deterministically applies selected bug cards to the clean target code
 */
export function corruptCodeWithCards(cleanCode: string, cards: BugCard[]): string {
  let corrupted = cleanCode;

  for (const card of cards) {
    switch (card.glitchType) {
      case 'off_by_one':
        // Inject off-by-one in loop condition
        if (corrupted.includes('i < items.length')) {
          corrupted = corrupted.replace('i < items.length', 'i <= items.length');
        } else if (corrupted.includes('i < pilots.length')) {
          corrupted = corrupted.replace('i < pilots.length', 'i <= pilots.length');
        } else if (corrupted.includes(' < ')) {
          corrupted = corrupted.replace(' < ', ' <= ');
        }
        break;

      case 'type_coercion':
        // Inject string concatenation or string init
        if (corrupted.includes('let subtotal = 0;')) {
          corrupted = corrupted.replace('let subtotal = 0;', 'let subtotal = "0";');
        } else if (corrupted.includes('subtotal += item.price * item.quantity;')) {
          corrupted = corrupted.replace(
            'subtotal += item.price * item.quantity;',
            'subtotal = subtotal + "" + (item.price * item.quantity);'
          );
        } else if (corrupted.includes('verified.push(pilot.callsign);')) {
          corrupted = corrupted.replace(
            'verified.push(pilot.callsign);',
            'verified.push(pilot.callsign + " [CORRUPTED]");'
          );
        }
        break;

      case 'scope_mutator':
        // Mutate variable scope or leak accumulator
        if (corrupted.includes('let subtotal = 0;')) {
          corrupted = corrupted.replace(
            'let subtotal = 0;',
            '// SCOPE MUTATOR CORRUPTION\n  var subtotal;\n  subtotal = subtotal || 0;'
          );
        } else if (corrupted.includes('const verified = [];')) {
          corrupted = corrupted.replace('const verified = [];', 'verified = [];');
        }
        break;

      case 'null_pointer':
        // Strip null checks
        if (corrupted.includes('const discount = subtotal * (discountRate || 0);')) {
          corrupted = corrupted.replace(
            'const discount = subtotal * (discountRate || 0);',
            'const discount = subtotal * discountRate.value; // DEREFERENCE CRASH'
          );
        } else if (corrupted.includes('pilot.status === "ACTIVE"')) {
          corrupted = corrupted.replace(
            'pilot.status === "ACTIVE"',
            'pilot.profile.status === "ACTIVE"'
          );
        }
        break;

      case 'inverted_logic':
        // Flip comparison operators
        if (corrupted.includes('pilot.status === "ACTIVE"')) {
          corrupted = corrupted.replace('pilot.status === "ACTIVE"', 'pilot.status !== "ACTIVE"');
        } else if (corrupted.includes('pilot.shield >= minShield')) {
          corrupted = corrupted.replace('pilot.shield >= minShield', 'pilot.shield < minShield');
        } else if (corrupted.includes('subtotal - discount')) {
          corrupted = corrupted.replace('subtotal - discount', 'subtotal + discount');
        }
        break;

      case 'shallow_mutation':
        if (corrupted.includes('const verified = [];')) {
          corrupted = corrupted.replace(
            'const verified = [];',
            'const verified = pilots; // REFERENCE ALIASING BUG'
          );
        }
        break;
    }
  }

  return corrupted;
}
