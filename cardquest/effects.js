// CardQuest — effect registry. Pure mutations on battle state.
// Each effect: fn(state, source, target, params, context) -> { logs: [] }

const EFFECTS = {
  deal_damage(state, source, target, params, ctx) {
    const amount = ctx.amountOverride != null ? ctx.amountOverride : params.amount;
    return dealDamageTo(state, source, target, amount);
  },

  damage_all_enemies(state, source, target, params, ctx) {
    const amount = ctx.amountOverride != null ? ctx.amountOverride : params.amount;
    const logs = [];
    const enemy = state.players[1 - state.activePlayer];
    enemy.board.slice().forEach(c => {
      logs.push(...damageCreature(state, c, amount, source).logs);
    });
    logs.push(...damageHero(state, enemy, amount, source).logs);
    return { logs };
  },

  heal_hero(state, source, target, params, ctx) {
    const amount = ctx.amountOverride != null ? ctx.amountOverride : params.amount;
    const owner = state.players[state.activePlayer];
    const before = owner.hp;
    owner.hp = Math.min(owner.maxHp, owner.hp + amount);
    const healed = owner.hp - before;
    return { logs: [`✨ Healed ${healed} HP.`] };
  },

  draw(state, source, target, params, ctx) {
    const amount = ctx.amountOverride != null ? ctx.amountOverride : params.amount;
    const owner = state.players[state.activePlayer];
    drawCards(owner.library, owner.hand, amount);
    return { logs: [`🂠 Drew ${amount}.`] };
  },

  buff_attack_all(state, source, target, params, ctx) {
    const amount = ctx.amountOverride != null ? ctx.amountOverride : params.amount;
    const owner = state.players[state.activePlayer];
    owner.board.forEach(c => { c.attack += amount; });
    return { logs: [`💪 +${amount} attack to all friendly creatures.`] };
  },

  buff_friendly(state, source, target, params, ctx) {
    if (!target || target.kind !== 'creature') return { logs: ['No target.'] };
    target.creature.attack += (params.attack || 0);
    target.creature.hp += (params.hp || 0);
    target.creature.maxHp += (params.hp || 0);
    return { logs: [`💪 ${target.creature.def.name} +${params.attack||0}/+${params.hp||0}.`] };
  },

  freeze(state, source, target, params, ctx) {
    if (!target || target.kind !== 'creature') return { logs: ['No target.'] };
    target.creature.frozen = true;
    target.creature.attacksRemaining = 0;
    return { logs: [`❄️ ${target.creature.def.name} frozen.`] };
  },

  summon_tokens(state, source, target, params, ctx) {
    const amount = Math.min(7 - state.players[state.activePlayer].board.length, ctx.amountOverride || 2);
    const owner = state.players[state.activePlayer];
    for (let i = 0; i < amount; i++) {
      owner.board.push({
        uid: Date.now() + i,
        id: 'token_pebble',
        def: { name: 'Pebble', element: 'earth', art: 'shield', cost: 0 },
        attack: 1, hp: 1, maxHp: 1,
        keywords: [], summoningSick: true, frozen: false, attacksRemaining: 0,
      });
    }
    return { logs: [`🪨 Summoned ${amount} pebbles.`] };
  },
};

// === helpers ===

const ELEMENT_WHEEL = { fire: 'air', air: 'earth', earth: 'water', water: 'spirit', spirit: 'fire' };

function elementBonus(srcElement, tgtElement) {
  if (!srcElement || !tgtElement) return 0;
  return ELEMENT_WHEEL[srcElement] === tgtElement ? 1 : 0;
}

function dealDamageTo(state, source, target, amount) {
  if (!target) return { logs: ['No target.'] };
  if (target.kind === 'hero') {
    return damageHero(state, target.player, amount, source);
  }
  if (target.kind === 'creature') {
    return damageCreature(state, target.creature, amount, source);
  }
  return { logs: [] };
}

function damageHero(state, player, amount, source) {
  const bonus = source && source.def ? elementBonus(source.def.element, 'neutral') : 0;
  const total = amount + bonus;
  player.hp -= total;
  return { logs: [`💥 ${total} damage to ${player.name}.`] };
}

function damageCreature(state, creature, amount, source) {
  const bonus = source && source.def ? elementBonus(source.def.element, creature.def.element) : 0;
  const total = amount + bonus;
  creature.hp -= total;
  const logs = [`💥 ${total} damage to ${creature.def.name}.`];
  if (creature.hp <= 0) {
    removeCreature(state, creature);
    logs.push(`☠️ ${creature.def.name} destroyed.`);
  }
  return { logs };
}

function removeCreature(state, creature) {
  for (const p of state.players) {
    const idx = p.board.indexOf(creature);
    if (idx >= 0) p.board.splice(idx, 1);
  }
}

function applyEffect(state, effect, source, target, ctx = {}) {
  const fn = EFFECTS[effect.id];
  if (!fn) return { logs: [`(unknown effect: ${effect.id})`] };
  return fn(state, source, target, effect, ctx);
}
