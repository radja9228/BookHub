// Sample book catalog for the BookHub prototype.
// Prices are in Indonesian Rupiah (IDR). Covers use picsum.photos seeded
// URLs so they always load and never break.

export const CATEGORIES = [
  { name: 'Fiction', slug: 'fiction' },
  { name: 'Science Fiction', slug: 'scifi' },
  { name: 'Mystery', slug: 'mystery' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'Biography', slug: 'biography' },
  { name: 'Self-Help', slug: 'selfhelp' },
  { name: 'History', slug: 'history' },
  { name: 'Children', slug: 'children' },
]

const cover = (seed) => `https://picsum.photos/seed/${seed}/400/600`

export const BOOKS = [
  {
    id: 1,
    title: 'The Silent Tide',
    author: 'Maya Hartwell',
    isbn: '978-602-1111-001',
    publisher: 'Archipelago Press',
    category: 'Fiction',
    description: 'A sweeping family saga set across the Indonesian archipelago, following three generations of women bound to the sea. When the youngest returns to her coastal village, she must reckon with the secrets that have shaped her family for decades.',
    price: 145000,
    cover: cover('silenttide'),
    stock: 12,
    featured: true,
    bestseller: true,
  },
  {
    id: 2,
    title: 'Neon Horizons',
    author: 'Daniel Okafor',
    isbn: '978-602-1111-002',
    publisher: 'Futurebound Books',
    category: 'Science Fiction',
    description: 'In a sprawling megacity where memories can be traded like currency, a detective hunts a thief who steals the one thing no one can replace. A neon-soaked thriller about identity, loss, and what it means to remember.',
    price: 168000,
    cover: cover('neonhorizons'),
    stock: 8,
    featured: true,
    bestseller: false,
  },
  {
    id: 3,
    title: 'The Lantern Garden',
    author: 'Priya Suryadinata',
    isbn: '978-602-1111-003',
    publisher: 'Golden Hour Publishing',
    category: 'Romance',
    description: 'Two strangers meet at a lantern festival in a small hill town and spend one night wandering its winding streets. Years later, a single lantern brings them back together in this tender story about second chances.',
    price: 132000,
    cover: cover('lanterngarden'),
    stock: 20,
    featured: false,
    bestseller: true,
  },
  {
    id: 4,
    title: 'Echoes of the Forgotten',
    author: 'Robert Vance',
    isbn: '978-602-1111-004',
    publisher: 'Nightfall Press',
    category: 'Mystery',
    description: 'A retired detective receives a letter from a dead man and is pulled into a cold case that refuses to stay buried. Every answer leads deeper into a town that has spent decades hiding the truth.',
    price: 155000,
    cover: cover('echoesforgotten'),
    stock: 5,
    featured: true,
    bestseller: false,
  },
  {
    id: 5,
    title: 'Crown of Embers',
    author: 'Eleanor Marsh',
    isbn: '978-602-1111-005',
    publisher: 'Starfall Fantasy',
    category: 'Fantasy',
    description: 'A reluctant heir to a broken kingdom must learn to wield a power she never wanted, before rival houses tear her world apart. The first book in an epic fantasy series of fire, loyalty, and rebellion.',
    price: 189000,
    cover: cover('crownembers'),
    stock: 15,
    featured: true,
    bestseller: true,
  },
  {
    id: 6,
    title: 'Beyond the Compass',
    author: 'Captain James Reed',
    isbn: '978-602-1111-006',
    publisher: 'Polaris Books',
    category: 'Biography',
    description: 'The remarkable life of a navigator who sailed every ocean and survived storms no ship should have weathered. A biography of courage, the sea, and a life lived off the edge of the map.',
    price: 175000,
    cover: cover('beyondcompass'),
    stock: 7,
    featured: false,
    bestseller: false,
  },
  {
    id: 7,
    title: 'The Quiet Habit',
    author: 'Dr. Lena Foster',
    isbn: '978-602-1111-007',
    publisher: 'ClearMind Press',
    category: 'Self-Help',
    description: 'Small changes, lasting results. A practical guide to building the habits that quietly shape a better life — one calm, deliberate step at a time. No hype, just what works.',
    price: 98000,
    cover: cover('quiethabit'),
    stock: 30,
    featured: true,
    bestseller: true,
  },
  {
    id: 8,
    title: 'Cities of Salt',
    author: 'Hassan Al-Mansouri',
    isbn: '978-602-1111-008',
    publisher: 'Heritage Press',
    category: 'History',
    description: 'A sweeping history of the desert trading cities that rose on salt and faded into sand. From caravan routes to modern skylines, the story of how a harsh landscape shaped entire civilizations.',
    price: 210000,
    cover: cover('citiesofsalt'),
    stock: 4,
    featured: false,
    bestseller: false,
  },
  {
    id: 9,
    title: 'The Moonlit Fox',
    author: 'Yuki Tanaka',
    isbn: '978-602-1111-009',
    publisher: 'Little Lanterns',
    category: 'Children',
    description: 'When a curious fox sets out to find where the moon goes each morning, she discovers a world of wonder beyond the forest. A beautifully illustrated bedtime adventure for young readers.',
    price: 65000,
    cover: cover('moonlitfox'),
    stock: 25,
    featured: false,
    bestseller: true,
  },
  {
    id: 10,
    title: 'The Last Signal',
    author: 'Daniel Okafor',
    isbn: '978-602-1111-010',
    publisher: 'Futurebound Books',
    category: 'Science Fiction',
    description: 'A deep-space colony loses contact with Earth for thirty years. Then, one night, a single signal arrives — and everything they believed about their isolation begins to unravel.',
    price: 172000,
    cover: cover('lastsignal'),
    stock: 10,
    featured: false,
    bestseller: false,
  },
  {
    id: 11,
    title: 'Whispers in the Gallery',
    author: 'Robert Vance',
    isbn: '978-602-1111-011',
    publisher: 'Nightfall Press',
    category: 'Mystery',
    description: 'A priceless painting vanishes from a locked room during a crowded exhibition. The only witness is a security guard who swears the painting spoke to her the night before it disappeared.',
    price: 149000,
    cover: cover('whispersgallery'),
    stock: 9,
    featured: false,
    bestseller: false,
  },
  {
    id: 12,
    title: 'A Field of Blue',
    author: 'Priya Suryadinata',
    isbn: '978-602-1111-012',
    publisher: 'Golden Hour Publishing',
    category: 'Romance',
    description: 'A florist and a stranger with a fear of flowers keep meeting in the same field at dusk. A gentle, sun-warmed romance about growth, patience, and learning to bloom where you are planted.',
    price: 128000,
    cover: cover('fieldofblue'),
    stock: 18,
    featured: true,
    bestseller: false,
  },
  {
    id: 13,
    title: 'The Cartographer\'s Daughter',
    author: 'Eleanor Marsh',
    isbn: '978-602-1111-013',
    publisher: 'Starfall Fantasy',
    category: 'Fantasy',
    description: 'A map that redraws itself leads a young woman into a hidden kingdom that exists between the lines of every map ever drawn. A standalone fantasy adventure about finding your own path.',
    price: 195000,
    cover: cover('cartographersdaughter'),
    stock: 6,
    featured: false,
    bestseller: true,
  },
  {
    id: 14,
    title: 'Roots and Resistance',
    author: 'Hassan Al-Mansouri',
    isbn: '978-602-1111-014',
    publisher: 'Heritage Press',
    category: 'History',
    description: 'The untold stories of ordinary people who changed the course of nations through quiet, stubborn resistance. A people\'s history that puts the overlooked back at the center of the story.',
    price: 205000,
    cover: cover('rootsresistance'),
    stock: 3,
    featured: false,
    bestseller: false,
  },
  {
    id: 15,
    title: 'The Brave Little Otter',
    author: 'Yuki Tanaka',
    isbn: '978-602-1111-015',
    publisher: 'Little Lanterns',
    category: 'Children',
    description: 'A shy river otter finds the courage to swim past the rapids and discover a whole new world of friends. A heartwarming story about being brave even when your paws are shaking.',
    price: 58000,
    cover: cover('braveotter'),
    stock: 22,
    featured: true,
    bestseller: false,
  },
  {
    id: 16,
    title: 'The Honest Mirror',
    author: 'Dr. Lena Foster',
    isbn: '978-602-1111-016',
    publisher: 'ClearMind Press',
    category: 'Self-Help',
    description: 'A clear-eyed look at self-deception and the small honesties that keep us stuck. A companion to The Quiet Habit for readers ready to face themselves and move forward with kindness.',
    price: 105000,
    cover: cover('honestmirror'),
    stock: 14,
    featured: false,
    bestseller: false,
  },
]

export function getBookById(id) {
  const numId = Number(id)
  return BOOKS.find((b) => b.id === numId) || null
}

export function getBooksByCategory(categoryName) {
  if (!categoryName || categoryName === 'All') return BOOKS
  return BOOKS.filter((b) => b.category === categoryName)
}

export function getRelatedBooks(book, limit = 4) {
  if (!book) return []
  return BOOKS.filter(
    (b) => b.id !== book.id && b.category === book.category
  ).slice(0, limit)
}

export function searchBooks(query) {
  const q = query.trim().toLowerCase()
  if (!q) return BOOKS
  return BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
  )
}

export function getAllCategories() {
  return CATEGORIES
}
