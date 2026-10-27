import { Product, Collection, Cart } from '@/types/commerce';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://shopify/Product/1001',
    handle: 'aether-x-planar-headphones',
    title: 'Aether-X Planar Acoustic Flagship',
    description:
      'Engineered without compromise. Machined aerospace titanium headband, hand-matched 50mm planar-magnetic drivers, and uncompressed acoustic dispersion chambers. Every component is acoustically tuned for transcendental clarity.',
    availableForSale: true,
    isFlagship3D: true,
    vendor: 'AETHER HOROLOGY & SOUND',
    productType: 'Flagship Audio',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      altText: 'Aether-X Planar Flagship in Titanium finish',
      width: 1200,
      height: 900,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
        altText: 'Aether-X Planar Headphone profile view',
      },
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
        altText: 'Aether-X Driver assembly and isolation',
      },
      {
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80',
        altText: 'Aether-X Acoustic Chamber detail',
      },
    ],
    options: [
      {
        id: 'opt_finish',
        name: 'Finish & Material',
        values: ['Titanium', 'Matte Onyx', 'Satin Silver', 'Champagne Gold'],
      },
      {
        id: 'opt_cable',
        name: 'Cable Interface',
        values: ['4.4mm Balanced Pentaconn', 'Custom Pure Silver XLR', '3.5mm Reference'],
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/2001',
        title: 'Titanium / 4.4mm Balanced Pentaconn',
        availableForSale: true,
        materialPreset: 'titanium',
        selectedOptions: [
          { name: 'Finish & Material', value: 'Titanium' },
          { name: 'Cable Interface', value: '4.4mm Balanced Pentaconn' },
        ],
        price: { amount: '1850.00', currencyCode: 'USD' },
        compareAtPrice: { amount: '2100.00', currencyCode: 'USD' },
        sku: 'AETH-TI-BAL',
      },
      {
        id: 'gid://shopify/ProductVariant/2002',
        title: 'Matte Onyx / 4.4mm Balanced Pentaconn',
        availableForSale: true,
        materialPreset: 'onyx',
        selectedOptions: [
          { name: 'Finish & Material', value: 'Matte Onyx' },
          { name: 'Cable Interface', value: '4.4mm Balanced Pentaconn' },
        ],
        price: { amount: '1950.00', currencyCode: 'USD' },
        sku: 'AETH-OX-BAL',
      },
      {
        id: 'gid://shopify/ProductVariant/2003',
        title: 'Satin Silver / 4.4mm Balanced Pentaconn',
        availableForSale: true,
        materialPreset: 'silver',
        selectedOptions: [
          { name: 'Finish & Material', value: 'Satin Silver' },
          { name: 'Cable Interface', value: '4.4mm Balanced Pentaconn' },
        ],
        price: { amount: '1850.00', currencyCode: 'USD' },
        sku: 'AETH-SV-BAL',
      },
      {
        id: 'gid://shopify/ProductVariant/2004',
        title: 'Champagne Gold / 4.4mm Balanced Pentaconn',
        availableForSale: true,
        materialPreset: 'gold',
        selectedOptions: [
          { name: 'Finish & Material', value: 'Champagne Gold' },
          { name: 'Cable Interface', value: '4.4mm Balanced Pentaconn' },
        ],
        price: { amount: '2400.00', currencyCode: 'USD' },
        compareAtPrice: { amount: '2650.00', currencyCode: 'USD' },
        sku: 'AETH-GD-BAL',
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '1850.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '2400.00', currencyCode: 'USD' },
    },
    tags: ['Flagship', 'Planar', 'Titanium', 'Bespoke', 'Featured'],
    specifications: {
      'Transducer Type': 'Planar Magnetic Ultra-Thin Nanometer Diaphragm',
      'Magnetic Structure': 'Neodymium N52 Dual Flux Symmetrical Array',
      'Frequency Response': '4 Hz – 52,000 Hz',
      'Total Harmonic Distortion': '< 0.02% @ 1kHz, 100dB SPL',
      Impedance: '32 Ohms @ 1kHz',
      Weight: '385 grams (aerospace titanium chassis)',
      Isolation: 'Passive acoustic cavity dampening (-26dB)',
    },
  },
  {
    id: 'gid://shopify/Product/1002',
    handle: 'chronos-tourbillon-horology',
    title: 'Chronos Calibre VIII Tourbillon',
    description:
      'A triumph of micro-mechanical engineering. Tri-axial flying tourbillon, open-worked sapphire crystal plate, and titanium carbide bezel with hand-finished bevels.',
    availableForSale: true,
    isFlagship3D: false,
    vendor: 'AETHER HOROLOGY & SOUND',
    productType: 'Timepiece',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      altText: 'Chronos Calibre VIII Horology piece',
      width: 1200,
      height: 900,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
        altText: 'Chronos Calibre VIII Horology piece dial view',
      },
      {
        url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80',
        altText: 'Chronos Tourbillon movement architecture',
      },
    ],
    options: [
      {
        id: 'opt_case',
        name: 'Case Architecture',
        values: ['Grade 5 Titanium', 'DLC Carbon Black'],
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/2005',
        title: 'Grade 5 Titanium',
        availableForSale: true,
        selectedOptions: [{ name: 'Case Architecture', value: 'Grade 5 Titanium' }],
        price: { amount: '14200.00', currencyCode: 'USD' },
        sku: 'CHRON-G5-TI',
      },
      {
        id: 'gid://shopify/ProductVariant/2006',
        title: 'DLC Carbon Black',
        availableForSale: true,
        selectedOptions: [{ name: 'Case Architecture', value: 'DLC Carbon Black' }],
        price: { amount: '15800.00', currencyCode: 'USD' },
        sku: 'CHRON-DLC-BLK',
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '14200.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '15800.00', currencyCode: 'USD' },
    },
    tags: ['Horology', 'Tourbillon', 'Titanium', 'Mechanical'],
    specifications: {
      Movement: 'In-House Calibre VIII Manual-Wind Tourbillon',
      'Power Reserve': '72 Hours',
      Vibrations: '28,800 vph (4 Hz)',
      'Water Resistance': '50 meters / 5 ATM',
      Crystal: 'Curved Double-AR Sapphire',
    },
  },
  {
    id: 'gid://shopify/Product/1003',
    handle: 'monolith-spatial-speaker',
    title: 'Monolith Spatial Acoustic Obelisk',
    description:
      'Machined from a single 40kg ingot of 6061-T6 aluminum. Integrated Class-D Gan-FET tri-amplifiers driving custom beryllium tweeters and long-throw woofers.',
    availableForSale: true,
    isFlagship3D: false,
    vendor: 'AETHER HOROLOGY & SOUND',
    productType: 'Spatial Audio',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
      altText: 'Monolith Spatial Acoustic Speaker',
      width: 1200,
      height: 900,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
        altText: 'Monolith Spatial Acoustic Speaker main view',
      },
      {
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
        altText: 'Monolith acoustic grilles and bevel',
      },
    ],
    options: [
      {
        id: 'opt_color',
        name: 'Anodized Tone',
        values: ['Raw Aluminum', 'Space Obsidian'],
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/2007',
        title: 'Raw Aluminum',
        availableForSale: true,
        selectedOptions: [{ name: 'Anodized Tone', value: 'Raw Aluminum' }],
        price: { amount: '3600.00', currencyCode: 'USD' },
        sku: 'MONO-RAW-AL',
      },
      {
        id: 'gid://shopify/ProductVariant/2008',
        title: 'Space Obsidian',
        availableForSale: true,
        selectedOptions: [{ name: 'Anodized Tone', value: 'Space Obsidian' }],
        price: { amount: '3850.00', currencyCode: 'USD' },
        sku: 'MONO-OBS-AL',
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '3600.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '3850.00', currencyCode: 'USD' },
    },
    tags: ['Speaker', 'Spatial', 'Aluminum', 'Audiophile'],
    specifications: {
      Amplification: '1200W RMS Gan-FET Tri-Channel',
      Drivers: 'Dual 6.5" Long-Throw Isobaric Woofers + 1.25" Beryllium Tweeter',
      Connectivity: 'Wi-Fi 6E, Roon Ready, AirPlay 2, Optical, Balanced XLR',
      Weight: '28.4 kg',
    },
  },
  {
    id: 'gid://shopify/Product/1004',
    handle: 'aegis-biometric-key',
    title: 'Aegis Biometric Cryptographic Vault',
    description:
      'Ultra-dense cryo-treated titanium security enclosure with capacitive tactile sensors, micro-OLED display, and CC EAL6+ certified secure element.',
    availableForSale: true,
    isFlagship3D: false,
    vendor: 'AETHER HOROLOGY & SOUND',
    productType: 'Security Hardware',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
      altText: 'Aegis Biometric Security Enclosure',
      width: 1200,
      height: 900,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
        altText: 'Aegis Biometric Cryptographic Vault tactile surface',
      },
    ],
    options: [
      {
        id: 'opt_edition',
        name: 'Edition',
        values: ['Founders Titanium', 'Black Ceramic'],
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/2009',
        title: 'Founders Titanium',
        availableForSale: true,
        selectedOptions: [{ name: 'Edition', value: 'Founders Titanium' }],
        price: { amount: '890.00', currencyCode: 'USD' },
        sku: 'AEGIS-FND-TI',
      },
      {
        id: 'gid://shopify/ProductVariant/2010',
        title: 'Black Ceramic',
        availableForSale: false,
        selectedOptions: [{ name: 'Edition', value: 'Black Ceramic' }],
        price: { amount: '950.00', currencyCode: 'USD' },
        sku: 'AEGIS-CER-BLK',
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '890.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '950.00', currencyCode: 'USD' },
    },
    tags: ['Security', 'Hardware', 'Titanium'],
    specifications: {
      'Security Level': 'Common Criteria EAL6+ Certified',
      Biometrics: 'Sub-epidermal Ultrasonic Fingerprint Sensor',
      Interface: 'USB-C / NFC High-Frequency Secure Enclave',
      Enclosure: 'Monolithic Grade 5 Titanium',
    },
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'gid://shopify/Collection/3001',
    handle: 'flagship-audio',
    title: 'Flagship Acoustic Systems',
    description: 'Bespoke transducers and acoustic architectures crafted with surgical precision.',
    products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]],
  },
  {
    id: 'gid://shopify/Collection/3002',
    handle: 'horology-instruments',
    title: 'Horological Masterworks',
    description: 'Complex micro-mechanical complications with flying tourbillons and sapphire geometries.',
    products: [MOCK_PRODUCTS[1]],
  },
  {
    id: 'gid://shopify/Collection/3003',
    handle: 'hardware-vaults',
    title: 'Cryptographic Enclosures',
    description: 'Indestructible titanium security keys guarding digital autonomy.',
    products: [MOCK_PRODUCTS[3]],
  },
];

export const createInitialCart = (): Cart => ({
  id: 'cart_mock_' + Math.random().toString(36).substring(2, 9),
  checkoutUrl: 'https://checkout.shopify.com/mock-checkout',
  cost: {
    subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
    totalAmount: { amount: '0.00', currencyCode: 'USD' },
  },
  totalQuantity: 0,
  lines: [],
});
