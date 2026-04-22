// MathQuest — UI + game loop
(function() {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  let profile = loadProfile();
  let currentIsland = null;
  let currentSkillId = null;
  let currentQuestion = null;
  let questionStartTs = 0;
  let sessionStats = null; // { correct, total, responses, sessionId, wrongStreak }
  let frustrationHints = 0; // tracks per-question hint usage
  let answerLocked = false;

  const screens = {
    welcome: $('#welcomeScreen'),
    map: $('#mapScreen'),
    play: $('#playScreen'),
    reward: $('#rewardScreen'),
    parent: $('#parentScreen'),
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    $('#hud').classList.toggle('hidden', name === 'welcome');
  }

  function updateHud() {
    $('#starCount').textContent = profile.stars;
    $('#coinCount').textContent = profile.coins;
    $('#eggCount').textContent = profile.eggPieces;
  }

  // -------------------- Map --------------------
  function renderMap() {
    updateIslandUnlocks(profile, ISLANDS);
    const map = $('#islandMap');
    map.innerHTML = '';
    ISLANDS.forEach(island => {
      const card = document.createElement('div');
      card.className = 'island-card' + (island.unlocked ? '' : ' locked');
      const skill = profile.skills[island.skillId];
      const rating = skill ? skill.rating : ENGINE_CONFIG.INITIAL_RATING;
      const def = SKILLS[island.skillId];
      const pct = Math.min(100, Math.round((rating / def.masteryThreshold) * 100));
      const stars = profile.islandStars[island.id] || 0;
      card.innerHTML = `
        ${island.unlocked ? '' : '<span class="lock-icon">🔒</span>'}
        <span class="island-emoji">${island.emoji}</span>
        <div class="island-name">${island.name}</div>
        <div class="island-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
        <div class="island-bar"><div class="island-bar-fill" style="width:${pct}%"></div></div>
      `;
      if (island.unlocked) {
        card.addEventListener('click', () => startLevel(island));
      }
      map.appendChild(card);
    });

    const c = $('#companion');
    if (profile.creatures.length) {
      c.innerHTML = `Your companions: ${profile.creatures.map(x => x.emoji).join(' ')}`;
    } else if (profile.eggPieces > 0) {
      c.innerHTML = `🥚 Egg pieces: ${profile.eggPieces}/4 — collect 4 to hatch!`;
    } else {
      c.innerHTML = `Earn egg pieces to hatch a companion!`;
    }
  }

  // -------------------- Level / play --------------------
  function startLevel(island) {
    currentIsland = island;
    currentSkillId = island.skillId;
    ensureSkill(profile, currentSkillId);
    sessionStats = {
      correct: 0,
      total: 0,
      responses: [],
      sessionId: 'sess_' + Date.now(),
      wrongStreak: 0,
    };
    profile.sessions.push(sessionStats.sessionId);
    showScreen('play');
    renderStreakDots();
    nextQuestion();
  }

  function renderStreakDots() {
    const wrap = $('#streakDots');
    wrap.innerHTML = '';
    for (let i = 0; i < ENGINE_CONFIG.LEVEL_QUESTIONS; i++) {
      const dot = document.createElement('div');
      dot.className = 'streak-dot';
      // sessionStats.responses[i] = true/false (correct flag)
      const r = sessionStats.responses[i];
      if (r === true) dot.classList.add('correct');
      else if (r === false) dot.classList.add('wrong');
      wrap.appendChild(dot);
    }
    const pct = (sessionStats.total / ENGINE_CONFIG.LEVEL_QUESTIONS) * 100;
    $('#progressFill').style.width = pct + '%';
  }

  function nextQuestion() {
    if (sessionStats.total >= ENGINE_CONFIG.LEVEL_QUESTIONS) {
      finishLevel();
      return;
    }
    frustrationHints = 0;
    answerLocked = false;
    const skill = profile.skills[currentSkillId];
    const diff = targetDifficulty(skill);
    currentQuestion = generateQuestion(currentSkillId, diff);
    questionStartTs = Date.now();
    renderQuestion(currentQuestion);
  }

  function renderQuestion(q) {
    const area = $('#puzzleArea');
    area.innerHTML = '';
    setPip('🦊');

    const promptEl = document.createElement('div');
    promptEl.className = 'question-text';
    promptEl.textContent = q.prompt;
    area.appendChild(promptEl);

    if (q.template === 'tap_count') renderTapCount(area, q);
    else if (q.template === 'compare_piles') renderCompare(area, q);
    else renderChoice(area, q);
  }

  function renderTapCount(area, q) {
    const tapped = new Set();
    const wrap = document.createElement('div');
    wrap.className = 'tap-objects';
    for (let i = 0; i < q.payload.totalShown; i++) {
      const obj = document.createElement('div');
      obj.className = 'tap-object';
      obj.textContent = q.payload.emoji;
      obj.dataset.idx = i;
      obj.addEventListener('click', () => {
        if (answerLocked) return;
        if (tapped.has(i)) {
          tapped.delete(i);
          obj.classList.remove('tapped');
        } else {
          tapped.add(i);
          obj.classList.add('tapped');
        }
      });
      wrap.appendChild(obj);
    }
    area.appendChild(wrap);

    const confirm = document.createElement('button');
    confirm.className = 'confirm-btn';
    confirm.textContent = '✔ Done';
    confirm.addEventListener('click', () => {
      if (answerLocked) return;
      answerLocked = true;
      const correct = tapped.size === q.payload.target;
      handleAnswer(correct);
    });
    area.appendChild(confirm);
  }

  function renderCompare(area, q) {
    const grid = document.createElement('div');
    grid.className = 'compare-piles';
    ['a','b'].forEach(side => {
      const n = q.payload[side];
      const pile = document.createElement('div');
      pile.className = 'compare-pile';
      pile.dataset.side = side;
      pile.innerHTML = q.payload.emoji.repeat(n);
      pile.addEventListener('click', () => {
        if (answerLocked) return;
        answerLocked = true;
        const correct = side === q.payload.answer;
        pile.classList.add(correct ? 'correct' : 'wrong');
        handleAnswer(correct);
      });
      grid.appendChild(pile);
    });
    area.appendChild(grid);
  }

  function renderChoice(area, q) {
    const grid = document.createElement('div');
    grid.className = 'choice-grid';
    q.payload.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = c;
      btn.dataset.value = c;
      btn.addEventListener('click', () => {
        if (answerLocked) return;
        const correct = c === q.payload.answer;
        if (!correct) {
          // Soft hint after 2 wrongs on this question: fade wrong choices
          frustrationHints += 1;
          btn.classList.add('wrong');
          flashFeedback('Try again!', 'bad');
          setPip('😯', 'gasp');
          if (frustrationHints >= 2) {
            // fade wrong options
            grid.querySelectorAll('.choice-btn').forEach(b => {
              if (b.dataset.value != q.payload.answer) b.classList.add('faded');
            });
          }
          // do not lock; let them try again, but the answer is recorded as wrong only once
          if (frustrationHints === 1) {
            // Record the first wrong attempt for the engine; subsequent attempts on
            // same question are coaching, not data points.
            handleAnswer(false, /*advance*/ false);
          }
          return;
        }
        answerLocked = true;
        btn.classList.add('correct');
        if (frustrationHints === 0) handleAnswer(true);
        else {
          // got it after hint(s) — count as already-recorded; just advance
          flashFeedback('Got it!', 'good');
          setPip('🦊', 'cheer');
          rewardCorrect(/*record*/ false);
          setTimeout(() => nextQuestion(), 900);
        }
      });
      grid.appendChild(btn);
    });
    area.appendChild(grid);
  }

  function handleAnswer(correct, advance = true) {
    const ms = Date.now() - questionStartTs;
    recordAnswer(profile, currentSkillId, currentQuestion, correct, ms, sessionStats.sessionId);

    if (correct) {
      sessionStats.correct += 1;
      sessionStats.responses[sessionStats.total] = true;
      sessionStats.total += 1;
      sessionStats.wrongStreak = 0;
      flashFeedback('Yay!', 'good');
      setPip('🦊', 'cheer');
      burstConfetti();
      rewardCorrect(true);
    } else if (advance) {
      sessionStats.responses[sessionStats.total] = false;
      sessionStats.total += 1;
      sessionStats.wrongStreak += 1;
      flashFeedback('Oops!', 'bad');
      setPip('😯', 'gasp');
    }
    renderStreakDots();
    updateHud();

    if (advance) {
      setTimeout(() => nextQuestion(), correct ? 900 : 1100);
    }
  }

  function rewardCorrect(record) {
    profile.coins += 5;
    if (record) profile.coins += 0; // already added
    saveProfile(profile);
    updateHud();
  }

  function flashFeedback(text, kind) {
    const el = $('#feedback');
    el.textContent = text;
    el.className = 'feedback show ' + kind;
    setTimeout(() => { el.className = 'feedback'; }, 1000);
  }

  function setPip(emoji, anim) {
    const el = $('#pipReaction');
    el.textContent = emoji;
    el.className = 'pip-reaction';
    if (anim) {
      void el.offsetWidth;
      el.classList.add(anim);
    }
  }

  function burstConfetti() {
    const colors = ['#ff7b6b','#ffd966','#6ed18a','#7ec8ff','#c89aff'];
    const area = $('#playScreen');
    for (let i = 0; i < 14; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.background = colors[i % colors.length];
      c.style.left = (40 + Math.random() * 20) + '%';
      c.style.top = '30%';
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      area.appendChild(c);
      setTimeout(() => c.remove(), 1700);
    }
  }

  // -------------------- Finish level --------------------
  function finishLevel() {
    const skill = profile.skills[currentSkillId];
    const def = SKILLS[currentSkillId];
    const avgMs = skill.lastResponses.slice(-ENGINE_CONFIG.LEVEL_QUESTIONS)
      .reduce((a,b)=>a+b,0) / Math.max(1, ENGINE_CONFIG.LEVEL_QUESTIONS);
    const stars = scoreSession({
      correct: sessionStats.correct,
      total: sessionStats.total,
      avgMs,
      fluencyTargetMs: def.fluencyTargetMs,
    });

    // Award stars (only delta vs. best)
    const prevBest = profile.islandStars[currentIsland.id] || 0;
    if (stars > prevBest) {
      profile.stars += (stars - prevBest);
      profile.islandStars[currentIsland.id] = stars;
    }

    // Egg pieces: 1 per 2-star pass (first time at that tier)
    let gainedEgg = 0;
    if (stars >= 2 && prevBest < 2) {
      profile.eggPieces += 1;
      gainedEgg = 1;
      if (profile.eggPieces >= 4) {
        profile.eggPieces = 0;
        const creatures = [
          { name: 'Sparkle Dragon', emoji: '🐉' },
          { name: 'Robo-Bunny', emoji: '🤖' },
          { name: 'Star Unicorn', emoji: '🦄' },
          { name: 'Cloud Whale', emoji: '🐋' },
        ];
        profile.creatures.push(creatures[profile.creatures.length % creatures.length]);
      }
    }

    // Mastery may now unlock new islands
    updateIslandUnlocks(profile, ISLANDS);
    saveProfile(profile);
    updateHud();

    // Render reward screen
    const masteredNow = skill.mastered && (skill.masteredAt > Date.now() - 5000);
    $('#rewardTitle').textContent =
      stars === 3 ? 'Amazing!' :
      stars === 2 ? 'Great Job!' :
      stars === 1 ? 'Nice Try!' : 'Keep Going!';

    const sEl = $('#rewardStars');
    sEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      s.textContent = i < stars ? '⭐' : '☆';
      s.className = i < stars ? 'star-filled' : 'star-empty';
      s.style.animationDelay = (i * 0.2) + 's';
      sEl.appendChild(s);
    }

    const items = $('#rewardItems');
    items.innerHTML = '';
    items.innerHTML += `<div>🪙 +${sessionStats.correct * 5} coins</div>`;
    if (gainedEgg) items.innerHTML += `<div>🥚 +1 egg piece (${profile.eggPieces}/4)</div>`;
    if (masteredNow) items.innerHTML += `<div>🏆 ${def.name} mastered! New island unlocked!</div>`;
    if (profile.creatures.length && gainedEgg && profile.eggPieces === 0) {
      const last = profile.creatures[profile.creatures.length-1];
      items.innerHTML += `<div>🎉 Hatched: ${last.emoji} ${last.name}!</div>`;
    }

    showScreen('reward');
  }

  // -------------------- Parent dashboard --------------------
  function renderParent() {
    const c = $('#parentContent');
    const skillRows = Object.values(SKILLS).map(def => {
      const s = profile.skills[def.id];
      if (!s) return `<div class="parent-skill">
        <span>${def.name}</span>
        <span class="skill-rating new">Not started</span>
      </div>`;
      const status = s.mastered ? 'mastered' : 'learning';
      const label = s.mastered ? 'Mastered' : `Learning (${Math.round(s.rating)}/${def.masteryThreshold})`;
      const acc = s.attempts ? Math.round(100 * s.correctTotal / s.attempts) : 0;
      return `<div class="parent-skill">
        <span><b>${def.name}</b><br><small>${s.attempts} questions · ${acc}% correct</small></span>
        <span class="skill-rating ${status}">${label}</span>
      </div>`;
    }).join('');

    const totalAnswered = Object.values(profile.skills).reduce((a,s) => a + s.attempts, 0);
    const totalCorrect = Object.values(profile.skills).reduce((a,s) => a + s.correctTotal, 0);
    const accPct = totalAnswered ? Math.round(100 * totalCorrect / totalAnswered) : 0;

    c.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-size:18px;"><b>Total questions:</b> ${totalAnswered}</div>
        <div style="font-size:18px;"><b>Accuracy:</b> ${accPct}%</div>
        <div style="font-size:18px;"><b>Stars earned:</b> ⭐ ${profile.stars}</div>
        <div style="font-size:18px;"><b>Companions:</b> ${profile.creatures.map(x=>x.emoji).join(' ') || '—'}</div>
      </div>
      <hr style="border:none; border-top:2px dashed #ccc; margin:12px 0;" />
      ${skillRows}
    `;
  }

  // -------------------- Wire up --------------------
  $('#startBtn').addEventListener('click', () => {
    showScreen('map');
    renderMap();
    updateHud();
  });
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('Erase all progress and start over?')) {
      resetProfile();
      profile = loadProfile();
      updateHud();
    }
  });
  $('#backBtn').addEventListener('click', () => {
    showScreen('map');
    renderMap();
  });
  $('#continueBtn').addEventListener('click', () => {
    showScreen('map');
    renderMap();
  });
  $('#parentBtn').addEventListener('click', () => {
    renderParent();
    showScreen('parent');
  });
  $('#closeParentBtn').addEventListener('click', () => {
    showScreen('map');
    renderMap();
  });

  // If returning user, skip welcome
  if (profile.sessions && profile.sessions.length > 0) {
    showScreen('map');
    renderMap();
    updateHud();
  } else {
    showScreen('welcome');
  }
})();
