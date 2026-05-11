// GeniusQuest — Pokémon SVG art engine
// Fan-made original SVG art (Pokémon names/concepts; art is original).
// NOT affiliated with Nintendo / Game Freak / Creatures Inc.
// Non-commercial educational use only.

const SVG_NS2 = 'http://www.w3.org/2000/svg';

function el2(tag, attrs = {}, children = []) {
  const e = document.createElementNS(SVG_NS2, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  children.forEach(c => c && e.appendChild(c));
  return e;
}
function txt2(content, attrs = {}) {
  const e = el2('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', ...attrs });
  e.textContent = content; return e;
}
function svgRoot2(w, h) {
  return el2('svg', { viewBox: `0 0 ${w} ${h}`, width: '100%', height: '100%', xmlns: SVG_NS2 });
}

// Type palette
const TYPE_COLORS = {
  fire:     ['#ff6b35','#ff9a5c'],
  water:    ['#3b9ede','#7ec8ff'],
  grass:    ['#3b8856','#7dca6f'],
  electric: ['#f8cc04','#ffe566'],
  psychic:  ['#cc3377','#ff77bb'],
  ice:      ['#6bcaff','#beeeff'],
  dragon:   ['#6338f5','#9b7cf8'],
  dark:     ['#5a4a72','#9b8daa'],
  fairy:    ['#ffaec9','#ffd6e7'],
  normal:   ['#a8a878','#d4d4b0'],
  fighting: ['#c03028','#ef7060'],
  poison:   ['#a040a0','#d070d0'],
  ground:   ['#e0c068','#f0da90'],
  flying:   ['#80a0f0','#b0c8ff'],
  bug:      ['#a8b820','#d8e060'],
  rock:     ['#b8a038','#dbc864'],
  ghost:    ['#705898','#a880c0'],
  steel:    ['#b8b8d0','#d8d8e8'],
};
function typeColor(type) { return (TYPE_COLORS[type] || TYPE_COLORS.normal)[0]; }
function typeColor2(type) { return (TYPE_COLORS[type] || TYPE_COLORS.normal)[1]; }

// ── Dedicated portraits (30 Pokémon) ────────────────────────────────────
function drawPikachu(root, cx, cy, scale = 1) {
  const s = scale;
  // Body
  root.appendChild(el2('ellipse', { cx, cy: cy + 6 * s, rx: 18 * s, ry: 16 * s, fill: '#f8cc04' }));
  // Cheeks
  root.appendChild(el2('circle', { cx: cx - 14 * s, cy: cy + 10 * s, r: 5 * s, fill: '#ff5050' }));
  root.appendChild(el2('circle', { cx: cx + 14 * s, cy: cy + 10 * s, r: 5 * s, fill: '#ff5050' }));
  // Head
  root.appendChild(el2('circle', { cx, cy: cy - 6 * s, r: 16 * s, fill: '#f8cc04' }));
  // Ears
  root.appendChild(el2('polygon', { points: `${cx - 10 * s},${cy - 20 * s} ${cx - 16 * s},${cy - 42 * s} ${cx - 2 * s},${cy - 22 * s}`, fill: '#f8cc04' }));
  root.appendChild(el2('polygon', { points: `${cx + 10 * s},${cy - 20 * s} ${cx + 16 * s},${cy - 42 * s} ${cx + 2 * s},${cy - 22 * s}`, fill: '#f8cc04' }));
  root.appendChild(el2('polygon', { points: `${cx - 10 * s},${cy - 24 * s} ${cx - 14 * s},${cy - 38 * s} ${cx - 5 * s},${cy - 24 * s}`, fill: '#1a1a1a' }));
  root.appendChild(el2('polygon', { points: `${cx + 10 * s},${cy - 24 * s} ${cx + 14 * s},${cy - 38 * s} ${cx + 5 * s},${cy - 24 * s}`, fill: '#1a1a1a' }));
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 5 * s, cy: cy - 7 * s, r: 4 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx + 5 * s, cy: cy - 7 * s, r: 4 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 9 * s, r: 1.5 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 6 * s, cy: cy - 9 * s, r: 1.5 * s, fill: 'white' }));
  // Nose
  root.appendChild(el2('ellipse', { cx, cy: cy - 2 * s, rx: 2 * s, ry: 1.5 * s, fill: '#cc6600' }));
  // Tail (lightning bolt)
  root.appendChild(el2('polygon', { points: `${cx + 18 * s},${cy} ${cx + 30 * s},${cy - 10 * s} ${cx + 26 * s},${cy} ${cx + 36 * s},${cy - 20 * s} ${cx + 22 * s},${cy - 8 * s} ${cx + 26 * s},${cy - 18 * s}`, fill: '#f8cc04', stroke: '#cc9900', 'stroke-width': s }));
  // Stripe on back
  root.appendChild(el2('path', { d: `M${cx - 12 * s},${cy + 2 * s} Q${cx},${cy - 4 * s} ${cx + 12 * s},${cy + 2 * s}`, stroke: '#cc9900', 'stroke-width': 2 * s, fill: 'none' }));
}
function drawBulbasaur(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('ellipse', { cx, cy: cy + 8 * s, rx: 20 * s, ry: 14 * s, fill: '#78c850' }));
  // Bulb on back
  root.appendChild(el2('ellipse', { cx, cy: cy - 2 * s, rx: 14 * s, ry: 12 * s, fill: '#58a038' }));
  root.appendChild(el2('path', { d: `M${cx},${cy - 14 * s} L${cx},${cy - 26 * s}`, stroke: '#3a7828', 'stroke-width': 4 * s }));
  root.appendChild(el2('ellipse', { cx, cy: cy - 26 * s, rx: 6 * s, ry: 4 * s, fill: '#a0e070' }));
  // Head
  root.appendChild(el2('circle', { cx, cy: cy - 6 * s, r: 14 * s, fill: '#78c850' }));
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 5 * s, cy: cy - 8 * s, r: 4 * s, fill: '#c82020' }));
  root.appendChild(el2('circle', { cx: cx + 5 * s, cy: cy - 8 * s, r: 4 * s, fill: '#c82020' }));
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 10 * s, r: 1.5 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 6 * s, cy: cy - 10 * s, r: 1.5 * s, fill: 'white' }));
  // Spots
  root.appendChild(el2('circle', { cx: cx - 9 * s, cy: cy + 10 * s, r: 3 * s, fill: '#58a038' }));
  root.appendChild(el2('circle', { cx: cx + 9 * s, cy: cy + 10 * s, r: 3 * s, fill: '#58a038' }));
}
function drawCharmander(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('ellipse', { cx, cy: cy + 8 * s, rx: 16 * s, ry: 14 * s, fill: '#ff6820' }));
  root.appendChild(el2('circle', { cx, cy: cy - 6 * s, r: 14 * s, fill: '#ff6820' }));
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 8 * s, r: 4 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx + 4 * s, cy: cy - 8 * s, r: 4 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx - 3 * s, cy: cy - 10 * s, r: 1.5 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 5 * s, cy: cy - 10 * s, r: 1.5 * s, fill: 'white' }));
  // Tail + flame
  root.appendChild(el2('path', { d: `M${cx + 16 * s},${cy + 6 * s} Q${cx + 26 * s},${cy + 16 * s} ${cx + 24 * s},${cy + 4 * s}`, stroke: '#ff6820', 'stroke-width': 6 * s, fill: 'none' }));
  root.appendChild(el2('circle', { cx: cx + 24 * s, cy: cy + 4 * s, r: 7 * s, fill: '#ff9900', opacity: 0.9 }));
  root.appendChild(el2('circle', { cx: cx + 24 * s, cy: cy + 4 * s, r: 4 * s, fill: '#ffff00' }));
  // Belly
  root.appendChild(el2('ellipse', { cx, cy: cy + 8 * s, rx: 9 * s, ry: 8 * s, fill: '#ffd0a0' }));
}
function drawSquirtle(root, cx, cy, scale = 1) {
  const s = scale;
  // Shell
  root.appendChild(el2('ellipse', { cx, cy: cy + 8 * s, rx: 20 * s, ry: 16 * s, fill: '#7038f8', opacity: 0.9 }));
  root.appendChild(el2('ellipse', { cx, cy: cy + 8 * s, rx: 16 * s, ry: 12 * s, fill: '#c0a840' }));
  root.appendChild(el2('path', { d: `M${cx},${cy - 4 * s} L${cx - 12 * s},${cy + 12 * s} M${cx},${cy - 4 * s} L${cx + 12 * s},${cy + 12 * s} M${cx - 12 * s},${cy + 4 * s} L${cx + 12 * s},${cy + 4 * s}`, stroke: '#7a6420', 'stroke-width': 1.5 * s, fill: 'none' }));
  // Head
  root.appendChild(el2('circle', { cx, cy: cy - 8 * s, r: 14 * s, fill: '#6890f0' }));
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 9 * s, r: 4 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx + 4 * s, cy: cy - 9 * s, r: 4 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx - 3 * s, cy: cy - 11 * s, r: 1.5 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 5 * s, cy: cy - 11 * s, r: 1.5 * s, fill: 'white' }));
  // Tail
  root.appendChild(el2('path', { d: `M${cx + 20 * s},${cy + 8 * s} Q${cx + 32 * s},${cy + 2 * s} ${cx + 28 * s},${cy - 4 * s}`, stroke: '#6890f0', 'stroke-width': 5 * s, fill: 'none' }));
}
function drawGengar(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('circle', { cx, cy, r: 22 * s, fill: '#705898', opacity: 0.9 }));
  root.appendChild(el2('circle', { cx, cy: cy - 2 * s, r: 18 * s, fill: '#7050a0' }));
  // Spiky head
  [-20, -10, 0, 10, 20].forEach((dx, i) => {
    root.appendChild(el2('polygon', { points: `${cx + dx * s},${cy - 16 * s} ${cx + (dx - 6) * s},${cy - 28 * s} ${cx + (dx + 6) * s},${cy - 28 * s}`, fill: '#7050a0' }));
  });
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 6 * s, cy: cy - 4 * s, r: 6 * s, fill: '#c830c8' }));
  root.appendChild(el2('circle', { cx: cx + 6 * s, cy: cy - 4 * s, r: 6 * s, fill: '#c830c8' }));
  root.appendChild(el2('circle', { cx: cx - 5 * s, cy: cy - 5 * s, r: 2 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 7 * s, cy: cy - 5 * s, r: 2 * s, fill: 'white' }));
  // Mouth (zig-zag grin)
  root.appendChild(el2('path', { d: `M${cx - 10 * s},${cy + 6 * s} L${cx - 6 * s},${cy + 10 * s} L${cx - 2 * s},${cy + 6 * s} L${cx + 2 * s},${cy + 10 * s} L${cx + 6 * s},${cy + 6 * s} L${cx + 10 * s},${cy + 10 * s}`, stroke: 'white', 'stroke-width': 2.5 * s, fill: 'none' }));
}
function drawMewtwo(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('ellipse', { cx, cy: cy + 6 * s, rx: 16 * s, ry: 20 * s, fill: '#e0c0e0' }));
  root.appendChild(el2('circle', { cx, cy: cy - 10 * s, r: 14 * s, fill: '#d0b0d0' }));
  // Tail
  root.appendChild(el2('path', { d: `M${cx + 14 * s},${cy + 14 * s} Q${cx + 28 * s},${cy + 28 * s} ${cx + 16 * s},${cy + 36 * s} Q${cx + 4 * s},${cy + 44 * s} ${cx + 12 * s},${cy + 30 * s}`, stroke: '#e0c0e0', 'stroke-width': 5 * s, fill: 'none' }));
  root.appendChild(el2('circle', { cx: cx + 12 * s, cy: cy + 30 * s, r: 5 * s, fill: '#e0c0e0' }));
  // Eyes
  root.appendChild(el2('ellipse', { cx: cx - 5 * s, cy: cy - 12 * s, rx: 4 * s, ry: 5 * s, fill: '#5060c8' }));
  root.appendChild(el2('ellipse', { cx: cx + 5 * s, cy: cy - 12 * s, rx: 4 * s, ry: 5 * s, fill: '#5060c8' }));
  // Chest circle
  root.appendChild(el2('circle', { cx, cy: cy + 4 * s, r: 5 * s, fill: '#b890b8' }));
}
function drawEevee(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('ellipse', { cx, cy: cy + 8 * s, rx: 15 * s, ry: 12 * s, fill: '#b8804a' }));
  root.appendChild(el2('circle', { cx, cy: cy - 4 * s, r: 13 * s, fill: '#b8804a' }));
  // Fluffy collar
  root.appendChild(el2('ellipse', { cx, cy: cy + 2 * s, rx: 16 * s, ry: 8 * s, fill: '#f0e0c0', opacity: 0.9 }));
  // Ears
  root.appendChild(el2('polygon', { points: `${cx - 8 * s},${cy - 14 * s} ${cx - 16 * s},${cy - 30 * s} ${cx - 2 * s},${cy - 16 * s}`, fill: '#b8804a' }));
  root.appendChild(el2('polygon', { points: `${cx + 8 * s},${cy - 14 * s} ${cx + 16 * s},${cy - 30 * s} ${cx + 2 * s},${cy - 16 * s}`, fill: '#b8804a' }));
  root.appendChild(el2('polygon', { points: `${cx - 8 * s},${cy - 16 * s} ${cx - 13 * s},${cy - 26 * s} ${cx - 4 * s},${cy - 18 * s}`, fill: '#ffccaa' }));
  root.appendChild(el2('polygon', { points: `${cx + 8 * s},${cy - 16 * s} ${cx + 13 * s},${cy - 26 * s} ${cx + 4 * s},${cy - 18 * s}`, fill: '#ffccaa' }));
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 6 * s, r: 4 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx + 4 * s, cy: cy - 6 * s, r: 4 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx - 3 * s, cy: cy - 8 * s, r: 1.5 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 5 * s, cy: cy - 8 * s, r: 1.5 * s, fill: 'white' }));
  // Nose
  root.appendChild(el2('ellipse', { cx, cy: cy - 1 * s, rx: 2 * s, ry: 1.5 * s, fill: '#cc6060' }));
  // Tail
  root.appendChild(el2('path', { d: `M${cx + 14 * s},${cy + 8 * s} Q${cx + 26 * s},${cy + 12 * s} ${cx + 22 * s},${cy - 4 * s}`, stroke: '#b8804a', 'stroke-width': 6 * s, fill: 'none' }));
  root.appendChild(el2('ellipse', { cx: cx + 22 * s, cy: cy - 4 * s, rx: 8 * s, ry: 5 * s, fill: '#f0e0c0' }));
}
function drawMagikarp(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('ellipse', { cx, cy, rx: 16 * s, ry: 20 * s, fill: '#f04030' }));
  // Scales
  for (let i = -1; i <= 1; i++) {
    root.appendChild(el2('ellipse', { cx: cx + i * 10 * s, cy: cy - 4 * s, rx: 6 * s, ry: 4 * s, fill: '#e03020', opacity: 0.5 }));
  }
  // Fins
  root.appendChild(el2('polygon', { points: `${cx - 16 * s},${cy} ${cx - 26 * s},${cy - 14 * s} ${cx - 14 * s},${cy - 10 * s}`, fill: '#c02010' }));
  root.appendChild(el2('polygon', { points: `${cx + 16 * s},${cy} ${cx + 26 * s},${cy - 14 * s} ${cx + 14 * s},${cy - 10 * s}`, fill: '#c02010' }));
  // Tail
  root.appendChild(el2('polygon', { points: `${cx},${cy + 20 * s} ${cx - 14 * s},${cy + 34 * s} ${cx + 14 * s},${cy + 34 * s}`, fill: '#f8cc04' }));
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 6 * s, cy: cy - 8 * s, r: 5 * s, fill: 'white', stroke: '#333', 'stroke-width': s }));
  root.appendChild(el2('circle', { cx: cx + 6 * s, cy: cy - 8 * s, r: 5 * s, fill: 'white', stroke: '#333', 'stroke-width': s }));
  root.appendChild(el2('circle', { cx: cx - 6 * s, cy: cy - 8 * s, r: 3 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx + 6 * s, cy: cy - 8 * s, r: 3 * s, fill: '#1a1a1a' }));
  // Mouth / whiskers
  root.appendChild(el2('line', { x1: cx - 6 * s, x2: cx - 18 * s, y1: cy + 2 * s, y2: cy - 4 * s, stroke: '#f8cc04', 'stroke-width': 2 * s }));
  root.appendChild(el2('line', { x1: cx + 6 * s, x2: cx + 18 * s, y1: cy + 2 * s, y2: cy - 4 * s, stroke: '#f8cc04', 'stroke-width': 2 * s }));
}
function drawGyarados(root, cx, cy, scale = 1) {
  const s = scale;
  // Body (serpentine)
  for (let i = 0; i < 6; i++) {
    const bx = cx + Math.sin(i * 0.8) * 14 * s;
    const by = cy - 30 * s + i * 14 * s;
    root.appendChild(el2('ellipse', { cx: bx, cy: by, rx: 13 * s, ry: 10 * s, fill: '#0078b8' }));
  }
  // Head
  root.appendChild(el2('circle', { cx, cy: cy - 34 * s, r: 16 * s, fill: '#0068a8' }));
  root.appendChild(el2('polygon', { points: `${cx - 8 * s},${cy - 50 * s} ${cx},${cy - 60 * s} ${cx + 8 * s},${cy - 50 * s}`, fill: '#f8cc04' }));
  root.appendChild(el2('circle', { cx: cx - 6 * s, cy: cy - 36 * s, r: 4 * s, fill: '#cc0000' }));
  root.appendChild(el2('circle', { cx: cx + 6 * s, cy: cy - 36 * s, r: 4 * s, fill: '#cc0000' }));
  root.appendChild(el2('circle', { cx: cx - 5 * s, cy: cy - 38 * s, r: 1.5 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 7 * s, cy: cy - 38 * s, r: 1.5 * s, fill: 'white' }));
}
function drawLapras(root, cx, cy, scale = 1) {
  const s = scale;
  // Shell
  root.appendChild(el2('ellipse', { cx, cy: cy + 8 * s, rx: 24 * s, ry: 14 * s, fill: '#4080c8' }));
  root.appendChild(el2('ellipse', { cx, cy: cy + 6 * s, rx: 18 * s, ry: 10 * s, fill: '#6090c8', opacity: 0.7 }));
  // Neck + head
  root.appendChild(el2('rect', { x: cx - 5 * s, y: cy - 14 * s, width: 10 * s, height: 20 * s, fill: '#80c0e0', rx: 5 * s }));
  root.appendChild(el2('circle', { cx, cy: cy - 18 * s, r: 12 * s, fill: '#80c0e0' }));
  // Horn
  root.appendChild(el2('polygon', { points: `${cx - 3 * s},${cy - 28 * s} ${cx},${cy - 40 * s} ${cx + 3 * s},${cy - 28 * s}`, fill: '#ffcc00' }));
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 20 * s, r: 3 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx + 4 * s, cy: cy - 20 * s, r: 3 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx - 3 * s, cy: cy - 22 * s, r: 1 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 5 * s, cy: cy - 22 * s, r: 1 * s, fill: 'white' }));
  // Fins
  root.appendChild(el2('polygon', { points: `${cx - 24 * s},${cy + 6 * s} ${cx - 34 * s},${cy + 14 * s} ${cx - 20 * s},${cy + 16 * s}`, fill: '#4080c8' }));
  root.appendChild(el2('polygon', { points: `${cx + 24 * s},${cy + 6 * s} ${cx + 34 * s},${cy + 14 * s} ${cx + 20 * s},${cy + 16 * s}`, fill: '#4080c8' }));
}
function drawSnorlax(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('ellipse', { cx, cy: cy + 10 * s, rx: 26 * s, ry: 24 * s, fill: '#40705a' }));
  root.appendChild(el2('ellipse', { cx, cy: cy + 8 * s, rx: 20 * s, ry: 18 * s, fill: '#c0d8c8', opacity: 0.7 }));
  root.appendChild(el2('circle', { cx, cy: cy - 10 * s, r: 20 * s, fill: '#40705a' }));
  // Closed eyes (sleeping)
  root.appendChild(el2('path', { d: `M${cx - 10 * s},${cy - 12 * s} Q${cx - 6 * s},${cy - 8 * s} ${cx - 2 * s},${cy - 12 * s}`, stroke: '#1a1a1a', 'stroke-width': 2.5 * s, fill: 'none' }));
  root.appendChild(el2('path', { d: `M${cx + 2 * s},${cy - 12 * s} Q${cx + 6 * s},${cy - 8 * s} ${cx + 10 * s},${cy - 12 * s}`, stroke: '#1a1a1a', 'stroke-width': 2.5 * s, fill: 'none' }));
  // Snout + claws
  root.appendChild(el2('ellipse', { cx, cy: cy - 4 * s, rx: 6 * s, ry: 4 * s, fill: '#60907a' }));
  root.appendChild(el2('path', { d: `M${cx - 4 * s},${cy - 4 * s} L${cx},${cy - 4 * s} M${cx},${cy - 4 * s} L${cx + 4 * s},${cy - 4 * s}`, stroke: '#1a1a1a', 'stroke-width': 1.5 * s }));
}
function drawMew(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('circle', { cx, cy, r: 18 * s, fill: '#f4b0d8', opacity: 0.9 }));
  // Ears
  root.appendChild(el2('ellipse', { cx: cx - 10 * s, cy: cy - 16 * s, rx: 5 * s, ry: 8 * s, fill: '#f4b0d8', transform: `rotate(-20 ${cx - 10 * s} ${cy - 16 * s})` }));
  root.appendChild(el2('ellipse', { cx: cx + 10 * s, cy: cy - 16 * s, rx: 5 * s, ry: 8 * s, fill: '#f4b0d8', transform: `rotate(20 ${cx + 10 * s} ${cy - 16 * s})` }));
  root.appendChild(el2('ellipse', { cx: cx - 10 * s, cy: cy - 16 * s, rx: 3 * s, ry: 5 * s, fill: '#e890c4', transform: `rotate(-20 ${cx - 10 * s} ${cy - 16 * s})` }));
  root.appendChild(el2('ellipse', { cx: cx + 10 * s, cy: cy - 16 * s, rx: 3 * s, ry: 5 * s, fill: '#e890c4', transform: `rotate(20 ${cx + 10 * s} ${cy - 16 * s})` }));
  // Eyes
  root.appendChild(el2('circle', { cx: cx - 5 * s, cy: cy - 2 * s, r: 5 * s, fill: '#4090c0' }));
  root.appendChild(el2('circle', { cx: cx + 5 * s, cy: cy - 2 * s, r: 5 * s, fill: '#4090c0' }));
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 4 * s, r: 2 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 6 * s, cy: cy - 4 * s, r: 2 * s, fill: 'white' }));
  // Tail
  root.appendChild(el2('path', { d: `M${cx + 16 * s},${cy + 4 * s} Q${cx + 32 * s},${cy + 20 * s} ${cx + 20 * s},${cy + 30 * s} Q${cx + 8 * s},${cy + 40 * s} ${cx + 6 * s},${cy + 24 * s}`, stroke: '#f4b0d8', 'stroke-width': 4 * s, fill: 'none' }));
  root.appendChild(el2('circle', { cx: cx + 6 * s, cy: cy + 24 * s, r: 4 * s, fill: '#f4b0d8' }));
}
function drawLugia(root, cx, cy, scale = 1) {
  const s = scale;
  root.appendChild(el2('ellipse', { cx, cy, rx: 22 * s, ry: 30 * s, fill: '#d0e8ff' }));
  root.appendChild(el2('ellipse', { cx, cy: cy + 4 * s, rx: 16 * s, ry: 22 * s, fill: '#b0c8e8', opacity: 0.5 }));
  // Wings
  root.appendChild(el2('path', { d: `M${cx - 20 * s},${cy - 4 * s} Q${cx - 48 * s},${cy - 24 * s} ${cx - 38 * s},${cy + 10 * s}`, stroke: '#d0e8ff', 'stroke-width': 10 * s, fill: 'none' }));
  root.appendChild(el2('path', { d: `M${cx + 20 * s},${cy - 4 * s} Q${cx + 48 * s},${cy - 24 * s} ${cx + 38 * s},${cy + 10 * s}`, stroke: '#d0e8ff', 'stroke-width': 10 * s, fill: 'none' }));
  // Head
  root.appendChild(el2('circle', { cx, cy: cy - 26 * s, r: 14 * s, fill: '#d0e8ff' }));
  root.appendChild(el2('path', { d: `M${cx},${cy - 38 * s} L${cx - 4 * s},${cy - 48 * s} M${cx},${cy - 38 * s} L${cx + 4 * s},${cy - 48 * s}`, stroke: '#b0c8e8', 'stroke-width': 3 * s, fill: 'none' }));
  // Eyes
  root.appendChild(el2('ellipse', { cx: cx - 5 * s, cy: cy - 28 * s, rx: 4 * s, ry: 5 * s, fill: '#c00000' }));
  root.appendChild(el2('ellipse', { cx: cx + 5 * s, cy: cy - 28 * s, rx: 4 * s, ry: 5 * s, fill: '#c00000' }));
  // Belly stripes
  for (let i = 0; i < 3; i++) {
    root.appendChild(el2('path', { d: `M${cx - 10 * s},${cy - 6 * s + i * 10 * s} L${cx + 10 * s},${cy - 6 * s + i * 10 * s}`, stroke: '#6090b8', 'stroke-width': 3 * s }));
  }
}
function drawPikachu_illustrator(root, cx, cy, scale = 1) {
  const s = scale;
  // Parchment background
  root.appendChild(el2('rect', { x: cx - 40 * s, y: cy - 50 * s, width: 80 * s, height: 100 * s, fill: '#fff8e0', rx: 8 * s }));
  root.appendChild(el2('rect', { x: cx - 37 * s, y: cy - 47 * s, width: 74 * s, height: 94 * s, fill: 'none', rx: 6 * s, stroke: '#c8a040', 'stroke-width': 2 * s, 'stroke-dasharray': '4 2' }));
  // Pencil sketch-style Pikachu
  root.appendChild(el2('circle', { cx, cy: cy - 8 * s, r: 12 * s, fill: 'none', stroke: '#805020', 'stroke-width': 1.5 * s }));
  root.appendChild(el2('circle', { cx, cy: cy + 8 * s, r: 14 * s, fill: 'none', stroke: '#805020', 'stroke-width': 1.5 * s }));
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 10 * s, r: 3 * s, fill: '#805020' }));
  root.appendChild(el2('circle', { cx: cx + 4 * s, cy: cy - 10 * s, r: 3 * s, fill: '#805020' }));
  root.appendChild(el2('circle', { cx: cx - 10 * s, cy: cy - 4 * s, r: 3 * s, fill: 'none', stroke: '#e05050', 'stroke-width': 1.5 * s }));
  root.appendChild(el2('circle', { cx: cx + 10 * s, cy: cy - 4 * s, r: 3 * s, fill: 'none', stroke: '#e05050', 'stroke-width': 1.5 * s }));
  // "Illustrator" caption
  root.appendChild(txt2('Pikachu', { x: cx, y: cy + 30 * s, 'font-size': 8 * s, 'font-weight': 'bold', fill: '#805020', 'font-style': 'italic' }));
  root.appendChild(txt2('Illustrator', { x: cx, y: cy + 40 * s, 'font-size': 6 * s, fill: '#c8a040' }));
  // Gold sparkles around
  [[-30, -30], [30, -30], [-35, 10], [35, 10]].forEach(([dx, dy]) => {
    root.appendChild(txt2('✦', { x: cx + dx * s, y: cy + dy * s, 'font-size': 10 * s, fill: '#c8a040' }));
  });
}

// ── Sprite catalog (artKey → draw function) ──────────────────────────────
const PORTRAITS = {
  pikachu:       (r, cx, cy, s) => drawPikachu(r, cx, cy, s),
  bulbasaur:     (r, cx, cy, s) => drawBulbasaur(r, cx, cy, s),
  charmander:    (r, cx, cy, s) => drawCharmander(r, cx, cy, s),
  squirtle:      (r, cx, cy, s) => drawSquirtle(r, cx, cy, s),
  gengar:        (r, cx, cy, s) => drawGengar(r, cx, cy, s),
  mewtwo:        (r, cx, cy, s) => drawMewtwo(r, cx, cy, s),
  eevee:         (r, cx, cy, s) => drawEevee(r, cx, cy, s),
  magikarp:      (r, cx, cy, s) => drawMagikarp(r, cx, cy, s),
  gyarados:      (r, cx, cy, s) => drawGyarados(r, cx, cy, s),
  lapras:        (r, cx, cy, s) => drawLapras(r, cx, cy, s),
  snorlax:       (r, cx, cy, s) => drawSnorlax(r, cx, cy, s),
  mew:           (r, cx, cy, s) => drawMew(r, cx, cy, s),
  lugia:         (r, cx, cy, s) => drawLugia(r, cx, cy, s),
  pikachu_illustrator: (r, cx, cy, s) => drawPikachu_illustrator(r, cx, cy, s),
};

// Generic placeholder for any Pokémon without a dedicated portrait
// Uses type color + dex number + name for a distinctive but minimal card art
function drawGenericPokemon(root, cx, cy, scale, card) {
  const s = scale;
  const c1 = typeColor(card.type1);
  const c2 = typeColor2(card.type1);
  const dexNum = card.dexNo || 0;
  // Blob shape based on dex number
  const rx = 14 * s + (dexNum % 7) * s;
  const ry = 16 * s + ((dexNum * 3) % 6) * s;
  root.appendChild(el2('ellipse', { cx, cy: cy + 2 * s, rx, ry, fill: c1 }));
  root.appendChild(el2('circle', { cx, cy: cy - 10 * s, r: 13 * s, fill: c2 }));
  // Simple eyes
  root.appendChild(el2('circle', { cx: cx - 4 * s, cy: cy - 12 * s, r: 3 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx + 4 * s, cy: cy - 12 * s, r: 3 * s, fill: '#1a1a1a' }));
  root.appendChild(el2('circle', { cx: cx - 3 * s, cy: cy - 14 * s, r: 1 * s, fill: 'white' }));
  root.appendChild(el2('circle', { cx: cx + 5 * s, cy: cy - 14 * s, r: 1 * s, fill: 'white' }));
  // Dex #
  root.appendChild(txt2('#' + String(dexNum).padStart(3, '0'), { x: cx, y: cy + 12 * s, 'font-size': 8 * s, fill: 'white', 'font-weight': 700, opacity: 0.7 }));
}

// ── Public API ──────────────────────────────────────────────────────────
function renderPokemonArt(container, card, size = 80) {
  container.innerHTML = '';
  const root = svgRoot2(size, size);
  const cx = size / 2, cy = size / 2;
  const scale = size / 100;
  if (PORTRAITS[card.art]) {
    PORTRAITS[card.art](root, cx, cy, scale);
  } else {
    drawGenericPokemon(root, cx, cy, scale, card);
  }
  container.appendChild(root);
}

// Pikachu Illustrator cinematic
function renderIllustratorFull(container) {
  container.innerHTML = '';
  const root = svgRoot2(200, 280);
  drawPikachu_illustrator(root, 100, 140, 2);
  container.appendChild(root);
}
