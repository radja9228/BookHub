import { BOOKS, CATEGORIES } from './books-data.js'
import {
  renderHeader, renderFooter, bookCardHTML, wireCardActions, notify,
} from './common.js'

renderHeader()
renderFooter()

const grid = document.getElementById('book-grid')
const emptyState = document.getElementById('empty-state')
const resultCount = document.getElementById('result-count')
const searchInput = document.getElementById('search-input')
const sortSelect = document.getElementById('sort-select')
const filtersList = document.getElementById('category-filters')
const clearBtn = document.getElementById('clear-filters')
const emptyClear = document.getElementById('empty-clear')

// Read initial category from URL (?category=Fiction)
const params = new URLSearchParams(window.location.search)
let activeCategory = params.get('category') || 'Semua'
let searchQuery = ''
let sortMode = 'default'

function buildFilters() {
  const allCount = BOOKS.length
  const items = [
    `<li><button class="filter-chip ${activeCategory === 'Semua' ? 'active' : ''}" data-cat="Semua">Semua buku <span class="count">${allCount}</span></button></li>`,
    ...CATEGORIES.map((c) => {
      const count = BOOKS.filter((b) => b.category === c.name).length
      return `<li><button class="filter-chip ${activeCategory === c.name ? 'active' : ''}" data-cat="${c.name}">${c.name} <span class="count">${count}</span></button></li>`
    }),
  ]
  filtersList.innerHTML = items.join('')
  filtersList.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat')
      buildFilters()
      render()
    })
  })
}

function applyFilters() {
  let list = BOOKS.slice()

  if (activeCategory !== 'Semua') {
    list = list.filter((b) => b.category === activeCategory)
  }

  const q = searchQuery.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    )
  }

  switch (sortMode) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break
    case 'price-desc': list.sort((a, b) => b.price - a.price); break
    case 'title-asc':  list.sort((a, b) => a.title.localeCompare(b.title)); break
    case 'title-desc': list.sort((a, b) => b.title.localeCompare(a.title)); break
    default: break
  }
  return list
}

function render() {
  const list = applyFilters()
  resultCount.textContent = `${list.length} buku ditemukan`

  if (list.length === 0) {
    grid.classList.add('hidden')
    emptyState.classList.remove('hidden')
  } else {
    grid.classList.remove('hidden')
    emptyState.classList.add('hidden')
    grid.innerHTML = list.map(bookCardHTML).join('')
    wireCardActions()
  }
}

function clearAll() {
  activeCategory = 'Semua'
  searchQuery = ''
  sortMode = 'default'
  searchInput.value = ''
  sortSelect.value = 'default'
  buildFilters()
  render()
}

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value
  render()
})

sortSelect.addEventListener('change', (e) => {
  sortMode = e.target.value
  render()
})

clearBtn.addEventListener('click', clearAll)
emptyClear.addEventListener('click', clearAll)

buildFilters()
render()
