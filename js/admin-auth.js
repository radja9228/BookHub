import { notify, getCurrentUser, setCurrentUser, ADMIN_CREDENTIALS } from './common.js'

const existingUser = getCurrentUser()
if (existingUser) {
  window.location.replace(existingUser.role === 'admin' ? 'admin.html' : 'index.html')
}

document.querySelectorAll('[data-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-toggle')
    const input = document.getElementById(id)
    if (!input) return
    const isPw = input.type === 'password'
    input.type = isPw ? 'text' : 'password'
    btn.textContent = isPw ? 'Sembunyikan' : 'Tampilkan'
  })
})

const loginForm = document.getElementById('admin-login-form')
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    setCurrentUser({ name: 'Admin BookHub', email: ADMIN_CREDENTIALS.email, role: 'admin' })
    notify('Berhasil masuk sebagai Admin.', 'success')
    setTimeout(() => (window.location.href = 'admin.html'), 500)
  })
}
