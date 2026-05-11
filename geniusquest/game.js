// GeniusQuest: Trainer's Path — Main Game Loop
// Connects all modules: engine, content, vault, art, cards, shop, pack, collection
;(function () {
  'use strict';

  // ── Shorthand ──────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const q = sel => document.querySelector(sel);

  // ── State ──────────────────────────────────────────────────────────────────
  let profile;
  let activeHall = null;       // 'math' | 'english' | 'science'
  let activeSkillId = null;
  let currentProblem = null;
  let problemStartMs = 0;
  let sessionCorrect = 0;
  let sessionTotal = 0;
  let practicePool = [];       // problems for current skill session
  let practiceIdx = 0;
  const SESSION_LENGTH = 8;
  let pendingGradSkillId = null;

  // Vault state
  let activeVaultProblem = null;

  // ── Screen management ──────────────────────────────────────────────────────
  const SCREENS = ['welcomeScreen','homeScreen','skillScreen','playScreen',
    'solutionScreen','graduationScreen','shopScreen','packScreen',
    'dexScreen','cardDetailScreen','hofScreen','vaultScreen',
    'vaultPlayScreen','parentScreen','championScreen'];

  function show(name) {
    SCREENS.forEach(s => {
      const el = $(s);
      if (el) el.classList.toggle('active', s === name);
    });
    const hud = $('hud');
    const hideHud = ['welcomeScreen','championScreen'];
    hud.classList.toggle('hidden', hideHud.includes(name));
  }

  // ── HUD update ─────────────────────────────────────────────────────────────
  function updateHUD() {
    $('pokecoins').textContent = profile.pokecoin;
    const owned = Object.keys(profile.ownedCards || {}).length;
    $('dexCount').textContent = owned;
    const tier = trainerTierGQ(profile.xp || 0);
    $('trainerTitle').textContent = tier.name;
    $('xpFill').style.width = tier.pct + '%';
  }

  function flashCoins(amount) {
    if (!amount) return;
    const el = $('pokecoins').parentElement;
    el.classList.remove('coin-flash');
    void el.offsetWidth; // reflow
    el.classList.add('coin-flash');
    setTimeout(() => el.classList.remove('coin-flash'), 800);
  }

  // ── Home screen ────────────────────────────────────────────────────────────
  function renderHome() {
    updateHUD();
    checkDailyReset(profile);

    // Hall progress bars
    for (const hall of ['math','english','science']) {
      const skills = SKILL_LIST_GQ.filter(s => s.hall === hall);
      const mastered = skills.filter(s => profile.skills[s.id] && profile.skills[s.id].mastered).length;
      const pct = Math.round(100 * mastered / skills.length);
      const bar = $(`bar${hall.charAt(0).toUpperCase()+hall.slice(1)}`);
      if (bar) bar.style.width = pct + '%';
    }

    // Daily quest banner
    const dqBanner = $('dailyQuestBanner');
    const done = profile.dailyQuestDone;
    const prog = profile.dailyQuestProgress || 0;
    dqBanner.innerHTML = done
      ? `<div class="dq-done">✅ Daily Quest Complete! +1 Pack earned</div>`
      : `<div class="dq-progress">📅 Daily Quest: ${prog}/8 correct answers · reward: 1 free pack</div>`;

    // Vault button availability (unlock after 3 math skills graduated)
    const mathMastered = MATH_SKILLS_GQ.filter(s => profile.skills[s.id] && profile.skills[s.id].mastered).length;
    const vaultBtn = $('goVault');
    if (vaultBtn) {
      vaultBtn.disabled = mathMastered < 3;
      vaultBtn.title = mathMastered < 3 ? 'Graduate 3 Math skills to unlock!' : 'Genius Vault';
    }

    show('homeScreen');
  }

  // ── Skill list screen ──────────────────────────────────────────────────────
  function renderSkillList(hall) {
    activeHall = hall;
    const hallNames = { math: 'Math Hall 🔢', english: 'English Hall 📖', science: 'Science Hall 🔬' };
    $('skillTitle').textContent = hallNames[hall] || 'Skills';

    const list = $('skillList');
    list.innerHTML = '';
    const skills = SKILL_LIST_GQ.filter(s => s.hall === hall);

    for (const skill of skills) {
      const sk = profile.skills[skill.id];
      const mastered = sk && sk.mastered;
      const rating = sk ? Math.round(sk.rating) : 250;
      const attempts = sk ? sk.attempts : 0;
      const lastN = sk ? sk.lastAnswers.slice(-8) : [];
      const accuracy = lastN.length ? Math.round(100 * lastN.reduce((a,b)=>a+b,0)/lastN.length) : 0;

      const item = document.createElement('div');
      item.className = `skill-item ${mastered ? 'mastered' : ''}`;
      item.innerHTML = `
        <div class="skill-icon">${skill.icon}</div>
        <div class="skill-info">
          <div class="skill-name">${skill.name}${mastered ? ' 🏅' : ''}</div>
          <div class="skill-desc">${skill.desc}</div>
          ${attempts > 0 ? `<div class="skill-stats">Rating: ${rating} · ${attempts} problems · ${accuracy}% recent</div>` : ''}
        </div>
        <button class="btn-skill-go${mastered ? ' mastered' : ''}" data-id="${skill.id}">
          ${mastered ? 'Review' : 'Train →'}
        </button>`;
      list.appendChild(item);
    }

    list.querySelectorAll('.btn-skill-go').forEach(btn => {
      btn.addEventListener('click', () => startSkillSession(btn.dataset.id));
    });

    show('skillScreen');
  }

  // ── Problem session ────────────────────────────────────────────────────────
  function startSkillSession(skillId) {
    activeSkillId = skillId;
    const pool = PROBLEMS_BY_SKILL_GQ[skillId] || [];
    practicePool = [];
    sessionCorrect = 0;
    sessionTotal = 0;
    practiceIdx = 0;

    for (let i = 0; i < SESSION_LENGTH; i++) {
      const p = pickProblemGQ(profile, skillId, pool);
      if (p) practicePool.push(p);
    }

    if (!practicePool.length) {
      alert('No problems available for this skill yet!');
      return;
    }
    showNextProblem();
  }

  function showNextProblem() {
    if (practiceIdx >= practicePool.length || practiceIdx >= SESSION_LENGTH) {
      endSkillSession();
      return;
    }
    currentProblem = practicePool[practiceIdx];
    practiceIdx++;
    renderProblem(currentProblem);
  }

  function renderProblem(problem) {
    problemStartMs = Date.now();
    const skill = SKILLS_GQ[problem.skillId];

    $('skillLabel').textContent = skill ? skill.name : '';
    $('streakDisplay').textContent = profile.streak >= 3 ? `🔥 ×${profile.streak}` : '';
    $('progressFill').style.width = (100 * (practiceIdx - 1) / SESSION_LENGTH) + '%';

    // Question text
    $('questionText').textContent = problem.prompt;

    // Word problem banner
    const wpDiv = $('wordProblem');
    if (problem.wordProblem) {
      wpDiv.classList.remove('hidden');
      wpDiv.textContent = '📖 Word Problem';
    } else {
      wpDiv.classList.add('hidden');
    }

    // Scene
    const scene = $('sceneContainer');
    scene.innerHTML = '';
    if (problem.sceneType) {
      renderSceneGQ(scene, { type: problem.sceneType, ...problem.sceneData });
    } else {
      // Default scenes based on skill
      const defaults = {
        addition: () => renderSceneGQ(scene, { type:'addition', a: Math.min(problem.answer||5, 10), b: 3 }),
        multiplication: () => renderSceneGQ(scene, { type:'mulArray', rows:3, cols:4 }),
        fractions: () => renderSceneGQ(scene, { type:'fractionPie', numerator:3, denominator:4 }),
        geometry: () => renderSceneGQ(scene, { type:'rectArea', w:6, h:4 }),
        algebra: () => renderSceneGQ(scene, { type:'equation', left:'2x+5', right:'17', value:6 }),
        logic: () => renderSceneGQ(scene, { type:'sequence', terms:[2,4,8,16,32] }),
        space: () => renderSceneGQ(scene, { type:'orbit', planets:['Mercury','Venus','Earth','Mars'] }),
      };
      if (defaults[problem.skillId]) defaults[problem.skillId]();
    }

    // Feedback clear
    const fb = $('feedbackBox');
    fb.classList.add('hidden');
    fb.className = 'feedback-box hidden';

    // Solution button
    $('showSolutionBtn').classList.add('hidden');

    // Input type
    if (problem.type === 'math') {
      $('mathInputArea').classList.remove('hidden');
      $('choices').classList.add('hidden');
      $('choices').innerHTML = '';
      const inp = $('mathInput');
      inp.value = '';
      inp.disabled = false;
      setTimeout(() => inp.focus(), 100);
    } else {
      $('mathInputArea').classList.add('hidden');
      renderChoices(problem);
    }

    show('playScreen');
  }

  function renderChoices(problem) {
    const container = $('choices');
    container.innerHTML = '';
    container.classList.remove('hidden');
    problem.choices.forEach((ch, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = ch;
      btn.addEventListener('click', () => handleMCQAnswer(idx, btn, problem));
      container.appendChild(btn);
    });
  }

  function handleMCQAnswer(idx, btn, problem) {
    // Disable all buttons
    $('choices').querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    const correct = idx === problem.correctIdx;
    submitAnswer(correct, problem, btn);
  }

  function handleMathSubmit() {
    const raw = $('mathInput').value;
    const { correct } = gradeMathGQ(raw, currentProblem.answer,
      { tolerance: currentProblem.tolerance !== undefined ? currentProblem.tolerance : 1e-6 });
    $('mathInput').disabled = true;
    submitAnswer(correct, currentProblem, null);
  }

  function submitAnswer(correct, problem, choiceBtn) {
    const responseMs = Date.now() - problemStartMs;
    const result = recordAnswerGQ(profile, problem.skillId, problem, correct, responseMs);
    saveProfileGQ(profile);

    sessionTotal++;
    if (correct) sessionCorrect++;

    updateHUD();
    flashCoins(result.coins);

    // Show feedback
    const fb = $('feedbackBox');
    fb.className = 'feedback-box ' + (correct ? 'feedback-correct' : 'feedback-wrong');
    if (correct) {
      fb.innerHTML = `✅ Correct! <span class="coin-reward">+${result.coins} ₽</span>` +
        (profile.streak >= 5 ? ` 🔥 ${profile.streak}-streak bonus!` : '');
      $('streakDisplay').textContent = profile.streak >= 3 ? `🔥 ×${profile.streak}` : '';
    } else {
      const ans = problem.type === 'math' ? ` (Answer: ${problem.answer})` : '';
      fb.innerHTML = `❌ Not quite.${ans}${problem.hint ? ` 💡 <em>${problem.hint}</em>` : ''}`;
      if (choiceBtn) {
        const btns = $('choices').querySelectorAll('.choice-btn');
        btns[problem.correctIdx].classList.add('choice-correct');
        choiceBtn.classList.add('choice-wrong');
      }
      $('showSolutionBtn').classList.remove('hidden');
    }
    fb.classList.remove('hidden');

    // Graduation check
    if (result.graduated) {
      pendingGradSkillId = problem.skillId;
    }

    // Next problem after delay
    setTimeout(() => {
      if (pendingGradSkillId) {
        showGraduation(pendingGradSkillId);
        pendingGradSkillId = null;
      } else {
        showNextProblem();
      }
    }, correct ? 1400 : 2600);
  }

  // ── Solution walkthrough ───────────────────────────────────────────────────
  function showSolution(problem) {
    const steps = problem.stepSolution || [];
    const container = $('solutionSteps');
    container.innerHTML = '';

    if (!steps.length) {
      container.innerHTML = '<p>No step-by-step guide available for this problem.</p>';
    } else {
      steps.forEach((step, i) => {
        const panel = document.createElement('div');
        panel.className = 'solution-panel';
        const num = document.createElement('div');
        num.className = 'sol-step-num';
        num.textContent = `Step ${i+1}`;
        const body = document.createElement('p');
        body.className = 'sol-step-body';
        body.textContent = step.text || '';
        panel.appendChild(num);
        panel.appendChild(body);

        // Vault-style step (has heading+formula)
        if (step.heading) {
          num.textContent = step.heading;
          body.textContent = step.body || '';
          if (step.formula) {
            const fEl = document.createElement('div');
            fEl.className = 'sol-formula';
            fEl.textContent = step.formula;
            panel.appendChild(fEl);
          }
        }
        container.appendChild(panel);
      });
    }

    $('gotItBtn').onclick = () => {
      show('playScreen');
      showNextProblem();
    };
    show('solutionScreen');
  }

  // ── Graduation screen ──────────────────────────────────────────────────────
  function showGraduation(skillId) {
    const skill = SKILLS_GQ[skillId];
    $('gradSkill').textContent = skill ? skill.name : skillId;
    $('gradTitle').textContent = '🏅 Skill Mastered!';
    $('gradContinueBtn').onclick = () => {
      // Check win condition
      if (checkWinGQ(profile) && !profile.champion) {
        profile.champion = true;
        saveProfileGQ(profile);
        showChampionScreen();
      } else {
        showNextProblem();
      }
    };
    show('graduationScreen');
    setTimeout(()=>{ /* small delay for CSS anim */ }, 50);
  }

  // ── End skill session ──────────────────────────────────────────────────────
  function endSkillSession() {
    const pct = sessionTotal > 0 ? Math.round(100 * sessionCorrect / sessionTotal) : 0;
    const fb = $('feedbackBox');
    fb.className = 'feedback-box feedback-correct';
    fb.innerHTML = `🎉 Session done! ${sessionCorrect}/${sessionTotal} correct (${pct}%)`;
    fb.classList.remove('hidden');
    $('progressFill').style.width = '100%';
    $('choices').innerHTML = '';
    $('choices').classList.add('hidden');
    $('mathInputArea').classList.add('hidden');
    $('questionText').textContent = '';
    $('sceneContainer').innerHTML = '';
    $('showSolutionBtn').classList.add('hidden');
    setTimeout(() => renderHome(), 2000);
  }

  // ── Vault screen ───────────────────────────────────────────────────────────
  function renderVault() {
    const list = $('vaultList');
    list.innerHTML = '';
    VAULT_PROBLEMS_GQ.forEach(vp => {
      const solved = (profile.vaultSolved || []).includes(vp.id);
      const div = document.createElement('div');
      div.className = `vault-item ${solved ? 'vault-solved' : ''}`;
      div.innerHTML = `
        <div class="vault-icon">${solved ? '⚡✓' : '⚡'}</div>
        <div class="vault-info">
          <div class="vault-title">${vp.title}</div>
          <div class="vault-diff">${vp.difficulty}</div>
        </div>
        <button class="btn-vault-go" data-id="${vp.id}">${solved ? 'Revisit' : 'Challenge!'}</button>`;
      div.querySelector('.btn-vault-go').addEventListener('click', () => startVaultProblem(vp.id));
      list.appendChild(div);
    });
    $('closeVaultBtn').onclick = renderHome;
    show('vaultScreen');
  }

  function startVaultProblem(vaultId) {
    activeVaultProblem = VAULT_BY_ID_GQ[vaultId];
    if (!activeVaultProblem) return;
    $('vaultQuestion').textContent = activeVaultProblem.prompt;
    $('vaultScene').innerHTML = '';
    $('vaultFeedback').classList.add('hidden');
    $('vaultInput').value = '';
    $('vaultInput').disabled = false;
    $('vaultSolutionBtn').textContent = '🪄 Reveal Solution';
    $('vaultSolutionBtn').onclick = () => revealVaultSolution(activeVaultProblem);
    show('vaultPlayScreen');
  }

  function checkVaultAnswer() {
    if (!activeVaultProblem) return;
    const raw = $('vaultInput').value;
    const { correct } = gradeMathGQ(raw, activeVaultProblem.answer, { tolerance: 0.5 });
    $('vaultInput').disabled = true;
    const fb = $('vaultFeedback');
    fb.className = 'feedback-box ' + (correct ? 'feedback-correct' : 'feedback-wrong');

    if (correct) {
      const alreadySolved = (profile.vaultSolved || []).includes(activeVaultProblem.id);
      if (!alreadySolved) {
        profile.vaultSolved = profile.vaultSolved || [];
        profile.vaultSolved.push(activeVaultProblem.id);
        profile.pokecoin += ENGINE_GQ.POKECOIN_VAULT;
        profile.xp = (profile.xp || 0) + ENGINE_GQ.XP_PER_VAULT;
        saveProfileGQ(profile);
        fb.innerHTML = `🌟 GENIUS! +${ENGINE_GQ.POKECOIN_VAULT} ₽ · +${ENGINE_GQ.XP_PER_VAULT} XP`;
        updateHUD();
        flashCoins(ENGINE_GQ.POKECOIN_VAULT);
        if (checkWinGQ(profile)) {
          profile.champion = true;
          saveProfileGQ(profile);
          setTimeout(showChampionScreen, 2000);
        }
      } else {
        fb.innerHTML = `✅ Correct! (Already solved before)`;
      }
    } else {
      fb.innerHTML = `❌ Not quite. ${activeVaultProblem.hint ? '💡 ' + activeVaultProblem.hint : ''}`;
    }
    fb.classList.remove('hidden');
  }

  function revealVaultSolution(vp) {
    if (!vp) return;
    const sol = vp.solution;
    const fb = $('vaultFeedback');
    let html = `<div class="vault-sol-narrative"><em>${sol.narrative}</em></div>`;
    sol.steps.forEach((s, i) => {
      html += `<div class="vault-sol-step">
        <strong>Step ${i+1}: ${s.heading}</strong>
        <p>${s.body}</p>
        <div class="sol-formula">${s.formula}</div>
      </div>`;
    });
    fb.innerHTML = html;
    fb.className = 'feedback-box feedback-solution';
    fb.classList.remove('hidden');
  }

  // ── Hall of Fame ───────────────────────────────────────────────────────────
  function renderHof() {
    const list = $('hofList');
    list.innerHTML = '';
    const hof = profile.hallOfFame || [];
    if (!hof.length) {
      list.innerHTML = '<p class="hof-empty">No skills mastered yet. Keep training!</p>';
    } else {
      hof.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'hof-entry';
        div.innerHTML = `<div class="hof-medal">🏅</div>
          <div class="hof-skill">${entry.name}</div>
          <div class="hof-date">${entry.date}</div>`;
        list.appendChild(div);
      });
    }
    $('closeHofBtn').onclick = renderHome;
    show('hofScreen');
  }

  // ── Parent dashboard ───────────────────────────────────────────────────────
  function renderParent() {
    const content = $('parentContent');
    content.innerHTML = '';
    const tier = trainerTierGQ(profile.xp || 0);
    const owned = Object.keys(profile.ownedCards || {}).length;
    const mastered = (profile.hallOfFame || []).length;
    const vault = (profile.vaultSolved || []).length;

    const summary = document.createElement('div');
    summary.className = 'parent-summary';
    summary.innerHTML = `
      <div class="parent-stat"><div class="ps-val">${tier.name}</div><div class="ps-label">Trainer Rank</div></div>
      <div class="parent-stat"><div class="ps-val">${profile.xp || 0}</div><div class="ps-label">Total XP</div></div>
      <div class="parent-stat"><div class="ps-val">${profile.pokecoin}</div><div class="ps-label">PokéCoins</div></div>
      <div class="parent-stat"><div class="ps-val">${owned}</div><div class="ps-label">Cards Owned</div></div>
      <div class="parent-stat"><div class="ps-val">${mastered}</div><div class="ps-label">Skills Mastered</div></div>
      <div class="parent-stat"><div class="ps-val">${vault}/15</div><div class="ps-label">Vault Solved</div></div>
    `;
    content.appendChild(summary);

    // Per-skill breakdown
    const heading = document.createElement('h3');
    heading.textContent = 'Skill Progress';
    heading.style.cssText = 'color:#ffd014;margin:16px 0 8px';
    content.appendChild(heading);

    const table = document.createElement('table');
    table.className = 'parent-table';
    table.innerHTML = `<thead><tr>
      <th>Skill</th><th>Hall</th><th>Rating</th><th>Attempts</th><th>Correct</th><th>Mastered</th>
    </tr></thead>`;
    const tbody = document.createElement('tbody');
    for (const skill of SKILL_LIST_GQ) {
      const sk = profile.skills[skill.id];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${skill.icon} ${skill.name}</td>
        <td style="text-transform:capitalize">${skill.hall}</td>
        <td>${sk ? Math.round(sk.rating) : '–'}</td>
        <td>${sk ? sk.attempts : 0}</td>
        <td>${sk ? sk.correctTotal : 0}</td>
        <td>${sk && sk.mastered ? '🏅 Yes' : '–'}</td>`;
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    content.appendChild(table);

    $('closeParentBtn').onclick = renderHome;
    show('parentScreen');
  }

  // ── Shop & Pack ────────────────────────────────────────────────────────────
  function openShop() {
    renderShop(profile,
      (isFree) => {
        if (isFree && (profile.packs || 0) > 0) {
          profile.packs--;
        } else if (!isFree) {
          if (profile.pokecoin < SHOP_PACK_PRICE) return;
          profile.pokecoin -= SHOP_PACK_PRICE;
        }
        saveProfileGQ(profile);
        updateHUD();
        openPackReveal(rollPack());
      },
      (card, price) => {
        if (profile.pokecoin < price) return;
        profile.pokecoin -= price;
        profile.ownedCards[card.id] = (profile.ownedCards[card.id] || 0) + 1;
        saveProfileGQ(profile);
        updateHUD();
        renderShop(profile, arguments.callee, arguments[1], arguments[2]);
      },
      renderHome
    );
    show('shopScreen');
  }

  function openPackReveal(cards) {
    // Add to owned
    cards.forEach(card => {
      profile.ownedCards[card.id] = (profile.ownedCards[card.id] || 0) + 1;
    });
    saveProfileGQ(profile);
    updateHUD();

    revealPack(cards, $('packReveal'), null);
    $('packDoneBtn').onclick = () => {
      if (checkWinGQ(profile)) {
        profile.champion = true;
        saveProfileGQ(profile);
        showChampionScreen();
      } else {
        renderHome();
      }
    };
    show('packScreen');
  }

  // ── Champion screen ────────────────────────────────────────────────────────
  function showChampionScreen() {
    // Render illustrator card
    const illustDiv = $('illustratorCard');
    illustDiv.innerHTML = '';
    renderIllustratorFull(illustDiv);

    // Give the master card
    const masterCard = POKEMON_CARDS.find(c => c.rarity === 'master');
    if (masterCard && !(profile.ownedCards[masterCard.id] > 0)) {
      profile.ownedCards[masterCard.id] = 1;
      saveProfileGQ(profile);
    }

    // Confetti
    spawnConfetti();

    $('championCloseBtn').onclick = renderHome;
    show('championScreen');
  }

  function spawnConfetti() {
    const wrap = $('confettiWrap');
    wrap.innerHTML = '';
    const colors = ['#ffd014','#cc0000','#7c3aed','#0694a2','#fff','#f472b6'];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = (Math.random() * 3) + 's';
      p.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      p.style.transform = `rotate(${Math.random()*360}deg)`;
      wrap.appendChild(p);
    }
  }

  // ── Numpad wiring ──────────────────────────────────────────────────────────
  function wireNumpad(inputId, submitFn) {
    const inp = $(inputId);
    document.querySelectorAll('.numpad .np').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = btn.dataset.v;
        if (v === '⌫') { inp.value = inp.value.slice(0, -1); }
        else if (v === '✓') { submitFn(); }
        else if (v === '−') { inp.value += '-'; }
        else if (v === '/') { inp.value += '/'; }
        else { inp.value += v; }
        inp.focus();
      });
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitFn();
    });
  }

  // ── Wire vault numpad separately (its own numpad sibling) ─────────────────
  function wireVaultNumpad() {
    const inp = $('vaultInput');
    const numpadBtns = $('vaultInputArea').querySelectorAll('.np');
    numpadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const v = btn.dataset.v;
        if (v === '⌫') { inp.value = inp.value.slice(0, -1); }
        else if (v === '✓') { checkVaultAnswer(); }
        else if (v === '−') { inp.value += '-'; }
        else if (v === '/') { inp.value += '/'; }
        else if (v === ' ') { inp.value += ' '; }
        else { inp.value += v; }
        inp.focus();
      });
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') checkVaultAnswer();
    });
  }

  // ── Sparkle animation on correct answer ──────────────────────────────────
  function sparkleAt(el) {
    const sparks = ['✨','⭐','💫','🌟'];
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle-float';
      s.textContent = sparks[i % sparks.length];
      s.style.cssText = `position:fixed;left:${rect.left + Math.random()*rect.width}px;
        top:${rect.top}px;pointer-events:none;font-size:${16+Math.random()*12}px;
        animation:sparkle 0.9s ease-out forwards;z-index:9999`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  function init() {
    profile = loadProfileGQ();
    checkDailyReset(profile);

    // Hall hero animations on home
    renderHallHero($('goMath').querySelector('.hall-icon') ||
      document.createElement('div'), 'math');

    // Welcome
    $('startBtn').addEventListener('click', () => {
      saveProfileGQ(profile);
      renderHome();
    });
    $('resetBtn').addEventListener('click', () => {
      if (confirm('Reset ALL progress? This cannot be undone!')) {
        resetProfileGQ();
        profile = newProfileGQ();
        saveProfileGQ(profile);
        location.reload();
      }
    });

    // Home nav
    $('homeBtn').addEventListener('click', renderHome);
    $('goMath').addEventListener('click', () => renderSkillList('math'));
    $('goEnglish').addEventListener('click', () => renderSkillList('english'));
    $('goScience').addEventListener('click', () => renderSkillList('science'));
    $('goShop').addEventListener('click', openShop);
    $('goHallOfFame').addEventListener('click', renderHof);
    $('goVault').addEventListener('click', () => {
      const mathMastered = MATH_SKILLS_GQ.filter(s => profile.skills[s.id] && profile.skills[s.id].mastered).length;
      if (mathMastered < 3) {
        alert('Graduate 3 Math skills to unlock the Genius Vault!');
        return;
      }
      renderVault();
    });

    // Skill screen back
    $('skillTitle').addEventListener('click', renderHome);

    // Solution screen
    $('showSolutionBtn').addEventListener('click', () => showSolution(currentProblem));

    // Math input
    wireNumpad('mathInput', handleMathSubmit);

    // Vault numpad
    wireVaultNumpad();

    // Collection / Pokédex
    $('collectionBtn').addEventListener('click', () => {
      renderDex(profile, (card) => {
        renderCardDetail(card, profile, () => show('dexScreen'));
        show('cardDetailScreen');
      }, renderHome);
      show('dexScreen');
    });

    // Parent
    $('parentBtn').addEventListener('click', renderParent);

    // Hall hero SVG in home buttons
    const hallHeroData = [
      ['goMath', 'math'], ['goEnglish', 'english'], ['goScience', 'science']
    ];
    hallHeroData.forEach(([btnId, hall]) => {
      const iconEl = $(btnId).querySelector('.hall-icon');
      if (iconEl) renderHallHero(iconEl, hall);
    });

    show('welcomeScreen');
  }

  // ── Daily quest counter in HUD ─────────────────────────────────────────────
  // Patch recordAnswerGQ to also update daily banner
  const _origRecord = window.recordAnswerGQ;

  document.addEventListener('DOMContentLoaded', init);
})();
