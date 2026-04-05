// Portal i18n module
const LOCALES = { 'zh-CN': '中文', 'en': 'English', 'ja': '日本語' }
const DEFAULT = 'zh-CN'
let _messages = {}
let _locale = DEFAULT

// Load translations
async function loadLocale(locale) {
  try {
    const resp = await fetch(`/i18n/${locale}.json`)
    _messages = await resp.json()
    _locale = locale
    localStorage.setItem('portal-locale', locale)
    applyTranslations()
  } catch (e) { console.warn('Failed to load locale:', locale, e) }
}

function t(key) {
  return key.split('.').reduce((o, k) => o?.[k], _messages) || key
}

function applyTranslations() {
  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n
    const val = t(key)
    if (val !== key) el.textContent = val
  })
  // Translate elements with data-i18n-html (allows HTML content)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml
    const val = t(key)
    if (val !== key) el.innerHTML = val
  })
  // Translate attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle)
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder)
  })
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria))
  })
  // Update html lang
  document.documentElement.lang = _locale
  // Update active language button
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === _locale)
  })
}

// Initialize
const saved = localStorage.getItem('portal-locale')
const browserLang = navigator.language?.startsWith('ja') ? 'ja' : navigator.language?.startsWith('en') ? 'en' : 'zh-CN'
const initial = (saved && LOCALES[saved]) ? saved : (LOCALES[browserLang] ? browserLang : DEFAULT)
loadLocale(initial)

// Export for language switcher
window.switchLocale = function(locale) { if (LOCALES[locale]) loadLocale(locale) }
