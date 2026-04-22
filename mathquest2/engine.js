// MathQuest 2 — Adaptive engine with multi-axis difficulty + trap analytics
//
// Three independent rating axes per child:
//   - per-skill MATH rating (the Elo rating from V1, but per skill)
//   - global READING rating (how dense/long a problem can be)
//   - global STEPS rating (how many sub-steps the child can hold in working memory)
//
// Problem selection finds problems whose three difficulties are within bands
// of the child's three current ratings. We don't max all three at once —
// we let the engine push the axis the child has the most headroom on.
//
// Trap analytics: every wrong answer is tagged with the misconception of
// the chosen distractor. We aggregate these and bias future selection toward
// problems that target the child's most-frequent misconception.

const ENGINE_V2 = {
  K_BASE: 32,
  K_NEW: 48,
  K_STABLE: 16,
  INITIAL_MATH: 200,
  INITIAL_READING: 250,
  INITIAL_STEPS: 200,
  MIN: 50, MAX: 950,
  MASTERY_MIN_ATTEMPTS: 10,
  MASTERY_LAST_N: 8,
  MASTERY_LAST_N_CORRECT: 6,
  DEMO_SINGLE_SESSION_MASTERY: true,
  TRAP_BIAS_WEIGHT: 2.5,         // multiplier when problem targets a top misconception
  AXIS_PUSH_HEADROOM: 100,       // push the axis with most room first
};

const STORAGE_KEY_V2 = 'mathquest2_profile_v1';

function newProfileV2() {
  return {
    childId: 'kid2_' + Math.random().toString(36).slice(2, 8),
    createdAt: Date.now(),
    xp: 0,
    gems: 0,
    storyCards: [],
    chaptersRestored: {},   // realmId → fragment index (next to reveal)
    readingRating: ENGINE_V2.INITIAL_READING,
    stepsRating: ENGINE_V2.INITIAL_STEPS,
    skills: {},              // skillId → { rating, attempts, mastered, ... }
    misconceptions: {},      // skillId → { misconceptionId → count }
    misconceptionsRecent: [],// last 30 wrongs, FIFO
    seenProblems: {},        // problemId → timestamps[]
    questStars: {},          // questId → bestStars
    sessions: [],
    promotedSkills: [],      // for cutscene de-dup
  };
}

function ensureSkillV2(profile, skillId) {
  if (!profile.skills[skillId]) {
    profile.skills[skillId] = {
      skillId,
      rating: ENGINE_V2.INITIAL_MATH,
      attempts: 0,
      correctTotal: 0,
      lastAnswers: [],
      lastResponses: [],
      mastered: false,
      masteredAt: null,
    };
  }
  if (!profile.misconceptions[skillId]) profile.misconceptions[skillId] = {};
  return profile.skills[skillId];
}

function loadProfileV2() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return newProfileV2();
}
function saveProfileV2(p) { try { localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(p)); } catch (e) {} }
function resetProfileV2() { localStorage.removeItem(STORAGE_KEY_V2); }

function expectedScoreV2(rating, difficulty) {
  return 1 / (1 + Math.pow(10, (difficulty - rating) / 400));
}

function pickKV2(skill, correct, ms) {
  if (skill.attempts < 5) return ENGINE_V2.K_NEW;
  if (skill.attempts > 30) return ENGINE_V2.K_STABLE;
  if (!correct && ms < 1500) return 8; // probably misclick
  return ENGINE_V2.K_BASE;
}

// Compute target difficulties for the next problem
function computeTargets(profile, skillId) {
  const skill = ensureSkillV2(profile, skillId);
  return {
    math: skill.rating + 50,
    reading: profile.readingRating + 30,
    steps: profile.stepsRating + 40,
  };
}

// Score a candidate problem against targets — lower is better
function scoreCandidate(profile, problem, targets, topMisconceptions) {
  const dMath = problem.math - targets.math;
  const dRead = problem.reading - targets.reading;
  const dSteps = problem.steps * 100 - targets.steps; // steps stored as small int

  // Don't push more than +200 over current on any axis
  if (dMath > 200 || dRead > 200 || dSteps > 200) return Infinity;
  // Don't drop too far below either (boring)
  if (dMath < -250 && dRead < -250) return Infinity;

  let score = Math.abs(dMath) + Math.abs(dRead) * 0.7 + Math.abs(dSteps) * 0.6;

  // Trap targeting: if problem has a distractor matching child's top misconception, boost it
  if (topMisconceptions.length && problem.distractors) {
    const targeted = problem.distractors.some(d =>
      topMisconceptions.includes(d.misconception)
    );
    if (targeted) score /= ENGINE_V2.TRAP_BIAS_WEIGHT;
  }

  // Recency penalty
  const seen = profile.seenProblems[problem.id] || [];
  const lastSeen = seen[seen.length - 1] || 0;
  const minutesAgo = (Date.now() - lastSeen) / 60000;
  if (minutesAgo < 30) score += 500;
  else if (minutesAgo < 240) score += 100;

  return score;
}

function topMisconceptions(profile, skillId, k = 2) {
  const m = profile.misconceptions[skillId] || {};
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([id]) => id);
}

// Choose the next problem from a candidate pool (e.g. all in-quest problems)
function selectNextProblem(profile, skillId, pool) {
  const targets = computeTargets(profile, skillId);
  const tops = topMisconceptions(profile, skillId);
  let best = null, bestScore = Infinity;
  pool.forEach(p => {
    const s = scoreCandidate(profile, p, targets, tops);
    if (s < bestScore) { bestScore = s; best = p; }
  });
  return best || pool[0];
}

function recordAnswerV2(profile, problem, choice, responseMs, sessionId) {
  const skill = ensureSkillV2(profile, problem.skillId);
  const correct = choice.isCorrect;
  const exp = expectedScoreV2(skill.rating, problem.math);
  const k = pickKV2(skill, correct, responseMs);
  const actual = correct ? 1 : 0;

  // Math rating
  skill.rating = clamp(skill.rating + k * (actual - exp), ENGINE_V2.MIN, ENGINE_V2.MAX);

  // Reading rating — moves more slowly, weighted by reading difficulty of problem
  const readExp = expectedScoreV2(profile.readingRating, problem.reading);
  profile.readingRating = clamp(
    profile.readingRating + 16 * (actual - readExp),
    ENGINE_V2.MIN, ENGINE_V2.MAX
  );

  // Steps rating
  const stepsDifficulty = problem.steps * 100;
  const stepsExp = expectedScoreV2(profile.stepsRating, stepsDifficulty);
  profile.stepsRating = clamp(
    profile.stepsRating + 16 * (actual - stepsExp),
    ENGINE_V2.MIN, ENGINE_V2.MAX
  );

  skill.attempts += 1;
  if (correct) skill.correctTotal += 1;
  skill.lastAnswers.push(correct);
  skill.lastResponses.push(responseMs);
  if (skill.lastAnswers.length > 20) skill.lastAnswers.shift();
  if (skill.lastResponses.length > 20) skill.lastResponses.shift();

  // Trap analytics
  if (!correct && choice.misconception) {
    const m = profile.misconceptions[problem.skillId];
    m[choice.misconception] = (m[choice.misconception] || 0) + 1;
    profile.misconceptionsRecent.push({
      skillId: problem.skillId,
      misconception: choice.misconception,
      problemId: problem.id,
      t: Date.now(),
    });
    if (profile.misconceptionsRecent.length > 30) {
      profile.misconceptionsRecent.shift();
    }
  } else if (correct) {
    // gentle decay: when correct, reduce most-frequent misconception count by 1
    const m = profile.misconceptions[problem.skillId];
    const top = topMisconceptions(profile, problem.skillId, 1)[0];
    if (top && m[top]) {
      m[top] = Math.max(0, m[top] - 1);
      if (m[top] === 0) delete m[top];
    }
  }

  // Seen log
  if (!profile.seenProblems[problem.id]) profile.seenProblems[problem.id] = [];
  profile.seenProblems[problem.id].push(Date.now());
  if (profile.seenProblems[problem.id].length > 5) profile.seenProblems[problem.id].shift();

  checkMasteryV2(profile, skill);
  saveProfileV2(profile);

  return { skill, masteredNow: skill.mastered && skill.masteredAt > Date.now() - 5000 };
}

function checkMasteryV2(profile, skill) {
  if (skill.mastered) return;
  const def = SKILLS_V2[skill.skillId];
  if (!def) return;
  if (skill.attempts < ENGINE_V2.MASTERY_MIN_ATTEMPTS) return;
  if (skill.rating < def.masteryThreshold) return;
  const lastN = skill.lastAnswers.slice(-ENGINE_V2.MASTERY_LAST_N);
  const cN = lastN.filter(Boolean).length;
  if (cN < ENGINE_V2.MASTERY_LAST_N_CORRECT) return;
  skill.mastered = true;
  skill.masteredAt = Date.now();
}

// Quest scoring → 0-3 stars
function scoreQuest(stats) {
  const pct = stats.correct / stats.total;
  if (pct >= 0.95) return 3;
  if (pct >= 0.8) return 3;
  if (pct >= 0.65) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// Realm unlocks
function updateRealmUnlocks(profile, realms) {
  realms.forEach(r => {
    if (r.unlocked) return;
    const reqs = r.requires || [];
    if (reqs.every(s => profile.skills[s] && profile.skills[s].mastered)) {
      r.unlocked = true;
    }
  });
}

// Get human-readable misconception summary for parent dashboard
function getTopMisconceptionsAcrossSkills(profile, k = 5) {
  const all = [];
  Object.entries(profile.misconceptions).forEach(([skillId, ms]) => {
    Object.entries(ms).forEach(([mid, count]) => {
      all.push({ skillId, misconception: mid, count });
    });
  });
  return all.sort((a, b) => b.count - a.count).slice(0, k);
}
