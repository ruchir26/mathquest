// CuriosityQuest — UI loop
(function () {
  const $ = sel => document.querySelector(sel);

  let profile = loadProfileCQ();
  let currentIsland = null;
  let currentQuest = null;
  let currentProblem = null;
  let questProblemIndex = 0;
  let questStats = null;
  let problemStartTs = 0;
  let answerLocked = false;
  let sessionStart = Date.now();
  let appliedTheme = null;

  const screens = {
    welcome: $('#welcomeScreen'),
    map:     $('#mapScreen'),
    quest:   $('#questScreen'),
    play:    $('#playScreen'),
    reward:  $('#rewardScreen'),
    codex:   $('#codexScreen'),
    parent:  $('#parentScreen'),
  };

  function show(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    $('#hud').classList.toggle('hidden', name === 'welcome');
  }

  function applyTheme(themeClass) {
    if (appliedTheme) document.documentElement.classList.remove(appliedTheme);
    if (themeClass) document.documentElement.classList.add(themeClass);
    appliedTheme = themeClass;
  }

  function updateHud() {
    $('#xpCount').textContent = profile.xp;
    $('#shardCount').textContent = profile.shards;
    $('#cardCount').textContent = profile.wonderCards.length;
  }

  // ============== Map screen ==============
  function renderMap() {
    applyTheme(null);
    const list = $('#islandList');
    list.innerHTML = '';
    ISLANDS_CQ.forEach(island => {
      const card = document.createElement('div');
      card.className = 'island-card ' + island.theme;
      const masteredCount = (island.skillIds || []).filter(s => profile.skills[s] && profile.skills[s].mastered).length;
      const totalSkills = (island.skillIds || []).length || 1;
      const pct = Math.round(100 * masteredCount / totalSkills);
      const islandQuests = QUESTS_CQ.filter(q => q.islandId === island.id);
      const completedQuests = islandQuests.filter(q => (profile.questStars[q.id] || 0) > 0).length;

      card.innerHTML = `
        <div class="island-hero" id="hero-${island.id}"></div>
        <div class="island-subject">${island.subject}</div>
        <div class="island-name">${island.emoji} ${island.name}</div>
        <div class="island-desc">${island.desc}</div>
        <div class="island-progress"><div class="island-progress-fill" style="width:${pct}%"></div></div>
        <div class="island-meta">
          <span>${completedQuests} / ${islandQuests.length} quests</span>
          <span>${masteredCount} / ${totalSkills} mastered</span>
        </div>
      `;
      card.addEventListener('click', () => {
        currentIsland = island;
        applyTheme(island.theme);
        renderQuests();
        show('quest');
      });
      list.appendChild(card);
    });
    // mount hero SVGs after insertion
    ISLANDS_CQ.forEach(island => {
      const host = document.getElementById('hero-' + island.id);
      if (host && typeof renderIslandHero === 'function') renderIslandHero(host, island.id);
    });
  }

  // ============== Quest list screen ==============
  function renderQuests() {
    $('#questTitle').textContent = currentIsland.emoji + ' ' + currentIsland.name;
    const list = $('#questList');
    list.innerHTML = '';
    const quests = QUESTS_CQ.filter(q => q.islandId === currentIsland.id);
    quests.forEach((quest, i) => {
      const stars = profile.questStars[quest.id] || 0;
      const item = document.createElement('div');
      item.className = 'quest-item' + (stars > 0 ? ' completed' : '');
      const skillNames = quest.skillIds.map(s => SKILLS_CQ[s] && SKILLS_CQ[s].name).filter(Boolean).join(' · ');
      item.innerHTML = `
        <div class="quest-num">${i + 1}</div>
        <div class="quest-info">
          <div class="quest-title">${quest.name}</div>
          <div class="quest-sub">${skillNames} · ${quest.length} problems</div>
        </div>
        <div class="quest-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      `;
      item.addEventListener('click', () => startQuest(quest));
      list.appendChild(item);
    });
  }

  // ============== Play loop ==============
  function startQuest(quest) {
    currentQuest = quest;
    questProblemIndex = 0;
    questStats = { total: 0, correct: 0, totalMs: 0, problems: [] };
    show('play');
    nextProblem();
  }

  function nextProblem() {
    if (questProblemIndex >= currentQuest.length) return endQuest();
    // Pick a problem from the quest's skill pool
    const skillId = currentQuest.skillIds[questProblemIndex % currentQuest.skillIds.length];
    const pool = PROBLEMS_BY_SKILL_CQ[skillId] || [];
    const problem = pickProblemCQ(profile, skillId, pool);
    if (!problem) return endQuest();
    currentProblem = problem;
    answerLocked = false;
    problemStartTs = Date.now();
    renderProblem(problem);
    updateProgress();
  }

  function renderProblem(problem) {
    // Scene
    const sceneHost = $('#sceneContainer');
    renderScene(sceneHost, problem.sceneSpec || {});
    // Question
    $('#questionText').textContent = problem.prompt;
    // Choices (shuffled)
    const choicesEl = $('#choices');
    choicesEl.innerHTML = '';
    const indexed = problem.choices.map((c, i) => ({ c, i }));
    shuffleInPlace(indexed);
    indexed.forEach(({ c, i }) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = c.text;
      btn.dataset.idx = i;
      btn.addEventListener('click', () => onAnswer(i, btn));
      choicesEl.appendChild(btn);
    });
    // Hide explain
    const exp = $('#explainBox');
    exp.classList.add('hidden');
    exp.classList.remove('good');
    exp.textContent = '';
    // Show hint chip if frustrated
    const skill = ensureSkillCQ(profile, problem.skillId);
    const hintBtn = $('#hintBtn');
    hintBtn.classList.toggle('active', skill.wrongStreak >= 2);
  }

  function onAnswer(choiceIdx, btnEl) {
    if (answerLocked) return;
    answerLocked = true;
    const responseMs = Date.now() - problemStartTs;
    const result = recordAnswerCQ(profile, currentProblem.skillId, currentProblem, choiceIdx, responseMs);
    questStats.total += 1;
    questStats.totalMs += responseMs;
    if (result.correct) questStats.correct += 1;
    questStats.problems.push({ id: currentProblem.id, correct: result.correct, ms: responseMs });
    saveProfileCQ(profile);
    updateHud();

    // Mark all buttons
    document.querySelectorAll('.choice-btn').forEach(b => {
      const idx = parseInt(b.dataset.idx, 10);
      const choice = currentProblem.choices[idx];
      b.disabled = true;
      if (choice && choice.correct) b.classList.add('correct');
      else if (idx === choiceIdx) b.classList.add('wrong');
      else b.classList.add('faded');
    });

    // Sparkle on correct
    if (result.correct) {
      sparkleOn(btnEl);
    }

    // Explanation
    const exp = $('#explainBox');
    if (currentProblem.explanation) {
      exp.classList.remove('hidden');
      exp.classList.toggle('good', result.correct);
      exp.innerHTML = (result.correct ? '✅ ' : '💡 ') + currentProblem.explanation;
    }

    // Move on after a short delay
    setTimeout(() => {
      questProblemIndex += 1;
      nextProblem();
    }, result.correct ? 1100 : 2400);
  }

  function updateProgress() {
    const pct = Math.round(100 * questProblemIndex / currentQuest.length);
    $('#progressFill').style.width = pct + '%';
  }

  function endQuest() {
    const stars = scoreQuestCQ(questStats);
    const prev = profile.questStars[currentQuest.id] || 0;
    if (stars > prev) profile.questStars[currentQuest.id] = stars;
    const card = WONDER_CARDS_CQ[currentQuest.wonderCardId];
    const isNewCard = card && !profile.wonderCards.find(c => c.id === card.id);
    if (card) grantWonderCardCQ(profile, card);
    saveProfileCQ(profile);
    updateHud();
    renderReward(stars, card, isNewCard);
    show('reward');
  }

  function renderReward(stars, card, isNewCard) {
    $('#rewardTitle').textContent = stars === 3 ? 'Perfect Quest!' : (stars === 2 ? 'Quest Complete!' : 'Quest Done');
    $('#rewardStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const wc = $('#wonderCard');
    if (card) {
      wc.style.display = '';
      wc.innerHTML = `
        <div class="wc-label">${isNewCard ? 'New Wonder Card' : 'Wonder Card'}</div>
        <div class="wc-title">📜 ${card.title}</div>
        <div class="wc-text">${card.text}</div>
      `;
    } else {
      wc.style.display = 'none';
    }
    const xpGain = questStats.correct * ENGINE_CQ.XP_PER_CORRECT;
    const shardGain = questStats.correct * ENGINE_CQ.SHARDS_PER_CORRECT;
    $('#rewardItems').innerHTML = `
      <div>✨ +${xpGain} XP</div>
      <div>🧭 +${shardGain} compass shards</div>
      <div>✅ ${questStats.correct} of ${questStats.total} correct</div>
    `;
  }

  // ============== Codex screen ==============
  function renderCodex() {
    const host = $('#codexContent');
    host.innerHTML = '';
    if (!profile.wonderCards.length) {
      host.innerHTML = '<div class="codex-empty">No Wonder Cards yet. Finish a quest on any island to collect one.</div>';
      return;
    }
    // Group by island
    const byIsland = {};
    profile.wonderCards.forEach(c => {
      const list = byIsland[c.islandId] = byIsland[c.islandId] || [];
      list.push(c);
    });
    ISLANDS_CQ.forEach(island => {
      const cards = byIsland[island.id] || [];
      if (!cards.length) return;
      const sec = document.createElement('div');
      sec.className = 'codex-island';
      sec.innerHTML = `<h3>${island.emoji} ${island.name}</h3>`;
      cards.forEach(c => {
        const m = document.createElement('div');
        m.className = 'codex-card-mini';
        m.innerHTML = `<b>${c.title}</b><br/>${c.text}`;
        sec.appendChild(m);
      });
      host.appendChild(sec);
    });
  }

  // ============== Parent screen ==============
  function renderParent() {
    const host = $('#parentContent');
    host.innerHTML = '';
    // Summary
    const sum = document.createElement('div');
    sum.className = 'parent-section';
    sum.innerHTML = `
      <h3>Summary</h3>
      <div class="skill-row"><span class="skill-name">Total XP</span><b>${profile.xp}</b></div>
      <div class="skill-row"><span class="skill-name">Wonder Cards</span><b>${profile.wonderCards.length} / ${Object.keys(WONDER_CARDS_CQ).length}</b></div>
      <div class="skill-row"><span class="skill-name">Reading rating</span><b>${Math.round(profile.readingRating)}</b></div>
    `;
    host.appendChild(sum);

    // Per-island skill progress
    ISLANDS_CQ.forEach(island => {
      const sec = document.createElement('div');
      sec.className = 'parent-section';
      sec.innerHTML = `<h3>${island.emoji} ${island.name}</h3>`;
      island.skillIds.forEach(skillId => {
        const def = SKILLS_CQ[skillId];
        const sk = profile.skills[skillId];
        const rating = sk ? Math.round(sk.rating) : ENGINE_CQ.INITIAL_SKILL;
        const pct = Math.round(100 * Math.min(1, rating / (def.threshold || 600)));
        const mastered = sk && sk.mastered;
        const row = document.createElement('div');
        row.className = 'skill-row';
        row.innerHTML = `
          <span class="skill-name">${def.name}</span>
          <div class="skill-bar-wrap"><div class="skill-bar-fill" style="width:${pct}%"></div></div>
          <span>${mastered ? '<span class="mastered-tag">Mastered</span>' : rating}</span>
        `;
        sec.appendChild(row);

        // Top misconceptions
        const top = topMisconceptionsCQ(profile, skillId, 2);
        if (top.length) {
          const mc = document.createElement('div');
          mc.style.fontSize = '12px';
          mc.style.color = '#a83e36';
          mc.style.marginLeft = '4px';
          mc.textContent = '⚠ Common slip: ' + top.join(', ');
          sec.appendChild(mc);
        }
      });
      host.appendChild(sec);
    });
  }

  // ============== Sparkles ==============
  function sparkleOn(btn) {
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = ['✨','⭐','🌟','💫'][i % 4];
      s.style.left = (rect.left + Math.random() * rect.width) + 'px';
      s.style.top  = (rect.top + Math.random() * rect.height / 2) + 'px';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1300);
    }
  }

  // ============== Utility ==============
  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ============== Wire-up ==============
  $('#startBtn').addEventListener('click', () => {
    show('map');
    renderMap();
    updateHud();
  });
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    resetProfileCQ();
    profile = loadProfileCQ();
    updateHud();
  });
  $('#backBtn').addEventListener('click', () => {
    // Smart back: from quest → map; from play/reward → quests; from codex/parent → previous
    const active = Object.entries(screens).find(([n, el]) => el.classList.contains('active'));
    if (!active) return;
    const [name] = active;
    if (name === 'play' || name === 'reward') {
      renderQuests();
      show('quest');
    } else if (name === 'quest') {
      renderMap();
      show('map');
    } else if (name === 'codex' || name === 'parent') {
      renderMap();
      show('map');
    }
  });
  $('#codexBtn').addEventListener('click', () => { renderCodex(); show('codex'); });
  $('#parentBtn').addEventListener('click', () => { renderParent(); show('parent'); });
  $('#closeCodexBtn').addEventListener('click', () => { renderMap(); show('map'); });
  $('#closeParentBtn').addEventListener('click', () => { renderMap(); show('map'); });
  $('#continueBtn').addEventListener('click', () => { renderQuests(); show('quest'); });
  $('#replayBtn').addEventListener('click', () => {
    if (!currentProblem) return;
    renderScene($('#sceneContainer'), currentProblem.sceneSpec || {});
  });
  $('#hintBtn').addEventListener('click', () => {
    if (!currentProblem) return;
    // Fade two distractors
    const buttons = Array.from(document.querySelectorAll('.choice-btn'));
    const wrongBtns = buttons.filter(b => {
      const idx = parseInt(b.dataset.idx, 10);
      return !(currentProblem.choices[idx] && currentProblem.choices[idx].correct);
    });
    wrongBtns.slice(0, 2).forEach(b => b.classList.add('faded'));
  });

  // Initial state
  updateHud();
})();
