import {
  renderHeader, renderFooter, formatIDR, getCartWithBooks, getCartSubtotal,
  clearCart, saveOrder, setLastOrder, notify, getCurrentUser,
} from './common.js'

renderHeader()
renderFooter()

const root = document.getElementById('checkout-root')
const user = getCurrentUser()

function render() {
  const items = getCartWithBooks()
  if (items.length === 0) {
    root.innerHTML = `
      <div class="empty-state" style="margin:48px 0 80px">
        <div class="emoji">&#128722;</div>
        <h3>Keranjang Anda kosong</h3>
        <p>Tambahkan beberapa buku ke keranjang sebelum membayar.</p>
        <a href="books.html" class="btn btn-primary" style="margin-top:16px">Jelajahi Buku</a>
      </div>`
    return
  }

  const subtotal = getCartSubtotal()
  const shipping = subtotal >= 200000 ? 0 : 15000
  const total = subtotal + shipping

  root.innerHTML = `
    <div class="checkout-layout">
      <div class="form-card">
        <div class="prototype-note">
          <span>&#9888;&#65039;</span>
          <div><strong>Pembayaran prototipe</strong>Pembayaran ini tidak memproses pembayaran sungguhan dan tidak menyimpan ke database sungguhan. Tidak ada penyedia pembayaran yang terhubung. Gunakan untuk melihat alur pesanan.</div>
        </div>

        ${user ? '' : `<div class="alert alert-info">Anda membayar sebagai tamu. <a href="login.html" style="font-weight:600">Masuk</a> untuk menyimpan data Anda untuk selanjutnya.</div>`}

        <form id="checkout-form" novalidate>
          <h3 style="margin-bottom:18px">Informasi Pengiriman</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="full_name">Nama lengkap *</label>
              <input class="form-control" id="full_name" name="full_name" type="text" value="${user ? user.name : ''}" required />
              <div class="field-error" data-error-for="full_name"></div>
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input class="form-control" id="email" name="email" type="email" value="${user ? user.email : ''}" required />
              <div class="field-error" data-error-for="email"></div>
            </div>
            <div class="form-group">
              <label for="phone">Nomor telepon *</label>
              <input class="form-control" id="phone" name="phone" type="tel" required />
              <div class="field-error" data-error-for="phone"></div>
            </div>
            <div class="form-group">
              <label for="postal_code">Kode pos *</label>
              <input class="form-control" id="postal_code" name="postal_code" type="text" required />
              <div class="field-error" data-error-for="postal_code"></div>
            </div>
          </div>
          <div class="form-group">
            <label for="address1">Alamat jalan *</label>
            <input class="form-control" id="address1" name="address1" type="text" required />
            <div class="field-error" data-error-for="address1"></div>
          </div>
          <div class="form-group">
            <label for="address2">Apartemen, unit, dll. (opsional)</label>
            <input class="form-control" id="address2" name="address2" type="text" />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="city">Kota *</label>
              <input class="form-control" id="city" name="city" type="text" required />
              <div class="field-error" data-error-for="city"></div>
            </div>
            <div class="form-group">
              <label for="state">Provinsi *</label>
              <input class="form-control" id="state" name="state" type="text" required />
              <div class="field-error" data-error-for="state"></div>
            </div>
          </div>

          <h3 style="margin:26px 0 16px">Metode Pembayaran</h3>
          <div class="prototype-note" style="margin-bottom:14px">
            <span>&#128179;</span>
            <div><strong>Pembayaran tes saja</strong>Tidak ada kartu sungguhan yang ditagih dan tidak ada penyedia pembayaran yang terhubung. Ini adalah pembayaran simulasi untuk pratinjau.</div>
          </div>
          <div class="payment-options" id="payment-options">
            <label class="payment-option selected">
              <input type="radio" name="payment" value="card_test" checked />
              <span class="pm-info"><span class="pm-name">Kartu Tes</span><span class="pm-desc">Kartu simulasi — tanpa tagihan sungguhan</span></span>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="cod" />
              <span class="pm-info"><span class="pm-name">Bayar di Tempat</span><span class="pm-desc">Bayar tunai saat pesanan tiba</span></span>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="bank" />
              <span class="pm-info"><span class="pm-name">Transfer Bank</span><span class="pm-desc">Transfer manual dengan konfirmasi pesanan</span></span>
            </label>
          </div>
          <div class="field-error" data-error-for="payment"></div>

          <div class="alert alert-error" id="form-alert" hidden></div>

          <button type="submit" class="btn btn-primary btn-lg btn-block" id="place-order-btn" style="margin-top:24px">Buat Pesanan</button>
        </form>
      </div>

      <aside class="summary-card">
        <h3>Ringkasan Pesanan</h3>
        <div class="order-summary-items" id="summary-items"></div>
        <div class="summary-line"><span>Subtotal</span><span>${formatIDR(subtotal)}</span></div>
        <div class="summary-line"><span>Ongkir</span><span>${shipping === 0 ? 'Gratis' : formatIDR(shipping)}</span></div>
        <div class="summary-line total"><span>Total</span><span>${formatIDR(total)}</span></div>
      </aside>
    </div>`

  // Summary items
  document.getElementById('summary-items').innerHTML = items.map((i) => `
    <div class="summary-item">
      <img src="${i.book.cover}" alt="${i.book.title} cover" />
      <div>
        <div class="si-title">${i.book.title}</div>
        <div class="si-meta">${formatIDR(i.book.price)} × ${i.quantity}</div>
      </div>
      <div class="si-price">${formatIDR(i.book.price * i.quantity)}</div>
    </div>`).join('')

  // Payment option visual selection
  document.querySelectorAll('.payment-option').forEach((opt) => {
    const radio = opt.querySelector('input[type="radio"]')
    radio.addEventListener('change', () => {
      document.querySelectorAll('.payment-option').forEach((o) => o.classList.remove('selected'))
      opt.classList.add('selected')
    })
  })

  // Form submit
  document.getElementById('checkout-form').addEventListener('submit', handleSubmit)
}

function showFieldError(name, message) {
  const el = document.querySelector(`[data-error-for="${name}"]`)
  const input = document.getElementById(name)
  if (el) {
    el.textContent = message
    el.classList.add('show')
  }
  if (input) input.classList.add('error')
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach((el) => el.classList.remove('show'))
  document.querySelectorAll('.form-control').forEach((el) => el.classList.remove('error'))
  const alert = document.getElementById('form-alert')
  if (alert) { alert.hidden = true; alert.textContent = '' }
}

function handleSubmit(e) {
  e.preventDefault()
  clearErrors()
  const form = e.target
  const data = {
    full_name: form.full_name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address1: form.address1.value.trim(),
    address2: form.address2.value.trim(),
    city: form.city.value.trim(),
    state: form.state.value.trim(),
    postal_code: form.postal_code.value.trim(),
  }
  const payment = form.payment.value

  let valid = true
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!data.full_name) { showFieldError('full_name', 'Silakan masukkan nama lengkap Anda.'); valid = false }
  if (!data.email) { showFieldError('email', 'Silakan masukkan email Anda.'); valid = false }
  else if (!emailRe.test(data.email)) { showFieldError('email', 'Silakan masukkan alamat email yang valid.'); valid = false }
  if (!data.phone) { showFieldError('phone', 'Silakan masukkan nomor telepon Anda.'); valid = false }
  if (!data.address1) { showFieldError('address1', 'Silakan masukkan alamat jalan Anda.'); valid = false }
  if (!data.city) { showFieldError('city', 'Silakan masukkan kota Anda.'); valid = false }
  if (!data.state) { showFieldError('state', 'Silakan masukkan provinsi Anda.'); valid = false }
  if (!data.postal_code) { showFieldError('postal_code', 'Silakan masukkan kode pos Anda.'); valid = false }
  if (!payment) { showFieldError('payment', 'Silakan pilih metode pembayaran.'); valid = false }

  if (!valid) {
    const alert = document.getElementById('form-alert')
    alert.textContent = 'Silakan perbaiki kolom yang ditandai dan coba lagi.'
    alert.hidden = false
    return
  }

  // Revalidate cart stock before placing the order
  const items = getCartWithBooks()
  const stockIssue = items.find((i) => i.quantity > i.book.stock)
  if (stockIssue) {
    const alert = document.getElementById('form-alert')
    alert.textContent = `"${stockIssue.book.title}" hanya tersisa ${stockIssue.book.stock} di stok. Silakan sesuaikan keranjang Anda.`
    alert.hidden = false
    notify('Masalah stok terdeteksi. Silakan periksa keranjang Anda.', 'error')
    return
  }

  // Build a prototype order
  const subtotal = getCartSubtotal()
  const shipping = subtotal >= 200000 ? 0 : 15000
  const total = subtotal + shipping
  const orderId = 'BH-' + Date.now().toString().slice(-8)
  const order = {
    id: orderId,
    date: new Date().toISOString(),
    status: 'pending',
    items: items.map((i) => ({
      bookId: i.bookId,
      title: i.book.title,
      author: i.book.author,
      price: i.book.price,
      quantity: i.quantity,
      cover: i.book.cover,
    })),
    subtotal, shipping, total,
    payment_method: payment,
    shipping_info: data,
  }

  saveOrder(order)
  setLastOrder(order)
  clearCart()

  notify('Pesanan berhasil dibuat!', 'success')
  setTimeout(() => {
    window.location.href = `checkout.html?confirmed=1`
  }, 500)
}

// Confirmation view
const params = new URLSearchParams(window.location.search)
if (params.get('confirmed') === '1') {
  renderConfirmation()
} else {
  render()
}

function renderConfirmation() {
  // import lazily to keep main flow light
  import('./common.js').then(({ getLastOrder, clearLastOrder }) => {
    const order = getLastOrder()
    if (!order) {
      root.innerHTML = `
        <div class="empty-state" style="margin:48px 0 80px">
          <div class="emoji">&#128269;</div>
          <h3>Pesanan tidak ditemukan</h3>
          <p>Kami tidak menemukan pesanan terbaru untuk dikonfirmasi. Jelajahi katalog untuk membuat pesanan.</p>
          <a href="books.html" class="btn btn-primary" style="margin-top:16px">Jelajahi Buku</a>
        </div>`
      return
    }
    document.title = 'Pesanan Dikonfirmasi — BookHub'
    root.innerHTML = `
      <div class="confirm-hero">
        <div class="confirm-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1>Terima kasih atas pesanan Anda!</h1>
        <p>Pesanan prototipe <strong>${order.id}</strong> telah dibuat. Karena ini adalah prototipe, tidak ada pembayaran sungguhan yang diproses dan tidak ada pesanan yang disimpan ke database sungguhan.</p>
      </div>
      <div class="confirm-card form-card">
        <h3>Detail Pesanan</h3>
        <div class="order-items-mini">
          ${order.items.map((i) => `
            <div class="order-item-mini">
              <span class="title">${i.title} <span class="qty">× ${i.quantity}</span></span>
              <span>${formatIDR(i.price * i.quantity)}</span>
            </div>`).join('')}
        </div>
        <div class="summary-line"><span>Subtotal</span><span>${formatIDR(order.subtotal)}</span></div>
        <div class="summary-line"><span>Ongkir</span><span>${order.shipping === 0 ? 'Gratis' : formatIDR(order.shipping)}</span></div>
        <div class="summary-line total"><span>Total</span><span>${formatIDR(order.total)}</span></div>
        <div class="summary-line" style="margin-top:14px"><span>Pembayaran</span><span>${paymentLabel(order.payment_method)}</span></div>
        <div class="summary-line"><span>Dikirim ke</span><span>${order.shipping_info.full_name}, ${order.shipping_info.city}</span></div>
        <div style="display:flex;gap:12px;margin-top:22px;flex-wrap:wrap">
          <a href="orders.html" class="btn btn-primary">Lihat Pesanan Saya</a>
          <a href="books.html" class="btn btn-ghost">Lanjutkan Belanja</a>
        </div>
      </div>`
    clearLastOrder()
  })
}

function paymentLabel(method) {
  switch (method) {
    case 'card_test': return 'Kartu Tes'
    case 'cod': return 'Bayar di Tempat'
    case 'bank': return 'Transfer Bank'
    default: return method
  }
}

document.addEventListener('cart:changed', () => {
  if (!new URLSearchParams(window.location.search).get('confirmed')) render()
})
