// CardQuest — top-level orchestration

const GAME = {
  profile: null,
  activeEncounter: null,
  lastBattleResult: null,
};

const SCREENS = ['titleScreen','howToScreen','mapScreen','battleScreen','resultScreen','collectionScreen','deckScreen','shopScreen','packScreen','tradeScreen'];

function showScreen(id) {
  SCREENS.forEach(s => {
    const el = document.getElementById(s);
    if (!el) return;
    el.classList.toggle('active', s === id);
  });
  // HUD visible everywhere except title & howTo
  const hud = document.getElementById('hud');
  hud.classList.toggle('hidden', id === 'titleScreen' || id === 'howToScreen');
  refreshHud();

  // Per-screen render hooks
  if (id === 'mapScreen') renderZones();
  if (id === 'collectionScreen') renderCollection();
  if (id === 'deckScreen') renderDeck();
  if (id === 'shopScreen') renderShop();
  if (id === 'packScreen') {
    document.getElementById('packStartBtn').classList.toggle('hidden', GAME.profile.packs <= 0);
    document.getElementById('packDoneBtn').classList.add('hidden');
    document.getElementById('packStatus').textContent = GAME.profile.packs > 0
      ? `You have ${GAME.profile.packs} pack(s).`
      : 'No packs yet — win a battle!';
    document.getElementById('packReveal').innerHTML = '';
  }
  // HUD title
  const titles = {
    mapScreen: '🗺️ The Realms', battleScreen: '⚔️ Battle', resultScreen: '🏁 Result',
    collectionScreen: '🎴 Collection', deckScreen: '🛠️ Deck Builder',
    shopScreen: '🛒 Shop', packScreen: '📦 Open Pack', tradeScreen: '🤝 Trader',
  };
  document.getElementById('hudTitle').textContent = titles[id] || 'CardQuest';
}

function refreshHud() {
  if (!GAME.profile) return;
  document.getElementById('goldCount').textContent = GAME.profile.gold;
  document.getElementById('packCount').textContent = GAME.profile.packs;
  const total = Object.values(GAME.profile.ownedCards || {}).reduce((s, n) => s + n, 0);
  document.getElementById('ownedCount').textContent = total;
}

function showToast(msg, ms = 1800) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.add('hidden'), ms);
}

// ===== Puzzle modal =====

function showPuzzleModal(puzzle, contextLabel, onChoose) {
  const m = document.getElementById('puzzleModal');
  m.classList.remove('hidden');
  document.getElementById('puzzleContext').textContent = contextLabel || '';
  document.getElementById('puzzleQuestion').textContent = puzzle.question;
  const cEl = document.getElementById('puzzleChoices');
  cEl.innerHTML = puzzle.choices.map((c, i) =>
    `<button class="choice-btn" data-i="${i}">${c.label}</button>`
  ).join('');
  cEl.querySelectorAll('.choice-btn').forEach((b, i) => {
    b.onclick = () => {
      cEl.querySelectorAll('.choice-btn').forEach(x => x.disabled = true);
      const choice = puzzle.choices[i];
      b.classList.add(choice.isCorrect ? 'right' : 'wrong');
      setTimeout(() => onChoose(choice), 600);
    };
  });
  document.getElementById('puzzleCancelBtn').onclick = () => onChoose(null);
}

function closePuzzleModal() {
  document.getElementById('puzzleModal').classList.add('hidden');
}

// ===== Result screen =====

function showResult(won, opponentMeta) {
  showScreen('resultScreen');
  document.getElementById('resultTitle').textContent = won ? '🏆 Victory!' : '💀 Defeated';
  let html = '';
  if (won) {
    recordEncounterWin();
    html = `
      <p>You defeated <b>${opponentMeta.name}</b>!</p>
      <p class="reward-line">+15 🪙 gold · +1 📦 pack · 🛒 shop refreshed</p>
    `;
  } else {
    html = `
      <p><b>${opponentMeta.name}</b> bested you this time.</p>
      <p>No penalty — try again!</p>
    `;
  }
  document.getElementById('resultDetails').innerHTML = html;
}

// ===== Wire up =====

document.addEventListener('DOMContentLoaded', () => {
  GAME.profile = loadProfile();
  // Seed starter cards on first run
  if (!GAME.profile.ownedCards || Object.keys(GAME.profile.ownedCards).length === 0) {
    STARTER_DECK.forEach(id => {
      GAME.profile.ownedCards[id] = (GAME.profile.ownedCards[id] || 0) + 1;
    });
    GAME.profile.deck = STARTER_DECK.slice();
    saveProfile(GAME.profile);
  }
  refreshHud();
  setupCollectionFilters();
  setupDeckButtons();
  setupShopFilters();
  refreshShopStock();

  document.getElementById('playBtn').onclick = () => showScreen('mapScreen');
  document.getElementById('howToBtn').onclick = () => showScreen('howToScreen');
  document.getElementById('howToCloseBtn').onclick = () => showScreen('titleScreen');
  document.getElementById('resetBtn').onclick = () => {
    if (confirm('Reset all CardQuest progress?')) { resetProfile(); location.reload(); }
  };
  document.getElementById('backBtn').onclick = () => {
    const cur = SCREENS.find(s => document.getElementById(s).classList.contains('active'));
    if (cur === 'battleScreen') {
      if (confirm('Forfeit this battle?')) { showScreen('mapScreen'); }
    } else if (cur === 'resultScreen') showScreen('mapScreen');
    else if (cur === 'collectionScreen' || cur === 'deckScreen' || cur === 'shopScreen' || cur === 'packScreen' || cur === 'tradeScreen') showScreen('mapScreen');
    else showScreen('titleScreen');
  };

  document.getElementById('endTurnBtn').onclick = () => endTurn();
  document.getElementById('resultContinueBtn').onclick = () => {
    if (GAME.lastBattleResult === 'you' && GAME.profile.packs > 0) showScreen('packScreen');
    else showScreen('mapScreen');
  };
  document.getElementById('resultRetryBtn').onclick = () => {
    if (GAME.activeEncounter) beginEncounter(GAME.activeEncounter.zoneId, GAME.activeEncounter.encId);
  };

  document.getElementById('goCollectionBtn').onclick = () => showScreen('collectionScreen');
  document.getElementById('goDeckBtn').onclick = () => showScreen('deckScreen');
  document.getElementById('goShopBtn').onclick = () => openShop();
  document.getElementById('goTradeBtn').onclick = () => openTrader();

  document.getElementById('packStartBtn').onclick = () => startPackOpen();
  document.getElementById('packDoneBtn').onclick = () => showScreen('mapScreen');

  // Click on opp portrait = attack target / spell target
  document.getElementById('oppArea').addEventListener('click', (ev) => {
    if (ev.target.closest('.board-card')) return;
    if (ev.target.closest('.opp-hand')) return;
    if (BATTLE.pendingTarget) { attackPlayerHeroAsTarget(); return; }
    if (BATTLE.selectedAttacker) attackEnemyHero();
  });
});
