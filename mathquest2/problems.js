// MathQuest 2 — Realms, quests, problems, distractor metadata
// Each problem has 3-axis difficulty (math, reading, steps),
// trap distractors with misconception ids and explanations,
// a story arc fragment, and a scene spec.

const MISCONCEPTIONS = {
  forgot_last_step: {
    label: 'Forgets to do the last step',
    hint: 'Read the whole problem first, then make a plan for every step.',
  },
  forgot_middle_step: {
    label: 'Skips a middle step',
    hint: 'Try writing each step on paper before solving.',
  },
  answered_wrong_quantity: {
    label: 'Answers a different quantity than asked',
    hint: 'Underline what the question is really asking for.',
  },
  wrong_operation: {
    label: 'Uses the wrong operation (e.g., adds when should subtract)',
    hint: 'Look for keywords: "left" usually means subtract, "in total" usually means add.',
  },
  fraction_of_whole_confusion: {
    label: 'Confuses fraction of vs. fraction left',
    hint: '1/3 GIVEN means 2/3 LEFT — they\'re different!',
  },
  off_by_one: {
    label: 'Off-by-one counting',
    hint: 'Recount carefully — easy to miss the first or last item.',
  },
  ignored_irrelevant: {
    label: 'Used irrelevant info as a number',
    hint: 'Some details are just decoration. Use only what the math needs.',
  },
  multiplied_instead_added: {
    label: 'Confuses multiplication with addition',
    hint: '"Each" usually means multiply. "More" usually means add.',
  },
  rounded_too_early: {
    label: 'Rounded mid-calculation',
    hint: 'Save rounding until the very end of the calculation.',
  },
};

const REALMS = [
  {
    id: 'bakery',
    name: 'Bakery of Halves',
    emoji: '🥐',
    desc: 'Help baker Mira split, share, and save the festival.',
    skillIds: ['fractions_of_quantity', 'multistep_2op'],
    unlocked: true,
  },
  {
    id: 'rocket',
    name: 'Rocket Yard',
    emoji: '🚀',
    desc: 'Fuel calculations, schedules, distance.',
    skillIds: ['multistep_2op', 'time_distance'],
    unlocked: false,
    requires: ['fractions_of_quantity'],
  },
  {
    id: 'market',
    name: 'Market of Mira',
    emoji: '🏪',
    desc: 'Money, percentages, change-making.',
    skillIds: ['money_change', 'percent_basic'],
    unlocked: false,
    requires: ['multistep_2op'],
  },
];

const SKILLS_V2 = {
  fractions_of_quantity: {
    id: 'fractions_of_quantity',
    name: 'Fractions of a Quantity',
    masteryThreshold: 600,
    fluencyTargetMs: 25000, // word problems take longer
  },
  multistep_2op: {
    id: 'multistep_2op',
    name: 'Multi-step Word Problems',
    masteryThreshold: 600,
    fluencyTargetMs: 30000,
  },
  time_distance: {
    id: 'time_distance',
    name: 'Time & Distance',
    masteryThreshold: 600,
    fluencyTargetMs: 30000,
  },
  money_change: {
    id: 'money_change',
    name: 'Money & Change',
    masteryThreshold: 600,
    fluencyTargetMs: 25000,
  },
  percent_basic: {
    id: 'percent_basic',
    name: 'Percentages',
    masteryThreshold: 600,
    fluencyTargetMs: 30000,
  },
};

// Story arc — fragments unfurl in order as problems are solved
const STORY_ARC = {
  bakery: {
    chapterTitle: 'The Lantern Festival',
    intro: 'Baker Mira\'s village holds a festival every winter. This year, the Codex of Nines unraveled here, and Mira\'s lanterns hold the first scattered pages.',
    fragments: [
      'Mira opens the bakery before sunrise. The first page glows faintly from inside a sourdough loaf.',
      '"You came!" Mira gasps, dusting flour from a torn parchment. "The Codex... it scattered into orders I haven\'t filled yet."',
      'Children gather at the window, waiting for lanterns. Each correct order restores another line of the page.',
      'A cat — Mira\'s familiar — pads across the counter, knocking over a tray. The page shudders.',
      'A traveler in a grey cloak enters. "I need bread for the road. And answers."',
      'The cloaked figure pulls back her hood — it\'s Detective Wren from the Codex\'s second chapter.',
      '"The pages ran here because someone here is hiding the truth," Wren whispers. "Every lantern you light shows me one more clue."',
      'A page slips into your hand, warm and humming.',
      'The festival begins. Lanterns rise into the dark sky, each one a question answered.',
      'Chapter restored. The Codex glows brighter. A new realm flickers into view: the Rocket Yard.',
    ],
  },
  rocket: {
    chapterTitle: 'The Midnight Launch',
    intro: 'Captain Ade is preparing a delivery rocket. The fuel math is wrong, and the cargo hold won\'t close.',
    fragments: [
      'Captain Ade taps a clipboard. "Numbers don\'t add up. Help me check."',
      'Engineers swarm the launch tower. A page flutters from a fuel valve.',
      'Mira sends warm bread up the elevator. "For the crew. Festival blessing."',
      'A countdown clock starts. 2 hours to launch.',
      'Cargo manifest disagrees with the loading log. Pick the right total.',
      'Wren arrives, breathless. "There\'s a stowaway. Mathematical, not human."',
      'The rocket fuels. Stars wheel overhead.',
      'Liftoff. The page burns clean and joins the Codex.',
    ],
  },
};

// ---------------- PROBLEM BANK ----------------
const PROBLEMS = [

  // ---- BAKERY • Tier 1 (single-step, 2-3 sentences) ----
  {
    id: 'b1',
    realmId: 'bakery',
    skillId: 'fractions_of_quantity',
    tier: 1, math: 200, reading: 150, steps: 1,
    story: [
      'Mira baked 8 cookies for the morning crowd.',
      'Tim eats half of them right away.',
    ],
    question: 'How many cookies are left?',
    answer: 4,
    distractors: [
      { value: 8, misconception: 'forgot_middle_step', explain: 'Tim ate half — you forgot to subtract them!' },
      { value: 2, misconception: 'wrong_operation', explain: 'Half of 8 is 4, not 2. Half means dividing by 2.' },
      { value: 16, misconception: 'wrong_operation', explain: 'You doubled the cookies — but Tim ATE some, so we subtract.' },
    ],
    scene: {
      type: 'tray', item: '🍪', start: 8,
      actions: [{ kind: 'remove', n: 4, label: 'Tim eats half' }],
    },
  },
  {
    id: 'b2',
    realmId: 'bakery',
    skillId: 'fractions_of_quantity',
    tier: 1, math: 220, reading: 150, steps: 1,
    story: [
      'Mira has 12 muffins fresh from the oven.',
      'She wants to share them equally among 4 friends.',
    ],
    question: 'How many muffins does each friend get?',
    answer: 3,
    distractors: [
      { value: 4, misconception: 'wrong_operation', explain: 'You divided wrong way. 12 muffins ÷ 4 friends = 3 each.' },
      { value: 8, misconception: 'wrong_operation', explain: 'That looks like 12 - 4. Sharing means dividing.' },
      { value: 12, misconception: 'answered_wrong_quantity', explain: 'That\'s the total muffins, not each friend\'s share.' },
    ],
    scene: {
      type: 'group', item: '🧁', start: 12,
      startLabel: '12 muffins',
      actions: [{ kind: 'split', groups: 4, label: 'split among 4 friends' }],
    },
  },
  {
    id: 'b3',
    realmId: 'bakery',
    skillId: 'fractions_of_quantity',
    tier: 1, math: 250, reading: 180, steps: 1,
    story: [
      'There are 9 jam tarts cooling on the rack.',
      'One-third of them stick to the tray and get ruined.',
    ],
    question: 'How many tarts are still good?',
    answer: 6,
    distractors: [
      { value: 3, misconception: 'answered_wrong_quantity', explain: 'That\'s how many were ruined, not how many are good.' },
      { value: 9, misconception: 'forgot_middle_step', explain: 'You forgot to subtract the ruined ones.' },
      { value: 8, misconception: 'wrong_operation', explain: '1/3 of 9 is 3, not 1. So 9 - 3 = 6.' },
    ],
    scene: {
      type: 'tray', item: '🥧', start: 9,
      actions: [{ kind: 'shatter', n: 3, label: 'one-third stuck to the tray' }],
    },
  },

  // ---- BAKERY • Tier 2 (multi-step, 3 sentences) ----
  {
    id: 'b4',
    realmId: 'bakery',
    skillId: 'fractions_of_quantity',
    tier: 2, math: 380, reading: 280, steps: 2,
    story: [
      'Mira baked 24 lanterns for the festival.',
      'She gave 1/3 of them to the children\'s choir.',
      'Then her cat knocked over a tray and 2 broke.',
    ],
    question: 'How many lanterns does Mira have left for the festival?',
    answer: 14,
    distractors: [
      { value: 16, misconception: 'forgot_last_step', explain: 'You found 24 - 8 = 16, but 2 more broke. 16 - 2 = 14.' },
      { value: 6, misconception: 'answered_wrong_quantity', explain: '6 is close to what went to the choir, not what\'s left.' },
      { value: 22, misconception: 'forgot_middle_step', explain: 'You subtracted the 2 broken, but forgot 1/3 went to the choir.' },
    ],
    scene: {
      type: 'tray', item: '🏮', start: 24,
      actions: [
        { kind: 'remove', n: 8, label: '1/3 to children\'s choir' },
        { kind: 'shatter', n: 2, label: 'cat knocks over tray' },
      ],
    },
  },
  {
    id: 'b5',
    realmId: 'bakery',
    skillId: 'multistep_2op',
    tier: 2, math: 360, reading: 260, steps: 2,
    story: [
      'There are 20 cookies on the counter.',
      'The lunch crowd eats half of them.',
      'Mira then gives 2 more to a hungry stray cat.',
    ],
    question: 'How many cookies are left on the counter?',
    answer: 8,
    distractors: [
      { value: 10, misconception: 'forgot_last_step', explain: '10 is half left, but Mira then gave 2 to the cat.' },
      { value: 12, misconception: 'wrong_operation', explain: 'You added the 2 to half. They were given AWAY — subtract.' },
      { value: 18, misconception: 'forgot_middle_step', explain: 'You subtracted just 2. The lunch crowd ate 10 first!' },
    ],
    scene: {
      type: 'tray', item: '🍪', start: 20,
      actions: [
        { kind: 'remove', n: 10, label: 'lunch crowd eats half' },
        { kind: 'remove', n: 2, label: '2 more to a stray cat' },
      ],
    },
  },
  {
    id: 'b6',
    realmId: 'bakery',
    skillId: 'fractions_of_quantity',
    tier: 2, math: 420, reading: 300, steps: 2,
    story: [
      'Mira boxes 18 cupcakes.',
      '1/3 of them are chocolate, the rest are vanilla.',
      'A friend takes 2 vanilla cupcakes home.',
    ],
    question: 'How many vanilla cupcakes are left?',
    answer: 10,
    distractors: [
      { value: 12, misconception: 'forgot_last_step', explain: '12 vanilla in total, but a friend took 2 home.' },
      { value: 6, misconception: 'fraction_of_whole_confusion', explain: '6 is the chocolate count. The question asked about vanilla.' },
      { value: 16, misconception: 'forgot_middle_step', explain: 'You subtracted the 2 from 18. But first, only 12 are vanilla.' },
    ],
    scene: {
      type: 'tray', item: '🧁', start: 18,
      actions: [
        { kind: 'remove', n: 6, label: '1/3 are chocolate (set aside)' },
        { kind: 'remove', n: 2, label: 'friend takes 2 vanilla' },
      ],
    },
  },
  {
    id: 'b7',
    realmId: 'bakery',
    skillId: 'multistep_2op',
    tier: 2, math: 440, reading: 320, steps: 2,
    story: [
      'Mira packs 30 donuts into boxes.',
      'Half the donuts go into the morning shipment.',
      'Of the donuts left, 1/3 are given to the school teacher.',
    ],
    question: 'How many donuts go to the teacher?',
    answer: 5,
    distractors: [
      { value: 10, misconception: 'fraction_of_whole_confusion', explain: '1/3 of 30 = 10, but the question says 1/3 of those LEFT (15).' },
      { value: 15, misconception: 'answered_wrong_quantity', explain: 'That\'s how many were left after shipment, not given to the teacher.' },
      { value: 6, misconception: 'wrong_operation', explain: 'Check your division: 15 ÷ 3 = 5, not 6.' },
    ],
    scene: {
      type: 'tray', item: '🍩', start: 30,
      actions: [
        { kind: 'remove', n: 15, label: 'half go to morning shipment' },
        { kind: 'remove', n: 5, label: '1/3 of those left to the teacher' },
      ],
    },
  },

  // ---- BAKERY • Tier 3 (multi-step, irrelevant info) ----
  {
    id: 'b8',
    realmId: 'bakery',
    skillId: 'multistep_2op',
    tier: 3, math: 520, reading: 420, steps: 3,
    story: [
      'Mira wears her favorite blue apron and starts on 24 muffins.',
      '1/4 of them burn in the oven.',
      'Of the good ones, 1/3 are sold to the morning customer.',
      'Mira drops 2 of the rest on the way to the display.',
    ],
    question: 'How many muffins make it to the display?',
    answer: 10,
    distractors: [
      { value: 12, misconception: 'forgot_last_step', explain: '12 was the count after selling, but 2 were dropped on the way.' },
      { value: 18, misconception: 'forgot_middle_step', explain: 'You subtracted 1/4 (burned) and the dropped 2, but forgot the morning sale.' },
      { value: 16, misconception: 'ignored_irrelevant', explain: 'You may have used the apron color (none of its info matters!).' },
    ],
    scene: {
      type: 'tray', item: '🧁', start: 24,
      actions: [
        { kind: 'shatter', n: 6, label: '1/4 burn in the oven' },
        { kind: 'remove', n: 6, label: '1/3 of good ones sold' },
        { kind: 'shatter', n: 2, label: '2 dropped on the way' },
      ],
    },
  },
  {
    id: 'b9',
    realmId: 'bakery',
    skillId: 'multistep_2op',
    tier: 3, math: 540, reading: 460, steps: 3,
    story: [
      'There are 36 brownies, each cut into a perfect square.',
      'They are packed into trays of 6 brownies per tray.',
      'On the way to the festival, one entire tray is dropped.',
      'Half of the remaining brownies are sold at the entrance.',
    ],
    question: 'How many brownies are left to sell inside the festival?',
    answer: 15,
    distractors: [
      { value: 18, misconception: 'forgot_last_step', explain: 'After dropping a tray you had 30. Half were sold at the entrance.' },
      { value: 30, misconception: 'forgot_last_step', explain: '30 was after the dropped tray. The question asks after the entrance sale too.' },
      { value: 12, misconception: 'forgot_middle_step', explain: 'You divided 36 by 3, but the trays hold 6 — only ONE tray was dropped.' },
    ],
    scene: {
      type: 'tray', item: '🍫', start: 36,
      actions: [
        { kind: 'shatter', n: 6, label: 'one tray of 6 dropped' },
        { kind: 'remove', n: 15, label: 'half of remaining sold at entrance' },
      ],
    },
  },

  // ---- ROCKET • Tier 1 (intro to time/distance) ----
  {
    id: 'r1',
    realmId: 'rocket',
    skillId: 'time_distance',
    tier: 1, math: 240, reading: 220, steps: 1,
    story: [
      'A delivery rocket needs 90 minutes of fuel for its trip.',
      'It already has 25 minutes of fuel in the tank.',
    ],
    question: 'How many more minutes of fuel must be added?',
    answer: 65,
    distractors: [
      { value: 115, misconception: 'wrong_operation', explain: 'You added. We need to find the difference: 90 - 25.' },
      { value: 75, misconception: 'off_by_one', explain: 'Recheck the subtraction: 90 - 25 = 65.' },
      { value: 25, misconception: 'answered_wrong_quantity', explain: 'That\'s what\'s already in the tank, not what\'s needed.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Have', value: 25, color: '#5aa9e6' },
        { label: 'Need', value: 90, color: '#ffb84d' },
      ],
    },
  },
  {
    id: 'r2',
    realmId: 'rocket',
    skillId: 'multistep_2op',
    tier: 2, math: 400, reading: 320, steps: 2,
    story: [
      'The cargo hold can carry 200 kg.',
      'Mira sends 45 kg of bread, and Captain Ade loads 78 kg of supplies.',
      'How much weight can still be added before takeoff?',
    ],
    question: 'How many kilograms can still be added?',
    answer: 77,
    distractors: [
      { value: 123, misconception: 'answered_wrong_quantity', explain: 'That\'s the total loaded so far, not what\'s left.' },
      { value: 233, misconception: 'wrong_operation', explain: 'You added cargo to the limit. We need limit - loaded.' },
      { value: 67, misconception: 'off_by_one', explain: 'Re-check: 200 - (45 + 78) = 200 - 123 = 77.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Bread', value: 45, color: '#ffb84d' },
        { label: 'Supplies', value: 78, color: '#5aa9e6' },
        { label: 'Limit', value: 200, color: '#4eb86b' },
      ],
    },
  },
];

// Helper: index problems by realm
const PROBLEMS_BY_REALM = PROBLEMS.reduce((acc, p) => {
  (acc[p.realmId] = acc[p.realmId] || []).push(p);
  return acc;
}, {});

// Quests = chunks of problems within a realm, ordered by tier
function getQuestsForRealm(realmId) {
  const ps = PROBLEMS_BY_REALM[realmId] || [];
  const tiers = {};
  ps.forEach(p => { (tiers[p.tier] = tiers[p.tier] || []).push(p); });
  return Object.keys(tiers).sort((a, b) => +a - +b).map(t => ({
    id: `${realmId}_t${t}`,
    realmId,
    tier: +t,
    title: `Quest ${t}: ${tierName(+t)}`,
    problems: tiers[t],
  }));
}

function tierName(tier) {
  return ['', 'Warmup', 'Two Steps', 'The Tangle', 'Master Cut'][tier] || `Tier ${tier}`;
}

// Build the full choices list (correct + 3 distractors), shuffled
function buildChoices(problem) {
  const all = [
    { value: problem.answer, isCorrect: true, misconception: null, explain: null },
    ...problem.distractors.map(d => ({
      value: d.value, isCorrect: false,
      misconception: d.misconception, explain: d.explain,
    })),
  ];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}
