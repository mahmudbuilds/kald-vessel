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
    part: 'CAP ASSEMBLY',
    title: 'CNC Knurled Titanium Cap',
    spec: '360° Micro-Pitch Thread · Food-Grade Silicone Seal',
    description:
      'Milled from solid billet alloy with diamond knurling for effortless torque even with wet hands or alpine gloves.',
  },
  {
    index: '02',
    part: 'THERMAL BARRIER',
    title: '0.004 Pa Deep Vacuum Core',
    spec: 'Zero Convection Transfer · 36h Cold / 18h Hot',
    description:
      'Air molecules evacuated at 900°C leaving an impassable thermal void between inner and outer shells.',
  },
  {
    index: '03',
    part: 'RADIATION SHIELD',
    title: '99.9% Pure Copper Foil Wrap',
    spec: 'Infrared Reflection Layer · +22% Thermal Retention',
    description:
      'An internal copper lining wraps the inner vessel, bouncing radiant heat energy back into the liquid core.',
  },
  {
    index: '04',
    part: 'INNER VESSEL',
    title: 'Electropolished 304 Surgical Steel',
    spec: 'Zero Metallic Taste · Non-Reactive Interior',
    description:
      'Mirror-smooth electrochemical polish leaves no microscopic pores for flavors, oils, or odors to cling to.',
  },
];
