// CardQuest — Adaptive Elo engine (ported from MathQuest 2)
// Per-skill rating used to adapt math puzzle difficulty across battles, packs, trades.

const ENGINE = {
  K_BASE: 32, K_NEW: 48, K_STABLE: 16,
  INITIAL_MATH: 200,
  MIN: 50, MAX: 950,
};

const STORAGE_KEY = 'cardquest_profile_v1';

function newProfile() {
  return {
    childId: 'cq_' + Math.random().toString(36).slice(2, 8),
    createdAt: Date.now(),
    schemaVersion: 1,
    gold: 0,
    packs: 0,                    // unopened pack count
    skills: {},                  // skillId → { rating, attempts, ... }
    ownedCards: {},              // cardId → count
    deck: [],                    // array of cardIds (length up to 30)
    progress: {},                // zoneId → { battlesWon: n, bossDefeated: bool }
    seenProblems: {},
    schemaVersion: 1,
  };
}

function ensureSkill(profile, skillId) {
  if (!profile.skills[skillId]) {
    profile.skills[skillId] = {
      skillId,
      rating: ENGINE.INITIAL_MATH,
      attempts: 0,
      correctTotal: 0,
      lastAnswers: [],
    };
  }
  return profile.skills[skillId];
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (!p.schemaVersion) p.schemaVersion = 1;
      return p;
    }
  } catch (e) {}
  return newProfile();
}
function saveProfile(p) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {} }
function resetProfile() { localStorage.removeItem(STORAGE_KEY); }

function expectedScore(rating, difficulty) {
  return 1 / (1 + Math.pow(10, (difficulty - rating) / 400));
}
function pickK(skill, correct, ms) {
  if (skill.attempts < 5) return ENGINE.K_NEW;
  if (skill.attempts > 30) return ENGINE.K_STABLE;
  if (!correct && ms < 1500) return 8;
  return ENGINE.K_BASE;
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function recordAnswer(profile, skillId, problemDifficulty, correct, responseMs) {
  const skill = ensureSkill(profile, skillId);
  const exp = expectedScore(skill.rating, problemDifficulty);
  const k = pickK(skill, correct, responseMs);
  const actual = correct ? 1 : 0;
  skill.rating = clamp(skill.rating + k * (actual - exp), ENGINE.MIN, ENGINE.MAX);
  skill.attempts += 1;
  if (correct) skill.correctTotal += 1;
  skill.lastAnswers.push(correct);
  if (skill.lastAnswers.length > 20) skill.lastAnswers.shift();
  saveProfile(profile);
  return skill;
}

function getRating(profile, skillId) {
  return (profile.skills[skillId] && profile.skills[skillId].rating) || ENGINE.INITIAL_MATH;
}
