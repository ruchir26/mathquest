// MathQuest — adaptive difficulty engine
// Elo-lite per skill, mastery gate, frustration recovery, persistence.

const ENGINE_CONFIG = {
  TARGET_SUCCESS_RATE: 0.82,
  DIFFICULTY_STRETCH: 50,
  FRUSTRATION_DROP: 150,
  K_BASE: 32,
  K_NEW_SKILL: 48,
  K_STABLE: 16,
  INITIAL_RATING: 200,
  MIN_DIFFICULTY: 50,
  MAX_DIFFICULTY: 900,
  LEVEL_QUESTIONS: 8,        // questions per level session
  MASTERY_MIN_ATTEMPTS: 12,  // relaxed from 15 for kid-sized sessions
  MASTERY_LAST_N: 8,
  MASTERY_LAST_N_CORRECT: 6,
  DEMO_SINGLE_SESSION_MASTERY: true, // skip the cross-day rule for MVP
};

const STORAGE_KEY = 'mathquest_profile_v1';

function newProfile() {
  return {
    childId: 'kid_' + Math.random().toString(36).slice(2, 8),
    createdAt: Date.now(),
    coins: 0,
    stars: 0,
    eggPieces: 0,
    creatures: [],
    skills: {},        // skillId → SkillState
    islandStars: {},   // islandId → bestStars (0-3)
    sessions: [],      // session ids
    log: [],           // recent answer events (capped)
  };
}

function ensureSkill(profile, skillId) {
  if (!profile.skills[skillId]) {
    profile.skills[skillId] = {
      skillId,
      rating: ENGINE_CONFIG.INITIAL_RATING,
      attempts: 0,
      correctTotal: 0,
      lastAnswers: [], // booleans
      lastResponses: [], // ms
      mastered: false,
      masteredAt: null,
      sessionsSeen: [],
    };
  }
  return profile.skills[skillId];
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return newProfile();
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {}
}

function resetProfile() {
  localStorage.removeItem(STORAGE_KEY);
}

// Elo expected probability
function expectedScore(rating, difficulty) {
  return 1 / (1 + Math.pow(10, (difficulty - rating) / 400));
}

function pickK(skill, responseMs, correct) {
  if (skill.attempts < 5) return ENGINE_CONFIG.K_NEW_SKILL;
  if (skill.attempts > 30) return ENGINE_CONFIG.K_STABLE;
  // Suspected misclick: very fast wrong → low K
  if (!correct && responseMs < 800) return 8;
  return ENGINE_CONFIG.K_BASE;
}

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a,b) => a-b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m-1] + s[m]) / 2;
}

// Compute target difficulty for the next question on this skill
function targetDifficulty(skill) {
  let target = skill.rating + ENGINE_CONFIG.DIFFICULTY_STRETCH;

  // Frustration check: 3 wrong in a row → drop
  const last3 = skill.lastAnswers.slice(-3);
  if (last3.length === 3 && last3.every(x => !x)) {
    target -= ENGINE_CONFIG.FRUSTRATION_DROP;
  }

  // Boredom check: 5/5 correct fast → bump
  const last5 = skill.lastAnswers.slice(-5);
  const last5Resp = skill.lastResponses.slice(-5);
  if (last5.length === 5 && last5.every(Boolean)) {
    const med = median(last5Resp);
    if (med < 3000) target += 75;
  }

  return Math.max(
    ENGINE_CONFIG.MIN_DIFFICULTY,
    Math.min(ENGINE_CONFIG.MAX_DIFFICULTY, Math.round(target))
  );
}

function recordAnswer(profile, skillId, question, correct, responseMs, sessionId) {
  const skill = ensureSkill(profile, skillId);
  const exp = expectedScore(skill.rating, question.difficulty);

  // Slow correct counts less than confident correct
  let actual;
  const med = median(skill.lastResponses);
  if (correct && med > 0 && responseMs > 2 * med) actual = 0.7;
  else actual = correct ? 1 : 0;

  const k = pickK(skill, responseMs, correct);
  skill.rating += k * (actual - exp);
  skill.rating = Math.max(0, Math.min(1000, skill.rating));

  skill.attempts += 1;
  if (correct) skill.correctTotal += 1;
  skill.lastAnswers.push(correct);
  skill.lastResponses.push(responseMs);
  if (skill.lastAnswers.length > 20) skill.lastAnswers.shift();
  if (skill.lastResponses.length > 20) skill.lastResponses.shift();

  if (!skill.sessionsSeen.includes(sessionId)) skill.sessionsSeen.push(sessionId);

  // Mastery check
  checkMastery(profile, skill);

  // Log (cap 200)
  profile.log.push({
    skillId, qid: question.id, correct, ms: responseMs,
    diff: question.difficulty, rating: Math.round(skill.rating),
    t: Date.now(),
  });
  if (profile.log.length > 200) profile.log.shift();

  saveProfile(profile);
}

function checkMastery(profile, skill) {
  if (skill.mastered) return;
  const def = SKILLS[skill.skillId];
  if (!def) return;

  if (skill.attempts < ENGINE_CONFIG.MASTERY_MIN_ATTEMPTS) return;
  if (skill.rating < def.masteryThreshold) return;

  const lastN = skill.lastAnswers.slice(-ENGINE_CONFIG.MASTERY_LAST_N);
  const correctN = lastN.filter(Boolean).length;
  if (correctN < ENGINE_CONFIG.MASTERY_LAST_N_CORRECT) return;

  const med = median(skill.lastResponses.slice(-ENGINE_CONFIG.MASTERY_LAST_N));
  if (med > def.fluencyTargetMs) return;

  if (!ENGINE_CONFIG.DEMO_SINGLE_SESSION_MASTERY) {
    if (skill.sessionsSeen.length < 2) return;
  }

  skill.mastered = true;
  skill.masteredAt = Date.now();
}

// Score a completed level session: returns stars 0-3
function scoreSession(sessionStats) {
  const { correct, total, avgMs, fluencyTargetMs } = sessionStats;
  const pct = correct / total;
  if (pct >= 1.0 && avgMs <= fluencyTargetMs) return 3;
  if (pct >= 0.85) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

// Returns updated unlocked map after mastery changes
function updateIslandUnlocks(profile, islands) {
  islands.forEach(island => {
    if (island.unlocked) return;
    const reqs = island.requires || [];
    const allMet = reqs.every(skillId => {
      const s = profile.skills[skillId];
      return s && s.mastered;
    });
    if (allMet) island.unlocked = true;
  });
}
