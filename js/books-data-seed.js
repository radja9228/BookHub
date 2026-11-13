// Data katalog buku contoh untuk prototipe BookHub.
// Harga dalam Rupiah Indonesia (IDR). Sampul menggunakan URL picsum.photos
// berbasis seed agar selalu dimuat dan tidak pernah rusak.

export const CATEGORIES = [
  { name: 'Fiksi', slug: 'fiksi' },
  { name: 'Fiksi Ilmiah', slug: 'fiksi-ilmiah' },
  { name: 'Misteri', slug: 'misteri' },
  { name: 'Romansa', slug: 'romansa' },
  { name: 'Fantasi', slug: 'fantasi' },
  { name: 'Biografi', slug: 'biografi' },
  { name: 'Pengembangan Diri', slug: 'pengembangan-diri' },
  { name: 'Sejarah', slug: 'sejarah' },
  { name: 'Anak', slug: 'anak' },
]

const cover = (seed) => `https://picsum.photos/seed/${seed}/400/600`

export const BOOKS = [
  {
    id: 1,
    title: 'The Silent Tide',
    author: 'Maya Hartwell',
    isbn: '978-602-1111-001',
    publisher: 'Archipelago Press',
    category: 'Fiksi',
    description: 'Saga keluarga yang berlangsung di seluruh kepulauan Indonesia, mengikuti tiga generasi perempuan yang terikat pada laut. Ketika yang termuda kembali ke desa pesisirnya, ia harus berhadapan dengan rahasia yang telah membentuk keluarganya selama puluhan tahun.',
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
    category: 'Fiksi Ilmiah',
    description: 'Di sebuah megakota tempat ingatan bisa diperdagangkan seperti mata uang, seorang detektif memburu pencuri yang mencuri satu hal yang tak bisa digantikan. Sebuah thriller penuh neon tentang identitas, kehilangan, dan arti dari mengingat.',
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
    category: 'Romansa',
    description: 'Dua orang asing bertemu di festival lentera di sebuah kota kecil di pegunungan dan menghabiskan satu malam menjelajahi jalanan berlikunya. Bertahun-tahun kemudian, satu lentera membawa mereka kembali bersatu dalam kisah lembut tentang kesempatan kedua.',
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
    category: 'Misteri',
    description: 'Seorang detektif pensiunan menerima surat dari seorang pria yang sudah meninggal dan terlibat dalam kasus lama yang tak mau terkubur. Setiap jawaban membawanya lebih dalam ke sebuah kota yang telah puluhan tahun menyembunyikan kebenaran.',
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
    category: 'Fantasi',
    description: 'Seorang ahli waris yang enggan terhadap kerajaan yang hancur harus belajar menggunakan kekuatan yang tak pernah ia inginkan, sebelum rumah-rumah saingan mengoyak dunianya. Buku pertama dalam serial fantasi epik tentang api, kesetiaan, dan pemberontakan.',
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
    category: 'Biografi',
    description: 'Kehidupan luar biasa seorang navigator yang berlayar mengarungi setiap samudra dan bertahan dari badai yang seharusnya tak bisa dilewati kapal mana pun. Sebuah biografi tentang keberanian, lautan, dan hidup di luar batas peta.',
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
    category: 'Pengembangan Diri',
    description: 'Perubahan kecil, hasil yang bertahan. Panduan praktis untuk membangun kebiasaan yang secara diam-diam membentuk kehidupan yang lebih baik — satu langkah tenang dan sengaja pada satu waktu. Tanpa janji muluk, hanya apa yang benar-benar berhasil.',
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
    category: 'Sejarah',
    description: 'Sejarah menyeluruh tentang kota-kota dagang gurun yang tumbuh dari garam dan lenyap ditelan pasir. Dari rute karavan hingga cakrawala modern, kisah tentang bagaimana lanskap keras membentuk peradaban-peradaban besar.',
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
    category: 'Anak',
    description: 'Saat rubah yang penasaran mencari tahu ke mana perginya bulan setiap pagi, ia menemukan dunia keajaiban di luar hutan. Petualangan sebelum tidur yang diilustrasikan dengan indah untuk pembaca muda.',
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
    category: 'Fiksi Ilmiah',
    description: 'Sebuah koloni luar angkasa kehilangan kontak dengan Bumi selama tiga puluh tahun. Lalu, suatu malam, satu sinyal tiba — dan semua yang mereka yakini tentang isolasi mereka mulai runtuh.',
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
    category: 'Misteri',
    description: 'Sebuah lukisan tak ternilai hilang dari ruangan terkunci saat pameran ramai. Satu-satunya saksi adalah petugas keamanan yang bersumpah lukisan itu berbicara padanya malam sebelum hilang.',
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
    category: 'Romansa',
    description: 'Seorang penjual bunga dan seorang asing yang takut pada bunga terus bertemu di ladang yang sama saat senja. Romansa yang hangat dan lembut tentang pertumbuhan, kesabaran, dan belajar mekar di tempat kamu ditanam.',
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
    category: 'Fantasi',
    description: 'Peta yang menggambar ulang dirinya sendiri menuntun seorang wanita muda ke kerajaan tersembunyi yang ada di sela-sela garis setiap peta yang pernah digambar. Petualangan fantasi mandiri tentang menemukan jalanmu sendiri.',
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
    category: 'Sejarah',
    description: 'Kisah yang belum diberitakan tentang orang-orang biasa yang mengubah arah bangsa-bangsa melalui perlawanan yang diam dan keras kepala. Sejarah dari rakyat yang menempatkan yang terlupakan kembali ke pusat cerita.',
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
    category: 'Anak',
    description: 'Berang-berang sungai yang pemalu menemukan keberanian untuk berenang melewati arus dan menemukan dunia teman-teman baru. Kisah yang menghangatkan hati tentang keberanian bahkan saat kaki-mu masih gemetar.',
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
    category: 'Pengembangan Diri',
    description: 'Pandangan jujur tentang menipu diri sendiri dan kejujuran-kejujuran kecil yang membuat kita terjebak. Pendamping untuk The Quiet Habit bagi pembaca yang siap menghadapi diri mereka sendiri dan melangkah maju dengan kebaikan.',
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
  if (!categoryName || categoryName === 'Semua') return BOOKS
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
