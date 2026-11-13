import { BOOKS, CATEGORIES } from './books-data.js'
import { getCurrentUser, logoutUser } from './common.js'

const icons = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  category: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L3.42 13.41a2 2 0 0 1 0-2.83l7.16-7.16a2 2 0 0 1 1.42-.59H19a2 2 0 0 1 2 2v7a2 2 0 0 1-.41 1.58Z"/><circle cx="16" cy="8" r="1"/></svg>',
  orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2h12l3 5v15H3V7l3-5Z"/><path d="M3 7h18M8 11h8M8 15h5"/></svg>',
  customers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75M22 21v-2a5 5 0 0 0-3-4.58"/></svg>',
  inventory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>',
  reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
}

const customers = [
  { name: 'Alya Putri', email: 'alya.putri@email.com', phone: '+62 812 3445 9001', joined: '12 Okt 2026', orders: 8 },
  { name: 'Bima Santoso', email: 'bima.santoso@email.com', phone: '+62 813 7781 2204', joined: '09 Okt 2026', orders: 5 },
  { name: 'Citra Lestari', email: 'citra.lestari@email.com', phone: '+62 821 5542 1860', joined: '02 Okt 2026', orders: 12 },
  { name: 'Dimas Pratama', email: 'dimas.pratama@email.com', phone: '+62 852 6634 7712', joined: '28 Sep 2026', orders: 3 },
  { name: 'Nadia Rahma', email: 'nadia.rahma@email.com', phone: '+62 856 9021 4388', joined: '25 Sep 2026', orders: 7 },
]

const orders = [
  { id: 'BH-884291', customer: 'Alya Putri', initials: 'AP', date: '14 Okt 2026', total: 357000, status: 'completed' },
  { id: 'BH-884290', customer: 'Bima Santoso', initials: 'BS', date: '14 Okt 2026', total: 189000, status: 'processing' },
  { id: 'BH-884289', customer: 'Citra Lestari', initials: 'CL', date: '13 Okt 2026', total: 423000, status: 'pending' },
  { id: 'BH-884288', customer: 'Dimas Pratama', initials: 'DP', date: '13 Okt 2026', total: 98000, status: 'cancelled' },
  { id: 'BH-884287', customer: 'Nadia Rahma', initials: 'NR', date: '12 Okt 2026', total: 265000, status: 'completed' },
]

const statusLabels = { pending: 'Menunggu', processing: 'Diproses', completed: 'Selesai', cancelled: 'Dibatalkan' }
const rupiah = (value) => 'Rp ' + Number(value).toLocaleString('id-ID')
const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]))

const navItems = [
  ['dashboard', 'Dashboard', 'dashboard'],
  ['books', 'Manajemen Buku', 'books'],
  ['categories', 'Manajemen Kategori', 'category'],
  ['orders', 'Manajemen Pesanan', 'orders'],
  ['customers', 'Manajemen Pelanggan', 'customers'],
  ['inventory', 'Manajemen Inventaris', 'inventory'],
  ['reports', 'Laporan', 'reports'],
]

function shell() {
  return `<div class="admin-shell">
    <aside class="admin-sidebar" id="admin-sidebar">
      <a class="admin-brand" href="#dashboard">
        <span class="admin-brand-mark">BH</span>
        <span><strong>BookHub</strong><small>Admin Portal</small></span>
      </a>
      <nav class="admin-nav">
        <div class="admin-nav-label">Menu Utama</div>
        ${navItems.map(([route, label, icon]) => `<button class="admin-nav-link" data-route="${route}"><span class="admin-nav-icon">${icons[icon]}</span><span>${label}</span></button>`).join('')}
      </nav>
      <div class="admin-sidebar-foot">
        <div class="admin-profile"><span class="admin-avatar">AR</span><div><strong>Admin BookHub</strong><span>admin@bookhub.com</span></div></div>
        <button class="admin-nav-link" id="admin-logout" style="margin-top:8px"><span class="admin-nav-icon">${icons.menu}</span><span>Keluar</span></button>
      </div>
    </aside>
    <div class="admin-overlay" id="admin-overlay"></div>
    <section class="admin-main">
      <header class="admin-topbar">
        <div class="admin-topbar-left"><button class="admin-menu-toggle" id="admin-menu-toggle" aria-label="Buka menu">${icons.menu}</button><div class="admin-topbar-title"><h1 id="admin-top-title">Dashboard</h1><p>Kelola toko buku Anda dengan mudah</p></div></div>
        <div class="admin-topbar-actions"><a class="admin-view-store" href="/" target="_blank">Lihat Toko</a><button class="admin-icon-btn" id="admin-notification" aria-label="Notifikasi">${icons.bell}</button></div>
      </header>
      <main class="admin-content" id="admin-content"></main>
    </section>
  </div>`
}

function pageHeading(title, subtitle, action = '') {
  return `<div class="admin-page-heading"><div><h2>${title}</h2><p>${subtitle}</p></div>${action ? `<div class="admin-heading-actions">${action}</div>` : ''}</div>`
}

function statCard(label, value, trend, icon, color, soft) {
  return `<div class="admin-stat-card" style="--stat-color:${color};--stat-soft:${soft}"><div class="admin-stat-top"><span class="admin-stat-label">${label}</span><span class="admin-stat-icon">${icons[icon]}</span></div><div class="admin-stat-value">${value}</div><div class="admin-stat-trend">${trend}</div></div>`
}

function searchBox(placeholder = 'Cari data...') {
  return `<div class="admin-search">${icons.search}<input type="search" placeholder="${placeholder}" data-table-search /></div>`
}

function actionButtons() {
  return `<div class="admin-actions"><button class="admin-action" data-demo="edit" aria-label="Edit">${icons.edit}</button><button class="admin-action delete" data-demo="delete" aria-label="Hapus">${icons.trash}</button></div>`
}

function dashboardView() {
  return `${pageHeading('Dashboard', 'Ringkasan performa toko BookHub hari ini', '<button class="admin-btn admin-btn-secondary" data-demo="export">Unduh Ringkasan</button>')}
    <div class="admin-stat-grid">
      ${statCard('Total Penjualan', 'Rp 13.000.000', '+12,8% dari bulan lalu', 'reports', '#2563eb', '#dbeafe')}
      ${statCard('Total Buku', '1.240', '+86 buku bulan ini', 'books', '#0ea5a4', '#ccfbf1')}
      ${statCard('Total Pelanggan', '350', '+24 pelanggan baru', 'customers', '#7c3aed', '#ede9fe')}
      ${statCard('Total Pesanan', '150', '+18,2% dari bulan lalu', 'orders', '#f59e0b', '#fef3c7')}
    </div>
    <div class="admin-grid-2">
      <section class="admin-card"><div class="admin-card-head"><h3>Ikhtisar Penjualan</h3><span>7 hari terakhir</span></div><div class="admin-card-body"><div class="admin-chart">${[44, 62, 51, 78, 66, 92, 74].map((height, index) => `<div class="admin-chart-col"><div class="admin-chart-bar" style="height:${height}%"></div><span>${['Sen','Sel','Rab','Kam','Jum','Sab','Min'][index]}</span></div>`).join('')}</div><div class="admin-chart-legend"><i></i>Penjualan harian</div></div></section>
      <section class="admin-card"><div class="admin-card-head"><h3>Pesanan Terbaru</h3><a href="#orders">Lihat semua</a></div><div class="admin-card-body"><div class="admin-order-list">${orders.slice(0, 4).map((order) => `<div class="admin-order-item"><span class="admin-order-avatar">${order.initials}</span><div class="admin-order-info"><strong>${order.id}</strong><span>${order.customer} · ${order.date}</span></div><span class="admin-order-total">${rupiah(order.total)}</span></div>`).join('')}</div></div></section>
    </div>
    <section class="admin-card"><div class="admin-card-head"><h3>Buku Terlaris</h3><a href="#books">Kelola buku</a></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Buku</th><th>Kategori</th><th>Terjual</th><th>Pendapatan</th><th>Status</th></tr></thead><tbody>${BOOKS.slice(0, 5).map((book, index) => `<tr><td><div class="admin-book-cell"><img class="admin-book-cover" src="${book.cover}" alt="${esc(book.title)}"><strong>${esc(book.title)}</strong></div></td><td>${book.category}</td><td>${[128, 112, 96, 88, 74][index]} eksemplar</td><td><strong>${rupiah([18560000, 18816000, 12672000, 13640000, 14022000][index])}</strong></td><td><span class="admin-badge available">Tersedia</span></td></tr>`).join('')}</tbody></table></div></section>`
}

function booksView() {
  return `${pageHeading('Manajemen Buku', 'Kelola katalog, harga, dan ketersediaan buku', `<button class="admin-btn admin-btn-primary" data-demo="add-book">${icons.plus} Tambah Buku</button>`)}
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari judul atau penulis...')}<select class="admin-select" style="max-width:160px" data-category-filter><option>Semua Kategori</option>${CATEGORIES.map((category) => `<option>${category.name}</option>`).join('')}</select></div><div class="admin-table-wrap"><table class="admin-table" data-filter-table><thead><tr><th>Buku</th><th>Penulis</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr></thead><tbody>${BOOKS.map((book) => `<tr data-search-row="${esc(`${book.title} ${book.author} ${book.category}`)}"><td><div class="admin-book-cell"><img class="admin-book-cover" src="${book.cover}" alt="${esc(book.title)}"><strong>${esc(book.title)}</strong></div></td><td>${esc(book.author)}</td><td><span class="admin-badge processing">${book.category}</span></td><td><strong>${rupiah(book.price)}</strong></td><td>${book.stock} eksemplar</td><td>${actionButtons()}</td></tr>`).join('')}</tbody></table></div><div class="admin-table-foot"><span>Menampilkan ${BOOKS.length} dari ${BOOKS.length} buku</span><div class="admin-pagination"><button class="admin-page-btn active">1</button><button class="admin-page-btn">2</button><button class="admin-page-btn">3</button><button class="admin-page-btn">›</button></div></div></section>`
}

function categoriesView() {
  return `${pageHeading('Manajemen Kategori', 'Atur kategori untuk memudahkan pelanggan menemukan buku', `<button class="admin-btn admin-btn-primary" data-demo="add-category">${icons.plus} Tambah Kategori</button>`)}
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari kategori...')}<span style="font-size:11px;color:var(--admin-muted)">${CATEGORIES.length} kategori aktif</span></div><div class="admin-table-wrap"><table class="admin-table" data-filter-table><thead><tr><th>No</th><th>Nama Kategori</th><th>Deskripsi</th><th>Jumlah Buku</th><th>Aksi</th></tr></thead><tbody>${CATEGORIES.map((category, index) => `<tr data-search-row="${esc(category.name)}"><td>${String(index + 1).padStart(2, '0')}</td><td><div class="admin-book-cell"><span class="admin-category-icon">${category.name.slice(0, 2).toUpperCase()}</span><strong>${category.name}</strong></div></td><td class="admin-cell-sub">Koleksi buku ${category.name.toLowerCase()} pilihan BookHub</td><td>${BOOKS.filter((book) => book.category === category.name).length} buku</td><td>${actionButtons()}</td></tr>`).join('')}</tbody></table></div><div class="admin-table-foot"><span>Menampilkan ${CATEGORIES.length} kategori</span><div class="admin-pagination"><button class="admin-page-btn active">1</button><button class="admin-page-btn">2</button><button class="admin-page-btn">›</button></div></div></section>`
}

function ordersView() {
  return `${pageHeading('Manajemen Pesanan', 'Pantau dan proses seluruh pesanan pelanggan', '<button class="admin-btn admin-btn-secondary" data-demo="export">Ekspor Pesanan</button>')}
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari nomor pesanan...')}<select class="admin-select" style="max-width:150px"><option>Semua Status</option><option>Menunggu</option><option>Diproses</option><option>Selesai</option><option>Dibatalkan</option></select></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>No. Pesanan</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${orders.map((order) => `<tr><td><strong>${order.id}</strong></td><td><div class="admin-customer-cell"><span class="admin-customer-avatar">${order.initials}</span><strong>${order.customer}</strong></div></td><td>${order.date}</td><td><strong>${rupiah(order.total)}</strong></td><td><span class="admin-badge ${order.status}">${statusLabels[order.status]}</span></td><td><button class="admin-btn admin-btn-secondary" style="min-height:30px;padding:6px 10px" data-demo="detail">Detail</button></td></tr>`).join('')}</tbody></table></div><div class="admin-table-foot"><span>Menampilkan 1–5 dari 150 pesanan</span><div class="admin-pagination"><button class="admin-page-btn active">1</button><button class="admin-page-btn">2</button><button class="admin-page-btn">3</button><button class="admin-page-btn">…</button><button class="admin-page-btn">›</button></div></div></section>`
}

function customersView() {
  return `${pageHeading('Manajemen Pelanggan', 'Lihat dan kelola informasi pelanggan BookHub', '<button class="admin-btn admin-btn-secondary" data-demo="export">Ekspor Data</button>')}
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari nama atau email...')}<span style="font-size:11px;color:var(--admin-muted)">350 pelanggan terdaftar</span></div><div class="admin-table-wrap"><table class="admin-table" data-filter-table><thead><tr><th>Pelanggan</th><th>Kontak</th><th>Bergabung</th><th>Total Pesanan</th><th>Aksi</th></tr></thead><tbody>${customers.map((customer) => `<tr data-search-row="${esc(`${customer.name} ${customer.email} ${customer.phone}`)}"><td><div class="admin-customer-cell"><span class="admin-customer-avatar">${initials(customer.name)}</span><div><strong>${customer.name}</strong><span class="admin-cell-sub">Pelanggan aktif</span></div></div></td><td><strong>${customer.email}</strong><span class="admin-cell-sub">${customer.phone}</span></td><td>${customer.joined}</td><td><strong>${customer.orders}</strong> pesanan</td><td>${actionButtons()}</td></tr>`).join('')}</tbody></table></div><div class="admin-table-foot"><span>Menampilkan 1–5 dari 350 pelanggan</span><div class="admin-pagination"><button class="admin-page-btn active">1</button><button class="admin-page-btn">2</button><button class="admin-page-btn">3</button><button class="admin-page-btn">…</button><button class="admin-page-btn">›</button></div></div></section>`
}

function inventoryView() {
  const inventory = BOOKS.slice(0, 9).map((book, index) => ({ ...book, stock: [12, 8, 20, 5, 15, 7, 30, 4, 0][index] }))
  return `${pageHeading('Manajemen Inventaris', 'Pantau tingkat stok dan ketersediaan buku', '<button class="admin-btn admin-btn-teal" data-demo="stock">Perbarui Stok</button>')}
    <div class="admin-stat-grid">${statCard('Total SKU', '1.240', 'Semua judul aktif', 'books', '#2563eb', '#dbeafe')}${statCard('Stok Tersedia', '1.080', '87,1% dari total', 'inventory', '#16a34a', '#dcfce7')}${statCard('Stok Menipis', '24', 'Perlu segera diisi', 'inventory', '#f59e0b', '#fef3c7')}${statCard('Stok Habis', '8', 'Tidak tersedia', 'inventory', '#dc2626', '#fee2e2')}</div>
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari judul buku...')}<select class="admin-select" style="max-width:160px"><option>Semua Status</option><option>Tersedia</option><option>Stok Menipis</option><option>Stok Habis</option></select></div><div class="admin-table-wrap"><table class="admin-table" data-filter-table><thead><tr><th>Buku</th><th>Kategori</th><th>Stok Saat Ini</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${inventory.map((book) => { const stockStatus = book.stock === 0 ? 'out' : book.stock <= 5 ? 'low' : 'available'; const label = stockStatus === 'out' ? 'Stok Habis' : stockStatus === 'low' ? 'Stok Menipis' : 'Tersedia'; const percent = Math.min(book.stock / 30 * 100, 100); return `<tr data-search-row="${esc(`${book.title} ${book.category}`)}"><td><div class="admin-book-cell"><img class="admin-book-cover" src="${book.cover}" alt="${esc(book.title)}"><strong>${esc(book.title)}</strong></div></td><td>${book.category}</td><td><div class="admin-stock-cell"><div class="admin-stock-line"><strong>${book.stock}</strong><span style="color:var(--admin-muted);font-size:10px">/ 30</span></div><div class="admin-stock-meter"><span class="${stockStatus}" style="width:${percent}%"></span></div></div></td><td><span class="admin-badge ${stockStatus}">${label}</span></td><td><button class="admin-btn admin-btn-secondary" style="min-height:30px;padding:6px 10px" data-demo="stock">Atur Stok</button></td></tr>` }).join('')}</tbody></table></div><div class="admin-table-foot"><span>Menampilkan 9 dari 1.240 SKU</span><div class="admin-pagination"><button class="admin-page-btn active">1</button><button class="admin-page-btn">2</button><button class="admin-page-btn">3</button><button class="admin-page-btn">›</button></div></div></section>`
}

function reportsView() {
  return `${pageHeading('Laporan', 'Analisis performa penjualan dan pertumbuhan toko', '<button class="admin-btn admin-btn-primary" data-demo="generate">Buat Laporan</button>')}
    <div class="admin-card" style="padding:20px;margin-bottom:20px"><div class="admin-report-filters"><div class="admin-field"><label>Dari Tanggal</label><input class="admin-date" type="date" value="2026-10-01"></div><div class="admin-field"><label>Sampai Tanggal</label><input class="admin-date" type="date" value="2026-10-14"></div><button class="admin-btn admin-btn-primary" data-demo="generate">Tampilkan</button></div></div>
    <div class="admin-stat-grid"><div class="admin-report-stat"><p>Total Penjualan</p><strong>Rp 13.000.000</strong></div><div class="admin-report-stat"><p>Total Pesanan</p><strong>700</strong></div><div class="admin-report-stat"><p>Total Pelanggan</p><strong>300</strong></div><div class="admin-report-stat"><p>Total Buku Terjual</p><strong>400</strong></div></div>
    <div class="admin-grid-2"><section class="admin-card"><div class="admin-card-head"><h3>Penjualan & Pesanan</h3><span>Oktober 2026</span></div><div class="admin-card-body"><div class="admin-bar-chart">${[44, 64, 52, 78, 67, 92, 74].map((height, index) => `<div class="admin-bar-group"><div class="admin-bar-pair"><i class="admin-bar sales" style="height:${height}%"></i><i class="admin-bar orders" style="height:${Math.max(height - 18, 12)}%"></i></div><label>${['08','09','10','11','12','13','14'][index]}</label></div>`).join('')}</div><div class="admin-legend"><span><i style="background:var(--admin-blue)"></i>Penjualan</span><span><i style="background:var(--admin-teal)"></i>Pesanan</span></div></div></section><section class="admin-card"><div class="admin-card-head"><h3>Kategori Terlaris</h3><span>Bulan ini</span></div><div class="admin-card-body"><div class="admin-order-list">${[['Fiksi', 82, '#2563eb'], ['Fantasi', 68, '#0ea5a4'], ['Misteri', 54, '#7c3aed'], ['Romansa', 41, '#f59e0b']].map(([name, value, color]) => `<div class="admin-order-item"><span class="admin-category-icon" style="background:${color}18;color:${color}">${name.slice(0,2).toUpperCase()}</span><div class="admin-order-info"><strong>${name}</strong><span>${value} buku terjual</span></div><span class="admin-order-total">${value}%</span></div>`).join('')}</div></div></section></div>`
}

const views = { dashboard: dashboardView, books: booksView, categories: categoriesView, orders: ordersView, customers: customersView, inventory: inventoryView, reports: reportsView }
const pageTitles = { dashboard: 'Dashboard', books: 'Manajemen Buku', categories: 'Manajemen Kategori', orders: 'Manajemen Pesanan', customers: 'Manajemen Pelanggan', inventory: 'Manajemen Inventaris', reports: 'Laporan' }

function showToast(message) {
  const old = document.querySelector('.admin-toast')
  if (old) old.remove()
  const toast = document.createElement('div')
  toast.className = 'admin-toast'
  toast.textContent = message
  document.body.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('show'))
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 200) }, 2800)
}

function bindView() {
  const content = document.getElementById('admin-content')
  content.querySelectorAll('[data-table-search]').forEach((input) => {
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim()
      content.querySelectorAll('[data-search-row]').forEach((row) => { row.style.display = row.dataset.searchRow.toLowerCase().includes(query) ? '' : 'none' })
    })
  })
  content.querySelectorAll('[data-demo]').forEach((button) => {
    button.addEventListener('click', () => {
      const messages = { 'add-book': 'Form tambah buku siap digunakan pada tahap berikutnya.', 'add-category': 'Form tambah kategori siap digunakan pada tahap berikutnya.', export: 'Data berhasil disiapkan untuk diekspor.', generate: 'Laporan berhasil dibuat untuk periode yang dipilih.', stock: 'Panel pembaruan stok siap digunakan pada tahap berikutnya.', edit: 'Mode edit siap digunakan pada tahap berikutnya.', delete: 'Aksi hapus dinonaktifkan pada demo UI.', detail: 'Detail pesanan siap digunakan pada tahap berikutnya.' }
      showToast(messages[button.dataset.demo] || 'Aksi berhasil dijalankan.')
    })
  })
  content.querySelectorAll('.admin-page-btn').forEach((button) => button.addEventListener('click', () => showToast('Navigasi halaman demo.')))
}

function navigate(route) {
  const activeRoute = views[route] ? route : 'dashboard'
  document.getElementById('admin-content').innerHTML = views[activeRoute]()
  document.getElementById('admin-top-title').textContent = pageTitles[activeRoute]
  document.querySelectorAll('.admin-nav-link').forEach((link) => link.classList.toggle('active', link.dataset.route === activeRoute))
  bindView()
  document.getElementById('admin-sidebar').classList.remove('open')
  document.getElementById('admin-overlay').classList.remove('open')
}

function init() {
  document.getElementById('admin-app').innerHTML = shell()
  document.querySelectorAll('[data-route]').forEach((link) => link.addEventListener('click', () => { window.location.hash = link.dataset.route }))
  window.addEventListener('hashchange', () => navigate(window.location.hash.slice(1)))
  document.getElementById('admin-menu-toggle').addEventListener('click', () => { document.getElementById('admin-sidebar').classList.add('open'); document.getElementById('admin-overlay').classList.add('open') })
  document.getElementById('admin-overlay').addEventListener('click', () => { document.getElementById('admin-sidebar').classList.remove('open'); document.getElementById('admin-overlay').classList.remove('open') })
  document.getElementById('admin-notification').addEventListener('click', () => showToast('Belum ada notifikasi baru.'))
  document.getElementById('admin-logout').addEventListener('click', () => {
    logoutUser()
    window.location.replace('login.html')
  })
  navigate(window.location.hash.slice(1) || 'dashboard')
}

const currentUser = getCurrentUser()
if (currentUser?.role === 'admin') {
  init()
} else {
  window.location.replace('login.html?role=admin')
}
