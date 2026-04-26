// CardQuest — static card catalog (~50 cards for MVP)
// Elements: fire, water, earth, air, spirit, neutral
// Types: creature, spell, math (math = spell whose effect scales with puzzle answer)

const CARDS = [
  // ===== FIRE — 12 cards =====
  { id: 'fire_imp',       name: 'Cinder Imp',     type: 'creature', element: 'fire', cost: 1, rarity: 'common',   art: 'imp',        attack: 2, hp: 1, keywords: ['rush'], flavor: 'Burns hot, thinks fast.' },
  { id: 'fire_sala',      name: 'Ember Salamander', type: 'creature', element: 'fire', cost: 2, rarity: 'common', art: 'salamander', attack: 3, hp: 2, keywords: [],       flavor: 'Leaves a trail of sparks.' },
  { id: 'fire_drake',     name: 'Lava Drake',     type: 'creature', element: 'fire', cost: 4, rarity: 'uncommon', art: 'drake',      attack: 4, hp: 4, keywords: [],       flavor: 'Wings of molten ash.' },
  { id: 'fire_phoenix',   name: 'Reborn Phoenix', type: 'creature', element: 'fire', cost: 6, rarity: 'rare',     art: 'phoenix',    attack: 5, hp: 5, keywords: ['rush'], flavor: 'Rises from its own ashes.' },
  { id: 'fire_elemental', name: 'Fire Elemental', type: 'creature', element: 'fire', cost: 5, rarity: 'uncommon', art: 'elemental',  attack: 4, hp: 5, keywords: [],       flavor: 'Pure flame given form.' },
  { id: 'fire_bolt',      name: 'Fire Bolt',      type: 'spell',    element: 'fire', cost: 1, rarity: 'common',   art: 'bolt',       effects: [{ id: 'deal_damage', amount: 2, target: 'any' }], flavor: 'Quick. Hot. Done.' },
  { id: 'fire_flame',     name: 'Flame Burst',    type: 'spell',    element: 'fire', cost: 3, rarity: 'common',   art: 'flame',      effects: [{ id: 'deal_damage', amount: 4, target: 'any' }], flavor: 'A roar of orange.' },
  { id: 'fire_wildfire',  name: 'Wildfire',       type: 'spell',    element: 'fire', cost: 5, rarity: 'rare',     art: 'flame',      effects: [{ id: 'damage_all_enemies', amount: 3 }], flavor: 'Spreads in every direction.' },
  // Math cards
  { id: 'fire_math_bolt', name: 'Math Bolt',      type: 'math',     element: 'fire', cost: 2, rarity: 'uncommon', art: 'bolt', flavor: 'Solve it. Burn it.',
    puzzle: { skillId: 'mult_basic', scaling: { effect: 'deal_damage', target: 'any', cap: 12 } } },
  { id: 'fire_math_blaze',name: 'Blaze of Numbers',type: 'math',    element: 'fire', cost: 4, rarity: 'rare',     art: 'flame', flavor: 'A storm of arithmetic.',
    puzzle: { skillId: 'add_basic',  scaling: { effect: 'damage_all_enemies', cap: 10 } } },
  { id: 'fire_math_sun',  name: 'Solar Equation', type: 'math',     element: 'fire', cost: 6, rarity: 'epic',     art: 'phoenix', flavor: 'The sun does the math.',
    puzzle: { skillId: 'mult_basic', scaling: { effect: 'deal_damage', target: 'any', cap: 20 } } },
  { id: 'fire_math_buff', name: 'Forge Buff',     type: 'math',     element: 'fire', cost: 3, rarity: 'uncommon', art: 'sword', flavor: 'Hammer + heat = strength.',
    puzzle: { skillId: 'add_basic',  scaling: { effect: 'buff_attack_all', cap: 4 } } },

  // ===== WATER — 6 cards =====
  { id: 'water_sprite', name: 'Tide Sprite',    type: 'creature', element: 'water', cost: 1, rarity: 'common',   art: 'sprite', attack: 1, hp: 2, keywords: [], flavor: 'Slips between waves.' },
  { id: 'water_wave',   name: 'Crashing Wave',  type: 'spell',    element: 'water', cost: 2, rarity: 'common',   art: 'wave',   effects: [{ id: 'deal_damage', amount: 3, target: 'any' }], flavor: 'It breaks. Then breaks again.' },
  { id: 'water_heal',   name: 'Healing Spring', type: 'spell',    element: 'water', cost: 2, rarity: 'common',   art: 'orb',    effects: [{ id: 'heal_hero', amount: 4 }], flavor: 'Cool. Clear. Calming.' },
  { id: 'water_drake',  name: 'Frost Drake',    type: 'creature', element: 'water', cost: 4, rarity: 'uncommon', art: 'drake',  attack: 3, hp: 5, keywords: [], flavor: 'Breath chills the bones.' },
  { id: 'water_freeze', name: 'Freeze',         type: 'spell',    element: 'water', cost: 1, rarity: 'common',   art: 'orb',    effects: [{ id: 'freeze', target: 'enemy_creature' }], flavor: 'A second of stillness.' },
  { id: 'water_math_heal',name: 'Math Cure',    type: 'math',     element: 'water', cost: 3, rarity: 'uncommon', art: 'orb', flavor: 'Heal what you can compute.',
    puzzle: { skillId: 'add_basic', scaling: { effect: 'heal_hero', cap: 12 } } },

  // ===== EARTH — 5 cards =====
  { id: 'earth_golem',  name: 'Stone Golem',    type: 'creature', element: 'earth', cost: 4, rarity: 'common',   art: 'golem',  attack: 3, hp: 6, keywords: ['taunt'], flavor: 'Slow. Heavy. Yours.' },
  { id: 'earth_wall',   name: 'Stone Wall',     type: 'creature', element: 'earth', cost: 2, rarity: 'common',   art: 'shield', attack: 0, hp: 5, keywords: ['taunt'], flavor: 'Nothing gets past.' },
  { id: 'earth_quake',  name: 'Earthquake',     type: 'spell',    element: 'earth', cost: 4, rarity: 'rare',     art: 'flame',  effects: [{ id: 'damage_all_enemies', amount: 2 }], flavor: 'The ground decides.' },
  { id: 'earth_shield', name: 'Earth Shield',   type: 'spell',    element: 'earth', cost: 1, rarity: 'common',   art: 'shield', effects: [{ id: 'buff_friendly', attack: 0, hp: 3, target: 'friendly_creature' }], flavor: 'Skin like stone.' },
  { id: 'earth_math_golem',name:'Math Golem',   type: 'math',     element: 'earth', cost: 4, rarity: 'uncommon', art: 'golem', flavor: 'Summons stones — count them.',
    puzzle: { skillId: 'div_basic', scaling: { effect: 'summon_tokens', cap: 5 } } },

  // ===== AIR — 4 cards =====
  { id: 'air_sprite',   name: 'Wind Sprite',    type: 'creature', element: 'air',   cost: 1, rarity: 'common',   art: 'sprite', attack: 2, hp: 1, keywords: ['rush'], flavor: 'Gone before you blink.' },
  { id: 'air_gust',     name: 'Gust',           type: 'spell',    element: 'air',   cost: 1, rarity: 'common',   art: 'orb',    effects: [{ id: 'deal_damage', amount: 1, target: 'any' }, { id: 'draw', amount: 1 }], flavor: 'A push and a peek.' },
  { id: 'air_storm',    name: 'Storm Caller',   type: 'creature', element: 'air',   cost: 5, rarity: 'rare',     art: 'elemental',attack:5,hp:4,keywords:['rush'], flavor: 'Brings the thunder.' },
  { id: 'air_math_zap', name: 'Lightning Math', type: 'math',     element: 'air',   cost: 2, rarity: 'uncommon', art: 'bolt', flavor: 'Faster than thought.',
    puzzle: { skillId: 'sub_basic', scaling: { effect: 'deal_damage', target: 'any', cap: 10 } } },

  // ===== SPIRIT — 4 cards =====
  { id: 'spirit_orb',     name: 'Spirit Orb',   type: 'spell',    element: 'spirit',cost: 2, rarity: 'common',   art: 'orb',    effects: [{ id: 'draw', amount: 2 }], flavor: 'Whispers what to do.' },
  { id: 'spirit_guide',   name: 'Spirit Guide', type: 'creature', element: 'spirit',cost: 3, rarity: 'uncommon', art: 'sprite', attack: 2, hp: 4, keywords: [], flavor: 'Walks beside you.' },
  { id: 'spirit_blessing',name:'Blessing',      type: 'spell',    element: 'spirit',cost: 2, rarity: 'common',   art: 'orb',    effects: [{ id: 'buff_friendly', attack: 1, hp: 1, target: 'friendly_creature' }], flavor: 'A small light, all yours.' },
  { id: 'spirit_math_draw',name:'Insight',      type: 'math',     element: 'spirit',cost: 2, rarity: 'uncommon', art: 'orb', flavor: 'Solve to see further.',
    puzzle: { skillId: 'frac_basic', scaling: { effect: 'draw', cap: 4 } } },

  // ===== NEUTRAL — 13 cards (starter-friendly basics) =====
  { id: 'n_recruit',    name: 'Recruit',        type: 'creature', element: 'neutral', cost: 1, rarity: 'common', art: 'sprite', attack: 1, hp: 2, keywords: [], flavor: 'Eager. Untrained.' },
  { id: 'n_squire',     name: 'Squire',         type: 'creature', element: 'neutral', cost: 2, rarity: 'common', art: 'sword',  attack: 2, hp: 3, keywords: [], flavor: 'Holds a real sword now.' },
  { id: 'n_knight',     name: 'Knight',         type: 'creature', element: 'neutral', cost: 4, rarity: 'common', art: 'sword',  attack: 4, hp: 4, keywords: ['taunt'], flavor: 'Honor and steel.' },
  { id: 'n_archer',     name: 'Archer',         type: 'creature', element: 'neutral', cost: 3, rarity: 'common', art: 'sprite', attack: 3, hp: 3, keywords: [], flavor: 'Aim high, breathe out.' },
  { id: 'n_wolf',       name: 'Grey Wolf',      type: 'creature', element: 'neutral', cost: 3, rarity: 'common', art: 'wolf',   attack: 3, hp: 3, keywords: ['rush'], flavor: 'The pack remembers.' },
  { id: 'n_giant',      name: 'Giant',          type: 'creature', element: 'neutral', cost: 6, rarity: 'rare',   art: 'golem',  attack: 6, hp: 7, keywords: [], flavor: 'You feel it before you see it.' },
  { id: 'n_strike',     name: 'Strike',         type: 'spell',    element: 'neutral', cost: 1, rarity: 'common', art: 'sword',  effects: [{ id: 'deal_damage', amount: 2, target: 'any' }], flavor: 'A clean hit.' },
  { id: 'n_rally',      name: 'Rally',          type: 'spell',    element: 'neutral', cost: 2, rarity: 'common', art: 'shield', effects: [{ id: 'buff_attack_all', amount: 1 }], flavor: 'Together, louder.' },
  { id: 'n_potion',     name: 'Healing Potion', type: 'spell',    element: 'neutral', cost: 1, rarity: 'common', art: 'orb',    effects: [{ id: 'heal_hero', amount: 3 }], flavor: 'Tastes like grass.' },
  { id: 'n_scout',      name: 'Scout',          type: 'spell',    element: 'neutral', cost: 1, rarity: 'common', art: 'sprite', effects: [{ id: 'draw', amount: 1 }], flavor: 'Reports back.' },
  { id: 'n_math_strike',name: 'Math Strike',    type: 'math',     element: 'neutral', cost: 2, rarity: 'common', art: 'sword', flavor: 'Solve. Then swing.',
    puzzle: { skillId: 'add_basic', scaling: { effect: 'deal_damage', target: 'any', cap: 8 } } },
  { id: 'n_math_heal',  name: 'Math Mend',      type: 'math',     element: 'neutral', cost: 1, rarity: 'common', art: 'orb', flavor: 'A quick fix.',
    puzzle: { skillId: 'sub_basic', scaling: { effect: 'heal_hero', cap: 6 } } },
  { id: 'n_math_draw',  name: 'Math Study',     type: 'math',     element: 'neutral', cost: 1, rarity: 'common', art: 'orb', flavor: 'Read. Think. Draw.',
    puzzle: { skillId: 'add_basic', scaling: { effect: 'draw', cap: 3 } } },
];

// Quick lookup
const CARDS_BY_ID = {};
CARDS.forEach(c => { CARDS_BY_ID[c.id] = c; });

function getCard(id) { return CARDS_BY_ID[id]; }

// Starter deck (30 cards). Heavy on neutral basics + a few fire.
const STARTER_DECK = [
  'n_recruit','n_recruit','n_recruit',
  'n_squire','n_squire','n_squire',
  'n_knight','n_knight',
  'n_archer','n_archer','n_archer',
  'n_wolf','n_wolf',
  'n_giant',
  'n_strike','n_strike','n_strike',
  'n_rally','n_rally',
  'n_potion','n_potion',
  'n_scout','n_scout',
  'n_math_strike','n_math_strike',
  'n_math_heal','n_math_heal',
  'n_math_draw',
  'fire_imp','fire_bolt',
];

// Opponent decks per encounter difficulty
const OPP_DECKS = {
  easy: [
    'n_recruit','n_recruit','n_recruit','n_recruit',
    'n_squire','n_squire','n_squire',
    'n_knight','n_knight',
    'n_archer','n_archer',
    'n_strike','n_strike','n_strike',
    'n_potion','n_potion',
    'n_scout',
    'fire_imp','fire_imp',
    'fire_sala',
    'fire_bolt','fire_bolt',
    'fire_flame',
    'n_wolf','n_wolf',
    'n_rally',
    'n_recruit','n_squire','n_strike',
  ],
  med: [
    'n_squire','n_squire','n_squire',
    'n_knight','n_knight','n_knight',
    'n_archer','n_archer',
    'n_wolf','n_wolf',
    'n_giant',
    'fire_imp','fire_imp',
    'fire_sala','fire_sala',
    'fire_drake','fire_drake',
    'fire_bolt','fire_bolt','fire_bolt',
    'fire_flame','fire_flame',
    'fire_elemental',
    'n_strike','n_strike',
    'n_rally',
    'n_potion',
    'n_scout','n_scout',
  ],
  boss: [
    'fire_imp','fire_imp','fire_imp',
    'fire_sala','fire_sala','fire_sala',
    'fire_drake','fire_drake','fire_drake',
    'fire_elemental','fire_elemental',
    'fire_phoenix','fire_phoenix',
    'fire_bolt','fire_bolt','fire_bolt',
    'fire_flame','fire_flame','fire_flame',
    'fire_wildfire',
    'n_knight','n_knight',
    'n_giant','n_giant',
    'n_strike','n_strike',
    'n_rally','n_rally',
    'n_potion','n_potion',
  ],
};
