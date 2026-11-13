// Shared helpers for BookHub: formatting, cart (localStorage), notifications,
// header/footer injection, and a small prototype auth flag.
import { getBookById } from './books-data.js'

const CART_KEY = 'bookhub_cart'
const ORDERS_KEY = 'bookhub_orders'
const USER_KEY = 'bookhub_user'
const SUCCESS_ORDER_KEY = 'bookhub_last_order'

export const ADMIN_CREDENTIALS = { email: 'admin@bookhub.com', password: 'admin123' }
export const CUSTOMER_CREDENTIALS = { email: 'customer@gmail.com', password: 'user123' }

/* ---------- Currency ---------- */
export function formatIDR(amount) {
  const n = Number(amount) || 0
  return 'Rp ' + n.toLocaleString('id-ID')
}

/* ---------- Cart (localStorage prototype) ---------- */
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  updateCartCount()
  document.dispatchEvent(new CustomEvent('cart:changed'))
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function updateCartCount() {
  const count = getCartCount()
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count
    el.style.display = count > 0 ? 'inline-flex' : 'none'
  })
}

export function addToCart(bookId, quantity = 1) {
  const book = getBookById(bookId)
  if (!book) return { ok: false, message: 'Buku tidak ditemukan.' }
  const cart = getCart()
  const existing = cart.find((i) => i.bookId === book.id)
  const currentQty = existing ? existing.quantity : 0
  const newQty = currentQty + quantity
  if (newQty > book.stock) {
    return { ok: false, message: `Hanya tersisa ${book.stock} eksemplar "${book.title}" di stok.` }
  }
  if (existing) {
    existing.quantity = newQty
  } else {
    cart.push({ bookId: book.id, quantity })
  }
  saveCart(cart)
  return { ok: true, message: `"${book.title}" ditambahkan ke keranjang Anda.` }
}

export function setCartQuantity(bookId, quantity) {
  const book = getBookById(bookId)
  if (!book) return { ok: false, message: 'Buku tidak ditemukan.' }
  if (quantity < 1) return { ok: false, message: 'Jumlah harus minimal 1.' }
  if (quantity > book.stock) {
    return { ok: false, message: `Hanya tersisa ${book.stock} eksemplar di stok.` }
  }
  const cart = getCart()
  const item = cart.find((i) => i.bookId === bookId)
  if (item) {
    item.quantity = quantity
    saveCart(cart)
  }
  return { ok: true }
}

export function removeFromCart(bookId) {
  const cart = getCart().filter((i) => i.bookId !== bookId)
  saveCart(cart)
}

export function clearCart() {
  saveCart([])
}

export function getCartSubtotal() {
  return getCart().reduce((sum, item) => {
    const book = getBookById(item.bookId)
    return sum + (book ? book.price * item.quantity : 0)
  }, 0)
}

export function getCartWithBooks() {
  return getCart()
    .map((item) => {
      const book = getBookById(item.bookId)
      return book ? { ...item, book } : null
    })
    .filter(Boolean)
}

/* ---------- Orders (localStorage prototype) ---------- */
export function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveOrder(order) {
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function setLastOrder(order) {
  localStorage.setItem(SUCCESS_ORDER_KEY, JSON.stringify(order))
}

export function getLastOrder() {
  try {
    const raw = localStorage.getItem(SUCCESS_ORDER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearLastOrder() {
  localStorage.removeItem(SUCCESS_ORDER_KEY)
}

/* ---------- Dummy authentication session ---------- */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const user = JSON.parse(raw)
    if (!user || !user.email) return null
    return {
      ...user,
      role: user.role || (user.email.toLowerCase() === ADMIN_CREDENTIALS.email ? 'admin' : 'customer'),
    }
  } catch {
    return null
  }
}

export function setCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  document.dispatchEvent(new CustomEvent('auth:changed'))
}

export function isAdminUser(user = getCurrentUser()) {
  return user?.role === 'admin'
}

export function isCustomerUser(user = getCurrentUser()) {
  return user?.role === 'customer'
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY)
  document.dispatchEvent(new CustomEvent('auth:changed'))
}

/* ---------- Notifications ---------- */
export function notify(message, type = 'success') {
  let host = document.querySelector('#notify-host')
  if (!host) {
    host = document.createElement('div')
    host.id = 'notify-host'
    document.body.appendChild(host)
  }
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  host.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('show'))
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 300)
  }, 3200)
}

/* ---------- Header + Footer injection ---------- */
export function renderHeader() {
  const user = getCurrentUser()
  if (user?.role === 'admin' && !window.location.pathname.endsWith('/admin.html')) {
    window.location.replace('admin.html')
    return
  }
  const authArea = user
    ? `<a href="orders.html" class="nav-user">Halo, ${user.name}</a>
       <button class="btn btn-ghost" data-logout>Keluar</button>`
    : `<a href="login.html" class="btn btn-ghost">Masuk</a>
       <a href="register.html" class="btn btn-outline">Daftar</a>`

  const html = `
  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="index.html" class="brand" aria-label="Beranda BookHub">
        <span class="brand-mark">BH</span>
        <span class="brand-name">BookHub</span>
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Buka menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="main-nav" id="main-nav">
        <a href="index.html">Beranda</a>
        <a href="books.html">Jelajahi Buku</a>
        <a href="books.html#categories">Kategori</a>
        <a href="orders.html">Pesanan Saya</a>
        <a href="cart.html" class="nav-cart" aria-label="Keranjang belanja">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="cart-badge" data-cart-count>0</span>
        </a>
        <div class="auth-area">${authArea}</div>
      </nav>
    </div>
  </header>`

  const mount = document.querySelector('#header-mount')
  if (mount) mount.innerHTML = html

  // wire mobile nav
  const toggle = document.getElementById('nav-toggle')
  const nav = document.getElementById('main-nav')
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open')
      toggle.classList.toggle('is-open', open)
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
  }

  // wire logout
  const logoutBtn = document.querySelector('[data-logout]')
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutUser()
      notify('Anda telah keluar.', 'success')
      setTimeout(() => (window.location.href = 'index.html'), 600)
    })
  }

  updateCartCount()
}

export function renderFooter() {
  const html = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col footer-brand">
        <div class="brand">
          <span class="brand-mark">BH</span>
          <span class="brand-name">BookHub</span>
        </div>
        <p class="footer-tagline">Temukan buku favorit berikutnya, dari nusantara dan mancanegara.</p>
      </div>
      <div class="footer-col">
        <h4>Tentang Kami</h4>
        <ul>
          <li><a href="index.html">Cerita Kami</a></li>
          <li><a href="books.html">Jelajahi Buku</a></li>
          <li><a href="orders.html">Lacak Pesanan</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Kontak</h4>
        <ul>
          <li>Jl. Membaca No. 17, Jakarta</li>
          <li>+62 21 555 0170</li>
          <li>hello@bookhub.id</li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Tautan Berguna</h4>
        <ul>
          <li><a href="books.html">Baru Tiba</a></li>
          <li><a href="books.html">Paling Laris</a></li>
          <li><a href="cart.html">Keranjang Anda</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} BookHub. Etalase prototipe.</p>
      </div>
    </div>
  </footer>`

  const mount = document.querySelector('#footer-mount')
  if (mount) mount.innerHTML = html
}

/* ---------- DOM-ready helper ---------- */
export function onReady(fn) {
  if (document.readyState !== 'loading') fn()
  else document.addEventListener('DOMContentLoaded', fn)
}

/* ---------- Shared card builder ---------- */
export function bookCardHTML(book) {
  const outOfStock = book.stock <= 0
  const lowStock = book.stock > 0 && book.stock <= 5
  const stockBadge = outOfStock
    ? `<span class="badge badge-out">Stok habis</span>`
    : lowStock
      ? `<span class="badge badge-low">Sisa ${book.stock}</span>`
      : `<span class="badge badge-in">Tersedia</span>`

  return `
  <article class="book-card" data-book-id="${book.id}">
    <a href="book-details.html?id=${book.id}" class="book-cover" aria-label="${book.title}">
      <img src="${book.cover}" alt="${book.title} cover" loading="lazy" />
    </a>
    <div class="book-card-body">
      <a href="book-details.html?id=${book.id}" class="book-title">${book.title}</a>
      <p class="book-author">oleh ${book.author}</p>
      <p class="book-category">${book.category}</p>
      <div class="book-card-foot">
        <span class="book-price">${formatIDR(book.price)}</span>
        ${stockBadge}
      </div>
      <div class="book-card-actions">
        <a href="book-details.html?id=${book.id}" class="btn btn-ghost btn-sm">Detail</a>
        <button class="btn btn-primary btn-sm" data-add-to-cart="${book.id}" ${outOfStock ? 'disabled' : ''}>
          ${outOfStock ? 'Tidak Tersedia' : 'Keranjang'}
        </button>
      </div>
    </div>
  </article>`
}

export function wireCardActions() {
  document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const id = btn.getAttribute('data-add-to-cart')
      const result = addToCart(Number(id), 1)
      notify(result.message, result.ok ? 'success' : 'error')
    })
  })
}
