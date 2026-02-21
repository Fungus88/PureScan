

function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function validateImageURL(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return url;
  } catch (e) {
    return null;
  }
}

function validateBarcode(barcode) {
  if (!barcode || typeof barcode !== 'string') return false;
  const trimmed = barcode.trim();
  return /^\d{8,13}$/.test(trimmed);
}

function sanitizeIngredientName(name) {
  if (typeof name !== 'string') return 'Unknown';
  const trimmed = name.trim().substring(0, 100);
  return sanitizeHTML(trimmed) || 'Unknown';
}

function sanitizeDescription(desc) {
  if (typeof desc !== 'string') return 'No information available';
  const trimmed = desc.trim().substring(0, 300);
  return sanitizeHTML(trimmed) || 'No information available';
}


const SAFETY_DATA = {
  red: {
    label: 'Harmful',
    ingredients: {
      'tartrazine': 'Synthetic dye linked to hyperactivity and allergic reactions',
      'e102': 'Tartrazine — synthetic yellow dye, potential allergen',
      'sunset yellow': 'Synthetic dye associated with hyperactivity in children',
      'e110': 'Sunset Yellow — synthetic azo dye',
      'amaranth': 'Banned in some countries due to health concerns',
      'e123': 'Amaranth — red azo dye, restricted in several countries',
      'allura red': 'Synthetic dye linked to behavioral issues in children',
      'e129': 'Allura Red — synthetic dye, potential allergen',
      'brilliant blue': 'Synthetic dye with limited safety data',
      'e133': 'Brilliant Blue — synthetic dye',
      'erythrosine': 'Linked to thyroid issues in high doses',
      'e127': 'Erythrosine — may affect thyroid function',
      'patent blue': 'Synthetic dye, potential allergic reactions',
      'e131': 'Patent Blue — synthetic dye',
      'indigo carmine': 'Synthetic dye with potential sensitivity issues',
      'e132': 'Indigo Carmine — synthetic indigoid dye',
      'green s': 'Synthetic dye banned in several countries',
      'e142': 'Green S — synthetic dye, limited safety data',
      'quinoline yellow': 'Synthetic dye linked to hyperactivity',
      'e104': 'Quinoline Yellow — synthetic dye',
      'ponceau 4r': 'Azo dye linked to hyperactivity',
      'e124': 'Ponceau 4R — synthetic red azo dye',
      'carmoisine': 'Azo dye linked to allergic reactions',
      'e122': 'Carmoisine — synthetic red dye',

      // Preservatives
      'sodium nitrite': 'Can form carcinogenic nitrosamines in the body',
      'e250': 'Sodium nitrite — linked to cancer risk',
      'sodium nitrate': 'Can convert to harmful nitrites',
      'e251': 'Sodium nitrate — potential carcinogen precursor',
      'potassium nitrate': 'Can convert to harmful nitrites',
      'e252': 'Potassium nitrate — potential carcinogen precursor',
      'bha': 'Possible carcinogen according to some agencies',
      'e320': 'BHA — butylated hydroxyanisole, possible carcinogen',
      'butylated hydroxyanisole': 'Possible carcinogen, endocrine disruptor',
      'bht': 'Possible carcinogen and endocrine disruptor',
      'e321': 'BHT — butylated hydroxytoluene',
      'butylated hydroxytoluene': 'Linked to organ toxicity in high doses',
      'sodium benzoate': 'Can form benzene when combined with vitamin C',
      'e211': 'Sodium benzoate — potential benzene formation',
      'potassium benzoate': 'Similar concerns to sodium benzoate',
      'e212': 'Potassium benzoate — potential benzene formation',
      'potassium sorbate': 'Generally safe but can cause skin allergies',
      'tbhq': 'Linked to tumors in animal studies at high doses',

      'aspartame': 'Controversial artificial sweetener, classified as possibly carcinogenic by IARC',
      'e951': 'Aspartame — controversial, IARC Group 2B',
      'acesulfame potassium': 'Limited long-term safety data',
      'acesulfame k': 'Limited long-term safety data',
      'e950': 'Acesulfame K — limited long-term data',
      'saccharin': 'Formerly linked to cancer, now considered low-risk',
      'e954': 'Saccharin — historically controversial sweetener',
      'sucralose': 'May affect gut microbiome',
      'e955': 'Sucralose — potential gut microbiome effects',
      'neotame': 'Artificial sweetener with limited independent research',
      'e961': 'Neotame — limited independent research',

      'partially hydrogenated': 'Contains trans fats linked to heart disease',
      'hydrogenated oil': 'May contain trans fats',
      'hydrogenated vegetable oil': 'Source of trans fats, raises LDL cholesterol',
      'trans fat': 'Directly linked to cardiovascular disease',
      'interesterified fat': 'Processed fat with limited safety studies',

      'monosodium glutamate': 'Can cause sensitivity reactions in some people',
      'msg': 'Monosodium glutamate — may cause sensitivity in some',
      'e621': 'MSG — flavor enhancer, sensitivity risk',
      'disodium guanylate': 'Often used with MSG, same concerns',
      'e627': 'Disodium guanylate — MSG-related additive',
      'disodium inosinate': 'Often used with MSG, same concerns',
      'e631': 'Disodium inosinate — MSG-related additive',

      // Other
      'propyl gallate': 'Potential endocrine disruptor',
      'e310': 'Propyl gallate — possible endocrine effects',
      'high fructose corn syrup': 'Linked to obesity, insulin resistance, fatty liver',
      'azodicarbonamide': 'Banned in many countries, potential respiratory irritant',
      'potassium bromate': 'Classified as possibly carcinogenic',
      'brominated vegetable oil': 'Banned in many countries, bioaccumulates',
      'carrageenan': 'May cause gastrointestinal inflammation',
      'e407': 'Carrageenan — potential GI inflammation',
      'titanium dioxide': 'Banned as food additive in EU since 2022',
      'e171': 'Titanium dioxide — banned in EU',
      'sodium aluminium phosphate': 'Aluminium compound, neurotoxicity concern',
      'e541': 'Sodium aluminium phosphate — aluminium exposure risk',
    }
  },

  yellow: {
    label: 'Caution',
    ingredients: {
      'xanthan gum': 'Generally safe; may cause digestive discomfort in large amounts',
      'e415': 'Xanthan gum — may cause bloating',
      'guar gum': 'Generally safe; may cause GI issues in excess',
      'e412': 'Guar gum — possible digestive issues',
      'cellulose gum': 'Used as thickener; not digestible',
      'e466': 'Cellulose gum — non-digestible additive',
      'carboxymethyl cellulose': 'May affect gut microbiome per recent studies',
      'e469': 'Carboxymethyl cellulose — gut microbiome concern',
      'polysorbate 80': 'Emulsifier that may affect gut barrier',
      'e433': 'Polysorbate 80 — potential gut barrier effects',

      'sorbitol': 'Sugar alcohol; can cause digestive issues',
      'e420': 'Sorbitol — laxative effect in excess',
      'maltitol': 'Sugar alcohol; can cause significant GI distress',
      'e965': 'Maltitol — laxative effect',
      'xylitol': 'Sugar alcohol; safe for humans but toxic to dogs',
      'e967': 'Xylitol — GI issues possible, toxic to pets',
      'mannitol': 'Sugar alcohol with laxative effect',
      'e421': 'Mannitol — laxative effect in excess',
      'erythritol': 'Sugar alcohol; associated with cardiovascular concerns in some studies',
      'e968': 'Erythritol — emerging cardiovascular data',
      'isomalt': 'Sugar alcohol; GI discomfort possible',
      'e953': 'Isomalt — digestive issues',
      'stevia': 'Natural sweetener; generally safe but highly processed forms exist',
      'steviol glycosides': 'Processed natural sweetener',
      'e960': 'Steviol glycosides — processed sweetener',

      // Preservatives
      'sorbic acid': 'Generally safe; minor sensitivity in rare cases',
      'e200': 'Sorbic acid — rare sensitivity',
      'sulphur dioxide': 'Can trigger asthma and allergic reactions',
      'sulfur dioxide': 'Can trigger asthma and allergic reactions',
      'e220': 'Sulphur dioxide — asthma trigger',
      'sodium sulphite': 'Can cause allergic reactions, especially in asthmatics',
      'sodium sulfite': 'Can cause allergic reactions, especially in asthmatics',
      'e221': 'Sodium sulphite — potential allergen',
      'sodium metabisulphite': 'Sulphite preservative; asthma trigger',
      'sodium metabisulfite': 'Sulphite preservative; asthma trigger',
      'e223': 'Sodium metabisulphite — asthma risk',
      'nitrous oxide': 'Propellant; safe in normal food use',

      'soy lecithin': 'Common allergen (soy); otherwise safe',
      'e322': 'Lecithin — soy allergen concern',
      'lecithin': 'Usually soy-derived; allergen concern',
      'mono- and diglycerides': 'May contain trans fats from processing',
      'e471': 'Mono- and diglycerides — possible trans fats',
      'polyglycerol esters': 'Emulsifier with limited research',
      'e475': 'Polyglycerol esters — limited data',
      'stearoyl lactylate': 'Generally safe emulsifier',
      'e481': 'Sodium stearoyl lactylate',
      'e482': 'Calcium stearoyl lactylate',
      'diacetyl tartaric acid ester': 'Emulsifier; generally recognized as safe',
      'e472e': 'DATEM — common bread emulsifier',

      'phosphoric acid': 'Can erode tooth enamel and affect calcium absorption',
      'e338': 'Phosphoric acid — bone health concern',
      'sodium phosphate': 'Excessive intake linked to cardiovascular issues',
      'e339': 'Sodium phosphate — cardiovascular concern in excess',
      'calcium phosphate': 'Generally safe; excess may cause issues',
      'e341': 'Calcium phosphate',
      'sodium tripolyphosphate': 'High phosphate load concerns',
      'e451': 'Sodium tripolyphosphate',

      'caramel color': 'Some types (Class III, IV) may contain 4-MEI',
      'e150c': 'Ammonia caramel — may contain 4-MEI',
      'e150d': 'Sulphite ammonia caramel — may contain 4-MEI',
      'annatto': 'Natural color; rare allergic reactions',
      'e160b': 'Annatto — rare allergen',

      // Other
      'palm oil': 'Environmental concern; high in saturated fat',
      'maltodextrin': 'High glycemic index; spikes blood sugar',
      'dextrose': 'Simple sugar; spikes blood sugar',
      'modified starch': 'Chemically modified; generally safe but highly processed',
      'modified food starch': 'Chemically modified; generally safe but processed',
      'corn syrup': 'High in sugars, contributes to blood sugar spikes',
      'glucose syrup': 'High glycemic impact',
      'glucose-fructose syrup': 'High glycemic impact, similar to HFCS',
      'fructose': 'Excessive intake linked to fatty liver',
      'invert sugar': 'Processed sugar; high glycemic',
      'natural flavors': 'Vague labeling; may contain undisclosed allergens',
      'natural flavouring': 'Vague labeling; source often undisclosed',
      'artificial flavor': 'Synthetic compounds; generally safe but poorly transparent',
      'artificial flavoring': 'Synthetic compounds; poorly transparent labeling',
      'silicon dioxide': 'Anti-caking agent; considered safe in food amounts',
      'e551': 'Silicon dioxide — anti-caking agent',
      'sodium caseinate': 'Milk-derived; hidden dairy allergen',
      'whey powder': 'Dairy derivative; allergen for lactose-intolerant',
      'whey protein': 'Dairy derivative; allergen concern',
      'casein': 'Milk protein; common hidden allergen',
    }
  },

  green: {
    label: 'Safe',
    ingredients: {
      'ascorbic acid': 'Vitamin C — essential nutrient and antioxidant',
      'e300': 'Ascorbic acid (Vitamin C)',
      'vitamin c': 'Essential antioxidant vitamin',
      'tocopherol': 'Vitamin E — natural antioxidant',
      'e306': 'Tocopherol (Vitamin E)',
      'vitamin e': 'Fat-soluble antioxidant vitamin',
      'riboflavin': 'Vitamin B2 — essential nutrient',
      'e101': 'Riboflavin (Vitamin B2)',
      'vitamin b2': 'Essential B vitamin',
      'niacin': 'Vitamin B3 — essential nutrient',
      'vitamin b3': 'Essential B vitamin',
      'thiamin': 'Vitamin B1 — essential nutrient',
      'vitamin b1': 'Essential B vitamin',
      'folic acid': 'Vitamin B9 — important for cell growth',
      'vitamin b12': 'Essential vitamin, especially for vegans',
      'vitamin a': 'Essential for vision and immune function',
      'vitamin d': 'Essential for bone health',
      'vitamin k': 'Essential for blood clotting',
      'iron': 'Essential mineral for blood health',
      'calcium': 'Essential mineral for bone health',
      'zinc': 'Essential trace mineral',
      'magnesium': 'Essential mineral',
      'potassium': 'Essential electrolyte',
      'selenium': 'Essential trace mineral',
      'iodine': 'Essential for thyroid function',

      'beta-carotene': 'Natural pigment, precursor to Vitamin A',
      'e160a': 'Beta-carotene — natural colorant',
      'chlorophyll': 'Natural green pigment from plants',
      'e140': 'Chlorophyll — natural plant pigment',
      'beetroot red': 'Natural color from beetroots',
      'e162': 'Betanin — natural beetroot color',
      'curcumin': 'Natural yellow color from turmeric',
      'e100': 'Curcumin — turmeric extract',
      'paprika extract': 'Natural color and flavor',
      'e160c': 'Paprika extract — natural colorant',
      'lycopene': 'Natural red pigment, antioxidant',
      'e160d': 'Lycopene — tomato-derived antioxidant',
      'anthocyanin': 'Natural plant pigment with antioxidant properties',
      'e163': 'Anthocyanin — natural plant pigment',
      'carotene': 'Natural pigment and vitamin A source',
      'cochineal': 'Natural red dye (insect-derived)',
      'e120': 'Cochineal — natural red colorant',

      'citric acid': 'Naturally found in citrus fruits',
      'e330': 'Citric acid — natural fruit acid',
      'lactic acid': 'Naturally produced during fermentation',
      'e270': 'Lactic acid — fermentation product',
      'malic acid': 'Found naturally in apples',
      'e296': 'Malic acid — natural fruit acid',
      'tartaric acid': 'Found naturally in grapes',
      'e334': 'Tartaric acid — natural grape acid',
      'acetic acid': 'Vinegar — natural preservative',
      'e260': 'Acetic acid — vinegar',
      'fumaric acid': 'Naturally occurring organic acid',
      'e297': 'Fumaric acid — natural acid',

      'pectin': 'Natural fiber found in fruits',
      'e440': 'Pectin — natural fruit fiber',
      'agar': 'Natural seaweed-derived gelling agent',
      'e406': 'Agar — natural seaweed gel',
      'locust bean gum': 'Natural thickener from carob seeds',
      'e410': 'Locust bean gum — natural carob thickener',
      'gelatin': 'Natural protein from animal collagen',
      'starch': 'Natural carbohydrate from plants',
      'cornstarch': 'Natural corn-derived thickener',
      'tapioca starch': 'Natural cassava-derived thickener',
      'potato starch': 'Natural potato-derived thickener',
      'rice starch': 'Natural rice-derived thickener',
      'arabic gum': 'Natural tree sap thickener',
      'gum arabic': 'Natural tree sap thickener',
      'e414': 'Gum arabic — natural tree sap',
      'tara gum': 'Natural seed-derived thickener',
      'e417': 'Tara gum — natural thickener',
      'gellan gum': 'Naturally fermented thickener',
      'e418': 'Gellan gum — natural thickener',
      'cellulose': 'Natural plant fiber',
      'e460': 'Cellulose — natural plant fiber',

      'tocopherols': 'Vitamin E — natural antioxidant preservative',
      'e306': 'Mixed tocopherols — Vitamin E',
      'rosemary extract': 'Natural antioxidant preservative',
      'e392': 'Rosemary extract — natural preservative',

      'sodium bicarbonate': 'Baking soda — completely safe',
      'e500': 'Sodium bicarbonate — baking soda',
      'baking soda': 'Common leavening agent',
      'cream of tartar': 'Natural leavening acid',
      'e336': 'Potassium tartrate — cream of tartar',
      'baking powder': 'Common leavening agent',
      'ammonium bicarbonate': 'Traditional leavening agent',
      'e503': 'Ammonium bicarbonate — leavening',

      'water': 'Essential for life',
      'salt': 'Essential mineral (sodium chloride)',
      'sugar': 'Natural sweetener',
      'cane sugar': 'Natural sugar from sugarcane',
      'milk': 'Natural dairy product',
      'whole milk': 'Natural dairy product',
      'skim milk': 'Low-fat dairy product',
      'cream': 'Natural dairy product',
      'butter': 'Natural dairy fat',
      'egg': 'Whole food protein source',
      'eggs': 'Whole food protein source',
      'wheat flour': 'Basic grain product',
      'flour': 'Basic grain product',
      'whole wheat flour': 'Whole grain product',
      'rice flour': 'Gluten-free grain product',
      'oat flour': 'Whole grain product',
      'cocoa': 'Natural cacao product',
      'cocoa butter': 'Natural fat from cacao',
      'cocoa powder': 'Natural cacao product',
      'chocolate': 'Cacao-based product',
      'vanilla': 'Natural flavoring from vanilla beans',
      'vanilla extract': 'Natural flavoring',
      'cinnamon': 'Natural spice',
      'olive oil': 'Healthy monounsaturated fat',
      'sunflower oil': 'Common cooking oil',
      'rapeseed oil': 'Common cooking oil (canola)',
      'canola oil': 'Common cooking oil',
      'coconut oil': 'Natural oil',
      'soybean oil': 'Common vegetable oil',
      'sesame oil': 'Natural nut oil',
      'vinegar': 'Natural fermented product',
      'honey': 'Natural sweetener',
      'molasses': 'Natural sugar byproduct',
      'yeast': 'Natural leavening organism',
      'beeswax': 'Natural coating agent',
      'e901': 'Beeswax — natural coating',
    }
  }
};


const searchSection = document.getElementById('search-section');
const searchForm = document.getElementById('search-form');
const barcodeInput = document.getElementById('barcode-input');
const logoGroup = document.getElementById('logo-group');
const examples = document.getElementById('examples');
const resultsSection = document.getElementById('results-section');
const productHeader = document.getElementById('product-header');
const productName = document.getElementById('product-name');
const productBrand = document.getElementById('product-brand');
const productImage = document.getElementById('product-image');
const productImgWrap = document.getElementById('product-image-wrapper');
const safetySummary = document.getElementById('safety-summary');
const countGreen = document.getElementById('count-green');
const countYellow = document.getElementById('count-yellow');
const countRed = document.getElementById('count-red');
const overallBadge = document.getElementById('overall-badge');
const ingredientsGrid = document.getElementById('ingredients-grid');
const loadingOverlay = document.getElementById('loading-overlay');
const errorToast = document.getElementById('error-toast');
const errorMessage = document.getElementById('error-message');
const newScanWrapper = document.getElementById('new-scan-wrapper');
const newScanBtn = document.getElementById('new-scan-btn');
const ambientGlow = document.getElementById('ambient-glow');

const menuBtn = document.getElementById('menu-btn');
const aboutPanel = document.getElementById('about-panel');
const aboutOverlay = document.getElementById('about-overlay');
const aboutCloseBtn = document.getElementById('about-close-btn');

// Camera elements (mobile only)
const cameraSection = document.getElementById('camera-section');
const cameraContainer = document.getElementById('camera-container');
const scannerViewport = document.getElementById('scanner-viewport');
const cameraStatus = document.getElementById('camera-status');
const cameraStatusText = document.getElementById('camera-status-text');
const startCameraBtn = document.getElementById('start-camera-btn');
const cameraModeBtn = document.getElementById('camera-mode-btn');
const manualModeBtn = document.getElementById('manual-mode-btn');
const lastScannedEl = document.getElementById('last-scanned');
const lastBarcodeEl = document.getElementById('last-barcode');
const successToast = document.getElementById('success-toast');
const successMessage = document.getElementById('success-message');

let isDocked = false;
let aboutOpen = false;
let cameraActive = false;
let lastDetectedBarcode = null;
let detectionCooldown = false;


function classifyIngredient(name) {
  const lower = name.toLowerCase().trim();

  for (const [key, desc] of Object.entries(SAFETY_DATA.red.ingredients)) {
    if (lower.includes(key) || key.includes(lower)) {
      return { level: 'red', label: 'Harmful', description: desc };
    }
  }

  for (const [key, desc] of Object.entries(SAFETY_DATA.yellow.ingredients)) {
    if (lower.includes(key) || key.includes(lower)) {
      return { level: 'yellow', label: 'Caution', description: desc };
    }
  }

  for (const [key, desc] of Object.entries(SAFETY_DATA.green.ingredients)) {
    if (lower.includes(key) || key.includes(lower)) {
      return { level: 'green', label: 'Safe', description: desc };
    }
  }

  return { level: 'green', label: 'Safe', description: 'No known safety concerns' };
}


async function fetchProduct(barcode) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'PureScan/1.0 (https://purescan.app; contact@purescan.app)'
    }
  });

  if (!response.ok) {
    throw new Error('Network error. Please try again.');
  }

  const data = await response.json();

  if (data.status !== 1 || !data.product) {
    throw new Error('Product not found. Check the barcode and try again.');
  }

  return data.product;
}


function parseIngredients(product) {
  const englishText = product.ingredients_text_en || product.ingredients_text_with_allergens_en;

  if (englishText) {
    return englishText
      .split(/,|;/)
      .map(s => s.replace(/\(.*?\)/g, '').replace(/_/g, '').trim())
      .filter(s => s.length > 0 && s.length < 80);
  }

  if (product.ingredients && product.ingredients.length > 0) {
    return product.ingredients.map(i => i.text || i.id?.replace('en:', '') || 'Unknown');
  }

  const text = product.ingredients_text || '';
  if (!text) return [];

  return text
    .split(/,|;/)
    .map(s => s.replace(/\(.*?\)/g, '').trim())
    .filter(s => s.length > 0 && s.length < 80);
}


function renderResults(product) {
  const ingredients = parseIngredients(product);

  if (ingredients.length === 0) {
    showError('No ingredients data available for this product.');
    return;
  }

  const classified = ingredients.map(name => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    ...classifyIngredient(name)
  }));

  const order = { red: 0, yellow: 1, green: 2 };
  classified.sort((a, b) => order[a.level] - order[b.level]);

  const counts = { green: 0, yellow: 0, red: 0 };
  classified.forEach(c => counts[c.level]++);

  countGreen.textContent = counts.green;
  countYellow.textContent = counts.yellow;
  countRed.textContent = counts.red;

  let badgeClass, badgeText;
  if (counts.red > 0) {
    badgeClass = 'badge-red';
    badgeText = 'Concerns Found';
  } else if (counts.yellow > 2) {
    badgeClass = 'badge-yellow';
    badgeText = 'Some Caution';
  } else {
    badgeClass = 'badge-green';
    badgeText = 'Generally Safe';
  }

  overallBadge.className = `px-4 py-1.5 rounded-full text-xs font-medium border ${badgeClass}`;
  overallBadge.textContent = badgeText;

  const overallBadgeMobile = document.getElementById('overall-badge-mobile');
  overallBadgeMobile.className = `mt-2 px-4 py-1.5 rounded-full text-xs font-medium border w-fit hidden ${badgeClass}`;
  overallBadgeMobile.textContent = badgeText;

  const sanitizedProductName = sanitizeHTML(product.product_name || product.product_name_en || '');
  const sanitizedBrand = sanitizeHTML(product.brands || '');

  productName.textContent = sanitizedProductName || 'Unknown Product';
  productBrand.textContent = sanitizedBrand;

  const imageUrl = validateImageURL(product.image_front_small_url || product.image_url);
  if (imageUrl) {
    productImage.src = imageUrl;
    productImgWrap.classList.remove('hidden');
  } else {
    productImgWrap.classList.add('hidden');
  }

  ingredientsGrid.innerHTML = '';

  classified.forEach(item => {
    const card = document.createElement('div');
    card.className = `ingredient-card safety-${item.level}`;

    const header = document.createElement('div');
    header.className = 'flex items-center gap-2.5 mb-2';

    const dot = document.createElement('span');
    dot.className = `safety-dot dot-${item.level}`;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'text-sm font-medium text-white/80 truncate';
    nameSpan.textContent = sanitizeIngredientName(item.name);

    header.appendChild(dot);
    header.appendChild(nameSpan);

    const desc = document.createElement('p');
    desc.className = 'text-xs text-white/30 font-light leading-relaxed';
    desc.textContent = sanitizeDescription(item.description);

    card.appendChild(header);
    card.appendChild(desc);
    ingredientsGrid.appendChild(card);
  });

  resultsSection.classList.remove('hidden');

  animateResultsIn();
}


function animateSearchDock() {
  if (isDocked) return Promise.resolve();
  isDocked = true;

  // Stop camera and show search form for docked state
  stopScanner();
  searchForm.classList.remove('mobile-camera-active');

  return new Promise(resolve => {
    const tl = gsap.timeline({ onComplete: resolve });

    tl.to(logoGroup, {
      marginBottom: '1rem',
      duration: 0.6,
      ease: 'power3.inOut',
    }, 0);

    tl.to('#logo-group h1', {
      fontSize: '1.25rem',
      duration: 0.6,
      ease: 'power3.inOut',
    }, 0);

    tl.to('#logo-group p', {
      opacity: 0,
      height: 0,
      marginTop: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 0);

    tl.to(searchSection, {
      flex: 'none',
      justifyContent: 'flex-start',
      paddingTop: '2rem',
      paddingBottom: '1.5rem',
      duration: 0.6,
      ease: 'power3.inOut',
    }, 0);

    tl.to(searchForm, {
      maxWidth: '28rem',
      duration: 0.6,
      ease: 'power3.inOut',
    }, 0);

    tl.to(examples, {
      opacity: 0,
      height: 0,
      marginTop: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 0);

    tl.set(searchSection, {
      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    });
  });
}

function animateResultsIn() {
  const tl = gsap.timeline();

  tl.to(ambientGlow, { opacity: 1, duration: 1, ease: 'power2.out' }, 0);

  tl.fromTo(productHeader,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    0.1
  );

  tl.fromTo(safetySummary,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    0.25
  );

  const cards = ingredientsGrid.querySelectorAll('.ingredient-card');
  tl.fromTo(cards,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.out',
    },
    0.4
  );

  tl.fromTo(newScanWrapper,
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  );
}

function animateResetToCenter() {
  isDocked = false;

  const tl = gsap.timeline();

  tl.to(resultsSection, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0);
  tl.to(ambientGlow, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0);

  tl.add(() => {
    resultsSection.classList.add('hidden');
    resultsSection.style.opacity = '';
    ingredientsGrid.innerHTML = '';
    productImgWrap.classList.add('hidden');
  });

  tl.to(searchSection, {
    flex: '1',
    justifyContent: 'center',
    paddingTop: '',
    paddingBottom: '',
    borderBottom: 'none',
    duration: 0.6,
    ease: 'power3.inOut',
  });

  tl.to(logoGroup, {
    marginBottom: '3rem',
    duration: 0.6,
    ease: 'power3.inOut',
  }, '<');

  tl.to('#logo-group h1', {
    fontSize: '',
    duration: 0.6,
    ease: 'power3.inOut',
  }, '<');

  tl.to('#logo-group p', {
    opacity: 1,
    height: 'auto',
    duration: 0.4,
    ease: 'power2.out',
  }, '-=0.3');

  tl.to(searchForm, {
    maxWidth: '36rem',
    duration: 0.6,
    ease: 'power3.inOut',
  }, '<');

  tl.to(examples, {
    opacity: 1,
    height: 'auto',
    marginTop: '1rem',
    duration: 0.4,
    ease: 'power2.out',
  }, '-=0.3');

  tl.add(() => {
    barcodeInput.value = '';
    lastDetectedBarcode = null;
    // Restore camera mode on mobile, otherwise focus search input
    if (window.innerWidth <= 640 && cameraSection) {
      switchToCamera();
    } else {
      barcodeInput.focus();
    }
  });
}


function showLoading() {
  loadingOverlay.classList.remove('hidden');
  gsap.fromTo(loadingOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
}

function hideLoading() {
  gsap.to(loadingOverlay, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => loadingOverlay.classList.add('hidden'),
  });
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorToast.classList.remove('pointer-events-none');

  gsap.killTweensOf(errorToast);
  gsap.fromTo(errorToast,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
  );

  gsap.to(errorToast, {
    opacity: 0,
    y: 20,
    delay: 4,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => errorToast.classList.add('pointer-events-none'),
  });
}


function showSuccess(msg) {
  successMessage.textContent = msg;
  successToast.classList.remove('pointer-events-none');

  gsap.killTweensOf(successToast);
  gsap.fromTo(successToast,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
  );

  gsap.to(successToast, {
    opacity: 0,
    y: 20,
    delay: 2,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => successToast.classList.add('pointer-events-none'),
  });
}


// ── Camera Scanner (mobile only) ─────────────────────────────────────

function initScanner() {
  if (typeof Quagga === 'undefined') {
    showError('Barcode scanner library not loaded. Please refresh the page.');
    return;
  }

  Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: scannerViewport,
      constraints: {
        facingMode: 'environment',
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    },
    decoder: {
      readers: [
        'ean_reader',
        'ean_8_reader',
        'upc_reader',
        'upc_e_reader',
        'code_128_reader',
        'code_39_reader'
      ]
    },
    locate: true,
    locator: {
      patchSize: 'medium',
      halfSample: true
    }
  }, function (err) {
    if (err) {
      console.error('Quagga init error:', err);
      cameraStatusText.textContent = 'Camera access denied or unavailable';
      showError('Could not access camera. Please check permissions.');
      return;
    }

    Quagga.start();
    cameraActive = true;
    cameraContainer.classList.add('camera-active');
    cameraStatus.style.display = 'none';
    showSuccess('Camera started. Point at a barcode.');
  });

  Quagga.onDetected(onBarcodeDetected);
}

function stopScanner() {
  if (cameraActive && typeof Quagga !== 'undefined') {
    Quagga.stop();
    cameraActive = false;
    cameraContainer.classList.remove('camera-active');
    cameraStatus.style.display = 'flex';
    cameraStatusText.textContent = 'Tap to start camera';
  }
}

function onBarcodeDetected(result) {
  if (detectionCooldown) return;

  const code = result.codeResult.code;

  if (!validateBarcode(code)) return;
  if (code === lastDetectedBarcode) return;

  lastDetectedBarcode = code;
  detectionCooldown = true;

  // Visual feedback
  cameraContainer.classList.add('detected');
  setTimeout(() => cameraContainer.classList.remove('detected'), 500);

  // Show detected barcode
  lastBarcodeEl.textContent = code;
  lastScannedEl.classList.remove('hidden');

  // Process the barcode
  processCameraBarcode(code);

  // Reset cooldown after 2 seconds
  setTimeout(() => {
    detectionCooldown = false;
  }, 2000);
}

async function processCameraBarcode(barcode) {
  showLoading();

  try {
    await animateSearchDock();
    const product = await fetchProduct(barcode);
    hideLoading();
    renderResults(product);
  } catch (err) {
    hideLoading();
    showError(err.message);
    lastDetectedBarcode = null;
  }
}


// ── Mode Toggle (mobile only) ────────────────────────────────────────

function switchToCamera() {
  cameraModeBtn.classList.add('active');
  manualModeBtn.classList.remove('active');
  cameraContainer.style.display = '';
  searchForm.classList.add('mobile-camera-active');
  lastScannedEl.classList.add('hidden');
}

function switchToManual() {
  manualModeBtn.classList.add('active');
  cameraModeBtn.classList.remove('active');
  cameraContainer.style.display = 'none';
  searchForm.classList.remove('mobile-camera-active');
  stopScanner();
  barcodeInput.focus();
}


function openAboutPanel() {
  if (aboutOpen) return;
  aboutOpen = true;

  menuBtn.classList.add('is-open');
  aboutOverlay.classList.remove('pointer-events-none');

  const tl = gsap.timeline();

  tl.to(aboutOverlay, {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
  }, 0);

  tl.to(aboutPanel, {
    x: 0,
    duration: 0.5,
    ease: 'power3.out',
  }, 0.05);

  tl.fromTo('#about-panel .space-y-6 > div',
    { opacity: 0, x: -15 },
    { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
    0.2
  );
}

function closeAboutPanel() {
  if (!aboutOpen) return;
  aboutOpen = false;

  menuBtn.classList.remove('is-open');

  const tl = gsap.timeline();

  tl.to(aboutPanel, {
    x: '-100%',
    duration: 0.4,
    ease: 'power3.in',
  }, 0);

  tl.to(aboutOverlay, {
    opacity: 0,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: () => aboutOverlay.classList.add('pointer-events-none'),
  }, 0.1);
}

function toggleAboutPanel() {
  aboutOpen ? closeAboutPanel() : openAboutPanel();
}

menuBtn.addEventListener('click', toggleAboutPanel);
aboutCloseBtn.addEventListener('click', closeAboutPanel);
aboutOverlay.addEventListener('click', closeAboutPanel);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aboutOpen) closeAboutPanel();
});


// Camera event listeners
startCameraBtn.addEventListener('click', initScanner);
cameraModeBtn.addEventListener('click', switchToCamera);
manualModeBtn.addEventListener('click', switchToManual);


searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const barcode = barcodeInput.value.trim();
  if (!barcode) return;

  if (!validateBarcode(barcode)) {
    showError('Please enter a valid barcode (8-13 digits).');
    return;
  }

  showLoading();

  try {
    await animateSearchDock();
    const product = await fetchProduct(barcode);
    hideLoading();
    renderResults(product);
  } catch (err) {
    hideLoading();
    showError(err.message);
  }
});

document.querySelectorAll('.example-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    barcodeInput.value = btn.dataset.barcode;
    searchForm.dispatchEvent(new Event('submit'));
  });
});

newScanBtn.addEventListener('click', () => {
  animateResetToCenter();
});

window.addEventListener('DOMContentLoaded', () => {
  gsap.fromTo('#logo-group',
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  );
  gsap.fromTo('#search-form',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' }
  );
  gsap.fromTo('#examples',
    { opacity: 0 },
    { opacity: 1, duration: 0.6, delay: 0.4, ease: 'power2.out' }
  );

  // On mobile, default to camera mode (hide manual search form)
  if (window.innerWidth <= 640 && cameraSection) {
    searchForm.classList.add('mobile-camera-active');
    gsap.fromTo('#camera-container',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' }
    );
    gsap.fromTo('#mode-toggle',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
    );
  } else {
    setTimeout(() => barcodeInput.focus(), 500);
  }
});
