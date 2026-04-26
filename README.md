# Arhat — Educational Game Suite

A small collection of adaptive, single-page educational games. Vanilla HTML/JS/SVG — no build step.

## Games

### MathQuest: Island Adventure (ages 5–7)
Math puzzle game. Open `index.html` in the repo root.

### MathQuest 2: Story Quests (ages 8–10)
Story-driven math with adaptive difficulty across reading, steps, and skill axes. Open `mathquest2/index.html`.

### CuriosityQuest: Atlas of Wonders (ages 9–11)
Multi-subject explorer covering **Science, Geography & Cultures, History, and Language Arts**, presented as four themed islands with rich SVG scenes (orbits, world maps, timelines, flags, idiom panels, life cycles, circuits, and more). Open `curiosityquest/index.html`.

## Play locally
Open the relevant `index.html` directly, or serve the repo root:
```
python -m http.server 8000
```
Then visit:
- `http://localhost:8000/` — MathQuest 1
- `http://localhost:8000/mathquest2/` — MathQuest 2
- `http://localhost:8000/curiosityquest/` — CuriosityQuest

## Shared engine pattern
All three games share an adaptive engine pattern:
- Per-skill Elo-lite rating (range 50–950 in CQ; 0–1000 in v1)
- Mastery gate: rating ≥ threshold + 6/8 of last 8 correct + median response within fluency target
- Frustration recovery: 3 wrongs in a row drop difficulty by 150
- Soft-hint: fade incorrect choices after a streak of wrongs
- Persistence via `localStorage` (one key per game)

CuriosityQuest and MathQuest 2 also tag distractor choices with **misconception ids**, so the parent dashboard can surface the patterns behind common mistakes.

## File layout per game
Each game lives in its own folder with the same six files:
```
index.html      # screen scaffolding
styles.css      # palette + layout
engine.js       # adaptive engine + persistence
content.js      # skills, realms/islands, problems
scenes.js       # SVG scene renderers (mathquest2 + curiosityquest)
game.js         # UI loop
```
