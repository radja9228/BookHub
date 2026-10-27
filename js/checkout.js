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
        <h3>Your cart is empty</h3>
        <p>Add some books to your cart before checking out.</p>
        <a href="books.html" class="btn btn-primary" style="margin-top:16px">Browse Books</a>
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
          <div><strong>Prototype checkout</strong>This checkout does not process real payments and does not save to a real database. No payment provider is connected. Use it to preview the order flow.</div>
        </div>

        ${user ? '' : `<div class="alert alert-info">You are checking out as a guest. <a href="login.html" style="font-weight:600">Log in</a> to save your details for next time.</div>`}

        <form id="checkout-form" novalidate>
          <h3 style="margin-bottom:18px">Shipping Information</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="full_name">Full name *</label>
              <input class="form-control" id="full_name" name="full_name" type="text" value="${user ? user.name : ''}" required />
              <div class="field-error" data-error-for="full_name"></div>
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input class="form-control" id="email" name="email" type="email" value="${user ? user.email : ''}" required />
              <div class="field-error" data-error-for="email"></div>
            </div>
            <div class="form-group">
              <label for="phone">Phone number *</label>
              <input class="form-control" id="phone" name="phone" type="tel" required />
              <div class="field-error" data-error-for="phone"></div>
            </div>
            <div class="form-group">
              <label for="postal_code">Postal code *</label>
              <input class="form-control" id="postal_code" name="postal_code" type="text" required />
              <div class="field-error" data-error-for="postal_code"></div>
            </div>
          </div>
          <div class="form-group">
            <label for="address1">Street address *</label>
            <input class="form-control" id="address1" name="address1" type="text" required />
            <div class="field-error" data-error-for="address1"></div>
          </div>
          <div class="form-group">
            <label for="address2">Apartment, suite, etc. (optional)</label>
            <input class="form-control" id="address2" name="address2" type="text" />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label for="city">City *</label>
              <input class="form-control" id="city" name="city" type="text" required />
              <div class="field-error" data-error-for="city"></div>
            </div>
            <div class="form-group">
              <label for="state">Province / State *</label>
              <input class="form-control" id="state" name="state" type="text" required />
              <div class="field-error" data-error-for="state"></div>
            </div>
          </div>

          <h3 style="margin:26px 0 16px">Payment Method</h3>
          <div class="prototype-note" style="margin-bottom:14px">
            <span>&#128179;</span>
            <div><strong>Test payment only</strong>No real card is charged and no payment provider is connected. This is a simulated checkout for preview purposes.</div>
          </div>
          <div class="payment-options" id="payment-options">
            <label class="payment-option selected">
              <input type="radio" name="payment" value="card_test" checked />
              <span class="pm-info"><span class="pm-name">Test Card Payment</span><span class="pm-desc">Simulated card — no real charge</span></span>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="cod" />
              <span class="pm-info"><span class="pm-name">Cash on Delivery</span><span class="pm-desc">Pay with cash when your order arrives</span></span>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="bank" />
              <span class="pm-info"><span class="pm-name">Bank Transfer</span><span class="pm-desc">Manual transfer with order confirmation</span></span>
            </label>
          </div>
          <div class="field-error" data-error-for="payment"></div>

          <div class="alert alert-error" id="form-alert" hidden></div>

          <button type="submit" class="btn btn-primary btn-lg btn-block" id="place-order-btn" style="margin-top:24px">Place Order</button>
        </form>
      </div>

      <aside class="summary-card">
        <h3>Order Summary</h3>
        <div class="order-summary-items" id="summary-items"></div>
        <div class="summary-line"><span>Subtotal</span><span>${formatIDR(subtotal)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatIDR(shipping)}</span></div>
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

  if (!data.full_name) { showFieldError('full_name', 'Please enter your full name.'); valid = false }
  if (!data.email) { showFieldError('email', 'Please enter your email.'); valid = false }
  else if (!emailRe.test(data.email)) { showFieldError('email', 'Please enter a valid email address.'); valid = false }
  if (!data.phone) { showFieldError('phone', 'Please enter your phone number.'); valid = false }
  if (!data.address1) { showFieldError('address1', 'Please enter your street address.'); valid = false }
  if (!data.city) { showFieldError('city', 'Please enter your city.'); valid = false }
  if (!data.state) { showFieldError('state', 'Please enter your province or state.'); valid = false }
  if (!data.postal_code) { showFieldError('postal_code', 'Please enter your postal code.'); valid = false }
  if (!payment) { showFieldError('payment', 'Please choose a payment method.'); valid = false }

  if (!valid) {
    const alert = document.getElementById('form-alert')
    alert.textContent = 'Please fix the highlighted fields and try again.'
    alert.hidden = false
    return
  }

  // Revalidate cart stock before placing the order
  const items = getCartWithBooks()
  const stockIssue = items.find((i) => i.quantity > i.book.stock)
  if (stockIssue) {
    const alert = document.getElementById('form-alert')
    alert.textContent = `"${stockIssue.book.title}" only has ${stockIssue.book.stock} in stock. Please adjust your cart.`
    alert.hidden = false
    notify('Stock issue detected. Please review your cart.', 'error')
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

  notify('Order placed successfully!', 'success')
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
          <h3>No recent order found</h3>
          <p>We couldn't find a recent order to confirm. Browse the catalog to place one.</p>
          <a href="books.html" class="btn btn-primary" style="margin-top:16px">Browse Books</a>
        </div>`
      return
    }
    document.title = 'Order Confirmed — BookHub'
    root.innerHTML = `
      <div class="confirm-hero">
        <div class="confirm-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1>Thank you for your order!</h1>
        <p>Your prototype order <strong>${order.id}</strong> has been placed. Since this is a prototype, no real payment has been processed and no order has been saved to a real database.</p>
      </div>
      <div class="confirm-card form-card">
        <h3>Order Details</h3>
        <div class="order-items-mini">
          ${order.items.map((i) => `
            <div class="order-item-mini">
              <span class="title">${i.title} <span class="qty">× ${i.quantity}</span></span>
              <span>${formatIDR(i.price * i.quantity)}</span>
            </div>`).join('')}
        </div>
        <div class="summary-line"><span>Subtotal</span><span>${formatIDR(order.subtotal)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : formatIDR(order.shipping)}</span></div>
        <div class="summary-line total"><span>Total</span><span>${formatIDR(order.total)}</span></div>
        <div class="summary-line" style="margin-top:14px"><span>Payment</span><span>${paymentLabel(order.payment_method)}</span></div>
        <div class="summary-line"><span>Ship to</span><span>${order.shipping_info.full_name}, ${order.shipping_info.city}</span></div>
        <div style="display:flex;gap:12px;margin-top:22px;flex-wrap:wrap">
          <a href="orders.html" class="btn btn-primary">View My Orders</a>
          <a href="books.html" class="btn btn-ghost">Continue Shopping</a>
        </div>
      </div>`
    clearLastOrder()
  })
}

function paymentLabel(method) {
  switch (method) {
    case 'card_test': return 'Test Card Payment'
    case 'cod': return 'Cash on Delivery'
    case 'bank': return 'Bank Transfer'
    default: return method
  }
}

document.addEventListener('cart:changed', () => {
  if (!new URLSearchParams(window.location.search).get('confirmed')) render()
})
