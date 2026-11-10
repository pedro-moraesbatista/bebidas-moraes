export type CategoryId = 'todos' | 'cervejas' | 'artesanais' | 'combos' | 'sem-alcool'

export type ProductCategory = Exclude<CategoryId, 'todos'>

export type BadgeTone =
  | 'primary'
  | 'primary-container'
  | 'secondary-container'
  | 'tertiary'
  | 'surface-variant'
  | 'tertiary-fixed'

export interface Badge {
  text: string
  tone: BadgeTone
}

export interface Category {
  id: CategoryId
  label: string
}

export interface Product {
  id: string
  name: string
  price: number
  priceFrom?: number
  img: string
  alt: string
  desc: string
  description: string
  category: ProductCategory
  unitLabel: string
  metaLabel?: string
  specs?: { abv: string; ibu: string }
  metaNote?: { text: string; tone: 'tertiary' | 'plain' }
  badge?: Badge
  coldChip?: string
}

export interface Combo extends Product {
  category: 'combos'
  tag: Badge
}

export const badgeToneClasses: Record<BadgeTone, string> = {
  primary: 'bg-primary text-on-primary',
  'primary-container': 'bg-primary-container text-on-primary',
  'secondary-container': 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary text-on-tertiary',
  'surface-variant': 'bg-surface-variant text-on-surface',
  'tertiary-fixed': 'bg-tertiary-fixed text-on-tertiary-fixed',
}

export const categories: Category[] = [
  { id: 'todos', label: 'Todas' },
  { id: 'cervejas', label: 'Cervejas & Latas' },
  { id: 'artesanais', label: 'Artesanais & Growlers' },
  { id: 'combos', label: 'Combos' },
  { id: 'sem-alcool', label: 'Refris & Não Alcoólicos' },
]

export const products: Product[] = [
  {
    id: 'duff-tributo-350',
    name: 'Duff Beer Tributo Lata 350ml',
    price: 11.9,
    img: '/assets/duff-can.jpg',
    alt: 'Duff Beer Tributo Lata 350ml super gelada sobre balcão de taverna',
    desc: 'Lata 350ml • Lager',
    description: 'A lendária lata vermelha de Springfield. Aroma leve de malte, alta refrescância e colarinho denso.',
    category: 'cervejas',
    unitLabel: 'Unidade',
    metaLabel: 'Lager Pilsen • 350ml',
    specs: { abv: '4.8%', ibu: '14' },
    badge: { text: 'TRIBUTO SPRINGFIELD', tone: 'primary' },
    coldChip: '-2°C',
  },
  {
    id: 'duff-lite-355',
    name: 'Duff Lite Springfield 355ml',
    price: 10.9,
    img: '/assets/duff-lite.jpg',
    alt: 'Close up shot of a Duff Lite beer bottle with icy condensation in Springfield Moe Tavern counter pop art cartoon style warm lighting',
    desc: 'Long Neck 355ml • Lite',
    description:
      'Versão extra suave para quem planeja maratonar sem peso na consciência. Ultra leve e carbonatada.',
    category: 'cervejas',
    unitLabel: 'Unidade',
    metaLabel: 'Lite Lager • 355ml',
    specs: { abv: '3.9%', ibu: '10' },
    badge: { text: 'BAIXA CALORIA', tone: 'secondary-container' },
    coldChip: 'TRINCANDO',
  },
  {
    id: 'duff-dry-500',
    name: 'Duff Dry Extra Malte 500ml',
    price: 14.5,
    img: '/assets/duff-dry.jpg',
    alt: 'A tall sleek matte black can of Duff Dry Beer with silver accents on a wooden bar top with ambient tavern neon lights',
    desc: 'Latão 500ml • Dry',
    description:
      'Final seco na boca, corpo pronunciado e notas tostadas sutis. O preferado dos frequentadores fiéis.',
    category: 'cervejas',
    unitLabel: 'Unidade',
    metaLabel: 'Dry Malt • Latão 500ml',
    specs: { abv: '5.4%', ibu: '18' },
    badge: { text: 'EXTRA MALTE', tone: 'surface-variant' },
  },
  {
    id: 'fudd-dark-500',
    name: 'Fudd Beer Dark Ale Taverna',
    price: 16.9,
    img: '/assets/fudd-dark.jpg',
    alt: 'A vintage brown glass craft beer bottle labeled Fudd Beer with creamy foam drips in a dimly lit tavern with rustic wood grain',
    desc: 'Garrafa 500ml • Dark Ale',
    description:
      'A cerveja de Shelbyville que surpreendeu até o Moe. Escura, encorpada com notas de café torrado e toffee.',
    category: 'artesanais',
    unitLabel: 'Unidade',
    metaLabel: 'Dark Ale • 500ml',
    specs: { abv: '6.2%', ibu: '32' },
    badge: { text: 'RIVAL CLÁSSICO', tone: 'primary-container' },
  },
  {
    id: 'growler-ipa-1l',
    name: 'Chopp Dev IPA Growler 1L',
    price: 28,
    img: '/assets/growler-ipa.jpg',
    alt: 'Amber glass Growler filled with fresh craft India Pale Ale with hop cones and dense foam top on Springfield tavern counter',
    desc: 'Growler 1000ml • Fresco',
    description:
      'Envasado contra-pressão minutos antes da entrega. Carga massiva de lúpulos cítricos americanos.',
    category: 'artesanais',
    unitLabel: 'Growler 1000ml',
    metaLabel: 'Growler Pet • 1 Litro',
    specs: { abv: '6.8%', ibu: '58' },
    badge: { text: 'DIRETO DA TORNEIRA', tone: 'tertiary' },
  },
  {
    id: 'flaming-moe-mix',
    name: 'Flaming Moe Cocktail Mix',
    price: 22,
    img: '/assets/flaming-moe.jpg',
    alt: 'A purple glowing mocktail mixer bottle titled Flaming Moe with purple smoke and neon pub glow behind it',
    desc: 'Mixer 500ml • S/ Álcool',
    description:
      'Base xaroposa cítrica e mirtilo para montar o lendário drink. Acompanha instruções do bartender.',
    category: 'sem-alcool',
    unitLabel: 'Garrafa 500ml',
    metaLabel: 'Xarope Mixer • 500ml',
    metaNote: { text: 'SEM ÁLCOOL', tone: 'tertiary' },
    badge: { text: 'RECEITA SECRETA', tone: 'secondary-container' },
  },
  {
    id: 'buzz-cola-350',
    name: 'Buzz Cola Lata Vintage 350ml',
    price: 7.5,
    img: '/assets/buzz-cola.jpg',
    alt: 'A vintage retro pop art soda can of Buzz Cola with red and white geometric patterns and ice cubes around it',
    desc: 'Lata 350ml • Cola',
    description:
      'O clássico refrigerante de cola açucarado e ultra gás para os motoristas da rodada e amantes de nostalgia.',
    category: 'sem-alcool',
    unitLabel: 'Lata 350ml',
    metaLabel: 'Refrigerante • 350ml',
    metaNote: { text: '2x Cafeína', tone: 'plain' },
    badge: { text: 'VINTAGE POP', tone: 'surface-variant' },
  },
  {
    id: 'red-homer-473',
    name: 'Red Homer Energy 473ml',
    price: 12,
    img: '/assets/red-homer.jpg',
    alt: 'A vivid yellow and neon orange energetic drink can with lightning bolts titled Red Homer Energy on tavern counter',
    desc: 'Latão 473ml • Taurina',
    description:
      'Para segurar o plantão ou estender a festa até o amanhecer com dose cavalar de disposição e sabor tropical.',
    category: 'sem-alcool',
    unitLabel: 'Lata 473ml',
    metaLabel: 'Energético • 473ml',
    metaNote: { text: 'Taurina + Ginseng', tone: 'plain' },
    badge: { text: 'BOOST PURA ENERGIA', tone: 'secondary-container' },
  },
]

export const comboDuffCraft: Product = {
  id: 'combo-duff-craft',
  name: 'Combo Duff & Craft Experience',
  price: 79.9,
  priceFrom: 98,
  img: '/assets/combo-crate.jpg',
  alt: 'Combo Duff e Cervejas Artesanais em Caixa de Madeira Springfield',
  desc: 'Crate com 6 latas + aperitivos',
  description:
    'A clássica experiência da Taverna entregue na sua porta: engradado rústico com 6 latas artesanais premium e amendoins selecionados.',
  category: 'combos',
  unitLabel: 'Combo',
  badge: { text: 'DESTAQUE DO MOE', tone: 'primary' },
}

export const combos: Combo[] = [
  {
    id: 'combo-hh',
    name: 'Combo Happy Hour da Taverna',
    price: 59.9,
    img: '/assets/duff-can.jpg',
    alt: 'Combo Happy Hour da Taverna',
    desc: '6 Latas Duff + Amendoim',
    description:
      'Pack com 6 Latas Duff Beer 350ml + 1 Porção Generosa do Amendoim Temperado Especial do Moe.',
    category: 'combos',
    unitLabel: 'Combo',
    tag: { text: 'HAPPY HOUR', tone: 'secondary-container' },
  },
  {
    id: 'combo-churrasco',
    name: 'Combo Churrasco Springfield',
    price: 119,
    img: '/assets/combo-crate.jpg',
    alt: 'Combo Churrasco Springfield',
    desc: '12 Cervejas + Gelo + Carvão',
    description:
      'Fardo com 12 cervejas Duff geladas + Saco de Gelo Filtrado 5kg + 1 Carvão Ecológico 3kg.',
    category: 'combos',
    unitLabel: 'Combo',
    tag: { text: 'CHURRASCO COMPLETO', tone: 'tertiary-fixed' },
  },
]

export const catalogItems: Product[] = [...products, comboDuffCraft, ...combos]
