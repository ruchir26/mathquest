// CardQuest — procedural SVG card art

function svg(tag, attrs = {}, children = '') {
  const parts = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${tag} ${parts}>${children}</${tag}>`;
}
function svgText(x, y, text, attrs = {}) {
  return svg('text', { x, y, 'text-anchor': 'middle', 'font-family': 'system-ui, sans-serif', ...attrs }, text);
}

const ELEMENT_PALETTE = {
  fire:    { primary: '#ff5a3a', accent: '#ffb347', glow: '#ffd089' },
  water:   { primary: '#3aa8ff', accent: '#7dcfff', glow: '#cfeaff' },
  earth:   { primary: '#6ec84e', accent: '#a8df7f', glow: '#d6f0c0' },
  air:     { primary: '#c8c0ff', accent: '#e5dffd', glow: '#f5f3ff' },
  spirit:  { primary: '#ffe070', accent: '#fff2a8', glow: '#fffadb' },
  neutral: { primary: '#9aa3b3', accent: '#c4c9d3', glow: '#e6e8ee' },
};

const ELEMENT_EMOJI = {
  fire: '🔥', water: '💧', earth: '🌿', air: '💨', spirit: '✨', neutral: '⚪',
};

// Procedural art shapes per art-key
function cardArtSvg(artKey, element) {
  const pal = ELEMENT_PALETTE[element] || ELEMENT_PALETTE.neutral;
  const W = 160, H = 110;
  const bg = svg('defs', {}, `
    <radialGradient id="g_${artKey}" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${pal.glow}" />
      <stop offset="60%" stop-color="${pal.accent}" />
      <stop offset="100%" stop-color="${pal.primary}" />
    </radialGradient>`);
  const back = svg('rect', { x: 0, y: 0, width: W, height: H, rx: 10, fill: `url(#g_${artKey})` });

  // Per-art-key creature/spell symbol
  let body = '';
  switch (artKey) {
    case 'imp':
      body = svg('circle', { cx: 80, cy: 60, r: 26, fill: '#3a1a10', opacity: 0.85 }) +
             svg('circle', { cx: 70, cy: 55, r: 4, fill: '#fff' }) +
             svg('circle', { cx: 90, cy: 55, r: 4, fill: '#fff' }) +
             svg('path', { d: 'M70 70 Q80 78 90 70', stroke: '#fff', 'stroke-width': 2, fill: 'none' });
      break;
    case 'salamander':
      body = svg('ellipse', { cx: 80, cy: 65, rx: 50, ry: 18, fill: '#7a1a05' }) +
             svg('circle', { cx: 120, cy: 60, r: 12, fill: '#7a1a05' }) +
             svg('circle', { cx: 124, cy: 58, r: 2, fill: '#fff' });
      break;
    case 'phoenix':
      body = svg('path', { d: 'M80 30 L110 90 L80 75 L50 90 Z', fill: '#ffd47e' }) +
             svg('circle', { cx: 80, cy: 50, r: 8, fill: '#ff7a3a' });
      break;
    case 'drake':
      body = svg('path', { d: 'M40 70 Q80 30 120 70 Q100 80 80 75 Q60 80 40 70 Z', fill: '#5a0a0a' }) +
             svg('circle', { cx: 110, cy: 60, r: 3, fill: '#ffe070' });
      break;
    case 'elemental':
      body = svg('polygon', { points: '80,30 105,55 95,90 65,90 55,55', fill: pal.primary, stroke: '#fff', 'stroke-width': 2 });
      break;
    case 'bolt':
      body = svg('path', { d: 'M75 25 L60 60 L80 60 L65 95 L100 55 L80 55 L95 25 Z', fill: '#fff', stroke: '#ff7a3a', 'stroke-width': 2 });
      break;
    case 'flame':
      body = svg('path', { d: 'M80 30 Q100 60 80 95 Q60 60 80 30 Z', fill: '#ff7a3a' }) +
             svg('path', { d: 'M80 50 Q90 70 80 90 Q70 70 80 50 Z', fill: '#ffd47e' });
      break;
    case 'wave':
      body = svg('path', { d: 'M20 70 Q40 50 60 70 T100 70 T140 70', stroke: '#fff', 'stroke-width': 4, fill: 'none' }) +
             svg('path', { d: 'M20 85 Q40 65 60 85 T100 85 T140 85', stroke: '#fff', 'stroke-width': 3, fill: 'none', opacity: 0.6 });
      break;
    case 'shield':
      body = svg('path', { d: 'M80 25 L115 40 L110 80 L80 100 L50 80 L45 40 Z', fill: '#3a4a6a', stroke: '#fff', 'stroke-width': 2 });
      break;
    case 'sword':
      body = svg('path', { d: 'M80 20 L88 80 L80 90 L72 80 Z', fill: '#d8d8e0', stroke: '#222', 'stroke-width': 1 }) +
             svg('rect', { x: 60, y: 78, width: 40, height: 6, fill: '#7a4a20' });
      break;
    case 'sprite':
      body = svg('circle', { cx: 80, cy: 60, r: 18, fill: '#fff', opacity: 0.9 }) +
             svg('circle', { cx: 80, cy: 60, r: 8, fill: pal.primary });
      break;
    case 'golem':
      body = svg('rect', { x: 55, y: 35, width: 50, height: 60, rx: 6, fill: '#5a4a30' }) +
             svg('rect', { x: 65, y: 50, width: 8, height: 8, fill: '#ffe070' }) +
             svg('rect', { x: 87, y: 50, width: 8, height: 8, fill: '#ffe070' });
      break;
    case 'wolf':
      body = svg('path', { d: 'M40 75 L70 50 L90 50 L120 75 L110 90 L50 90 Z', fill: '#3a3a4a' }) +
             svg('circle', { cx: 75, cy: 65, r: 3, fill: '#ffd070' }) +
             svg('circle', { cx: 95, cy: 65, r: 3, fill: '#ffd070' });
      break;
    case 'orb':
      body = svg('circle', { cx: 80, cy: 60, r: 28, fill: pal.primary, stroke: '#fff', 'stroke-width': 2 }) +
             svg('circle', { cx: 72, cy: 52, r: 8, fill: pal.glow, opacity: 0.7 });
      break;
    default:
      body = svg('circle', { cx: 80, cy: 60, r: 24, fill: pal.primary, opacity: 0.7 });
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${bg}${back}${body}</svg>`;
}
