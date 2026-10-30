import {
  renderHeader, renderFooter, notify, getCurrentUser, setCurrentUser,
} from './common.js'

renderHeader()
renderFooter()

// If already logged in, send to home
if (getCurrentUser()) {
  window.location.href = 'index.html'
}

// Password show/hide toggles
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

const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')

function clearErrors(form) {
  form.querySelectorAll('.field-error').forEach((el) => el.classList.remove('show'))
  form.querySelectorAll('.form-control').forEach((el) => el.classList.remove('error'))
  const alert = form.querySelector('#form-alert')
  if (alert) { alert.hidden = true; alert.textContent = '' }
}

function showFieldError(form, name, message) {
  const el = form.querySelector(`[data-error-for="${name}"]`)
  const input = form.querySelector(`#${name}`)
  if (el) { el.textContent = message; el.classList.add('show') }
  if (input) input.classList.add('error')
}

function showAlert(form, message) {
  const alert = form.querySelector('#form-alert')
  if (alert) { alert.textContent = message; alert.hidden = false }
}

/* ---------- Login ---------- */
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    clearErrors(loginForm)
    const email = loginForm.email.value.trim()
    const password = loginForm.password.value

    let valid = true
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) { showFieldError(loginForm, 'email', 'Silakan masukkan email Anda.'); valid = false }
    else if (!emailRe.test(email)) { showFieldError(loginForm, 'email', 'Silakan masukkan email yang valid.'); valid = false }
    if (!password) { showFieldError(loginForm, 'password', 'Silakan masukkan kata sandi Anda.'); valid = false }

    if (!valid) return

    // Prototype login: accept any non-empty credentials and mark as signed in
    const name = email.split('@')[0]
    setCurrentUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email })
    notify('Berhasil masuk (prototipe).', 'success')
    setTimeout(() => (window.location.href = 'index.html'), 600)
  })
}

/* ---------- Register ---------- */
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    clearErrors(registerForm)
    const name = registerForm.name.value.trim()
    const email = registerForm.email.value.trim()
    const password = registerForm.password.value
    const confirm = registerForm.confirm.value

    let valid = true
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!name) { showFieldError(registerForm, 'name', 'Silakan masukkan nama lengkap Anda.'); valid = false }
    if (!email) { showFieldError(registerForm, 'email', 'Silakan masukkan email Anda.'); valid = false }
    else if (!emailRe.test(email)) { showFieldError(registerForm, 'email', 'Silakan masukkan email yang valid.'); valid = false }
    if (!password) { showFieldError(registerForm, 'password', 'Silakan masukkan kata sandi.'); valid = false }
    else if (password.length < 6) { showFieldError(registerForm, 'password', 'Kata sandi harus minimal 6 karakter.'); valid = false }
    if (!confirm) { showFieldError(registerForm, 'confirm', 'Silakan konfirmasi kata sandi Anda.'); valid = false }
    else if (confirm !== password) { showFieldError(registerForm, 'confirm', 'Kata sandi tidak cocok.'); valid = false }

    if (!valid) {
      showAlert(registerForm, 'Silakan perbaiki kolom yang ditandai dan coba lagi.')
      return
    }

    // Prototype registration: mark as signed in (no real account is created)
    setCurrentUser({ name, email })
    notify('Akun dibuat (prototipe). Anda sekarang masuk.', 'success')
    setTimeout(() => (window.location.href = 'index.html'), 700)
  })
}
