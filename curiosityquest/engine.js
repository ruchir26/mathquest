// CuriosityQuest — Adaptive engine
//
// Two rating axes per child:
//   - per-skill subject rating (Elo-lite — answering harder problems lifts it)
//   - global READING rating (controls how dense the prose can be in a question)
//
// Mastery: ≥10 attempts on the skill, ≥6/8 of the last answers correct,
// rating above the skill's threshold, last few responses within a fluency band.
//
// Misconception tags: each wrong choice carries a misconception id. We keep a
// running tally per skill so the parent dashboard can surface what's tripping
// the child up, and the selector biases toward problems that target their
// most-frequent misconceptions (so we re-teach them on purpose).
//
// Frustration recovery: 3 wrong in a row on the same skill drops difficulty
// 150 points and surfaces a hint chip on the next problem.

const ENGINE_CQ = {
  K_BASE: 32,
  INITIAL_SKILL: 250,
  INITIAL_READING: 280,
  MIN: 50, MAX: 950,
  MASTERY_MIN_ATTEMPTS: 8,
  MASTERY_LAST_N: 8,
  MASTERY_LAST_N_CORRECT: 6,
  TRAP_BIAS_WEIGHT: 2.0,
  FRUSTRATION_DROP: 150,
  FLUENCY_TARGET_MS: 14000,
  XP_PER_CORRECT: 8,
  SHARDS_PER_CORRECT: 2,
};

const STORAGE_KEY_CQ = 'curiosityquest_profile_v1';

function newProfileCQ() {
  return {
    childId: 'cq_' + Math.random().toString(36).slice(2, 8),
    createdAt: Date.now(),
    xp: 0,
    shards: 0,
    wonderCards: [],            // [{ id, islandId, title, text, ts }]
    readingRating: ENGINE_CQ.INITIAL_READING,
    skills: {},                 // skillId → { rating, attempts, correctTotal, lastAnswers, lastResponses, mastered, masteredAt, wrongStreak }
    misconceptions: {},         // skillId → { misconceptionId → count }
    seenProblems: {},           // problemId → ts[]
    questStars: {},             // questId → bestStars
    sessions: [],
  };
}

function loadProfileCQ() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CQ);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.skills) return p;
    }
  } catch (e) {}
  return newProfileCQ();
}
function saveProfileCQ(p) {
  try { localStorage.setItem(STORAGE_KEY_CQ, JSON.stringify(p)); } catch (e) {}
}
function resetProfileCQ() { localStorage.removeItem(STORAGE_KEY_CQ); }

function ensureSkillCQ(profile, skillId) {
  if (!profile.skills[skillId]) {
    profile.skills[skillId] = {
      skillId,
      rating: ENGINE_CQ.INITIAL_SKILL,
      attempts: 0,
      correctTotal: 0,
      lastAnswers: [],
      lastResponses: [],
      mastered: false,
      masteredAt: null,
      wrongStreak: 0,
    };
  }
  if (!profile.misconceptions[skillId]) profile.misconceptions[skillId] = {};
  return profile.skills[skillId];
}

// ----- Selector -----
// Pick the next problem from a skill's pool, near the child's rating, biased by
// (a) avoidance of recently-seen problems, (b) misconception targeting.
function pickProblemCQ(profile, skillId, pool, opts = {}) {
  if (!pool || !pool.length) return null;
  const skill = ensureSkillCQ(profile, skillId);
  let target = skill.rating;
  if (skill.wrongStreak >= 3) target = Math.max(ENGINE_CQ.MIN, target - ENGINE_CQ.FRUSTRATION_DROP);
  const reading = profile.readingRating;
  const topMisconceptions = topMisconceptionsCQ(profile, skillId, 3);

  let best = null, bestScore = -Infinity;
  pool.forEach(p => {
    // distance penalty (closer to target = better)
    const distSkill = Math.abs((p.difficulty || 300) - target);
    const distRead = Math.max(0, (p.readingLevel || 200) - reading); // reading too hard hurts
    let score = -distSkill - distRead * 0.6;
    // freshness bonus
    const seen = (profile.seenProblems[p.id] || []).length;
    score -= seen * 60;
    // misconception bias: any choice tagged with a top misconception → boost
    if (p.choices && topMisconceptions.length) {
      const hits = p.choices.filter(c => c.misconception && topMisconceptions.includes(c.misconception)).length;
      if (hits) score += hits * ENGINE_CQ.TRAP_BIAS_WEIGHT * 25;
    }
    // small jitter so ties don't always pick the same problem
    score += Math.random() * 8;
    if (score > bestScore) { bestScore = score; best = p; }
  });
  return best;
}

function topMisconceptionsCQ(profile, skillId, n) {
  const tally = profile.misconceptions[skillId] || {};
  return Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

// ----- Answer recording -----
function recordAnswerCQ(profile, skillId, problem, choiceIdx, responseMs) {
  const skill = ensureSkillCQ(profile, skillId);
  const choice = problem.choices && problem.choices[choiceIdx];
  const correct = !!(choice && choice.correct);
  // Elo-lite update: expected vs observed
  const problemR = problem.difficulty || 300;
  const expected = 1 / (1 + Math.pow(10, (problemR - skill.rating) / 200));
  const obs = correct ? 1 : 0;
  const k = ENGINE_CQ.K_BASE;
  skill.rating = clampCQ(skill.rating + k * (obs - expected));

  // global reading rating: nudge up only when correct, slightly
  if (correct) {
    profile.readingRating = clampCQ(profile.readingRating + 4);
  } else {
    profile.readingRating = clampCQ(profile.readingRating - 1);
  }

  skill.attempts += 1;
  if (correct) skill.correctTotal += 1;
  skill.lastAnswers.push(correct ? 1 : 0);
  if (skill.lastAnswers.length > 20) skill.lastAnswers.shift();
  skill.lastResponses.push(responseMs);
  if (skill.lastResponses.length > 8) skill.lastResponses.shift();
  skill.wrongStreak = correct ? 0 : (skill.wrongStreak + 1);

  // misconception tally
  if (!correct && choice && choice.misconception) {
    const mc = profile.misconceptions[skillId];
    mc[choice.misconception] = (mc[choice.misconception] || 0) + 1;
  }

  // seen
  const seen = profile.seenProblems[problem.id] || [];
  seen.push(Date.now());
  if (seen.length > 6) seen.shift();
  profile.seenProblems[problem.id] = seen;

  // mastery check
  if (!skill.mastered && checkMasteryCQ(skill, problem.skillId && SKILLS_CQ[problem.skillId])) {
    const def = SKILLS_CQ[skillId];
    if (def && skill.attempts >= ENGINE_CQ.MASTERY_MIN_ATTEMPTS && skill.rating >= (def.threshold || 600)) {
      skill.mastered = true;
      skill.masteredAt = Date.now();
    }
  }

  // rewards
  if (correct) {
    profile.xp += ENGINE_CQ.XP_PER_CORRECT;
    profile.shards += ENGINE_CQ.SHARDS_PER_CORRECT;
  }
  return { correct, expected, newRating: skill.rating };
}

function checkMasteryCQ(skill, skillDef) {
  const last = skill.lastAnswers.slice(-ENGINE_CQ.MASTERY_LAST_N);
  if (last.length < ENGINE_CQ.MASTERY_LAST_N) return false;
  const correct = last.reduce((a, b) => a + b, 0);
  if (correct < ENGINE_CQ.MASTERY_LAST_N_CORRECT) return false;
  // fluency (median response within target * 1.5)
  const resp = skill.lastResponses.slice().sort((a, b) => a - b);
  const median = resp[Math.floor(resp.length / 2)] || 0;
  if (median > ENGINE_CQ.FLUENCY_TARGET_MS * 1.5) return false;
  if (skillDef && skill.rating < (skillDef.threshold || 600)) return false;
  return true;
}

function clampCQ(v) {
  return Math.max(ENGINE_CQ.MIN, Math.min(ENGINE_CQ.MAX, v));
}

// ----- Quest scoring (stars 1-3) -----
function scoreQuestCQ(stats) {
  const acc = stats.correct / Math.max(1, stats.total);
  const avgMs = stats.totalMs / Math.max(1, stats.total);
  if (acc >= 0.9 && avgMs <= ENGINE_CQ.FLUENCY_TARGET_MS) return 3;
  if (acc >= 0.75) return 2;
  return 1;
}

// ----- Wonder card grant -----
function grantWonderCardCQ(profile, card) {
  if (!card) return;
  if (profile.wonderCards.find(c => c.id === card.id)) return;
  profile.wonderCards.push({ ...card, ts: Date.now() });
}
