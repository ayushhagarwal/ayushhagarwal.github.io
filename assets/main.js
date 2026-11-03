/**
 * AYUSH AGARWAL — Portfolio v2
 * Vanilla JS only. No jQuery. No frameworks.
 *
 * All sections are written directly in index.html so crawlers and
 * no-JS visitors see the full page; this script only adds interactivity.
 */

'use strict';

/* ──────────────────────────────────────────
   1. MOBILE NAVIGATION
   ────────────────────────────────────────── */
function initNav() {
  const burger = document.getElementById('navBurger');
  const links  = document.getElementById('navLinks');
  const header = document.getElementById('header');
  if (!burger || !links) return;

  const open   = () => { links.classList.add('is-open');    burger.classList.add('is-open');    burger.setAttribute('aria-expanded', 'true');  };
  const close  = () => { links.classList.remove('is-open'); burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  const toggle = () => links.classList.contains('is-open') ? close() : open();

  burger.addEventListener('click', toggle);
  links.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', e => { if (header && !header.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ──────────────────────────────────────────
   1.1 DARK MODE TOGGLE
   ────────────────────────────────────────── */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Get saved theme or default to light
  const getTheme = () => localStorage.getItem('theme') || 'light';
  
  // Apply theme to document
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0a0e1a' : '#f8f9fa');
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const current = getTheme();
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
  };

  // Apply saved theme on load
  applyTheme(getTheme());

  // Listen for toggle clicks
  toggle.addEventListener('click', toggleTheme);
}

/* ──────────────────────────────────────────
   2. HEADER SCROLL SHADOW
   ────────────────────────────────────────── */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handler = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* ──────────────────────────────────────────
   3. ACTIVE NAV LINK (scroll-spy)
   ────────────────────────────────────────── */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  const sections = document.querySelectorAll('main section[id]');
  if (!sections.length) return;

  const activate = () => {
    let current = '';
    const scrollMid = window.scrollY + window.innerHeight / 3;
    sections.forEach(sec => { if (sec.offsetTop <= scrollMid) current = sec.id; });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.slice(1);
      link.classList.toggle('is-active', href === current);
    });
  };

  window.addEventListener('scroll', activate, { passive: true });
  activate();
}

/* ──────────────────────────────────────────
   4. SCROLL REVEAL (IntersectionObserver)
   ────────────────────────────────────────── */
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────
   5. SMOOTH SCROLL for anchor links
   ────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHStr = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
      const navH = parseInt(navHStr) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────
   6. BUTTON / CARD RIPPLE EFFECT
   ────────────────────────────────────────── */
function initRipple() {
  const style = document.createElement('style');
  style.textContent = `
    .ripple-wave {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      transform: scale(0);
      animation: _ripple 520ms linear forwards;
      pointer-events: none;
      z-index: 0;
    }
    @keyframes _ripple { to { transform: scale(4); opacity: 0; } }
  `;
  document.head.appendChild(style);

  const createRipple = (e) => {
    const el   = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
    el.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  };

  document.querySelectorAll('.btn, .contact-card').forEach(el => {
    el.addEventListener('click', createRipple);
  });
}

/* ──────────────────────────────────────────
   7. PROJECT FILTER TABS
   ────────────────────────────────────────── */
function initProjectTabs() {
  const tabs = document.querySelectorAll('.project-tab');
  const projects = document.querySelectorAll('.project-card');
  if (!tabs.length || !projects.length) return;

  const filterProjects = (filterValue) => {
    projects.forEach(card => {
      const status = card.getAttribute('data-status');
      
      // Show all cards if "all" is selected, otherwise match the status
      if (filterValue === 'all' || status === filterValue) {
        card.classList.remove('is-hidden');
      } else {
        card.classList.add('is-hidden');
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-filter');
      
      // Update active state
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      
      // Filter projects
      filterProjects(filterValue);
    });
  });

  // Initialize with "shipped" filter (default)
  const activeTab = document.querySelector('.project-tab.is-active');
  if (activeTab) {
    const defaultFilter = activeTab.getAttribute('data-filter');
    filterProjects(defaultFilter);
  }
}

/* ──────────────────────────────────────────
   8. CONSOLE EASTER EGG
   ────────────────────────────────────────── */
function consoleEasterEgg() {
  console.log('%cAyush Agarwal — Full-Stack Engineer', 'color:#63b3ed;font-size:18px;font-weight:800;font-family:monospace;');
  console.log('%cDistributed systems · AI workflows · Scalable products', 'color:#94a3b8;font-size:12px;font-family:monospace;');
  console.log('%c→ reachatayush@gmail.com', 'color:#34d399;font-size:12px;font-family:monospace;');
}

/* ──────────────────────────────────────────
   BOOT — init everything
   ────────────────────────────────────────── */
function boot() {
  initNav();
  initThemeToggle();
  initHeaderScroll();
  initScrollSpy();
  initReveal();
  initSmoothScroll();
  initRipple();
  initProjectTabs();
  consoleEasterEgg();
}

// Works whether the script runs before or after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
