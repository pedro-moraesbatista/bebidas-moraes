export type ProductCategory = 'cervejas' | 'destilados' | 'refrigerantes' | 'energeticos' | 'aguas'

export type CategoryId = ProductCategory | 'combos'

export interface Category {
  id: CategoryId
  label: string
}

export interface Product {
  id: string
  name: string
  brand: string
  volume: string
  price: number
  priceFrom?: number
  category: ProductCategory
  img: string
  description: string
  featured?: boolean
}

export interface Combo {
  id: string
  name: string
  description: string
  price: number
  priceFrom: number
  items: string[]
  featured?: boolean
}

export interface CartProduct {
  id: string
  name: string
  price: number
  img: string
  volume?: string
}

export const categories: Category[] = [
  { id: 'cervejas', label: 'Cervejas' },
  { id: 'destilados', label: 'Destilados' },
  { id: 'refrigerantes', label: 'Refrigerantes' },
  { id: 'energeticos', label: 'Energéticos' },
  { id: 'aguas', label: 'Águas' },
  { id: 'combos', label: 'Combos' },
]

export const products: Product[] = [
  {
    id: 'brahma-duplo-malte-350',
    name: 'Brahma Duplo Malte',
    brand: 'Brahma',
    volume: 'Lata 350ml',
    price: 3.57,
    priceFrom: 4.19,
    category: 'cervejas',
    img: '/assets/brahma-duplo-malte-350.webp',
    description: 'Puro malte de corpo leve e sabor equilibrado, gelado no ponto para qualquer hora.',
  },
  {
    id: 'skol-pilsen-350',
    name: 'Skol Pilsen',
    brand: 'Skol',
    volume: 'Lata 350ml',
    price: 3.89,
    category: 'cervejas',
    img: '/assets/skol-pilsen-350.webp',
    description: 'A cerveja que desce redondo — refrescância clássica do dia a dia.',
  },
  {
    id: 'antarctica-subzero-350',
    name: 'Antarctica Sub Zero',
    brand: 'Antarctica',
    volume: 'Lata 350ml',
    price: 3.89,
    category: 'cervejas',
    img: '/assets/antarctica-subzero-350.webp',
    description: 'Extra lager de sabor marcante, feita para trincar de gelada.',
  },
  {
    id: 'heineken-330',
    name: 'Heineken',
    brand: 'Heineken',
    volume: 'Long Neck 330ml',
    price: 6.19,
    priceFrom: 7.29,
    category: 'cervejas',
    img: '/assets/heineken-330.webp',
    description: 'Lager premium holandesa com notas de malte equilibradas — clássico mundial.',
    featured: true,
  },
  {
    id: 'amstel-350',
    name: 'Amstel Lager',
    brand: 'Amstel',
    volume: 'Lata 350ml',
    price: 3.59,
    priceFrom: 4.29,
    category: 'cervejas',
    img: '/assets/amstel-350.webp',
    description: 'Lager suave e dourada, ótima companhia para o dia a dia.',
  },
  {
    id: 'stella-artois-350',
    name: 'Stella Artois Puro Malte',
    brand: 'Stella Artois',
    volume: 'Lata 350ml',
    price: 5.09,
    category: 'cervejas',
    img: '/assets/stella-artois-350.webp',
    description: 'Puro malte belga com final seco e aroma delicado.',
  },
  {
    id: 'original-350',
    name: 'Original Pilsen',
    brand: 'Original',
    volume: 'Lata 350ml',
    price: 4.19,
    priceFrom: 4.99,
    category: 'cervejas',
    img: '/assets/original-350.webp',
    description: 'Pilsen brasileira de corpo médio e amargor na medida certa.',
  },
  {
    id: 'budweiser-330',
    name: 'Budweiser American Lager',
    brand: 'Budweiser',
    volume: 'Long Neck 330ml',
    price: 5.09,
    priceFrom: 5.79,
    category: 'cervejas',
    img: '/assets/budweiser-330.webp',
    description: 'American Lager leve e crocante, com final limpo e refrescante.',
  },
  {
    id: 'corona-extra-330',
    name: 'Corona Extra',
    brand: 'Corona',
    volume: 'Long Neck 330ml',
    price: 6.65,
    priceFrom: 7.79,
    category: 'cervejas',
    img: '/assets/corona-extra-330.webp',
    description: 'A mexicana mais famosa do mundo — leve, refrescante e com limão.',
  },
  {
    id: 'spaten-350',
    name: 'Spaten Puro Malte',
    brand: 'Spaten',
    volume: 'Lata 350ml',
    price: 4.15,
    priceFrom: 4.89,
    category: 'cervejas',
    img: '/assets/spaten-350.webp',
    description: 'Puro malte alemão com a tradição de Munique em cada gole.',
  },
  {
    id: 'smirnoff-998',
    name: 'Vodka Smirnoff',
    brand: 'Smirnoff',
    volume: '998ml',
    price: 30.9,
    priceFrom: 48.28,
    category: 'destilados',
    img: '/assets/smirnoff-998.webp',
    description: 'Vodka tripla destilada, suave para caipiroskas e drinks.',
  },
  {
    id: 'absolut-750',
    name: 'Vodka Absolut',
    brand: 'Absolut',
    volume: '750ml',
    price: 119.99,
    category: 'destilados',
    img: '/assets/absolut-750.webp',
    description: 'Vodka sueca premium de pureza reconhecida mundialmente.',
  },
  {
    id: 'johnnie-walker-red-1000',
    name: 'Whisky Johnnie Walker Red Label',
    brand: 'Johnnie Walker',
    volume: '1L',
    price: 84.9,
    priceFrom: 129.62,
    category: 'destilados',
    img: '/assets/johnnie-walker-red-1000.webp',
    description: 'Whisky blended escocês marcante — base perfeita para drinks.',
    featured: true,
  },
  {
    id: 'ballantines-finest-1000',
    name: "Whisky Ballantine's Finest",
    brand: "Ballantine's",
    volume: '1L',
    price: 109.9,
    category: 'destilados',
    img: '/assets/ballantines-finest-1000.webp',
    description: 'Blended suave e equilibrado, com notas de mel e baunilha.',
  },
  {
    id: 'coca-cola-2l',
    name: 'Coca-Cola Original',
    brand: 'Coca-Cola',
    volume: 'Garrafa 2L',
    price: 11.99,
    category: 'refrigerantes',
    img: '/assets/coca-cola-2l.webp',
    description: 'O refrigerante original, na medida certa para dividir.',
  },
  {
    id: 'coca-cola-350',
    name: 'Coca-Cola Original',
    brand: 'Coca-Cola',
    volume: 'Lata 350ml',
    price: 3.99,
    priceFrom: 4.39,
    category: 'refrigerantes',
    img: '/assets/coca-cola-350.webp',
    description: 'Sabor original em lata gelada, refrescância individual.',
  },
  {
    id: 'pepsi-2l',
    name: 'Pepsi',
    brand: 'Pepsi',
    volume: 'Garrafa 2L',
    price: 10.39,
    category: 'refrigerantes',
    img: '/assets/pepsi-2l.webp',
    description: 'Cola com toque cítrico e mais gás para quem gosta.',
  },
  {
    id: 'guarana-antarctica-2l',
    name: 'Guaraná Antarctica',
    brand: 'Antarctica',
    volume: 'Garrafa 2L',
    price: 11.29,
    category: 'refrigerantes',
    img: '/assets/guarana-antarctica-2l.webp',
    description: 'O gosto do Brasil — guaraná autêntico e bem gelado.',
  },
  {
    id: 'fanta-laranja-2l',
    name: 'Fanta Laranja',
    brand: 'Fanta',
    volume: 'Garrafa 2L',
    price: 8.79,
    priceFrom: 10.37,
    category: 'refrigerantes',
    img: '/assets/fanta-laranja-2l.webp',
    description: 'Sabor de laranja intenso que agrada toda a família.',
  },
  {
    id: 'sprite-2l',
    name: 'Sprite',
    brand: 'Sprite',
    volume: 'Garrafa 2L',
    price: 8.79,
    priceFrom: 9.59,
    category: 'refrigerantes',
    img: '/assets/sprite-2l.webp',
    description: 'Limão sem cafeína, transparente e estalando de gás.',
  },
  {
    id: 'red-bull-250',
    name: 'Red Bull Energy Drink',
    brand: 'Red Bull',
    volume: 'Lata 250ml',
    price: 9.99,
    priceFrom: 10.99,
    category: 'energeticos',
    img: '/assets/red-bull-250.webp',
    description: 'O energético que dá asas — energia na medida certa.',
  },
  {
    id: 'monster-473',
    name: 'Monster Energy Green',
    brand: 'Monster',
    volume: 'Lata 473ml',
    price: 8.59,
    priceFrom: 10.09,
    category: 'energeticos',
    img: '/assets/monster-473.webp',
    description: 'O clássico verde em lata grande, dose cheia de energia.',
  },
  {
    id: 'crystal-com-gas-500',
    name: 'Água Mineral Com Gás Crystal',
    brand: 'Crystal',
    volume: 'Garrafa 500ml',
    price: 2.99,
    category: 'aguas',
    img: '/assets/crystal-com-gas-500.webp',
    description: 'Água mineral com gás natural, refrescância leve.',
  },
  {
    id: 'crystal-sem-gas-500',
    name: 'Água Mineral Sem Gás Crystal',
    brand: 'Crystal',
    volume: 'Garrafa 500ml',
    price: 2.79,
    category: 'aguas',
    img: '/assets/crystal-sem-gas-500.webp',
    description: 'Água mineral pura, hidratação para o dia todo.',
  },
]

export const combos: Combo[] = [
  {
    id: 'combo-churrasco',
    name: 'Combo Churrasco',
    description: '6 Brahma Duplo Malte + 6 Skol + Coca-Cola 2L + Guaraná Antarctica 2L',
    price: 59.9,
    priceFrom: 68.04,
    items: ['brahma-duplo-malte-350', 'skol-pilsen-350', 'coca-cola-2l', 'guarana-antarctica-2l'],
    featured: true,
  },
  {
    id: 'combo-fim-de-semana',
    name: 'Combo Fim de Semana',
    description: '6 Heineken + 6 Coca-Cola lata + 2 Monster Green',
    price: 69.9,
    priceFrom: 78.26,
    items: ['heineken-330', 'coca-cola-350', 'monster-473'],
  },
  {
    id: 'combo-cerveja-energetico',
    name: 'Combo Cerveja + Energético',
    description: '6 Skol + 2 Red Bull',
    price: 39.9,
    priceFrom: 43.32,
    items: ['skol-pilsen-350', 'red-bull-250'],
  },
  {
    id: 'combo-confraternizacao',
    name: 'Combo Confraternização',
    description: 'Johnnie Walker Red Label 1L + 4 Coca-Cola lata + Fanta 2L + Sprite 2L',
    price: 109.9,
    priceFrom: 118.44,
    items: ['johnnie-walker-red-1000', 'coca-cola-350', 'fanta-laranja-2l', 'sprite-2l'],
  },
]

const productsById = new Map(products.map((product) => [product.id, product]))

export function productById(id: string): Product | undefined {
  return productsById.get(id)
}

function comboItemImage(combo: Combo): string {
  const image = combo.items
    .map((id) => productsById.get(id))
    .find((product) => product !== undefined)?.img
  if (!image) throw new Error(`combo ${combo.id} referencia apenas produtos inexistentes`)
  return image
}

export const catalogItems: CartProduct[] = [
  ...products,
  ...combos.map((combo) => ({
    id: combo.id,
    name: combo.name,
    price: combo.price,
    img: comboItemImage(combo),
  })),
]
