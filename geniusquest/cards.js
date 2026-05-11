// GeniusQuest — Pokémon card catalog
// 150 entries. Fan-made data; Pokémon names are trademarks of Nintendo.
// Art is original SVG (non-commercial educational use).
// Rarities: common(C) uncommon(U) rare(R) holo(H) legendary(L) master(M)
// Prices: C=10, U=35, R=90, H=200, L=500, M=locked

const RARITY_PRICE = { common:10, uncommon:35, rare:90, holo:200, legendary:500, master:0 };

const POKEMON_CARDS = [
  // Gen-1 starters + evolutions
  {id:'pkm_001',dexNo:1,  name:'Bulbasaur',  type1:'grass',  type2:'poison', rarity:'common',   art:'bulbasaur',  flavor:'A bulb on its back absorbs sunlight.'},
  {id:'pkm_002',dexNo:2,  name:'Ivysaur',    type1:'grass',  type2:'poison', rarity:'uncommon', art:'generic',    flavor:'The bulb on its back grows larger.'},
  {id:'pkm_003',dexNo:3,  name:'Venusaur',   type1:'grass',  type2:'poison', rarity:'rare',     art:'generic',    flavor:'A large flower blooms on its back.'},
  {id:'pkm_004',dexNo:4,  name:'Charmander', type1:'fire',   rarity:'common',   art:'charmander', flavor:'The flame at its tip shows its health.'},
  {id:'pkm_005',dexNo:5,  name:'Charmeleon', type1:'fire',   rarity:'uncommon', art:'generic',    flavor:'Unruly in battle, it breathes intense fire.'},
  {id:'pkm_006',dexNo:6,  name:'Charizard',  type1:'fire',   type2:'flying', rarity:'holo',     art:'generic',    flavor:'Melts glaciers with its scorching breath.'},
  {id:'pkm_007',dexNo:7,  name:'Squirtle',   type1:'water',  rarity:'common',   art:'squirtle',   flavor:'Shoots water from its mouth with precision.'},
  {id:'pkm_008',dexNo:8,  name:'Wartortle',  type1:'water',  rarity:'uncommon', art:'generic',    flavor:'Its long furry tail is a sign of long life.'},
  {id:'pkm_009',dexNo:9,  name:'Blastoise',  type1:'water',  rarity:'rare',     art:'generic',    flavor:'Cannons on its shell fire water blasts.'},
  // Caterpie line
  {id:'pkm_010',dexNo:10, name:'Caterpie',   type1:'bug',    rarity:'common',   art:'generic',    flavor:'Eats its weight in leaves daily.'},
  {id:'pkm_011',dexNo:11, name:'Metapod',    type1:'bug',    rarity:'common',   art:'generic',    flavor:'Hardens its shell — nearly impenetrable.'},
  {id:'pkm_012',dexNo:12, name:'Butterfree', type1:'bug',    type2:'flying', rarity:'uncommon', art:'generic',    flavor:'Scatters toxic dust from its wings.'},
  // Pikachu line
  {id:'pkm_025',dexNo:25, name:'Pikachu',    type1:'electric',rarity:'uncommon',art:'pikachu',    flavor:'Cheeks store up electricity. Charging!'},
  {id:'pkm_026',dexNo:26, name:'Raichu',     type1:'electric',rarity:'rare',    art:'generic',    flavor:'Its long tail acts as a lightning rod.'},
  {id:'pkm_035',dexNo:35, name:'Clefairy',   type1:'fairy',  rarity:'uncommon', art:'generic',    flavor:'Thought to live on the Moon.'},
  {id:'pkm_036',dexNo:36, name:'Clefable',   type1:'fairy',  rarity:'rare',     art:'generic',    flavor:'Can float and move silently.'},
  {id:'pkm_037',dexNo:37, name:'Vulpix',     type1:'fire',   rarity:'common',   art:'generic',    flavor:'Has six beautiful tails that split as it grows.'},
  {id:'pkm_038',dexNo:38, name:'Ninetales',  type1:'fire',   rarity:'rare',     art:'generic',    flavor:'A mystical fox said to live 1,000 years.'},
  {id:'pkm_039',dexNo:39, name:'Jigglypuff', type1:'normal', type2:'fairy', rarity:'common',   art:'generic',    flavor:'Its lullaby puts everyone around it to sleep.'},
  {id:'pkm_040',dexNo:40, name:'Wigglytuff', type1:'normal', type2:'fairy', rarity:'uncommon', art:'generic',    flavor:'Its body is so elastic it never deflates.'},
  {id:'pkm_041',dexNo:41, name:'Zubat',      type1:'poison', type2:'flying', rarity:'common',   art:'generic',    flavor:'Has no eyes — navigates by ultrasound.'},
  {id:'pkm_042',dexNo:42, name:'Golbat',     type1:'poison', type2:'flying', rarity:'uncommon', art:'generic',    flavor:'Can drink a half liter of blood at once.'},
  {id:'pkm_043',dexNo:43, name:'Oddish',     type1:'grass',  type2:'poison', rarity:'common',   art:'generic',    flavor:'Buries itself in soil to absorb nutrients.'},
  {id:'pkm_044',dexNo:44, name:'Gloom',      type1:'grass',  type2:'poison', rarity:'uncommon', art:'generic',    flavor:'The honey it drips smells terrible to most.'},
  {id:'pkm_045',dexNo:45, name:'Vileplume',  type1:'grass',  type2:'poison', rarity:'rare',     art:'generic',    flavor:'Has the world\'s largest flower petals.'},
  {id:'pkm_046',dexNo:46, name:'Paras',      type1:'bug',    type2:'grass',  rarity:'common',   art:'generic',    flavor:'Mushrooms on its back drain its energy.'},
  {id:'pkm_047',dexNo:47, name:'Parasect',   type1:'bug',    type2:'grass',  rarity:'uncommon', art:'generic',    flavor:'Controlled entirely by its giant mushroom.'},
  {id:'pkm_048',dexNo:48, name:'Venonat',    type1:'bug',    type2:'poison', rarity:'common',   art:'generic',    flavor:'Big eyes see in darkness.'},
  {id:'pkm_049',dexNo:49, name:'Venomoth',   type1:'bug',    type2:'poison', rarity:'uncommon', art:'generic',    flavor:'Wing scales cause poisoning when inhaled.'},
  {id:'pkm_050',dexNo:50, name:'Diglett',    type1:'ground', rarity:'common',   art:'generic',    flavor:'Burrows through the earth at great speed.'},
  {id:'pkm_051',dexNo:51, name:'Dugtrio',    type1:'ground', rarity:'uncommon', art:'generic',    flavor:'Three Digletts that share one mind.'},
  {id:'pkm_052',dexNo:52, name:'Meowth',     type1:'normal', rarity:'common',   art:'generic',    flavor:'Loves coins and shiny things.'},
  {id:'pkm_053',dexNo:53, name:'Persian',    type1:'normal', rarity:'uncommon', art:'generic',    flavor:'Elegant, beloved by some aristocrats.'},
  {id:'pkm_054',dexNo:54, name:'Psyduck',    type1:'water',  rarity:'common',   art:'generic',    flavor:'Suffers constant headaches that unlock its power.'},
  {id:'pkm_055',dexNo:55, name:'Golduck',    type1:'water',  rarity:'uncommon', art:'generic',    flavor:'Swims faster than any Olympic swimmer.'},
  {id:'pkm_056',dexNo:56, name:'Mankey',     type1:'fighting',rarity:'common',  art:'generic',    flavor:'Goes berserk at the slightest provocation.'},
  {id:'pkm_057',dexNo:57, name:'Primeape',   type1:'fighting',rarity:'uncommon',art:'generic',    flavor:'Its anger never cools — ever.'},
  {id:'pkm_058',dexNo:58, name:'Growlithe',  type1:'fire',   rarity:'common',   art:'generic',    flavor:'Loyal and obedient — never lets its trainer down.'},
  {id:'pkm_059',dexNo:59, name:'Arcanine',   type1:'fire',   rarity:'rare',     art:'generic',    flavor:'Praised for its noble beauty. Incredibly fast.'},
  {id:'pkm_060',dexNo:60, name:'Poliwag',    type1:'water',  rarity:'common',   art:'generic',    flavor:'The swirl on its belly is visible organs.'},
  {id:'pkm_061',dexNo:61, name:'Poliwhirl',  type1:'water',  rarity:'uncommon', art:'generic',    flavor:'The spiral on its belly hypnotizes foes.'},
  {id:'pkm_062',dexNo:62, name:'Poliwrath',  type1:'water',  type2:'fighting',rarity:'rare',    art:'generic',    flavor:'Swims for days without tiring.'},
  {id:'pkm_063',dexNo:63, name:'Abra',       type1:'psychic',rarity:'common',   art:'generic',    flavor:'Teleports away whenever it senses danger.'},
  {id:'pkm_064',dexNo:64, name:'Kadabra',    type1:'psychic',rarity:'uncommon', art:'generic',    flavor:'Emits alpha brainwaves that cause headaches.'},
  {id:'pkm_065',dexNo:65, name:'Alakazam',   type1:'psychic',rarity:'rare',     art:'generic',    flavor:'IQ surpasses even brilliant scientists.'},
  {id:'pkm_066',dexNo:66, name:'Machop',     type1:'fighting',rarity:'common',  art:'generic',    flavor:'Trains hard every day to grow stronger.'},
  {id:'pkm_067',dexNo:67, name:'Machoke',    type1:'fighting',rarity:'uncommon',art:'generic',    flavor:'Wears a power-save belt to control its might.'},
  {id:'pkm_068',dexNo:68, name:'Machamp',    type1:'fighting',rarity:'rare',    art:'generic',    flavor:'Throws 500 punches per second.'},
  {id:'pkm_069',dexNo:69, name:'Bellsprout', type1:'grass',  type2:'poison', rarity:'common',   art:'generic',    flavor:'Prefers warm, damp places to absorb moisture.'},
  {id:'pkm_070',dexNo:70, name:'Weepinbell', type1:'grass',  type2:'poison', rarity:'uncommon', art:'generic',    flavor:'Hangs from tree branches and waits for prey.'},
  {id:'pkm_071',dexNo:71, name:'Victreebel', type1:'grass',  type2:'poison', rarity:'rare',     art:'generic',    flavor:'A large, carnivorous pitcher plant.'},
  {id:'pkm_072',dexNo:72, name:'Tentacool',  type1:'water',  type2:'poison', rarity:'common',   art:'generic',    flavor:'Mostly water, reflects sunlight dangerously.'},
  {id:'pkm_073',dexNo:73, name:'Tentacruel', type1:'water',  type2:'poison', rarity:'uncommon', art:'generic',    flavor:'Has 80 tentacles. Can spread toxins widely.'},
  {id:'pkm_074',dexNo:74, name:'Geodude',    type1:'rock',   type2:'ground', rarity:'common',   art:'generic',    flavor:'Commonly mistaken for a rock while resting.'},
  {id:'pkm_075',dexNo:75, name:'Graveler',   type1:'rock',   type2:'ground', rarity:'uncommon', art:'generic',    flavor:'Rolls down slopes, crushing everything below.'},
  {id:'pkm_076',dexNo:76, name:'Golem',      type1:'rock',   type2:'ground', rarity:'rare',     art:'generic',    flavor:'Sheds its shell every year.'},
  {id:'pkm_077',dexNo:77, name:'Ponyta',     type1:'fire',   rarity:'common',   art:'generic',    flavor:'Born with weak legs that strengthen quickly.'},
  {id:'pkm_078',dexNo:78, name:'Rapidash',   type1:'fire',   rarity:'uncommon', art:'generic',    flavor:'Gallops at over 240 km/h with a fiery mane.'},
  {id:'pkm_079',dexNo:79, name:'Slowpoke',   type1:'water',  type2:'psychic', rarity:'common',   art:'generic',    flavor:'Takes about 5 seconds to feel pain.'},
  {id:'pkm_080',dexNo:80, name:'Slowbro',    type1:'water',  type2:'psychic', rarity:'uncommon', art:'generic',    flavor:'A Shellder biting its tail changed it forever.'},
  {id:'pkm_081',dexNo:81, name:'Magnemite',  type1:'electric',type2:'steel', rarity:'common',   art:'generic',    flavor:'Floats in the air by emitting electromagnetic waves.'},
  {id:'pkm_082',dexNo:82, name:'Magneton',   type1:'electric',type2:'steel', rarity:'uncommon', art:'generic',    flavor:'Three Magnemites linked by strong magnetism.'},
  {id:'pkm_083',dexNo:83, name:"Farfetch'd", type1:'normal', type2:'flying', rarity:'rare',     art:'generic',    flavor:'Never lets go of its leek — guards it with its life.'},
  {id:'pkm_084',dexNo:84, name:'Doduo',      type1:'normal', type2:'flying', rarity:'common',   art:'generic',    flavor:'Two heads that take turns sleeping.'},
  {id:'pkm_085',dexNo:85, name:'Dodrio',     type1:'normal', type2:'flying', rarity:'uncommon', art:'generic',    flavor:'Three heads represent joy, sorrow, and anger.'},
  {id:'pkm_086',dexNo:86, name:'Seel',       type1:'water',  rarity:'common',   art:'generic',    flavor:'Loves cold, icy seas.'},
  {id:'pkm_087',dexNo:87, name:'Dewgong',    type1:'water',  type2:'ice',    rarity:'uncommon', art:'generic',    flavor:'Can sleep in the coldest water.'},
  {id:'pkm_088',dexNo:88, name:'Grimer',     type1:'poison', rarity:'common',   art:'generic',    flavor:'Born from polluted sludge.'},
  {id:'pkm_089',dexNo:89, name:'Muk',        type1:'poison', rarity:'uncommon', art:'generic',    flavor:'Touching it causes terrible disease.'},
  {id:'pkm_090',dexNo:90, name:'Shellder',   type1:'water',  rarity:'common',   art:'generic',    flavor:'Clamps its shell shut with extreme force.'},
  {id:'pkm_091',dexNo:91, name:'Cloyster',   type1:'water',  type2:'ice',    rarity:'uncommon', art:'generic',    flavor:'Spikes on its shell are incredibly hard.'},
  {id:'pkm_092',dexNo:92, name:'Gastly',     type1:'ghost',  type2:'poison', rarity:'common',   art:'generic',    flavor:'Made of gas so thin it slips through walls.'},
  {id:'pkm_093',dexNo:93, name:'Haunter',    type1:'ghost',  type2:'poison', rarity:'uncommon', art:'generic',    flavor:'Hides in the dark and waits for victims.'},
  {id:'pkm_094',dexNo:94, name:'Gengar',     type1:'ghost',  type2:'poison', rarity:'rare',     art:'gengar',     flavor:'Lurks in the shadows, enjoying mischief.'},
  {id:'pkm_095',dexNo:95, name:'Onix',       type1:'rock',   type2:'ground', rarity:'uncommon', art:'generic',    flavor:'Tunnels through the ground at 80 km/h.'},
  {id:'pkm_096',dexNo:96, name:'Drowzee',    type1:'psychic',rarity:'common',   art:'generic',    flavor:'Puts enemies to sleep and eats their dreams.'},
  {id:'pkm_097',dexNo:97, name:'Hypno',      type1:'psychic',rarity:'uncommon', art:'generic',    flavor:'Uses its pendulum to hypnotize opponents.'},
  {id:'pkm_098',dexNo:98, name:'Krabby',     type1:'water',  rarity:'common',   art:'generic',    flavor:'Claws are so strong it can lift boulders.'},
  {id:'pkm_099',dexNo:99, name:'Kingler',    type1:'water',  rarity:'uncommon', art:'generic',    flavor:'One claw is far larger and stronger.'},
  {id:'pkm_100',dexNo:100,name:'Voltorb',    type1:'electric',rarity:'common',  art:'generic',    flavor:'Looks like a Poké Ball. Highly dangerous.'},
  {id:'pkm_101',dexNo:101,name:'Electrode',  type1:'electric',rarity:'uncommon',art:'generic',    flavor:'Known as the fastest Pokémon in the world.'},
  {id:'pkm_102',dexNo:102,name:'Exeggcute',  type1:'grass',  type2:'psychic', rarity:'common',   art:'generic',    flavor:'Six seeds clustered together — act as one.'},
  {id:'pkm_103',dexNo:103,name:'Exeggutor',  type1:'grass',  type2:'psychic', rarity:'uncommon', art:'generic',    flavor:'Each head thinks independently.'},
  {id:'pkm_104',dexNo:104,name:'Cubone',     type1:'ground', rarity:'common',   art:'generic',    flavor:'Wears the skull of its deceased mother.'},
  {id:'pkm_105',dexNo:105,name:'Marowak',    type1:'ground', rarity:'uncommon', art:'generic',    flavor:'Overcame grief to become a fierce fighter.'},
  {id:'pkm_106',dexNo:106,name:'Hitmonlee',  type1:'fighting',rarity:'uncommon',art:'generic',    flavor:'Its legs extend to twice their length when kicking.'},
  {id:'pkm_107',dexNo:107,name:'Hitmonchan', type1:'fighting',rarity:'uncommon',art:'generic',    flavor:'Said to have the soul of a boxing champion.'},
  {id:'pkm_108',dexNo:108,name:'Lickitung',  type1:'normal', rarity:'uncommon', art:'generic',    flavor:'Its tongue is twice the length of its body.'},
  {id:'pkm_109',dexNo:109,name:'Koffing',    type1:'poison', rarity:'common',   art:'generic',    flavor:'Floats and belches poisonous gas clouds.'},
  {id:'pkm_110',dexNo:110,name:'Weezing',    type1:'poison', rarity:'uncommon', art:'generic',    flavor:'Two heads of toxic gases growing from each other.'},
  {id:'pkm_111',dexNo:111,name:'Rhyhorn',    type1:'ground', type2:'rock',   rarity:'common',   art:'generic',    flavor:'Runs in a straight line — unstoppable.'},
  {id:'pkm_112',dexNo:112,name:'Rhydon',     type1:'ground', type2:'rock',   rarity:'uncommon', art:'generic',    flavor:'Can crush diamonds with its horn.'},
  {id:'pkm_113',dexNo:113,name:'Chansey',    type1:'normal', rarity:'rare',     art:'generic',    flavor:'Carries a lucky egg in its pouch.'},
  {id:'pkm_114',dexNo:114,name:'Tangela',    type1:'grass',  rarity:'uncommon', art:'generic',    flavor:'Completely wrapped in vines.'},
  {id:'pkm_115',dexNo:115,name:'Kangaskhan', type1:'normal', rarity:'rare',     art:'generic',    flavor:'Raises its child in a pouch for three years.'},
  {id:'pkm_116',dexNo:116,name:'Horsea',     type1:'water',  rarity:'common',   art:'generic',    flavor:'Wraps its tail around coral to rest.'},
  {id:'pkm_117',dexNo:117,name:'Seadra',     type1:'water',  rarity:'uncommon', art:'generic',    flavor:'Its spines are hard as steel.'},
  {id:'pkm_118',dexNo:118,name:'Goldeen',    type1:'water',  rarity:'common',   art:'generic',    flavor:'Swims gracefully like a ballet dancer.'},
  {id:'pkm_119',dexNo:119,name:'Seaking',    type1:'water',  rarity:'uncommon', art:'generic',    flavor:'Charges and bores through ice floes.'},
  {id:'pkm_120',dexNo:120,name:'Staryu',     type1:'water',  rarity:'common',   art:'generic',    flavor:'Its core glows red in the dead of night.'},
  {id:'pkm_121',dexNo:121,name:'Starmie',    type1:'water',  type2:'psychic', rarity:'rare',     art:'generic',    flavor:'Its glowing center broadcasts mysterious signals.'},
  {id:'pkm_122',dexNo:122,name:"Mr. Mime",   type1:'psychic',type2:'fairy',  rarity:'uncommon', art:'generic',    flavor:'Mimes so realistically it makes invisible walls.'},
  {id:'pkm_123',dexNo:123,name:'Scyther',    type1:'bug',    type2:'flying', rarity:'rare',     art:'generic',    flavor:'Slices prey cleanly with its scythes.'},
  {id:'pkm_124',dexNo:124,name:'Jynx',       type1:'ice',    type2:'psychic', rarity:'uncommon', art:'generic',    flavor:'Its flowing movements resemble human dance.'},
  {id:'pkm_125',dexNo:125,name:'Electabuzz', type1:'electric',rarity:'uncommon',art:'generic',    flavor:'Appears near power plants that go dark.'},
  {id:'pkm_126',dexNo:126,name:'Magmar',     type1:'fire',   rarity:'uncommon', art:'generic',    flavor:'Expels scorching flames from its mouth.'},
  {id:'pkm_127',dexNo:127,name:'Pinsir',     type1:'bug',    rarity:'rare',     art:'generic',    flavor:'Can snap thick trees with its horns.'},
  {id:'pkm_128',dexNo:128,name:'Tauros',     type1:'normal', rarity:'uncommon', art:'generic',    flavor:'Charges wildly; won\'t stop till it hits something.'},
  {id:'pkm_129',dexNo:129,name:'Magikarp',   type1:'water',  rarity:'common',   art:'magikarp',   flavor:'Virtually useless — but something incredible awaits.'},
  {id:'pkm_130',dexNo:130,name:'Gyarados',   type1:'water',  type2:'flying', rarity:'holo',     art:'gyarados',   flavor:'Once it rampages, nothing can stop it for 40 days.'},
  {id:'pkm_131',dexNo:131,name:'Lapras',     type1:'water',  type2:'ice',    rarity:'rare',     art:'lapras',     flavor:'Carries people across the sea. Very gentle.'},
  {id:'pkm_132',dexNo:132,name:'Ditto',      type1:'normal', rarity:'rare',     art:'generic',    flavor:'Can transform into anything it sees perfectly.'},
  {id:'pkm_133',dexNo:133,name:'Eevee',      type1:'normal', rarity:'uncommon', art:'eevee',      flavor:'Has unstable DNA — can evolve in many ways.'},
  {id:'pkm_134',dexNo:134,name:'Vaporeon',   type1:'water',  rarity:'rare',     art:'generic',    flavor:'Its body can merge with water molecules.'},
  {id:'pkm_135',dexNo:135,name:'Jolteon',    type1:'electric',rarity:'rare',    art:'generic',    flavor:'Concentrates electricity by raising its spines.'},
  {id:'pkm_136',dexNo:136,name:'Flareon',    type1:'fire',   rarity:'rare',     art:'generic',    flavor:'Its internal flame reaches 1,700°C.'},
  {id:'pkm_137',dexNo:137,name:'Porygon',    type1:'normal', rarity:'rare',     art:'generic',    flavor:'The first artificial Pokémon created by humans.'},
  {id:'pkm_138',dexNo:138,name:'Omanyte',    type1:'rock',   type2:'water',  rarity:'uncommon', art:'generic',    flavor:'Revived from an ancient Helix Fossil.'},
  {id:'pkm_139',dexNo:139,name:'Omastar',    type1:'rock',   type2:'water',  rarity:'rare',     art:'generic',    flavor:'Became extinct after its shell grew too heavy.'},
  {id:'pkm_140',dexNo:140,name:'Kabuto',     type1:'rock',   type2:'water',  rarity:'uncommon', art:'generic',    flavor:'Revived from an ancient Dome Fossil.'},
  {id:'pkm_141',dexNo:141,name:'Kabutops',   type1:'rock',   type2:'water',  rarity:'rare',     art:'generic',    flavor:'Hunted prey underwater using its sickle arms.'},
  {id:'pkm_142',dexNo:142,name:'Aerodactyl', type1:'rock',   type2:'flying', rarity:'holo',     art:'generic',    flavor:'A ferocious ancient Pokémon, revived from DNA.'},
  {id:'pkm_143',dexNo:143,name:'Snorlax',    type1:'normal', rarity:'rare',     art:'snorlax',    flavor:'Weighs over 460 kg. Eats 400 kg of food before sleeping.'},
  {id:'pkm_144',dexNo:144,name:'Articuno',   type1:'ice',    type2:'flying', rarity:'legendary',art:'generic',    flavor:'A legendary bird that controls ice.'},
  {id:'pkm_145',dexNo:145,name:'Zapdos',     type1:'electric',type2:'flying',rarity:'legendary',art:'generic',    flavor:'A legendary electric bird that appears in storms.'},
  {id:'pkm_146',dexNo:146,name:'Moltres',    type1:'fire',   type2:'flying', rarity:'legendary',art:'generic',    flavor:'A legendary fire bird that signals the end of winter.'},
  {id:'pkm_147',dexNo:147,name:'Dratini',    type1:'dragon', rarity:'uncommon', art:'generic',    flavor:'Sheds its skin and grows for many years.'},
  {id:'pkm_148',dexNo:148,name:'Dragonair',  type1:'dragon', rarity:'rare',     art:'generic',    flavor:'Said to be able to change weather at will.'},
  {id:'pkm_149',dexNo:149,name:'Dragonite',  type1:'dragon', type2:'flying', rarity:'holo',     art:'generic',    flavor:'Circles the globe in just 16 hours.'},
  {id:'pkm_150',dexNo:150,name:'Mewtwo',     type1:'psychic',rarity:'legendary',art:'mewtwo',    flavor:'Created by science, it is the strongest Pokémon.'},
  {id:'pkm_151',dexNo:151,name:'Mew',        type1:'psychic',rarity:'legendary',art:'mew',       flavor:'Said to contain the genes of every Pokémon.'},
  // Bonus legendaries
  {id:'pkm_249',dexNo:249,name:'Lugia',      type1:'psychic',type2:'flying', rarity:'legendary',art:'lugia',     flavor:'Master of the seas and guardian of the ocean.'},
  // The legendary win card
  {id:'pkm_illustrator',dexNo:0,name:'Pikachu Illustrator',type1:'electric',rarity:'master',art:'pikachu_illustrator',flavor:'The rarest card ever printed. Only awarded to Pokémon Illustration Contest winners. A true legend.'},
];

const PKM_BY_ID = Object.fromEntries(POKEMON_CARDS.map(c => [c.id, c]));

function getPkm(id) { return PKM_BY_ID[id]; }

// Build shop pools by rarity
const PKM_BY_RARITY = {};
POKEMON_CARDS.filter(c => c.rarity !== 'master').forEach(c => {
  if (!PKM_BY_RARITY[c.rarity]) PKM_BY_RARITY[c.rarity] = [];
  PKM_BY_RARITY[c.rarity].push(c);
});

function rollPack() {
  const result = [];
  // 3 common, 1 uncommon, 1 rare/holo/legendary
  function pick(rarity) {
    const pool = PKM_BY_RARITY[rarity];
    if (!pool || !pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  for (let i = 0; i < 3; i++) result.push(pick('common'));
  result.push(pick('uncommon'));
  // bonus slot
  const roll = Math.random();
  if (roll < 0.02)      result.push(pick('legendary'));
  else if (roll < 0.10) result.push(pick('holo'));
  else                  result.push(pick('rare'));
  return result.filter(Boolean);
}

function shopStock() {
  // 6 featured shop cards (weighted)
  const rarities = ['common','common','uncommon','uncommon','rare','holo'];
  return rarities.map(r => {
    const pool = PKM_BY_RARITY[r];
    return pool ? pool[Math.floor(Math.random() * pool.length)] : null;
  }).filter(Boolean);
}
