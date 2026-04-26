// CardQuest — battle state machine + animated UI

const BATTLE = {
  state: null,
  pendingMath: null,
  pendingTarget: null,
  log: [],
  selectedAttacker: null,
  prevHp: { you: 20, opp: 20 },
};

function startBattle(playerDeck, oppDeckIds, opponentMeta) {
  const youLib = buildLibrary(playerDeck);
  const oppLib = buildLibrary(oppDeckIds);
  const youHand = [];
  const oppHand = [];
  drawCards(youLib, youHand, 3);
  drawCards(oppLib, oppHand, 4);

  BATTLE.state = {
    activePlayer: 0,
    turn: 1,
    phase: 'MAIN',
    winner: null,
    players: [
      { name: 'You', emoji: '🦊', isYou: true,
        hp: 20, maxHp: 20, mana: 1, manaMax: 1,
        library: youLib, hand: youHand, board: [] },
      { name: opponentMeta.name, emoji: opponentMeta.emoji, isYou: false,
        hp: opponentMeta.hp || 20, maxHp: opponentMeta.hp || 20,
        mana: opponentMeta.startMana || 0, manaMax: opponentMeta.startMana || 0,
        library: oppLib, hand: oppHand, board: opponentMeta.startBoard || [] },
    ],
    opponentMeta,
  };
  BATTLE.log = [`⚔️ Battle vs ${opponentMeta.name} begins.`];
  BATTLE.prevHp = { you: 20, opp: opponentMeta.hp || 20 };
  BATTLE.selectedAttacker = null;
  renderBattle();
}

function logBattle(text) {
  if (Array.isArray(text)) BATTLE.log.push(...text); else BATTLE.log.push(text);
  if (BATTLE.log.length > 80) BATTLE.log = BATTLE.log.slice(-80);
}

function endTurn() {
  if (BATTLE.state.winner || BATTLE.pendingMath || BATTLE.pendingTarget) return;
  const s = BATTLE.state;
  s.activePlayer = 1 - s.activePlayer;
  if (s.activePlayer === 0) s.turn += 1;
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
    logBattle(`💀 ${cur.name} fatigue 1 damage.`);
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
    else if (act.type === 'attack') resolveAttack(act.attacker, act.target, true);
    else if (act.type === 'end') { renderBattle(); setTimeout(endTurn, 600); return; }
    checkWin();
    renderBattle();
    setTimeout(step, 650);
  }
  step();
}

function aiPlayCard(card, target) {
  const me = BATTLE.state.players[BATTLE.state.activePlayer];
  if (card.def.type === 'creature') {
    card.attacksRemaining = (card.keywords || []).includes('rush') ? 1 : 0;
    logBattle(`🎴 ${me.name} plays ${card.def.name}.`);
  } else if (card.def.type === 'spell') {
    logBattle(`✨ ${me.name} casts ${card.def.name}.`);
    (card.def.effects || []).forEach(e => {
      const r = applyEffect(BATTLE.state, e, card, target, {});
      logBattle(r.logs);
    });
  } else if (card.def.type === 'math') {
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

  // Animate the played card from hand
  const handIdx = you.hand.indexOf(card);
  const handEl = document.querySelector(`.hand-card[data-idx="${handIdx}"]`);
  if (handEl) {
    handEl.classList.add('played');
  }

  setTimeout(() => {
    you.mana -= card.def.cost;
    const idx = you.hand.indexOf(card);
    if (idx >= 0) you.hand.splice(idx, 1);

    if (card.def.type === 'creature') {
      if (you.board.length >= 7) {
        you.mana += card.def.cost;
        you.hand.push(card);
        showToast('Board full.');
        renderBattle();
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
  }, handEl ? 350 : 0);
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
    logBattle(`🧮 ${card.def.name}: ${result.correct ? '✓ right' : '½ half'} → ${amount}.`);
    const r = applyEffect(BATTLE.state, { id: sc.effect, target: sc.target }, card, target, { amountOverride: amount });
    logBattle(r.logs);
    BATTLE.pendingMath = null;
    renderBattle();
    checkWin();
    refreshHud();
  });
}

function resolveAttack(attacker, target, isOpponent = false) {
  if (!attacker || attacker.attacksRemaining <= 0 || attacker.summoningSick || attacker.frozen) return;

  // Animate attacker lunge
  const atkEl = document.querySelector(`.board-card[data-uid="${attacker.uid}"]`);
  if (atkEl) atkEl.classList.add(isOpponent ? 'attacking-down' : 'attacking-up');

  if (target.kind === 'hero') {
    const dmg = attacker.attack + elementBonus(attacker.def.element, 'neutral');
    target.player.hp -= dmg;
    logBattle(`⚔️ ${attacker.def.name} hits ${target.player.name} for ${dmg}.`);
    floatNumberAtHero(target.player.isYou ? 'you' : 'opp', dmg, 'damage');
    flashHero(target.player.isYou ? 'you' : 'opp');
  } else if (target.kind === 'creature') {
    const c = target.creature;
    const dmgToC = attacker.attack + elementBonus(attacker.def.element, c.def.element);
    const dmgBack = c.attack + elementBonus(c.def.element, attacker.def.element);
    c.hp -= dmgToC;
    attacker.hp -= dmgBack;
    logBattle(`⚔️ ${attacker.def.name} ⇄ ${c.def.name} (${dmgToC}/${dmgBack}).`);
    flashCard(c.uid);
    if (dmgBack > 0) flashCard(attacker.uid);
    floatNumberAtCard(c.uid, dmgToC, 'damage');
    if (dmgBack > 0) floatNumberAtCard(attacker.uid, dmgBack, 'damage');
    if (c.hp <= 0) { animateDeath(c); }
    if (attacker.hp <= 0) { animateDeath(attacker); }
  }
  attacker.attacksRemaining -= 1;

  setTimeout(() => {
    // Actually remove dead creatures from state after animation
    BATTLE.state.players.forEach(p => {
      p.board = p.board.filter(c => c.hp > 0);
    });
    renderBattle();
    checkWin();
  }, 600);
}

function animateDeath(creature) {
  const el = document.querySelector(`.board-card[data-uid="${creature.uid}"]`);
  if (el) {
    el.classList.add('dying');
    setTimeout(() => {}, 600);
  }
  logBattle(`☠️ ${creature.def.name} destroyed.`);
}

function flashCard(uid) {
  const el = document.querySelector(`.board-card[data-uid="${uid}"]`);
  if (el) {
    el.classList.add('damaged');
    setTimeout(() => el.classList.remove('damaged'), 400);
  }
}
function flashHero(side) {
  const el = document.getElementById(side === 'you' ? 'youPortrait' : 'oppPortrait');
  if (el) {
    el.classList.add('damaged');
    setTimeout(() => el.classList.remove('damaged'), 400);
  }
}

function floatNumberAtHero(side, n, kind) {
  const portrait = document.getElementById(side === 'you' ? 'youPortrait' : 'oppPortrait');
  const layer = document.getElementById('floatingDamage');
  if (!portrait || !layer) return;
  const r = portrait.getBoundingClientRect();
  const lr = layer.getBoundingClientRect();
  const x = r.left + r.width / 2 - lr.left;
  const y = r.top + r.height / 2 - lr.top;
  spawnFloat(layer, x, y, n, kind);
}
function floatNumberAtCard(uid, n, kind) {
  const card = document.querySelector(`.board-card[data-uid="${uid}"]`);
  const layer = document.getElementById('floatingDamage');
  if (!card || !layer) return;
  const r = card.getBoundingClientRect();
  const lr = layer.getBoundingClientRect();
  const x = r.left + r.width / 2 - lr.left;
  const y = r.top + r.height / 2 - lr.top;
  spawnFloat(layer, x, y, n, kind);
}
function spawnFloat(layer, x, y, n, kind) {
  const el = document.createElement('div');
  el.className = 'float-num ' + (kind || 'damage');
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.textContent = (kind === 'heal' ? '+' : '-') + n;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function checkWin() {
  if (BATTLE.state.winner) return;
  const [you, opp] = BATTLE.state.players;
  if (opp.hp <= 0 && you.hp <= 0) BATTLE.state.winner = 'draw';
  else if (opp.hp <= 0) BATTLE.state.winner = 'you';
  else if (you.hp <= 0) BATTLE.state.winner = 'opp';
  if (BATTLE.state.winner) {
    setTimeout(() => onBattleEnd(BATTLE.state.winner), 800);
  }
}

// ===== UI =====

function renderBattle() {
  if (!BATTLE.state) return;
  const s = BATTLE.state;
  const [you, opp] = s.players;

  // HP numbers
  document.getElementById('youHp').textContent = Math.max(0, you.hp);
  document.getElementById('youMaxHp').textContent = you.maxHp;
  document.getElementById('youDeck').textContent = you.library.length;
  document.getElementById('oppHp').textContent = Math.max(0, opp.hp);
  document.getElementById('oppMaxHp').textContent = opp.maxHp;
  document.getElementById('oppDeck').textContent = opp.library.length;
  document.getElementById('oppHandCount').textContent = opp.hand.length;
  document.getElementById('oppName').textContent = opp.name;

  // Portraits (blood-fill)
  document.getElementById('youPortrait').innerHTML = heroPortraitSvg('you', you.hp, you.maxHp, '🦊');
  document.getElementById('oppPortrait').innerHTML = heroPortraitSvg('opp', opp.hp, opp.maxHp, opp.emoji);

  // Floating damage from HP delta
  const youDelta = BATTLE.prevHp.you - you.hp;
  const oppDelta = BATTLE.prevHp.opp - opp.hp;
  if (youDelta > 0) floatNumberAtHero('you', youDelta, 'damage');
  if (oppDelta > 0) floatNumberAtHero('opp', oppDelta, 'damage');
  if (youDelta < 0) floatNumberAtHero('you', -youDelta, 'heal');
  if (oppDelta < 0) floatNumberAtHero('opp', -oppDelta, 'heal');
  BATTLE.prevHp = { you: you.hp, opp: opp.hp };

  // Mana crystals
  document.getElementById('youManaCrystals').innerHTML = manaCrystalsHtml(you.mana, you.manaMax);
  document.getElementById('oppManaCrystals').innerHTML = manaCrystalsHtml(opp.mana, opp.manaMax);

  // Opp hand of card-backs
  const oppHandEl = document.getElementById('oppHand');
  oppHandEl.innerHTML = opp.hand.map(() => `<div class="card-back">${cardBackSvg()}</div>`).join('');

  document.getElementById('turnIndicator').textContent =
    s.activePlayer === 0 ? `Your Turn (${s.turn})` : `Enemy Turn (${s.turn})`;
  document.getElementById('endTurnBtn').disabled = s.activePlayer !== 0 || !!BATTLE.pendingMath || !!BATTLE.pendingTarget;

  renderBoardRow('youBoard', you.board, 'you');
  renderBoardRow('oppBoard', opp.board, 'opp');
  renderHand(you.hand);

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
    const sel = (BATTLE.selectedAttacker && BATTLE.selectedAttacker.uid === c.uid) ? ' selected' : '';
    return `<div class="board-card element-${c.def.element} rarity-${c.def.rarity || 'common'}${sick}${frozen}${ready}${sel}" data-uid="${c.uid}" data-side="${side}">
      <div class="bc-art">${cardArtSvg(c.def.art, c.def.element)}</div>
      <div class="bc-name">${c.def.name}</div>
      <div class="bc-stats"><span class="atk">⚔ ${c.attack}</span><span class="hp">❤ ${c.hp}/${c.maxHp}</span></div>
    </div>`;
  }).join('');
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
    return `<div class="hand-card element-${c.def.element} rarity-${c.def.rarity}${playable ? ' playable' : ''}" data-idx="${idx}" style="animation-delay:${idx*0.05}s">
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
    const needsTarget = needsTargetForCard(card);
    if (needsTarget) {
      BATTLE.pendingTarget = { card, kinds: needsTarget };
      showToast(`Pick a target for ${card.def.name}`);
      // highlight enemy hero if possible target
      if (needsTarget.includes('hero')) {
        document.getElementById('oppPortrait').classList.add('targetable');
      }
      renderBattle();
    } else {
      youPlayCard(card, null);
    }
  }
}

function needsTargetForCard(card) {
  if (card.def.type === 'math') {
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
    document.getElementById('oppPortrait').classList.remove('targetable');
    youPlayCard(card, { kind: 'creature', creature: t });
    return;
  }
  if (side !== 'you') {
    if (BATTLE.selectedAttacker) {
      const target = findTargetByUid(uid);
      if (target) {
        const enemyTaunts = BATTLE.state.players[1].board.filter(c => (c.keywords||[]).includes('taunt'));
        if (enemyTaunts.length && !enemyTaunts.includes(target)) {
          showToast('Must attack taunt first.');
          return;
        }
        const atk = BATTLE.selectedAttacker;
        BATTLE.selectedAttacker = null;
        document.getElementById('oppPortrait').classList.remove('targetable');
        resolveAttack(atk, { kind: 'creature', creature: target }, false);
      }
    }
    return;
  }
  const c = findTargetByUid(uid);
  if (!c) return;
  if (c.summoningSick || c.frozen || c.attacksRemaining <= 0) { showToast('Can\'t attack now.'); return; }
  BATTLE.selectedAttacker = c;
  showToast(`${c.def.name} ready — click enemy.`);
  document.getElementById('oppPortrait').classList.add('targetable');
  renderBattle();
}

function findTargetByUid(uid) {
  for (const p of BATTLE.state.players) {
    const c = p.board.find(c => c.uid === uid);
    if (c) return c;
  }
  return null;
}

function attackEnemyHero() {
  if (!BATTLE.selectedAttacker) return;
  const enemyTaunts = BATTLE.state.players[1].board.filter(c => (c.keywords||[]).includes('taunt'));
  if (enemyTaunts.length) { showToast('Must attack taunt first.'); return; }
  const opp = BATTLE.state.players[1];
  const atk = BATTLE.selectedAttacker;
  BATTLE.selectedAttacker = null;
  document.getElementById('oppPortrait').classList.remove('targetable');
  resolveAttack(atk, { kind: 'hero', player: opp }, false);
}

function attackPlayerHeroAsTarget() {
  if (!BATTLE.pendingTarget) return false;
  if (!BATTLE.pendingTarget.kinds.includes('hero')) return false;
  const card = BATTLE.pendingTarget.card;
  BATTLE.pendingTarget = null;
  document.getElementById('oppPortrait').classList.remove('targetable');
  youPlayCard(card, { kind: 'hero', player: BATTLE.state.players[1] });
  return true;
}

function onBattleEnd(winner) {
  GAME.lastBattleResult = winner;
  if (winner === 'you') {
    GAME.profile.gold += 15;
    GAME.profile.packs += 1;
    saveProfile(GAME.profile);
    refreshHud();
    refreshShopStock(); // shop refreshes after every battle
    showResult(true, BATTLE.state.opponentMeta);
  } else {
    showResult(false, BATTLE.state.opponentMeta);
  }
}
