// CuriosityQuest — SVG scene engine
// Pure functions: render an animated SVG into a container based on a scene spec.
//
// Each renderer returns { play, replay } so game.js can re-trigger animations.
//
// Scene types supported:
//   orbit, worldmap, flag, timeline, landmark, wordtiles,
//   chain, idiom, weather, diagram, circuit, lifecycle

const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) {
    if (attrs[k] !== undefined && attrs[k] !== null) el.setAttribute(k, attrs[k]);
  }
  children.forEach(c => c && el.appendChild(c));
  return el;
}
function svgText(content, attrs = {}) {
  const el = svg('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', ...attrs });
  el.textContent = content;
  return el;
}
function svgRoot(W, H) {
  return svg('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid meet' });
}

// ============== Public API ==============
function renderScene(container, spec, opts = {}) {
  container.innerHTML = '';
  if (!spec || !spec.type) {
    container.appendChild(svgText('?', { x: 50, y: 50 }));
    return { play: () => {}, replay: () => {} };
  }
  const renderer = SCENE_RENDERERS[spec.type];
  if (!renderer) {
    container.textContent = '(unknown scene: ' + spec.type + ')';
    return { play: () => {}, replay: () => {} };
  }
  return renderer(container, spec, opts);
}

// ============== ORBIT (Science) ==============
// spec: { type:'orbit', sun:{label,color}, bodies:[{label,color,size,distance,speed}], highlight }
function renderOrbit(container, spec) {
  const W = 480, H = 240;
  const root = svgRoot(W, H);
  const cx = W / 2, cy = H / 2;
  // starfield
  const star = svg('g');
  for (let i = 0; i < 24; i++) {
    star.appendChild(svg('circle', {
      cx: Math.random() * W, cy: Math.random() * H, r: Math.random() * 1.4 + 0.4,
      fill: '#ffffff', opacity: Math.random() * 0.6 + 0.2,
    }));
  }
  root.appendChild(star);
  // sun
  const sun = spec.sun || { label: '☀', color: '#ffd14e' };
  root.appendChild(svg('circle', { cx, cy, r: 18, fill: sun.color || '#ffd14e', opacity: 0.95 }));
  root.appendChild(svg('circle', { cx, cy, r: 26, fill: sun.color || '#ffd14e', opacity: 0.18 }));
  // orbits + bodies
  (spec.bodies || []).forEach((b, i) => {
    const r = b.distance || (40 + i * 22);
    root.appendChild(svg('circle', {
      cx, cy, r, fill: 'none',
      stroke: 'rgba(255,255,255,0.18)', 'stroke-dasharray': '2,4', 'stroke-width': 1,
    }));
    const speed = b.speed || (8 + i * 3);
    const orbitG = svg('g', {
      class: 'orbit-spinner',
      style: `transform-origin: ${cx}px ${cy}px; animation: orbit-spin ${speed}s linear infinite;`,
    });
    const isHi = spec.highlight && b.label === spec.highlight;
    const planet = svg('g', { transform: `translate(${cx + r}, ${cy})` });
    planet.appendChild(svg('circle', {
      cx: 0, cy: 0, r: b.size || 7,
      fill: b.color || '#7ec8ff',
      stroke: isHi ? '#ffd14e' : 'rgba(255,255,255,0.4)',
      'stroke-width': isHi ? 3 : 1,
    }));
    if (isHi) {
      planet.appendChild(svg('circle', {
        cx: 0, cy: 0, r: (b.size || 7) + 6, fill: 'none',
        stroke: '#ffd14e', 'stroke-width': 1.5, opacity: 0.6,
      }));
    }
    planet.appendChild(svgText(b.label, {
      x: 0, y: -((b.size || 7) + 10),
      fill: isHi ? '#ffd14e' : 'white', 'font-size': 11, 'font-weight': 700,
    }));
    orbitG.appendChild(planet);
    root.appendChild(orbitG);
  });
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== WORLDMAP (Geography) ==============
// spec: { type:'worldmap', highlight:'africa' }
// Stylized continents on a globe. Highlight = continent id to color in.
const CONTINENTS = {
  north_america: { name: 'North America', d: 'M30,55 Q40,40 60,42 L80,55 L75,80 L55,95 L40,90 L30,75 Z', cx: 55, cy: 65 },
  south_america: { name: 'South America', d: 'M70,110 Q85,105 88,125 L82,165 L72,170 L65,150 L62,130 Z', cx: 75, cy: 138 },
  europe:        { name: 'Europe', d: 'M120,50 L150,48 L155,65 L138,72 L122,68 Z', cx: 135, cy: 60 },
  africa:        { name: 'Africa', d: 'M135,80 Q160,75 165,100 L155,140 L138,150 L125,120 L128,95 Z', cx: 145, cy: 110 },
  asia:          { name: 'Asia', d: 'M160,40 Q210,40 230,65 L235,95 L210,105 L180,95 L165,75 Z', cx: 200, cy: 70 },
  oceania:       { name: 'Oceania', d: 'M210,135 Q230,130 235,145 L222,158 L208,150 Z', cx: 222, cy: 145 },
  antarctica:    { name: 'Antarctica', d: 'M40,180 L240,180 L235,195 L45,195 Z', cx: 140, cy: 188 },
};
function renderWorldmap(container, spec) {
  const W = 280, H = 220;
  const root = svgRoot(W, H);
  // ocean
  root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: '#1e4a8a', rx: 12 }));
  // grid lines (latitude/longitude)
  for (let i = 1; i < 5; i++) {
    root.appendChild(svg('line', {
      x1: 0, x2: W, y1: i * (H / 5), y2: i * (H / 5),
      stroke: 'rgba(255,255,255,0.08)', 'stroke-width': 1,
    }));
    root.appendChild(svg('line', {
      y1: 0, y2: H, x1: i * (W / 5), x2: i * (W / 5),
      stroke: 'rgba(255,255,255,0.08)', 'stroke-width': 1,
    }));
  }
  Object.entries(CONTINENTS).forEach(([id, c]) => {
    const isHi = spec.highlight === id;
    root.appendChild(svg('path', {
      d: c.d,
      fill: isHi ? '#ffd14e' : '#3b8856',
      stroke: isHi ? '#ff7b3d' : '#234d2a',
      'stroke-width': isHi ? 3 : 1.5,
    }));
    if (isHi) {
      root.appendChild(svgText(c.name, {
        x: c.cx, y: c.cy, fill: '#1a1f3a', 'font-size': 10, 'font-weight': 800,
      }));
    }
  });
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== FLAG (Geography) ==============
// spec: { type:'flag', flag:'japan' }
const FLAG_DRAWERS = {
  japan: (root, x, y, w, h) => {
    root.appendChild(svg('rect', { x, y, width: w, height: h, fill: '#fff', stroke: '#333', 'stroke-width': 1 }));
    root.appendChild(svg('circle', { cx: x + w / 2, cy: y + h / 2, r: h * 0.3, fill: '#bc002d' }));
  },
  france: (root, x, y, w, h) => {
    root.appendChild(svg('rect', { x, y, width: w / 3, height: h, fill: '#0055a4' }));
    root.appendChild(svg('rect', { x: x + w / 3, y, width: w / 3, height: h, fill: '#fff' }));
    root.appendChild(svg('rect', { x: x + 2 * w / 3, y, width: w / 3, height: h, fill: '#ef4135' }));
    root.appendChild(svg('rect', { x, y, width: w, height: h, fill: 'none', stroke: '#333' }));
  },
  brazil: (root, x, y, w, h) => {
    root.appendChild(svg('rect', { x, y, width: w, height: h, fill: '#009c3b' }));
    root.appendChild(svg('polygon', {
      points: `${x + w * 0.5},${y + h * 0.1} ${x + w * 0.95},${y + h * 0.5} ${x + w * 0.5},${y + h * 0.9} ${x + w * 0.05},${y + h * 0.5}`,
      fill: '#ffdf00',
    }));
    root.appendChild(svg('circle', { cx: x + w / 2, cy: y + h / 2, r: h * 0.2, fill: '#002776' }));
  },
  canada: (root, x, y, w, h) => {
    root.appendChild(svg('rect', { x, y, width: w / 4, height: h, fill: '#ff0000' }));
    root.appendChild(svg('rect', { x: x + w / 4, y, width: w / 2, height: h, fill: '#fff' }));
    root.appendChild(svg('rect', { x: x + 3 * w / 4, y, width: w / 4, height: h, fill: '#ff0000' }));
    root.appendChild(svgText('🍁', { x: x + w / 2, y: y + h / 2, 'font-size': h * 0.55 }));
    root.appendChild(svg('rect', { x, y, width: w, height: h, fill: 'none', stroke: '#333' }));
  },
  germany: (root, x, y, w, h) => {
    root.appendChild(svg('rect', { x, y, width: w, height: h / 3, fill: '#000' }));
    root.appendChild(svg('rect', { x, y: y + h / 3, width: w, height: h / 3, fill: '#dd0000' }));
    root.appendChild(svg('rect', { x, y: y + 2 * h / 3, width: w, height: h / 3, fill: '#ffce00' }));
  },
  india: (root, x, y, w, h) => {
    root.appendChild(svg('rect', { x, y, width: w, height: h / 3, fill: '#ff9933' }));
    root.appendChild(svg('rect', { x, y: y + h / 3, width: w, height: h / 3, fill: '#fff' }));
    root.appendChild(svg('rect', { x, y: y + 2 * h / 3, width: w, height: h / 3, fill: '#138808' }));
    root.appendChild(svg('circle', { cx: x + w / 2, cy: y + h / 2, r: h * 0.13, fill: 'none', stroke: '#000080', 'stroke-width': 2 }));
  },
  southafrica: (root, x, y, w, h) => {
    root.appendChild(svg('rect', { x, y, width: w, height: h / 2, fill: '#e03c31' }));
    root.appendChild(svg('rect', { x, y: y + h / 2, width: w, height: h / 2, fill: '#001489' }));
    root.appendChild(svg('polygon', { points: `${x},${y} ${x + w * 0.4},${y + h / 2} ${x},${y + h}`, fill: '#007749' }));
    root.appendChild(svg('rect', { x, y, width: w, height: h, fill: 'none', stroke: '#333' }));
  },
  australia: (root, x, y, w, h) => {
    root.appendChild(svg('rect', { x, y, width: w, height: h, fill: '#012169' }));
    root.appendChild(svg('rect', { x, y, width: w / 2, height: h / 2, fill: '#012169' }));
    root.appendChild(svg('polygon', { points: `${x},${y} ${x + w * 0.5},${y + h * 0.5} ${x + w * 0.5},${y} ${x},${y + h * 0.5}`, fill: 'none', stroke: '#fff', 'stroke-width': 2 }));
    [[0.7, 0.7], [0.85, 0.4], [0.6, 0.2], [0.85, 0.85]].forEach(([fx, fy]) => {
      root.appendChild(svgText('★', { x: x + w * fx, y: y + h * fy, fill: '#fff', 'font-size': 12 }));
    });
  },
};
function renderFlag(container, spec) {
  const W = 280, H = 200;
  const root = svgRoot(W, H);
  root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'rgba(255,255,255,0.05)', rx: 12 }));
  // pole
  root.appendChild(svg('rect', { x: 30, y: 30, width: 6, height: 150, fill: '#7a5c3a' }));
  root.appendChild(svg('circle', { cx: 33, cy: 28, r: 6, fill: '#ffd14e' }));
  const fw = 200, fh = 120, fx = 36, fy = 40;
  const drawer = FLAG_DRAWERS[spec.flag];
  if (drawer) drawer(root, fx, fy, fw, fh);
  else root.appendChild(svgText('🏳️', { x: W / 2, y: H / 2, 'font-size': 60 }));
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== TIMELINE (History) ==============
// spec: { type:'timeline', events:[{year, label, emoji}], highlight }
function renderTimeline(container, spec) {
  const W = 480, H = 220;
  const root = svgRoot(W, H);
  const baseY = 130;
  // spine
  root.appendChild(svg('line', {
    x1: 30, x2: W - 30, y1: baseY, y2: baseY,
    stroke: '#ffd14e', 'stroke-width': 4, 'stroke-linecap': 'round',
  }));
  const events = spec.events || [];
  const n = events.length;
  events.forEach((ev, i) => {
    const x = 40 + i * ((W - 80) / Math.max(1, n - 1));
    const isHi = spec.highlight === ev.label;
    // tick
    root.appendChild(svg('line', {
      x1: x, x2: x, y1: baseY - 6, y2: baseY + 6,
      stroke: '#fff', 'stroke-width': 2,
    }));
    // event card alternating
    const above = i % 2 === 0;
    const cardY = above ? 30 : 150;
    const cardH = 70;
    root.appendChild(svg('line', {
      x1: x, x2: x, y1: above ? cardY + cardH : cardY, y2: baseY,
      stroke: '#ffd14e', 'stroke-width': 1, 'stroke-dasharray': '2,2',
    }));
    const cardW = 100, cardX = x - cardW / 2;
    root.appendChild(svg('rect', {
      x: cardX, y: cardY, width: cardW, height: cardH, rx: 8,
      fill: isHi ? '#ffd14e' : '#fdf6e3',
      stroke: isHi ? '#ff7b3d' : '#7a5538', 'stroke-width': 2,
    }));
    root.appendChild(svgText(ev.emoji || '⏳', {
      x, y: cardY + 22, 'font-size': 22,
    }));
    root.appendChild(svgText(ev.label, {
      x, y: cardY + 44, 'font-size': 11, 'font-weight': 700, fill: '#1a1f3a',
    }));
    root.appendChild(svgText(ev.year, {
      x, y: cardY + 60, 'font-size': 10, fill: '#666',
    }));
  });
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== LANDMARK (History / Geography) ==============
// spec: { type:'landmark', sky, ground, items:[{emoji,x,y,size}], banner }
function renderLandmark(container, spec) {
  const W = 480, H = 240;
  const root = svgRoot(W, H);
  // sky
  const skyGrad = svg('defs', {}, [
    svg('linearGradient', { id: 'lmSky', x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, [
      (() => { const s = svg('stop', { offset: '0%', 'stop-color': spec.skyTop || '#ffd96b' }); return s; })(),
      (() => { const s = svg('stop', { offset: '100%', 'stop-color': spec.skyBottom || '#ff8a5b' }); return s; })(),
    ]),
  ]);
  root.appendChild(skyGrad);
  root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H * 0.75, fill: 'url(#lmSky)' }));
  // sun/moon
  if (spec.sun !== false) {
    root.appendChild(svg('circle', { cx: W * 0.85, cy: H * 0.2, r: 22, fill: '#fff8b0', opacity: 0.9 }));
  }
  // ground
  root.appendChild(svg('rect', { x: 0, y: H * 0.75, width: W, height: H * 0.25, fill: spec.ground || '#c9a36c' }));
  // dunes / hills silhouette
  root.appendChild(svg('path', {
    d: `M0,${H * 0.78} Q${W * 0.25},${H * 0.66} ${W * 0.5},${H * 0.78} T${W},${H * 0.78} L${W},${H} L0,${H} Z`,
    fill: spec.hills || '#a87a4f', opacity: 0.6,
  }));
  (spec.items || []).forEach(it => {
    root.appendChild(svgText(it.emoji, {
      x: it.x * W, y: it.y * H, 'font-size': it.size || 50,
      class: it.float ? 'float-y' : undefined,
    }));
  });
  if (spec.banner) {
    root.appendChild(svg('rect', {
      x: 20, y: 12, width: W - 40, height: 28, rx: 8,
      fill: 'rgba(0,0,0,0.5)',
    }));
    root.appendChild(svgText(spec.banner, {
      x: W / 2, y: 27, fill: '#ffd14e', 'font-size': 14, 'font-weight': 700,
    }));
  }
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== WORDTILES (Language Arts) ==============
// spec: { type:'wordtiles', tiles:['p','h','o','t','o','n'], reveal:[0,1,2], hint }
function renderWordtiles(container, spec) {
  const tiles = spec.tiles || [];
  const reveal = new Set(spec.reveal || tiles.map((_, i) => i));
  const W = Math.max(280, tiles.length * 50 + 60), H = 180;
  const root = svgRoot(W, H);
  const tileSize = Math.min(48, (W - 60) / tiles.length);
  const totalW = tiles.length * (tileSize + 4) - 4;
  const startX = (W - totalW) / 2;
  const y = 60;
  tiles.forEach((ch, i) => {
    const x = startX + i * (tileSize + 4);
    const shown = reveal.has(i);
    root.appendChild(svg('rect', {
      x, y, width: tileSize, height: tileSize, rx: 8,
      fill: shown ? '#fdf6e3' : '#5a5a8a',
      stroke: shown ? '#c89a3d' : '#3a3a6a', 'stroke-width': 3,
    }));
    if (shown) {
      root.appendChild(svgText(ch.toUpperCase(), {
        x: x + tileSize / 2, y: y + tileSize / 2,
        'font-size': tileSize * 0.55, 'font-weight': 800, fill: '#1a1f3a',
      }));
    } else {
      root.appendChild(svgText('?', {
        x: x + tileSize / 2, y: y + tileSize / 2,
        'font-size': tileSize * 0.55, 'font-weight': 800, fill: '#fff',
      }));
    }
  });
  if (spec.hint) {
    root.appendChild(svgText(spec.hint, {
      x: W / 2, y: 30, fill: '#ffd14e', 'font-size': 14, 'font-weight': 700,
    }));
  }
  if (spec.caption) {
    root.appendChild(svgText(spec.caption, {
      x: W / 2, y: y + tileSize + 28,
      fill: 'white', 'font-size': 13, 'font-style': 'italic', opacity: 0.85,
    }));
  }
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== CHAIN (Science — food chain, life cycle, sequence) ==============
// spec: { type:'chain', items:[{emoji,label}], arrow:'→' }
function renderChain(container, spec) {
  const items = spec.items || [];
  const W = 480, H = 200;
  const root = svgRoot(W, H);
  const slotW = (W - 40) / items.length;
  items.forEach((it, i) => {
    const cx = 20 + slotW * (i + 0.5);
    const cy = H / 2;
    root.appendChild(svg('circle', {
      cx, cy, r: 38,
      fill: it.color || '#fdf6e3',
      stroke: '#ffd14e', 'stroke-width': 3,
    }));
    root.appendChild(svgText(it.emoji, { x: cx, y: cy - 4, 'font-size': 36 }));
    root.appendChild(svgText(it.label || '', {
      x: cx, y: cy + 60, fill: 'white', 'font-size': 13, 'font-weight': 700,
    }));
    if (i < items.length - 1) {
      const ax = cx + 38, ax2 = ax + slotW - 76;
      root.appendChild(svg('line', {
        x1: ax, x2: ax2, y1: cy, y2: cy,
        stroke: '#ffd14e', 'stroke-width': 3, 'marker-end': 'url(#arrowhead)',
      }));
    }
  });
  // arrowhead defs
  const defs = svg('defs');
  const marker = svg('marker', {
    id: 'arrowhead', markerWidth: 8, markerHeight: 8,
    refX: 7, refY: 4, orient: 'auto',
  });
  marker.appendChild(svg('polygon', { points: '0,0 8,4 0,8', fill: '#ffd14e' }));
  defs.appendChild(marker);
  root.insertBefore(defs, root.firstChild);
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== IDIOM (Language Arts) ==============
// spec: { type:'idiom', literal:{emoji,caption}, idiom }
function renderIdiom(container, spec) {
  const W = 360, H = 220;
  const root = svgRoot(W, H);
  // panel frame
  root.appendChild(svg('rect', {
    x: 10, y: 10, width: W - 20, height: H - 20, rx: 16,
    fill: '#fff', stroke: '#1a1f3a', 'stroke-width': 4,
  }));
  // background gradient inside
  const defs = svg('defs');
  const grad = svg('linearGradient', { id: 'idiomBg', x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
  grad.appendChild(svg('stop', { offset: '0%', 'stop-color': '#bdeafd' }));
  grad.appendChild(svg('stop', { offset: '100%', 'stop-color': '#ffe1a8' }));
  defs.appendChild(grad);
  root.appendChild(defs);
  root.appendChild(svg('rect', {
    x: 14, y: 14, width: W - 28, height: H - 28, rx: 14, fill: 'url(#idiomBg)',
  }));
  root.appendChild(svgText(spec.literal && spec.literal.emoji || '🤔', {
    x: W / 2, y: H / 2 - 10, 'font-size': 72,
  }));
  root.appendChild(svgText(spec.idiom || '', {
    x: W / 2, y: H - 36, 'font-size': 18, 'font-weight': 800, fill: '#1a1f3a',
  }));
  if (spec.literal && spec.literal.caption) {
    root.appendChild(svgText(spec.literal.caption, {
      x: W / 2, y: H - 18, 'font-size': 12, 'font-style': 'italic', fill: '#555',
    }));
  }
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== WEATHER (Science) ==============
// spec: { type:'weather', kind:'water_cycle' | 'storm' | 'sunny' }
function renderWeather(container, spec) {
  const W = 480, H = 240;
  const root = svgRoot(W, H);
  // sky
  root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H * 0.65, fill: '#7ec8ff' }));
  // ground
  root.appendChild(svg('rect', { x: 0, y: H * 0.65, width: W, height: H * 0.35, fill: '#3b8856' }));
  if (spec.kind === 'water_cycle') {
    // ocean
    root.appendChild(svg('rect', { x: 0, y: H * 0.65, width: W * 0.45, height: H * 0.35, fill: '#1e6fb8' }));
    // sun
    root.appendChild(svg('circle', { cx: 60, cy: 50, r: 26, fill: '#ffd14e' }));
    // cloud
    const cloudG = svg('g', { class: 'drift-x' });
    cloudG.appendChild(svg('ellipse', { cx: 240, cy: 70, rx: 60, ry: 22, fill: '#fff' }));
    cloudG.appendChild(svg('circle', { cx: 215, cy: 60, r: 22, fill: '#fff' }));
    cloudG.appendChild(svg('circle', { cx: 270, cy: 60, r: 26, fill: '#fff' }));
    root.appendChild(cloudG);
    // arrows
    root.appendChild(svgText('↑', { x: 130, y: 130, 'font-size': 36, fill: '#fff', 'font-weight': 800 }));
    root.appendChild(svgText('evaporation', { x: 130, y: 165, 'font-size': 11, fill: '#fff', 'font-weight': 700 }));
    root.appendChild(svgText('↓', { x: 360, y: 130, 'font-size': 36, fill: '#5aa9e6', 'font-weight': 800 }));
    root.appendChild(svgText('precipitation', { x: 360, y: 165, 'font-size': 11, fill: '#5aa9e6', 'font-weight': 700 }));
    // raindrops
    for (let i = 0; i < 8; i++) {
      root.appendChild(svgText('💧', { x: 320 + (i % 4) * 20, y: 110 + Math.floor(i / 4) * 14, 'font-size': 14 }));
    }
  } else if (spec.kind === 'storm') {
    const cloudG = svg('g');
    cloudG.appendChild(svg('ellipse', { cx: 240, cy: 80, rx: 110, ry: 30, fill: '#5a5a6a' }));
    cloudG.appendChild(svg('circle', { cx: 200, cy: 65, r: 30, fill: '#5a5a6a' }));
    cloudG.appendChild(svg('circle', { cx: 280, cy: 65, r: 32, fill: '#5a5a6a' }));
    root.appendChild(cloudG);
    root.appendChild(svgText('⚡', { x: 240, y: 145, 'font-size': 50 }));
    for (let i = 0; i < 12; i++) {
      root.appendChild(svgText('💧', { x: 160 + i * 16, y: 110 + (i % 3) * 16, 'font-size': 14 }));
    }
  } else {
    // sunny default
    root.appendChild(svg('circle', { cx: W / 2, cy: 80, r: 40, fill: '#ffd14e' }));
    root.appendChild(svg('circle', { cx: W / 2, cy: 80, r: 55, fill: '#ffd14e', opacity: 0.3 }));
    root.appendChild(svgText('☀️', { x: W / 2, y: 80, 'font-size': 50 }));
  }
  if (spec.caption) {
    root.appendChild(svgText(spec.caption, {
      x: W / 2, y: H - 12, fill: '#fff', 'font-size': 13, 'font-weight': 700,
    }));
  }
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== DIAGRAM (labeled hotspots) ==============
// spec: { type:'diagram', figure:'human'|'plant', highlight:'heart' }
function renderDiagram(container, spec) {
  const W = 320, H = 240;
  const root = svgRoot(W, H);
  if (spec.figure === 'human') {
    // simple human silhouette
    root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'rgba(255,255,255,0.05)', rx: 12 }));
    // head
    root.appendChild(svg('circle', { cx: W / 2, cy: 50, r: 26, fill: '#ffd9b3' }));
    // body
    root.appendChild(svg('rect', { x: W / 2 - 40, y: 76, width: 80, height: 110, rx: 16, fill: '#5aa9e6' }));
    // arms
    root.appendChild(svg('rect', { x: W / 2 - 60, y: 80, width: 18, height: 80, rx: 9, fill: '#ffd9b3' }));
    root.appendChild(svg('rect', { x: W / 2 + 42, y: 80, width: 18, height: 80, rx: 9, fill: '#ffd9b3' }));
    // legs
    root.appendChild(svg('rect', { x: W / 2 - 30, y: 186, width: 22, height: 50, rx: 8, fill: '#1a1f3a' }));
    root.appendChild(svg('rect', { x: W / 2 + 8, y: 186, width: 22, height: 50, rx: 8, fill: '#1a1f3a' }));
    // organs
    const hi = spec.highlight;
    const organs = {
      heart: { cx: W / 2 - 8, cy: 110, r: 12, color: '#e85a4f', label: 'Heart' },
      lungs: { cx: W / 2, cy: 105, r: 18, color: '#ff9999', label: 'Lungs' },
      stomach: { cx: W / 2 + 4, cy: 140, r: 14, color: '#ff7b6b', label: 'Stomach' },
      brain: { cx: W / 2, cy: 50, r: 18, color: '#c4a3ff', label: 'Brain' },
    };
    Object.entries(organs).forEach(([k, o]) => {
      if (hi !== k) return;
      root.appendChild(svg('circle', {
        cx: o.cx, cy: o.cy, r: o.r + 6, fill: 'none',
        stroke: '#ffd14e', 'stroke-width': 2, opacity: 0.7,
      }));
      root.appendChild(svg('circle', { cx: o.cx, cy: o.cy, r: o.r, fill: o.color }));
      root.appendChild(svgText(o.label, {
        x: W - 50, y: o.cy, fill: '#ffd14e', 'font-size': 14, 'font-weight': 700,
      }));
      root.appendChild(svg('line', {
        x1: o.cx + o.r, x2: W - 80, y1: o.cy, y2: o.cy,
        stroke: '#ffd14e', 'stroke-width': 1.5, 'stroke-dasharray': '3,2',
      }));
    });
  } else if (spec.figure === 'plant') {
    root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'rgba(255,255,255,0.05)', rx: 12 }));
    // ground
    root.appendChild(svg('rect', { x: 0, y: H - 50, width: W, height: 50, fill: '#7a5538' }));
    // stem
    root.appendChild(svg('rect', { x: W / 2 - 4, y: 80, width: 8, height: 110, fill: '#3b8856' }));
    // leaves
    root.appendChild(svg('ellipse', { cx: W / 2 - 30, cy: 120, rx: 30, ry: 12, fill: '#4eb86b', transform: `rotate(-20 ${W / 2 - 30} 120)` }));
    root.appendChild(svg('ellipse', { cx: W / 2 + 30, cy: 140, rx: 30, ry: 12, fill: '#4eb86b', transform: `rotate(20 ${W / 2 + 30} 140)` }));
    // flower
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      root.appendChild(svg('circle', {
        cx: W / 2 + Math.cos(ang) * 18, cy: 70 + Math.sin(ang) * 18,
        r: 14, fill: '#ff7b6b',
      }));
    }
    root.appendChild(svg('circle', { cx: W / 2, cy: 70, r: 12, fill: '#ffd14e' }));
    // roots
    root.appendChild(svg('path', {
      d: `M${W / 2},${H - 50} L${W / 2 - 25},${H - 10} M${W / 2},${H - 50} L${W / 2 + 25},${H - 10} M${W / 2},${H - 50} L${W / 2},${H - 10}`,
      stroke: '#5a3d10', 'stroke-width': 2, fill: 'none',
    }));
    // labels
    const labels = {
      flower: { x: W / 2, y: 70, text: 'Flower' },
      stem: { x: W / 2, y: 130, text: 'Stem' },
      leaves: { x: W / 2 + 60, y: 140, text: 'Leaves' },
      roots: { x: W / 2, y: H - 20, text: 'Roots' },
    };
    Object.entries(labels).forEach(([k, l]) => {
      if (spec.highlight === k) {
        root.appendChild(svg('rect', {
          x: l.x - 32, y: l.y - 10, width: 64, height: 20, rx: 6,
          fill: '#ffd14e', opacity: 0.9,
        }));
        root.appendChild(svgText(l.text, {
          x: l.x, y: l.y, fill: '#1a1f3a', 'font-size': 13, 'font-weight': 800,
        }));
      }
    });
  }
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== CIRCUIT (Science) ==============
// spec: { type:'circuit', closed:true, has_bulb:true, has_battery:true, lit:true }
function renderCircuit(container, spec) {
  const W = 360, H = 200;
  const root = svgRoot(W, H);
  root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'rgba(255,255,255,0.05)', rx: 12 }));
  // wire as rectangle path
  const closed = spec.closed !== false;
  const path = closed
    ? `M70,60 L290,60 L290,150 L70,150 Z`
    : `M70,60 L200,60 M220,60 L290,60 L290,150 L70,150 Z`;
  root.appendChild(svg('path', {
    d: path, stroke: '#ffd14e', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round',
  }));
  // battery
  root.appendChild(svg('rect', { x: 60, y: 140, width: 70, height: 22, fill: '#5a5a6a', rx: 4 }));
  root.appendChild(svg('rect', { x: 130, y: 144, width: 8, height: 14, fill: '#5a5a6a' }));
  root.appendChild(svgText('🔋', { x: 95, y: 152, 'font-size': 18 }));
  // bulb
  const lit = spec.lit && closed;
  root.appendChild(svg('circle', { cx: 200, cy: 100, r: 22, fill: lit ? '#ffe066' : '#ddd', stroke: '#888', 'stroke-width': 2 }));
  if (lit) {
    root.appendChild(svg('circle', { cx: 200, cy: 100, r: 36, fill: '#ffe066', opacity: 0.4 }));
  }
  root.appendChild(svgText('💡', { x: 200, y: 100, 'font-size': 28 }));
  // switch
  if (!closed) {
    root.appendChild(svg('line', {
      x1: 200, x2: 218, y1: 60, y2: 45,
      stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round',
    }));
  }
  root.appendChild(svgText(closed ? 'closed circuit' : 'open circuit', {
    x: W / 2, y: H - 12, fill: '#fff', 'font-size': 13, 'font-weight': 700,
  }));
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== LIFECYCLE (Science) ==============
// spec: { type:'lifecycle', stages:[{emoji,label}] }
function renderLifecycle(container, spec) {
  const W = 360, H = 240;
  const root = svgRoot(W, H);
  const stages = spec.stages || [];
  const cx = W / 2, cy = H / 2 + 6;
  const r = 80;
  // ring
  root.appendChild(svg('circle', { cx, cy, r, fill: 'none', stroke: '#ffd14e', 'stroke-width': 2, 'stroke-dasharray': '4,4' }));
  stages.forEach((s, i) => {
    const ang = (i / stages.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(ang) * r;
    const y = cy + Math.sin(ang) * r;
    root.appendChild(svg('circle', { cx: x, cy: y, r: 26, fill: '#fdf6e3', stroke: '#ffd14e', 'stroke-width': 3 }));
    root.appendChild(svgText(s.emoji, { x, y: y - 2, 'font-size': 26 }));
    root.appendChild(svgText(s.label, {
      x, y: y + 40, fill: '#fff', 'font-size': 11, 'font-weight': 700,
    }));
    // arrow to next
    const na = ((i + 1) / stages.length) * Math.PI * 2 - Math.PI / 2;
    const nx = cx + Math.cos(na) * r;
    const ny = cy + Math.sin(na) * r;
    const mid = { x: (x + nx) / 2, y: (y + ny) / 2 };
    const mr = Math.sqrt((mid.x - cx) ** 2 + (mid.y - cy) ** 2);
    const ma = Math.atan2(mid.y - cy, mid.x - cx);
    const ax = cx + Math.cos(ma) * (mr + 12);
    const ay = cy + Math.sin(ma) * (mr + 12);
    root.appendChild(svgText('➜', {
      x: ax, y: ay, 'font-size': 14, fill: '#ffd14e',
      transform: `rotate(${(ma + Math.PI / 2) * 180 / Math.PI} ${ax} ${ay})`,
    }));
  });
  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}

// ============== ISLAND HERO illustrations (used on map cards) ==============
function renderIslandHero(container, key) {
  container.innerHTML = '';
  const W = 280, H = 110;
  const root = svgRoot(W, H);
  if (key === 'stargazer') {
    // starfield + spinning planets
    for (let i = 0; i < 30; i++) {
      root.appendChild(svg('circle', {
        cx: Math.random() * W, cy: Math.random() * H, r: Math.random() * 1.4 + 0.4,
        fill: '#fff', opacity: Math.random() * 0.7 + 0.2,
      }));
    }
    root.appendChild(svg('circle', { cx: W / 2, cy: H / 2, r: 18, fill: '#ffd14e' }));
    [{ r: 30, color: '#7ec8ff', s: 8 }, { r: 46, color: '#ff7b6b', s: 14 }].forEach((b) => {
      root.appendChild(svg('circle', { cx: W / 2, cy: H / 2, r: b.r, fill: 'none', stroke: 'rgba(255,255,255,0.3)' }));
      const g = svg('g', {
        style: `transform-origin: ${W / 2}px ${H / 2}px; animation: orbit-spin ${b.s}s linear infinite;`,
      });
      g.appendChild(svg('circle', { cx: W / 2 + b.r, cy: H / 2, r: 6, fill: b.color }));
      root.appendChild(g);
    });
  } else if (key === 'atlas') {
    // globe with continents
    root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: '#1e4a8a' }));
    const gx = W / 2, gy = H / 2;
    root.appendChild(svg('circle', { cx: gx, cy: gy, r: 48, fill: '#3b8856', stroke: '#fff', 'stroke-width': 3 }));
    root.appendChild(svg('path', { d: `M${gx - 30},${gy - 10} q15,-12 30,0 q-5,18 -15,15 q-15,-3 -15,-15 z`, fill: '#234d2a' }));
    root.appendChild(svg('path', { d: `M${gx - 5},${gy + 8} q12,-2 18,10 q-8,12 -18,8 z`, fill: '#234d2a' }));
    root.appendChild(svg('ellipse', { cx: gx, cy: gy, rx: 60, ry: 14, fill: 'none', stroke: '#ffd14e', 'stroke-width': 2, transform: `rotate(-20 ${gx} ${gy})` }));
    root.appendChild(svg('circle', { cx: gx + 56, cy: gy - 14, r: 4, fill: '#ffd14e' }));
  } else if (key === 'chronicle') {
    // pyramid + columns silhouette
    const grad = svg('defs', {}, [
      svg('linearGradient', { id: 'chSky', x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, [
        svg('stop', { offset: '0%', 'stop-color': '#ffd96b' }),
        svg('stop', { offset: '100%', 'stop-color': '#ff8a5b' }),
      ]),
    ]);
    root.appendChild(grad);
    root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#chSky)' }));
    root.appendChild(svg('circle', { cx: W * 0.78, cy: 30, r: 14, fill: '#fff8b0' }));
    root.appendChild(svg('polygon', { points: `60,90 100,30 140,90`, fill: '#c9a36c', stroke: '#7a5538', 'stroke-width': 2 }));
    root.appendChild(svg('polygon', { points: `130,90 170,50 210,90`, fill: '#c9a36c', stroke: '#7a5538', 'stroke-width': 2 }));
    // column ruins
    [220, 240, 260].forEach((x) => {
      root.appendChild(svg('rect', { x, y: 60, width: 8, height: 30, fill: '#fdf6e3' }));
    });
    root.appendChild(svg('rect', { x: 215, y: 56, width: 53, height: 6, fill: '#ede4c5' }));
    root.appendChild(svg('rect', { x: 0, y: 90, width: W, height: 20, fill: '#a87a4f' }));
  } else if (key === 'wordsmith') {
    // book + floating letters
    root.appendChild(svg('rect', { x: 0, y: 0, width: W, height: H, fill: '#3a1a30' }));
    root.appendChild(svg('rect', { x: W / 2 - 60, y: H / 2 - 30, width: 120, height: 60, fill: '#fdf6e3', stroke: '#c89a3d', 'stroke-width': 3 }));
    root.appendChild(svg('line', { x1: W / 2, x2: W / 2, y1: H / 2 - 30, y2: H / 2 + 30, stroke: '#c89a3d', 'stroke-width': 2 }));
    root.appendChild(svgText('A', { x: W / 2 - 30, y: H / 2, 'font-size': 28, 'font-weight': 800, fill: '#1a1f3a' }));
    root.appendChild(svgText('B', { x: W / 2 + 30, y: H / 2, 'font-size': 28, 'font-weight': 800, fill: '#1a1f3a' }));
    ['🔤', '✍️', '📜'].forEach((e, i) => {
      root.appendChild(svgText(e, {
        x: 30 + i * 90, y: 25 + (i % 2) * 65, 'font-size': 26,
        class: 'float-y',
      }));
    });
  }
  container.appendChild(root);
}

// ============== Renderer registry ==============
const SCENE_RENDERERS = {
  orbit: renderOrbit,
  worldmap: renderWorldmap,
  flag: renderFlag,
  timeline: renderTimeline,
  landmark: renderLandmark,
  wordtiles: renderWordtiles,
  chain: renderChain,
  idiom: renderIdiom,
  weather: renderWeather,
  diagram: renderDiagram,
  circuit: renderCircuit,
  lifecycle: renderLifecycle,
};
