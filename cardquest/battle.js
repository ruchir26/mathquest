// CardQuest — battle state machine + UI

const BATTLE = {
  state: null,
  pendingMath: null,    // { card, target, resolve }
  pendingTarget: null,  // { card, resolve, validKinds }
  log: [],
};

function startBattle(playerDeck, oppDeckIds, opponentMeta) {
  const youLib = buildLibrary(playerDeck);
  const oppLib = buildLibrary(oppDeckIds);
  const youHand = [];
  const oppHand = [];
  drawCards(youLib, youHand, 3);
  drawCards(oppLib, oppHand, 4);

  BATTLE.state = {
    activePlayer: 0,    // 0 = you, 1 = opponent
    turn: 1,
    phase: 'MAIN',
    winner: null,
    players: [
      {
        name: 'You', emoji: '🦊', isYou: true,
        hp: 20, maxHp: 20,
        mana: 1, manaMax: 1,
        library: youLib, hand: youHand, board: [],
      },
      {
        name: opponentMeta.name, emoji: opponentMeta.emoji, isYou: false,
        hp: opponentMeta.hp || 20, maxHp: opponentMeta.hp || 20,
        mana: opponentMeta.startMana || 0, manaMax: opponentMeta.startMana || 0,
        library: oppLib, hand: oppHand, board: opponentMeta.startBoard || [],
      },
    ],
    opponentMeta,
  };
  BATTLE.log = [`⚔️ Battle vs ${opponentMeta.name} begins.`];
  renderBattle();
}

function logBattle(text) {
  if (Array.isArray(text)) BATTLE.log.push(...text); else BATTLE.log.push(text);
  if (BATTLE.log.length > 80) BATTLE.log = BATTLE.log.slice(-80);
}

function endTurn() {
  if (BATTLE.state.winner) return;
  if (BATTLE.pendingMath || BATTLE.pendingTarget) return;
  const s = BATTLE.state;
  s.activePlayer = 1 - s.activePlayer;
  if (s.activePlayer === 0) s.turn += 1;
  // DRAW + MANA
  const cur = s.players[s.activePlayer];
  cur.manaMax = Math.min(10, cur.manaMax + 1);
  cur.mana = cur.manaMax;
  cur.board.forEach(c => {
    c.summoningSick = false;
    c.frozen = false;
    c.attacksRemaining = 1;
  });
  const drawn = drawCards(cur.library, cur.hand, 1);
  if (drawn[0] && drawn[0].fatigue) {
    cur.hp -= 1;
    logBattle(`💀 ${cur.name} has no cards — fatigue 1 damage.`);
  }
  s.phase = 'MAIN';
  checkWin();
  renderBattle();

  if (!s.winner && s.activePlayer === 1) {
    setTimeout(() => runOpponentTurn(), 700);
  }
}

function runOpponentTurn() {
  if (BATTLE.state.winner) return;
  const actions = aiTakeTurn(BATTLE.state);
  let i = 0;
  function step() {
    if (BATTLE.state.winner) return;
    if (i >= actions.length) return;
    const act = actions[i++];
    if (act.type === 'log') logBattle(act.text);
    else if (act.type === 'play') aiPlayCard(act.card, act.target);
    else if (act.type === 'attack') resolveAttack(act.attacker, act.target);
    else if (act.type === 'end') { renderBattle(); setTimeout(endTurn, 500); return; }
    checkWin();
    renderBattle();
    setTimeout(step, 500);
  }
  step();
}

function aiPlayCard(card, target) {
  const me = BATTLE.state.players[BATTLE.state.activePlayer];
  // Card was already removed from hand & mana paid in ai.js simulation,
  // but we need to actually apply effects now.
  if (card.def.type === 'creature') {
    // already pushed to board in ai.js
    card.attacksRemaining = (card.keywords || []).includes('rush') ? 1 : 0;
    logBattle(`🎴 ${me.name} plays ${card.def.name}.`);
  } else if (card.def.type === 'spell') {
    logBattle(`✨ ${me.name} casts ${card.def.name}.`);
    (card.def.effects || []).forEach(e => {
      const r = applyEffect(BATTLE.state, e, card, target, {});
      logBattle(r.logs);
    });
  } else if (card.def.type === 'math') {
    // AI auto-grades
    const aiCorrect = Math.random() < 0.8;
    const sc = card.def.puzzle.scaling;
    const fakeAns = Math.min(sc.cap || 6, 4 + Math.floor(Math.random() * 4));
    const amount = aiCorrect ? fakeAns : Math.floor(fakeAns / 2);
    logBattle(`🧮 ${me.name} casts ${card.def.name} (${aiCorrect ? 'right' : 'half'}: ${amount}).`);
    const r = applyEffect(BATTLE.state, { id: sc.effect, target: sc.target }, card, target, { amountOverride: amount });
    logBattle(r.logs);
  }
}

function youPlayCard(card, target) {
  const you = BATTLE.state.players[0];
  if (BATTLE.state.activePlayer !== 0) return;
  if (card.def.cost > you.mana) { showToast('Not enough mana.'); return; }

  // Spend mana up-front; refund only if math is cancelled
  you.mana -= card.def.cost;
  const idx = you.hand.indexOf(card);
  if (idx >= 0) you.hand.splice(idx, 1);

  if (card.def.type === 'creature') {
    if (you.board.length >= 7) {
      // refund
      you.mana += card.def.cost;
      you.hand.splice(idx, 0, card);
      showToast('Board full.');
      return;
    }
    card.attacksRemaining = (card.keywords || []).includes('rush') ? 1 : 0;
    you.board.push(card);
    logBattle(`🎴 You play ${card.def.name}.`);
    renderBattle();
    checkWin();
  } else if (card.def.type === 'spell') {
    castSpellEffects(card, target);
  } else if (card.def.type === 'math') {
    openPuzzleForCard(card, target);
  }
}

function castSpellEffects(card, target) {
  logBattle(`✨ You cast ${card.def.name}.`);
  (card.def.effects || []).forEach(e => {
    const r = applyEffect(BATTLE.state, e, card, target, {});
    logBattle(r.logs);
  });
  renderBattle();
  checkWin();
}

function openPuzzleForCard(card, target) {
  const puzzle = pickPuzzle(GAME.profile, card.def.puzzle.skillId);
  BATTLE.pendingMath = { card, target, puzzle, startedAt: Date.now() };
  showPuzzleModal(puzzle, `${card.def.name} — solve to power up!`, (choice) => {
    closePuzzleModal();
    if (choice === null) {
      // cancel: refund mana, return card to hand
      const you = BATTLE.state.players[0];
      you.mana += card.def.cost;
      you.hand.push(card);
      BATTLE.pendingMath = null;
      renderBattle();
      return;
    }
    const ms = Date.now() - BATTLE.pendingMath.startedAt;
    const result = gradeAnswer(puzzle, choice.value, ms, GAME.profile);
    const sc = card.def.puzzle.scaling;
    const cap = sc.cap || 99;
    const baseAmount = Math.min(cap, puzzle.answer);
    const amount = result.correct ? baseAmount : Math.floor(baseAmount / 2);
    logBattle(`🧮 ${card.def.name}: ${result.correct ? 'right' : 'half'} → ${amount}.`);
    const r = applyEffect(BATTLE.state, { id: sc.effect, target: sc.target }, card, target, { amountOverride: amount });
    logBattle(r.logs);
    BATTLE.pendingMath = null;
    renderBattle();
    checkWin();
    refreshHud();
  });
}

function resolveAttack(attacker, target) {
  if (!attacker || attacker.attacksRemaining <= 0 || attacker.summoningSick || attacker.frozen) return;
  if (target.kind === 'hero') {
    const dmg = attacker.attack + elementBonus(attacker.def.element, 'neutral');
    target.player.hp -= dmg;
    logBattle(`⚔️ ${attacker.def.name} hits ${target.player.name} for ${dmg}.`);
  } else if (target.kind === 'creature') {
    const c = target.creature;
    const dmgToC = attacker.attack + elementBonus(attacker.def.element, c.def.element);
    const dmgBack = c.attack + elementBonus(c.def.element, attacker.def.element);
    c.hp -= dmgToC;
    attacker.hp -= dmgBack;
    logBattle(`⚔️ ${attacker.def.name} attacks ${c.def.name} (${dmgToC}/${dmgBack}).`);
    if (c.hp <= 0) { removeCreature(BATTLE.state, c); logBattle(`☠️ ${c.def.name} destroyed.`); }
    if (attacker.hp <= 0) { removeCreature(BATTLE.state, attacker); logBattle(`☠️ ${attacker.def.name} destroyed.`); }
  }
  attacker.attacksRemaining -= 1;
  checkWin();
}

function checkWin() {
  if (BATTLE.state.winner) return;
  const [you, opp] = BATTLE.state.players;
  if (opp.hp <= 0 && you.hp <= 0) BATTLE.state.winner = 'draw';
  else if (opp.hp <= 0) BATTLE.state.winner = 'you';
  else if (you.hp <= 0) BATTLE.state.winner = 'opp';
  if (BATTLE.state.winner) {
    setTimeout(() => onBattleEnd(BATTLE.state.winner), 600);
  }
}

// ===== UI rendering =====

function renderBattle() {
  if (!BATTLE.state) return;
  const s = BATTLE.state;
  const [you, opp] = s.players;

  document.getElementById('youHp').textContent = you.hp;
  document.getElementById('youMana').textContent = you.mana;
  document.getElementById('youManaMax').textContent = you.manaMax;
  document.getElementById('youDeck').textContent = you.library.length;
  document.getElementById('oppHp').textContent = opp.hp;
  document.getElementById('oppMana').textContent = opp.mana;
  document.getElementById('oppManaMax').textContent = opp.manaMax;
  document.getElementById('oppDeck').textContent = opp.library.length;
  document.getElementById('oppName').textContent = opp.name;
  document.getElementById('oppEmoji').textContent = opp.emoji;

  document.getElementById('turnIndicator').textContent =
    s.activePlayer === 0 ? `Your Turn (${s.turn})` : `Enemy Turn (${s.turn})`;
  document.getElementById('endTurnBtn').disabled = s.activePlayer !== 0 || !!BATTLE.pendingMath || !!BATTLE.pendingTarget;

  // Boards
  renderBoardRow('youBoard', you.board, 'you');
  renderBoardRow('oppBoard', opp.board, 'opp');

  // Hand (your cards face up)
  renderHand(you.hand);

  // Log
  const logEl = document.getElementById('battleLog');
  logEl.innerHTML = BATTLE.log.slice(-10).map(l => `<div>${l}</div>`).join('');
  logEl.scrollTop = logEl.scrollHeight;
}

function renderBoardRow(elId, board, side) {
  const el = document.getElementById(elId);
  if (!board.length) { el.innerHTML = '<div class="board-empty">— empty —</div>'; return; }
  el.innerHTML = board.map(c => {
    const sick = c.summoningSick ? ' sick' : '';
    const frozen = c.frozen ? ' frozen' : '';
    const ready = (!c.summoningSick && !c.frozen && c.attacksRemaining > 0 && side === 'you') ? ' ready' : '';
    return `<div class="board-card element-${c.def.element}${sick}${frozen}${ready}" data-uid="${c.uid}" data-side="${side}">
      <div class="bc-art">${cardArtSvg(c.def.art, c.def.element)}</div>
      <div class="bc-name">${c.def.name}</div>
      <div class="bc-stats"><span class="atk">⚔ ${c.attack}</span><span class="hp">❤ ${c.hp}/${c.maxHp}</span></div>
    </div>`;
  }).join('');
  // wire clicks
  el.querySelectorAll('.board-card').forEach(node => {
    node.onclick = () => onBoardCardClick(parseInt(node.dataset.uid), node.dataset.side);
  });
}

function renderHand(hand) {
  const el = document.getElementById('youHand');
  if (!hand.length) { el.innerHTML = '<div class="board-empty">— no cards —</div>'; return; }
  const you = BATTLE.state.players[0];
  el.innerHTML = hand.map((c, idx) => {
    const playable = c.def.cost <= you.mana && BATTLE.state.activePlayer === 0;
    return `<div class="hand-card element-${c.def.element} rarity-${c.def.rarity}${playable ? ' playable' : ''}" data-idx="${idx}">
      <div class="hc-cost">${c.def.cost}</div>
      <div class="hc-art">${cardArtSvg(c.def.art, c.def.element)}</div>
      <div class="hc-name">${c.def.name}</div>
      ${c.def.type === 'creature'
        ? `<div class="hc-stats"><span class="atk">⚔ ${c.attack}</span><span class="hp">❤ ${c.hp}</span></div>`
        : `<div class="hc-type">${c.def.type === 'math' ? '🧮 Math' : '✨ Spell'}</div>`}
    </div>`;
  }).join('');
  el.querySelectorAll('.hand-card').forEach(node => {
    node.onclick = () => onHandCardClick(hand[parseInt(node.dataset.idx)]);
  });
}

function onHandCardClick(card) {
  if (BATTLE.state.activePlayer !== 0) return;
  if (BATTLE.pendingMath || BATTLE.pendingTarget) return;
  const you = BATTLE.state.players[0];
  if (card.def.cost > you.mana) { showToast('Not enough mana.'); return; }

  if (card.def.type === 'creature') {
    youPlayCard(card, null);
  } else {
    // need a target for damage / freeze / buff
    const needsTarget = needsTargetForCard(card);
    if (needsTarget) {
      BATTLE.pendingTarget = { card, kinds: needsTarget };
      showToast(`Pick a target for ${card.def.name}`);
      renderBattle();
    } else {
      youPlayCard(card, null);
    }
  }
}

function needsTargetForCard(card) {
  if (card.def.type === 'math') {
    // many math cards target hero (heal_hero / draw / damage_all): only deal_damage needs target
    const sc = card.def.puzzle && card.def.puzzle.scaling;
    if (sc && sc.effect === 'deal_damage') return ['hero', 'creature'];
    return null;
  }
  if (card.def.type === 'spell') {
    const eff = (card.def.effects || []).find(e => ['deal_damage','freeze','buff_friendly'].includes(e.id));
    if (!eff) return null;
    if (eff.id === 'deal_damage') return ['hero', 'creature'];
    if (eff.id === 'freeze') return ['enemy_creature'];
    if (eff.id === 'buff_friendly') return ['friendly_creature'];
  }
  return null;
}

function onBoardCardClick(uid, side) {
  if (BATTLE.state.activePlayer !== 0) return;
  // If we're picking a target for a hand card
  if (BATTLE.pendingTarget) {
    const t = findTargetByUid(uid);
    if (!t) return;
    const allowed = BATTLE.pendingTarget.kinds;
    const wantSide = (allowed.includes('enemy_creature')) ? 'opp'
                   : (allowed.includes('friendly_creature')) ? 'you'
                   : null;
    if (wantSide && side !== wantSide) { showToast('Wrong side.'); return; }
    const card = BATTLE.pendingTarget.card;
    BATTLE.pendingTarget = null;
    youPlayCard(card, { kind: 'creature', creature: t });
    return;
  }
  // Otherwise: declare attack with a friendly creature
  if (side !== 'you') {
    if (BATTLE.selectedAttacker) {
      // attacker hits this enemy creature
      const target = findTargetByUid(uid);
      if (target) {
        // enforce taunt
        const enemyTaunts = BATTLE.state.players[1].board.filter(c => (c.keywords||[]).includes('taunt'));
        if (enemyTaunts.length && !enemyTaunts.includes(target)) {
          showToast('Must attack taunt first.');
          return;
        }
        resolveAttack(BATTLE.selectedAttacker, { kind: 'creature', creature: target });
        BATTLE.selectedAttacker = null;
        renderBattle();
      }
    }
    return;
  }
  const c = findTargetByUid(uid);
  if (!c) return;
  if (c.summoningSick || c.frozen || c.attacksRemaining <= 0) { showToast('Can\'t attack now.'); return; }
  BATTLE.selectedAttacker = c;
  showToast(`${c.def.name} ready — click enemy.`);
  // Allow attack on enemy hero
  highlightEnemyHero();
}

function findTargetByUid(uid) {
  for (const p of BATTLE.state.players) {
    const c = p.board.find(c => c.uid === uid);
    if (c) return c;
  }
  return null;
}

function highlightEnemyHero() {
  const heroEl = document.querySelector('#oppArea .player-info');
  if (heroEl) heroEl.classList.add('targetable');
}

// Click on opp hero (wired in game.js)
function attackEnemyHero() {
  if (!BATTLE.selectedAttacker) return;
  const enemyTaunts = BATTLE.state.players[1].board.filter(c => (c.keywords||[]).includes('taunt'));
  if (enemyTaunts.length) { showToast('Must attack taunt first.'); return; }
  const opp = BATTLE.state.players[1];
  resolveAttack(BATTLE.selectedAttacker, { kind: 'hero', player: opp });
  BATTLE.selectedAttacker = null;
  document.querySelector('#oppArea .player-info')?.classList.remove('targetable');
  renderBattle();
}

function attackPlayerHeroAsTarget() {
  if (!BATTLE.pendingTarget) return false;
  if (!BATTLE.pendingTarget.kinds.includes('hero')) return false;
  const card = BATTLE.pendingTarget.card;
  BATTLE.pendingTarget = null;
  youPlayCard(card, { kind: 'hero', player: BATTLE.state.players[1] });
  return true;
}

function onBattleEnd(winner) {
  GAME.lastBattleResult = winner;
  if (winner === 'you') {
    GAME.profile.gold += 5;
    GAME.profile.packs += 1;
    saveProfile(GAME.profile);
    refreshHud();
    showResult(true, BATTLE.state.opponentMeta);
  } else {
    showResult(false, BATTLE.state.opponentMeta);
  }
}
