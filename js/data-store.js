// localStorage-backed data store for BookHub.
// Provides CRUD operations for books, categories, orders, and customers.
// Seeds from books-data.js on first load so tables are never empty.

import { CATEGORIES as SEED_CATEGORIES, BOOKS as SEED_BOOKS } from './books-data-seed.js'

const BOOKS_KEY = 'bookhub_books'
const CATEGORIES_KEY = 'bookhub_categories'
const ORDERS_KEY = 'bookhub_admin_orders'
const CUSTOMERS_KEY = 'bookhub_customers'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

/* ---------- Books ---------- */

export function getBooks() {
  const books = read(BOOKS_KEY, null)
  if (!books) {
    write(BOOKS_KEY, SEED_BOOKS)
    return SEED_BOOKS.slice()
  }
  return books
}

export function getBookById(id) {
  const numId = Number(id)
  return getBooks().find((b) => b.id === numId) || null
}

export function saveBook(book) {
  const books = getBooks()
  if (book.id) {
    const idx = books.findIndex((b) => b.id === book.id)
    if (idx >= 0) books[idx] = { ...books[idx], ...book }
    else books.push(book)
  } else {
    book.id = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1
    books.push(book)
  }
  write(BOOKS_KEY, books)
  return book
}

export function deleteBook(id) {
  const books = getBooks().filter((b) => b.id !== id)
  write(BOOKS_KEY, books)
}

export function updateBookStock(id, stock) {
  const books = getBooks()
  const book = books.find((b) => b.id === id)
  if (book) {
    book.stock = Math.max(0, stock)
    write(BOOKS_KEY, books)
  }
}

/* ---------- Categories ---------- */

export function getCategories() {
  const cats = read(CATEGORIES_KEY, null)
  if (!cats) {
    write(CATEGORIES_KEY, SEED_CATEGORIES)
    return SEED_CATEGORIES.slice()
  }
  return cats
}

export function saveCategory(category) {
  const cats = getCategories()
  if (category.id) {
    const idx = cats.findIndex((c) => c.id === category.id)
    if (idx >= 0) cats[idx] = { ...cats[idx], ...category }
    else cats.push(category)
  } else {
    category.id = cats.length ? Math.max(...cats.map((c) => c.id || 0)) + 1 : 1
    category.slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
    cats.push(category)
  }
  write(CATEGORIES_KEY, cats)
  return category
}

export function deleteCategory(id) {
  const cats = getCategories().filter((c) => c.id !== id)
  write(CATEGORIES_KEY, cats)
}

/* ---------- Orders ---------- */

const SEED_ORDERS = [
  { id: 'BH-884291', customer: 'Alya Putri', email: 'alya.putri@email.com', initials: 'AP', date: '14 Okt 2026', total: 357000, status: 'completed', items: [{ title: 'The Silent Tide', quantity: 1, price: 145000 }, { title: 'Crown of Embers', quantity: 1, price: 189000 }] },
  { id: 'BH-884290', customer: 'Bima Santoso', email: 'bima.santoso@email.com', initials: 'BS', date: '14 Okt 2026', total: 189000, status: 'processing', items: [{ title: 'Crown of Embers', quantity: 1, price: 189000 }] },
  { id: 'BH-884289', customer: 'Citra Lestari', email: 'citra.lestari@email.com', initials: 'CL', date: '13 Okt 2026', total: 423000, status: 'pending', items: [{ title: 'The Lantern Garden', quantity: 1, price: 132000 }, { title: 'The Quiet Habit', quantity: 3, price: 98000 }] },
  { id: 'BH-884288', customer: 'Dimas Pratama', email: 'dimas.pratama@email.com', initials: 'DP', date: '13 Okt 2026', total: 98000, status: 'cancelled', items: [{ title: 'The Quiet Habit', quantity: 1, price: 98000 }] },
  { id: 'BH-884287', customer: 'Nadia Rahma', email: 'nadia.rahma@email.com', initials: 'NR', date: '12 Okt 2026', total: 265000, status: 'completed', items: [{ title: 'Echoes of the Forgotten', quantity: 1, price: 155000 }, { title: 'A Field of Blue', quantity: 1, price: 128000 }] },
]

export function getAdminOrders() {
  const orders = read(ORDERS_KEY, null)
  if (!orders) {
    write(ORDERS_KEY, SEED_ORDERS)
    return SEED_ORDERS.slice()
  }
  return orders
}

export function updateOrderStatus(id, status) {
  const orders = getAdminOrders()
  const order = orders.find((o) => o.id === id)
  if (order) {
    order.status = status
    write(ORDERS_KEY, orders)
  }
}

export function deleteOrder(id) {
  const orders = getAdminOrders().filter((o) => o.id !== id)
  write(ORDERS_KEY, orders)
}

/* ---------- Customers ---------- */

const SEED_CUSTOMERS = [
  { id: 1, name: 'Alya Putri', email: 'alya.putri@email.com', phone: '+62 812 3445 9001', joined: '12 Okt 2026', orders: 8 },
  { id: 2, name: 'Bima Santoso', email: 'bima.santoso@email.com', phone: '+62 813 7781 2204', joined: '09 Okt 2026', orders: 5 },
  { id: 3, name: 'Citra Lestari', email: 'citra.lestari@email.com', phone: '+62 821 5542 1860', joined: '02 Okt 2026', orders: 12 },
  { id: 4, name: 'Dimas Pratama', email: 'dimas.pratama@email.com', phone: '+62 852 6634 7712', joined: '28 Sep 2026', orders: 3 },
  { id: 5, name: 'Nadia Rahma', email: 'nadia.rahma@email.com', phone: '+62 856 9021 4388', joined: '25 Sep 2026', orders: 7 },
]

export function getCustomers() {
  const customers = read(CUSTOMERS_KEY, null)
  if (!customers) {
    write(CUSTOMERS_KEY, SEED_CUSTOMERS)
    return SEED_CUSTOMERS.slice()
  }
  return customers
}

export function saveCustomer(customer) {
  const customers = getCustomers()
  if (customer.id) {
    const idx = customers.findIndex((c) => c.id === customer.id)
    if (idx >= 0) customers[idx] = { ...customers[idx], ...customer }
    else customers.push(customer)
  } else {
    customer.id = customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1
    customer.joined = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    customer.orders = 0
    customers.push(customer)
  }
  write(CUSTOMERS_KEY, customers)
  return customer
}

export function deleteCustomer(id) {
  const customers = getCustomers().filter((c) => c.id !== id)
  write(CUSTOMERS_KEY, customers)
}
