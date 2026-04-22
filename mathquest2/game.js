// MathQuest 2 — UI loop
(function() {
  const $ = sel => document.querySelector(sel);

  let profile = loadProfileV2();
  let currentRealm = null;
  let currentQuest = null;
  let currentProblem = null;
  let currentChoices = null;
  let questStats = null;
  let problemStartTs = 0;
  let answerLocked = false;
  let firstAttemptRecorded = false;
  let sceneController = null;
  let sessionId = null;
  let highlightOn = false;
  let scenesPlayed = []; // for comic strip

  const screens = {
    welcome: $('#welcomeScreen'),
    realm: $('#realmScreen'),
    quest: $('#questScreen'),
    play: $('#playScreen'),
    reward: $('#rewardScreen'),
    codex: $('#codexScreen'),
    parent: $('#parentScreen'),
  };

  function show(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    $('#hud').classList.toggle('hidden', name === 'welcome');
  }

  function updateHud() {
    $('#xpCount').textContent = profile.xp;
    $('#gemCount').textContent = profile.gems;
    $('#cardCount').textContent = profile.storyCards.length;
  }

  // -------- Realm screen --------
  function renderRealms() {
    updateRealmUnlocks(profile, REALMS);
    const list = $('#realmList');
    list.innerHTML = '';
    REALMS.forEach(realm => {
      const card = document.createElement('div');
      card.className = 'realm-card' + (realm.unlocked ? '' : ' locked');
      const totalProblems = (PROBLEMS_BY_REALM[realm.id] || []).length;
      const masteredSkills = (realm.skillIds || []).filter(s =>
        profile.skills[s] && profile.skills[s].mastered).length;
      const totalSkills = (realm.skillIds || []).length || 1;
      const pct = Math.round(100 * masteredSkills / totalSkills);

      card.innerHTML = `
        <div class="realm-emoji">${realm.emoji}</div>
        <div class="realm-name">${realm.name}</div>
        <div class="realm-desc">${realm.desc}</div>
        <div class="realm-progress"><div class="realm-progress-fill" style="width:${pct}%"></div></div>
        <div class="realm-meta">
          <span>${totalProblems} problems</span>
          <span>${masteredSkills}/${totalSkills} skills mastered</span>
        </div>
      `;
      if (realm.unlocked) card.addEventListener('click', () => openRealm(realm));
      list.appendChild(card);
    });
  }

  function openRealm(realm) {
    currentRealm = realm;
    const quests = getQuestsForRealm(realm.id);
    $('#questTitle').textContent = `${realm.emoji} ${realm.name}`;
    const list = $('#questList');
    list.innerHTML = '';
    const arc = STORY_ARC[realm.id];
    if (arc) {
      const intro = document.createElement('div');
      intro.style.cssText = 'background:rgba(255,255,255,0.06); padding:12px 16px; border-radius:12px; margin-bottom:12px; font-style:italic; font-size:14px;';
      intro.textContent = arc.intro;
      list.appendChild(intro);
    }
    quests.forEach((q, idx) => {
      const stars = profile.questStars[q.id] || 0;
      const item = document.createElement('div');
      item.className = 'quest-item' + (stars > 0 ? ' completed' : '');
      item.innerHTML = `
        <div class="quest-num">${idx + 1}</div>
        <div class="quest-info">
          <div class="quest-title">${q.title}</div>
          <div class="quest-sub">${q.problems.length} problems</div>
        </div>
        <div class="quest-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
      `;
      item.addEventListener('click', () => startQuest(q));
      list.appendChild(item);
    });
    show('quest');
  }

  // -------- Quest play --------
  function startQuest(quest) {
    currentQuest = quest;
    sessionId = 'sess_' + Date.now();
    profile.sessions.push(sessionId);
    questStats = {
      correct: 0,
      total: 0,
      problemIdx: 0,
      attempted: [],
      sessionId,
    };
    scenesPlayed = [];
    show('play');
    nextProblem();
  }

  function nextProblem() {
    if (questStats.total >= currentQuest.problems.length) {
      finishQuest();
      return;
    }
    answerLocked = false;
    firstAttemptRecorded = false;
    // Use adaptive selection within this quest's pool
    const remaining = currentQuest.problems.filter(
      p => !questStats.attempted.includes(p.id)
    );
    const pool = remaining.length ? remaining : currentQuest.problems;
    currentProblem = selectNextProblem(profile, currentQuest.problems[0].skillId, pool);
    questStats.attempted.push(currentProblem.id);
    currentChoices = buildChoices(currentProblem);
    renderProblem();
  }

  function renderProblem() {
    problemStartTs = Date.now();

    // Progress bar
    const pct = (questStats.total / currentQuest.problems.length) * 100;
    $('#progressFill').style.width = pct + '%';

    // Scene
    const sc = $('#sceneContainer');
    sceneController = renderScene(sc, currentProblem.scene);

    // Story
    const storyEl = $('#storyText');
    storyEl.innerHTML = currentProblem.story.map(s => `<p style="margin:6px 0;">${formatStory(s)}</p>`).join('');
    if (highlightOn) applyHighlight();

    // Question
    $('#questionText').textContent = currentProblem.question;

    // Choices
    const choicesEl = $('#choices');
    choicesEl.innerHTML = '';
    currentChoices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = c.value;
      btn.addEventListener('click', () => handleChoice(btn, c));
      choicesEl.appendChild(btn);
    });

    $('#explainBox').classList.add('hidden');
    $('#storyUnfurl').classList.remove('show');
  }

  function formatStory(s) {
    // Tag numbers and key words for optional highlight
    return s
      .replace(/(\d+\/\d+|\d+)/g, '<span class="num-highlight num">$1</span>')
      .replace(/\b(left|each|in total|altogether|more|fewer|share|of|remaining|rest)\b/gi,
        '<span class="keyword-highlight key">$1</span>');
  }

  function applyHighlight() {
    // already in formatStory; this just toggles visibility via CSS class on container
    const el = $('#storyText');
    if (highlightOn) {
      el.classList.add('show-highlights');
    } else {
      el.classList.remove('show-highlights');
    }
    // simple approach: toggle inline opacity of highlights
    el.querySelectorAll('.num-highlight').forEach(s => {
      s.style.background = highlightOn ? '' : 'transparent';
      s.style.color = highlightOn ? '' : 'inherit';
      s.style.padding = highlightOn ? '' : '0';
    });
    el.querySelectorAll('.keyword-highlight').forEach(s => {
      s.style.color = highlightOn ? '' : 'inherit';
      s.style.fontWeight = highlightOn ? '' : 'inherit';
    });
  }

  function handleChoice(btn, choice) {
    if (answerLocked) return;
    const ms = Date.now() - problemStartTs;

    if (choice.isCorrect) {
      answerLocked = true;
      btn.classList.add('correct');
      sparkleBurst(btn);
      const result = firstAttemptRecorded
        ? { skill: profile.skills[currentProblem.skillId], masteredNow: false }
        : recordAnswerV2(profile, currentProblem, choice, ms, sessionId);
      if (!firstAttemptRecorded) {
        questStats.correct += 1;
      }
      questStats.total += 1;

      profile.xp += 10;
      profile.gems += 1;
      saveProfileV2(profile);
      updateHud();

      // Story fragment unfurl
      revealStoryFragment();

      // Promotion cutscene if mastery hit
      if (result.masteredNow && !profile.promotedSkills.includes(currentProblem.skillId)) {
        profile.promotedSkills.push(currentProblem.skillId);
        saveProfileV2(profile);
        setTimeout(() => showPromotion(currentProblem.skillId), 1400);
      } else {
        setTimeout(() => nextProblem(), 2200);
      }

      // Capture for comic strip
      scenesPlayed.push(currentProblem.scene);

    } else {
      btn.classList.add('wrong');
      // Show explanation tied to which trap they fell for
      const box = $('#explainBox');
      box.textContent = choice.explain || 'Not quite — try again!';
      box.classList.remove('hidden', 'good');

      // Record only the FIRST wrong attempt for the engine
      if (!firstAttemptRecorded) {
        recordAnswerV2(profile, currentProblem, choice, ms, sessionId);
        firstAttemptRecorded = true;
        questStats.total += 1;
      }

      // After 2 wrongs on this problem, fade incorrect answers
      const wrongs = $('#choices').querySelectorAll('.choice-btn.wrong').length;
      if (wrongs >= 2) {
        $('#choices').querySelectorAll('.choice-btn').forEach(b => {
          if (!b.classList.contains('correct') && !b.classList.contains('wrong')) {
            // figure out from text whether it's correct
            const v = +b.textContent;
            if (v !== currentProblem.answer) b.classList.add('faded');
          }
        });
      }
    }
  }

  function revealStoryFragment() {
    const arc = STORY_ARC[currentRealm.id];
    if (!arc) return;
    const idx = profile.chaptersRestored[currentRealm.id] || 0;
    if (idx < arc.fragments.length) {
      const frag = arc.fragments[idx];
      const el = $('#storyUnfurl');
      el.textContent = '📖 ' + frag;
      el.classList.add('show');
      profile.chaptersRestored[currentRealm.id] = idx + 1;
      saveProfileV2(profile);
    }
  }

  function sparkleBurst(target) {
    const rect = target.getBoundingClientRect();
    const parent = $('#playScreen');
    const pRect = parent.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.textContent = ['✨','⭐','💫'][i % 3];
      s.style.left = (rect.left - pRect.left + rect.width/2 + (Math.random()-0.5)*60) + 'px';
      s.style.top = (rect.top - pRect.top + rect.height/2 + (Math.random()-0.5)*30) + 'px';
      parent.appendChild(s);
      setTimeout(() => s.remove(), 1300);
    }
  }

  function showPromotion(skillId) {
    const def = SKILLS_V2[skillId];
    const overlay = document.createElement('div');
    overlay.className = 'promotion';
    overlay.innerHTML = `
      <div class="promotion-card">
        <div class="promo-icon">🏆</div>
        <h2>Promotion!</h2>
        <p>You've mastered <b>${def.name}</b>.<br/>You are now a <b>${def.name} Captain</b>!</p>
        <button class="primary-btn" id="promoCloseBtn">Onward!</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#promoCloseBtn').addEventListener('click', () => {
      overlay.remove();
      nextProblem();
    });
  }

  // -------- Quest finish --------
  function finishQuest() {
    const stars = scoreQuest({
      correct: questStats.correct,
      total: questStats.total,
    });
    const prevBest = profile.questStars[currentQuest.id] || 0;
    const newStars = Math.max(prevBest, stars);
    profile.questStars[currentQuest.id] = newStars;

    // Story Card on first 2★+ pass
    let cardAwarded = null;
    if (stars >= 2 && prevBest < 2) {
      cardAwarded = {
        id: currentQuest.id,
        title: currentQuest.title,
        realm: currentRealm.name,
        emoji: currentRealm.emoji,
        ts: Date.now(),
      };
      profile.storyCards.push(cardAwarded);
      profile.gems += 5;
    }

    updateRealmUnlocks(profile, REALMS);
    saveProfileV2(profile);
    updateHud();

    // Comic strip from scenes played
    const strip = $('#comicStrip');
    strip.innerHTML = '';
    const panels = scenesPlayed.slice(0, 6);
    panels.forEach((sc, i) => {
      const panel = document.createElement('div');
      panel.className = 'comic-panel';
      panel.innerHTML = `
        <span class="panel-num">${i+1}</span>
        <span>${sc.item || '✨'}</span>
      `;
      strip.appendChild(panel);
    });
    while (strip.children.length < 3) {
      const p = document.createElement('div');
      p.className = 'comic-panel';
      p.style.opacity = '0.3';
      strip.appendChild(p);
    }

    $('#rewardTitle').textContent =
      stars === 3 ? '🌟 Quest Mastered!' :
      stars === 2 ? '✨ Quest Complete!' :
      stars === 1 ? 'Nice Try!' : 'Keep Practicing!';

    const items = $('#rewardItems');
    items.innerHTML = `
      <div>${'★'.repeat(stars)}${'☆'.repeat(3-stars)} stars (${questStats.correct}/${questStats.total} correct)</div>
      <div>✨ +${questStats.correct * 10} XP</div>
      <div>💎 +${questStats.correct + (cardAwarded ? 5 : 0)} gems</div>
      ${cardAwarded ? `<div>📜 New Story Card: <b>${cardAwarded.title}</b></div>` : ''}
    `;

    show('reward');
  }

  // -------- Codex --------
  function openCodex() {
    const c = $('#codexContent');
    if (!profile.storyCards.length) {
      c.innerHTML = '<p style="text-align:center; color:#888;">No chapters yet. Complete a quest with 2★ or more to earn a Story Card.</p>';
    } else {
      c.innerHTML = profile.storyCards.map(card => {
        const arc = STORY_ARC[Object.keys(STORY_ARC).find(rid => REALMS.find(r => r.id === rid && r.name === card.realm))];
        const fragmentsRevealed = arc ? Math.min(arc.fragments.length, profile.chaptersRestored[Object.keys(STORY_ARC).find(rid => arc === STORY_ARC[rid])] || 0) : 0;
        return `
          <div class="codex-chapter">
            <h3>${card.emoji} ${card.title}</h3>
            <div class="chapter-text">${arc ? arc.fragments.slice(0, fragmentsRevealed).join(' ') : ''}</div>
          </div>
        `;
      }).join('');
    }
    show('codex');
  }

  // -------- Parent --------
  function openParent() {
    const c = $('#parentContent');
    const skillRows = Object.values(SKILLS_V2).map(def => {
      const s = profile.skills[def.id];
      if (!s) return `<div class="skill-row"><span>${def.name}</span><span style="color:#888;">Not started</span></div>`;
      const pct = Math.min(100, Math.round(100 * s.rating / def.masteryThreshold));
      const acc = s.attempts ? Math.round(100 * s.correctTotal / s.attempts) : 0;
      return `
        <div class="skill-row">
          <span><b>${def.name}</b><br><small>${s.attempts} attempts · ${acc}% correct</small></span>
          <div class="skill-bar-wrap"><div class="skill-bar-fill" style="width:${pct}%"></div></div>
          <span>${s.mastered ? '🏆' : Math.round(s.rating)}</span>
        </div>
      `;
    }).join('');

    const tops = getTopMisconceptionsAcrossSkills(profile, 5);
    const misconceptionRows = tops.length ? tops.map(t => {
      const def = MISCONCEPTIONS[t.misconception];
      const skillDef = SKILLS_V2[t.skillId];
      return `
        <div class="misconception-row">
          <b>${def ? def.label : t.misconception}</b>
          <span style="float:right; opacity:0.6;">${t.count}× in ${skillDef ? skillDef.name : t.skillId}</span>
          <br/><small>💡 ${def ? def.hint : ''}</small>
        </div>
      `;
    }).join('') : '<p style="color:#888;">No common misconceptions yet — keep playing!</p>';

    c.innerHTML = `
      <div class="parent-section">
        <h3>Overall</h3>
        <p>✨ <b>${profile.xp}</b> XP &nbsp; 💎 <b>${profile.gems}</b> gems &nbsp; 📜 <b>${profile.storyCards.length}</b> story cards</p>
        <p>Reading rating: <b>${Math.round(profile.readingRating)}</b> / 950</p>
        <p>Multi-step rating: <b>${Math.round(profile.stepsRating)}</b> / 950</p>
      </div>
      <div class="parent-section">
        <h3>Skills</h3>
        ${skillRows}
      </div>
      <div class="parent-section">
        <h3>Top Misconceptions This Week</h3>
        ${misconceptionRows}
      </div>
    `;
    show('parent');
  }

  // -------- Wire up --------
  $('#startBtn').addEventListener('click', () => {
    show('realm');
    renderRealms();
    updateHud();
  });
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('Erase all progress and start over?')) {
      resetProfileV2();
      profile = loadProfileV2();
      updateHud();
    }
  });
  $('#backBtn').addEventListener('click', () => {
    if (screens.play.classList.contains('active')) {
      // back from play → realm
      show('realm');
      renderRealms();
    } else if (screens.quest.classList.contains('active')) {
      show('realm');
      renderRealms();
    } else {
      show('realm');
      renderRealms();
    }
  });
  $('#parentBtn').addEventListener('click', openParent);
  $('#closeParentBtn').addEventListener('click', () => { show('realm'); renderRealms(); });
  $('#closeCodexBtn').addEventListener('click', () => { show('realm'); renderRealms(); });
  $('#continueBtn').addEventListener('click', () => {
    show('quest');
    openRealm(currentRealm);
  });

  // Tools
  $('#readAloudBtn').addEventListener('click', () => {
    const text = currentProblem ?
      currentProblem.story.join(' ') + ' ' + currentProblem.question : '';
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  });
  $('#highlightBtn').addEventListener('click', () => {
    highlightOn = !highlightOn;
    $('#highlightBtn').classList.toggle('active', highlightOn);
    applyHighlight();
  });
  $('#replayBtn').addEventListener('click', () => {
    if (sceneController) sceneController.replay();
  });

  // Codex via long-press / double-tap on cardCount stat (simple shortcut)
  $('#cardCount').parentElement.addEventListener('click', openCodex);

  // Boot
  if (profile.sessions && profile.sessions.length) {
    show('realm');
    renderRealms();
    updateHud();
  } else {
    show('welcome');
  }
})();
