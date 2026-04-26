// CardQuest — campaign zones & encounters (Fire Realm MVP)

const ZONES = [
  {
    id: 'fire_realm',
    name: 'Fire Realm',
    emoji: '🔥',
    desc: 'The Cinder Warden has hidden the cards in volcanic vaults.',
    encounters: [
      { id: 'fr1', name: 'Lost Ember Scout',  emoji: '🔥', deck: 'easy', hp: 18, startMana: 0 },
      { id: 'fr2', name: 'Salamander Pack',   emoji: '🦎', deck: 'easy', hp: 20, startMana: 0 },
      { id: 'fr3', name: 'Forge Captain',     emoji: '⚔️', deck: 'med',  hp: 22, startMana: 0 },
      { id: 'fr4', name: 'Drake Rider',       emoji: '🐉', deck: 'med',  hp: 24, startMana: 1 },
      { id: 'fr5', name: 'Cinder Warden',     emoji: '👹', deck: 'boss', hp: 28, startMana: 1, boss: true },
    ],
  },
];

function renderZones() {
  const el = document.getElementById('zoneList');
  el.innerHTML = ZONES.map(z => {
    const prog = GAME.profile.progress[z.id] || { battlesWon: 0, bossDefeated: false };
    return `<div class="zone-card">
      <div class="zone-header">
        <span class="zone-emoji">${z.emoji}</span>
        <h3>${z.name}</h3>
        <span class="zone-progress">${prog.battlesWon}/${z.encounters.length}</span>
      </div>
      <p class="zone-desc">${z.desc}</p>
      <div class="encounter-list">
        ${z.encounters.map((e, i) => {
          const done = i < prog.battlesWon;
          const locked = i > prog.battlesWon;
          const cls = done ? 'done' : (locked ? 'locked' : 'available');
          return `<button class="encounter-btn ${cls}" data-zone="${z.id}" data-enc="${e.id}" ${locked?'disabled':''}>
            <span class="enc-emoji">${e.emoji}</span>
            <span class="enc-name">${e.name}${e.boss ? ' 👑' : ''}</span>
            <span class="enc-status">${done ? '✅' : (locked ? '🔒' : '▶')}</span>
          </button>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
  el.querySelectorAll('.encounter-btn').forEach(node => {
    node.onclick = () => beginEncounter(node.dataset.zone, node.dataset.enc);
  });
}

function beginEncounter(zoneId, encId) {
  const zone = ZONES.find(z => z.id === zoneId);
  const enc = zone.encounters.find(e => e.id === encId);
  if (!enc) return;
  GAME.activeEncounter = { zoneId, encId };

  const deckIds = (GAME.profile.deck && GAME.profile.deck.length === DECK_SIZE)
    ? GAME.profile.deck
    : STARTER_DECK;
  const v = validateDeck(deckIds);
  if (!v.ok) { showToast(v.reason); return; }

  const oppDeck = OPP_DECKS[enc.deck] || OPP_DECKS.easy;
  showScreen('battleScreen');
  startBattle(deckIds, oppDeck, {
    name: enc.name, emoji: enc.emoji,
    hp: enc.hp, startMana: enc.startMana, startBoard: [],
  });
}

function recordEncounterWin() {
  if (!GAME.activeEncounter) return;
  const { zoneId, encId } = GAME.activeEncounter;
  const zone = ZONES.find(z => z.id === zoneId);
  const idx = zone.encounters.findIndex(e => e.id === encId);
  const prog = GAME.profile.progress[zoneId] || { battlesWon: 0, bossDefeated: false };
  if (idx === prog.battlesWon) prog.battlesWon = idx + 1;
  if (zone.encounters[idx].boss) prog.bossDefeated = true;
  GAME.profile.progress[zoneId] = prog;
  saveProfile(GAME.profile);
}
