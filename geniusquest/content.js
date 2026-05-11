// GeniusQuest — Skills + Problems
// Math: free-text numeric answers · English/Science: MCQ choices
// Each math problem has: id, skillId, difficulty, prompt, wordProblem?,
//   sceneType, sceneData, answer (number), tolerance, stepSolution[]
// Each MCQ problem has: id, skillId, difficulty, prompt, sceneType, sceneData,
//   choices[], correctIdx, misconception, hint

// ── Skills ─────────────────────────────────────────────────────────────────
const SKILLS_GQ = {
  // MATH HALL (9 skills, ordered by difficulty)
  addition: {
    id: 'addition', name: 'Addition', hall: 'math',
    threshold: 500, fluencyMs: 20000,
    desc: 'Single & double-digit addition',
    icon: '➕',
  },
  subtraction: {
    id: 'subtraction', name: 'Subtraction', hall: 'math',
    threshold: 500, fluencyMs: 20000,
    desc: 'Borrowing & regrouping',
    icon: '➖',
  },
  multiplication: {
    id: 'multiplication', name: 'Multiplication', hall: 'math',
    threshold: 550, fluencyMs: 22000,
    desc: 'Times tables & multi-digit',
    icon: '✖️',
  },
  division: {
    id: 'division', name: 'Division', hall: 'math',
    threshold: 550, fluencyMs: 22000,
    desc: 'Long division with remainders',
    icon: '➗',
  },
  fractions: {
    id: 'fractions', name: 'Fractions', hall: 'math',
    threshold: 600, fluencyMs: 25000,
    desc: 'Add, subtract & compare fractions',
    icon: '½',
  },
  geometry: {
    id: 'geometry', name: 'Geometry', hall: 'math',
    threshold: 600, fluencyMs: 25000,
    desc: 'Perimeter, area & shapes',
    icon: '📐',
  },
  algebra: {
    id: 'algebra', name: 'Algebra', hall: 'math',
    threshold: 650, fluencyMs: 28000,
    desc: 'Variables, equations & patterns',
    icon: '🔣',
  },
  logic: {
    id: 'logic', name: 'Logic & Patterns', hall: 'math',
    threshold: 650, fluencyMs: 28000,
    desc: 'Sequences, puzzles & reasoning',
    icon: '🧩',
  },
  olympiad: {
    id: 'olympiad', name: 'Olympiad', hall: 'math',
    threshold: 750, fluencyMs: 35000,
    desc: 'Competition-level math challenges',
    icon: '🥇',
  },

  // ENGLISH HALL (5 skills)
  vocabulary: {
    id: 'vocabulary', name: 'Vocabulary', hall: 'english',
    threshold: 500, fluencyMs: 25000,
    desc: 'Word meanings & usage',
    icon: '📚',
  },
  grammar: {
    id: 'grammar', name: 'Grammar', hall: 'english',
    threshold: 500, fluencyMs: 25000,
    desc: 'Parts of speech & sentence structure',
    icon: '✏️',
  },
  reading: {
    id: 'reading', name: 'Reading Comprehension', hall: 'english',
    threshold: 550, fluencyMs: 30000,
    desc: 'Understand passages & find clues',
    icon: '📖',
  },
  idioms: {
    id: 'idioms', name: 'Idioms & Phrases', hall: 'english',
    threshold: 550, fluencyMs: 28000,
    desc: 'Figurative language & expressions',
    icon: '💬',
  },
  spelling: {
    id: 'spelling', name: 'Spelling & Phonics', hall: 'english',
    threshold: 500, fluencyMs: 22000,
    desc: 'Tricky spellings & word sounds',
    icon: '🔤',
  },

  // SCIENCE HALL (5 skills)
  biology: {
    id: 'biology', name: 'Life Science', hall: 'science',
    threshold: 500, fluencyMs: 25000,
    desc: 'Plants, animals & the human body',
    icon: '🌿',
  },
  physics: {
    id: 'physics', name: 'Forces & Energy', hall: 'science',
    threshold: 550, fluencyMs: 25000,
    desc: 'Motion, gravity & simple machines',
    icon: '⚡',
  },
  chemistry: {
    id: 'chemistry', name: 'Matter & Materials', hall: 'science',
    threshold: 550, fluencyMs: 25000,
    desc: 'Solids, liquids, gases & mixtures',
    icon: '🧪',
  },
  space: {
    id: 'space', name: 'Space & Planets', hall: 'science',
    threshold: 500, fluencyMs: 25000,
    desc: 'Solar system & beyond',
    icon: '🪐',
  },
  earth: {
    id: 'earth', name: 'Earth Science', hall: 'science',
    threshold: 500, fluencyMs: 25000,
    desc: 'Weather, rocks & ecosystems',
    icon: '🌍',
  },
};

// ── Problems ────────────────────────────────────────────────────────────────
// type: 'math' → free-text | 'mcq' → multiple choice

const PROBLEMS_GQ = [

  // ═══════════ ADDITION ═══════════
  {
    id: 'add_01', skillId: 'addition', type: 'math', difficulty: 180,
    prompt: 'What is 7 + 8?',
    answer: 15,
    stepSolution: [
      { text: 'Start with 7.', scene: null },
      { text: 'Count up 8 more: 8, 9, 10, 11, 12, 13, 14, 15.', scene: null },
      { text: '7 + 8 = 15 ✓', scene: null },
    ],
  },
  {
    id: 'add_02', skillId: 'addition', type: 'math', difficulty: 220,
    prompt: 'What is 24 + 38?',
    answer: 62,
    stepSolution: [
      { text: 'Add ones: 4 + 8 = 12. Write 2, carry 1.', scene: null },
      { text: 'Add tens: 2 + 3 + 1(carry) = 6.', scene: null },
      { text: '24 + 38 = 62 ✓', scene: null },
    ],
  },
  {
    id: 'add_03', skillId: 'addition', type: 'math', difficulty: 280,
    prompt: 'A bookshelf has 47 red books and 65 blue books. How many books in total?',
    wordProblem: true,
    answer: 112,
    stepSolution: [
      { text: 'We need 47 + 65.', scene: null },
      { text: 'Ones: 7 + 5 = 12. Write 2, carry 1.', scene: null },
      { text: 'Tens: 4 + 6 + 1 = 11. Write 11.', scene: null },
      { text: 'Total books = 112 ✓', scene: null },
    ],
  },
  {
    id: 'add_04', skillId: 'addition', type: 'math', difficulty: 350,
    prompt: 'What is 356 + 489?',
    answer: 845,
    stepSolution: [
      { text: 'Ones: 6 + 9 = 15. Write 5, carry 1.', scene: null },
      { text: 'Tens: 5 + 8 + 1 = 14. Write 4, carry 1.', scene: null },
      { text: 'Hundreds: 3 + 4 + 1 = 8.', scene: null },
      { text: '356 + 489 = 845 ✓', scene: null },
    ],
  },
  {
    id: 'add_05', skillId: 'addition', type: 'math', difficulty: 420,
    prompt: 'Sam collects stamps. He has 273 from Asia and 418 from Europe. How many stamps does he have altogether?',
    wordProblem: true,
    answer: 691,
    stepSolution: [
      { text: '273 + 418:', scene: null },
      { text: 'Ones: 3 + 8 = 11. Write 1, carry 1.', scene: null },
      { text: 'Tens: 7 + 1 + 1 = 9.', scene: null },
      { text: 'Hundreds: 2 + 4 = 6.', scene: null },
      { text: 'Sam has 691 stamps ✓', scene: null },
    ],
  },

  // ═══════════ SUBTRACTION ═══════════
  {
    id: 'sub_01', skillId: 'subtraction', type: 'math', difficulty: 180,
    prompt: 'What is 15 − 8?',
    answer: 7,
    stepSolution: [
      { text: 'Think: 8 + ? = 15.', scene: null },
      { text: 'Count up from 8: 9, 10, 11, 12, 13, 14, 15 — that is 7 steps.', scene: null },
      { text: '15 − 8 = 7 ✓', scene: null },
    ],
  },
  {
    id: 'sub_02', skillId: 'subtraction', type: 'math', difficulty: 250,
    prompt: 'What is 73 − 46?',
    answer: 27,
    stepSolution: [
      { text: 'Ones: 3 − 6 is too small, so borrow from tens.', scene: null },
      { text: '13 − 6 = 7. Tens become 6.', scene: null },
      { text: 'Tens: 6 − 4 = 2.', scene: null },
      { text: '73 − 46 = 27 ✓', scene: null },
    ],
  },
  {
    id: 'sub_03', skillId: 'subtraction', type: 'math', difficulty: 310,
    prompt: 'A jar has 200 sweets. Children eat 137. How many sweets are left?',
    wordProblem: true,
    answer: 63,
    stepSolution: [
      { text: '200 − 137:', scene: null },
      { text: 'Borrow: 200 → borrow from hundreds to tens to ones.', scene: null },
      { text: 'Ones: 10 − 7 = 3. Tens: 9 − 3 = 6. Hundreds: 0.', scene: null },
      { text: '63 sweets remain ✓', scene: null },
    ],
  },
  {
    id: 'sub_04', skillId: 'subtraction', type: 'math', difficulty: 390,
    prompt: 'What is 1000 − 364?',
    answer: 636,
    stepSolution: [
      { text: '1000 − 364: Borrow through zeros.', scene: null },
      { text: 'Ones: 10 − 4 = 6. Tens: 9 − 6 = 3. Hundreds: 9 − 3 = 6. Thousands: 0.', scene: null },
      { text: '1000 − 364 = 636 ✓', scene: null },
    ],
  },
  {
    id: 'sub_05', skillId: 'subtraction', type: 'math', difficulty: 450,
    prompt: 'A library had 4,205 books. It lent out 1,678 books. How many books remain?',
    wordProblem: true,
    answer: 2527,
    stepSolution: [
      { text: '4205 − 1678:', scene: null },
      { text: 'Ones: 5 − 8, borrow → 15 − 8 = 7.', scene: null },
      { text: 'Tens: 0 − 7 − 1(borrow), need to borrow → 10 − 7 − 1 = 2. Wait, tens become 9 after borrowing from hundreds.', scene: null },
      { text: 'Actually: 4205 − 1678 = 2527 ✓', scene: null },
    ],
  },

  // ═══════════ MULTIPLICATION ═══════════
  {
    id: 'mul_01', skillId: 'multiplication', type: 'math', difficulty: 180,
    prompt: 'What is 6 × 7?',
    answer: 42,
    stepSolution: [
      { text: '6 groups of 7: 7, 14, 21, 28, 35, 42.', scene: null },
      { text: '6 × 7 = 42 ✓', scene: null },
    ],
  },
  {
    id: 'mul_02', skillId: 'multiplication', type: 'math', difficulty: 250,
    prompt: 'What is 8 × 9?',
    answer: 72,
    stepSolution: [
      { text: 'Use the trick: 8 × 9 = 8 × 10 − 8 = 80 − 8 = 72.', scene: null },
      { text: '8 × 9 = 72 ✓', scene: null },
    ],
  },
  {
    id: 'mul_03', skillId: 'multiplication', type: 'math', difficulty: 320,
    prompt: 'There are 12 boxes, each with 15 crayons. How many crayons in total?',
    wordProblem: true,
    answer: 180,
    stepSolution: [
      { text: '12 × 15 = 12 × 10 + 12 × 5 = 120 + 60 = 180.', scene: null },
      { text: 'Total crayons = 180 ✓', scene: null },
    ],
  },
  {
    id: 'mul_04', skillId: 'multiplication', type: 'math', difficulty: 400,
    prompt: 'What is 24 × 36?',
    answer: 864,
    stepSolution: [
      { text: '24 × 36 = 24 × 30 + 24 × 6.', scene: null },
      { text: '24 × 30 = 720.', scene: null },
      { text: '24 × 6 = 144.', scene: null },
      { text: '720 + 144 = 864 ✓', scene: null },
    ],
  },
  {
    id: 'mul_05', skillId: 'multiplication', type: 'math', difficulty: 480,
    prompt: 'A stadium has 48 rows. Each row has 125 seats. How many seats in the stadium?',
    wordProblem: true,
    answer: 6000,
    stepSolution: [
      { text: '48 × 125 = 48 × 100 + 48 × 25.', scene: null },
      { text: '48 × 100 = 4800.', scene: null },
      { text: '48 × 25 = 48 × 100 ÷ 4 = 4800 ÷ 4 = 1200.', scene: null },
      { text: '4800 + 1200 = 6000 seats ✓', scene: null },
    ],
  },
  {
    id: 'mul_06', skillId: 'multiplication', type: 'math', difficulty: 550,
    prompt: 'What is 123 × 456?',
    answer: 56088,
    stepSolution: [
      { text: '123 × 456 = 123 × 400 + 123 × 50 + 123 × 6.', scene: null },
      { text: '123 × 400 = 49200.', scene: null },
      { text: '123 × 50 = 6150.', scene: null },
      { text: '123 × 6 = 738.', scene: null },
      { text: '49200 + 6150 + 738 = 56088 ✓', scene: null },
    ],
  },

  // ═══════════ DIVISION ═══════════
  {
    id: 'div_01', skillId: 'division', type: 'math', difficulty: 180,
    prompt: 'What is 36 ÷ 6?',
    answer: 6,
    stepSolution: [
      { text: 'Ask: 6 × ? = 36.', scene: null },
      { text: '6 × 6 = 36.', scene: null },
      { text: '36 ÷ 6 = 6 ✓', scene: null },
    ],
  },
  {
    id: 'div_02', skillId: 'division', type: 'math', difficulty: 250,
    prompt: 'What is 84 ÷ 7?',
    answer: 12,
    stepSolution: [
      { text: '7 goes into 8 once (7), remainder 1.', scene: null },
      { text: 'Bring down 4 → 14. 7 goes into 14 twice.', scene: null },
      { text: '84 ÷ 7 = 12 ✓', scene: null },
    ],
  },
  {
    id: 'div_03', skillId: 'division', type: 'math', difficulty: 330,
    prompt: '168 students must be split into equal teams of 8. How many teams?',
    wordProblem: true,
    answer: 21,
    stepSolution: [
      { text: '168 ÷ 8:', scene: null },
      { text: '8 into 16 = 2, remainder 0.', scene: null },
      { text: '8 into 08 = 1.', scene: null },
      { text: '168 ÷ 8 = 21 teams ✓', scene: null },
    ],
  },
  {
    id: 'div_04', skillId: 'division', type: 'math', difficulty: 420,
    prompt: 'What is 756 ÷ 12?',
    answer: 63,
    stepSolution: [
      { text: '12 into 75 = 6 (12×6=72), remainder 3.', scene: null },
      { text: 'Bring down 6 → 36. 12 into 36 = 3.', scene: null },
      { text: '756 ÷ 12 = 63 ✓', scene: null },
    ],
  },
  {
    id: 'div_05', skillId: 'division', type: 'math', difficulty: 500,
    prompt: 'A farmer harvests 2,340 apples and packs them in bags of 15. How many bags does he fill?',
    wordProblem: true,
    answer: 156,
    stepSolution: [
      { text: '2340 ÷ 15:', scene: null },
      { text: '15 into 23 = 1, remainder 8. Bring down 4 → 84.', scene: null },
      { text: '15 into 84 = 5, remainder 9. Bring down 0 → 90.', scene: null },
      { text: '15 into 90 = 6.', scene: null },
      { text: '2340 ÷ 15 = 156 bags ✓', scene: null },
    ],
  },

  // ═══════════ FRACTIONS ═══════════
  {
    id: 'frac_01', skillId: 'fractions', type: 'math', difficulty: 200,
    prompt: 'What is 1/2 + 1/4? (Write your answer as a fraction like 3/4)',
    answer: 0.75,
    tolerance: 0.01,
    stepSolution: [
      { text: 'Make the denominators equal. 1/2 = 2/4.', scene: null },
      { text: '2/4 + 1/4 = 3/4.', scene: null },
      { text: '1/2 + 1/4 = 3/4 ✓', scene: null },
    ],
  },
  {
    id: 'frac_02', skillId: 'fractions', type: 'math', difficulty: 280,
    prompt: 'What is 2/3 + 1/6? (Write as a fraction)',
    answer: 0.8333333333,
    tolerance: 0.01,
    stepSolution: [
      { text: 'LCD of 3 and 6 is 6. 2/3 = 4/6.', scene: null },
      { text: '4/6 + 1/6 = 5/6.', scene: null },
      { text: '2/3 + 1/6 = 5/6 ✓', scene: null },
    ],
  },
  {
    id: 'frac_03', skillId: 'fractions', type: 'math', difficulty: 350,
    prompt: 'What is 3/4 − 1/3? (Write as a fraction or decimal)',
    answer: 0.41666666,
    tolerance: 0.01,
    stepSolution: [
      { text: 'LCD of 4 and 3 is 12.', scene: null },
      { text: '3/4 = 9/12. 1/3 = 4/12.', scene: null },
      { text: '9/12 − 4/12 = 5/12 ≈ 0.417 ✓', scene: null },
    ],
  },
  {
    id: 'frac_04', skillId: 'fractions', type: 'math', difficulty: 430,
    prompt: 'A pizza is cut into 8 equal slices. Emma eats 3 slices and Jake eats 2 slices. What fraction of the pizza is left?',
    wordProblem: true,
    answer: 0.375,
    tolerance: 0.01,
    stepSolution: [
      { text: 'Slices eaten: 3 + 2 = 5.', scene: null },
      { text: 'Slices left: 8 − 5 = 3.', scene: null },
      { text: 'Fraction left: 3/8 = 0.375 ✓', scene: null },
    ],
  },
  {
    id: 'frac_05', skillId: 'fractions', type: 'math', difficulty: 520,
    prompt: 'What is 1 3/4 + 2 2/3? (Write as a mixed number like 4 5/12)',
    answer: 4.41666666,
    tolerance: 0.01,
    stepSolution: [
      { text: '1 3/4 = 7/4. 2 2/3 = 8/3.', scene: null },
      { text: 'LCD = 12. 7/4 = 21/12. 8/3 = 32/12.', scene: null },
      { text: '21/12 + 32/12 = 53/12 = 4 5/12 ✓', scene: null },
    ],
  },
  {
    id: 'frac_06', skillId: 'fractions', type: 'math', difficulty: 600,
    prompt: 'What is 3/5 × 10/9? Simplify your answer.',
    answer: 0.6666666,
    tolerance: 0.01,
    stepSolution: [
      { text: 'Multiply numerators: 3 × 10 = 30. Denominators: 5 × 9 = 45.', scene: null },
      { text: '30/45 = 2/3 (divide both by 15).', scene: null },
      { text: '3/5 × 10/9 = 2/3 ✓', scene: null },
    ],
  },

  // ═══════════ GEOMETRY ═══════════
  {
    id: 'geo_01', skillId: 'geometry', type: 'math', difficulty: 200,
    prompt: 'What is the perimeter of a square with side 7 cm?',
    answer: 28,
    stepSolution: [
      { text: 'A square has 4 equal sides.', scene: null },
      { text: 'Perimeter = 4 × side = 4 × 7 = 28 cm ✓', scene: null },
    ],
  },
  {
    id: 'geo_02', skillId: 'geometry', type: 'math', difficulty: 270,
    prompt: 'What is the area of a rectangle that is 9 cm wide and 6 cm tall?',
    answer: 54,
    stepSolution: [
      { text: 'Area = length × width = 9 × 6 = 54.', scene: null },
      { text: 'Area = 54 cm² ✓', scene: null },
    ],
  },
  {
    id: 'geo_03', skillId: 'geometry', type: 'math', difficulty: 350,
    prompt: 'A right triangle has legs 3 cm and 4 cm. What is its area?',
    wordProblem: true,
    answer: 6,
    stepSolution: [
      { text: 'Area of a triangle = ½ × base × height.', scene: null },
      { text: '½ × 3 × 4 = ½ × 12 = 6 cm² ✓', scene: null },
    ],
  },
  {
    id: 'geo_04', skillId: 'geometry', type: 'math', difficulty: 430,
    prompt: 'A room is 5 m long and 4 m wide. How many square tiles (each 0.5 m × 0.5 m) are needed to cover the floor?',
    wordProblem: true,
    answer: 80,
    stepSolution: [
      { text: 'Room area = 5 × 4 = 20 m².', scene: null },
      { text: 'Each tile area = 0.5 × 0.5 = 0.25 m².', scene: null },
      { text: 'Tiles needed = 20 ÷ 0.25 = 80 ✓', scene: null },
    ],
  },
  {
    id: 'geo_05', skillId: 'geometry', type: 'math', difficulty: 520,
    prompt: 'A circle has radius 7 cm. What is its area? (Use π ≈ 3.14, round to nearest whole number)',
    answer: 154,
    tolerance: 1,
    stepSolution: [
      { text: 'Area = π × r² = 3.14 × 7² = 3.14 × 49.', scene: null },
      { text: '3.14 × 49 = 153.86 ≈ 154 cm² ✓', scene: null },
    ],
  },
  {
    id: 'geo_06', skillId: 'geometry', type: 'math', difficulty: 600,
    prompt: 'A cube has edges of 5 cm. What is its total surface area?',
    answer: 150,
    stepSolution: [
      { text: 'A cube has 6 square faces.', scene: null },
      { text: 'Each face area = 5 × 5 = 25 cm².', scene: null },
      { text: 'Total = 6 × 25 = 150 cm² ✓', scene: null },
    ],
  },

  // ═══════════ ALGEBRA ═══════════
  {
    id: 'alg_01', skillId: 'algebra', type: 'math', difficulty: 220,
    prompt: 'Solve for x: x + 9 = 15. What is x?',
    answer: 6,
    stepSolution: [
      { text: 'Subtract 9 from both sides.', scene: null },
      { text: 'x = 15 − 9 = 6 ✓', scene: null },
    ],
  },
  {
    id: 'alg_02', skillId: 'algebra', type: 'math', difficulty: 300,
    prompt: 'Solve: 3x = 24. What is x?',
    answer: 8,
    stepSolution: [
      { text: 'Divide both sides by 3.', scene: null },
      { text: 'x = 24 ÷ 3 = 8 ✓', scene: null },
    ],
  },
  {
    id: 'alg_03', skillId: 'algebra', type: 'math', difficulty: 380,
    prompt: 'Solve: 2x + 5 = 17. What is x?',
    answer: 6,
    stepSolution: [
      { text: 'Subtract 5 from both sides: 2x = 12.', scene: null },
      { text: 'Divide by 2: x = 6 ✓', scene: null },
    ],
  },
  {
    id: 'alg_04', skillId: 'algebra', type: 'math', difficulty: 460,
    prompt: 'A number is tripled and then 7 is added. The result is 34. What is the number?',
    wordProblem: true,
    answer: 9,
    stepSolution: [
      { text: 'Let n = the number. 3n + 7 = 34.', scene: null },
      { text: 'Subtract 7: 3n = 27.', scene: null },
      { text: 'Divide by 3: n = 9 ✓', scene: null },
    ],
  },
  {
    id: 'alg_05', skillId: 'algebra', type: 'math', difficulty: 540,
    prompt: 'Solve: 4(x − 2) = 20. What is x?',
    answer: 7,
    stepSolution: [
      { text: 'Expand: 4x − 8 = 20.', scene: null },
      { text: 'Add 8: 4x = 28.', scene: null },
      { text: 'Divide by 4: x = 7 ✓', scene: null },
    ],
  },
  {
    id: 'alg_06', skillId: 'algebra', type: 'math', difficulty: 620,
    prompt: 'Solve: 5x + 3 = 3x + 11. What is x?',
    answer: 4,
    stepSolution: [
      { text: 'Subtract 3x from both sides: 2x + 3 = 11.', scene: null },
      { text: 'Subtract 3: 2x = 8.', scene: null },
      { text: 'Divide by 2: x = 4 ✓', scene: null },
    ],
  },

  // ═══════════ LOGIC & PATTERNS ═══════════
  {
    id: 'log_01', skillId: 'logic', type: 'math', difficulty: 220,
    prompt: 'What comes next? 2, 4, 8, 16, ___',
    answer: 32,
    stepSolution: [
      { text: 'Each number doubles. 16 × 2 = 32.', scene: null },
      { text: 'Next = 32 ✓', scene: null },
    ],
  },
  {
    id: 'log_02', skillId: 'logic', type: 'math', difficulty: 300,
    prompt: 'What is the 8th term of: 3, 7, 11, 15, … ?',
    answer: 31,
    stepSolution: [
      { text: 'Common difference = 4.', scene: null },
      { text: 'Term n = 3 + (n−1) × 4.', scene: null },
      { text: 'Term 8 = 3 + 7 × 4 = 3 + 28 = 31 ✓', scene: null },
    ],
  },
  {
    id: 'log_03', skillId: 'logic', type: 'math', difficulty: 380,
    prompt: 'In a class, every student shakes hands with every other student. If there are 6 students, how many handshakes happen?',
    wordProblem: true,
    answer: 15,
    stepSolution: [
      { text: 'Each of 6 students shakes with 5 others = 6 × 5 = 30.', scene: null },
      { text: 'But each handshake is counted twice, so divide by 2.', scene: null },
      { text: '30 ÷ 2 = 15 handshakes ✓', scene: null },
    ],
  },
  {
    id: 'log_04', skillId: 'logic', type: 'math', difficulty: 460,
    prompt: 'A 3×3 magic square uses the numbers 1–9. The magic sum for each row, column, and diagonal is 15. The centre is 5. What is the top-left corner if the top-right corner is 2?',
    wordProblem: true,
    answer: 6,
    stepSolution: [
      { text: 'Magic sum = 15. Top row must sum to 15.', scene: null },
      { text: 'Top-right = 2. Centre top would need top-left + top-middle + 2 = 15.', scene: null },
      { text: 'Standard 3×3 magic square top row: 2, 7, 6. Top-left = 6 ✓', scene: null },
    ],
  },
  {
    id: 'log_05', skillId: 'logic', type: 'math', difficulty: 540,
    prompt: 'If f(n) = n² + 1, what is f(7)?',
    answer: 50,
    stepSolution: [
      { text: 'f(n) = n² + 1. Plug in n = 7.', scene: null },
      { text: 'f(7) = 7² + 1 = 49 + 1 = 50 ✓', scene: null },
    ],
  },

  // ═══════════ OLYMPIAD ═══════════
  {
    id: 'oly_01', skillId: 'olympiad', type: 'math', difficulty: 500,
    prompt: 'How many 2-digit numbers are divisible by both 3 and 5?',
    answer: 6,
    stepSolution: [
      { text: 'Divisible by both 3 and 5 → divisible by 15.', scene: null },
      { text: 'Two-digit multiples of 15: 15, 30, 45, 60, 75, 90.', scene: null },
      { text: 'Count = 6 ✓', scene: null },
    ],
  },
  {
    id: 'oly_02', skillId: 'olympiad', type: 'math', difficulty: 560,
    prompt: 'The sum of three consecutive even numbers is 78. What is the smallest of the three?',
    wordProblem: true,
    answer: 24,
    stepSolution: [
      { text: 'Let the three consecutive even numbers be n, n+2, n+4.', scene: null },
      { text: 'n + (n+2) + (n+4) = 78 → 3n + 6 = 78 → 3n = 72 → n = 24.', scene: null },
      { text: 'Smallest = 24 ✓', scene: null },
    ],
  },
  {
    id: 'oly_03', skillId: 'olympiad', type: 'math', difficulty: 620,
    prompt: 'A train travels 360 km in 4 hours. How far does it travel in 7 hours at the same speed?',
    wordProblem: true,
    answer: 630,
    stepSolution: [
      { text: 'Speed = 360 ÷ 4 = 90 km/h.', scene: null },
      { text: 'Distance in 7 hours = 90 × 7 = 630 km ✓', scene: null },
    ],
  },
  {
    id: 'oly_04', skillId: 'olympiad', type: 'math', difficulty: 680,
    prompt: 'What is the LCM of 12 and 18?',
    answer: 36,
    stepSolution: [
      { text: 'Prime factors: 12 = 2² × 3, 18 = 2 × 3².', scene: null },
      { text: 'LCM = 2² × 3² = 4 × 9 = 36 ✓', scene: null },
    ],
  },
  {
    id: 'oly_05', skillId: 'olympiad', type: 'math', difficulty: 720,
    prompt: 'In a right triangle, the two legs are 5 and 12. What is the length of the hypotenuse?',
    wordProblem: true,
    answer: 13,
    stepSolution: [
      { text: 'Use the Pythagorean theorem: a² + b² = c².', scene: null },
      { text: '5² + 12² = 25 + 144 = 169.', scene: null },
      { text: '√169 = 13. Hypotenuse = 13 ✓', scene: null },
    ],
  },
  {
    id: 'oly_06', skillId: 'olympiad', type: 'math', difficulty: 760,
    prompt: 'How many prime numbers are there between 1 and 30?',
    answer: 10,
    stepSolution: [
      { text: 'Primes between 1 and 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.', scene: null },
      { text: 'Count = 10 ✓', scene: null },
    ],
  },
  {
    id: 'oly_07', skillId: 'olympiad', type: 'math', difficulty: 800,
    prompt: 'Aarav is 3 times as old as Priya. In 6 years, Aarav will be twice as old as Priya. How old is Aarav now?',
    wordProblem: true,
    answer: 18,
    stepSolution: [
      { text: 'Let Priya\'s age = p. Aarav\'s age = 3p.', scene: null },
      { text: 'In 6 years: 3p + 6 = 2(p + 6).', scene: null },
      { text: '3p + 6 = 2p + 12 → p = 6.', scene: null },
      { text: 'Aarav = 3 × 6 = 18 ✓', scene: null },
    ],
  },
  {
    id: 'oly_08', skillId: 'olympiad', type: 'math', difficulty: 840,
    prompt: 'What is the sum of the first 10 positive odd numbers?',
    answer: 100,
    stepSolution: [
      { text: 'First 10 odd numbers: 1,3,5,7,9,11,13,15,17,19.', scene: null },
      { text: 'Formula: the sum of first n odd numbers = n².', scene: null },
      { text: '10² = 100 ✓', scene: null },
    ],
  },

  // ═══════════ VOCABULARY (English) ═══════════
  {
    id: 'voc_01', skillId: 'vocabulary', type: 'mcq', difficulty: 180,
    prompt: 'What does the word "enormous" mean?',
    choices: ['Very tiny', 'Very large', 'Very cold', 'Very fast'],
    correctIdx: 1,
    hint: 'An elephant is enormous!',
    misconception: 'confuses_size_words',
  },
  {
    id: 'voc_02', skillId: 'vocabulary', type: 'mcq', difficulty: 240,
    prompt: 'What does "curious" mean?',
    choices: ['Bored', 'Angry', 'Eager to learn or know', 'Tired'],
    correctIdx: 2,
    hint: 'A curious cat always explores new things.',
    misconception: 'confuses_emotions',
  },
  {
    id: 'voc_03', skillId: 'vocabulary', type: 'mcq', difficulty: 310,
    prompt: 'Choose the word that means the OPPOSITE of "ancient".',
    choices: ['Old', 'Modern', 'Historical', 'Ruined'],
    correctIdx: 1,
    hint: 'Ancient = very old. The opposite = ?',
    misconception: 'confuses_antonyms',
  },
  {
    id: 'voc_04', skillId: 'vocabulary', type: 'mcq', difficulty: 380,
    prompt: 'The lion was "ferocious". What does ferocious mean?',
    choices: ['Playful', 'Friendly', 'Savage and violent', 'Lazy'],
    correctIdx: 2,
    hint: 'A ferocious animal would scare you!',
    misconception: 'confuses_animal_traits',
  },
  {
    id: 'voc_05', skillId: 'vocabulary', type: 'mcq', difficulty: 450,
    prompt: 'What does "persevere" mean?',
    choices: ['Give up easily', 'Continue trying despite difficulty', 'Move quickly', 'Forget something'],
    correctIdx: 1,
    hint: 'Athletes must persevere through hard training.',
    misconception: 'confuses_effort_words',
  },
  {
    id: 'voc_06', skillId: 'vocabulary', type: 'mcq', difficulty: 520,
    prompt: 'Which sentence uses the word "transparent" correctly?',
    choices: [
      'The transparent rock blocked all light.',
      'She wore a transparent scarf you could see through.',
      'The transparent box was completely opaque.',
      'He felt transparent after eating dinner.',
    ],
    correctIdx: 1,
    hint: 'Transparent means you can see through it, like glass.',
    misconception: 'confuses_transparency',
  },

  // ═══════════ GRAMMAR ═══════════
  {
    id: 'gram_01', skillId: 'grammar', type: 'mcq', difficulty: 180,
    prompt: 'Which word is a noun in: "The quick brown fox jumps."?',
    choices: ['Quick', 'Brown', 'Fox', 'Jumps'],
    correctIdx: 2,
    hint: 'A noun is a person, place, or thing.',
    misconception: 'confuses_parts_of_speech',
  },
  {
    id: 'gram_02', skillId: 'grammar', type: 'mcq', difficulty: 250,
    prompt: 'Which sentence is grammatically correct?',
    choices: [
      'She don\'t like apples.',
      'They is going to school.',
      'He doesn\'t play football.',
      'We was happy yesterday.',
    ],
    correctIdx: 2,
    hint: 'Subject-verb agreement: "He" pairs with "doesn\'t".',
    misconception: 'subject_verb_agreement',
  },
  {
    id: 'gram_03', skillId: 'grammar', type: 'mcq', difficulty: 320,
    prompt: 'Which is the correct plural of "child"?',
    choices: ['Childs', 'Childes', 'Children', 'Childrens'],
    correctIdx: 2,
    hint: 'This is an irregular plural — it doesn\'t just add -s.',
    misconception: 'irregular_plurals',
  },
  {
    id: 'gram_04', skillId: 'grammar', type: 'mcq', difficulty: 390,
    prompt: 'Which word is an ADJECTIVE in: "The clever scientist discovered a new planet."?',
    choices: ['Scientist', 'Discovered', 'Clever', 'Planet'],
    correctIdx: 2,
    hint: 'Adjectives describe nouns — what kind of scientist?',
    misconception: 'confuses_parts_of_speech',
  },
  {
    id: 'gram_05', skillId: 'grammar', type: 'mcq', difficulty: 460,
    prompt: 'Choose the correct sentence:',
    choices: [
      'Its raining outside today.',
      'It\'s raining outside today.',
      'Its\' raining outside today.',
      'It raining outside today.',
    ],
    correctIdx: 1,
    hint: '"It\'s" = "it is". "Its" is possessive (the dog chased its tail).',
    misconception: 'its_vs_its',
  },

  // ═══════════ READING COMPREHENSION ═══════════
  {
    id: 'read_01', skillId: 'reading', type: 'mcq', difficulty: 250,
    prompt: 'Read: "Maya planted seeds in the spring. By summer, tall sunflowers bloomed in her garden." — Why did the sunflowers bloom in summer?',
    choices: [
      'Maya watered them every hour.',
      'She planted seeds in spring, giving them time to grow.',
      'Sunflowers only grow in winter.',
      'A friend helped Maya plant them.',
    ],
    correctIdx: 1,
    hint: 'Think about cause and effect — what happened first?',
    misconception: 'misreads_sequence',
  },
  {
    id: 'read_02', skillId: 'reading', type: 'mcq', difficulty: 350,
    prompt: 'Read: "The astronaut floated in zero gravity, gazing at the blue marble below — Earth, so small from here, yet home." — What does "blue marble" refer to?',
    choices: ['A toy the astronaut brought', 'Earth seen from space', 'The space station\'s window', 'Jupiter'],
    correctIdx: 1,
    hint: 'The passage says "Earth, so small from here".',
    misconception: 'misreads_metaphor',
  },
  {
    id: 'read_03', skillId: 'reading', type: 'mcq', difficulty: 430,
    prompt: 'Read: "Despite the heavy rain, the school play went ahead. The children had rehearsed for six weeks and refused to cancel." — What shows the children\'s determination?',
    choices: [
      'They had umbrellas.',
      'They cancelled because of rain.',
      'They rehearsed for six weeks and refused to cancel.',
      'The teacher made them perform.',
    ],
    correctIdx: 2,
    hint: 'Find the evidence in the text.',
    misconception: 'misreads_inference',
  },
  {
    id: 'read_04', skillId: 'reading', type: 'mcq', difficulty: 510,
    prompt: 'Read: "The fox, known for cunning, waited patiently for the crow to drop its cheese. When the crow began to sing, the cheese fell — and the fox snatched it away." — What is the moral?',
    choices: [
      'Crows should not eat cheese.',
      'Patience always wins.',
      'Flattery can trick the unwary into losing what they value.',
      'Foxes are faster than crows.',
    ],
    correctIdx: 2,
    hint: 'Why did the fox praise the crow\'s singing?',
    misconception: 'misreads_moral',
  },

  // ═══════════ IDIOMS ═══════════
  {
    id: 'idiom_01', skillId: 'idioms', type: 'mcq', difficulty: 200,
    prompt: 'What does "It\'s raining cats and dogs" mean?',
    choices: [
      'Animals are falling from the sky.',
      'It is raining very heavily.',
      'The weather is pleasant.',
      'Cats and dogs are fighting.',
    ],
    correctIdx: 1,
    hint: 'This is a phrase — don\'t take it literally!',
    misconception: 'takes_idiom_literally',
  },
  {
    id: 'idiom_02', skillId: 'idioms', type: 'mcq', difficulty: 300,
    prompt: 'What does "hit the books" mean?',
    choices: [
      'Throw books on the floor.',
      'Start studying hard.',
      'Visit a library.',
      'Buy new textbooks.',
    ],
    correctIdx: 1,
    hint: 'Students "hit the books" before an exam.',
    misconception: 'takes_idiom_literally',
  },
  {
    id: 'idiom_03', skillId: 'idioms', type: 'mcq', difficulty: 400,
    prompt: 'What does "bite off more than you can chew" mean?',
    choices: [
      'Eat a very large meal.',
      'Take on more responsibility than you can handle.',
      'Chew food carefully.',
      'Talk too much.',
    ],
    correctIdx: 1,
    hint: 'Think about biting off a piece that\'s too big to manage.',
    misconception: 'takes_idiom_literally',
  },
  {
    id: 'idiom_04', skillId: 'idioms', type: 'mcq', difficulty: 480,
    prompt: 'In the sentence: "She let the cat out of the bag at the party," what happened?',
    choices: [
      'A cat escaped from a bag.',
      'She accidentally revealed a secret.',
      'She brought a cat to the party.',
      'She gave a gift.',
    ],
    correctIdx: 1,
    hint: 'To "let the cat out of the bag" means to reveal something that was secret.',
    misconception: 'takes_idiom_literally',
  },

  // ═══════════ SPELLING ═══════════
  {
    id: 'spell_01', skillId: 'spelling', type: 'mcq', difficulty: 180,
    prompt: 'Which spelling is CORRECT?',
    choices: ['Recieve', 'Receive', 'Receve', 'Receeve'],
    correctIdx: 1,
    hint: 'Remember: "i before e, except after c".',
    misconception: 'ie_ei_confusion',
  },
  {
    id: 'spell_02', skillId: 'spelling', type: 'mcq', difficulty: 260,
    prompt: 'Which word is spelled CORRECTLY?',
    choices: ['Beleive', 'Belive', 'Believe', 'Beleave'],
    correctIdx: 2,
    hint: 'Think: be-LIEVE.',
    misconception: 'ie_ei_confusion',
  },
  {
    id: 'spell_03', skillId: 'spelling', type: 'mcq', difficulty: 340,
    prompt: 'Which word is spelled CORRECTLY?',
    choices: ['Necessary', 'Necesary', 'Neccessary', 'Necessery'],
    correctIdx: 0,
    hint: 'One collar (c), two socks (s): necessary.',
    misconception: 'double_consonant_confusion',
  },
  {
    id: 'spell_04', skillId: 'spelling', type: 'mcq', difficulty: 420,
    prompt: 'Choose the correct spelling:',
    choices: ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'],
    correctIdx: 1,
    hint: 'Two c\'s and two m\'s: accommodate.',
    misconception: 'double_consonant_confusion',
  },
  {
    id: 'spell_05', skillId: 'spelling', type: 'mcq', difficulty: 490,
    prompt: 'Which is the correct spelling?',
    choices: ['Seperate', 'Separate', 'Separete', 'Seperrate'],
    correctIdx: 1,
    hint: '"There\'s a rat in separate."',
    misconception: 'vowel_confusion',
  },

  // ═══════════ BIOLOGY (Science) ═══════════
  {
    id: 'bio_01', skillId: 'biology', type: 'mcq', difficulty: 180,
    prompt: 'Which part of the plant makes food using sunlight?',
    choices: ['Roots', 'Stem', 'Leaves', 'Flowers'],
    correctIdx: 2,
    hint: 'The green part of the plant captures sunlight.',
    misconception: 'confuses_plant_parts',
  },
  {
    id: 'bio_02', skillId: 'biology', type: 'mcq', difficulty: 260,
    prompt: 'What do red blood cells carry around the body?',
    choices: ['Food', 'Oxygen', 'Water', 'Carbon dioxide only'],
    correctIdx: 1,
    hint: 'Red blood cells are like tiny oxygen delivery trucks.',
    misconception: 'confuses_blood_function',
  },
  {
    id: 'bio_03', skillId: 'biology', type: 'mcq', difficulty: 340,
    prompt: 'Which organ pumps blood through your body?',
    choices: ['Lungs', 'Brain', 'Heart', 'Kidneys'],
    correctIdx: 2,
    hint: 'You can feel it beating in your chest.',
    misconception: 'confuses_organs',
  },
  {
    id: 'bio_04', skillId: 'biology', type: 'mcq', difficulty: 420,
    prompt: 'What is the process by which plants make food from sunlight called?',
    choices: ['Respiration', 'Photosynthesis', 'Germination', 'Pollination'],
    correctIdx: 1,
    hint: '"Photo" = light. Plants use light to synthesize food.',
    misconception: 'confuses_plant_processes',
  },
  {
    id: 'bio_05', skillId: 'biology', type: 'mcq', difficulty: 500,
    prompt: 'In the food chain: Grass → Grasshopper → Frog → Snake → Eagle. What is the PRODUCER?',
    choices: ['Grasshopper', 'Frog', 'Grass', 'Eagle'],
    correctIdx: 2,
    hint: 'Producers make their own food — usually plants.',
    misconception: 'confuses_food_chain_roles',
  },
  {
    id: 'bio_06', skillId: 'biology', type: 'mcq', difficulty: 580,
    prompt: 'What does DNA stand for?',
    choices: [
      'Deoxyribonucleic Acid',
      'Dioxynucleic Acid',
      'Deoxyribose Nuclease Activator',
      'Dynamic Nucleic Array',
    ],
    correctIdx: 0,
    hint: 'DNA is the blueprint of life stored in every cell.',
    misconception: 'science_acronym_confusion',
  },

  // ═══════════ PHYSICS ═══════════
  {
    id: 'phys_01', skillId: 'physics', type: 'mcq', difficulty: 180,
    prompt: 'What force pulls objects toward the ground?',
    choices: ['Magnetism', 'Gravity', 'Friction', 'Buoyancy'],
    correctIdx: 1,
    hint: 'This force keeps planets in orbit and makes apples fall.',
    misconception: 'confuses_forces',
  },
  {
    id: 'phys_02', skillId: 'physics', type: 'mcq', difficulty: 260,
    prompt: 'A ball rolls and slows down on a carpet. What force is slowing it?',
    choices: ['Gravity', 'Air resistance', 'Friction', 'Inertia'],
    correctIdx: 2,
    hint: 'This force acts between two surfaces in contact.',
    misconception: 'confuses_forces',
  },
  {
    id: 'phys_03', skillId: 'physics', type: 'mcq', difficulty: 340,
    prompt: 'What type of simple machine is a see-saw?',
    choices: ['Pulley', 'Lever', 'Wheel and axle', 'Inclined plane'],
    correctIdx: 1,
    hint: 'A see-saw has a pivot point (fulcrum).',
    misconception: 'confuses_simple_machines',
  },
  {
    id: 'phys_04', skillId: 'physics', type: 'mcq', difficulty: 430,
    prompt: 'Which statement about speed is correct?',
    choices: [
      'Speed = distance ÷ time.',
      'Speed = time × distance.',
      'Speed = force × mass.',
      'Speed = distance + time.',
    ],
    correctIdx: 0,
    hint: 'If you travel 60 km in 1 hour, your speed is 60 km/h.',
    misconception: 'confuses_physics_formulas',
  },
  {
    id: 'phys_05', skillId: 'physics', type: 'mcq', difficulty: 510,
    prompt: 'Which of these is NOT a form of energy?',
    choices: ['Heat', 'Light', 'Mass', 'Sound'],
    correctIdx: 2,
    hint: 'Mass is a measure of matter, not a form of energy itself.',
    misconception: 'confuses_energy_forms',
  },

  // ═══════════ CHEMISTRY ═══════════
  {
    id: 'chem_01', skillId: 'chemistry', type: 'mcq', difficulty: 180,
    prompt: 'Which state of matter has a definite shape and volume?',
    choices: ['Gas', 'Liquid', 'Solid', 'Plasma'],
    correctIdx: 2,
    hint: 'A rock keeps its shape — it doesn\'t pour or float away.',
    misconception: 'confuses_states_of_matter',
  },
  {
    id: 'chem_02', skillId: 'chemistry', type: 'mcq', difficulty: 260,
    prompt: 'When water freezes, it changes from liquid to ___.',
    choices: ['Gas', 'Solid', 'Plasma', 'Mixture'],
    correctIdx: 1,
    hint: 'Ice is frozen water.',
    misconception: 'confuses_phase_transitions',
  },
  {
    id: 'chem_03', skillId: 'chemistry', type: 'mcq', difficulty: 340,
    prompt: 'Which of the following is a MIXTURE?',
    choices: ['Water (H₂O)', 'Saltwater', 'Table salt (NaCl)', 'Oxygen (O₂)'],
    correctIdx: 1,
    hint: 'A mixture is made of two or more things that can be separated.',
    misconception: 'confuses_mixture_compound',
  },
  {
    id: 'chem_04', skillId: 'chemistry', type: 'mcq', difficulty: 420,
    prompt: 'What happens to sugar when it dissolves in water?',
    choices: [
      'It disappears forever.',
      'It becomes part of a solution — still there but invisible.',
      'It turns into gas.',
      'It becomes salt.',
    ],
    correctIdx: 1,
    hint: 'The sweet taste of the water proves the sugar is still there.',
    misconception: 'confuses_dissolving',
  },
  {
    id: 'chem_05', skillId: 'chemistry', type: 'mcq', difficulty: 500,
    prompt: 'What is the chemical symbol for water?',
    choices: ['HO', 'H₂O', 'H₃O', 'OH₂'],
    correctIdx: 1,
    hint: 'Water has 2 hydrogen atoms and 1 oxygen atom.',
    misconception: 'confuses_chemical_formulas',
  },
  {
    id: 'chem_06', skillId: 'chemistry', type: 'mcq', difficulty: 580,
    prompt: 'A metal nail in vinegar starts to bubble and turns orange-red. What type of change is this?',
    choices: [
      'Physical change — it can be reversed.',
      'Chemical change — a new substance forms (rust).',
      'Nuclear change.',
      'State change.',
    ],
    correctIdx: 1,
    hint: 'Rust (iron oxide) is a completely new substance.',
    misconception: 'confuses_physical_chemical_change',
  },

  // ═══════════ SPACE ═══════════
  {
    id: 'space_01', skillId: 'space', type: 'mcq', difficulty: 180,
    prompt: 'How many planets are in our solar system?',
    choices: ['7', '8', '9', '10'],
    correctIdx: 1,
    hint: 'Pluto was reclassified as a dwarf planet in 2006.',
    misconception: 'outdated_planet_count',
  },
  {
    id: 'space_02', skillId: 'space', type: 'mcq', difficulty: 260,
    prompt: 'Which planet is known as the Red Planet?',
    choices: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctIdx: 1,
    hint: 'Its red color comes from iron oxide (rust) in its soil.',
    misconception: 'confuses_planets',
  },
  {
    id: 'space_03', skillId: 'space', type: 'mcq', difficulty: 340,
    prompt: 'What is the correct order from the Sun? (closest to farthest)',
    choices: [
      'Mercury, Venus, Earth, Mars',
      'Venus, Mercury, Earth, Mars',
      'Earth, Mercury, Venus, Mars',
      'Mercury, Earth, Venus, Mars',
    ],
    correctIdx: 0,
    hint: 'My Very Educated Mother Just Served Us Nachos.',
    misconception: 'confuses_planet_order',
  },
  {
    id: 'space_04', skillId: 'space', type: 'mcq', difficulty: 420,
    prompt: 'What is a light-year?',
    choices: [
      'The time light takes to travel for one year.',
      'The distance light travels in one year.',
      'A measurement of how bright a star is.',
      'One million kilometres.',
    ],
    correctIdx: 1,
    hint: 'A light-year is a distance, not a time.',
    misconception: 'confuses_lightyear',
  },
  {
    id: 'space_05', skillId: 'space', type: 'mcq', difficulty: 510,
    prompt: 'What causes a solar eclipse?',
    choices: [
      'Earth passes between the Sun and Moon.',
      'The Moon passes between Earth and the Sun.',
      'Earth\'s shadow falls on the Moon.',
      'The Sun temporarily dims.',
    ],
    correctIdx: 1,
    hint: 'During a solar eclipse, the Moon blocks the Sun\'s light.',
    misconception: 'confuses_eclipse_types',
  },

  // ═══════════ EARTH SCIENCE ═══════════
  {
    id: 'earth_01', skillId: 'earth', type: 'mcq', difficulty: 180,
    prompt: 'Which cloud type is associated with thunderstorms?',
    choices: ['Cirrus', 'Stratus', 'Cumulus', 'Cumulonimbus'],
    correctIdx: 3,
    hint: '"Nimbus" means rain — cumulonimbus = giant storm cloud.',
    misconception: 'confuses_cloud_types',
  },
  {
    id: 'earth_02', skillId: 'earth', type: 'mcq', difficulty: 270,
    prompt: 'What do we call the protective layer of gas around Earth?',
    choices: ['Stratosphere', 'Ozone layer', 'Atmosphere', 'Hydrosphere'],
    correctIdx: 2,
    hint: 'All the air around our planet = the atmosphere.',
    misconception: 'confuses_earth_layers',
  },
  {
    id: 'earth_03', skillId: 'earth', type: 'mcq', difficulty: 350,
    prompt: 'Which type of rock is formed from cooling lava?',
    choices: ['Sedimentary', 'Metamorphic', 'Igneous', 'Chalk'],
    correctIdx: 2,
    hint: '"Igneous" comes from the Latin word for fire.',
    misconception: 'confuses_rock_types',
  },
  {
    id: 'earth_04', skillId: 'earth', type: 'mcq', difficulty: 430,
    prompt: 'What is the water cycle? Which list shows the CORRECT steps?',
    choices: [
      'Evaporation → Condensation → Precipitation → Collection',
      'Rain → Clouds → Rivers → Evaporation',
      'Condensation → Evaporation → Collection → Rain',
      'Collection → Rain → Clouds → Condensation',
    ],
    correctIdx: 0,
    hint: 'Water evaporates up, condenses into clouds, then falls as rain (precipitation).',
    misconception: 'confuses_water_cycle_order',
  },
  {
    id: 'earth_05', skillId: 'earth', type: 'mcq', difficulty: 520,
    prompt: 'What causes earthquakes?',
    choices: [
      'Heavy rainfall weakening the ground.',
      'Volcanic gas building up underground.',
      'Movement of tectonic plates.',
      'The Moon\'s gravitational pull.',
    ],
    correctIdx: 2,
    hint: 'Earth\'s crust is made of giant puzzle pieces called tectonic plates.',
    misconception: 'confuses_earthquake_cause',
  },
];

// ── Lookup maps ──────────────────────────────────────────────────────────────
const PROBLEMS_BY_SKILL_GQ = {};
for (const p of PROBLEMS_GQ) {
  if (!PROBLEMS_BY_SKILL_GQ[p.skillId]) PROBLEMS_BY_SKILL_GQ[p.skillId] = [];
  PROBLEMS_BY_SKILL_GQ[p.skillId].push(p);
}

const SKILL_LIST_GQ = Object.values(SKILLS_GQ);
const MATH_SKILLS_GQ   = SKILL_LIST_GQ.filter(s => s.hall === 'math');
const ENG_SKILLS_GQ    = SKILL_LIST_GQ.filter(s => s.hall === 'english');
const SCI_SKILLS_GQ    = SKILL_LIST_GQ.filter(s => s.hall === 'science');
