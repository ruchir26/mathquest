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
  percent_of_vs_off: {
    label: 'Confuses percent OFF with percent OF',
    hint: '20% off $40 means you SUBTRACT $8. The sale price is $32, not $8.',
  },
  pattern_extended_wrong_rule: {
    label: 'Extended a pattern with the wrong rule',
    hint: 'Check the rule with TWO steps before extending: 3→7→11 = +4 each time.',
  },
  inverted_comparison: {
    label: 'Inverted a comparison (more vs. less)',
    hint: '"3 years younger" means SUBTRACT, not add.',
  },
  multiplied_per_group: {
    label: 'Forgot to multiply by number of groups',
    hint: '"Per row" or "per basket" means multiply by how many rows or baskets.',
  },
  added_when_compound: {
    label: 'Added percents instead of compounding',
    hint: '20% off then 10% off is NOT 30% off — apply them one at a time.',
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
    unlocked: true,
    requires: ['fractions_of_quantity'],
  },
  {
    id: 'market',
    name: 'Market of Mira',
    emoji: '🏪',
    desc: 'Money, percentages, change-making.',
    skillIds: ['money_change', 'percent_basic'],
    unlocked: true,
    requires: ['multistep_2op'],
  },
  {
    id: 'forest',
    name: 'Forest of Patterns',
    emoji: '🌲',
    desc: 'Druid riddles: sequences, multiplication, factors.',
    skillIds: ['pattern_extend', 'multiplication'],
    unlocked: true,
    requires: ['multistep_2op'],
  },
  {
    id: 'detective',
    name: "Detective's Den",
    emoji: '🕵️',
    desc: 'Solve mysteries from numerical clues.',
    skillIds: ['logic_compare', 'multistep_2op'],
    unlocked: true,
    requires: ['percent_basic'],
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
  pattern_extend: {
    id: 'pattern_extend',
    name: 'Patterns & Sequences',
    masteryThreshold: 600,
    fluencyTargetMs: 28000,
  },
  multiplication: {
    id: 'multiplication',
    name: 'Multiplication',
    masteryThreshold: 600,
    fluencyTargetMs: 25000,
  },
  logic_compare: {
    id: 'logic_compare',
    name: 'Logic & Comparison',
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
  market: {
    chapterTitle: 'The Counterfeit Coin',
    intro: 'A counterfeit coin is circulating through the market. Each correct trade narrows the suspects.',
    fragments: [
      'Mira opens her market stall. A torn page is taped under the counter.',
      'A trader offers a "great deal" — but the math is suspicious.',
      'Wren slips you a list of recent sales.',
      'A merchant overpays on purpose. The coin glints — counterfeit?',
      'You spot the trick: the discount was wrong.',
      'The counterfeit coin clatters onto the cobblestones.',
      'Two traders argue. You settle it with arithmetic.',
      'A page snaps to your palm. It hums with festival warmth.',
    ],
  },
  forest: {
    chapterTitle: 'The Druid\'s Riddles',
    intro: 'Deep in the forest, a druid speaks only in patterns. Solve the riddles to wake the next page.',
    fragments: [
      'Moss-covered stones form a circle. A page glows beneath them.',
      'The druid hums a sequence: 2, 4, 6, ...',
      'Vines grow visibly with each correct answer.',
      'A grove appears. It was hidden by a broken pattern.',
      'The druid nods. "You see what others miss."',
      'A sapling sprouts where the page rests.',
      'The forest exhales. Birds erupt overhead.',
      'The page lifts itself into your hands.',
    ],
  },
  detective: {
    chapterTitle: 'The Case of the Missing Codex',
    intro: 'Detective Wren needs your help. Each clue is a number puzzle. Solve them in order to find the missing chapter.',
    fragments: [
      'Wren spreads photos on a table. Numbers are circled in red.',
      '"The thief left a trail," she says. "It\'s in the math."',
      'A suspect alibi falls apart under arithmetic.',
      'The clock on the wall ticks louder.',
      'You spot the pattern: the thief used the same trick twice.',
      'Wren raises an eyebrow. "Good. You see it too."',
      'The missing page is hidden in plain sight — behind a number.',
      'The Codex closes with a whisper. The case is solved.',
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

  // ---- ROCKET • more ----
  {
    id: 'r3',
    realmId: 'rocket',
    skillId: 'time_distance',
    tier: 2, math: 380, reading: 300, steps: 2,
    story: [
      'The supply rocket launches at 7:30 in the morning.',
      'The trip to the orbital station takes 2 hours and 45 minutes.',
    ],
    question: 'At what time does the rocket arrive? (Give the hour, in 24-hour time.)',
    answer: 10,
    distractors: [
      { value: 9, misconception: 'forgot_middle_step', explain: '7:30 + 2:45 = 10:15. The hour is 10, not 9.' },
      { value: 11, misconception: 'rounded_too_early', explain: 'Rounding 2:45 up to 3 hours gives 10:30 — but the question asks the hour, which is still 10.' },
      { value: 7, misconception: 'answered_wrong_quantity', explain: 'That\'s the launch hour, not the arrival.' },
    ],
    scene: {
      type: 'path', item: '🚀',
      checkpoints: [
        { label: '07:30', icon: '🛫' },
        { label: '08:30' },
        { label: '09:30' },
        { label: '10:15', icon: '🛬' },
      ],
      actions: [
        { toCheckpoint: 1, label: '+1 hour' },
        { toCheckpoint: 2, label: '+1 hour' },
        { toCheckpoint: 3, label: '+45 min — arrived' },
      ],
    },
  },
  {
    id: 'r4',
    realmId: 'rocket',
    skillId: 'time_distance',
    tier: 2, math: 400, reading: 280, steps: 1,
    story: [
      'The rocket travels 240 kilometers in 4 hours at a steady speed.',
    ],
    question: 'How many kilometers does it travel in one hour?',
    answer: 60,
    distractors: [
      { value: 240, misconception: 'answered_wrong_quantity', explain: 'That\'s the total distance, not per hour.' },
      { value: 80, misconception: 'wrong_operation', explain: 'Check division: 240 ÷ 4 = 60.' },
      { value: 4, misconception: 'answered_wrong_quantity', explain: 'That\'s the time, not the speed.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Total km', value: 240, color: '#5aa9e6' },
        { label: 'Hours', value: 4, color: '#ffb84d' },
        { label: 'km/hour', value: 60, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'r5',
    realmId: 'rocket',
    skillId: 'multistep_2op',
    tier: 3, math: 520, reading: 380, steps: 3,
    story: [
      'A rocket needs 120 liters of fuel for a long trip.',
      'It already has 45 liters in the tank.',
      'The fuel pump fills 15 liters every minute.',
    ],
    question: 'How many minutes will it take to finish fueling?',
    answer: 5,
    distractors: [
      { value: 8, misconception: 'forgot_middle_step', explain: 'You divided 120 by 15. But 45 is already in — only 75 more needed.' },
      { value: 3, misconception: 'wrong_operation', explain: '45 ÷ 15 = 3. But that\'s the fuel already there, not what\'s needed.' },
      { value: 75, misconception: 'answered_wrong_quantity', explain: 'That\'s the liters still needed, not the minutes.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Have', value: 45, color: '#5aa9e6' },
        { label: 'Need', value: 120, color: '#ffb84d' },
        { label: 'Add', value: 75, color: '#4eb86b' },
      ],
    },
  },

  // ---- MARKET • Tier 1 ----
  {
    id: 'm1',
    realmId: 'market',
    skillId: 'money_change',
    tier: 1, math: 220, reading: 160, steps: 1,
    story: [
      'You buy a warm pretzel for 3 dollars.',
      'You hand the baker a 5-dollar bill.',
    ],
    question: 'How much change do you get back?',
    answer: 2,
    distractors: [
      { value: 8, misconception: 'wrong_operation', explain: 'You added. Change = paid - cost = 5 - 3 = 2.' },
      { value: 3, misconception: 'answered_wrong_quantity', explain: 'That\'s the price of the pretzel, not the change.' },
      { value: 5, misconception: 'answered_wrong_quantity', explain: 'That\'s what you handed over, not the change.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Paid', value: 5, color: '#ffb84d' },
        { label: 'Cost', value: 3, color: '#5aa9e6' },
        { label: 'Change', value: 2, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'm2',
    realmId: 'market',
    skillId: 'multiplication',
    tier: 1, math: 240, reading: 160, steps: 1,
    story: [
      'You pick up 3 apples at the fruit stand.',
      'Each apple costs 2 dollars.',
    ],
    question: 'How much do you owe in total?',
    answer: 6,
    distractors: [
      { value: 5, misconception: 'multiplied_instead_added', explain: '3 + 2 = 5, but each apple costs $2, so 3 × 2 = 6.' },
      { value: 3, misconception: 'answered_wrong_quantity', explain: 'That\'s how many apples, not the total cost.' },
      { value: 23, misconception: 'wrong_operation', explain: 'You wrote 3 next to 2. Multiply: 3 × 2 = 6.' },
    ],
    scene: {
      type: 'group', item: '🍎', start: 6,
      startLabel: '3 apples × $2 each',
      actions: [{ kind: 'split', groups: 3, label: '$2 + $2 + $2' }],
    },
  },
  {
    id: 'm3',
    realmId: 'market',
    skillId: 'percent_basic',
    tier: 1, math: 300, reading: 200, steps: 1,
    story: [
      'A toy is marked at 10 dollars.',
      'There is a sale: 10% off.',
    ],
    question: 'What is the sale price?',
    answer: 9,
    distractors: [
      { value: 1, misconception: 'percent_of_vs_off', explain: '10% of $10 is $1 — but that\'s the discount. Sale price = 10 - 1 = 9.' },
      { value: 10, misconception: 'forgot_middle_step', explain: 'You forgot to apply the discount.' },
      { value: 11, misconception: 'wrong_operation', explain: '10% off means subtract, not add.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Original', value: 10, color: '#ffb84d' },
        { label: 'Discount', value: 1, color: '#e85a4f' },
        { label: 'Sale', value: 9, color: '#4eb86b' },
      ],
    },
  },

  // ---- MARKET • Tier 2 ----
  {
    id: 'm4',
    realmId: 'market',
    skillId: 'money_change',
    tier: 2, math: 380, reading: 280, steps: 2,
    story: [
      'You buy a hat for 4 dollars and a scarf for 7 dollars.',
      'You hand over a 20-dollar bill.',
    ],
    question: 'How much change do you receive?',
    answer: 9,
    distractors: [
      { value: 11, misconception: 'answered_wrong_quantity', explain: 'That\'s the total cost, not the change.' },
      { value: 16, misconception: 'forgot_middle_step', explain: 'You subtracted only the hat. The scarf was $7 too.' },
      { value: 13, misconception: 'forgot_middle_step', explain: 'You subtracted only the scarf. The hat was $4 too.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Hat', value: 4, color: '#5aa9e6' },
        { label: 'Scarf', value: 7, color: '#ffb84d' },
        { label: 'Paid', value: 20, color: '#4eb86b' },
        { label: 'Change', value: 9, color: '#ff7b6b' },
      ],
    },
  },
  {
    id: 'm5',
    realmId: 'market',
    skillId: 'percent_basic',
    tier: 2, math: 420, reading: 300, steps: 2,
    story: [
      'A coat is priced at 40 dollars.',
      'The shop announces 25% off all winter wear.',
    ],
    question: 'What is the sale price of the coat?',
    answer: 30,
    distractors: [
      { value: 10, misconception: 'percent_of_vs_off', explain: '25% of 40 = $10 — that\'s the DISCOUNT. Sale = 40 - 10 = 30.' },
      { value: 35, misconception: 'wrong_operation', explain: 'You subtracted 5 instead of 25%. 25% of 40 is 10, so 40 - 10 = 30.' },
      { value: 50, misconception: 'wrong_operation', explain: '25% off means subtract, not add.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Original', value: 40, color: '#ffb84d' },
        { label: 'Discount', value: 10, color: '#e85a4f' },
        { label: 'Sale', value: 30, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'm6',
    realmId: 'market',
    skillId: 'percent_basic',
    tier: 2, math: 440, reading: 320, steps: 2,
    story: [
      'Your meal at the festival costs 20 dollars.',
      'You add a 15% tip for the cook.',
    ],
    question: 'How much do you pay in total?',
    answer: 23,
    distractors: [
      { value: 3, misconception: 'answered_wrong_quantity', explain: 'That\'s just the tip. The question asks the total.' },
      { value: 35, misconception: 'wrong_operation', explain: '15% of 20 is 3, not 15. Total = 20 + 3 = 23.' },
      { value: 17, misconception: 'wrong_operation', explain: 'A tip is ADDED, not subtracted.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Meal', value: 20, color: '#ffb84d' },
        { label: 'Tip', value: 3, color: '#5aa9e6' },
        { label: 'Total', value: 23, color: '#4eb86b' },
      ],
    },
  },

  // ---- MARKET • Tier 3 ----
  {
    id: 'm7',
    realmId: 'market',
    skillId: 'multistep_2op',
    tier: 3, math: 520, reading: 380, steps: 3,
    story: [
      'You pick up 4 wooden toys, each costing 5 dollars.',
      'The shopkeeper offers 20% off the total order.',
    ],
    question: 'How much do you pay?',
    answer: 16,
    distractors: [
      { value: 20, misconception: 'forgot_last_step', explain: 'That\'s the total before the discount. Apply 20% off.' },
      { value: 4, misconception: 'percent_of_vs_off', explain: 'That\'s the discount amount, not what you pay.' },
      { value: 24, misconception: 'wrong_operation', explain: '20% off means subtract, not add.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Total', value: 20, color: '#ffb84d' },
        { label: 'Discount', value: 4, color: '#e85a4f' },
        { label: 'Pay', value: 16, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'm8',
    realmId: 'market',
    skillId: 'multistep_2op',
    tier: 3, math: 580, reading: 420, steps: 3,
    story: [
      'You saved 50 dollars from chores.',
      'You spend half on a book.',
      'Then you spend 20% of what\'s left on a snack.',
    ],
    question: 'How much money do you have now?',
    answer: 20,
    distractors: [
      { value: 25, misconception: 'forgot_last_step', explain: 'That\'s after buying the book. You also bought a snack.',
      },
      { value: 30, misconception: 'forgot_middle_step', explain: 'You took 20% off 50, but the snack was 20% of what\'s LEFT after the book.' },
      { value: 5, misconception: 'answered_wrong_quantity', explain: 'That\'s the snack cost, not what\'s left over.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Saved', value: 50, color: '#ffb84d' },
        { label: 'Book', value: 25, color: '#5aa9e6' },
        { label: 'Snack', value: 5, color: '#e85a4f' },
        { label: 'Left', value: 20, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'm9',
    realmId: 'market',
    skillId: 'percent_basic',
    tier: 3, math: 560, reading: 460, steps: 2,
    story: [
      'Detective Wren wears her favorite brown coat.',
      'A new coat at the market costs 80 dollars.',
      'It\'s on sale for 25% off today.',
    ],
    question: 'How much does Wren pay for the new coat?',
    answer: 60,
    distractors: [
      { value: 20, misconception: 'percent_of_vs_off', explain: 'That\'s the discount amount, not what she pays.' },
      { value: 75, misconception: 'wrong_operation', explain: '25% off $80 is $20 off — sale price is $60, not $75.' },
      { value: 55, misconception: 'ignored_irrelevant', explain: 'You may have used "brown coat" as a clue. Coat color is irrelevant!' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Original', value: 80, color: '#ffb84d' },
        { label: 'Discount', value: 20, color: '#e85a4f' },
        { label: 'Pay', value: 60, color: '#4eb86b' },
      ],
    },
  },

  // ---- FOREST • Tier 1 ----
  {
    id: 'f1',
    realmId: 'forest',
    skillId: 'pattern_extend',
    tier: 1, math: 220, reading: 180, steps: 1,
    story: [
      'A druid taps stones in a sequence:',
      '2, 4, 6, 8, ... ',
    ],
    question: 'What number comes next?',
    answer: 10,
    distractors: [
      { value: 9, misconception: 'pattern_extended_wrong_rule', explain: 'The pattern adds 2 each time, not 1. After 8 comes 10.' },
      { value: 16, misconception: 'pattern_extended_wrong_rule', explain: 'You doubled. The rule is +2 each step.' },
      { value: 8, misconception: 'answered_wrong_quantity', explain: '8 was the LAST number. We want the NEXT.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: '1st', value: 2, color: '#5aa9e6' },
        { label: '2nd', value: 4, color: '#5aa9e6' },
        { label: '3rd', value: 6, color: '#5aa9e6' },
        { label: '4th', value: 8, color: '#5aa9e6' },
        { label: 'Next?', value: 10, color: '#ffb84d' },
      ],
    },
  },
  {
    id: 'f2',
    realmId: 'forest',
    skillId: 'multiplication',
    tier: 1, math: 260, reading: 200, steps: 1,
    story: [
      'In a forest clearing, there are 5 baskets.',
      'Each basket holds 4 mushrooms.',
    ],
    question: 'How many mushrooms are there in total?',
    answer: 20,
    distractors: [
      { value: 9, misconception: 'multiplied_instead_added', explain: '5 + 4 = 9, but EACH basket has 4. So 5 × 4 = 20.' },
      { value: 5, misconception: 'answered_wrong_quantity', explain: 'That\'s the number of baskets.' },
      { value: 25, misconception: 'multiplied_per_group', explain: 'Close — but it\'s 5 × 4 = 20, not 5 × 5.' },
    ],
    scene: {
      type: 'group', item: '🍄', start: 20,
      startLabel: '5 baskets × 4 mushrooms',
      actions: [{ kind: 'split', groups: 5, label: '4 in each basket' }],
    },
  },

  // ---- FOREST • Tier 2 ----
  {
    id: 'f3',
    realmId: 'forest',
    skillId: 'pattern_extend',
    tier: 2, math: 420, reading: 320, steps: 2,
    story: [
      'A druid begins counting at 3 and adds 4 each time:',
      '3, 7, 11, 15, ...',
    ],
    question: 'What is the 6th number in the sequence?',
    answer: 23,
    distractors: [
      { value: 19, misconception: 'off_by_one', explain: '19 is the 5th number. The 6th is one more step: 19 + 4 = 23.' },
      { value: 27, misconception: 'off_by_one', explain: '27 is the 7th number. Count: 3 (1st), 7, 11, 15, 19, 23 (6th).' },
      { value: 24, misconception: 'pattern_extended_wrong_rule', explain: 'The rule is +4, so the answer must be odd: 23, not 24.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: '1', value: 3, color: '#5aa9e6' },
        { label: '2', value: 7, color: '#5aa9e6' },
        { label: '3', value: 11, color: '#5aa9e6' },
        { label: '4', value: 15, color: '#5aa9e6' },
        { label: '5', value: 19, color: '#5aa9e6' },
        { label: '6?', value: 23, color: '#ffb84d' },
      ],
    },
  },
  {
    id: 'f4',
    realmId: 'forest',
    skillId: 'multiplication',
    tier: 2, math: 380, reading: 280, steps: 1,
    story: [
      'A druid plants a tree garden.',
      'There are 6 rows, with 7 trees in each row.',
    ],
    question: 'How many trees are planted in total?',
    answer: 42,
    distractors: [
      { value: 13, misconception: 'multiplied_instead_added', explain: '6 + 7 = 13, but you need 6 × 7 = 42.' },
      { value: 36, misconception: 'pattern_extended_wrong_rule', explain: 'That would be 6 × 6. The rows have 7 trees each.' },
      { value: 49, misconception: 'pattern_extended_wrong_rule', explain: 'That\'s 7 × 7. There are only 6 rows.' },
    ],
    scene: {
      type: 'group', item: '🌳', start: 42,
      startLabel: '6 rows × 7 trees',
      actions: [{ kind: 'split', groups: 6, label: '7 trees per row' }],
    },
  },
  {
    id: 'f5',
    realmId: 'forest',
    skillId: 'pattern_extend',
    tier: 2, math: 460, reading: 320, steps: 2,
    story: [
      'A magic vine grows in a special pattern:',
      '1, 4, 9, 16, ...',
    ],
    question: 'What is the next number in this pattern?',
    answer: 25,
    distractors: [
      { value: 23, misconception: 'pattern_extended_wrong_rule', explain: 'The differences grow: +3, +5, +7, +9. So 16 + 9 = 25.' },
      { value: 20, misconception: 'pattern_extended_wrong_rule', explain: 'The pattern is square numbers: 1², 2², 3², 4², so 5² = 25.' },
      { value: 32, misconception: 'pattern_extended_wrong_rule', explain: 'You doubled. The rule is squares: next is 5 × 5 = 25.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: '1²', value: 1, color: '#5aa9e6' },
        { label: '2²', value: 4, color: '#5aa9e6' },
        { label: '3²', value: 9, color: '#5aa9e6' },
        { label: '4²', value: 16, color: '#5aa9e6' },
        { label: '5²?', value: 25, color: '#ffb84d' },
      ],
    },
  },

  // ---- FOREST • Tier 3 ----
  {
    id: 'f6',
    realmId: 'forest',
    skillId: 'pattern_extend',
    tier: 3, math: 580, reading: 440, steps: 3,
    story: [
      'A vine grows by doubling each week.',
      'Week 1: 2 cm. Week 2: 4 cm. Week 3: 8 cm.',
      'And so on for 5 weeks.',
    ],
    question: 'What is the TOTAL height after 5 weeks?',
    answer: 62,
    distractors: [
      { value: 32, misconception: 'answered_wrong_quantity', explain: '32 is just the week-5 growth, not the total of all 5 weeks.' },
      { value: 30, misconception: 'forgot_last_step', explain: '2+4+8+16 = 30 — that\'s only 4 weeks. Add week 5\'s 32 to get 62.' },
      { value: 14, misconception: 'forgot_middle_step', explain: '2+4+8 = 14, only 3 weeks. Continue: +16 +32 = 62.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'W1', value: 2, color: '#4eb86b' },
        { label: 'W2', value: 4, color: '#4eb86b' },
        { label: 'W3', value: 8, color: '#4eb86b' },
        { label: 'W4', value: 16, color: '#4eb86b' },
        { label: 'W5', value: 32, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'f7',
    realmId: 'forest',
    skillId: 'multistep_2op',
    tier: 3, math: 540, reading: 420, steps: 2,
    story: [
      'A druid gathers 30 acorns.',
      'She places them equally into 5 baskets.',
      'Then she finds 2 more acorns and adds them to each basket.',
    ],
    question: 'How many acorns are in each basket now?',
    answer: 8,
    distractors: [
      { value: 6, misconception: 'forgot_last_step', explain: '30 ÷ 5 = 6 — but she added 2 more to each.' },
      { value: 32, misconception: 'wrong_operation', explain: 'That\'s the total acorns. Each basket has 32 ÷ 5 ≈ 6.4... but she added 2 to EACH after splitting evenly.' },
      { value: 7, misconception: 'forgot_middle_step', explain: 'Order matters: split first (6 each), then add 2 → 8 each.' },
    ],
    scene: {
      type: 'group', item: '🌰', start: 30,
      startLabel: '30 acorns',
      actions: [
        { kind: 'split', groups: 5, label: 'into 5 baskets' },
        { kind: 'reveal_count', label: '+2 to each → 8 each' },
      ],
    },
  },

  // ---- DETECTIVE • Tier 1 ----
  {
    id: 'd1',
    realmId: 'detective',
    skillId: 'logic_compare',
    tier: 1, math: 240, reading: 180, steps: 1,
    story: [
      'Detective Wren is 12 years old.',
      'Her younger sister is 3 years younger than Wren.',
    ],
    question: 'How old is Wren\'s sister?',
    answer: 9,
    distractors: [
      { value: 15, misconception: 'inverted_comparison', explain: '"Younger" means subtract, not add. 12 - 3 = 9.' },
      { value: 3, misconception: 'answered_wrong_quantity', explain: 'That\'s how many years younger, not the sister\'s age.' },
      { value: 12, misconception: 'forgot_middle_step', explain: 'You forgot to subtract.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Wren', value: 12, color: '#5aa9e6' },
        { label: 'Diff', value: 3, color: '#e85a4f' },
        { label: 'Sister', value: 9, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'd2',
    realmId: 'detective',
    skillId: 'logic_compare',
    tier: 1, math: 280, reading: 200, steps: 1,
    story: [
      'A clue says: "A is 8."',
      'Another clue says: "A is 3 more than B."',
    ],
    question: 'What is B?',
    answer: 5,
    distractors: [
      { value: 11, misconception: 'inverted_comparison', explain: '"A is 3 more than B" means A = B + 3. So B = A - 3 = 5.' },
      { value: 8, misconception: 'forgot_middle_step', explain: 'You answered A. The question asks B.' },
      { value: 3, misconception: 'answered_wrong_quantity', explain: 'That\'s the difference, not B.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'A', value: 8, color: '#5aa9e6' },
        { label: 'B', value: 5, color: '#4eb86b' },
        { label: 'Diff', value: 3, color: '#e85a4f' },
      ],
    },
  },

  // ---- DETECTIVE • Tier 2 ----
  {
    id: 'd3',
    realmId: 'detective',
    skillId: 'multistep_2op',
    tier: 2, math: 420, reading: 340, steps: 3,
    story: [
      'Three suspects own pets.',
      'The cat weighs 4 kilograms.',
      'The dog weighs twice as much as the cat.',
      'The bird weighs 1 kilogram less than the cat.',
    ],
    question: 'What is the total weight of all three pets?',
    answer: 15,
    distractors: [
      { value: 12, misconception: 'forgot_middle_step', explain: 'You missed one of the pets in the addition: 4 + 8 + 3 = 15.' },
      { value: 17, misconception: 'inverted_comparison', explain: 'The bird is 1 kg LESS than the cat (3), not more (5).' },
      { value: 11, misconception: 'forgot_middle_step', explain: 'You added cat + dog only. Don\'t forget the bird (3 kg).' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Cat', value: 4, color: '#5aa9e6' },
        { label: 'Dog', value: 8, color: '#ffb84d' },
        { label: 'Bird', value: 3, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'd4',
    realmId: 'detective',
    skillId: 'logic_compare',
    tier: 2, math: 440, reading: 380, steps: 3,
    story: [
      'Three evidence boxes contain coins.',
      'Box A holds 4 coins.',
      'Box B holds twice as many as A.',
      'Box C holds half as many as B.',
    ],
    question: 'How many coins are there in total across all three boxes?',
    answer: 16,
    distractors: [
      { value: 12, misconception: 'forgot_middle_step', explain: 'You forgot box C (4 coins). 4 + 8 + 4 = 16.' },
      { value: 14, misconception: 'forgot_middle_step', explain: 'Re-check box C: half of B (8) is 4, not 2. Total = 4 + 8 + 4 = 16.' },
      { value: 8, misconception: 'answered_wrong_quantity', explain: 'That\'s box B alone, not the total.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'A', value: 4, color: '#5aa9e6' },
        { label: 'B', value: 8, color: '#ffb84d' },
        { label: 'C', value: 4, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'd5',
    realmId: 'detective',
    skillId: 'multiplication',
    tier: 2, math: 460, reading: 360, steps: 2,
    story: [
      'A clue: 3 cats catch 12 mice in 1 hour.',
      'Each cat catches the same number of mice per hour.',
    ],
    question: 'How many mice can 6 cats catch in 1 hour?',
    answer: 24,
    distractors: [
      { value: 12, misconception: 'forgot_middle_step', explain: 'With twice as many cats, you catch twice as many mice.' },
      { value: 18, misconception: 'wrong_operation', explain: 'You added 6. With double the cats, multiply by 2: 12 × 2 = 24.' },
      { value: 36, misconception: 'wrong_operation', explain: 'Each cat catches 4 mice/hour. 6 cats × 4 = 24, not 36.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: '3 cats', value: 12, color: '#5aa9e6' },
        { label: '6 cats', value: 24, color: '#4eb86b' },
      ],
    },
  },

  // ---- DETECTIVE • Tier 3 ----
  {
    id: 'd6',
    realmId: 'detective',
    skillId: 'multistep_2op',
    tier: 3, math: 580, reading: 460, steps: 3,
    story: [
      'Wren finds three numbered clues at the scene.',
      'Clue 1 reads "6".',
      'Clue 2 reads twice the value of Clue 1.',
      'Clue 3 reads Clue 2 plus 5.',
    ],
    question: 'What value does Clue 3 give?',
    answer: 17,
    distractors: [
      { value: 11, misconception: 'forgot_middle_step', explain: 'You used Clue 1 (6) + 5 = 11, but Clue 3 builds on Clue 2 (12).' },
      { value: 12, misconception: 'answered_wrong_quantity', explain: 'That\'s Clue 2 alone. Clue 3 adds 5 more.' },
      { value: 22, misconception: 'wrong_operation', explain: 'You added 10 instead of 5. Re-read Clue 3.' },
    ],
    scene: {
      type: 'stack', bars: [
        { label: 'Clue 1', value: 6, color: '#5aa9e6' },
        { label: 'Clue 2', value: 12, color: '#ffb84d' },
        { label: 'Clue 3', value: 17, color: '#4eb86b' },
      ],
    },
  },
  {
    id: 'd7',
    realmId: 'detective',
    skillId: 'multistep_2op',
    tier: 3, math: 600, reading: 480, steps: 3,
    story: [
      'At the scene, Wren counts 30 footprints in the mud.',
      '1/3 of them match Mira\'s shoes.',
      '1/2 of all the footprints match Captain Ade\'s boots.',
      'The rest were left by the unknown thief.',
    ],
    question: 'How many footprints did the thief leave?',
    answer: 5,
    distractors: [
      { value: 10, misconception: 'answered_wrong_quantity', explain: 'That\'s how many were Mira\'s.' },
      { value: 15, misconception: 'answered_wrong_quantity', explain: 'That\'s how many were Ade\'s.' },
      { value: 20, misconception: 'forgot_middle_step', explain: 'You subtracted only one set. 30 - 10 - 15 = 5.' },
    ],
    scene: {
      type: 'tray', item: '👣', start: 30,
      actions: [
        { kind: 'remove', n: 10, label: '1/3 are Mira\'s' },
        { kind: 'remove', n: 15, label: '1/2 are Ade\'s' },
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
