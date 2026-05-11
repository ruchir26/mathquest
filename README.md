# Arhat — Educational Game Suite

A small collection of adaptive, single-page educational games. Vanilla HTML/JS/SVG — no build step.

## Games

### MathQuest: Island Adventure (ages 5–7)
Math puzzle game. Open `index.html` in the repo root.

### MathQuest 2: Story Quests (ages 8–10)
Story-driven math with adaptive difficulty across reading, steps, and skill axes. Open `mathquest2/index.html`.

### CuriosityQuest: Atlas of Wonders (ages 9–11)
Multi-subject explorer covering **Science, Geography & Cultures, History, and Language Arts**, presented as four themed islands with rich SVG scenes (orbits, world maps, timelines, flags, idiom panels, life cycles, circuits, and more). Open `curiosityquest/index.html`.

### GeniusQuest: Trainer's Path (ages 6+ · gifted learners)
A Pokémon-inspired challenge game for the ambitious young mind. Solve the hardest problems in **Math, English, and Science** to earn Pokédollars (₽), open booster packs, and fill a 150-card Pokédex — including the legendary **Pikachu Illustrator** card for the true Champion.

Key features:
- **9 Math skills** from addition to Olympiad-level problem sets, plus 5 English and 5 Science skills
- **Free-text numeric input** (fractions, mixed numbers, decimals all accepted) with an on-screen numpad for young typists; MCQ for English/Science
- **Illustrated step-by-step solutions** — tap "Show me how" after a wrong answer
- **Graduation mechanic** — master a skill (Elo ≥ threshold, 6/8 recent correct, fluency met) → 50 ₽ + 1 free pack + Hall of Fame entry
- **Genius Vault** — 15 legendary logic & competition problems (unlocks after 3 math graduations), worth 40 ₽ each: Gauss formula, Pigeonhole Principle, River-Crossing, Painted Cube, and more — each with a full illustrated walkthrough
- **Pokémon Center shop** — spend ₽ on individual cards or booster packs (common → uncommon → rare → holo → legendary → master)
- **Trainer XP tiers** — Rookie → Apprentice → Ace Trainer → Elite → Champion
- **Daily Quest** — 8 correct answers/day → free booster pack
- **Win condition** — graduate all 9 math skills + finish the Genius Vault + 80 % Pokédex filled → legendary Pikachu Illustrator card + Champion cinematic

Open `geniusquest/index.html`.

> **Fan/educational disclaimer:** GeniusQuest uses real Pokémon names for educational engagement. All card art is wholly original SVG drawn from scratch — no Nintendo/Game Freak/Creatures Inc. assets are included. This project is non-commercial.

## Play locally
Open the relevant `index.html` directly, or serve the repo root:
```
python -m http.server 8000
```
Then visit:
- `http://localhost:8000/` — MathQuest 1
- `http://localhost:8000/mathquest2/` — MathQuest 2
- `http://localhost:8000/curiosityquest/` — CuriosityQuest
- `http://localhost:8000/geniusquest/` — GeniusQuest

## Shared engine pattern
All three games share an adaptive engine pattern:
- Per-skill Elo-lite rating (range 50–950 in CQ; 0–1000 in v1)
- Mastery gate: rating ≥ threshold + 6/8 of last 8 correct + median response within fluency target
- Frustration recovery: 3 wrongs in a row drop difficulty by 150
- Soft-hint: fade incorrect choices after a streak of wrongs
- Persistence via `localStorage` (one key per game)

CuriosityQuest and MathQuest 2 also tag distractor choices with **misconception ids**, so the parent dashboard can surface the patterns behind common mistakes.

## File layout per game
Each game lives in its own folder. GeniusQuest has the most modules:
```
index.html      # screen scaffolding (15 screens)
styles.css      # palette + layout + animations
engine.js       # Elo-lite + math parser + mastery gate + graduation
content.js      # SKILLS_GQ + 90+ Math/English/Science problems
vault.js        # 15 Genius Vault problems + illustrated solutions
scenes.js       # SVG scene renderers
art.js          # Pokémon SVG portrait library
cards.js        # 153-card Pokédex catalog + pack logic
shop.js         # Shop UI (buy cards + packs)
pack.js         # Animated pack reveal with card-flip
collection.js   # Pokédex grid + card detail
game.js         # Full UI loop + all screen transitions
```
