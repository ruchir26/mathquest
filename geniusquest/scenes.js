// GeniusQuest — Scene Engine
// Generates SVG illustrations for problem context + solution walkthroughs
// Also renders the animated Pack Art for the shop

// ── SVG helpers ──────────────────────────────────────────────────────────────
function el3(tag, attrs = {}, children = []) {
  const ns = 'http://www.w3.org/2000/svg';
  const n = document.createElementNS(ns, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const c of children) {
    if (typeof c === 'string') n.textContent += c;
    else n.appendChild(c);
  }
  return n;
}
function svgRoot3(w, h, extra = {}) {
  return el3('svg', { viewBox: `0 0 ${w} ${h}`, width: w, height: h,
    xmlns: 'http://www.w3.org/2000/svg', ...extra });
}
function txt3(s, attrs = {}) {
  const t = el3('text', { 'font-family': 'Comic Sans MS, Chalkboard SE, cursive',
    'text-anchor': 'middle', fill: '#222', ...attrs });
  t.textContent = s;
  return t;
}

// ── Pack art for shop ────────────────────────────────────────────────────────
function renderPackArt(container) {
  container.innerHTML = '';
  const svg = svgRoot3(140, 200);

  // Booster pack body
  const body = el3('rect', { x: 10, y: 10, width: 120, height: 180, rx: 12,
    fill: 'url(#packGrad)', stroke: '#ffd014', 'stroke-width': 3 });

  const defs = el3('defs');
  const g1 = el3('linearGradient', { id: 'packGrad', x1: '0', y1: '0', x2: '1', y2: '1' });
  g1.appendChild(el3('stop', { offset: '0%', 'stop-color': '#cc0000' }));
  g1.appendChild(el3('stop', { offset: '50%', 'stop-color': '#7c3aed' }));
  g1.appendChild(el3('stop', { offset: '100%', 'stop-color': '#0694a2' }));
  defs.appendChild(g1);
  svg.appendChild(defs);
  svg.appendChild(body);

  // Stars
  const stars = [[70,50,'★',28,'#ffd014'], [45,80,'✦',18,'#fff'], [95,80,'✦',18,'#fff'],
                  [55,115,'●',10,'rgba(255,255,255,0.5)'], [85,115,'●',10,'rgba(255,255,255,0.5)']];
  for (const [x, y, ch, fs, fill] of stars) {
    svg.appendChild(txt3(ch, { x, y, 'font-size': fs, fill, 'text-anchor': 'middle' }));
  }

  // "BOOSTER PACK" text
  svg.appendChild(txt3('BOOSTER', { x: 70, y: 155, 'font-size': 12, fill: '#fff',
    'font-weight': 'bold', 'letter-spacing': 2 }));
  svg.appendChild(txt3('PACK', { x: 70, y: 172, 'font-size': 12, fill: '#ffd014',
    'font-weight': 'bold', 'letter-spacing': 4 }));

  // Pokéball emblem at top
  const pb = el3('g', { transform: 'translate(52,15) scale(0.3)' });
  pb.appendChild(el3('circle', { cx: 60, cy: 60, r: 56, fill: '#cc0000', stroke: '#fff', 'stroke-width': 5 }));
  pb.appendChild(el3('rect', { x: 4, y: 52, width: 112, height: 16, fill: '#fff' }));
  pb.appendChild(el3('circle', { cx: 60, cy: 60, r: 16, fill: '#fff', stroke: '#333', 'stroke-width': 3 }));
  pb.appendChild(el3('circle', { cx: 60, cy: 60, r: 9, fill: '#333' }));
  svg.appendChild(pb);

  container.appendChild(svg);
}

// ── Scene type: addition (blocks) ────────────────────────────────────────────
function sceneAddition(container, data) {
  const { a = 5, b = 3 } = data;
  const total = a + b;
  const svg = svgRoot3(320, 100);
  const colors = ['#cc0000', '#7c3aed'];

  // Group A blocks
  for (let i = 0; i < Math.min(a, 10); i++) {
    svg.appendChild(el3('rect', { x: 10 + i * 22, y: 20, width: 18, height: 18,
      rx: 3, fill: colors[0], stroke: '#fff', 'stroke-width': 1.5 }));
  }
  // Plus sign
  svg.appendChild(txt3('+', { x: 10 + Math.min(a,10)*22 + 8, y: 36, 'font-size': 20, fill: '#222' }));
  // Group B blocks
  for (let i = 0; i < Math.min(b, 10); i++) {
    svg.appendChild(el3('rect', { x: 10 + Math.min(a,10)*22 + 24 + i*22, y: 20, width: 18, height: 18,
      rx: 3, fill: colors[1], stroke: '#fff', 'stroke-width': 1.5 }));
  }
  // Equals row
  svg.appendChild(txt3('=', { x: 10 + Math.min(total,20)*22 + 8, y: 80, 'font-size': 20, fill: '#222' }));
  for (let i = 0; i < Math.min(total, 15); i++) {
    svg.appendChild(el3('rect', { x: 10 + i * 20, y: 62, width: 16, height: 16,
      rx: 3, fill: i < a ? colors[0] : colors[1], stroke: '#fff', 'stroke-width': 1 }));
  }
  svg.appendChild(txt3(`${a} + ${b} = ${total}`, { x: 160, y: 96, 'font-size': 13, fill: '#444' }));
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: fractionPie ──────────────────────────────────────────────────
function sceneFractionPie(container, data) {
  const { numerator = 3, denominator = 4, label = '' } = data;
  const svg = svgRoot3(200, 160);
  const cx = 100, cy = 80, r = 65;

  // Draw filled slices
  const sliceAngle = (2 * Math.PI) / denominator;
  for (let i = 0; i < denominator; i++) {
    const startAngle = -Math.PI / 2 + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    svg.appendChild(el3('path', { d,
      fill: i < numerator ? '#cc0000' : '#eee',
      stroke: '#fff', 'stroke-width': 2 }));
  }
  svg.appendChild(el3('circle', { cx, cy, r, fill: 'none', stroke: '#333', 'stroke-width': 2.5 }));
  svg.appendChild(txt3(`${numerator}/${denominator}`, { x: cx, y: cy + 4, 'font-size': 18,
    fill: '#fff', 'font-weight': 'bold' }));
  if (label) svg.appendChild(txt3(label, { x: cx, y: 150, 'font-size': 13, fill: '#555' }));
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: rectangleArea ────────────────────────────────────────────────
function sceneRectArea(container, data) {
  const { w = 9, h = 6, unit = 'cm' } = data;
  const svg = svgRoot3(300, 180);
  const rx = 40, ry = 30, rw = Math.min(w * 18, 200), rh = Math.min(h * 18, 110);

  svg.appendChild(el3('rect', { x: rx, y: ry, width: rw, height: rh,
    fill: 'rgba(124,58,237,0.15)', stroke: '#7c3aed', 'stroke-width': 3 }));
  // Width label
  svg.appendChild(txt3(`${w} ${unit}`, { x: rx + rw / 2, y: ry - 8, 'font-size': 14, fill: '#7c3aed' }));
  // Height label
  const tH = el3('text', { x: rx - 10, y: ry + rh / 2, 'font-size': 14, fill: '#7c3aed',
    'text-anchor': 'middle', 'writing-mode': 'tb',
    transform: `rotate(-90, ${rx - 18}, ${ry + rh/2})`,
    'font-family': 'Comic Sans MS, cursive' });
  tH.textContent = `${h} ${unit}`;
  svg.appendChild(tH);
  svg.appendChild(txt3(`Area = ${w}×${h} = ${w*h} ${unit}²`, { x: 150, y: ry + rh + 30,
    'font-size': 15, fill: '#333' }));
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: triangle ────────────────────────────────────────────────────
function sceneTriangle(container, data) {
  const { a = 3, b = 4, label = '' } = data;
  const svg = svgRoot3(260, 180);
  // Right triangle with legs a (horizontal) and b (vertical)
  const scale = Math.min(180 / Math.max(a, b), 22);
  const ox = 30, oy = 20 + b * scale;
  const pts = `${ox},${oy} ${ox + a*scale},${oy} ${ox},${oy - b*scale}`;
  svg.appendChild(el3('polygon', { points: pts,
    fill: 'rgba(6,148,162,0.15)', stroke: '#0694a2', 'stroke-width': 3 }));
  // Right angle marker
  const ms = 10;
  svg.appendChild(el3('polyline', { points: `${ox},${oy-ms} ${ox+ms},${oy-ms} ${ox+ms},${oy}`,
    fill: 'none', stroke: '#0694a2', 'stroke-width': 2 }));
  svg.appendChild(txt3(`${a}`, { x: ox + a*scale/2, y: oy + 18, 'font-size': 14, fill: '#0694a2' }));
  svg.appendChild(txt3(`${b}`, { x: ox - 18, y: oy - b*scale/2, 'font-size': 14, fill: '#0694a2' }));
  const hyp = Math.sqrt(a*a + b*b).toFixed(1);
  svg.appendChild(txt3(`c = √(${a}²+${b}²) = ${hyp}`,
    { x: 130, y: 155, 'font-size': 13, fill: '#333' }));
  if (label) svg.appendChild(txt3(label, { x: 130, y: 173, 'font-size': 12, fill: '#777' }));
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: numberLine ───────────────────────────────────────────────────
function sceneNumberLine(container, data) {
  const { min = 0, max = 20, marks = [], highlight = null } = data;
  const svg = svgRoot3(310, 90);
  const lx = 20, ly = 45, lw = 270;
  const range = max - min;
  const px = v => lx + ((v - min) / range) * lw;

  svg.appendChild(el3('line', { x1: lx, y1: ly, x2: lx + lw, y2: ly,
    stroke: '#333', 'stroke-width': 3 }));
  // Arrows
  svg.appendChild(el3('polygon', { points: `${lx+lw},${ly} ${lx+lw-10},${ly-5} ${lx+lw-10},${ly+5}`,
    fill: '#333' }));

  for (const m of marks) {
    const x = px(m);
    svg.appendChild(el3('line', { x1: x, y1: ly - 8, x2: x, y2: ly + 8,
      stroke: '#333', 'stroke-width': 1.5 }));
    svg.appendChild(txt3(String(m), { x, y: ly + 22, 'font-size': 12, fill: '#333' }));
  }
  if (highlight !== null) {
    const x = px(highlight);
    svg.appendChild(el3('circle', { cx: x, cy: ly, r: 9, fill: '#cc0000', opacity: 0.85 }));
    svg.appendChild(txt3(String(highlight), { x, y: ly - 14, 'font-size': 14, fill: '#cc0000',
      'font-weight': 'bold' }));
  }
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: multiplication (array) ──────────────────────────────────────
function sceneMulArray(container, data) {
  const { rows = 4, cols = 6 } = data;
  const rr = Math.min(rows, 10), rc = Math.min(cols, 12);
  const svg = svgRoot3(280, 140);
  const cw = Math.min(20, 240 / rc), ch = Math.min(20, 100 / rr);
  const ox = (280 - rc * cw) / 2, oy = 15;
  for (let r = 0; r < rr; r++) {
    for (let c = 0; c < rc; c++) {
      svg.appendChild(el3('circle', { cx: ox + c*cw + cw/2, cy: oy + r*ch + ch/2,
        r: cw * 0.38, fill: '#7c3aed', opacity: 0.85 }));
    }
  }
  svg.appendChild(txt3(`${rows} × ${cols} = ${rows*cols}`,
    { x: 140, y: 130, 'font-size': 15, fill: '#333' }));
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: equationBalance ──────────────────────────────────────────────
function sceneEquation(container, data) {
  const { left = '2x + 5', right = '17', solveFor = 'x', value = 6 } = data;
  const svg = svgRoot3(300, 130);
  // Beam
  svg.appendChild(el3('rect', { x: 20, y: 58, width: 260, height: 8, rx: 4, fill: '#7c3aed' }));
  // Fulcrum
  svg.appendChild(el3('polygon', { points: '150,130 130,70 170,70', fill: '#444' }));
  // Left pan
  svg.appendChild(el3('rect', { x: 20, y: 38, width: 80, height: 22, rx: 4,
    fill: 'rgba(204,0,0,0.15)', stroke: '#cc0000', 'stroke-width': 2 }));
  svg.appendChild(txt3(left, { x: 60, y: 54, 'font-size': 13, fill: '#cc0000', 'font-weight': 'bold' }));
  // Right pan
  svg.appendChild(el3('rect', { x: 200, y: 38, width: 80, height: 22, rx: 4,
    fill: 'rgba(6,148,162,0.15)', stroke: '#0694a2', 'stroke-width': 2 }));
  svg.appendChild(txt3(right, { x: 240, y: 54, 'font-size': 13, fill: '#0694a2', 'font-weight': 'bold' }));
  // Solution
  svg.appendChild(txt3(`${solveFor} = ${value}`, { x: 150, y: 115, 'font-size': 16,
    fill: '#7c3aed', 'font-weight': 'bold' }));
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: shapeGrid ─────────────────────────────────────────────────────
function sceneShapeGrid(container, data) {
  const { shape = 'square', size = 6, unit = 'cm' } = data;
  const svg = svgRoot3(260, 160);
  if (shape === 'square') {
    const s = Math.min(size * 18, 120);
    const ox = (260-s)/2, oy = 20;
    svg.appendChild(el3('rect', { x: ox, y: oy, width: s, height: s,
      fill: 'rgba(124,58,237,0.12)', stroke: '#7c3aed', 'stroke-width': 3 }));
    svg.appendChild(txt3(`${size} ${unit}`, { x: ox+s/2, y: oy-8, 'font-size':14, fill:'#7c3aed' }));
    svg.appendChild(txt3(`${size} ${unit}`, { x: ox+s+16, y: oy+s/2, 'font-size':14, fill:'#7c3aed' }));
    svg.appendChild(txt3(`Perimeter = 4×${size} = ${4*size} ${unit}`,
      { x:130, y:oy+s+22, 'font-size':13, fill:'#333' }));
  }
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: sequenceChain ────────────────────────────────────────────────
function sceneSequence(container, data) {
  const { terms = [2,4,8,16,32], highlight = -1 } = data;
  const svg = svgRoot3(310, 80);
  const n = Math.min(terms.length, 7);
  const spacing = 290 / n;
  for (let i = 0; i < n; i++) {
    const x = 20 + i * spacing + spacing/2;
    const isHL = i === highlight;
    svg.appendChild(el3('circle', { cx: x, cy: 38, r: 22,
      fill: isHL ? '#cc0000' : 'rgba(124,58,237,0.15)',
      stroke: isHL ? '#cc0000' : '#7c3aed', 'stroke-width': 2.5 }));
    svg.appendChild(txt3(String(terms[i]), { x, y: 44,
      'font-size': terms[i] > 999 ? 9 : terms[i] > 99 ? 11 : 15,
      fill: isHL ? '#fff' : '#333', 'font-weight': 'bold' }));
    if (i < n - 1) {
      svg.appendChild(el3('line', { x1: x+22, y1: 38, x2: x+spacing-22, y2: 38,
        stroke: '#7c3aed', 'stroke-width': 2 }));
      svg.appendChild(el3('polygon', { points: `${x+spacing-22},38 ${x+spacing-30},33 ${x+spacing-30},43`,
        fill: '#7c3aed' }));
    }
  }
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: orbitDiagram (solar system) ─────────────────────────────────
function sceneOrbit(container, data) {
  const { planets = ['Mercury','Venus','Earth','Mars'] } = data;
  const svg = svgRoot3(300, 200);
  const cx = 150, cy = 100;
  const sunR = 24;
  // Sun
  const sunG = el3('radialGradient', { id: 'sg3' });
  sunG.appendChild(el3('stop', { offset: '0%', 'stop-color': '#fff7aa' }));
  sunG.appendChild(el3('stop', { offset: '100%', 'stop-color': '#ffd014' }));
  const defs = el3('defs'); defs.appendChild(sunG); svg.appendChild(defs);
  svg.appendChild(el3('circle', { cx, cy, r: sunR, fill: 'url(#sg3)', stroke: '#f59e0b', 'stroke-width': 2 }));
  svg.appendChild(txt3('☀', { x: cx, y: cy+7, 'font-size': 20 }));

  const colors = ['#aaa','#e8c97a','#4da8e0','#c1440e','#c88b3a','#e5c97a','#7fc4c4','#4169e1'];
  const sizes  = [4,6,7,5,14,12,9,8];
  const radii  = [38,54,70,88,108,125,142,158];
  const names  = ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'];

  planets.forEach((pname, i) => {
    const ni = names.indexOf(pname);
    if (ni < 0) return;
    const orR = radii[ni];
    if (orR + sunR > 148) return; // skip if outside SVG
    svg.appendChild(el3('circle', { cx, cy, r: orR, fill: 'none',
      stroke: 'rgba(255,255,255,0.18)', 'stroke-width': 1.2 }));
    // Place planet at a nice angle
    const angle = (ni * 47 + 30) % 360;
    const px = cx + orR * Math.cos(angle * Math.PI / 180);
    const py = cy + orR * Math.sin(angle * Math.PI / 180);
    svg.appendChild(el3('circle', { cx: px, cy: py, r: sizes[ni], fill: colors[ni] }));
    svg.appendChild(txt3(pname.slice(0,3), { x: px, y: py - sizes[ni] - 4,
      'font-size': 9, fill: '#eee' }));
  });
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: storyboard (word problem panels) ─────────────────────────────
function sceneStoryboard(container, data) {
  const { panels = [] } = data;
  const W = 300, PW = 90, PH = 70;
  const cols = Math.min(panels.length, 3);
  const svg = svgRoot3(W, 90 + 28);
  const ox = (W - cols * (PW + 10)) / 2;

  panels.slice(0, 3).forEach((p, i) => {
    const px = ox + i * (PW + 10);
    svg.appendChild(el3('rect', { x: px, y: 6, width: PW, height: PH, rx: 8,
      fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.25)', 'stroke-width': 1.5 }));
    // Emoji icon
    svg.appendChild(txt3(p.icon || '📖', { x: px + PW/2, y: 28, 'font-size': 22 }));
    // Wrap text
    const words = (p.text || '').split(' ');
    let line = '', lines = [], y = 50;
    for (const w of words) {
      if ((line + w).length > 12) { lines.push(line.trim()); line = w + ' '; }
      else line += w + ' ';
    }
    if (line.trim()) lines.push(line.trim());
    for (const l of lines.slice(0,2)) {
      svg.appendChild(txt3(l, { x: px + PW/2, y, 'font-size': 9, fill: '#ddd' }));
      y += 11;
    }
  });
  container.innerHTML = '';
  container.appendChild(svg);
}

// ── Scene type: solution steps (for solution screen) ─────────────────────────
function sceneSolutionStep(container, stepObj) {
  container.innerHTML = '';
  if (!stepObj || !stepObj.formula) return;
  const svg = svgRoot3(300, 60);
  svg.appendChild(el3('rect', { x: 5, y: 5, width: 290, height: 50, rx: 10,
    fill: 'rgba(255,208,20,0.08)', stroke: '#ffd014', 'stroke-width': 1.5 }));
  svg.appendChild(txt3(stepObj.formula, { x: 150, y: 36, 'font-size': 16,
    fill: '#ffd014', 'font-weight': 'bold' }));
  container.appendChild(svg);
}

// ── Main dispatcher ───────────────────────────────────────────────────────────
function renderSceneGQ(container, spec) {
  if (!spec || !spec.type) { container.innerHTML = ''; return; }
  switch (spec.type) {
    case 'addition':      sceneAddition(container, spec); break;
    case 'fractionPie':   sceneFractionPie(container, spec); break;
    case 'rectArea':      sceneRectArea(container, spec); break;
    case 'triangle':      sceneTriangle(container, spec); break;
    case 'numberLine':    sceneNumberLine(container, spec); break;
    case 'mulArray':      sceneMulArray(container, spec); break;
    case 'equation':      sceneEquation(container, spec); break;
    case 'shapeGrid':     sceneShapeGrid(container, spec); break;
    case 'sequence':      sceneSequence(container, spec); break;
    case 'orbit':         sceneOrbit(container, spec); break;
    case 'storyboard':    sceneStoryboard(container, spec); break;
    case 'solutionStep':  sceneSolutionStep(container, spec); break;
    default: container.innerHTML = '';
  }
}

// ── Hall hero animations for the Home screen ──────────────────────────────────
function renderHallHero(container, hall) {
  container.innerHTML = '';
  if (hall === 'math') {
    const svg = svgRoot3(140, 90);
    // Floating equation: 2+3=5
    const group = el3('g');
    ['2', '+', '3', '=', '5'].forEach((ch, i) => {
      const t = txt3(ch, { x: 18 + i*26, y: 50, 'font-size': 22,
        fill: ['#ffd014','#fff','#ffd014','#fff','#7c3aed'][i], 'font-weight': 'bold' });
      t.style.animation = `float-y 2s ease-in-out ${i*0.15}s infinite alternate`;
      group.appendChild(t);
    });
    svg.appendChild(group);
    // Decorative circles
    svg.appendChild(el3('circle', { cx: 110, cy: 22, r: 12,
      fill: 'rgba(124,58,237,0.25)', stroke: '#7c3aed', 'stroke-width': 1.5 }));
    svg.appendChild(txt3('π', { x: 110, y: 27, 'font-size': 14, fill: '#7c3aed', 'font-weight': 'bold' }));
    container.appendChild(svg);

  } else if (hall === 'english') {
    const svg = svgRoot3(140, 90);
    ['A','B','C','✏'].forEach((ch, i) => {
      const t = txt3(ch, { x: 22 + i*32, y: 52, 'font-size': 24,
        fill: ['#db2777','#fff','#f472b6','#ffd014'][i], 'font-weight': 'bold' });
      t.style.animation = `float-y 2.4s ease-in-out ${i*0.2}s infinite alternate`;
      svg.appendChild(t);
    });
    container.appendChild(svg);

  } else if (hall === 'science') {
    const svg = svgRoot3(140, 90);
    // Atom-like circles
    svg.appendChild(el3('ellipse', { cx: 70, cy: 45, rx: 40, ry: 16,
      fill: 'none', stroke: '#0694a2', 'stroke-width': 2,
      transform: 'rotate(0 70 45)' }));
    svg.appendChild(el3('ellipse', { cx: 70, cy: 45, rx: 40, ry: 16,
      fill: 'none', stroke: '#0694a2', 'stroke-width': 2,
      transform: 'rotate(60 70 45)' }));
    svg.appendChild(el3('ellipse', { cx: 70, cy: 45, rx: 40, ry: 16,
      fill: 'none', stroke: '#0694a2', 'stroke-width': 2,
      transform: 'rotate(120 70 45)' }));
    svg.appendChild(el3('circle', { cx: 70, cy: 45, r: 10, fill: '#0694a2' }));
    svg.appendChild(txt3('⚛', { x: 70, y: 50, 'font-size': 13, fill: '#fff' }));
    container.appendChild(svg);
  }
}
