// GeniusQuest — Pack Reveal
// Animated fan-out of 5 cards, foil shimmer for holo+, legendary glow

function revealPack(cards, container, onDone) {
  container.innerHTML = '';
  container.className = 'pack-reveal';

  cards.forEach((card, idx) => {
    const slot = document.createElement('div');
    slot.className = 'pack-card-slot';
    slot.style.animationDelay = `${idx * 0.15}s`;

    // Inner wrapper for flip
    const inner = document.createElement('div');
    inner.className = 'pack-card-inner';

    // Back face
    const back = document.createElement('div');
    back.className = 'pack-card-back';
    back.innerHTML = `<div class="card-back-design">🎴</div>`;

    // Front face
    const front = document.createElement('div');
    front.className = `pack-card-front r-${card.rarity}`;
    if (card.rarity === 'holo') front.classList.add('holo-shimmer');
    if (card.rarity === 'legendary') front.classList.add('legend-glow');
    if (card.rarity === 'master') front.classList.add('master-glow');

    const artDiv = document.createElement('div');
    artDiv.className = 'pack-art-area';
    renderPokemonArt(artDiv, card, 80);

    const nameEl = document.createElement('div');
    nameEl.className = 'pack-card-name';
    nameEl.textContent = card.name;

    const rarityEl = document.createElement('div');
    rarityEl.className = `rarity-badge r-${card.rarity}`;
    rarityEl.textContent = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);

    const flavorEl = document.createElement('div');
    flavorEl.className = 'pack-card-flavor';
    flavorEl.textContent = card.flavor || '';

    front.appendChild(artDiv);
    front.appendChild(nameEl);
    front.appendChild(rarityEl);
    front.appendChild(flavorEl);

    inner.appendChild(back);
    inner.appendChild(front);
    slot.appendChild(inner);

    // Click to flip
    slot.addEventListener('click', () => {
      if (!slot.classList.contains('flipped')) {
        slot.classList.add('flipped');
        inner.classList.add('flipped');
        // Screen shake for legendary
        if (card.rarity === 'legendary' || card.rarity === 'master') {
          document.getElementById('packScreen').classList.add('shake');
          setTimeout(() => document.getElementById('packScreen').classList.remove('shake'), 500);
        }
      }
    });

    container.appendChild(slot);
  });

  // Auto-flip all after 3s
  setTimeout(() => {
    container.querySelectorAll('.pack-card-slot:not(.flipped)').forEach(s => {
      s.classList.add('flipped');
      s.querySelector('.pack-card-inner').classList.add('flipped');
    });
  }, 3000);
}
