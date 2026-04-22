// MathQuest — content: skills, islands, question generators
// Each island maps to a single skill. Question generators produce
// a question object given a target difficulty (0–1000).

const SKILLS = {
  count_to_10: {
    id: 'count_to_10',
    name: 'Counting',
    masteryThreshold: 550,
    fluencyTargetMs: 8000,
  },
  compare_to_10: {
    id: 'compare_to_10',
    name: 'Compare',
    masteryThreshold: 550,
    fluencyTargetMs: 6000,
  },
  add_within_10: {
    id: 'add_within_10',
    name: 'Addition',
    masteryThreshold: 600,
    fluencyTargetMs: 9000,
  },
  sub_within_10: {
    id: 'sub_within_10',
    name: 'Subtraction',
    masteryThreshold: 600,
    fluencyTargetMs: 9000,
    prerequisites: ['add_within_10'],
  },
};

const ISLANDS = [
  {
    id: 'counting_cove',
    name: 'Counting Cove',
    emoji: '🐠',
    skillId: 'count_to_10',
    unlocked: true,
  },
  {
    id: 'compare_cliffs',
    name: 'Compare Cliffs',
    emoji: '⚖️',
    skillId: 'compare_to_10',
    unlocked: false,
    requires: ['count_to_10'],
  },
  {
    id: 'add_atoll',
    name: 'Add-It Atoll',
    emoji: '🏝️',
    skillId: 'add_within_10',
    unlocked: false,
    requires: ['count_to_10', 'compare_to_10'],
  },
  {
    id: 'sub_swamp',
    name: 'Subtract Swamp',
    emoji: '🐸',
    skillId: 'sub_within_10',
    unlocked: false,
    requires: ['add_within_10'],
  },
];

const COUNT_EMOJIS = ['🍎','🍌','🐟','🌟','🎈','🐝','🍓','🦋','🌻','🐞'];
const COMPARE_EMOJIS = ['🪙','🍬','🐚','💎'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Difficulty 0–1000 → range mapping per skill
const QUESTION_GENERATORS = {

  count_to_10(difficulty) {
    // 100→count 1-3; 300→1-5; 500→1-7; 700→1-10
    const max = Math.min(10, 3 + Math.floor(difficulty / 100));
    const target = randInt(1, max);
    const emoji = pick(COUNT_EMOJIS);
    return {
      id: `count_${Date.now()}_${Math.random()}`,
      skillId: 'count_to_10',
      difficulty,
      template: 'tap_count',
      prompt: `Tap ${target} ${emoji}`,
      payload: {
        emoji,
        target,
        totalShown: Math.min(10, target + randInt(1, 3)),
      },
    };
  },

  compare_to_10(difficulty) {
    // Easy: big gap. Hard: small gap, larger numbers.
    const maxN = Math.min(10, 3 + Math.floor(difficulty / 110));
    const minGap = difficulty > 500 ? 1 : 2;
    let a = randInt(1, maxN);
    let b = randInt(1, maxN);
    while (Math.abs(a - b) < minGap) b = randInt(1, maxN);
    const emoji = pick(COMPARE_EMOJIS);
    return {
      id: `cmp_${Date.now()}_${Math.random()}`,
      skillId: 'compare_to_10',
      difficulty,
      template: 'compare_piles',
      prompt: `Tap the pile with MORE ${emoji}`,
      payload: { emoji, a, b, answer: a > b ? 'a' : 'b' },
    };
  },

  add_within_10(difficulty) {
    // Easy: sums ≤5; mid: ≤8; hard: ≤10 with both addends ≥3
    const maxSum = Math.min(10, 4 + Math.floor(difficulty / 130));
    let a, b;
    if (difficulty < 350) {
      a = randInt(1, Math.min(4, maxSum - 1));
      b = randInt(1, maxSum - a);
    } else {
      a = randInt(2, maxSum - 2);
      b = randInt(2, maxSum - a);
    }
    const answer = a + b;
    const choices = makeChoices(answer, 0, 10);
    return {
      id: `add_${Date.now()}_${Math.random()}`,
      skillId: 'add_within_10',
      difficulty,
      template: 'choice_add',
      prompt: `${a} + ${b} = ?`,
      payload: { a, b, answer, choices },
    };
  },

  sub_within_10(difficulty) {
    const maxStart = Math.min(10, 4 + Math.floor(difficulty / 130));
    const a = randInt(2, maxStart);
    const b = randInt(1, a);
    const answer = a - b;
    const choices = makeChoices(answer, 0, 10);
    return {
      id: `sub_${Date.now()}_${Math.random()}`,
      skillId: 'sub_within_10',
      difficulty,
      template: 'choice_sub',
      prompt: `${a} − ${b} = ?`,
      payload: { a, b, answer, choices },
    };
  },
};

function makeChoices(answer, min, max) {
  const set = new Set([answer]);
  while (set.size < 4) {
    const delta = randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1);
    const candidate = answer + delta;
    if (candidate >= min && candidate <= max) set.add(candidate);
    else set.add(randInt(min, max));
  }
  const arr = Array.from(set);
  // shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateQuestion(skillId, difficulty) {
  return QUESTION_GENERATORS[skillId](difficulty);
}
