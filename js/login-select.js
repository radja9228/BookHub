import { getCurrentUser } from './common.js'

const existingUser = getCurrentUser()
if (existingUser) {
  window.location.replace(existingUser.role === 'admin' ? 'admin.html' : 'index.html')
}
