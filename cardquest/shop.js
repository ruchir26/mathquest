// CardQuest — card shop. Spend gold on specific cards.

const SHOP = {
  filter: 'all',
  stock: null, // refreshed after each battle
};

const SHOP_PRICES = { common: 8, uncommon: 25, rare: 60, epic: 150 };

function refreshShopStock() {
  // 12 cards, weighted toward your missing pieces, mix of rarities.
  const all = CARDS.slice();
  const stock = [];
  const rarityBuckets = { common: [], uncommon: [], rare: [], epic: [] };
  all.forEach(c => { (rarityBuckets[c.rarity] || rarityBuckets.common).push(c); });
  function pick(rarity, n) {
    const pool = rarityBuckets[rarity] || [];
    const out = [];
    const used = new Set();
    while (out.length < n && used.size < pool.length) {
      const c = pool[Math.floor(Math.random() * pool.length)];
      if (used.has(c.id)) continue;
      used.add(c.id);
      out.push(c);
    }
    return out;
  }
  stock.push(...pick('common', 5));
  stock.push(...pick('uncommon', 4));
  stock.push(...pick('rare', 2));
  stock.push(...pick('epic', 1));
  SHOP.stock = stock;
}

function openShop() {
  if (!SHOP.stock) refreshShopStock();
  showScreen('shopScreen');
  renderShop();
}

function renderShop() {
  const grid = document.getElementById('shopGrid');
  if (!SHOP.stock) refreshShopStock();
  const items = SHOP.stock.filter(c =>
    SHOP.filter === 'all' || c.rarity === SHOP.filter
  );
  if (!items.length) {
    grid.innerHTML = '<div class="empty-msg">Shop is empty for this filter.</div>';
    return;
  }
  grid.innerHTML = items.map((c, idx) => {
    const price = SHOP_PRICES[c.rarity] || 10;
    const owned = (GAME.profile.ownedCards[c.id] || 0);
    const canAfford = GAME.profile.gold >= price;
    return `<div class="shop-card element-${c.element} rarity-${c.rarity}" data-id="${c.id}">
      <div class="shop-art">${cardArtSvg(c.art, c.element)}</div>
      <div class="shop-name">${c.name}</div>
      <div class="shop-mini">${c.type === 'creature' ? `⚔${c.attack}/❤${c.hp}` : c.type === 'math' ? '🧮 Math' : '✨ Spell'} · cost ${c.cost} · ${c.rarity}</div>
      <div class="shop-mini">Owned: ${owned}</div>
      <button class="buy-btn" data-buy="${c.id}" ${canAfford ? '' : 'disabled'}>🪙 ${price}</button>
    </div>`;
  }).join('');
  grid.querySelectorAll('[data-buy]').forEach(btn => {
    btn.onclick = () => buyCard(btn.dataset.buy);
  });
}

function buyCard(cardId) {
  const card = getCard(cardId);
  if (!card) return;
  const price = SHOP_PRICES[card.rarity] || 10;
  if (GAME.profile.gold < price) { showToast('Not enough gold.'); return; }
  GAME.profile.gold -= price;
  GAME.profile.ownedCards[cardId] = (GAME.profile.ownedCards[cardId] || 0) + 1;
  saveProfile(GAME.profile);
  refreshHud();
  // Visual flash
  const node = document.querySelector(`.shop-card[data-id="${cardId}"]`);
  if (node) {
    node.classList.add('purchased');
    setTimeout(() => node.classList.remove('purchased'), 600);
  }
  showToast(`Bought ${card.name}!`);
  renderShop();
}

function setupShopFilters() {
  document.querySelectorAll('#shopScreen .filter-btn').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#shopScreen .filter-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      SHOP.filter = b.dataset.shopFilter;
      renderShop();
    };
  });
}
