export interface FlaskEdition {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  hex: string;
  metalness: number;
  roughness: number;
  accentHex: string;
  ringHex: string;
  description: string;
  tag: string;
  basePrice: number;
}

export interface FlaskSize {
  id: '500ml' | '750ml' | '1000ml';
  label: string;
  volume: string;
  dimensions: string;
  weight: string;
  priceDelta: number;
}

export const FLASK_EDITIONS: FlaskEdition[] = [
  {
    id: 'obsidian',
    code: 'ED-01',
    name: 'Matte Obsidian',
    subtitle: 'Basalt Ceramic Coat',
    hex: '#16171a',
    metalness: 0.25,
    roughness: 0.62,
    accentHex: '#d4724e',
    ringHex: '#c87d55',
    description:
      'Micro-textured matte ceramic polymer baked over 18/8 surgical steel. Zero glare, tactile stone grip.',
    tag: 'FLAGSHIP',
    basePrice: 68,
  },
  {
    id: 'limestone',
    code: 'ED-02',
    name: 'Raw Limestone',
    subtitle: 'Mineral Chalk Finish',
    hex: '#e4dfd5',
    metalness: 0.12,
    roughness: 0.72,
    accentHex: '#18181b',
    ringHex: '#b9936c',
    description:
      'Warm Nordic chalk tone inspired by coastal travertine. Satin mineral surface resists abrasion.',
    tag: 'STUDIO',
    basePrice: 68,
  },
  {
    id: 'sage',
    code: 'ED-03',
    name: 'Nordic Sage',
    subtitle: 'Anodized Moss Coat',
    hex: '#5f6f61',
    metalness: 0.3,
    roughness: 0.55,
    accentHex: '#e4dfd5',
    ringHex: '#c9a679',
    description:
      'Muted highland lichen anodized finish paired with raw brushed titanium collar accents.',
    tag: 'LIMITED',
    basePrice: 72,
  },
  {
    id: 'copper',
    code: 'ED-04',
    name: 'Brushed Copper',
    subtitle: 'PVD Architectural Alloy',
    hex: '#b56747',
    metalness: 0.88,
    roughness: 0.26,
    accentHex: '#09090b',
    ringHex: '#e2a483',
    description:
      'Vapor-deposited raw copper alloy over brushed steel. Develops an understated architectural patina.',
    tag: 'RESERVE',
    basePrice: 84,
  },
];

export const FLASK_SIZES: FlaskSize[] = [
  {
    id: '500ml',
    label: '500 ML',
    volume: '17 oz · Everyday Carry',
    dimensions: '224 × 70 mm',
    weight: '295 g',
    priceDelta: -8,
  },
  {
    id: '750ml',
    label: '750 ML',
    volume: '25 oz · Signature Vessel',
    dimensions: '268 × 76 mm',
    weight: '365 g',
    priceDelta: 0,
  },
  {
    id: '1000ml',
    label: '1000 ML',
    volume: '34 oz · Alpine Expedition',
    dimensions: '298 × 84 mm',
    weight: '440 g',
    priceDelta: 12,
  },
];

export const ANATOMY_LAYERS = [
  {
    index: '01',
    part: 'THE CAP',
    title: 'Precision-Milled Titanium Cap',
    spec: 'Silicone Gasket · Leakproof Thread',
    description:
      'Machined with fine diamond knurling for an effortless grip, even with wet hands or winter gloves.',
  },
  {
    index: '02',
    part: 'INSULATION',
    title: 'Double-Wall Vacuum Chamber',
    spec: '36h Ice Cold · 18h Piping Hot',
    description:
      'Air is evacuated between the inner and outer walls at high heat, stopping temperature transfer in its tracks.',
  },
  {
    index: '03',
    part: 'COPPER LINING',
    title: 'Pure Copper Heat Shield',
    spec: 'Reflects Radiant Heat · +22% Retention',
    description:
      'A thin wrap of pure copper hugs the inner wall, reflecting thermal energy back into your drink.',
  },
  {
    index: '04',
    part: 'INTERIOR',
    title: 'Electropolished 18/8 Steel',
    spec: 'Pure Taste · Zero Flavor Transfer',
    description:
      'Mirror-smooth surgical-grade steel resists coffee oils and citrus, keeping every pour crisp and clean.',
  },
];
