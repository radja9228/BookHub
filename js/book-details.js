import { getBookById, getRelatedBooks } from './books-data.js'
import {
  renderHeader, renderFooter, formatIDR, addToCart, bookCardHTML,
  wireCardActions, notify,
} from './common.js'

renderHeader()
renderFooter()

const root = document.getElementById('detail-root')
const crumbTitle = document.getElementById('crumb-title')

const params = new URLSearchParams(window.location.search)
const id = params.get('id')
const book = getBookById(id)

if (!book) {
  crumbTitle.textContent = 'Tidak Ditemukan'
  root.innerHTML = `
    <div class="empty-state" style="margin:48px 0">
      <div class="emoji">&#128533;</div>
      <h3>Buku tidak ditemukan</h3>
      <p>Buku yang Anda cari tidak dapat ditemukan. Mungkin sudah dihapus atau tautan tidak benar.</p>
      <a href="books.html" class="btn btn-primary" style="margin-top:16px">Kembali ke Jelajahi Buku</a>
    </div>`
} else {
  crumbTitle.textContent = book.title
  document.title = `${book.title} — BookHub`

  const outOfStock = book.stock <= 0
  const lowStock = book.stock > 0 && book.stock <= 5
  const stockClass = outOfStock ? 'out' : lowStock ? 'low' : ''
  const stockText = outOfStock
    ? 'Stok habis'
    : lowStock
      ? `Sisa ${book.stock} di stok`
      : `${book.stock} tersedia`

  root.innerHTML = `
    <div class="detail-grid">
      <div class="detail-cover">
        <img src="${book.cover}" alt="${book.title} cover" />
      </div>
      <div class="detail-meta">
        <span class="category-tag">${book.category}</span>
        <h1>${book.title}</h1>
        <p class="author">oleh ${book.author}</p>
        <div class="price">${formatIDR(book.price)}</div>
        <p class="desc">${book.description}</p>

        <dl class="detail-info">
          <dt>ISBN</dt><dd>${book.isbn}</dd>
          <dt>Penerbit</dt><dd>${book.publisher}</dd>
          <dt>Kategori</dt><dd>${book.category}</dd>
          <dt>Penulis</dt><dd>${book.author}</dd>
        </dl>

        <div class="qty-row">
          <div class="qty-control">
            <button id="qty-minus" type="button" aria-label="Kurangi jumlah" ${outOfStock ? 'disabled' : ''}>&minus;</button>
            <input id="qty-input" type="number" value="1" min="1" max="${book.stock}" ${outOfStock ? 'disabled' : ''} />
            <button id="qty-plus" type="button" aria-label="Tambah jumlah" ${outOfStock ? 'disabled' : ''}>+</button>
          </div>
          <span class="stock-note ${stockClass}">Ketersediaan: <strong>${stockText}</strong></span>
        </div>

        <div class="detail-actions">
          <button class="btn btn-primary btn-lg" id="add-to-cart-btn" ${outOfStock ? 'disabled' : ''}>
            ${outOfStock ? 'Tidak Tersedia' : 'Keranjang'}
          </button>
          <a href="books.html" class="btn btn-ghost btn-lg">Lanjutkan Mencari</a>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="section-head">
        <h2>Buku Terkait</h2>
        <div class="sub">Lainnya dari ${book.category}</div>
      </div>
      <div class="book-grid" id="related-grid"></div>
    </section>
  `

  // Quantity controls
  const qtyInput = document.getElementById('qty-input')
  const qtyMinus = document.getElementById('qty-minus')
  const qtyPlus = document.getElementById('qty-plus')

  const clampQty = () => {
    let v = parseInt(qtyInput.value, 10)
    if (isNaN(v) || v < 1) v = 1
    if (v > book.stock) v = book.stock
    qtyInput.value = v
  }
  qtyMinus.addEventListener('click', () => {
    clampQty()
    if (parseInt(qtyInput.value, 10) > 1) qtyInput.value = parseInt(qtyInput.value, 10) - 1
  })
  qtyPlus.addEventListener('click', () => {
    clampQty()
    if (parseInt(qtyInput.value, 10) < book.stock) qtyInput.value = parseInt(qtyInput.value, 10) + 1
  })
  qtyInput.addEventListener('change', clampQty)

  // Add to cart
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    clampQty()
    const qty = parseInt(qtyInput.value, 10)
    const result = addToCart(book.id, qty)
    notify(result.message, result.ok ? 'success' : 'error')
  })

  // Related books
  const related = getRelatedBooks(book, 4)
  const relatedGrid = document.getElementById('related-grid')
  if (related.length) {
    relatedGrid.innerHTML = related.map(bookCardHTML).join('')
    wireCardActions()
  } else {
    relatedGrid.innerHTML = `<p class="empty-state">Belum ada buku terkait di kategori ini.</p>`
  }
}
