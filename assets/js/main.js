/* ============================================================
   NÄHSERVICE JOLANTA — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Hero Video / Animation ─────────────────────────────── */
  const videoStage  = document.getElementById('hero-video-stage');
  const heroVideo   = document.getElementById('hero-video');
  const heroContent = document.getElementById('hero-content');
  const navLogo     = document.querySelector('.nav-logo');

  function showHeroContent() {
    if (videoStage) {
      videoStage.classList.add('hidden');
    }
    if (heroContent) {
      heroContent.classList.add('visible');
    }
    if (navLogo) {
      setTimeout(() => navLogo.classList.add('visible'), 600);
    }
  }

  if (heroVideo) {
    heroVideo.addEventListener('ended', function () {
      setTimeout(showHeroContent, 300);
    });

    heroVideo.addEventListener('error', showHeroContent);

    // Fallback: if video hasn't started playing within 3s, show content
    setTimeout(() => {
      if (heroContent && !heroContent.classList.contains('visible')) {
        showHeroContent();
      }
    }, 3000);

    // Try to play; if autoplay is blocked, show content directly
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        showHeroContent();
      });
    }
  } else {
    // No video — show content immediately
    if (heroContent) {
      setTimeout(() => {
        heroContent.classList.add('visible');
        if (navLogo) setTimeout(() => navLogo.classList.add('visible'), 600);
      }, 200);
    } else if (navLogo) {
      setTimeout(() => navLogo.classList.add('visible'), 400);
    }
  }

  /* ── Sticky Nav ─────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    function updateNav() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ── Mobile Menu ────────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('#mobile-menu a');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  /* ── Scroll Reveal ──────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }

  /* ── Gallery Filter ─────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ── Smooth scroll for nav links ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Cookie Banner ──────────────────────────────────────── */
  const cookieBanner  = document.getElementById('cookie-banner');
  const cookieAccept  = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  const COOKIE_KEY = 'nj_cookie_consent';

  function hideBanner() {
    if (cookieBanner) {
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.remove(), 600);
    }
  }

  if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => cookieBanner.classList.add('visible'), 2000);

    if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        hideBanner();
      });
    }
    if (cookieDecline) {
      cookieDecline.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'declined');
        hideBanner();
      });
    }
  } else if (cookieBanner) {
    cookieBanner.remove();
  }

  /* ── WhatsApp deep link helper ──────────────────────────── */
  const WA_NUMBER = '4915510390846';

  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const msg = encodeURIComponent(this.dataset.whatsapp || 'Guten Tag, ich möchte gerne einen Termin vereinbaren.');
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
    });
  });

})();
