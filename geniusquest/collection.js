// GeniusQuest — Pokédex Collection screen + Card Detail

function renderDex(profile, onCardClick, onClose) {
  const owned = profile.ownedCards || {};
  const total = POKEMON_CARDS.length;
  const ownedCount = Object.keys(owned).length;
  const pct = Math.round(100 * ownedCount / total);

  // Progress bar
  document.getElementById('dexProgressFill').style.width = pct + '%';
  document.getElementById('dexProgressLabel').textContent =
    `${ownedCount} / ${total} (${pct}%)`;

  const grid = document.getElementById('dexGrid');
  grid.innerHTML = '';

  // Group by rarity for ordering
  const rarityOrder = { common:0, uncommon:1, rare:2, holo:3, legendary:4, master:5 };
  const sorted = [...POKEMON_CARDS].sort((a, b) => {
    const rd = rarityOrder[a.rarity] - rarityOrder[b.rarity];
    if (rd !== 0) return rd;
    return (a.dexNo || 0) - (b.dexNo || 0);
  });

  for (const card of sorted) {
    const isOwned = (owned[card.id] || 0) > 0;
    const count = owned[card.id] || 0;
    const slot = document.createElement('div');
    slot.className = 'dex-slot' + (isOwned ? ` r-${card.rarity}` : ' dex-unknown');
    slot.title = isOwned ? card.name : '???';

    if (isOwned) {
      const artDiv = document.createElement('div');
      artDiv.className = 'dex-art';
      renderPokemonArt(artDiv, card, 52);
      slot.appendChild(artDiv);
      const nameEl = document.createElement('div');
      nameEl.className = 'dex-name';
      nameEl.textContent = card.name;
      slot.appendChild(nameEl);
      if (count > 1) {
        const cntEl = document.createElement('div');
        cntEl.className = 'dex-count';
        cntEl.textContent = `×${count}`;
        slot.appendChild(cntEl);
      }
      slot.addEventListener('click', () => onCardClick(card));
    } else {
      slot.innerHTML = `<div class="dex-mystery">?</div>
        <div class="dex-dex-num">#${String(card.dexNo || '').padStart(3,'0')}</div>`;
    }
    grid.appendChild(slot);
  }

  document.getElementById('closeDexBtn').onclick = onClose;
  // Update HUD dex count
  document.getElementById('dexCount').textContent = ownedCount;
}

function renderCardDetail(card, profile, onClose) {
  const inner = document.getElementById('cardDetailInner');
  inner.innerHTML = '';

  const count = (profile.ownedCards[card.id] || 0);

  // Large art
  const artWrap = document.createElement('div');
  artWrap.className = 'detail-art-wrap';
  artWrap.style.cssText = `display:flex;justify-content:center;margin-bottom:12px`;
  renderPokemonArt(artWrap, card, 140);
  inner.appendChild(artWrap);

  // Name + dex number
  const heading = document.createElement('h2');
  heading.className = 'detail-name';
  heading.textContent = `#${String(card.dexNo||'').padStart(3,'0')} ${card.name}`;
  inner.appendChild(heading);

  // Types
  const typeRow = document.createElement('div');
  typeRow.className = 'detail-types';
  for (const t of [card.type1, card.type2].filter(Boolean)) {
    const badge = document.createElement('span');
    badge.className = `type-badge type-${t.toLowerCase()}`;
    badge.textContent = t;
    typeRow.appendChild(badge);
  }
  inner.appendChild(typeRow);

  // Rarity
  const rar = document.createElement('div');
  rar.className = `rarity-badge r-${card.rarity} detail-rarity`;
  rar.textContent = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);
  inner.appendChild(rar);

  // Flavor
  if (card.flavor) {
    const fl = document.createElement('p');
    fl.className = 'detail-flavor';
    fl.textContent = `"${card.flavor}"`;
    inner.appendChild(fl);
  }

  // Owned count
  const ownEl = document.createElement('p');
  ownEl.className = 'detail-owned';
  ownEl.textContent = `You own: ${count} cop${count===1?'y':'ies'}`;
  inner.appendChild(ownEl);

  document.getElementById('closeDetailBtn').onclick = onClose;
}
