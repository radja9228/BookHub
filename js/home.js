import { BOOKS, CATEGORIES } from './books-data.js'
import { renderHeader, renderFooter, bookCardHTML, wireCardActions } from './common.js'

renderHeader()
renderFooter()

const featured = BOOKS.filter((b) => b.featured).slice(0, 4)
const bestsellers = BOOKS.filter((b) => b.bestseller).slice(0, 4)

document.getElementById('featured-grid').innerHTML = featured.map(bookCardHTML).join('')
document.getElementById('bestseller-grid').innerHTML = bestsellers.map(bookCardHTML).join('')

const categoryRow = document.getElementById('category-row')
categoryRow.innerHTML = CATEGORIES.map((c) => {
  const count = BOOKS.filter((b) => b.category === c.name).length
  const initials = c.name.slice(0, 2).toUpperCase()
  return `
  <a href="books.html?category=${encodeURIComponent(c.name)}" class="category-card">
    <span class="category-icon">${initials}</span>
    <span>
      <span class="name">${c.name}</span><br />
      <span class="count">${count} book${count === 1 ? '' : 's'}</span>
    </span>
  </a>`
}).join('')

wireCardActions()
