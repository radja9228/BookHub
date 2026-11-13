// Thin wrapper over data-store.js so all customer-facing pages
// automatically read from localStorage. Exports the same interface
// as the original static module: BOOKS, CATEGORIES, getBookById,
// getBooksByCategory, getRelatedBooks, searchBooks, getAllCategories.

import { getBooks, getBookById as storeGetBookById, getCategories } from './data-store.js'

export const BOOKS = getBooks()
export const CATEGORIES = getCategories()

export function getBookById(id) {
  return storeGetBookById(id)
}

export function getBooksByCategory(categoryName) {
  const books = getBooks()
  if (!categoryName || categoryName === 'Semua') return books
  return books.filter((b) => b.category === categoryName)
}

export function getRelatedBooks(book, limit = 4) {
  if (!book) return []
  const books = getBooks()
  return books.filter(
    (b) => b.id !== book.id && b.category === book.category
  ).slice(0, limit)
}

export function searchBooks(query) {
  const q = query.trim().toLowerCase()
  const books = getBooks()
  if (!q) return books
  return books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
  )
}

export function getAllCategories() {
  return getCategories()
}
