import { getCurrentUser, logoutUser } from './common.js'
import { getBooks, saveBook, deleteBook, updateBookStock, getBookById } from './data-store.js'
import { getCategories, saveCategory, deleteCategory } from './data-store.js'
import { getAdminOrders, updateOrderStatus, deleteOrder } from './data-store.js'
import { getCustomers, saveCustomer, deleteCustomer } from './data-store.js'

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
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
}

const statusLabels = { pending: 'Menunggu', processing: 'Diproses', completed: 'Selesai', cancelled: 'Dibatalkan' }
const rupiah = (value) => 'Rp ' + Number(value).toLocaleString('id-ID')
const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]))

const PAGE_SIZE = 5
const pageState = {}

/* ---------- Pagination ---------- */

function paginationHTML(route, totalRows) {
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE))
  const currentPage = Math.min(pageState[route] || 1, totalPages)
  let buttons = `<button class="admin-page-btn" data-page-action="prev"${currentPage === 1 ? ' disabled' : ''} aria-label="Halaman sebelumnya">‹</button>`
  for (let p = 1; p <= totalPages; p++) {
    buttons += `<button class="admin-page-btn${p === currentPage ? ' active' : ''}" data-page="${p}">${p}</button>`
  }
  buttons += `<button class="admin-page-btn" data-page-action="next"${currentPage === totalPages ? ' disabled' : ''} aria-label="Halaman berikutnya">›</button>`
  return `<div class="admin-pagination">${buttons}</div>`
}

function applyPagination(content, route, totalRows) {
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE))
  const currentPage = Math.min(pageState[route] || 1, totalPages)
  pageState[route] = currentPage
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  let visibleCount = 0
  content.querySelectorAll('tbody tr[data-row-idx]').forEach((row) => {
    const idx = parseInt(row.dataset.rowIdx, 10)
    const searchMatch = row.dataset.searchMatch !== 'false'
    if (searchMatch && idx >= start && idx < end) {
      row.style.display = ''
      visibleCount++
    } else {
      row.style.display = 'none'
    }
  })
  const infoEl = content.querySelector('[data-page-info]')
  if (infoEl) {
    infoEl.textContent = visibleCount === 0
      ? 'Tidak ada data pada halaman ini'
      : `Menampilkan ${start + 1}–${start + visibleCount} dari ${totalRows}`
  }
  content.querySelectorAll('.admin-page-btn[data-page]').forEach((btn) => {
    btn.classList.toggle('active', parseInt(btn.dataset.page, 10) === currentPage)
  })
  content.querySelectorAll('.admin-page-btn[data-page-action="prev"]').forEach((btn) => {
    btn.disabled = currentPage === 1
  })
  content.querySelectorAll('.admin-page-btn[data-page-action="next"]').forEach((btn) => {
    btn.disabled = currentPage === totalPages
  })
}

/* ---------- Shell ---------- */

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
        <div class="admin-topbar-actions">
          <a class="admin-view-store" href="index.html" target="_blank" rel="noopener noreferrer">Lihat Toko</a>
          <button class="admin-icon-btn" id="admin-notification" aria-label="Notifikasi">${icons.bell}</button>
          <div class="admin-user-menu">
            <button class="admin-user-trigger" id="admin-profile-trigger" aria-expanded="false" aria-controls="admin-profile-dropdown">
              <span class="admin-top-avatar">AR</span>
              <span class="admin-user-copy"><strong>Admin BookHub</strong><small>Administrator</small></span>
              <span class="admin-chevron">${icons.chevron}</span>
            </button>
            <div class="admin-profile-dropdown" id="admin-profile-dropdown" hidden>
              <div class="admin-profile-dropdown-head"><span class="admin-top-avatar large">AR</span><div><strong>Admin BookHub</strong><span>admin@bookhub.com</span></div></div>
              <div class="admin-profile-status"><span></span>Status akun aktif</div>
              <button class="admin-profile-logout" id="admin-top-logout">${icons.logout}<span>Logout</span></button>
            </div>
          </div>
        </div>
      </header>
      <main class="admin-content" id="admin-content"></main>
    </section>
  </div>`
}

/* ---------- Shared view helpers ---------- */

function pageHeading(title, subtitle, action = '') {
  return `<div class="admin-page-heading"><div><h2>${title}</h2><p>${subtitle}</p></div>${action ? `<div class="admin-heading-actions">${action}</div>` : ''}</div>`
}

function statCard(label, value, trend, icon, color, soft) {
  return `<div class="admin-stat-card" style="--stat-color:${color};--stat-soft:${soft}"><div class="admin-stat-top"><span class="admin-stat-label">${label}</span><span class="admin-stat-icon">${icons[icon]}</span></div><div class="admin-stat-value">${value}</div><div class="admin-stat-trend">${trend}</div></div>`
}

function searchBox(placeholder = 'Cari data...') {
  return `<div class="admin-search">${icons.search}<input type="search" placeholder="${placeholder}" data-table-search /></div>`
}

function editDeleteActions(itemId) {
  return `<div class="admin-actions"><button class="admin-action" data-edit="${itemId}" aria-label="Edit">${icons.edit}</button><button class="admin-action delete" data-delete="${itemId}" aria-label="Hapus">${icons.trash}</button></div>`
}

/* ---------- Views ---------- */

function dashboardView() {
  const books = getBooks()
  const orders = getAdminOrders()
  const customers = getCustomers()
  const totalSales = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  return `${pageHeading('Dashboard', 'Ringkasan performa toko BookHub hari ini', '<button class="admin-btn admin-btn-secondary" id="btn-export">Unduh Ringkasan</button>')}
    <div class="admin-stat-grid">
      ${statCard('Total Penjualan', rupiah(totalSales), `${orders.filter((o) => o.status !== 'cancelled').length} pesanan aktif`, 'reports', '#2563eb', '#dbeafe')}
      ${statCard('Total Buku', String(books.length), `${books.filter((b) => b.stock > 0).length} tersedia`, 'books', '#0ea5a4', '#ccfbf1')}
      ${statCard('Total Pelanggan', String(customers.length), `${customers.length} terdaftar`, 'customers', '#7c3aed', '#ede9fe')}
      ${statCard('Total Pesanan', String(orders.length), `${orders.filter((o) => o.status === 'pending').length} menunggu`, 'orders', '#f59e0b', '#fef3c7')}
    </div>
    <div class="admin-grid-2">
      <section class="admin-card"><div class="admin-card-head"><h3>Ikhtisar Penjualan</h3><span>7 hari terakhir</span></div><div class="admin-card-body"><div class="admin-chart">${[44, 62, 51, 78, 66, 92, 74].map((height, index) => `<div class="admin-chart-col"><div class="admin-chart-bar" style="height:${height}%"></div><span>${['Sen','Sel','Rab','Kam','Jum','Sab','Min'][index]}</span></div>`).join('')}</div><div class="admin-chart-legend"><i></i>Penjualan harian</div></div></section>
      <section class="admin-card"><div class="admin-card-head"><h3>Pesanan Terbaru</h3><a href="#orders">Lihat semua</a></div><div class="admin-card-body"><div class="admin-order-list">${orders.slice(0, 4).map((order) => `<div class="admin-order-item"><span class="admin-order-avatar">${order.initials}</span><div class="admin-order-info"><strong>${order.id}</strong><span>${order.customer} · ${order.date}</span></div><span class="admin-order-total">${rupiah(order.total)}</span></div>`).join('')}</div></div></section>
    </div>
    <section class="admin-card"><div class="admin-card-head"><h3>Buku Terlaris</h3><a href="#books">Kelola buku</a></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Buku</th><th>Kategori</th><th>Stok</th><th>Harga</th><th>Status</th></tr></thead><tbody>${books.slice(0, 5).map((book) => `<tr><td><div class="admin-book-cell"><img class="admin-book-cover" src="${book.cover}" alt="${esc(book.title)}"><strong>${esc(book.title)}</strong></div></td><td>${book.category}</td><td>${book.stock} eksemplar</td><td><strong>${rupiah(book.price)}</strong></td><td><span class="admin-badge ${book.stock === 0 ? 'out' : book.stock <= 5 ? 'low' : 'available'}">${book.stock === 0 ? 'Stok Habis' : book.stock <= 5 ? 'Stok Menipis' : 'Tersedia'}</span></td></tr>`).join('')}</tbody></table></div></section>`
}

function booksView() {
  const books = getBooks()
  const categories = getCategories()
  return `${pageHeading('Manajemen Buku', 'Kelola katalog, harga, dan ketersediaan buku', `<button class="admin-btn admin-btn-primary" data-add="book">${icons.plus} Tambah Buku</button>`)}
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari judul atau penulis...')}<select class="admin-select" style="max-width:160px" data-category-filter><option>Semua Kategori</option>${categories.map((category) => `<option>${category.name}</option>`).join('')}</select></div><div class="admin-table-wrap"><table class="admin-table" data-filter-table><thead><tr><th>Buku</th><th>Penulis</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr></thead><tbody>${books.map((book, index) => `<tr data-row-idx="${index}" data-search-row="${esc(`${book.title} ${book.author} ${book.category}`)}" data-book-id="${book.id}"><td><div class="admin-book-cell"><img class="admin-book-cover" src="${book.cover}" alt="${esc(book.title)}"><strong>${esc(book.title)}</strong></div></td><td>${esc(book.author)}</td><td><span class="admin-badge processing">${book.category}</span></td><td><strong>${rupiah(book.price)}</strong></td><td>${book.stock} eksemplar</td><td>${editDeleteActions(book.id)}</td></tr>`).join('')}</tbody></table></div><div class="admin-table-foot"><span data-page-info></span>${paginationHTML('books', books.length)}</div></section>`
}

function categoriesView() {
  const categories = getCategories()
  const books = getBooks()
  return `${pageHeading('Manajemen Kategori', 'Atur kategori untuk memudahkan pelanggan menemukan buku', `<button class="admin-btn admin-btn-primary" data-add="category">${icons.plus} Tambah Kategori</button>`)}
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari kategori...')}<span style="font-size:11px;color:var(--admin-muted)">${categories.length} kategori aktif</span></div><div class="admin-table-wrap"><table class="admin-table" data-filter-table><thead><tr><th>No</th><th>Nama Kategori</th><th>Slug</th><th>Jumlah Buku</th><th>Aksi</th></tr></thead><tbody>${categories.map((category, index) => `<tr data-row-idx="${index}" data-search-row="${esc(category.name)}" data-category-id="${category.id || ''}"><td>${String(index + 1).padStart(2, '0')}</td><td><div class="admin-book-cell"><span class="admin-category-icon">${category.name.slice(0, 2).toUpperCase()}</span><strong>${esc(category.name)}</strong></div></td><td class="admin-cell-sub">${esc(category.slug || '')}</td><td>${books.filter((book) => book.category === category.name).length} buku</td><td>${editDeleteActions(category.id || index)}</td></tr>`).join('')}</tbody></table></div><div class="admin-table-foot"><span data-page-info></span>${paginationHTML('categories', categories.length)}</div></section>`
}

function ordersView() {
  const orders = getAdminOrders()
  return `${pageHeading('Manajemen Pesanan', 'Pantau dan proses seluruh pesanan pelanggan')}
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari nomor pesanan...')}<select class="admin-select" style="max-width:150px" data-status-filter><option>Semua Status</option><option value="pending">Menunggu</option><option value="processing">Diproses</option><option value="completed">Selesai</option><option value="cancelled">Dibatalkan</option></select></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>No. Pesanan</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${orders.map((order, index) => `<tr data-row-idx="${index}" data-search-row="${esc(order.id)}" data-order-id="${order.id}" data-status="${order.status}"><td><strong>${order.id}</strong></td><td><div class="admin-customer-cell"><span class="admin-customer-avatar">${order.initials}</span><strong>${esc(order.customer)}</strong></div></td><td>${order.date}</td><td><strong>${rupiah(order.total)}</strong></td><td><span class="admin-badge ${order.status}">${statusLabels[order.status]}</span></td><td><div class="admin-actions"><select class="admin-select" style="min-height:30px;padding:4px 8px;font-size:11px;max-width:110px" data-status-change="${order.id}"><option value="pending"${order.status === 'pending' ? ' selected' : ''}>Menunggu</option><option value="processing"${order.status === 'processing' ? ' selected' : ''}>Diproses</option><option value="completed"${order.status === 'completed' ? ' selected' : ''}>Selesai</option><option value="cancelled"${order.status === 'cancelled' ? ' selected' : ''}>Dibatalkan</option></select><button class="admin-action delete" data-delete-order="${order.id}" aria-label="Hapus Pesanan">${icons.trash}</button></div></td></tr>`).join('')}</tbody></table></div><div class="admin-table-foot"><span data-page-info></span>${paginationHTML('orders', orders.length)}</div></section>`
}

function customersView() {
  const customers = getCustomers()
  return `${pageHeading('Manajemen Pelanggan', 'Lihat dan kelola informasi pelanggan BookHub')}
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari nama atau email...')}<span style="font-size:11px;color:var(--admin-muted)">${customers.length} pelanggan terdaftar</span></div><div class="admin-table-wrap"><table class="admin-table" data-filter-table><thead><tr><th>Pelanggan</th><th>Kontak</th><th>Bergabung</th><th>Total Pesanan</th><th>Aksi</th></tr></thead><tbody>${customers.map((customer, index) => `<tr data-row-idx="${index}" data-search-row="${esc(`${customer.name} ${customer.email} ${customer.phone}`)}" data-customer-id="${customer.id}"><td><div class="admin-customer-cell"><span class="admin-customer-avatar">${initials(customer.name)}</span><div><strong>${esc(customer.name)}</strong><span class="admin-cell-sub">Pelanggan aktif</span></div></div></td><td><strong>${esc(customer.email)}</strong><span class="admin-cell-sub">${esc(customer.phone)}</span></td><td>${customer.joined}</td><td><strong>${customer.orders}</strong> pesanan</td><td>${editDeleteActions(customer.id)}</td></tr>`).join('')}</tbody></table></div><div class="admin-table-foot"><span data-page-info></span>${paginationHTML('customers', customers.length)}</div></section>`
}

function inventoryView() {
  const books = getBooks()
  const totalSku = books.length
  const available = books.filter((b) => b.stock > 5).length
  const lowStock = books.filter((b) => b.stock > 0 && b.stock <= 5).length
  const outStock = books.filter((b) => b.stock === 0).length
  const totalStock = books.reduce((sum, b) => sum + b.stock, 0)
  return `${pageHeading('Manajemen Inventaris', 'Pantau tingkat stok dan ketersediaan buku')}
    <div class="admin-stat-grid">${statCard('Total SKU', String(totalSku), 'Semua judul aktif', 'books', '#2563eb', '#dbeafe')}${statCard('Stok Tersedia', String(totalStock), `${available} judul tersedia`, 'inventory', '#16a34a', '#dcfce7')}${statCard('Stok Menipis', String(lowStock), 'Perlu segera diisi', 'inventory', '#f59e0b', '#fef3c7')}${statCard('Stok Habis', String(outStock), 'Tidak tersedia', 'inventory', '#dc2626', '#fee2e2')}</div>
    <section class="admin-card admin-table-card"><div class="admin-table-toolbar">${searchBox('Cari judul buku...')}<select class="admin-select" style="max-width:160px" data-stock-filter><option>Semua Status</option><option value="available">Tersedia</option><option value="low">Stok Menipis</option><option value="out">Stok Habis</option></select></div><div class="admin-table-wrap"><table class="admin-table" data-filter-table><thead><tr><th>Buku</th><th>Kategori</th><th>Stok Saat Ini</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${books.map((book, index) => { const stockStatus = book.stock === 0 ? 'out' : book.stock <= 5 ? 'low' : 'available'; const label = stockStatus === 'out' ? 'Stok Habis' : stockStatus === 'low' ? 'Stok Menipis' : 'Tersedia'; const percent = Math.min(book.stock / 30 * 100, 100); return `<tr data-row-idx="${index}" data-search-row="${esc(`${book.title} ${book.category}`)}" data-stock-status="${stockStatus}" data-book-id="${book.id}"><td><div class="admin-book-cell"><img class="admin-book-cover" src="${book.cover}" alt="${esc(book.title)}"><strong>${esc(book.title)}</strong></div></td><td>${book.category}</td><td><div class="admin-stock-cell"><div class="admin-stock-line"><strong>${book.stock}</strong><span style="color:var(--admin-muted);font-size:10px">/ 30</span></div><div class="admin-stock-meter"><span class="${stockStatus}" style="width:${percent}%"></span></div></div></td><td><span class="admin-badge ${stockStatus}">${label}</span></td><td><button class="admin-btn admin-btn-secondary" style="min-height:30px;padding:6px 10px" data-stock-edit="${book.id}">Atur Stok</button></td></tr>` }).join('')}</tbody></table></div><div class="admin-table-foot"><span data-page-info></span>${paginationHTML('inventory', books.length)}</div></section>`
}

function reportsView() {
  const books = getBooks()
  const orders = getAdminOrders()
  const customers = getCustomers()
  const activeOrders = orders.filter((o) => o.status !== 'cancelled')
  const totalSales = activeOrders.reduce((sum, o) => sum + o.total, 0)
  const totalItemsSold = activeOrders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + i.quantity, 0) : 0), 0)

  const categorySales = {}
  activeOrders.forEach((order) => {
    if (order.items) {
      order.items.forEach((item) => {
        const book = books.find((b) => b.title === item.title)
        const cat = book ? book.category : 'Lainnya'
        categorySales[cat] = (categorySales[cat] || 0) + item.quantity
      })
    }
  })
  const topCategories = Object.entries(categorySales).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const maxCat = topCategories.length ? topCategories[0][1] : 1
  const categoryColors = ['#2563eb', '#0ea5a4', '#7c3aed', '#f59e0b']

  return `${pageHeading('Laporan', 'Analisis performa penjualan dan pertumbuhan toko')}
    <div class="admin-stat-grid"><div class="admin-report-stat"><p>Total Penjualan</p><strong>${rupiah(totalSales)}</strong></div><div class="admin-report-stat"><p>Total Pesanan</p><strong>${orders.length}</strong></div><div class="admin-report-stat"><p>Total Pelanggan</p><strong>${customers.length}</strong></div><div class="admin-report-stat"><p>Total Buku Terjual</p><strong>${totalItemsSold}</strong></div></div>
    <div class="admin-grid-2"><section class="admin-card"><div class="admin-card-head"><h3>Penjualan & Pesanan</h3><span>7 hari terakhir</span></div><div class="admin-card-body"><div class="admin-bar-chart">${[44, 64, 52, 78, 67, 92, 74].map((height, index) => `<div class="admin-bar-group"><div class="admin-bar-pair"><i class="admin-bar sales" style="height:${height}%"></i><i class="admin-bar orders" style="height:${Math.max(height - 18, 12)}%"></i></div><label>${['08','09','10','11','12','13','14'][index]}</label></div>`).join('')}</div><div class="admin-legend"><span><i style="background:var(--admin-blue)"></i>Penjualan</span><span><i style="background:var(--admin-teal)"></i>Pesanan</span></div></div></section><section class="admin-card"><div class="admin-card-head"><h3>Kategori Terlaris</h3><span>Berdasarkan penjualan</span></div><div class="admin-card-body"><div class="admin-order-list">${topCategories.length ? topCategories.map(([name, value, ], i) => `<div class="admin-order-item"><span class="admin-category-icon" style="background:${categoryColors[i]}18;color:${categoryColors[i]}">${name.slice(0,2).toUpperCase()}</span><div class="admin-order-info"><strong>${name}</strong><span>${value} buku terjual</span></div><span class="admin-order-total">${Math.round(value / maxCat * 100)}%</span></div>`).join('') : '<p style="color:var(--admin-muted);font-size:12px;padding:16px 0">Belum ada data penjualan.</p>'}</div></div></section></div>`
}

const views = { dashboard: dashboardView, books: booksView, categories: categoriesView, orders: ordersView, customers: customersView, inventory: inventoryView, reports: reportsView }
const pageTitles = { dashboard: 'Dashboard', books: 'Manajemen Buku', categories: 'Manajemen Kategori', orders: 'Manajemen Pesanan', customers: 'Manajemen Pelanggan', inventory: 'Manajemen Inventaris', reports: 'Laporan' }

/* ---------- Toast ---------- */

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

/* ---------- Modal system ---------- */

function openModal(title, bodyHTML, onSave) {
  const existing = document.getElementById('admin-modal-overlay')
  if (existing) existing.remove()
  const overlay = document.createElement('div')
  overlay.id = 'admin-modal-overlay'
  overlay.className = 'admin-modal-overlay'
  overlay.innerHTML = `<div class="admin-modal"><div class="admin-modal-head"><h3>${esc(title)}</h3><button class="admin-modal-close" id="admin-modal-x">${icons.close}</button></div><div class="admin-modal-body">${bodyHTML}</div><div class="admin-modal-foot"><button class="admin-btn admin-btn-secondary" id="admin-modal-cancel">Batal</button><button class="admin-btn admin-btn-primary" id="admin-modal-save">Simpan</button></div></div>`
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('show'))

  const close = () => { overlay.classList.remove('show'); setTimeout(() => overlay.remove(), 200) }
  document.getElementById('admin-modal-x').addEventListener('click', close)
  document.getElementById('admin-modal-cancel').addEventListener('click', close)
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close() })
  if (onSave) {
    document.getElementById('admin-modal-save').addEventListener('click', () => {
      const result = onSave(overlay)
      if (result !== false) close()
    })
  } else {
    document.getElementById('admin-modal-save').style.display = 'none'
  }
  return overlay
}

function openConfirm(message, onConfirm) {
  const overlay = openModal('Konfirmasi', `<p style="margin:0;color:var(--admin-text);font-size:13px;line-height:1.6">${esc(message)}</p>`, () => {
    onConfirm()
  })
  document.getElementById('admin-modal-save').textContent = 'Hapus'
  document.getElementById('admin-modal-save').classList.remove('admin-btn-primary')
  document.getElementById('admin-modal-save').classList.add('admin-btn-danger')
  return overlay
}

function fieldLabel(label) {
  return `<label class="admin-modal-label">${label}</label>`
}

function bookFormHTML(book) {
  const categories = getCategories()
  const b = book || {}
  return `
    <div class="admin-modal-grid">
      <div class="admin-modal-field">${fieldLabel('Judul')}<input class="admin-modal-input" id="bf-title" type="text" value="${esc(b.title || '')}" placeholder="Judul buku" /></div>
      <div class="admin-modal-field">${fieldLabel('Penulis')}<input class="admin-modal-input" id="bf-author" type="text" value="${esc(b.author || '')}" placeholder="Nama penulis" /></div>
      <div class="admin-modal-field">${fieldLabel('Kategori')}<select class="admin-modal-input" id="bf-category">${categories.map((c) => `<option${b.category === c.name ? ' selected' : ''}>${c.name}</option>`).join('')}</select></div>
      <div class="admin-modal-field">${fieldLabel('Harga (Rp)')}<input class="admin-modal-input" id="bf-price" type="number" min="0" value="${b.price || ''}" placeholder="0" /></div>
      <div class="admin-modal-field">${fieldLabel('Stok')}<input class="admin-modal-input" id="bf-stock" type="number" min="0" value="${b.stock != null ? b.stock : ''}" placeholder="0" /></div>
      <div class="admin-modal-field">${fieldLabel('URL Sampul')}<input class="admin-modal-input" id="bf-cover" type="text" value="${esc(b.cover || '')}" placeholder="https://..." /></div>
      <div class="admin-modal-field" style="grid-column:1/-1">${fieldLabel('Deskripsi')}<textarea class="admin-modal-input" id="bf-desc" rows="3" placeholder="Sinopsis buku">${esc(b.description || '')}</textarea></div>
    </div>`
}

function readBookForm() {
  const title = document.getElementById('bf-title').value.trim()
  const author = document.getElementById('bf-author').value.trim()
  const category = document.getElementById('bf-category').value
  const price = parseInt(document.getElementById('bf-price').value, 10) || 0
  const stock = parseInt(document.getElementById('bf-stock').value, 10) || 0
  const cover = document.getElementById('bf-cover').value.trim() || `https://picsum.photos/seed/${encodeURIComponent(title || 'book')}/400/600`
  const description = document.getElementById('bf-desc').value.trim()
  if (!title || !author) {
    showToast('Judul dan penulis wajib diisi.')
    return null
  }
  return { title, author, category, price, stock, cover, description }
}

function categoryFormHTML(category) {
  const c = category || {}
  return `
    <div class="admin-modal-grid">
      <div class="admin-modal-field">${fieldLabel('Nama Kategori')}<input class="admin-modal-input" id="cf-name" type="text" value="${esc(c.name || '')}" placeholder="Nama kategori" /></div>
      <div class="admin-modal-field">${fieldLabel('Slug')}<input class="admin-modal-input" id="cf-slug" type="text" value="${esc(c.slug || '')}" placeholder="url-friendly-slug" /></div>
    </div>`
}

function readCategoryForm() {
  const name = document.getElementById('cf-name').value.trim()
  const slug = document.getElementById('cf-slug').value.trim() || name.toLowerCase().replace(/\s+/g, '-')
  if (!name) {
    showToast('Nama kategori wajib diisi.')
    return null
  }
  return { name, slug }
}

function customerFormHTML(customer) {
  const c = customer || {}
  return `
    <div class="admin-modal-grid">
      <div class="admin-modal-field">${fieldLabel('Nama')}<input class="admin-modal-input" id="cuf-name" type="text" value="${esc(c.name || '')}" placeholder="Nama pelanggan" /></div>
      <div class="admin-modal-field">${fieldLabel('Email')}<input class="admin-modal-input" id="cuf-email" type="email" value="${esc(c.email || '')}" placeholder="email@contoh.com" /></div>
      <div class="admin-modal-field">${fieldLabel('Telepon')}<input class="admin-modal-input" id="cuf-phone" type="text" value="${esc(c.phone || '')}" placeholder="+62 ..." /></div>
      <div class="admin-modal-field">${fieldLabel('Total Pesanan')}<input class="admin-modal-input" id="cuf-orders" type="number" min="0" value="${c.orders != null ? c.orders : 0}" /></div>
    </div>`
}

function readCustomerForm() {
  const name = document.getElementById('cuf-name').value.trim()
  const email = document.getElementById('cuf-email').value.trim()
  const phone = document.getElementById('cuf-phone').value.trim()
  const orders = parseInt(document.getElementById('cuf-orders').value, 10) || 0
  if (!name || !email) {
    showToast('Nama dan email wajib diisi.')
    return null
  }
  return { name, email, phone, orders }
}

function stockFormHTML(book) {
  return `
    <div class="admin-modal-grid">
      <div class="admin-modal-field" style="grid-column:1/-1"><p style="margin:0 0 8px;color:var(--admin-muted);font-size:12px">Buku: <strong style="color:var(--admin-navy)">${esc(book.title)}</strong></p></div>
      <div class="admin-modal-field">${fieldLabel('Stok Saat Ini')}<input class="admin-modal-input" id="sf-current" type="number" value="${book.stock}" readonly style="opacity:.6" /></div>
      <div class="admin-modal-field">${fieldLabel('Stok Baru')}<input class="admin-modal-input" id="sf-new" type="number" min="0" value="${book.stock}" /></div>
      <div class="admin-modal-field" style="grid-column:1/-1">${fieldLabel('Aksi Cepat')}<div style="display:flex;gap:8px"><button class="admin-btn admin-btn-secondary" style="min-height:34px;padding:6px 12px" id="sf-add5">+5</button><button class="admin-btn admin-btn-secondary" style="min-height:34px;padding:6px 12px" id="sf-add10">+10</button><button class="admin-btn admin-btn-secondary" style="min-height:34px;padding:6px 12px" id="sf-sub5">-5</button><button class="admin-btn admin-btn-danger" style="min-height:34px;padding:6px 12px" id="sf-zero">Set 0</button></div></div>
    </div>`
}

/* ---------- View binding ---------- */

function bindView(route) {
  const content = document.getElementById('admin-content')
  const activeRoute = route || 'dashboard'
  const totalRows = content.querySelectorAll('tbody tr[data-row-idx]').length

  content.querySelectorAll('[data-table-search]').forEach((input) => {
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim()
      content.querySelectorAll('tbody tr[data-row-idx]').forEach((row) => {
        const rowText = row.dataset.searchRow || ''
        row.dataset.searchMatch = rowText.toLowerCase().includes(query) ? 'true' : 'false'
      })
      applyPagination(content, activeRoute, totalRows)
    })
  })

  content.querySelectorAll('[data-category-filter]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const cat = sel.value
      content.querySelectorAll('tbody tr[data-row-idx]').forEach((row) => {
        const bookId = row.dataset.bookId
        if (!bookId || cat === 'Semua Kategori') {
          row.dataset.searchMatch = row.dataset.searchMatch !== 'false' ? 'true' : 'false'
        } else {
          const book = getBookById(bookId)
          row.dataset.searchMatch = book && book.category === cat ? 'true' : 'false'
        }
      })
      applyPagination(content, activeRoute, totalRows)
    })
  })

  content.querySelectorAll('[data-status-filter]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const status = sel.value
      content.querySelectorAll('tbody tr[data-row-idx]').forEach((row) => {
        if (status === 'Semua Status') {
          row.dataset.searchMatch = 'true'
        } else {
          row.dataset.searchMatch = row.dataset.status === status ? 'true' : 'false'
        }
      })
      applyPagination(content, activeRoute, totalRows)
    })
  })

  content.querySelectorAll('[data-stock-filter]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const status = sel.value
      content.querySelectorAll('tbody tr[data-row-idx]').forEach((row) => {
        if (status === 'Semua Status') {
          row.dataset.searchMatch = 'true'
        } else {
          row.dataset.searchMatch = row.dataset.stockStatus === status ? 'true' : 'false'
        }
      })
      applyPagination(content, activeRoute, totalRows)
    })
  })

  content.querySelectorAll('.admin-page-btn[data-page]').forEach((button) => {
    button.addEventListener('click', () => {
      pageState[activeRoute] = parseInt(button.dataset.page, 10)
      applyPagination(content, activeRoute, totalRows)
    })
  })

  content.querySelectorAll('.admin-page-btn[data-page-action]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.disabled) return
      const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE))
      let currentPage = pageState[activeRoute] || 1
      currentPage = button.dataset.pageAction === 'prev' ? Math.max(1, currentPage - 1) : Math.min(totalPages, currentPage + 1)
      pageState[activeRoute] = currentPage
      applyPagination(content, activeRoute, totalRows)
    })
  })

  content.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.add
      if (type === 'book') {
        openModal('Tambah Buku', bookFormHTML(null), (modal) => {
          const data = readBookForm()
          if (!data) return false
          saveBook(data)
          showToast('Buku berhasil ditambahkan.')
          navigate(activeRoute)
        })
      } else if (type === 'category') {
        openModal('Tambah Kategori', categoryFormHTML(null), (modal) => {
          const data = readCategoryForm()
          if (!data) return false
          saveCategory(data)
          showToast('Kategori berhasil ditambahkan.')
          navigate(activeRoute)
        })
      }
    })
  })

  content.querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.edit, 10)
      if (activeRoute === 'books') {
        const book = getBookById(id)
        if (!book) return
        openModal('Edit Buku', bookFormHTML(book), () => {
          const data = readBookForm()
          if (!data) return false
          data.id = id
          saveBook(data)
          showToast('Buku berhasil diperbarui.')
          navigate(activeRoute)
        })
      } else if (activeRoute === 'categories') {
        const categories = getCategories()
        const cat = categories.find((c) => (c.id || 0) === id) || categories[id]
        if (!cat) return
        openModal('Edit Kategori', categoryFormHTML(cat), () => {
          const data = readCategoryForm()
          if (!data) return false
          data.id = cat.id || id
          saveCategory(data)
          showToast('Kategori berhasil diperbarui.')
          navigate(activeRoute)
        })
      } else if (activeRoute === 'customers') {
        const customers = getCustomers()
        const cust = customers.find((c) => c.id === id)
        if (!cust) return
        openModal('Edit Pelanggan', customerFormHTML(cust), () => {
          const data = readCustomerForm()
          if (!data) return false
          data.id = id
          saveCustomer(data)
          showToast('Data pelanggan berhasil diperbarui.')
          navigate(activeRoute)
        })
      }
    })
  })

  content.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.delete, 10)
      if (activeRoute === 'books') {
        const book = getBookById(id)
        if (!book) return
        openConfirm(`Hapus buku "${book.title}"? Tindakan ini tidak dapat dibatalkan.`, () => {
          deleteBook(id)
          showToast('Buku berhasil dihapus.')
          navigate(activeRoute)
        })
      } else if (activeRoute === 'categories') {
        const categories = getCategories()
        const cat = categories.find((c) => (c.id || 0) === id) || categories[id]
        if (!cat) return
        openConfirm(`Hapus kategori "${cat.name}"?`, () => {
          deleteCategory(cat.id || id)
          showToast('Kategori berhasil dihapus.')
          navigate(activeRoute)
        })
      } else if (activeRoute === 'customers') {
        const customers = getCustomers()
        const cust = customers.find((c) => c.id === id)
        if (!cust) return
        openConfirm(`Hapus pelanggan "${cust.name}"?`, () => {
          deleteCustomer(id)
          showToast('Pelanggan berhasil dihapus.')
          navigate(activeRoute)
        })
      }
    })
  })

  content.querySelectorAll('[data-delete-order]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteOrder
      openConfirm(`Hapus pesanan ${id}?`, () => {
        deleteOrder(id)
        showToast('Pesanan berhasil dihapus.')
        navigate(activeRoute)
      })
    })
  })

  content.querySelectorAll('[data-status-change]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const id = sel.dataset.statusChange
      updateOrderStatus(id, sel.value)
      showToast(`Status pesanan ${id} diubah ke ${statusLabels[sel.value]}.`)
      navigate(activeRoute)
    })
  })

  content.querySelectorAll('[data-stock-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.stockEdit, 10)
      const book = getBookById(id)
      if (!book) return
      openModal('Atur Stok', stockFormHTML(book), (modal) => {
        const newStock = parseInt(document.getElementById('sf-new').value, 10)
        if (isNaN(newStock) || newStock < 0) {
          showToast('Stok harus angka positif.')
          return false
        }
        updateBookStock(id, newStock)
        showToast('Stok berhasil diperbarui.')
        navigate(activeRoute)
      })
      const newInput = document.getElementById('sf-new')
      document.getElementById('sf-add5').addEventListener('click', () => { newInput.value = (parseInt(newInput.value, 10) || 0) + 5 })
      document.getElementById('sf-add10').addEventListener('click', () => { newInput.value = (parseInt(newInput.value, 10) || 0) + 10 })
      document.getElementById('sf-sub5').addEventListener('click', () => { newInput.value = Math.max(0, (parseInt(newInput.value, 10) || 0) - 5) })
      document.getElementById('sf-zero').addEventListener('click', () => { newInput.value = 0 })
    })
  })

  content.querySelectorAll('#btn-export').forEach((button) => {
    button.addEventListener('click', () => showToast('Ringkasan disiapkan untuk diunduh.'))
  })

  if (totalRows > 0) {
    applyPagination(content, activeRoute, totalRows)
  }
}

/* ---------- Navigation ---------- */

function navigate(route) {
  const activeRoute = views[route] ? route : 'dashboard'
  document.getElementById('admin-content').innerHTML = views[activeRoute]()
  document.getElementById('admin-top-title').textContent = pageTitles[activeRoute]
  document.querySelectorAll('.admin-nav-link').forEach((link) => link.classList.toggle('active', link.dataset.route === activeRoute))
  bindView(activeRoute)
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
  document.querySelector('.admin-view-store').addEventListener('click', (e) => {
    e.preventDefault()
    window.open('index.html', '_blank', 'noopener,noreferrer')
  })
  const profileTrigger = document.getElementById('admin-profile-trigger')
  const profileDropdown = document.getElementById('admin-profile-dropdown')
  profileTrigger.addEventListener('click', () => {
    const isOpen = profileDropdown.hidden
    profileDropdown.hidden = !isOpen
    profileTrigger.setAttribute('aria-expanded', String(isOpen))
  })
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.admin-user-menu')) {
      profileDropdown.hidden = true
      profileTrigger.setAttribute('aria-expanded', 'false')
    }
  })
  const signOut = () => {
    logoutUser()
    window.location.replace('admin-login.html')
  }
  document.getElementById('admin-top-logout').addEventListener('click', signOut)
  document.getElementById('admin-logout').addEventListener('click', signOut)
  navigate(window.location.hash.slice(1) || 'dashboard')
}

const currentUser = getCurrentUser()
if (currentUser?.role === 'admin') {
  init()
} else {
  window.location.replace('admin-login.html')
}
