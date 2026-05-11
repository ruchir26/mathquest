// GeniusQuest — Shop UI
// Renders the Pokémon Center (buy individual cards + pack)

const SHOP_PACK_PRICE = 30;

function renderShop(profile, onBuyPack, onBuyCard, onClose) {
  const $ = id => document.getElementById(id);
  $('shopCoins').textContent = profile.pokecoin;

  // Pack art
  renderPackArt($('packArt'));

  // Buy pack button
  const buyBtn = $('buyPackBtn');
  buyBtn.onclick = null;
  if (profile.pokecoin >= SHOP_PACK_PRICE || (profile.packs || 0) > 0) {
    buyBtn.disabled = false;
    if ((profile.packs || 0) > 0) {
      buyBtn.textContent = `Open Free Pack (${profile.packs} left)`;
      buyBtn.onclick = () => onBuyPack(true);
    } else {
      buyBtn.textContent = `Open Pack (${SHOP_PACK_PRICE}₽)`;
      buyBtn.onclick = () => onBuyPack(false);
    }
  } else {
    buyBtn.disabled = true;
    buyBtn.textContent = `Need ${SHOP_PACK_PRICE}₽ to open pack`;
  }

  // Featured single cards
  const stock = shopStock();
  const shopCards = $('shopCards');
  shopCards.innerHTML = '';
  for (const card of stock) {
    const price = RARITY_PRICE[card.rarity] || 50;
    const owned = (profile.ownedCards[card.id] || 0) > 0;
    const div = document.createElement('div');
    div.className = 'shop-card-slot' + (owned ? ' owned' : '');
    const artDiv = document.createElement('div');
    artDiv.className = 'shop-card-art';
    renderPokemonArt(artDiv, card, 54);
    const nameDiv = document.createElement('div');
    nameDiv.className = 'shop-card-name';
    nameDiv.textContent = card.name;
    const rarityDiv = document.createElement('div');
    rarityDiv.className = `rarity-badge r-${card.rarity}`;
    rarityDiv.textContent = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);
    const priceBtn = document.createElement('button');
    priceBtn.className = 'btn-buy-card';
    priceBtn.textContent = owned ? '✓ Owned' : `${price}₽`;
    if (!owned && profile.pokecoin >= price) {
      priceBtn.onclick = () => onBuyCard(card, price);
    } else if (!owned) {
      priceBtn.disabled = true;
    } else {
      priceBtn.disabled = true;
    }
    div.appendChild(artDiv);
    div.appendChild(nameDiv);
    div.appendChild(rarityDiv);
    div.appendChild(priceBtn);
    shopCards.appendChild(div);
  }

  $('closeShopBtn').onclick = onClose;
}
