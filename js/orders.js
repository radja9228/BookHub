import {
  renderHeader, renderFooter, formatIDR, getOrders,
} from './common.js'

renderHeader()
renderFooter()

const root = document.getElementById('orders-root')
const orders = getOrders()

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered']
const STATUS_LABELS = {
  pending: 'Menunggu',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
}

// Derive a timeline for an order. Prototype logic: newer orders are earlier
// in the flow. The first step is always done; the current status is highlighted.
function timelineFor(order) {
  const idx = STATUS_FLOW.indexOf(order.status)
  const currentIdx = idx < 0 ? 0 : idx
  return STATUS_FLOW.map((s, i) => ({
    key: s,
    label: STATUS_LABELS[s],
    state: i < currentIdx ? 'done' : i === currentIdx ? 'current' : '',
  }))
}

if (orders.length === 0) {
  root.innerHTML = `
    <div class="empty-state" style="margin:48px 0 80px">
      <div class="emoji">&#128230;</div>
      <h3>Belum ada pesanan</h3>
      <p>Saat Anda membuat pesanan, pesanan akan muncul di sini agar Anda dapat melacak statusnya.</p>
      <a href="books.html" class="btn btn-primary" style="margin-top:16px">Jelajahi Buku</a>
    </div>
    <div class="prototype-note" style="max-width:640px;margin:0 auto 64px">
      <span>&#128193;</span>
      <div><strong>Riwayat pesanan prototipe</strong>Pesanan yang ditampilkan di sini hanya disimpan di perangkat ini menggunakan localStorage. Belum ada database backend sungguhan yang terhubung, dan data pesanan pelanggan lain tidak pernah ditampilkan.</div>
    </div>`
} else {
  root.innerHTML = `
    <div class="prototype-note" style="margin:24px 0">
      <span>&#128193;</span>
      <div><strong>Riwayat pesanan prototipe</strong>Pesanan ini hanya disimpan di perangkat ini (localStorage) untuk prototipe. Belum ada database backend sungguhan yang terhubung, dan Anda hanya akan melihat pesanan Anda sendiri.</div>
    </div>
    <div class="order-list" id="order-list"></div>`

  const list = document.getElementById('order-list')
  list.innerHTML = orders.map(orderCardHTML).join('')
}

function orderCardHTML(order) {
  const date = new Date(order.date)
  const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const steps = timelineFor(order)

  return `
    <div class="order-card">
      <div class="order-card-head">
        <div>
          <div class="oid">Pesanan ${order.id}</div>
          <div class="odate">Dibuat ${dateStr} pukul ${timeStr}</div>
        </div>
        <span class="status-pill ${order.status}">${STATUS_LABELS[order.status]}</span>
      </div>
      <div class="order-card-body">
        <div class="order-items-mini">
          ${order.items.map((i) => `
            <div class="order-item-mini">
              <span class="title">${i.title} <span class="qty">× ${i.quantity}</span></span>
              <span>${formatIDR(i.price * i.quantity)}</span>
            </div>`).join('')}
        </div>
        <div class="order-total-row">
          <span>Total (${order.items.reduce((s, i) => s + i.quantity, 0)} item)</span>
          <span>${formatIDR(order.total)}</span>
        </div>

        <div class="tracking">
          ${steps.map((s) => `
            <div class="tracking-step ${s.state}">
              <div class="tracking-dot">${s.state === 'done' ? '&#10003;' : ''}</div>
              <div class="tracking-label">${s.label}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`
}
