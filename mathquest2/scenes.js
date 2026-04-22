// MathQuest 2 — SVG scene engine
// Pure functions: render an animated SVG into a container based on a scene spec.
// Scene types: tray, group, path, stack
//
// Spec shape:
//   { type: 'tray', item: '🏮', start: 24, actions: [
//       { kind: 'remove', n: 8, label: 'to children\'s choir' },
//       { kind: 'shatter', n: 2, label: 'knocked over' }
//   ]}

const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  children.forEach(c => el.appendChild(c));
  return el;
}

function svgText(content, attrs = {}) {
  const el = svg('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', ...attrs });
  el.textContent = content;
  return el;
}

// -- Public API --
function renderScene(container, spec, opts = {}) {
  container.innerHTML = '';
  const renderer = SCENE_RENDERERS[spec.type];
  if (!renderer) {
    container.textContent = '';
    return { play: () => {}, replay: () => {} };
  }
  return renderer(container, spec, opts);
}

const SCENE_RENDERERS = {
  tray: renderTrayScene,
  group: renderGroupScene,
  path: renderPathScene,
  stack: renderStackScene,
};

// ---------------- TRAY ----------------
// Items laid out on a grid. Actions: remove (fly off), shatter, add.
function renderTrayScene(container, spec, opts) {
  const W = 480, H = 200;
  const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%' });
  // Background tray
  root.appendChild(svg('rect', {
    x: 20, y: 130, width: W - 40, height: 50, rx: 12,
    fill: '#c8966b', stroke: '#7a5538', 'stroke-width': 3,
  }));
  root.appendChild(svg('rect', {
    x: 20, y: 130, width: W - 40, height: 8, rx: 4,
    fill: '#a87a4f',
  }));

  const items = [];
  const cols = Math.min(spec.start, 12);
  const rows = Math.ceil(spec.start / cols);
  const cellW = (W - 80) / cols;
  const cellH = 36;
  const startY = 130 - rows * cellH - 6;

  for (let i = 0; i < spec.start; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = 40 + c * cellW + cellW / 2;
    const y = startY + r * cellH + cellH / 2;
    const t = svgText(spec.item, {
      x, y, 'font-size': 28,
      style: 'transition: transform 0.6s ease-out, opacity 0.6s ease-out;',
    });
    items.push({ el: t, idx: i, x, y, alive: true });
    root.appendChild(t);
  }

  const labelEl = svg('text', {
    x: W / 2, y: H - 8,
    'text-anchor': 'middle', 'font-size': 13,
    fill: '#ffe', 'font-weight': '700',
    style: 'opacity:0; transition: opacity 0.4s;',
  });
  root.appendChild(labelEl);

  container.appendChild(root);

  let actionIdx = 0;
  let timeouts = [];

  function clearTimers() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
  }

  function showLabel(text) {
    labelEl.textContent = text;
    labelEl.style.opacity = '1';
    timeouts.push(setTimeout(() => { labelEl.style.opacity = '0'; }, 1800));
  }

  function applyAction(action) {
    const alive = items.filter(it => it.alive);
    const targets = alive.slice(0, action.n);
    if (action.label) showLabel(action.label);

    targets.forEach((it, i) => {
      timeouts.push(setTimeout(() => {
        if (action.kind === 'remove') {
          it.el.style.transform = `translate(${(W/2 - it.x) * 0.4}px, -${100 + i * 4}px)`;
          it.el.style.opacity = '0';
        } else if (action.kind === 'shatter') {
          it.el.textContent = '💥';
          it.el.style.transform = `translate(0, 30px) rotate(${(i%2?-1:1)*30}deg)`;
          it.el.style.opacity = '0.3';
          timeouts.push(setTimeout(() => { it.el.style.opacity = '0'; }, 600));
        } else if (action.kind === 'add') {
          // No-op for add in this layout (would need re-layout)
        }
        it.alive = false;
      }, i * 90));
    });
  }

  function play() {
    clearTimers();
    actionIdx = 0;
    items.forEach(it => {
      it.el.style.transform = '';
      it.el.style.opacity = '1';
      it.el.textContent = spec.item;
      it.alive = true;
    });
    const stepDelay = 1700;
    (spec.actions || []).forEach((a, i) => {
      timeouts.push(setTimeout(() => applyAction(a), 600 + i * stepDelay));
    });
  }

  play();
  return { play, replay: play };
}

// ---------------- GROUP ----------------
// Items in clusters. Useful for sharing / multiplication.
// Actions: split (n_groups), share (per_person, people), combine
function renderGroupScene(container, spec, opts) {
  const W = 480, H = 200;
  const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%' });
  container.appendChild(root);

  const items = [];
  for (let i = 0; i < spec.start; i++) {
    const t = svgText(spec.item, {
      x: 0, y: 0, 'font-size': 26,
      style: 'transition: transform 0.7s cubic-bezier(.5,1.5,.5,1), opacity 0.5s;',
    });
    items.push({ el: t, idx: i });
    root.appendChild(t);
  }

  const labelEl = svg('text', {
    x: W / 2, y: H - 6,
    'text-anchor': 'middle', 'font-size': 13, fill: '#ffe', 'font-weight': '700',
    style: 'opacity:0; transition: opacity 0.4s;',
  });
  root.appendChild(labelEl);

  function layoutOne(positions) {
    items.forEach((it, i) => {
      const p = positions[i];
      if (!p) {
        it.el.style.opacity = '0';
        return;
      }
      it.el.style.opacity = '1';
      it.el.setAttribute('x', p.x);
      it.el.setAttribute('y', p.y);
      it.el.style.transform = '';
      if (p.label) it.el.textContent = p.label;
    });
  }

  function singleClusterPositions(n) {
    const cols = Math.min(n, 8);
    const rows = Math.ceil(n / cols);
    const cellW = 36, cellH = 36;
    const totalW = cols * cellW;
    const totalH = rows * cellH;
    const ox = (W - totalW) / 2 + cellW / 2;
    const oy = (H - totalH - 30) / 2 + cellH / 2;
    const positions = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      positions.push({ x: ox + c * cellW, y: oy + r * cellH });
    }
    return positions;
  }

  function multiGroupPositions(groupCount, perGroup) {
    const positions = [];
    const groupW = W / (groupCount + 1);
    for (let g = 0; g < groupCount; g++) {
      const cx = groupW * (g + 1);
      const cols = Math.min(perGroup, 4);
      const rows = Math.ceil(perGroup / cols);
      const cellW = 30, cellH = 30;
      const ox = cx - (cols * cellW) / 2 + cellW / 2;
      const oy = (H - rows * cellH - 30) / 2 + cellH / 2;
      for (let i = 0; i < perGroup; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        positions.push({ x: ox + c * cellW, y: oy + r * cellH });
      }
    }
    return positions;
  }

  let timeouts = [];
  function clearTimers() { timeouts.forEach(clearTimeout); timeouts = []; }

  function showLabel(text) {
    labelEl.textContent = text;
    labelEl.style.opacity = '1';
    timeouts.push(setTimeout(() => { labelEl.style.opacity = '0'; }, 1800));
  }

  function play() {
    clearTimers();
    items.forEach(it => {
      it.el.style.opacity = '0';
      it.el.textContent = spec.item;
    });

    // initial layout: one big cluster
    timeouts.push(setTimeout(() => {
      layoutOne(singleClusterPositions(spec.start));
      if (spec.startLabel) showLabel(spec.startLabel);
    }, 200));

    let t = 1500;
    (spec.actions || []).forEach((action, ai) => {
      timeouts.push(setTimeout(() => {
        if (action.kind === 'split') {
          const groups = action.groups;
          const per = Math.floor(spec.start / groups);
          layoutOne(multiGroupPositions(groups, per));
          if (action.label) showLabel(action.label);
        } else if (action.kind === 'remove_group') {
          // hide last n groups
          const total = items.length;
          for (let i = total - action.n; i < total; i++) {
            if (items[i]) items[i].el.style.opacity = '0';
          }
          if (action.label) showLabel(action.label);
        } else if (action.kind === 'reveal_count') {
          if (action.label) showLabel(action.label);
        }
      }, t));
      t += 1700;
    });
  }

  play();
  return { play, replay: play };
}

// ---------------- PATH ----------------
// A traveler moving along a route with checkpoints.
function renderPathScene(container, spec, opts) {
  const W = 480, H = 200;
  const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%' });

  // Path line
  const pathStr = `M 30 ${H/2} L ${W-30} ${H/2}`;
  root.appendChild(svg('path', {
    d: pathStr, stroke: '#888', 'stroke-width': 4,
    'stroke-dasharray': '8 6', fill: 'none',
  }));

  // Checkpoints
  const checkpoints = spec.checkpoints || [];
  checkpoints.forEach((cp, i) => {
    const x = 30 + (W - 60) * (i / Math.max(1, checkpoints.length - 1));
    root.appendChild(svg('circle', {
      cx: x, cy: H/2, r: 10, fill: '#ffb84d', stroke: '#7a5538', 'stroke-width': 2,
    }));
    const t = svgText(cp.label || (i+1), {
      x, y: H/2 + 30, 'font-size': 12, fill: '#ffe',
    });
    root.appendChild(t);
    if (cp.icon) {
      const ic = svgText(cp.icon, { x, y: H/2 - 28, 'font-size': 24 });
      root.appendChild(ic);
    }
  });

  // Traveler
  const traveler = svgText(spec.item || '🚶', {
    x: 30, y: H/2 - 6, 'font-size': 32,
    style: 'transition: transform 1s ease-in-out;',
  });
  root.appendChild(traveler);

  const labelEl = svg('text', {
    x: W / 2, y: H - 6,
    'text-anchor': 'middle', 'font-size': 13, fill: '#ffe', 'font-weight': '700',
    style: 'opacity:0; transition: opacity 0.4s;',
  });
  root.appendChild(labelEl);

  container.appendChild(root);

  let timeouts = [];
  function clearTimers() { timeouts.forEach(clearTimeout); timeouts = []; }

  function play() {
    clearTimers();
    traveler.style.transform = '';
    let t = 600;
    (spec.actions || []).forEach((action, i) => {
      timeouts.push(setTimeout(() => {
        const dx = (W - 60) * (action.toCheckpoint / Math.max(1, checkpoints.length - 1));
        traveler.style.transform = `translateX(${dx}px)`;
        if (action.label) {
          labelEl.textContent = action.label;
          labelEl.style.opacity = '1';
          timeouts.push(setTimeout(() => { labelEl.style.opacity = '0'; }, 1500));
        }
      }, t));
      t += 1700;
    });
  }
  play();
  return { play, replay: play };
}

// ---------------- STACK ----------------
// Vertical bars (great for money / heights / fuel).
function renderStackScene(container, spec, opts) {
  const W = 480, H = 200;
  const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%' });

  const bars = spec.bars || [];
  const barW = (W - 60) / bars.length - 10;
  const maxVal = Math.max(...bars.map(b => b.value), 1);
  const maxH = H - 60;

  bars.forEach((b, i) => {
    const x = 30 + i * (barW + 10);
    const h = (b.value / maxVal) * maxH;
    const y = H - 30 - h;
    const rect = svg('rect', {
      x, y: H - 30, width: barW, height: 0,
      fill: b.color || '#ffb84d', rx: 6,
      style: 'transition: height 0.8s, y 0.8s;',
    });
    root.appendChild(rect);
    setTimeout(() => {
      rect.setAttribute('y', y);
      rect.setAttribute('height', h);
    }, 200 + i * 250);
    root.appendChild(svgText(b.label, {
      x: x + barW/2, y: H - 12, 'font-size': 12, fill: '#ffe',
    }));
    root.appendChild(svgText(b.value, {
      x: x + barW/2, y: y - 8, 'font-size': 14, fill: '#ffe', 'font-weight': '700',
    }));
  });

  container.appendChild(root);
  return { play: () => {}, replay: () => {} };
}
