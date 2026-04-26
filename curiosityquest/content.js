// CuriosityQuest — content
// SKILLS_CQ, ISLANDS_CQ, QUESTS_CQ, PROBLEMS_CQ, WONDER_CARDS_CQ
//
// Difficulty bands: 100 (easy) → 800 (hard).
// readingLevel: 100 (kindergarten) → 600 (grade 6).
// All four islands are unlocked from the start (matches mathquest2 policy).

// ============== SKILLS ==============
const SKILLS_CQ = {
  // Science
  sci_planets:   { name: 'Solar System',     threshold: 600, fluencyMs: 14000 },
  sci_circuits:  { name: 'Circuits',         threshold: 600, fluencyMs: 14000 },
  sci_lifecycle: { name: 'Life Cycles',      threshold: 600, fluencyMs: 14000 },
  sci_weather:   { name: 'Weather',          threshold: 600, fluencyMs: 14000 },
  sci_body:      { name: 'Human Body',       threshold: 600, fluencyMs: 14000 },
  // Geography
  geo_continents:{ name: 'Continents',       threshold: 600, fluencyMs: 14000 },
  geo_flags:     { name: 'Flags',            threshold: 600, fluencyMs: 14000 },
  geo_capitals:  { name: 'Capitals',         threshold: 600, fluencyMs: 14000 },
  geo_biomes:    { name: 'Biomes',           threshold: 600, fluencyMs: 14000 },
  geo_landmarks: { name: 'Landmarks',        threshold: 600, fluencyMs: 14000 },
  // History
  hist_ancient:  { name: 'Ancient Worlds',   threshold: 600, fluencyMs: 14000 },
  hist_dinos:    { name: 'Dinosaurs',        threshold: 600, fluencyMs: 14000 },
  hist_inventions:{ name: 'Inventions',      threshold: 600, fluencyMs: 14000 },
  hist_timelines:{ name: 'Timelines',        threshold: 600, fluencyMs: 14000 },
  // Language Arts
  lang_vocab:    { name: 'Vocabulary',       threshold: 600, fluencyMs: 14000 },
  lang_idioms:   { name: 'Idioms',           threshold: 600, fluencyMs: 14000 },
  lang_grammar:  { name: 'Grammar',          threshold: 600, fluencyMs: 14000 },
};

// ============== ISLANDS ==============
const ISLANDS_CQ = [
  {
    id: 'stargazer', name: 'Stargazer Isle', subject: 'Science',
    theme: 'theme-stargazer', emoji: '🌌',
    desc: 'Planets, circuits, weather, and the wonders inside us.',
    skillIds: ['sci_planets', 'sci_circuits', 'sci_lifecycle', 'sci_weather', 'sci_body'],
  },
  {
    id: 'atlas', name: 'Atlas Atoll', subject: 'Geography & Cultures',
    theme: 'theme-atlas', emoji: '🗺️',
    desc: 'Continents, flags, capitals, biomes, and great landmarks.',
    skillIds: ['geo_continents', 'geo_flags', 'geo_capitals', 'geo_biomes', 'geo_landmarks'],
  },
  {
    id: 'chronicle', name: 'Chronicle Cove', subject: 'History',
    theme: 'theme-chronicle', emoji: '🏛️',
    desc: 'Ancient wonders, dinosaurs, inventions, and timelines.',
    skillIds: ['hist_ancient', 'hist_dinos', 'hist_inventions', 'hist_timelines'],
  },
  {
    id: 'wordsmith', name: 'Wordsmith Wharf', subject: 'Language Arts',
    theme: 'theme-wordsmith', emoji: '✍️',
    desc: 'Vocabulary, idioms, grammar — words at play.',
    skillIds: ['lang_vocab', 'lang_idioms', 'lang_grammar'],
  },
];

// ============== QUESTS ==============
// Each quest is a sequence of problem ids drawn from one or two skills.
const QUESTS_CQ = [
  // --- Stargazer ---
  { id: 'q_planets',    islandId: 'stargazer', name: 'Planet Patrol',    skillIds: ['sci_planets'],   length: 6, wonderCardId: 'wc_planets' },
  { id: 'q_circuits',   islandId: 'stargazer', name: 'Living Spark',     skillIds: ['sci_circuits', 'sci_lifecycle'], length: 6, wonderCardId: 'wc_circuits' },
  { id: 'q_weatherbody',islandId: 'stargazer', name: 'Sky and Self',     skillIds: ['sci_weather', 'sci_body'], length: 6, wonderCardId: 'wc_body' },
  // --- Atlas ---
  { id: 'q_continents', islandId: 'atlas',     name: 'Continent Compass',skillIds: ['geo_continents'],length: 6, wonderCardId: 'wc_continents' },
  { id: 'q_flags',      islandId: 'atlas',     name: 'Flag Festival',    skillIds: ['geo_flags', 'geo_capitals'], length: 6, wonderCardId: 'wc_flags' },
  { id: 'q_biomes',     islandId: 'atlas',     name: 'Wild Biomes',      skillIds: ['geo_biomes', 'geo_landmarks'], length: 6, wonderCardId: 'wc_biomes' },
  // --- Chronicle ---
  { id: 'q_ancient',    islandId: 'chronicle', name: 'Ancient Wonders',  skillIds: ['hist_ancient'],  length: 6, wonderCardId: 'wc_ancient' },
  { id: 'q_dinos',      islandId: 'chronicle', name: 'Bones and Roars',  skillIds: ['hist_dinos'],    length: 6, wonderCardId: 'wc_dinos' },
  { id: 'q_inventions', islandId: 'chronicle', name: 'Inventors Hall',   skillIds: ['hist_inventions', 'hist_timelines'], length: 6, wonderCardId: 'wc_inventions' },
  // --- Wordsmith ---
  { id: 'q_vocab',      islandId: 'wordsmith', name: 'Vocabulary Vault', skillIds: ['lang_vocab'],    length: 6, wonderCardId: 'wc_vocab' },
  { id: 'q_idioms',     islandId: 'wordsmith', name: 'Idiom Inn',        skillIds: ['lang_idioms'],   length: 6, wonderCardId: 'wc_idioms' },
  { id: 'q_grammar',    islandId: 'wordsmith', name: 'Grammar Grove',    skillIds: ['lang_grammar'],  length: 6, wonderCardId: 'wc_grammar' },
];

// ============== WONDER CARDS ==============
const WONDER_CARDS_CQ = {
  wc_planets:    { id: 'wc_planets',    islandId: 'stargazer', title: 'A Family of Worlds',
                   text: 'Eight planets circle our Sun. The four small rocky worlds — Mercury, Venus, Earth, and Mars — race close to the Sun, while four giant gas worlds glide far in the cold dark.' },
  wc_circuits:   { id: 'wc_circuits',   islandId: 'stargazer', title: 'A River of Electrons',
                   text: 'Electricity is just tiny particles flowing in a loop. Break the loop and the bulb goes dark. Close it again and the river runs.' },
  wc_body:       { id: 'wc_body',       islandId: 'stargazer', title: 'Inside the Engine',
                   text: 'Your heart pumps blood about 100,000 times each day, and your lungs trade air with the world over 20,000 times.' },
  wc_continents: { id: 'wc_continents', islandId: 'atlas',     title: 'Seven Lands, One Ocean',
                   text: 'Earth has seven continents but really one connected world ocean. Once, all the land was joined together in a giant supercontinent called Pangaea.' },
  wc_flags:      { id: 'wc_flags',      islandId: 'atlas',     title: 'Cloth Stories',
                   text: 'Every flag tells a story. Japan\'s red disc is the rising sun; Canada\'s leaf is the maple; Brazil\'s yellow diamond stands for its golden riches.' },
  wc_biomes:     { id: 'wc_biomes',     islandId: 'atlas',     title: 'Cathedrals of Living Things',
                   text: 'A biome is a giant neighborhood of life — desert, rainforest, tundra, savanna. Each one is a world tuned to its own weather.' },
  wc_ancient:    { id: 'wc_ancient',    islandId: 'chronicle', title: 'Stones That Remember',
                   text: 'The pyramids of Egypt are over 4,500 years old. The Roman Colosseum could hold 50,000 cheering people. Old stones still carry their stories.' },
  wc_dinos:      { id: 'wc_dinos',      islandId: 'chronicle', title: 'When Giants Walked',
                   text: 'Dinosaurs ruled Earth for 165 million years — many times longer than humans have existed. Birds are their living cousins.' },
  wc_inventions: { id: 'wc_inventions', islandId: 'chronicle', title: 'Sparks of Imagination',
                   text: 'The wheel, the printing press, electric light, the airplane — every great invention started as one person asking, "What if?"' },
  wc_vocab:      { id: 'wc_vocab',      islandId: 'wordsmith', title: 'Word Treasure',
                   text: 'English borrows words from over 350 languages. Every new word you learn is a new key for your brain.' },
  wc_idioms:     { id: 'wc_idioms',     islandId: 'wordsmith', title: 'Sayings With a Wink',
                   text: 'An idiom doesn\'t mean what it says. "Break a leg" means good luck. "Spill the beans" means tell a secret.' },
  wc_grammar:    { id: 'wc_grammar',    islandId: 'wordsmith', title: 'The Music of Sentences',
                   text: 'Grammar is the music of language — nouns name, verbs do, adjectives color. Together they sing a sentence.' },
};

// ============== PROBLEMS ==============
// Each problem: { id, skillId, prompt, sceneSpec, choices, difficulty, readingLevel, hint?, explanation? }
// Choices: [{text, correct?, misconception?}]
const PROBLEMS_CQ = [
  // ====== sci_planets ======
  {
    id: 'sp_001', skillId: 'sci_planets', difficulty: 200, readingLevel: 200,
    prompt: 'Which planet is closest to the Sun?',
    sceneSpec: { type: 'orbit', sun: { color: '#ffd14e' }, bodies: [
      { label: 'Mercury', color: '#a8a8a8', size: 6, distance: 36, speed: 6 },
      { label: 'Venus',   color: '#e0b070', size: 8, distance: 60, speed: 9 },
      { label: 'Earth',   color: '#7ec8ff', size: 9, distance: 84, speed: 12 },
    ], highlight: 'Mercury' },
    choices: [
      { text: 'Mercury', correct: true },
      { text: 'Venus', misconception: 'sun_proximity_venus' },
      { text: 'Earth', misconception: 'earth_centric' },
      { text: 'Mars', misconception: 'mars_first' },
    ],
    explanation: 'Mercury is the smallest planet and orbits closest to the Sun.',
  },
  {
    id: 'sp_002', skillId: 'sci_planets', difficulty: 280, readingLevel: 220,
    prompt: 'Which planet is famous for its bright rings?',
    sceneSpec: { type: 'orbit', sun: { color: '#ffd14e' }, bodies: [
      { label: 'Jupiter', color: '#d6a263', size: 12, distance: 50, speed: 12 },
      { label: 'Saturn',  color: '#e8c984', size: 11, distance: 88, speed: 18 },
    ], highlight: 'Saturn' },
    choices: [
      { text: 'Saturn', correct: true },
      { text: 'Jupiter', misconception: 'jupiter_rings' },
      { text: 'Mars', misconception: 'random_inner' },
      { text: 'Earth', misconception: 'earth_centric' },
    ],
    explanation: 'All four gas giants have rings, but Saturn\'s are the brightest by far.',
  },
  {
    id: 'sp_003', skillId: 'sci_planets', difficulty: 360, readingLevel: 260,
    prompt: 'Which planet is called the "Red Planet"?',
    sceneSpec: { type: 'orbit', sun: { color: '#ffd14e' }, bodies: [
      { label: 'Earth', color: '#7ec8ff', size: 9, distance: 50, speed: 12 },
      { label: 'Mars',  color: '#d05a3a', size: 8, distance: 80, speed: 16 },
    ], highlight: 'Mars' },
    choices: [
      { text: 'Mars', correct: true },
      { text: 'Venus', misconception: 'venus_red' },
      { text: 'Mercury', misconception: 'random_inner' },
      { text: 'Jupiter', misconception: 'gas_giant_red' },
    ],
    explanation: 'Iron rust on its surface gives Mars a reddish color.',
  },
  {
    id: 'sp_004', skillId: 'sci_planets', difficulty: 440, readingLevel: 320,
    prompt: 'Which is the LARGEST planet in our solar system?',
    sceneSpec: { type: 'orbit', sun: { color: '#ffd14e' }, bodies: [
      { label: 'Earth',   color: '#7ec8ff', size: 7,  distance: 40, speed: 10 },
      { label: 'Jupiter', color: '#d6a263', size: 16, distance: 78, speed: 18 },
    ], highlight: 'Jupiter' },
    choices: [
      { text: 'Jupiter', correct: true },
      { text: 'Saturn', misconception: 'saturn_biggest' },
      { text: 'Earth', misconception: 'earth_centric' },
      { text: 'Sun', misconception: 'sun_is_planet' },
    ],
    explanation: 'Jupiter is so big you could fit over 1,300 Earths inside it.',
  },
  {
    id: 'sp_005', skillId: 'sci_planets', difficulty: 540, readingLevel: 380,
    prompt: 'Which planets are called the "rocky" or "terrestrial" planets?',
    sceneSpec: { type: 'orbit', sun: { color: '#ffd14e' }, bodies: [
      { label: 'Mercury', color: '#a8a8a8', size: 5, distance: 30, speed: 6 },
      { label: 'Venus',   color: '#e0b070', size: 7, distance: 50, speed: 10 },
      { label: 'Earth',   color: '#7ec8ff', size: 7, distance: 70, speed: 14 },
      { label: 'Mars',    color: '#d05a3a', size: 6, distance: 90, speed: 18 },
    ] },
    choices: [
      { text: 'Mercury, Venus, Earth, Mars', correct: true },
      { text: 'Jupiter, Saturn, Uranus, Neptune', misconception: 'gas_giants_are_rocky' },
      { text: 'Earth and Moon only', misconception: 'earth_centric' },
      { text: 'Saturn and Mars', misconception: 'mixed_categories' },
    ],
    explanation: 'The four inner planets are rocky. The four outer planets are gas or ice giants.',
  },
  {
    id: 'sp_006', skillId: 'sci_planets', difficulty: 660, readingLevel: 460,
    prompt: 'Earth orbits the Sun once. About how long does that take?',
    sceneSpec: { type: 'orbit', sun: { color: '#ffd14e' }, bodies: [
      { label: 'Earth', color: '#7ec8ff', size: 10, distance: 70, speed: 8 },
    ], highlight: 'Earth' },
    choices: [
      { text: '365 days (one year)', correct: true },
      { text: '24 hours (one day)', misconception: 'orbit_vs_rotation' },
      { text: '30 days (one month)', misconception: 'orbit_is_month' },
      { text: '10 years', misconception: 'orbit_too_long' },
    ],
    explanation: 'A YEAR is one full trip around the Sun. A DAY is one spin on its axis.',
  },

  // ====== sci_circuits ======
  {
    id: 'sc_001', skillId: 'sci_circuits', difficulty: 220, readingLevel: 220,
    prompt: 'Look at the circuit. Will the bulb light up?',
    sceneSpec: { type: 'circuit', closed: true, lit: true },
    choices: [
      { text: 'Yes — the loop is complete', correct: true },
      { text: 'No — bulbs need sunlight', misconception: 'bulb_needs_sun' },
      { text: 'No — there\'s no switch', misconception: 'switch_required' },
      { text: 'Only if it\'s daytime', misconception: 'time_of_day' },
    ],
    explanation: 'When the loop is complete (closed), electrons flow and the bulb glows.',
  },
  {
    id: 'sc_002', skillId: 'sci_circuits', difficulty: 300, readingLevel: 240,
    prompt: 'The switch is open. What happens to the bulb?',
    sceneSpec: { type: 'circuit', closed: false, lit: false },
    choices: [
      { text: 'It stays dark', correct: true },
      { text: 'It glows brighter', misconception: 'open_means_more_power' },
      { text: 'It blinks on and off', misconception: 'open_makes_blink' },
      { text: 'It explodes', misconception: 'safety_panic' },
    ],
    explanation: 'An open switch breaks the loop, so electrons can\'t flow.',
  },
  {
    id: 'sc_003', skillId: 'sci_circuits', difficulty: 420, readingLevel: 320,
    prompt: 'Which of these is a GOOD conductor of electricity?',
    sceneSpec: { type: 'circuit', closed: true, lit: true },
    choices: [
      { text: 'Copper wire', correct: true },
      { text: 'Rubber', misconception: 'rubber_conducts' },
      { text: 'Wood', misconception: 'wood_conducts' },
      { text: 'Plastic', misconception: 'plastic_conducts' },
    ],
    explanation: 'Metals like copper let electrons flow easily. Rubber and plastic are insulators.',
  },

  // ====== sci_lifecycle ======
  {
    id: 'sl_001', skillId: 'sci_lifecycle', difficulty: 240, readingLevel: 220,
    prompt: 'What is the correct life cycle of a butterfly?',
    sceneSpec: { type: 'lifecycle', stages: [
      { emoji: '🥚', label: 'Egg' },
      { emoji: '🐛', label: 'Caterpillar' },
      { emoji: '🛏️', label: 'Chrysalis' },
      { emoji: '🦋', label: 'Butterfly' },
    ] },
    choices: [
      { text: 'Egg → Caterpillar → Chrysalis → Butterfly', correct: true },
      { text: 'Butterfly → Caterpillar → Egg → Chrysalis', misconception: 'reverse_lifecycle' },
      { text: 'Egg → Butterfly → Caterpillar', misconception: 'skip_chrysalis' },
      { text: 'Caterpillar → Egg → Butterfly', misconception: 'shuffled' },
    ],
    explanation: 'This big change is called METAMORPHOSIS — "change of form".',
  },
  {
    id: 'sl_002', skillId: 'sci_lifecycle', difficulty: 360, readingLevel: 260,
    prompt: 'A frog starts life in the water as a what?',
    sceneSpec: { type: 'lifecycle', stages: [
      { emoji: '🥚', label: 'Egg' },
      { emoji: '🐟', label: 'Tadpole' },
      { emoji: '🐸', label: 'Frog' },
    ] },
    choices: [
      { text: 'A tadpole (with a tail)', correct: true },
      { text: 'A small frog with legs', misconception: 'frog_skips_tadpole' },
      { text: 'A worm', misconception: 'wrong_animal' },
      { text: 'A fish forever', misconception: 'tadpole_stays_fish' },
    ],
    explanation: 'A tadpole hatches from an egg, slowly grows legs, and loses its tail to become a frog.',
  },
  {
    id: 'sl_003', skillId: 'sci_lifecycle', difficulty: 480, readingLevel: 360,
    prompt: 'A plant\'s life cycle starts with a tiny what?',
    sceneSpec: { type: 'lifecycle', stages: [
      { emoji: '🌰', label: 'Seed' },
      { emoji: '🌱', label: 'Sprout' },
      { emoji: '🌿', label: 'Plant' },
      { emoji: '🌸', label: 'Flower' },
    ] },
    choices: [
      { text: 'Seed', correct: true },
      { text: 'Leaf', misconception: 'leaf_first' },
      { text: 'Flower', misconception: 'flower_first' },
      { text: 'Root', misconception: 'root_first' },
    ],
    explanation: 'A seed holds everything a baby plant needs to start growing.',
  },

  // ====== sci_weather ======
  {
    id: 'sw_001', skillId: 'sci_weather', difficulty: 260, readingLevel: 240,
    prompt: 'The Sun heats ocean water and turns it into invisible vapor in the sky. What is this called?',
    sceneSpec: { type: 'weather', kind: 'water_cycle', caption: 'Water cycle: evaporation → clouds → rain' },
    choices: [
      { text: 'Evaporation', correct: true },
      { text: 'Precipitation', misconception: 'evap_vs_precip' },
      { text: 'Condensation', misconception: 'evap_vs_cond' },
      { text: 'Erosion', misconception: 'wrong_concept' },
    ],
    explanation: 'EVAPORATION turns liquid water into gas. PRECIPITATION is rain falling down.',
  },
  {
    id: 'sw_002', skillId: 'sci_weather', difficulty: 380, readingLevel: 280,
    prompt: 'A flash in a thunderstorm is lightning. What makes the loud BOOM?',
    sceneSpec: { type: 'weather', kind: 'storm', caption: 'Lightning + thunder' },
    choices: [
      { text: 'Air heated by the lightning explodes outward — that\'s thunder', correct: true },
      { text: 'Clouds banging into each other', misconception: 'cloud_collision' },
      { text: 'Rain hitting the ground', misconception: 'rain_makes_thunder' },
      { text: 'Wind whistling', misconception: 'wind_thunder' },
    ],
    explanation: 'Lightning heats the air to over 25,000°C in a flash; it expands so fast it BOOMS.',
  },

  // ====== sci_body ======
  {
    id: 'sb_001', skillId: 'sci_body', difficulty: 240, readingLevel: 220,
    prompt: 'Which organ pumps blood around your body?',
    sceneSpec: { type: 'diagram', figure: 'human', highlight: 'heart' },
    choices: [
      { text: 'The heart', correct: true },
      { text: 'The brain', misconception: 'brain_pumps' },
      { text: 'The lungs', misconception: 'lungs_pump' },
      { text: 'The stomach', misconception: 'stomach_pumps' },
    ],
    explanation: 'Your heart is a muscle the size of your fist. It beats about 100,000 times a day.',
  },
  {
    id: 'sb_002', skillId: 'sci_body', difficulty: 320, readingLevel: 260,
    prompt: 'Which organ takes oxygen out of the air you breathe?',
    sceneSpec: { type: 'diagram', figure: 'human', highlight: 'lungs' },
    choices: [
      { text: 'The lungs', correct: true },
      { text: 'The heart', misconception: 'heart_breathes' },
      { text: 'The kidneys', misconception: 'kidney_breathes' },
      { text: 'The liver', misconception: 'liver_breathes' },
    ],
    explanation: 'Lungs trade oxygen IN and carbon dioxide OUT every time you breathe.',
  },
  {
    id: 'sb_003', skillId: 'sci_body', difficulty: 460, readingLevel: 320,
    prompt: 'Which organ is the body\'s control center, sending signals to everything?',
    sceneSpec: { type: 'diagram', figure: 'human', highlight: 'brain' },
    choices: [
      { text: 'The brain', correct: true },
      { text: 'The heart', misconception: 'heart_thinks' },
      { text: 'The spine', misconception: 'spine_only' },
      { text: 'The stomach', misconception: 'gut_brain' },
    ],
    explanation: 'Your brain has about 86 billion neurons firing thousands of signals every second.',
  },

  // ====== geo_continents ======
  {
    id: 'gc_001', skillId: 'geo_continents', difficulty: 200, readingLevel: 200,
    prompt: 'Which continent is highlighted?',
    sceneSpec: { type: 'worldmap', highlight: 'africa' },
    choices: [
      { text: 'Africa', correct: true },
      { text: 'South America', misconception: 'shape_confusion' },
      { text: 'Australia', misconception: 'random_continent' },
      { text: 'Europe', misconception: 'random_continent' },
    ],
    explanation: 'Africa is the second-largest continent and home to the Sahara Desert and the Nile River.',
  },
  {
    id: 'gc_002', skillId: 'geo_continents', difficulty: 280, readingLevel: 220,
    prompt: 'Which continent is shown highlighted on the map?',
    sceneSpec: { type: 'worldmap', highlight: 'asia' },
    choices: [
      { text: 'Asia', correct: true },
      { text: 'Europe', misconception: 'asia_europe_confusion' },
      { text: 'Africa', misconception: 'random_continent' },
      { text: 'North America', misconception: 'random_continent' },
    ],
    explanation: 'Asia is the largest continent — about 30% of all Earth\'s land.',
  },
  {
    id: 'gc_003', skillId: 'geo_continents', difficulty: 360, readingLevel: 260,
    prompt: 'Which continent is highlighted?',
    sceneSpec: { type: 'worldmap', highlight: 'south_america' },
    choices: [
      { text: 'South America', correct: true },
      { text: 'Africa', misconception: 'shape_confusion' },
      { text: 'North America', misconception: 'north_south_confusion' },
      { text: 'Australia', misconception: 'random_continent' },
    ],
    explanation: 'South America holds the Amazon Rainforest — the largest rainforest on Earth.',
  },
  {
    id: 'gc_004', skillId: 'geo_continents', difficulty: 440, readingLevel: 300,
    prompt: 'How many continents does Earth have?',
    sceneSpec: { type: 'worldmap' },
    choices: [
      { text: '7', correct: true },
      { text: '5', misconception: 'olympics_5' },
      { text: '6', misconception: 'merging_continents' },
      { text: '9', misconception: 'too_many' },
    ],
    explanation: 'The seven are: Africa, Antarctica, Asia, Australia (Oceania), Europe, North America, South America.',
  },
  {
    id: 'gc_005', skillId: 'geo_continents', difficulty: 540, readingLevel: 380,
    prompt: 'Which continent is the COLDEST and almost entirely covered in ice?',
    sceneSpec: { type: 'worldmap', highlight: 'antarctica' },
    choices: [
      { text: 'Antarctica', correct: true },
      { text: 'Europe', misconception: 'cold_means_north' },
      { text: 'North America', misconception: 'cold_means_north' },
      { text: 'Asia', misconception: 'asia_cold' },
    ],
    explanation: 'Antarctica is at the South Pole. It is colder than any other place on Earth.',
  },
  {
    id: 'gc_006', skillId: 'geo_continents', difficulty: 640, readingLevel: 440,
    prompt: 'Which continent is sometimes called "the smallest continent"?',
    sceneSpec: { type: 'worldmap', highlight: 'oceania' },
    choices: [
      { text: 'Australia (Oceania)', correct: true },
      { text: 'Europe', misconception: 'europe_smallest' },
      { text: 'Antarctica', misconception: 'cold_is_small' },
      { text: 'South America', misconception: 'random_continent' },
    ],
    explanation: 'Australia is the smallest of the seven continents in land area.',
  },

  // ====== geo_flags ======
  {
    id: 'gf_001', skillId: 'geo_flags', difficulty: 220, readingLevel: 200,
    prompt: 'Which country has this flag?',
    sceneSpec: { type: 'flag', flag: 'japan' },
    choices: [
      { text: 'Japan', correct: true },
      { text: 'China', misconception: 'asian_red_confusion' },
      { text: 'South Korea', misconception: 'asian_red_confusion' },
      { text: 'Indonesia', misconception: 'asian_red_confusion' },
    ],
    explanation: 'Japan\'s flag is a red disc — the rising sun — on a white field.',
  },
  {
    id: 'gf_002', skillId: 'geo_flags', difficulty: 300, readingLevel: 220,
    prompt: 'Which country has this flag?',
    sceneSpec: { type: 'flag', flag: 'canada' },
    choices: [
      { text: 'Canada', correct: true },
      { text: 'USA', misconception: 'north_american_red' },
      { text: 'Mexico', misconception: 'red_white_red_band' },
      { text: 'United Kingdom', misconception: 'random_western' },
    ],
    explanation: 'Canada\'s flag has a red maple leaf — its national tree symbol.',
  },
  {
    id: 'gf_003', skillId: 'geo_flags', difficulty: 380, readingLevel: 260,
    prompt: 'Which country has this flag?',
    sceneSpec: { type: 'flag', flag: 'brazil' },
    choices: [
      { text: 'Brazil', correct: true },
      { text: 'Argentina', misconception: 'south_american_confusion' },
      { text: 'Italy', misconception: 'green_white_means_italy' },
      { text: 'India', misconception: 'tricolor_confusion' },
    ],
    explanation: 'Brazil\'s flag is green for forests, yellow for gold, with a globe of stars.',
  },

  // ====== geo_capitals ======
  {
    id: 'gp_001', skillId: 'geo_capitals', difficulty: 280, readingLevel: 240,
    prompt: 'What is the capital of France?',
    sceneSpec: { type: 'flag', flag: 'france' },
    choices: [
      { text: 'Paris', correct: true },
      { text: 'London', misconception: 'european_capital_swap' },
      { text: 'Madrid', misconception: 'european_capital_swap' },
      { text: 'Berlin', misconception: 'european_capital_swap' },
    ],
    explanation: 'Paris, on the Seine river, is famous for the Eiffel Tower.',
  },
  {
    id: 'gp_002', skillId: 'geo_capitals', difficulty: 380, readingLevel: 280,
    prompt: 'What is the capital of Australia?',
    sceneSpec: { type: 'flag', flag: 'australia' },
    choices: [
      { text: 'Canberra', correct: true },
      { text: 'Sydney', misconception: 'biggest_city_is_capital' },
      { text: 'Melbourne', misconception: 'biggest_city_is_capital' },
      { text: 'Perth', misconception: 'random_australian_city' },
    ],
    explanation: 'Sydney is the LARGEST city, but Canberra is the capital.',
  },
  {
    id: 'gp_003', skillId: 'geo_capitals', difficulty: 480, readingLevel: 320,
    prompt: 'What is the capital of India?',
    sceneSpec: { type: 'flag', flag: 'india' },
    choices: [
      { text: 'New Delhi', correct: true },
      { text: 'Mumbai', misconception: 'biggest_city_is_capital' },
      { text: 'Bangalore', misconception: 'biggest_city_is_capital' },
      { text: 'Kolkata', misconception: 'random_indian_city' },
    ],
    explanation: 'New Delhi has been India\'s capital since 1911.',
  },

  // ====== geo_biomes ======
  {
    id: 'gb_001', skillId: 'geo_biomes', difficulty: 240, readingLevel: 220,
    prompt: 'A place that is hot, dry, and has very little rain is called what?',
    sceneSpec: { type: 'landmark', skyTop: '#ffd96b', skyBottom: '#ff8a5b', ground: '#e7c887', hills: '#c9a36c',
      items: [{ emoji: '🌵', x: 0.2, y: 0.7, size: 50 }, { emoji: '🌵', x: 0.7, y: 0.78, size: 40 }, { emoji: '☀️', x: 0.8, y: 0.18, size: 40 }],
      banner: 'Biome: ?' },
    choices: [
      { text: 'Desert', correct: true },
      { text: 'Rainforest', misconception: 'opposite_biome' },
      { text: 'Tundra', misconception: 'cold_dry_confusion' },
      { text: 'Wetland', misconception: 'water_confusion' },
    ],
    explanation: 'Deserts get less than 25 cm of rain each year.',
  },
  {
    id: 'gb_002', skillId: 'geo_biomes', difficulty: 360, readingLevel: 280,
    prompt: 'A warm, wet forest with thick green plants and many animals is called a what?',
    sceneSpec: { type: 'landmark', skyTop: '#9ad6a6', skyBottom: '#3b8856', ground: '#234d2a', hills: '#1a3a1f',
      items: [{ emoji: '🌳', x: 0.15, y: 0.65, size: 60 }, { emoji: '🌴', x: 0.5, y: 0.7, size: 70 }, { emoji: '🦜', x: 0.75, y: 0.4, size: 30, float: true }, { emoji: '🌳', x: 0.9, y: 0.7, size: 50 }],
      banner: 'Biome: ?' },
    choices: [
      { text: 'Rainforest', correct: true },
      { text: 'Desert', misconception: 'opposite_biome' },
      { text: 'Savanna', misconception: 'savanna_rainforest' },
      { text: 'Tundra', misconception: 'random_biome' },
    ],
    explanation: 'Rainforests cover only 6% of Earth but hold over half of all species!',
  },
  {
    id: 'gb_003', skillId: 'geo_biomes', difficulty: 480, readingLevel: 340,
    prompt: 'A frozen biome with no trees, near the North or South Pole, is called the:',
    sceneSpec: { type: 'landmark', skyTop: '#a3c8e8', skyBottom: '#e6f0fa', ground: '#dfe8f0', hills: '#bccddd',
      items: [{ emoji: '❄️', x: 0.2, y: 0.3, size: 30 }, { emoji: '🐧', x: 0.5, y: 0.7, size: 50 }, { emoji: '🧊', x: 0.8, y: 0.78, size: 40 }],
      banner: 'Biome: ?' },
    choices: [
      { text: 'Tundra', correct: true },
      { text: 'Desert', misconception: 'cold_isnt_desert' },
      { text: 'Forest', misconception: 'random_biome' },
      { text: 'Wetland', misconception: 'random_biome' },
    ],
    explanation: 'The tundra is too cold for trees. The ground beneath stays frozen all year (permafrost).',
  },

  // ====== geo_landmarks ======
  {
    id: 'gl_001', skillId: 'geo_landmarks', difficulty: 280, readingLevel: 240,
    prompt: 'Which famous landmark is in Paris, France?',
    sceneSpec: { type: 'landmark', skyTop: '#bdeafd', skyBottom: '#7ec8ff', ground: '#7a9c5b', hills: '#5a7c4b',
      items: [{ emoji: '🗼', x: 0.5, y: 0.55, size: 100 }, { emoji: '🌳', x: 0.15, y: 0.78, size: 36 }, { emoji: '🌳', x: 0.85, y: 0.78, size: 36 }],
      banner: 'Paris' },
    choices: [
      { text: 'The Eiffel Tower', correct: true },
      { text: 'Big Ben', misconception: 'paris_london_confusion' },
      { text: 'The Colosseum', misconception: 'european_landmark_confusion' },
      { text: 'The Pyramids', misconception: 'random_landmark' },
    ],
    explanation: 'The Eiffel Tower was built in 1889 and stands 330 m tall.',
  },
  {
    id: 'gl_002', skillId: 'geo_landmarks', difficulty: 380, readingLevel: 280,
    prompt: 'Where would you find this ancient stone landmark?',
    sceneSpec: { type: 'landmark', skyTop: '#ffd96b', skyBottom: '#ff8a5b', ground: '#e7c887', hills: '#c9a36c',
      items: [{ emoji: '🏛️', x: 0.5, y: 0.55, size: 100 }, { emoji: '🌴', x: 0.15, y: 0.75, size: 50 }],
      banner: 'Landmark' },
    choices: [
      { text: 'Greece (the Parthenon)', correct: true },
      { text: 'Egypt', misconception: 'ancient_means_egypt' },
      { text: 'China', misconception: 'random_country' },
      { text: 'Mexico', misconception: 'random_country' },
    ],
    explanation: 'The Parthenon was built in Athens, Greece about 2,400 years ago.',
  },
  {
    id: 'gl_003', skillId: 'geo_landmarks', difficulty: 500, readingLevel: 340,
    prompt: 'Which country built a 21,000-km-long wall to defend its border?',
    sceneSpec: { type: 'landmark', skyTop: '#a3c8e8', skyBottom: '#e6f0fa', ground: '#7a5538', hills: '#5a3d10',
      items: [{ emoji: '🏯', x: 0.3, y: 0.55, size: 80 }, { emoji: '⛰️', x: 0.7, y: 0.45, size: 90 }],
      banner: 'Great Wall' },
    choices: [
      { text: 'China', correct: true },
      { text: 'Japan', misconception: 'asian_country_swap' },
      { text: 'India', misconception: 'asian_country_swap' },
      { text: 'Mongolia', misconception: 'mongolia_built_wall' },
    ],
    explanation: 'The Great Wall of China was built and rebuilt over 2,000 years to keep enemies out.',
  },

  // ====== hist_ancient ======
  {
    id: 'ha_001', skillId: 'hist_ancient', difficulty: 240, readingLevel: 240,
    prompt: 'In ancient EGYPT, huge stone tombs were built for kings called pharaohs. What are they called?',
    sceneSpec: { type: 'landmark', skyTop: '#ffd96b', skyBottom: '#ff8a5b', ground: '#e7c887', hills: '#c9a36c',
      items: [{ emoji: '🔺', x: 0.3, y: 0.65, size: 90 }, { emoji: '🔺', x: 0.65, y: 0.7, size: 70 }, { emoji: '🐪', x: 0.85, y: 0.85, size: 30 }],
      banner: 'Egypt, ~2500 BCE' },
    choices: [
      { text: 'Pyramids', correct: true },
      { text: 'Castles', misconception: 'modern_word' },
      { text: 'Temples', misconception: 'temple_vs_tomb' },
      { text: 'Ziggurats', misconception: 'mesopotamia_confusion' },
    ],
    explanation: 'The Great Pyramid of Giza was built around 2570 BCE — over 4,500 years ago.',
  },
  {
    id: 'ha_002', skillId: 'hist_ancient', difficulty: 360, readingLevel: 280,
    prompt: 'Which ancient people held huge gladiator games in a giant arena called the Colosseum?',
    sceneSpec: { type: 'landmark', skyTop: '#ffe1a8', skyBottom: '#ff8a5b', ground: '#c9a36c', hills: '#a87a4f',
      items: [{ emoji: '🏛️', x: 0.5, y: 0.55, size: 110 }],
      banner: 'Rome, ~80 CE' },
    choices: [
      { text: 'The Romans', correct: true },
      { text: 'The Egyptians', misconception: 'all_ancient_egyptian' },
      { text: 'The Vikings', misconception: 'random_ancient' },
      { text: 'The Aztecs', misconception: 'random_ancient' },
    ],
    explanation: 'The Roman Colosseum could seat 50,000 spectators. It opened in 80 CE.',
  },
  {
    id: 'ha_003', skillId: 'hist_ancient', difficulty: 480, readingLevel: 340,
    prompt: 'The ancient Greeks invented a new form of government where citizens VOTE. What is it called?',
    sceneSpec: { type: 'landmark', skyTop: '#bdeafd', skyBottom: '#7ec8ff', ground: '#c9a36c', hills: '#a87a4f',
      items: [{ emoji: '🏛️', x: 0.5, y: 0.55, size: 100 }],
      banner: 'Athens, ~500 BCE' },
    choices: [
      { text: 'Democracy', correct: true },
      { text: 'Monarchy', misconception: 'monarchy_vs_democracy' },
      { text: 'Empire', misconception: 'system_vs_size' },
      { text: 'Republic (Roman, not Greek)', misconception: 'roman_vs_greek' },
    ],
    explanation: 'Demos = "people", kratia = "rule". Democracy means "rule by the people".',
  },

  // ====== hist_dinos ======
  {
    id: 'hd_001', skillId: 'hist_dinos', difficulty: 240, readingLevel: 220,
    prompt: 'The huge meat-eating dinosaur with tiny arms and a giant head was called:',
    sceneSpec: { type: 'landmark', skyTop: '#ffd96b', skyBottom: '#ff8a5b', ground: '#7a9c5b', hills: '#5a7c4b',
      items: [{ emoji: '🦖', x: 0.5, y: 0.55, size: 110 }, { emoji: '🌋', x: 0.85, y: 0.55, size: 60 }],
      banner: '~68 million years ago' },
    choices: [
      { text: 'Tyrannosaurus rex', correct: true },
      { text: 'Triceratops', misconception: 'tri_vs_trex' },
      { text: 'Brachiosaurus', misconception: 'plant_eater_confusion' },
      { text: 'Stegosaurus', misconception: 'plant_eater_confusion' },
    ],
    explanation: 'T. rex means "tyrant lizard king". It lived in what is now North America.',
  },
  {
    id: 'hd_002', skillId: 'hist_dinos', difficulty: 360, readingLevel: 260,
    prompt: 'Most scientists believe the dinosaurs went extinct because:',
    sceneSpec: { type: 'landmark', skyTop: '#5a3d10', skyBottom: '#a83e36', ground: '#3a2a10', hills: '#1a1a10',
      items: [{ emoji: '☄️', x: 0.6, y: 0.25, size: 60 }, { emoji: '🌋', x: 0.2, y: 0.65, size: 60 }, { emoji: '🦕', x: 0.8, y: 0.7, size: 40 }],
      banner: '~66 million years ago' },
    choices: [
      { text: 'A giant asteroid hit Earth', correct: true },
      { text: 'They all caught a cold', misconception: 'silly_extinction' },
      { text: 'Humans hunted them', misconception: 'humans_killed_dinos' },
      { text: 'They flew to another planet', misconception: 'silly_extinction' },
    ],
    explanation: 'About 66 million years ago, a 10-km asteroid hit Earth. Most dinosaurs died, but birds (small dinos!) survived.',
  },
  {
    id: 'hd_003', skillId: 'hist_dinos', difficulty: 500, readingLevel: 340,
    prompt: 'Birds are the modern descendants of which group of animals?',
    sceneSpec: { type: 'chain', items: [
      { emoji: '🦖', label: 'Theropod' },
      { emoji: '🪶', label: 'Feathered dino' },
      { emoji: '🦅', label: 'Modern bird' },
    ] },
    choices: [
      { text: 'Dinosaurs', correct: true },
      { text: 'Mammals', misconception: 'mammal_bird_confusion' },
      { text: 'Fish', misconception: 'random_lineage' },
      { text: 'Lizards (other reptiles)', misconception: 'reptile_general' },
    ],
    explanation: 'Birds evolved from small feathered theropod dinosaurs about 150 million years ago.',
  },

  // ====== hist_inventions ======
  {
    id: 'hi_001', skillId: 'hist_inventions', difficulty: 280, readingLevel: 240,
    prompt: 'Who invented the practical electric light bulb in 1879?',
    sceneSpec: { type: 'circuit', closed: true, lit: true },
    choices: [
      { text: 'Thomas Edison', correct: true },
      { text: 'Albert Einstein', misconception: 'einstein_invented_everything' },
      { text: 'Isaac Newton', misconception: 'newton_invented_light' },
      { text: 'Benjamin Franklin', misconception: 'franklin_invented_bulb' },
    ],
    explanation: 'Edison and his team tested over 1,000 materials to find one that would glow without burning.',
  },
  {
    id: 'hi_002', skillId: 'hist_inventions', difficulty: 380, readingLevel: 280,
    prompt: 'The Wright brothers invented what in 1903?',
    sceneSpec: { type: 'landmark', skyTop: '#bdeafd', skyBottom: '#7ec8ff', ground: '#c9a36c', hills: '#a87a4f',
      items: [{ emoji: '✈️', x: 0.5, y: 0.4, size: 80, float: true }],
      banner: '1903 — Kitty Hawk' },
    choices: [
      { text: 'The first powered airplane', correct: true },
      { text: 'The car', misconception: 'car_confusion' },
      { text: 'The hot-air balloon', misconception: 'balloon_was_first' },
      { text: 'The helicopter', misconception: 'rotor_confusion' },
    ],
    explanation: 'Their flight at Kitty Hawk lasted just 12 seconds, but it changed the world.',
  },

  // ====== hist_timelines ======
  {
    id: 'ht_001', skillId: 'hist_timelines', difficulty: 360, readingLevel: 280,
    prompt: 'Which of these came FIRST in history?',
    sceneSpec: { type: 'timeline', events: [
      { year: '~2570 BCE', label: 'Pyramids', emoji: '🔺' },
      { year: '~80 CE', label: 'Colosseum', emoji: '🏛️' },
      { year: '1879', label: 'Light bulb', emoji: '💡' },
    ], highlight: 'Pyramids' },
    choices: [
      { text: 'The Great Pyramid', correct: true },
      { text: 'The Colosseum', misconception: 'roman_first' },
      { text: 'The light bulb', misconception: 'modern_first' },
      { text: 'They were all built at once', misconception: 'no_time_sense' },
    ],
    explanation: 'The Great Pyramid is over 4,500 years old. The Colosseum is about 2,000. The light bulb is only ~150!',
  },
  {
    id: 'ht_002', skillId: 'hist_timelines', difficulty: 480, readingLevel: 340,
    prompt: 'Order from OLDEST to NEWEST: airplane, pyramids, dinosaurs.',
    sceneSpec: { type: 'timeline', events: [
      { year: '~66M BCE', label: 'Dinosaurs', emoji: '🦖' },
      { year: '~2570 BCE', label: 'Pyramids', emoji: '🔺' },
      { year: '1903 CE', label: 'Airplane', emoji: '✈️' },
    ] },
    choices: [
      { text: 'Dinosaurs → Pyramids → Airplane', correct: true },
      { text: 'Pyramids → Dinosaurs → Airplane', misconception: 'pyramid_first' },
      { text: 'Airplane → Pyramids → Dinosaurs', misconception: 'reverse_time' },
      { text: 'They were all at the same time', misconception: 'no_time_sense' },
    ],
    explanation: 'Dinosaurs lived MILLIONS of years before any humans. Humans built the pyramids, then much later the airplane.',
  },

  // ====== lang_vocab ======
  {
    id: 'lv_001', skillId: 'lang_vocab', difficulty: 240, readingLevel: 220,
    prompt: 'What does the word "ENORMOUS" mean?',
    sceneSpec: { type: 'wordtiles', tiles: ['E','N','O','R','M','O','U','S'], hint: 'big… really big', caption: 'Adjective' },
    choices: [
      { text: 'Very, very big', correct: true },
      { text: 'Tiny', misconception: 'opposite_meaning' },
      { text: 'Loud', misconception: 'sense_confusion' },
      { text: 'Friendly', misconception: 'unrelated_meaning' },
    ],
    explanation: 'ENORMOUS means extremely large. A blue whale is enormous.',
  },
  {
    id: 'lv_002', skillId: 'lang_vocab', difficulty: 360, readingLevel: 260,
    prompt: 'A "DECADE" is a period of how many years?',
    sceneSpec: { type: 'wordtiles', tiles: ['D','E','C','A','D','E'], hint: 'time word', caption: 'Noun' },
    choices: [
      { text: '10 years', correct: true },
      { text: '100 years (that\'s a century)', misconception: 'decade_century_confusion' },
      { text: '1 year', misconception: 'decade_year_confusion' },
      { text: '1,000 years (that\'s a millennium)', misconception: 'decade_millennium' },
    ],
    explanation: 'Decade = 10 years. Century = 100 years. Millennium = 1,000 years.',
  },
  {
    id: 'lv_003', skillId: 'lang_vocab', difficulty: 480, readingLevel: 320,
    prompt: 'If something is "ANCIENT", it is:',
    sceneSpec: { type: 'wordtiles', tiles: ['A','N','C','I','E','N','T'], hint: 'time word' },
    choices: [
      { text: 'Very, very old', correct: true },
      { text: 'Brand new', misconception: 'opposite_meaning' },
      { text: 'Quiet', misconception: 'unrelated_meaning' },
      { text: 'Dangerous', misconception: 'unrelated_meaning' },
    ],
    explanation: 'Ancient describes things from thousands of years ago — like ancient Egypt.',
  },
  {
    id: 'lv_004', skillId: 'lang_vocab', difficulty: 540, readingLevel: 360,
    prompt: 'A "FRAGRANT" flower is one that:',
    sceneSpec: { type: 'wordtiles', tiles: ['F','R','A','G','R','A','N','T'], hint: 'one of your senses' },
    choices: [
      { text: 'Smells nice', correct: true },
      { text: 'Looks beautiful', misconception: 'wrong_sense' },
      { text: 'Stings', misconception: 'unrelated_meaning' },
      { text: 'Grows tall', misconception: 'unrelated_meaning' },
    ],
    explanation: 'FRAGRANT is about smell. A fragrant garden is full of sweet scents.',
  },

  // ====== lang_idioms ======
  {
    id: 'li_001', skillId: 'lang_idioms', difficulty: 280, readingLevel: 260,
    prompt: 'When someone says "It\'s RAINING CATS AND DOGS", they mean:',
    sceneSpec: { type: 'idiom', idiom: '"Raining cats and dogs"', literal: { emoji: '🌧️🐱🐶', caption: 'Not really animals!' } },
    choices: [
      { text: 'It\'s raining very heavily', correct: true },
      { text: 'Cats and dogs are falling', misconception: 'literal_interpretation' },
      { text: 'Pets need a bath', misconception: 'unrelated_meaning' },
      { text: 'A cat-dog game is on', misconception: 'unrelated_meaning' },
    ],
    explanation: 'It\'s an IDIOM — a phrase that doesn\'t mean what its words say.',
  },
  {
    id: 'li_002', skillId: 'lang_idioms', difficulty: 380, readingLevel: 300,
    prompt: '"BREAK A LEG!" before a play means:',
    sceneSpec: { type: 'idiom', idiom: '"Break a leg!"', literal: { emoji: '🎭🦵', caption: 'Said before a show.' } },
    choices: [
      { text: 'Good luck!', correct: true },
      { text: 'Be careful, you might fall', misconception: 'literal_interpretation' },
      { text: 'Run faster', misconception: 'unrelated_meaning' },
      { text: 'Go home', misconception: 'unrelated_meaning' },
    ],
    explanation: 'Theatre people say "break a leg" because saying "good luck" is thought to be UNlucky on stage.',
  },
  {
    id: 'li_003', skillId: 'lang_idioms', difficulty: 480, readingLevel: 340,
    prompt: '"SPILL THE BEANS" means:',
    sceneSpec: { type: 'idiom', idiom: '"Spill the beans"', literal: { emoji: '🫘', caption: 'Beans, but not really.' } },
    choices: [
      { text: 'Tell a secret', correct: true },
      { text: 'Knock over the dinner', misconception: 'literal_interpretation' },
      { text: 'Plant a garden', misconception: 'unrelated_meaning' },
      { text: 'Cook beans', misconception: 'unrelated_meaning' },
    ],
    explanation: 'Long ago in ancient Greece, beans were used as voting tokens — spilling the jar revealed the secret count.',
  },

  // ====== lang_grammar ======
  {
    id: 'lg_001', skillId: 'lang_grammar', difficulty: 240, readingLevel: 220,
    prompt: 'In the sentence "The DOG ran fast", which word is the NOUN?',
    sceneSpec: { type: 'wordtiles', tiles: ['T','h','e',' ','d','o','g',' ','r','a','n'], hint: 'noun = person, place, or thing' },
    choices: [
      { text: 'dog', correct: true },
      { text: 'ran', misconception: 'noun_verb_confusion' },
      { text: 'fast', misconception: 'noun_adverb_confusion' },
      { text: 'the', misconception: 'noun_article_confusion' },
    ],
    explanation: 'A NOUN names a person, place, animal, or thing. "Dog" is a thing — so it\'s the noun.',
  },
  {
    id: 'lg_002', skillId: 'lang_grammar', difficulty: 320, readingLevel: 240,
    prompt: 'In "She SINGS beautifully", which word is the VERB?',
    sceneSpec: { type: 'wordtiles', tiles: ['S','h','e',' ','s','i','n','g','s'], hint: 'verb = action' },
    choices: [
      { text: 'sings', correct: true },
      { text: 'she', misconception: 'pronoun_verb_confusion' },
      { text: 'beautifully', misconception: 'adverb_verb_confusion' },
      { text: '"-s" only', misconception: 'suffix_confusion' },
    ],
    explanation: 'A VERB is an action word. "Sings" is what she does — it\'s the verb.',
  },
  {
    id: 'lg_003', skillId: 'lang_grammar', difficulty: 420, readingLevel: 300,
    prompt: 'In "The TINY rabbit hopped", which word is the ADJECTIVE?',
    sceneSpec: { type: 'wordtiles', tiles: ['T','i','n','y',' ','r','a','b','b','i','t'], hint: 'adjective = describes a noun' },
    choices: [
      { text: 'tiny', correct: true },
      { text: 'rabbit', misconception: 'adj_noun_confusion' },
      { text: 'hopped', misconception: 'adj_verb_confusion' },
      { text: 'the', misconception: 'adj_article_confusion' },
    ],
    explanation: 'An ADJECTIVE describes a noun. "Tiny" tells us about the rabbit.',
  },
  {
    id: 'lg_004', skillId: 'lang_grammar', difficulty: 540, readingLevel: 360,
    prompt: 'Pick the sentence with correct grammar:',
    sceneSpec: { type: 'wordtiles', tiles: ['G','R','A','M','M','A','R'], hint: 'subject-verb agreement' },
    choices: [
      { text: 'The dogs run in the park.', correct: true },
      { text: 'The dogs runs in the park.', misconception: 'subject_verb_agreement' },
      { text: 'The dogs running in the park.', misconception: 'incomplete_sentence' },
      { text: 'The dog run in the park.', misconception: 'subject_verb_agreement' },
    ],
    explanation: 'When the subject is plural ("dogs"), the verb drops the -s ("run"). Singular "dog runs", plural "dogs run".',
  },
];

// Quick index by skill
const PROBLEMS_BY_SKILL_CQ = (() => {
  const out = {};
  PROBLEMS_CQ.forEach(p => {
    if (!out[p.skillId]) out[p.skillId] = [];
    out[p.skillId].push(p);
  });
  return out;
})();

const ISLAND_BY_ID_CQ = Object.fromEntries(ISLANDS_CQ.map(i => [i.id, i]));
const QUEST_BY_ID_CQ = Object.fromEntries(QUESTS_CQ.map(q => [q.id, q]));
