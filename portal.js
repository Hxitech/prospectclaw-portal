/* ========================================
   ProspectClaw Portal — 交互逻辑
   ======================================== */

(function () {
  'use strict'

  /* ── 主题切换 ── */
  const themeToggle = document.getElementById('theme-toggle')
  const themeIcon = themeToggle?.querySelector('.theme-icon')

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portal-theme', theme)
    if (themeIcon) themeIcon.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;'
  }

  const saved = localStorage.getItem('portal-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(saved || (prefersDark ? 'dark' : 'light'))

  themeToggle?.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme')
    applyTheme(current === 'dark' ? 'light' : 'dark')
  })

  /* ── 移动端菜单 ── */
  const hamburger = document.getElementById('hamburger')
  const mobileMenu = document.getElementById('mobile-menu')

  hamburger?.addEventListener('click', function () {
    mobileMenu?.classList.toggle('open')
  })

  mobileMenu?.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      mobileMenu.classList.remove('open')
    }
  })

  /* ── 滚动渐显动画 ── */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el)
  })

  /* ── 计数器动画 ── */
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        const el = entry.target
        const target = parseInt(el.dataset.count, 10)
        if (isNaN(target)) return
        counterObserver.unobserve(el)

        let current = 0
        const step = Math.max(1, Math.ceil(target / 30))
        const interval = setInterval(function () {
          current += step
          if (current >= target) {
            current = target
            clearInterval(interval)
          }
          el.textContent = current + '+'
        }, 40)
      })
    },
    { threshold: 0.5 }
  )

  document.querySelectorAll('[data-count]').forEach(function (el) {
    counterObserver.observe(el)
  })

  /* ── 灯箱 ── */
  const lightbox = document.getElementById('lightbox')
  const lightboxImg = lightbox?.querySelector('img')

  document.querySelectorAll('[data-lightbox]').forEach(function (el) {
    el.addEventListener('click', function () {
      const img = el.querySelector('img')
      if (!img || !lightbox || !lightboxImg) return
      lightboxImg.src = img.src
      lightboxImg.alt = img.alt
      lightbox.classList.add('open')
    })
  })

  lightbox?.addEventListener('click', function () {
    lightbox.classList.remove('open')
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      lightbox.classList.remove('open')
    }
  })

  /* ── 导航栏锚点平滑滚动 ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
})()
