// CardQuest — rich procedural SVG card art (Pokémon-style figures + scenes)

function svg(tag, attrs = {}, children = '') {
  const parts = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${tag} ${parts}>${children}</${tag}>`;
}
function svgText(x, y, text, attrs = {}) {
  return svg('text', { x, y, 'text-anchor': 'middle', 'font-family': 'system-ui, sans-serif', ...attrs }, text);
}

const ELEMENT_PALETTE = {
  fire:    { primary: '#ff5a3a', accent: '#ffb347', glow: '#ffd089', sky1: '#ff7a3a', sky2: '#5a0a0a', ground: '#3a0a05' },
  water:   { primary: '#3aa8ff', accent: '#7dcfff', glow: '#cfeaff', sky1: '#5fb8ff', sky2: '#063a6a', ground: '#0a2540' },
  earth:   { primary: '#6ec84e', accent: '#a8df7f', glow: '#d6f0c0', sky1: '#88d75f', sky2: '#1f4a1a', ground: '#1f3a10' },
  air:     { primary: '#c8c0ff', accent: '#e5dffd', glow: '#f5f3ff', sky1: '#d6cfff', sky2: '#3a2f7a', ground: '#2a235a' },
  spirit:  { primary: '#ffe070', accent: '#fff2a8', glow: '#fffadb', sky1: '#ffe97a', sky2: '#5a4a10', ground: '#3a2f0a' },
  neutral: { primary: '#9aa3b3', accent: '#c4c9d3', glow: '#e6e8ee', sky1: '#aab2c0', sky2: '#2a2f3a', ground: '#1a1f2a' },
};

const ELEMENT_EMOJI = {
  fire: '🔥', water: '💧', earth: '🌿', air: '💨', spirit: '✨', neutral: '⚪',
};

let _gid = 0;
function uid() { return 'g' + (++_gid); }

// Background scene per element — sky gradient + ground + ambient elements
function sceneBg(pal, seed) {
  const skyId = uid(), grdId = uid();
  const ambient = ambientElements(pal, seed);
  return `
    <defs>
      <linearGradient id="${skyId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${pal.sky1}"/>
        <stop offset="100%" stop-color="${pal.sky2}"/>
      </linearGradient>
      <radialGradient id="${grdId}" cx="50%" cy="100%" r="80%">
        <stop offset="0%" stop-color="${pal.accent}" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="${pal.ground}" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="200" height="160" fill="url(#${skyId})"/>
    <ellipse cx="100" cy="170" rx="180" ry="60" fill="url(#${grdId})"/>
    ${ambient}
  `;
}

function ambientElements(pal, seed) {
  // Floating element-themed flecks for atmosphere
  const out = [];
  for (let i = 0; i < 6; i++) {
    const x = 20 + ((seed * 13 + i * 31) % 160);
    const y = 15 + ((seed * 7 + i * 19) % 90);
    const r = 1.5 + ((seed + i) % 3);
    out.push(svg('circle', { cx: x, cy: y, r, fill: pal.glow, opacity: 0.5 + 0.05 * i }));
  }
  return out.join('');
}

// Eye helper
function eye(cx, cy, r, look = 1) {
  return svg('circle', { cx, cy, r, fill: '#fff' }) +
         svg('circle', { cx: cx + look, cy, r: r * 0.55, fill: '#1a1a2a' }) +
         svg('circle', { cx: cx + look + r * 0.2, cy: cy - r * 0.25, r: r * 0.2, fill: '#fff' });
}

// Procedural creature/spell art per art-key
function cardArtSvg(artKey, element) {
  const pal = ELEMENT_PALETTE[element] || ELEMENT_PALETTE.neutral;
  const seed = artKey.charCodeAt(0) + (artKey.charCodeAt(1) || 0);
  const W = 200, H = 160;
  const bg = sceneBg(pal, seed);

  let body = '';
  switch (artKey) {
    case 'imp':
      body = creatureImp(pal);
      break;
    case 'salamander':
      body = creatureSalamander(pal);
      break;
    case 'phoenix':
      body = creaturePhoenix(pal);
      break;
    case 'drake':
      body = creatureDrake(pal);
      break;
    case 'elemental':
      body = creatureElemental(pal);
      break;
    case 'sprite':
      body = creatureSprite(pal);
      break;
    case 'golem':
      body = creatureGolem(pal);
      break;
    case 'wolf':
      body = creatureWolf(pal);
      break;
    case 'bolt':
      body = spellBolt(pal);
      break;
    case 'flame':
      body = spellFlame(pal);
      break;
    case 'wave':
      body = spellWave(pal);
      break;
    case 'orb':
      body = spellOrb(pal);
      break;
    case 'shield':
      body = spellShield(pal);
      break;
    case 'sword':
      body = spellSword(pal);
      break;
    default:
      body = creatureSprite(pal);
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    ${bg}${body}
  </svg>`;
}

// ===== Creatures =====

function creatureImp(pal) {
  return `
    <ellipse cx="100" cy="135" rx="40" ry="6" fill="#000" opacity="0.4"/>
    <!-- horns -->
    <path d="M75 60 L80 35 L88 60 Z" fill="#3a0a0a"/>
    <path d="M125 60 L120 35 L112 60 Z" fill="#3a0a0a"/>
    <!-- body -->
    <ellipse cx="100" cy="100" rx="32" ry="36" fill="${pal.primary}"/>
    <ellipse cx="100" cy="115" rx="28" ry="22" fill="${pal.accent}"/>
    <!-- arms -->
    <path d="M70 95 Q55 110 60 130 L72 128 Q72 115 82 105 Z" fill="${pal.primary}"/>
    <path d="M130 95 Q145 110 140 130 L128 128 Q128 115 118 105 Z" fill="${pal.primary}"/>
    <!-- claws -->
    <circle cx="62" cy="130" r="4" fill="#3a0a0a"/>
    <circle cx="138" cy="130" r="4" fill="#3a0a0a"/>
    <!-- face -->
    ${eye(88, 90, 6, 1)}
    ${eye(112, 90, 6, -1)}
    <path d="M88 110 Q100 122 112 110" stroke="#3a0a0a" stroke-width="2" fill="none"/>
    <!-- fangs -->
    <path d="M93 110 L91 118 L95 113 Z" fill="#fff"/>
    <path d="M107 110 L109 118 L105 113 Z" fill="#fff"/>
    <!-- flame on head -->
    <path d="M100 60 Q108 45 100 30 Q92 45 100 60 Z" fill="#ffd47e"/>
    <path d="M100 55 Q104 48 100 38 Q96 48 100 55 Z" fill="#fff"/>
  `;
}

function creatureSalamander(pal) {
  return `
    <ellipse cx="100" cy="135" rx="60" ry="6" fill="#000" opacity="0.4"/>
    <!-- tail -->
    <path d="M40 105 Q20 95 25 80 Q40 90 55 100 Z" fill="${pal.primary}"/>
    <!-- body -->
    <ellipse cx="100" cy="105" rx="55" ry="22" fill="${pal.primary}"/>
    <ellipse cx="100" cy="112" rx="48" ry="14" fill="${pal.accent}"/>
    <!-- legs -->
    <ellipse cx="75" cy="125" rx="6" ry="10" fill="${pal.primary}"/>
    <ellipse cx="125" cy="125" rx="6" ry="10" fill="${pal.primary}"/>
    <!-- head -->
    <ellipse cx="150" cy="100" rx="22" ry="18" fill="${pal.primary}"/>
    ${eye(155, 95, 5, -1)}
    <path d="M158 108 Q165 112 170 108" stroke="#3a0a0a" stroke-width="2" fill="none"/>
    <!-- back spikes -->
    <path d="M70 90 L75 78 L80 90 Z" fill="${pal.accent}"/>
    <path d="M90 85 L95 70 L100 85 Z" fill="${pal.accent}"/>
    <path d="M110 85 L115 70 L120 85 Z" fill="${pal.accent}"/>
    <!-- flame from mouth -->
    <path d="M172 100 Q185 95 190 100 Q185 110 172 105 Z" fill="#ffd47e"/>
  `;
}

function creaturePhoenix(pal) {
  return `
    <ellipse cx="100" cy="140" rx="50" ry="6" fill="#000" opacity="0.4"/>
    <!-- wings -->
    <path d="M100 80 Q40 60 30 100 Q60 90 100 100 Z" fill="${pal.primary}"/>
    <path d="M100 80 Q160 60 170 100 Q140 90 100 100 Z" fill="${pal.primary}"/>
    <path d="M100 85 Q55 75 50 105 Q70 95 100 100 Z" fill="${pal.accent}"/>
    <path d="M100 85 Q145 75 150 105 Q130 95 100 100 Z" fill="${pal.accent}"/>
    <!-- body -->
    <ellipse cx="100" cy="100" rx="20" ry="30" fill="${pal.primary}"/>
    <!-- head -->
    <circle cx="100" cy="65" r="18" fill="${pal.primary}"/>
    <!-- crest -->
    <path d="M85 50 L95 25 L100 45 L105 25 L115 50 Z" fill="${pal.accent}"/>
    <!-- beak -->
    <path d="M100 70 L115 75 L100 80 Z" fill="#ffb347"/>
    ${eye(95, 62, 4, 1)}
    <!-- tail -->
    <path d="M100 130 Q90 145 85 155 L95 150 L100 158 L105 150 L115 155 Q110 145 100 130 Z" fill="${pal.accent}"/>
  `;
}

function creatureDrake(pal) {
  return `
    <ellipse cx="100" cy="140" rx="55" ry="6" fill="#000" opacity="0.4"/>
    <!-- wings -->
    <path d="M100 90 L40 70 Q35 95 50 105 L100 100 Z" fill="${pal.primary}" opacity="0.85"/>
    <path d="M100 90 L160 70 Q165 95 150 105 L100 100 Z" fill="${pal.primary}" opacity="0.85"/>
    <path d="M40 70 L50 105 L60 80 Z" fill="${pal.sky2}" opacity="0.6"/>
    <path d="M160 70 L150 105 L140 80 Z" fill="${pal.sky2}" opacity="0.6"/>
    <!-- body -->
    <ellipse cx="100" cy="115" rx="40" ry="22" fill="${pal.primary}"/>
    <ellipse cx="100" cy="120" rx="35" ry="14" fill="${pal.accent}"/>
    <!-- neck + head -->
    <path d="M75 100 Q70 75 90 70 L100 90 Z" fill="${pal.primary}"/>
    <ellipse cx="80" cy="65" rx="18" ry="14" fill="${pal.primary}"/>
    ${eye(75, 62, 4, -1)}
    <path d="M65 65 L55 60 L65 70 Z" fill="${pal.accent}"/>
    <!-- horns -->
    <path d="M88 55 L92 40 L95 55 Z" fill="#3a0a0a"/>
    <path d="M82 55 L80 38 L86 53 Z" fill="#3a0a0a"/>
    <!-- legs -->
    <ellipse cx="78" cy="135" rx="7" ry="10" fill="${pal.primary}"/>
    <ellipse cx="122" cy="135" rx="7" ry="10" fill="${pal.primary}"/>
    <!-- tail -->
    <path d="M140 115 Q170 120 175 100 Q160 110 140 110 Z" fill="${pal.primary}"/>
    <!-- breath -->
    <path d="M55 60 Q40 55 35 65 Q45 65 55 70 Z" fill="${pal.glow}" opacity="0.7"/>
  `;
}

function creatureElemental(pal) {
  return `
    <ellipse cx="100" cy="140" rx="40" ry="6" fill="#000" opacity="0.4"/>
    <!-- swirling form -->
    <path d="M100 35 Q140 60 135 110 Q125 145 100 140 Q75 145 65 110 Q60 60 100 35 Z" fill="${pal.primary}"/>
    <path d="M100 50 Q125 70 122 105 Q115 130 100 128 Q85 130 78 105 Q75 70 100 50 Z" fill="${pal.accent}" opacity="0.85"/>
    <path d="M100 65 Q115 80 113 100 Q108 118 100 116 Q92 118 87 100 Q85 80 100 65 Z" fill="${pal.glow}" opacity="0.7"/>
    <!-- core eyes -->
    ${eye(92, 95, 5, 1)}
    ${eye(108, 95, 5, -1)}
    <!-- floating shards -->
    <polygon points="60,80 65,70 70,80 65,90" fill="${pal.accent}"/>
    <polygon points="135,75 140,65 145,75 140,85" fill="${pal.accent}"/>
    <polygon points="50,120 55,113 60,120 55,127" fill="${pal.glow}"/>
    <polygon points="145,120 150,113 155,120 150,127" fill="${pal.glow}"/>
  `;
}

function creatureSprite(pal) {
  return `
    <ellipse cx="100" cy="138" rx="25" ry="4" fill="#000" opacity="0.3"/>
    <!-- glow halo -->
    <circle cx="100" cy="85" r="50" fill="${pal.glow}" opacity="0.25"/>
    <circle cx="100" cy="85" r="35" fill="${pal.glow}" opacity="0.4"/>
    <!-- body orb -->
    <circle cx="100" cy="85" r="25" fill="${pal.primary}"/>
    <circle cx="92" cy="78" r="10" fill="${pal.glow}" opacity="0.7"/>
    <!-- wings -->
    <path d="M75 75 Q55 60 60 90 Q70 85 80 88 Z" fill="${pal.accent}" opacity="0.8"/>
    <path d="M125 75 Q145 60 140 90 Q130 85 120 88 Z" fill="${pal.accent}" opacity="0.8"/>
    <!-- face -->
    ${eye(93, 85, 4, 1)}
    ${eye(107, 85, 4, -1)}
    <path d="M95 96 Q100 100 105 96" stroke="#1a1a2a" stroke-width="1.5" fill="none"/>
    <!-- sparkle trail -->
    <circle cx="60" cy="120" r="2" fill="${pal.glow}"/>
    <circle cx="140" cy="125" r="2" fill="${pal.glow}"/>
    <circle cx="80" cy="135" r="1.5" fill="${pal.glow}"/>
    <circle cx="120" cy="135" r="1.5" fill="${pal.glow}"/>
  `;
}

function creatureGolem(pal) {
  return `
    <ellipse cx="100" cy="142" rx="50" ry="6" fill="#000" opacity="0.4"/>
    <!-- legs -->
    <rect x="78" y="115" width="14" height="25" rx="3" fill="${pal.sky2}"/>
    <rect x="108" y="115" width="14" height="25" rx="3" fill="${pal.sky2}"/>
    <!-- body -->
    <rect x="60" y="60" width="80" height="65" rx="8" fill="${pal.primary}"/>
    <rect x="68" y="68" width="64" height="50" rx="4" fill="${pal.accent}" opacity="0.7"/>
    <!-- arms -->
    <rect x="40" y="70" width="20" height="50" rx="6" fill="${pal.primary}"/>
    <rect x="140" y="70" width="20" height="50" rx="6" fill="${pal.primary}"/>
    <!-- fists -->
    <circle cx="50" cy="125" r="11" fill="${pal.sky2}"/>
    <circle cx="150" cy="125" r="11" fill="${pal.sky2}"/>
    <!-- head -->
    <rect x="78" y="35" width="44" height="30" rx="4" fill="${pal.primary}"/>
    <!-- eyes glowing -->
    <rect x="84" y="45" width="10" height="6" fill="${pal.glow}"/>
    <rect x="106" y="45" width="10" height="6" fill="${pal.glow}"/>
    <rect x="84" y="45" width="10" height="6" fill="#fff" opacity="0.6"/>
    <rect x="106" y="45" width="10" height="6" fill="#fff" opacity="0.6"/>
    <!-- mouth -->
    <rect x="92" y="58" width="16" height="3" fill="#1a1a2a"/>
    <!-- runes -->
    <text x="100" y="100" text-anchor="middle" font-size="20" fill="${pal.glow}" opacity="0.7">✦</text>
  `;
}

function creatureWolf(pal) {
  return `
    <ellipse cx="100" cy="140" rx="55" ry="5" fill="#000" opacity="0.4"/>
    <!-- body -->
    <ellipse cx="100" cy="105" rx="50" ry="22" fill="${pal.sky2}"/>
    <ellipse cx="100" cy="112" rx="45" ry="14" fill="#3a3a4a"/>
    <!-- legs -->
    <rect x="65" y="115" width="8" height="22" fill="${pal.sky2}"/>
    <rect x="85" y="118" width="8" height="20" fill="${pal.sky2}"/>
    <rect x="105" y="118" width="8" height="20" fill="${pal.sky2}"/>
    <rect x="125" y="115" width="8" height="22" fill="${pal.sky2}"/>
    <!-- tail -->
    <path d="M50 100 Q35 90 30 70 L40 75 Q45 90 55 105 Z" fill="${pal.sky2}"/>
    <!-- head -->
    <ellipse cx="155" cy="90" rx="22" ry="18" fill="${pal.sky2}"/>
    <!-- snout -->
    <path d="M155 90 L180 95 L175 105 L155 102 Z" fill="#3a3a4a"/>
    <circle cx="180" cy="96" r="2.5" fill="#1a1a2a"/>
    <!-- ears -->
    <path d="M145 75 L142 60 L155 70 Z" fill="${pal.sky2}"/>
    <path d="M165 75 L168 60 L155 70 Z" fill="${pal.sky2}"/>
    <!-- eye glowing -->
    ${eye(155, 88, 4, 1)}
    <!-- fangs -->
    <path d="M170 100 L168 108 L172 104 Z" fill="#fff"/>
    <path d="M175 102 L173 110 L177 106 Z" fill="#fff"/>
  `;
}

// ===== Spells =====

function spellBolt(pal) {
  return `
    <!-- glow burst -->
    <circle cx="100" cy="85" r="60" fill="${pal.glow}" opacity="0.2"/>
    <circle cx="100" cy="85" r="40" fill="${pal.glow}" opacity="0.4"/>
    <!-- bolt -->
    <path d="M105 30 L70 90 L95 90 L80 140 L130 75 L105 75 L120 30 Z" fill="${pal.accent}" stroke="#fff" stroke-width="2"/>
    <path d="M105 30 L80 80 L100 80 L88 130 L122 78 L102 78 L115 35 Z" fill="#fff" opacity="0.6"/>
    <!-- sparks -->
    <circle cx="50" cy="50" r="2" fill="#fff"/>
    <circle cx="150" cy="60" r="2" fill="#fff"/>
    <circle cx="155" cy="120" r="2.5" fill="#fff"/>
    <circle cx="45" cy="125" r="2" fill="#fff"/>
  `;
}

function spellFlame(pal) {
  return `
    <circle cx="100" cy="100" r="55" fill="${pal.glow}" opacity="0.3"/>
    <!-- outer flame -->
    <path d="M100 25 Q140 65 130 110 Q125 145 100 145 Q75 145 70 110 Q60 65 100 25 Z" fill="${pal.primary}"/>
    <!-- mid -->
    <path d="M100 50 Q125 80 118 110 Q115 135 100 135 Q85 135 82 110 Q75 80 100 50 Z" fill="${pal.accent}"/>
    <!-- core -->
    <path d="M100 70 Q115 90 110 110 Q108 125 100 125 Q92 125 90 110 Q85 90 100 70 Z" fill="${pal.glow}"/>
    <!-- core white -->
    <ellipse cx="100" cy="105" rx="6" ry="14" fill="#fff" opacity="0.85"/>
    <!-- floating embers -->
    <circle cx="60" cy="60" r="3" fill="${pal.accent}"/>
    <circle cx="140" cy="55" r="2.5" fill="${pal.accent}"/>
    <circle cx="50" cy="120" r="2" fill="${pal.glow}"/>
    <circle cx="150" cy="115" r="2" fill="${pal.glow}"/>
  `;
}

function spellWave(pal) {
  return `
    <circle cx="100" cy="85" r="60" fill="${pal.glow}" opacity="0.2"/>
    <path d="M20 80 Q50 50 80 80 T140 80 T180 80 L180 130 L20 130 Z" fill="${pal.primary}"/>
    <path d="M20 95 Q50 65 80 95 T140 95 T180 95 L180 130 L20 130 Z" fill="${pal.accent}" opacity="0.85"/>
    <path d="M20 110 Q50 85 80 110 T140 110 T180 110 L180 130 L20 130 Z" fill="${pal.glow}" opacity="0.7"/>
    <!-- foam -->
    <circle cx="40" cy="78" r="3" fill="#fff"/>
    <circle cx="80" cy="80" r="3" fill="#fff"/>
    <circle cx="120" cy="78" r="3" fill="#fff"/>
    <circle cx="160" cy="80" r="3" fill="#fff"/>
    <!-- droplets -->
    <ellipse cx="65" cy="55" rx="3" ry="6" fill="${pal.accent}"/>
    <ellipse cx="135" cy="50" rx="3" ry="6" fill="${pal.accent}"/>
  `;
}

function spellOrb(pal) {
  const grad = uid();
  return `
    <defs>
      <radialGradient id="${grad}" cx="40%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#fff"/>
        <stop offset="50%" stop-color="${pal.glow}"/>
        <stop offset="100%" stop-color="${pal.primary}"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="90" r="60" fill="${pal.glow}" opacity="0.25"/>
    <circle cx="100" cy="90" r="42" fill="url(#${grad})" stroke="#fff" stroke-width="2"/>
    <ellipse cx="85" cy="75" rx="14" ry="8" fill="#fff" opacity="0.6"/>
    <!-- runic ring -->
    <circle cx="100" cy="90" r="55" fill="none" stroke="${pal.accent}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"/>
    <text x="60" y="55" font-size="12" fill="${pal.glow}">✦</text>
    <text x="135" y="55" font-size="12" fill="${pal.glow}">✦</text>
    <text x="60" y="135" font-size="12" fill="${pal.glow}">✦</text>
    <text x="135" y="135" font-size="12" fill="${pal.glow}">✦</text>
  `;
}

function spellShield(pal) {
  return `
    <circle cx="100" cy="85" r="55" fill="${pal.glow}" opacity="0.25"/>
    <path d="M100 25 L155 45 L150 100 Q145 130 100 150 Q55 130 50 100 L45 45 Z" fill="${pal.primary}" stroke="${pal.glow}" stroke-width="3"/>
    <path d="M100 40 L140 55 L138 100 Q135 122 100 138 Q65 122 62 100 L60 55 Z" fill="${pal.accent}" opacity="0.7"/>
    <!-- emblem -->
    <path d="M100 60 L115 90 L100 110 L85 90 Z" fill="${pal.glow}"/>
    <circle cx="100" cy="90" r="6" fill="#fff"/>
    <!-- side glints -->
    <path d="M100 25 L155 45 L150 60 L100 35 Z" fill="#fff" opacity="0.25"/>
  `;
}

function spellSword(pal) {
  return `
    <circle cx="100" cy="85" r="55" fill="${pal.glow}" opacity="0.2"/>
    <!-- blade -->
    <path d="M100 15 L110 110 L100 122 L90 110 Z" fill="#e0e4ec" stroke="#222" stroke-width="1.5"/>
    <path d="M100 20 L106 105 L100 115 L94 105 Z" fill="#fff" opacity="0.4"/>
    <!-- crossguard -->
    <rect x="70" y="108" width="60" height="8" rx="2" fill="${pal.accent}" stroke="#222" stroke-width="1"/>
    <!-- handle -->
    <rect x="94" y="116" width="12" height="22" fill="#5a3a1a"/>
    <!-- pommel -->
    <circle cx="100" cy="142" r="7" fill="${pal.primary}" stroke="#222" stroke-width="1"/>
    <!-- gem -->
    <polygon points="100,108 105,114 100,118 95,114" fill="${pal.glow}"/>
    <!-- glints -->
    <circle cx="60" cy="50" r="2" fill="#fff"/>
    <circle cx="140" cy="55" r="2" fill="#fff"/>
  `;
}

// ===== Hero portrait — health = blood-fill in body silhouette =====

function heroPortraitSvg(side, hp, maxHp, emoji) {
  const pct = Math.max(0, Math.min(1, hp / maxHp));
  const fillY = 100 * (1 - pct); // blood drains from top
  const clipId = 'bodyClip_' + side;
  const bloodId = 'blood_' + side;
  const color = pct > 0.6 ? '#e63946' : pct > 0.3 ? '#c81d25' : '#7a0a14';
  return `
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" class="portrait-svg">
      <defs>
        <clipPath id="${clipId}">
          <!-- head -->
          <circle cx="50" cy="22" r="15"/>
          <!-- body trapezoid -->
          <path d="M30 38 L70 38 L78 95 L22 95 Z"/>
          <!-- arms -->
          <path d="M22 42 L30 42 L34 88 L26 90 Z"/>
          <path d="M70 42 L78 42 L74 90 L66 88 Z"/>
          <!-- legs -->
          <path d="M28 95 L46 95 L44 130 L30 130 Z"/>
          <path d="M54 95 L72 95 L70 130 L56 130 Z"/>
        </clipPath>
        <linearGradient id="${bloodId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#3a0010"/>
        </linearGradient>
      </defs>
      <!-- background body fill -->
      <rect x="0" y="0" width="100" height="140" fill="#1a1f3a" clip-path="url(#${clipId})"/>
      <!-- blood-level fill -->
      <rect x="0" y="${fillY}" width="100" height="${140 - fillY}" fill="url(#${bloodId})" clip-path="url(#${clipId})" class="blood-fill" data-side="${side}"/>
      <!-- top blood surface ripple -->
      <path d="M0 ${fillY} Q25 ${fillY - 3} 50 ${fillY} T100 ${fillY} L100 ${fillY + 4} L0 ${fillY + 4} Z" fill="${color}" opacity="0.85" clip-path="url(#${clipId})"/>
      <!-- outline -->
      <circle cx="50" cy="22" r="15" fill="none" stroke="#f4c430" stroke-width="1.5"/>
      <path d="M30 38 L70 38 L78 95 L22 95 Z" fill="none" stroke="#f4c430" stroke-width="1.5"/>
      <path d="M22 42 L30 42 L34 88 L26 90 Z" fill="none" stroke="#f4c430" stroke-width="1.2"/>
      <path d="M70 42 L78 42 L74 90 L66 88 Z" fill="none" stroke="#f4c430" stroke-width="1.2"/>
      <path d="M28 95 L46 95 L44 130 L30 130 Z" fill="none" stroke="#f4c430" stroke-width="1.2"/>
      <path d="M54 95 L72 95 L70 130 L56 130 Z" fill="none" stroke="#f4c430" stroke-width="1.2"/>
      <!-- emoji face overlay -->
      <text x="50" y="28" text-anchor="middle" font-size="18">${emoji}</text>
    </svg>
  `;
}

// Mana crystal row
function manaCrystalsHtml(mana, manaMax) {
  const out = [];
  for (let i = 0; i < manaMax; i++) {
    out.push(`<span class="crystal ${i < mana ? 'full' : 'empty'}">💎</span>`);
  }
  for (let i = manaMax; i < 10; i++) {
    out.push(`<span class="crystal slot"></span>`);
  }
  return out.join('');
}

// Card-back SVG for opponent hand
function cardBackSvg() {
  return `<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cb1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#3a2470"/>
        <stop offset="100%" stop-color="#0e1430"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="76" height="106" rx="8" fill="url(#cb1)" stroke="#f4c430" stroke-width="2"/>
    <circle cx="40" cy="55" r="22" fill="none" stroke="#f4c430" stroke-width="2"/>
    <circle cx="40" cy="55" r="14" fill="none" stroke="#f4c430" stroke-width="1"/>
    <text x="40" y="62" text-anchor="middle" font-size="18" fill="#f4c430">✦</text>
    <text x="40" y="22" text-anchor="middle" font-size="8" fill="#f4c430">CARDQUEST</text>
  </svg>`;
}
