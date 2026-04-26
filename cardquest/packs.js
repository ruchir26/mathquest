// CardQuest — pack opening with 3-puzzle gate

const PACK = {
  state: null,    // { puzzlesAnswered, correctCount, currentPuzzle }
};

function startPackOpen() {
  if (GAME.profile.packs <= 0) { showToast('No packs to open.'); return; }
  PACK.state = { puzzlesAnswered: 0, correctCount: 0 };
  document.getElementById('packStartBtn').classList.add('hidden');
  document.getElementById('packDoneBtn').classList.add('hidden');
  document.getElementById('packReveal').innerHTML = '';
  updatePackStatus();
  nextPackPuzzle();
}

function nextPackPuzzle() {
  if (PACK.state.puzzlesAnswered >= 3) {
    finishPackOpen();
    return;
  }
  const skills = ['add_basic','sub_basic','mult_basic','div_basic'];
  const skill = skills[PACK.state.puzzlesAnswered % skills.length];
  const puzzle = pickPuzzle(GAME.profile, skill);
  showPuzzleModal(puzzle, `Pack puzzle ${PACK.state.puzzlesAnswered + 1} of 3`, (choice) => {
    closePuzzleModal();
    if (choice === null) {
      // cancel = refund pack stays, abort
      PACK.state = null;
      document.getElementById('packStartBtn').classList.remove('hidden');
      document.getElementById('packStatus').textContent = 'Cancelled.';
      return;
    }
    const result = gradeAnswer(puzzle, choice.value, 5000, GAME.profile);
    if (result.correct) PACK.state.correctCount += 1;
    PACK.state.puzzlesAnswered += 1;
    updatePackStatus();
    setTimeout(nextPackPuzzle, 400);
  });
}

function updatePackStatus() {
  const s = PACK.state;
  document.getElementById('packStatus').textContent =
    `Puzzles: ${s.puzzlesAnswered}/3 · Correct: ${s.correctCount}`;
}

function finishPackOpen() {
  const correct = PACK.state.correctCount;
  // 5 cards per pack; one slot upgraded by performance
  const cards = rollPack(correct);
  // Add to collection
  cards.forEach(c => {
    GAME.profile.ownedCards[c.id] = (GAME.profile.ownedCards[c.id] || 0) + 1;
  });
  GAME.profile.packs -= 1;
  saveProfile(GAME.profile);
  refreshHud();

  // Reveal
  document.getElementById('packReveal').innerHTML = cards.map((c, i) => `
    <div class="reveal-card element-${c.element} rarity-${c.rarity}" style="animation-delay:${i*0.15}s">
      <div class="rc-art">${cardArtSvg(c.art, c.element)}</div>
      <div class="rc-name">${c.name}</div>
      <div class="rc-rarity">${c.rarity}</div>
    </div>`).join('');
  document.getElementById('packStatus').textContent =
    correct === 3 ? '🌟 Perfect! Guaranteed rare.'
    : correct === 2 ? '✨ Great! Guaranteed uncommon.'
    : correct === 1 ? '👍 Good. All commons + a bonus.'
    : '😅 Try again next time — all commons.';
  document.getElementById('packDoneBtn').classList.remove('hidden');
  PACK.state = null;
}

function rollPack(correctCount) {
  const out = [];
  // 5 commons by default
  for (let i = 0; i < 4; i++) out.push(rollByRarity('common'));
  let bonusRarity = 'common';
  if (correctCount === 3) bonusRarity = Math.random() < 0.4 ? 'epic' : 'rare';
  else if (correctCount === 2) bonusRarity = 'uncommon';
  else if (correctCount === 1) bonusRarity = Math.random() < 0.3 ? 'uncommon' : 'common';
  out.push(rollByRarity(bonusRarity));
  return out;
}

function rollByRarity(rarity) {
  const pool = CARDS.filter(c => c.rarity === rarity);
  const fallback = CARDS.filter(c => c.rarity === 'common');
  const list = pool.length ? pool : fallback;
  return list[Math.floor(Math.random() * list.length)];
}
