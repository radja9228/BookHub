import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        books: resolve(__dirname, 'books.html'),
        details: resolve(__dirname, 'book-details.html'),
        cart: resolve(__dirname, 'cart.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        login: resolve(__dirname, 'login.html'),
        loginSelect: resolve(__dirname, 'login-select.html'),
        adminLogin: resolve(__dirname, 'admin-login.html'),
        register: resolve(__dirname, 'register.html'),
        orders: resolve(__dirname, 'orders.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
