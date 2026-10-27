import {
  renderHeader, renderFooter, formatIDR, getCartWithBooks, setCartQuantity,
  removeFromCart, getCartSubtotal, notify,
} from './common.js'

renderHeader()
renderFooter()

const root = document.getElementById('cart-root')

function render() {
  const items = getCartWithBooks()
  if (items.length === 0) {
    root.innerHTML = `
      <div class="empty-state" style="margin:48px 0 80px">
        <div class="emoji">&#128722;</div>
        <h3>Your cart is empty</h3>
        <p>You haven't added any books yet. Browse the catalog and find your next favorite read.</p>
        <a href="books.html" class="btn btn-primary" style="margin-top:16px">Browse Books</a>
      </div>`
    return
  }

  const subtotal = getCartSubtotal()
  const shipping = subtotal >= 200000 ? 0 : 15000
  const total = subtotal + shipping

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items" id="cart-items"></div>
      <aside class="summary-card">
        <h3>Order Summary</h3>
        <div class="summary-line"><span>Subtotal</span><span>${formatIDR(subtotal)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatIDR(shipping)}</span></div>
        <div class="summary-line total"><span>Total</span><span>${formatIDR(total)}</span></div>
        <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
        <a href="books.html" class="btn btn-ghost btn-block" style="margin-top:10px">Continue Shopping</a>
        ${shipping > 0 ? `<p class="form-hint text-center">Add ${formatIDR(200000 - subtotal)} more for free shipping.</p>` : ''}
      </aside>
    </div>`

  const itemsHost = document.getElementById('cart-items')
  itemsHost.innerHTML = items.map((item) => cartRowHTML(item)).join('')

  itemsHost.querySelectorAll('[data-qty-minus]').forEach((btn) => {
    btn.addEventListener('click', () => updateQty(itemBookId(btn), -1))
  })
  itemsHost.querySelectorAll('[data-qty-plus]').forEach((btn) => {
    btn.addEventListener('click', () => updateQty(itemBookId(btn), 1))
  })
  itemsHost.querySelectorAll('[data-qty-input]').forEach((input) => {
    input.addEventListener('change', () => {
      const id = Number(input.getAttribute('data-qty-input'))
      const v = parseInt(input.value, 10)
      if (isNaN(v) || v < 1) { render(); return }
      const res = setCartQuantity(id, v)
      if (!res.ok) notify(res.message, 'error')
      render()
    })
  })
  itemsHost.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-remove'))
      removeFromCart(id)
      notify('Item removed from cart.', 'success')
      render()
    })
  })
}

function cartRowHTML(item) {
  const { book, quantity } = item
  const lineTotal = book.price * quantity
  return `
    <div class="cart-row">
      <a href="book-details.html?id=${book.id}"><img src="${book.cover}" alt="${book.title} cover" /></a>
      <div class="title">
        <a href="book-details.html?id=${book.id}">${book.title}</a>
        <div class="author">by ${book.author}</div>
        <div class="unit-price">${formatIDR(book.price)} each</div>
      </div>
      <div class="qty-control">
        <button data-qty-minus="${book.id}" ${quantity <= 1 ? 'disabled' : ''} aria-label="Decrease quantity">&minus;</button>
        <input type="number" data-qty-input="${book.id}" value="${quantity}" min="1" max="${book.stock}" />
        <button data-qty-plus="${book.id}" ${quantity >= book.stock ? 'disabled' : ''} aria-label="Increase quantity">+</button>
      </div>
      <div class="line-total">${formatIDR(lineTotal)}</div>
      <button class="remove-btn" data-remove="${book.id}" aria-label="Remove ${book.title}">Remove</button>
    </div>`
}

function itemBookId(btn) {
  return Number(btn.getAttribute('data-qty-minus') || btn.getAttribute('data-qty-plus'))
}

function updateQty(id, delta) {
  const items = getCartWithBooks()
  const item = items.find((i) => i.bookId === id)
  if (!item) return
  const newQty = item.quantity + delta
  const res = setCartQuantity(id, newQty)
  if (!res.ok) notify(res.message, 'error')
  render()
}

document.addEventListener('cart:changed', render)
render()
