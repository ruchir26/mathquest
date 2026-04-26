// CardQuest — Math puzzle bank with adaptive selection.
// Skills used:
//   add_basic, sub_basic, mult_basic, div_basic, ratio_basic, frac_basic

const SKILLS = {
  add_basic:   { name: 'Addition' },
  sub_basic:   { name: 'Subtraction' },
  mult_basic:  { name: 'Multiplication' },
  div_basic:   { name: 'Division' },
  ratio_basic: { name: 'Ratios' },
  frac_basic:  { name: 'Fractions' },
};

function randInt(lo, hi) { return Math.floor(Math.random() * (hi - lo + 1)) + lo; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build 4 multiple-choice options with one correct answer
function buildChoices(correctAnswer, range = 5) {
  const choices = new Set([correctAnswer]);
  let guard = 50;
  while (choices.size < 4 && guard--) {
    const offset = randInt(-range, range);
    if (offset === 0) continue;
    const v = correctAnswer + offset;
    if (v >= 0) choices.add(v);
  }
  while (choices.size < 4) choices.add(randInt(0, correctAnswer + 10));
  return shuffle([...choices]).map(v => ({
    label: String(v),
    value: v,
    isCorrect: v === correctAnswer,
  }));
}

// Generate a puzzle for a skill at a target difficulty band (0..1000)
function generatePuzzle(skillId, rating) {
  const r = rating || 200;
  switch (skillId) {
    case 'add_basic': {
      const max = Math.min(50, 5 + Math.floor(r / 20));
      const a = randInt(1, max), b = randInt(1, max);
      return { skillId, question: `${a} + ${b} = ?`, answer: a + b, difficulty: r, choices: buildChoices(a + b, 4) };
    }
    case 'sub_basic': {
      const max = Math.min(50, 5 + Math.floor(r / 20));
      const a = randInt(2, max), b = randInt(1, a);
      return { skillId, question: `${a} − ${b} = ?`, answer: a - b, difficulty: r, choices: buildChoices(a - b, 4) };
    }
    case 'mult_basic': {
      const max = Math.min(12, 3 + Math.floor(r / 60));
      const a = randInt(2, max), b = randInt(2, max);
      return { skillId, question: `${a} × ${b} = ?`, answer: a * b, difficulty: r, choices: buildChoices(a * b, 6) };
    }
    case 'div_basic': {
      const max = Math.min(12, 3 + Math.floor(r / 60));
      const b = randInt(2, max), q = randInt(2, max);
      const a = b * q;
      return { skillId, question: `${a} ÷ ${b} = ?`, answer: q, difficulty: r, choices: buildChoices(q, 4) };
    }
    case 'ratio_basic': {
      const k = randInt(2, 5);
      const small = randInt(2, 6);
      const big = small * k;
      const ask = randInt(1, 5);
      const ans = ask * k;
      return {
        skillId,
        question: `If ${small} commons = 1 rare, how many rares for ${big * ask / small} commons?`,
        answer: ans,
        difficulty: r,
        choices: buildChoices(ans, 3),
      };
    }
    case 'frac_basic': {
      const denoms = [2, 3, 4, 5, 6];
      const d = denoms[randInt(0, denoms.length - 1)];
      const total = d * randInt(2, 6);
      const ans = total / d;
      return {
        skillId,
        question: `What is 1/${d} of ${total}?`,
        answer: ans,
        difficulty: r,
        choices: buildChoices(ans, 4),
      };
    }
    default:
      return generatePuzzle('add_basic', r);
  }
}

// Convenience: pick a puzzle for the kid's current rating
function pickPuzzle(profile, skillId) {
  const rating = getRating(profile, skillId);
  return generatePuzzle(skillId, rating);
}

// Grade a chosen answer; returns { correct, severity }
// severity: 'right' (full power), 'half' (wrong, half power), 'cancel' (cancelled)
function gradeAnswer(puzzle, choiceValue, responseMs, profile) {
  const correct = choiceValue === puzzle.answer;
  recordAnswer(profile, puzzle.skillId, puzzle.difficulty, correct, responseMs || 3000);
  return { correct, severity: correct ? 'right' : 'half' };
}
