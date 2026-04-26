// CardQuest — deck validation, shuffle, draw

const DECK_SIZE = 30;
const MAX_COPIES = 3;

function validateDeck(deck) {
  if (!Array.isArray(deck)) return { ok: false, reason: 'Deck must be an array' };
  if (deck.length !== DECK_SIZE) return { ok: false, reason: `Deck must be exactly ${DECK_SIZE} cards (you have ${deck.length})` };
  const counts = {};
  for (const id of deck) {
    if (!getCard(id)) return { ok: false, reason: `Unknown card: ${id}` };
    counts[id] = (counts[id] || 0) + 1;
    if (counts[id] > MAX_COPIES) return { ok: false, reason: `Too many copies of ${getCard(id).name}` };
  }
  return { ok: true };
}

function shuffleDeck(deckIds) {
  const a = deckIds.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build runtime card instances (each gets a unique uid for board tracking)
let _uid = 0;
function instantiate(cardId) {
  const def = getCard(cardId);
  if (!def) return null;
  return {
    uid: ++_uid,
    id: cardId,
    def,
    attack: def.attack,
    hp: def.hp,
    maxHp: def.hp,
    keywords: (def.keywords || []).slice(),
    summoningSick: !(def.keywords || []).includes('rush'),
    frozen: false,
    attacksRemaining: 0,
  };
}

function buildLibrary(deckIds) {
  return shuffleDeck(deckIds).map(id => instantiate(id));
}

function drawCards(library, hand, n, maxHand = 10) {
  const drawn = [];
  for (let i = 0; i < n; i++) {
    if (library.length === 0) {
      drawn.push({ fatigue: true });
    } else if (hand.length >= maxHand) {
      const burned = library.shift();
      drawn.push({ burned, card: burned });
    } else {
      const card = library.shift();
      hand.push(card);
      drawn.push({ card });
    }
  }
  return drawn;
}

// Auto-fill: take starter as base, then top up from owned cards
function autoBuildDeck(profile) {
  const owned = profile.ownedCards || {};
  const deck = [];
  const counts = {};
  // Start from owned, picking up to MAX_COPIES of each, prefer rares first
  const ids = Object.keys(owned);
  ids.sort((a, b) => {
    const ra = ['common','uncommon','rare','epic'].indexOf(getCard(a)?.rarity || 'common');
    const rb = ['common','uncommon','rare','epic'].indexOf(getCard(b)?.rarity || 'common');
    return rb - ra;
  });
  for (const id of ids) {
    if (deck.length >= DECK_SIZE) break;
    const have = owned[id] || 0;
    const take = Math.min(have, MAX_COPIES, DECK_SIZE - deck.length);
    for (let i = 0; i < take; i++) deck.push(id);
    counts[id] = take;
  }
  // Top up from STARTER_DECK if short
  for (const id of STARTER_DECK) {
    if (deck.length >= DECK_SIZE) break;
    counts[id] = counts[id] || 0;
    if (counts[id] < MAX_COPIES) {
      deck.push(id);
      counts[id]++;
    }
  }
  return deck.slice(0, DECK_SIZE);
}
