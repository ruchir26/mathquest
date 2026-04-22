# MathQuest: Island Adventure

A math puzzle game for ages 5–7. Static HTML/JS — no build step.

## Play locally
Open `index.html` in any browser, or serve the directory:
```
python -m http.server 8000
```

## Files
- `index.html` — shell + screens
- `styles.css` — bright, chunky, kid-friendly UI
- `content.js` — skills, islands, question generators
- `engine.js` — adaptive Elo engine, mastery gate, persistence
- `game.js` — UI loop, rendering, rewards

## Engine highlights
- Per-skill Elo rating (0–1000), updated after each answer
- Frustration recovery: 3 wrong in a row drops difficulty by 150
- Mastery gate: rating ≥ threshold + 6/8 last correct + median time within fluency target
- Soft-hint: after 2 wrongs on a question, wrong choices fade out
- Persistence via `localStorage` (key: `mathquest_profile_v1`)
