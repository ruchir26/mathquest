// CardQuest — NPC trader (Mira). Ratio puzzle gates trades.

const TRADER = {
  state: null,
};

function openTrader() {
  showScreen('tradeScreen');
  TRADER.state = { offers: rollTradeOffers() };
  renderTrader();
}

function rollTradeOffers() {
  return [
    { id: 'commons_for_uncommon', give: 4, giveRarity: 'common', getRarity: 'uncommon' },
    { id: 'uncommons_for_rare',   give: 3, giveRarity: 'uncommon', getRarity: 'rare' },
    { id: 'gold_for_pack',        give: 25, giveCurrency: 'gold', getPack: 1 },
  ];
}

function renderTrader() {
  const el = document.getElementById('tradeContent');
  const haveCommons = countRarity('common');
  const haveUncommons = countRarity('uncommon');
  el.innerHTML = `
    <div class="trade-info">
      You have: <b>${haveCommons}</b> commons · <b>${haveUncommons}</b> uncommons · <b>${GAME.profile.gold}</b> gold
    </div>
    <div class="trade-list">
      ${TRADER.state.offers.map(o => renderOffer(o)).join('')}
    </div>
  `;
  el.querySelectorAll('[data-offer]').forEach(node => {
    node.onclick = () => attemptTrade(node.dataset.offer);
  });
}

function renderOffer(o) {
  let label;
  if (o.giveCurrency) {
    label = `Trade ${o.give} 🪙 → 1 📦 pack`;
  } else {
    const giveEmoji = rarityEmoji(o.giveRarity);
    const getEmoji = rarityEmoji(o.getRarity);
    label = `Trade ${o.give} ${giveEmoji} ${o.giveRarity} → 1 ${getEmoji} ${o.getRarity}`;
  }
  return `<button class="primary-btn trade-offer" data-offer="${o.id}">${label}</button>`;
}

function rarityEmoji(r) {
  return { common: '⚪', uncommon: '🟢', rare: '🔵', epic: '🟣' }[r] || '⚪';
}

function countRarity(rarity) {
  let n = 0;
  for (const id in GAME.profile.ownedCards) {
    const c = getCard(id);
    if (c && c.rarity === rarity) n += GAME.profile.ownedCards[id];
  }
  return n;
}

function attemptTrade(offerId) {
  const offer = TRADER.state.offers.find(o => o.id === offerId);
  if (!offer) return;

  // Gate with a ratio puzzle
  const puzzle = pickPuzzle(GAME.profile, 'ratio_basic');
  showPuzzleModal(puzzle, `Mira: "Solve this and the trade is yours!"`, (choice) => {
    closePuzzleModal();
    if (choice === null) return;
    const result = gradeAnswer(puzzle, choice.value, 5000, GAME.profile);
    if (!result.correct) {
      document.getElementById('traderQuote').textContent = '"Hmm, not quite. Try another time!"';
      return;
    }
    executeTrade(offer);
  });
}

function executeTrade(offer) {
  if (offer.giveCurrency === 'gold') {
    if (GAME.profile.gold < offer.give) { showToast('Not enough gold.'); return; }
    GAME.profile.gold -= offer.give;
    GAME.profile.packs += offer.getPack;
    document.getElementById('traderQuote').textContent = '"A pleasure! Enjoy your pack."';
  } else {
    // Need to give cards of the right rarity
    if (countRarity(offer.giveRarity) < offer.give) {
      showToast(`Not enough ${offer.giveRarity}s.`);
      return;
    }
    let toRemove = offer.give;
    for (const id in GAME.profile.ownedCards) {
      if (toRemove <= 0) break;
      const c = getCard(id);
      if (!c || c.rarity !== offer.giveRarity) continue;
      const take = Math.min(toRemove, GAME.profile.ownedCards[id]);
      GAME.profile.ownedCards[id] -= take;
      toRemove -= take;
      if (GAME.profile.ownedCards[id] <= 0) delete GAME.profile.ownedCards[id];
    }
    // Give one of target rarity
    const reward = rollByRarity(offer.getRarity);
    GAME.profile.ownedCards[reward.id] = (GAME.profile.ownedCards[reward.id] || 0) + 1;
    document.getElementById('traderQuote').textContent = `"Take this ${reward.name}. Use it well."`;
  }
  saveProfile(GAME.profile);
  refreshHud();
  renderTrader();
}
