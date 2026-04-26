// CardQuest — opponent AI: greedy + trade math + lethal check

function aiTakeTurn(state) {
  const me = state.players[state.activePlayer];
  const them = state.players[1 - state.activePlayer];
  const actions = [];

  // 1. Lethal check first
  const reachable = estimateReachableDamage(me, them);
  if (reachable >= them.hp) {
    actions.push({ type: 'log', text: '🐉 Going for lethal!' });
  }

  // 2. Play affordable cards (cost desc, creatures first, then spells)
  let guard = 20;
  while (guard--) {
    const playable = me.hand
      .filter(c => c.def.cost <= me.mana)
      .sort((a, b) => {
        const tb = (a.def.type === 'creature' ? -1 : 0) - (b.def.type === 'creature' ? -1 : 0);
        if (tb !== 0) return tb;
        return b.def.cost - a.def.cost;
      });
    if (!playable.length) break;
    const card = playable[0];

    let target = null;
    if (card.def.type === 'spell') {
      // pick best target for damage spells: kill enemy creature if possible, else face
      const dmgEffect = (card.def.effects || []).find(e => e.id === 'deal_damage');
      if (dmgEffect) {
        const killable = them.board.find(c => c.hp <= dmgEffect.amount);
        target = killable
          ? { kind: 'creature', creature: killable }
          : { kind: 'hero', player: them };
      }
    } else if (card.def.type === 'math') {
      // AI auto-solves correctly with 80% chance; either way picks face
      target = { kind: 'hero', player: them };
    }

    actions.push({ type: 'play', card, target });
    me.mana -= card.def.cost;
    // Simulate the play locally so subsequent decisions account for state
    const idx = me.hand.indexOf(card);
    if (idx >= 0) me.hand.splice(idx, 1);
    if (card.def.type === 'creature') {
      me.board.push(card);
    }
  }

  // 3. Combat: trade math + face damage
  const ready = me.board.filter(c => !c.summoningSick && !c.frozen && c.attacksRemaining > 0 && c.attack > 0);
  const enemyTaunts = them.board.filter(c => (c.keywords || []).includes('taunt'));
  for (const attacker of ready) {
    let target;
    if (enemyTaunts.length) {
      target = { kind: 'creature', creature: enemyTaunts[0] };
    } else if (reachable >= them.hp) {
      target = { kind: 'hero', player: them };
    } else {
      // trade math: kill an enemy without dying
      const safeTrade = them.board.find(c => attacker.attack >= c.hp && c.attack < attacker.hp);
      // remove big threats
      const threat = them.board.find(c => c.attack >= 4);
      target = safeTrade
        ? { kind: 'creature', creature: safeTrade }
        : threat
          ? { kind: 'creature', creature: threat }
          : { kind: 'hero', player: them };
    }
    actions.push({ type: 'attack', attacker, target });
  }

  actions.push({ type: 'end' });
  return actions;
}

function estimateReachableDamage(me, them) {
  let total = 0;
  me.board.forEach(c => {
    if (!c.summoningSick && !c.frozen && c.attacksRemaining > 0) total += c.attack;
  });
  me.hand.forEach(c => {
    if (c.def.cost > me.mana) return;
    (c.def.effects || []).forEach(e => {
      if (e.id === 'deal_damage' && (e.target === 'any' || e.target === 'hero')) total += e.amount;
    });
  });
  return total;
}
