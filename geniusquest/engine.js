// GeniusQuest — Adaptive engine
// Elo-lite per skill · mastery gate · graduation · math answer parser · reward calc

const ENGINE_GQ = {
  K_BASE: 32, K_NEW: 48, K_STABLE: 16,
  INITIAL: 250, MIN: 50, MAX: 950,
  MASTERY_ATTEMPTS: 10,
  MASTERY_LAST_N: 8,
  MASTERY_CORRECT: 6,
  FLUENCY_MS: 20000,          // generous for 6yo typing
  FRUSTRATION_DROP: 150,
  // ₽ rewards
  POKECOIN_BASE: 8,
  POKECOIN_VAULT: 40,
  POKECOIN_STREAK_5: 1.5,
  POKECOIN_STREAK_10: 2.0,
  GRAD_BONUS_COINS: 50,
  GRAD_BONUS_PACKS: 1,
  // XP per correct for trainer level
  XP_PER_CORRECT: 10,
  XP_PER_VAULT: 50,
};

const STORAGE_KEY_GQ = 'geniusquest_profile_v1';

const TRAINER_TIERS = [
  { name: 'Rookie',      min: 0    },
  { name: 'Apprentice',  min: 200  },
  { name: 'Ace Trainer', min: 600  },
  { name: 'Elite',       min: 1500 },
  { name: 'Champion',    min: 3000 },
];

function newProfileGQ() {
  return {
    childId: 'gq_' + Math.random().toString(36).slice(2, 8),
    createdAt: Date.now(),
    pokecoin: 0,
    xp: 0,
    packs: 0,
    ownedCards: {},         // cardId → count
    skills: {},             // skillId → skill obj
    hallOfFame: [],         // [{ skillId, name, date }]
    vaultSolved: [],        // vaultId[]
    questStars: {},         // questId → bestStars
    dailyQuestProgress: 0,
    dailyQuestDone: false,
    dailyDate: '',
    streak: 0,
    seenProblems: {},
    champion: false,
  };
}

function ensureSkillGQ(profile, skillId) {
  if (!profile.skills[skillId]) {
    profile.skills[skillId] = {
      skillId,
      rating: ENGINE_GQ.INITIAL,
      attempts: 0,
      correctTotal: 0,
      lastAnswers: [],       // 0/1, last 20
      lastResponses: [],     // ms, last 8
      mastered: false,
      masteredAt: null,
      wrongStreak: 0,
    };
  }
  return profile.skills[skillId];
}

function loadProfileGQ() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GQ);
    if (raw) { const p = JSON.parse(raw); if (p && p.skills) return p; }
  } catch (e) {}
  return newProfileGQ();
}
function saveProfileGQ(p) { try { localStorage.setItem(STORAGE_KEY_GQ, JSON.stringify(p)); } catch (e) {} }
function resetProfileGQ() { localStorage.removeItem(STORAGE_KEY_GQ); }

// ── Selector ───────────────────────────────────────────────────────────────
function pickProblemGQ(profile, skillId, pool) {
  if (!pool || !pool.length) return null;
  const skill = ensureSkillGQ(profile, skillId);
  let target = skill.rating;
  if (skill.wrongStreak >= 3) target = Math.max(ENGINE_GQ.MIN, target - ENGINE_GQ.FRUSTRATION_DROP);

  let best = null, bestScore = -Infinity;
  pool.forEach(p => {
    const dist = Math.abs((p.difficulty || 300) - target);
    let score = -dist;
    const seen = (profile.seenProblems[p.id] || 0);
    score -= seen * 80;
    score += (Math.random() - 0.5) * 30;
    if (score > bestScore) { bestScore = score; best = p; }
  });
  return best;
}

// ── Record answer ──────────────────────────────────────────────────────────
function recordAnswerGQ(profile, skillId, problem, correct, responseMs) {
  const skill = ensureSkillGQ(profile, skillId);
  const problemR = problem.difficulty || 300;
  const expected = 1 / (1 + Math.pow(10, (problemR - skill.rating) / 400));
  const k = skill.attempts < 5 ? ENGINE_GQ.K_NEW : (skill.attempts > 30 ? ENGINE_GQ.K_STABLE : ENGINE_GQ.K_BASE);
  skill.rating = Math.max(ENGINE_GQ.MIN, Math.min(ENGINE_GQ.MAX, skill.rating + k * ((correct ? 1 : 0) - expected)));
  skill.attempts++;
  if (correct) skill.correctTotal++;
  skill.lastAnswers.push(correct ? 1 : 0);
  if (skill.lastAnswers.length > 20) skill.lastAnswers.shift();
  skill.lastResponses.push(responseMs);
  if (skill.lastResponses.length > 8) skill.lastResponses.shift();
  skill.wrongStreak = correct ? 0 : skill.wrongStreak + 1;

  // Streak
  if (correct) profile.streak = (profile.streak || 0) + 1;
  else profile.streak = 0;

  // seen
  profile.seenProblems[problem.id] = (profile.seenProblems[problem.id] || 0) + 1;

  // ₽ + XP
  let coins = ENGINE_GQ.POKECOIN_BASE;
  const sr = profile.streak || 0;
  if (sr >= 10) coins = Math.round(coins * ENGINE_GQ.POKECOIN_STREAK_10);
  else if (sr >= 5) coins = Math.round(coins * ENGINE_GQ.POKECOIN_STREAK_5);
  if (correct) { profile.pokecoin += coins; profile.xp = (profile.xp || 0) + ENGINE_GQ.XP_PER_CORRECT; }

  // Daily quest
  if (correct) {
    profile.dailyQuestProgress = (profile.dailyQuestProgress || 0) + 1;
    if (!profile.dailyQuestDone && profile.dailyQuestProgress >= 8) {
      profile.dailyQuestDone = true;
      profile.packs = (profile.packs || 0) + 1;
    }
  }

  // Mastery check
  let graduated = false;
  if (!skill.mastered) {
    const last = skill.lastAnswers.slice(-ENGINE_GQ.MASTERY_LAST_N);
    const ok = last.reduce((a, b) => a + b, 0);
    const resp = skill.lastResponses.slice().sort((a, b) => a - b);
    const median = resp[Math.floor(resp.length / 2)] || 99999;
    const def = SKILLS_GQ[skillId];
    if (skill.attempts >= ENGINE_GQ.MASTERY_ATTEMPTS &&
        last.length >= ENGINE_GQ.MASTERY_LAST_N &&
        ok >= ENGINE_GQ.MASTERY_CORRECT &&
        skill.rating >= (def ? def.threshold : 600) &&
        median <= ENGINE_GQ.FLUENCY_MS) {
      skill.mastered = true;
      skill.masteredAt = Date.now();
      graduated = true;
      profile.hallOfFame = profile.hallOfFame || [];
      profile.hallOfFame.push({ skillId, name: def ? def.name : skillId, date: new Date().toLocaleDateString() });
      profile.pokecoin += ENGINE_GQ.GRAD_BONUS_COINS;
      profile.packs = (profile.packs || 0) + ENGINE_GQ.GRAD_BONUS_PACKS;
    }
  }

  return { correct, coins: correct ? coins : 0, graduated };
}

// ── Math answer parser ─────────────────────────────────────────────────────
function parseNumericGQ(raw) {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim().replace(/\s+/g, '').toLowerCase();
  if (!s) return null;
  // strip leading x= or answer=
  s = s.replace(/^(x=|ans=|answer=)/i, '');
  // negative sign: also accept − (unicode minus)
  s = s.replace(/−/g, '-');
  // mixed number like "1 1/2" or "1_1/2"
  const mixed = s.match(/^(-?\d+)[_ ](\d+)\/(\d+)$/);
  if (mixed) {
    const whole = parseInt(mixed[1], 10);
    const num = parseInt(mixed[2], 10);
    const den = parseInt(mixed[3], 10);
    if (den === 0) return null;
    return whole + (whole >= 0 ? num / den : -num / den);
  }
  // fraction like "3/4"
  const frac = s.match(/^(-?\d+)\/(\d+)$/);
  if (frac) {
    const den = parseInt(frac[2], 10);
    if (den === 0) return null;
    return parseInt(frac[1], 10) / den;
  }
  // integer or decimal
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function gradeMathGQ(rawInput, expectedAnswer, opts = {}) {
  const tol = opts.tolerance !== undefined ? opts.tolerance : 1e-6;
  const parsed = parseNumericGQ(rawInput);
  if (parsed === null) return { correct: false, parsed: null };
  const correct = Math.abs(parsed - expectedAnswer) <= tol;
  return { correct, parsed };
}

// ── Trainer tier ───────────────────────────────────────────────────────────
function trainerTierGQ(xp) {
  let tier = TRAINER_TIERS[0];
  for (const t of TRAINER_TIERS) { if (xp >= t.min) tier = t; }
  const next = TRAINER_TIERS.find(t => t.min > xp);
  const pct = next ? Math.round(100 * (xp - tier.min) / (next.min - tier.min)) : 100;
  return { name: tier.name, pct };
}

// ── Win condition check ─────────────────────────────────────────────────────
function checkWinGQ(profile) {
  if (profile.champion) return false;
  const mathSkills = Object.values(SKILLS_GQ).filter(s => s.hall === 'math').map(s => s.id);
  const allGrad = mathSkills.every(id => profile.skills[id] && profile.skills[id].mastered);
  const vaultDone = (profile.vaultSolved || []).length >= VAULT_PROBLEMS_GQ.length;
  const dexFilled = Object.keys(profile.ownedCards).length >= Math.ceil(POKEMON_CARDS.length * 0.8);
  return allGrad && vaultDone && dexFilled;
}

// ── Daily quest reset ──────────────────────────────────────────────────────
function checkDailyReset(profile) {
  const today = new Date().toDateString();
  if (profile.dailyDate !== today) {
    profile.dailyDate = today;
    profile.dailyQuestProgress = 0;
    profile.dailyQuestDone = false;
  }
}
