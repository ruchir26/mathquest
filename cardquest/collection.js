// CardQuest — collection grid & deck builder

const COLLECTION = {
  filter: 'all',
};

function renderCollection() {
  const grid = document.getElementById('collectionGrid');
  const owned = GAME.profile.ownedCards;
  const ids = Object.keys(owned).filter(id => owned[id] > 0);
  if (!ids.length) {
    grid.innerHTML = '<div class="empty-msg">No cards yet — win battles and open packs!</div>';
    return;
  }
  const filtered = ids.filter(id => {
    if (COLLECTION.filter === 'all') return true;
    const c = getCard(id);
    return c && c.element === COLLECTION.filter;
  });
  grid.innerHTML = filtered.map(id => renderCardTile(getCard(id), owned[id])).join('');
}

function renderCardTile(card, count) {
  if (!card) return '';
  return `<div class="card-tile element-${card.element} rarity-${card.rarity}">
    <div class="ct-cost">${card.cost}</div>
    <div class="ct-count">×${count}</div>
    <div class="ct-art">${cardArtSvg(card.art, card.element)}</div>
    <div class="ct-name">${card.name}</div>
    ${card.type === 'creature'
      ? `<div class="ct-stats"><span class="atk">⚔ ${card.attack}</span><span class="hp">❤ ${card.hp}</span></div>`
      : `<div class="ct-type">${card.type === 'math' ? '🧮 Math' : '✨ Spell'}</div>`}
    <div class="ct-flavor">${card.flavor || ''}</div>
  </div>`;
}

function setupCollectionFilters() {
  document.querySelectorAll('#collectionScreen .filter-btn').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#collectionScreen .filter-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      COLLECTION.filter = b.dataset.filter;
      renderCollection();
    };
  });
}

// ===== Deck Builder =====

function renderDeck() {
  const deck = GAME.profile.deck && GAME.profile.deck.length
    ? GAME.profile.deck.slice()
    : STARTER_DECK.slice();
  GAME.profile.deck = deck;

  document.getElementById('deckSize').textContent = deck.length;

  const owned = GAME.profile.ownedCards || {};
  const deckCounts = {};
  deck.forEach(id => deckCounts[id] = (deckCounts[id] || 0) + 1);

  // "Available" = ownedCards + starter cards (so kid always has something to add)
  const availPool = {};
  STARTER_DECK.forEach(id => { availPool[id] = (availPool[id] || 0) + 1; });
  for (const id in owned) availPool[id] = Math.max(availPool[id] || 0, owned[id]);

  const availIds = Object.keys(availPool);
  const availEl = document.getElementById('deckAvailable');
  availEl.innerHTML = availIds.map(id => {
    const c = getCard(id);
    if (!c) return '';
    const inDeck = deckCounts[id] || 0;
    const canAdd = inDeck < MAX_COPIES && deck.length < DECK_SIZE;
    return `<button class="card-tile small element-${c.element} rarity-${c.rarity}${canAdd?'':' dim'}" data-add="${id}">
      <div class="ct-cost">${c.cost}</div>
      <div class="ct-art">${cardArtSvg(c.art, c.element)}</div>
      <div class="ct-name">${c.name}</div>
      <div class="ct-mini">${c.type === 'creature' ? `⚔${c.attack}/❤${c.hp}` : c.type==='math' ? '🧮' : '✨'} · in deck: ${inDeck}</div>
    </button>`;
  }).join('');
  availEl.querySelectorAll('[data-add]').forEach(b => {
    b.onclick = () => {
      const id = b.dataset.add;
      if (!id) return;
      const inDeck = (GAME.profile.deck.filter(x => x === id)).length;
      if (inDeck >= MAX_COPIES) { showToast('Max 3 copies.'); return; }
      if (GAME.profile.deck.length >= DECK_SIZE) { showToast('Deck is full.'); return; }
      GAME.profile.deck.push(id);
      saveProfile(GAME.profile);
      renderDeck();
    };
  });

  const inDeckEl = document.getElementById('deckInDeck');
  const uniques = Object.keys(deckCounts);
  inDeckEl.innerHTML = uniques.map(id => {
    const c = getCard(id);
    if (!c) return '';
    return `<button class="card-tile small element-${c.element} rarity-${c.rarity}" data-remove="${id}">
      <div class="ct-cost">${c.cost}</div>
      <div class="ct-art">${cardArtSvg(c.art, c.element)}</div>
      <div class="ct-name">${c.name}</div>
      <div class="ct-mini">×${deckCounts[id]} (click to remove 1)</div>
    </button>`;
  }).join('');
  inDeckEl.querySelectorAll('[data-remove]').forEach(b => {
    b.onclick = () => {
      const id = b.dataset.remove;
      const i = GAME.profile.deck.indexOf(id);
      if (i >= 0) GAME.profile.deck.splice(i, 1);
      saveProfile(GAME.profile);
      renderDeck();
    };
  });
}

function setupDeckButtons() {
  document.getElementById('deckClearBtn').onclick = () => {
    GAME.profile.deck = [];
    saveProfile(GAME.profile);
    renderDeck();
  };
  document.getElementById('deckAutoBtn').onclick = () => {
    GAME.profile.deck = autoBuildDeck(GAME.profile);
    saveProfile(GAME.profile);
    renderDeck();
    showToast('Deck auto-filled.');
  };
}
