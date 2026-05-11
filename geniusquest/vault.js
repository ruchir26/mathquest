// GeniusQuest — Genius Vault
// 15 legendary problems. Step-by-step illustrated solutions.
// Unlocks after 3 math skills graduated.

const VAULT_PROBLEMS_GQ = [
  {
    id: 'vault_01',
    title: 'The Handshake Problem',
    difficulty: 'Hard',
    prompt: 'At a party, every person shakes hands with every other person exactly once. There were 28 handshakes in total. How many people were at the party?',
    hint: 'Use the formula: n(n−1)/2 = handshakes.',
    answer: 8,
    type: 'math',
    solution: {
      narrative: 'This is a combinatorics classic! We need to find n where n people each shake hands with every other person.',
      steps: [
        {
          heading: 'Set up the formula',
          body: 'Each person shakes hands with (n−1) others. There are n people, giving n×(n−1) handshakes — but each handshake is counted twice (once for each person), so we divide by 2.',
          formula: 'n(n−1) / 2 = 28',
        },
        {
          heading: 'Solve for n',
          body: 'Multiply both sides by 2:',
          formula: 'n(n−1) = 56',
        },
        {
          heading: 'Try values',
          body: 'Try n = 8: 8 × 7 = 56 ✓',
          formula: '8 × 7 / 2 = 56 / 2 = 28 ✓',
        },
        {
          heading: 'Answer',
          body: 'There were 8 people at the party.',
          formula: 'n = 8',
        },
      ],
    },
  },

  {
    id: 'vault_02',
    title: 'The Magic Square',
    difficulty: 'Hard',
    prompt: 'Fill in the missing number in the 3×3 magic square where every row, column and diagonal sums to 15:\n\n[ 2 | 7 | 6 ]\n[ 9 | 5 | ? ]\n[ 4 | 3 | 8 ]',
    hint: 'Each row, column, and diagonal must add to 15.',
    answer: 1,
    type: 'math',
    solution: {
      narrative: 'A magic square has equal sums in every row, column, and diagonal. Here the magic constant is 15.',
      steps: [
        {
          heading: 'Use the middle row',
          body: 'Middle row: 9 + 5 + ? = 15.',
          formula: '9 + 5 = 14, so ? = 15 − 14 = 1',
        },
        {
          heading: 'Verify with column',
          body: 'Right column: 6 + 1 + 8 = 15 ✓',
          formula: '6 + 1 + 8 = 15',
        },
        {
          heading: 'Verify with diagonal',
          body: 'Main diagonal: 2 + 5 + 8 = 15 ✓. Anti-diagonal: 6 + 5 + 4 = 15 ✓',
          formula: 'All checks pass!',
        },
        {
          heading: 'Answer',
          body: 'The missing number is 1.',
          formula: '? = 1',
        },
      ],
    },
  },

  {
    id: 'vault_03',
    title: 'The Painted Cube',
    difficulty: 'Very Hard',
    prompt: 'A 3×3×3 cube is painted red on all outside faces, then cut into 27 small cubes. How many small cubes have paint on exactly 2 faces?',
    hint: 'Think about where the edge cubes are (not corners, not faces).',
    answer: 12,
    type: 'math',
    solution: {
      narrative: 'Visualise the cube! Different positions have different numbers of painted faces.',
      steps: [
        {
          heading: 'Corner cubes',
          body: 'The 8 corners of the big cube each touch 3 painted faces. So 8 cubes have 3 painted faces.',
          formula: '8 corners × 3 faces each',
        },
        {
          heading: 'Edge cubes (2 faces)',
          body: 'Each edge of the cube has 1 small cube that is NOT a corner. A cube has 12 edges, so 12 small cubes have exactly 2 painted faces.',
          formula: '12 edges × 1 middle cube = 12 cubes',
        },
        {
          heading: 'Face cubes (1 face)',
          body: 'The centre of each face: 6 faces × 1 centre cube = 6 cubes with 1 painted face.',
          formula: '6 face centres',
        },
        {
          heading: 'Core cube (0 faces)',
          body: 'The 1 cube completely inside has 0 painted faces.',
          formula: '1 inner cube',
        },
        {
          heading: 'Answer',
          body: 'Exactly 12 small cubes have paint on 2 faces.',
          formula: '8 + 12 + 6 + 1 = 27 ✓, answer = 12',
        },
      ],
    },
  },

  {
    id: 'vault_04',
    title: 'The Fibonacci Riddle',
    difficulty: 'Medium',
    prompt: 'The Fibonacci sequence starts: 1, 1, 2, 3, 5, 8, 13, 21, … Each number is the sum of the two before it. What is the 12th Fibonacci number?',
    hint: 'Keep building the sequence one step at a time.',
    answer: 144,
    type: 'math',
    solution: {
      narrative: 'The Fibonacci sequence appears everywhere in nature — sunflower seeds, shell spirals, even the arrangement of leaves!',
      steps: [
        {
          heading: 'Build the sequence',
          body: 'Each term = previous + one before it.',
          formula: '1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144',
        },
        {
          heading: 'Count the positions',
          body: 'Position 1: 1, Position 2: 1, Position 3: 2 … Position 12: 144.',
          formula: 'F(12) = F(11) + F(10) = 89 + 55 = 144',
        },
        {
          heading: 'Answer',
          body: 'The 12th Fibonacci number is 144.',
          formula: '144',
        },
      ],
    },
  },

  {
    id: 'vault_05',
    title: 'Pythagorean Picture Proof',
    difficulty: 'Hard',
    prompt: 'A right triangle has legs of 9 cm and 40 cm. What is the length of the hypotenuse?',
    hint: 'Use a² + b² = c².',
    answer: 41,
    type: 'math',
    solution: {
      narrative: 'The Pythagorean theorem is one of the greatest ideas in all of mathematics. Discovered over 2,500 years ago!',
      steps: [
        {
          heading: 'Write the theorem',
          body: 'In a right triangle with legs a and b, and hypotenuse c:',
          formula: 'a² + b² = c²',
        },
        {
          heading: 'Substitute the values',
          body: 'a = 9, b = 40.',
          formula: '9² + 40² = 81 + 1600 = 1681',
        },
        {
          heading: 'Take the square root',
          body: '√1681 = ?  Try 41: 41 × 41 = 1681 ✓',
          formula: 'c = √1681 = 41 cm',
        },
        {
          heading: 'Answer',
          body: 'The hypotenuse is 41 cm. (9-40-41 is a Pythagorean triple!)',
          formula: 'c = 41',
        },
      ],
    },
  },

  {
    id: 'vault_06',
    title: 'The Prime Hunt',
    difficulty: 'Hard',
    prompt: 'What is the sum of ALL prime numbers between 1 and 20?',
    hint: 'List every prime first, then add them up.',
    answer: 77,
    type: 'math',
    solution: {
      narrative: 'A prime number has exactly 2 factors: 1 and itself. 1 is NOT prime!',
      steps: [
        {
          heading: 'List the primes from 1 to 20',
          body: 'Check each number: is it divisible only by 1 and itself?',
          formula: '2, 3, 5, 7, 11, 13, 17, 19',
        },
        {
          heading: 'Add them up',
          body: '2+3 = 5, 5+5 = 10, 10+7 = 17, 17+11 = 28, 28+13 = 41, 41+17 = 58, 58+19 = 77.',
          formula: '2+3+5+7+11+13+17+19 = 77',
        },
        {
          heading: 'Answer',
          body: 'The sum of primes from 1 to 20 is 77.',
          formula: '77',
        },
      ],
    },
  },

  {
    id: 'vault_07',
    title: 'The Age Riddle',
    difficulty: 'Hard',
    prompt: 'Maya is 3 times as old as her sister Nadia. In 8 years, Maya will be twice as old as Nadia. How old is Maya right now?',
    hint: 'Set up two equations: one for "now" and one for "in 8 years".',
    answer: 24,
    type: 'math',
    solution: {
      narrative: 'Age problems are algebra puzzles in disguise. Set up variables for what you don\'t know, then solve.',
      steps: [
        {
          heading: 'Define variables',
          body: 'Let Nadia\'s current age = n. Then Maya\'s age = 3n.',
          formula: 'Maya = 3n, Nadia = n',
        },
        {
          heading: 'Write the future equation',
          body: 'In 8 years: Maya = 3n+8, Nadia = n+8. Maya will be twice Nadia.',
          formula: '3n + 8 = 2(n + 8)',
        },
        {
          heading: 'Solve',
          body: 'Expand: 3n + 8 = 2n + 16. Subtract 2n: n + 8 = 16. So n = 8.',
          formula: 'n = 8 (Nadia is 8)',
        },
        {
          heading: 'Find Maya\'s age',
          body: 'Maya = 3n = 3 × 8 = 24.',
          formula: 'Maya = 24',
        },
      ],
    },
  },

  {
    id: 'vault_08',
    title: 'The Tower of Coins',
    difficulty: 'Medium',
    prompt: 'You have a 5-rupee coin, a 2-rupee coin, and a 1-rupee coin. How many DIFFERENT amounts of money can you make by choosing one or more coins? (Count 0 as NOT an amount)',
    hint: 'List all combinations: just coin A, just coin B, A+B, A+C, B+C, A+B+C …',
    answer: 7,
    type: 'math',
    solution: {
      narrative: 'With 3 items, you can choose any non-empty subset. That\'s 2³ − 1 = 7 combinations!',
      steps: [
        {
          heading: 'List all non-empty subsets',
          body: 'For each coin, you either pick it or not. 3 coins → 2³ = 8 subsets. Remove the empty set.',
          formula: '{5}, {2}, {1}, {5+2}, {5+1}, {2+1}, {5+2+1}',
        },
        {
          heading: 'Calculate each amount',
          body: '₹5, ₹2, ₹1, ₹7, ₹6, ₹3, ₹8.',
          formula: 'All 7 are different amounts',
        },
        {
          heading: 'Answer',
          body: 'You can make 7 different amounts.',
          formula: '2³ − 1 = 7',
        },
      ],
    },
  },

  {
    id: 'vault_09',
    title: 'The Frog Jump',
    difficulty: 'Very Hard',
    prompt: 'A frog sits at the bottom of a 10-metre well. Each day it climbs 3 metres, but each night it slides back 2 metres. On which day does the frog reach the top?',
    hint: 'Think carefully — on the day it can reach the top in one jump, it doesn\'t slide back!',
    answer: 8,
    type: 'math',
    solution: {
      narrative: 'This is a classic trick question! The frog escapes on the day it reaches 10m during the climb — it doesn\'t slide back that night.',
      steps: [
        {
          heading: 'Net progress per day',
          body: 'Each full day (climb + slide): +3 − 2 = +1 metre.',
          formula: 'Net gain = 1 m per day',
        },
        {
          heading: 'Position before the final climb',
          body: 'The frog needs to be at 7 m before its morning climb to reach 10 m (7+3=10).',
          formula: 'Need: position ≥ 7 before a day\'s climb',
        },
        {
          heading: 'Track progress',
          body: 'End of Day 1: 1m. Day 2: 2m. Day 3: 3m … Day 7: 7m. Day 8 morning climb: 7+3=10m. Frog escapes! No sliding back.',
          formula: 'Day 7 end = 7m, Day 8 climb = 10m ✓',
        },
        {
          heading: 'Answer',
          body: 'The frog reaches the top on Day 8.',
          formula: 'Answer = 8',
        },
      ],
    },
  },

  {
    id: 'vault_10',
    title: 'The Missing Dollar',
    difficulty: 'Very Hard',
    prompt: 'Three friends share a hotel room for ₹30. They each pay ₹10. The hotel refunds ₹5. The bellhop gives ₹1 back to each friend (₹3 total) and keeps ₹2. Now each friend paid ₹9 (₹27 total). The bellhop has ₹2. That\'s ₹29. Where is the missing ₹1?',
    hint: 'There is no missing rupee — the puzzle uses wrong math. What is the correct accounting?',
    answer: 0,
    type: 'math',
    solution: {
      narrative: 'This is one of the most famous mathematical riddles — and there is NO missing rupee! It is a trick of misleading arithmetic.',
      steps: [
        {
          heading: 'What actually happened',
          body: 'Friends paid ₹30. Hotel returned ₹5. Friends got ₹3, bellhop kept ₹2. Hotel received ₹25.',
          formula: '₹25 (hotel) + ₹3 (friends) + ₹2 (bellhop) = ₹30 ✓',
        },
        {
          heading: 'The trick',
          body: 'The riddle adds ₹27 (what friends paid) + ₹2 (bellhop) = ₹29, and asks "where\'s ₹1?" But this addition is meaningless! You should NOT add what friends paid to what the bellhop kept.',
          formula: '₹27 already INCLUDES the ₹2 the bellhop kept.',
        },
        {
          heading: 'Correct breakdown',
          body: '₹27 friends paid = ₹25 to hotel + ₹2 to bellhop. There is no missing rupee.',
          formula: 'Friends paid ₹27; ₹25 + ₹2 = ₹27 ✓',
        },
        {
          heading: 'Answer',
          body: 'There are 0 missing rupees — it\'s a trick of false arithmetic!',
          formula: '0',
        },
      ],
    },
  },

  {
    id: 'vault_11',
    title: 'Gauss\'s Formula',
    difficulty: 'Hard',
    prompt: 'When Carl Friedrich Gauss was 10 years old, his teacher asked the class to add all numbers from 1 to 100. Gauss solved it in seconds. What is 1 + 2 + 3 + … + 100?',
    hint: 'Pair the first and last numbers: 1+100, 2+99, 3+98 … How many pairs are there?',
    answer: 5050,
    type: 'math',
    solution: {
      narrative: 'Young Gauss spotted a brilliant pattern. This formula is used by mathematicians worldwide!',
      steps: [
        {
          heading: 'Gauss\'s pairing trick',
          body: 'Pair 1 with 100, 2 with 99, 3 with 98, … Each pair sums to 101.',
          formula: '1+100 = 101, 2+99 = 101, ...',
        },
        {
          heading: 'Count the pairs',
          body: 'There are 100 numbers → 50 pairs.',
          formula: '100 ÷ 2 = 50 pairs',
        },
        {
          heading: 'Total sum',
          body: '50 pairs × 101 each.',
          formula: '50 × 101 = 5050',
        },
        {
          heading: 'General formula',
          body: 'Sum of 1 to n = n(n+1)/2.',
          formula: '100 × 101 / 2 = 5050 ✓',
        },
      ],
    },
  },

  {
    id: 'vault_12',
    title: 'The Chessboard Squares',
    difficulty: 'Very Hard',
    prompt: 'A standard chessboard has 8×8 squares. How many squares of ALL sizes are on a chessboard? (1×1, 2×2, 3×3 … 8×8)',
    hint: 'Count how many positions each size of square can be in.',
    answer: 204,
    type: 'math',
    solution: {
      narrative: 'This is a competition-level counting problem. The key is to count squares of EVERY size.',
      steps: [
        {
          heading: 'Count 1×1 squares',
          body: 'An 8×8 grid has 64 positions for 1×1 squares.',
          formula: '8 × 8 = 64',
        },
        {
          heading: 'Count 2×2 squares',
          body: 'A 2×2 square can start at positions 1–7 in each direction: 7×7 = 49.',
          formula: '7 × 7 = 49',
        },
        {
          heading: 'Pattern',
          body: 'An n×n square fits in (9−n)×(9−n) positions. Sum from n=1 to 8.',
          formula: '8²+7²+6²+5²+4²+3²+2²+1²',
        },
        {
          heading: 'Calculate',
          body: '64+49+36+25+16+9+4+1.',
          formula: '64+49 = 113, +36 = 149, +25 = 174, +16 = 190, +9 = 199, +4 = 203, +1 = 204',
        },
        {
          heading: 'Answer',
          body: 'There are 204 squares in total on a chessboard.',
          formula: '204',
        },
      ],
    },
  },

  {
    id: 'vault_13',
    title: 'The Pigeon Hole',
    difficulty: 'Hard',
    prompt: 'There are 367 people in a room. Is it guaranteed that at least 2 people share the same birthday? Answer 1 for Yes, 0 for No.',
    hint: 'There are only 366 possible birthdays (including Feb 29). Think about pigeons and holes.',
    answer: 1,
    type: 'math',
    solution: {
      narrative: 'The Pigeonhole Principle is one of the most powerful ideas in mathematics: if you have more pigeons than holes, at least one hole must have 2 pigeons!',
      steps: [
        {
          heading: 'The principle',
          body: 'If you have n+1 items and n categories, at least one category has 2 or more items.',
          formula: '367 people, 366 possible birthdays',
        },
        {
          heading: 'Apply it',
          body: '367 "pigeons" (people) and 366 "holes" (birthdays). So at least one birthday must belong to 2 people.',
          formula: '367 > 366 → guaranteed repeat',
        },
        {
          heading: 'Answer',
          body: 'YES — it is guaranteed (answer = 1). You cannot fit 367 people into 366 birthday slots without at least one collision!',
          formula: '1 (yes)',
        },
      ],
    },
  },

  {
    id: 'vault_14',
    title: 'The Four Fours',
    difficulty: 'Very Hard',
    prompt: 'Using exactly four 4s and any mathematical symbols (+, −, ×, ÷, parentheses, √), make the number 0. What is 4 + 4 − 4 − 4?',
    hint: 'You can use operations on the four 4s to reach many different numbers!',
    answer: 0,
    type: 'math',
    solution: {
      narrative: 'The Four Fours puzzle challenges you to make every number from 0 to 100 using exactly four 4s. Here is the simplest solution for 0.',
      steps: [
        {
          heading: 'Write the expression',
          body: 'Use + and − to cancel out.',
          formula: '4 + 4 − 4 − 4',
        },
        {
          heading: 'Calculate left to right',
          body: '4 + 4 = 8. 8 − 4 = 4. 4 − 4 = 0.',
          formula: '4 + 4 − 4 − 4 = 0 ✓',
        },
        {
          heading: 'Bonus',
          body: 'Can you make 1, 2, 3 … using four 4s? E.g., 44 ÷ 44 = 1!',
          formula: 'Explore!',
        },
      ],
    },
  },

  {
    id: 'vault_15',
    title: 'The Genius Challenge',
    difficulty: 'Legendary',
    prompt: 'A farmer needs to cross a river with a fox, a chicken, and a bag of grain. His boat holds only himself + one item. Left alone: fox eats chicken; chicken eats grain. What is the MINIMUM number of crossings needed?',
    hint: 'The trick is to take something BACK on one trip.',
    answer: 7,
    type: 'math',
    solution: {
      narrative: 'This is a 9th-century logic puzzle! The key insight is that you sometimes need to carry something BACK across the river.',
      steps: [
        {
          heading: 'Trip 1',
          body: 'Take the CHICKEN across. (Fox and grain are safe together.)',
          formula: '→ Chicken | Fox + Grain on start',
        },
        {
          heading: 'Trip 2',
          body: 'Go back alone.',
          formula: '← alone',
        },
        {
          heading: 'Trip 3',
          body: 'Take the FOX across.',
          formula: '→ Fox | Chicken alone on far side',
        },
        {
          heading: 'Trip 4 — the brilliant move!',
          body: 'Take the CHICKEN back! (Otherwise fox eats chicken.)',
          formula: '← Chicken (bring it back)',
        },
        {
          heading: 'Trip 5',
          body: 'Take the GRAIN across. (Fox is already there, chicken is at start.)',
          formula: '→ Grain | Fox + Grain on far side, Chicken alone at start',
        },
        {
          heading: 'Trip 6',
          body: 'Go back alone.',
          formula: '← alone',
        },
        {
          heading: 'Trip 7',
          body: 'Take the CHICKEN across. Done! 7 crossings total.',
          formula: '→ Chicken | All safe on far side ✓',
        },
      ],
    },
  },
];

// ── Lookup ───────────────────────────────────────────────────────────────────
const VAULT_BY_ID_GQ = {};
for (const v of VAULT_PROBLEMS_GQ) VAULT_BY_ID_GQ[v.id] = v;
