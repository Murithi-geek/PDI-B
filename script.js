/* ============================================================
   PDI ACHIEVERS MENTORSHIP ASSOCIATION — JAVASCRIPT
   All interactions, animations, and functionality
   ============================================================ */

(function () {
  'use strict';

  /* ── Utility: throttle ── */
  function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) { last = now; fn.apply(this, args); }
    };
  }

  /* ── Utility: debounce ── */
  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* ─────────────────────────────────────────
     1. PAGE LOAD — Hero entry animations
  ───────────────────────────────────────── */
  function initPageLoad() {
    document.body.classList.add('page-loaded');
  }

  /* ─────────────────────────────────────────
     2. CUSTOM CURSOR (desktop only)
  ───────────────────────────────────────── */
  function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let raf;

    function updateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      raf = requestAnimationFrame(updateFollower);
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1'; follower.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0'; follower.style.opacity = '0';
    });

    document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        follower.style.width = '54px';
        follower.style.height = '54px';
        follower.style.borderColor = 'var(--color-primary)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.width = '34px';
        follower.style.height = '34px';
        follower.style.borderColor = 'rgba(211,47,47,0.5)';
      });
    });

    updateFollower();
  }

  /* ─────────────────────────────────────────
     3. SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', throttle(function () {
      const scrollTop  = document.documentElement.scrollTop;
      const scrollMax  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0;
      bar.style.width = pct + '%';
    }, 16));
  }

  /* ─────────────────────────────────────────
     4. STICKY HEADER
  ───────────────────────────────────────── */
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 60) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    window.addEventListener('scroll', throttle(updateHeader, 16));
    updateHeader();
  }

  /* ─────────────────────────────────────────
     5. NAVIGATION — Mobile hamburger + active links
  ───────────────────────────────────────── */
  function initNavigation() {
    const header    = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');
    const overlay   = document.getElementById('navOverlay');
    if (!navToggle || !navMenu) return;

    let isOpen = false;
    let focusTrap = null;

    function openMenu() {
      isOpen = true;
      navMenu.classList.add('nav__menu--open');
      overlay.classList.add('nav__overlay--active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      overlay.removeAttribute('aria-hidden');
      // Focus first link
      const firstLink = navMenu.querySelector('.nav__link');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      isOpen = false;
      navMenu.classList.remove('nav__menu--open');
      overlay.classList.remove('nav__overlay--active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      overlay.setAttribute('aria-hidden', 'true');
      navToggle.focus();
    }

    navToggle.addEventListener('click', () => isOpen ? closeMenu() : openMenu());
    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    /* Smooth scroll + close menu on nav link click */
    document.querySelectorAll('.nav__link, .footer__link, a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#') || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (isOpen) closeMenu();
        const navH = document.getElementById('header')?.offsetHeight || 72;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', href);
      });
    });

    /* Active nav link on scroll (Intersection Observer) */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[data-section]');

    if (sections.length && navLinks.length) {
      const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(l => {
              l.classList.toggle('nav__link--active', l.dataset.section === id);
            });
          }
        });
      }, { threshold: 0.3, rootMargin: '-72px 0px -30% 0px' });

      sections.forEach(s => sectionObserver.observe(s));
    }
  }

  /* ─────────────────────────────────────────
     6. HERO — Rotating values text
  ───────────────────────────────────────── */
  function initHeroValues() {
    const el = document.getElementById('heroValueText');
    if (!el) return;

    const values = ['Integrity', 'Excellence', 'Consistency', 'Innovation'];
    let idx = 0;

    setInterval(() => {
      el.classList.add('changing');
      setTimeout(() => {
        idx = (idx + 1) % values.length;
        el.textContent = values[idx];
        el.classList.remove('changing');
      }, 400);
    }, 3000);
  }

  /* ─────────────────────────────────────────
     7. INTERSECTION OBSERVER — Scroll animations
  ───────────────────────────────────────── */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('is-visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /* ─────────────────────────────────────────
     8. COUNTER ANIMATION
  ───────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animateCount(el, target) {
      const duration = 1600;
      const start    = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCount(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* ─────────────────────────────────────────
     9. PROGRAMME CARDS — Accordion toggle
  ───────────────────────────────────────── */
  function initProgrammeCards() {
    const cards = document.querySelectorAll('.programme-card');

    cards.forEach(card => {
      const toggle = card.querySelector('.programme-card__toggle');
      const body   = card.querySelector('.programme-card__body');
      if (!toggle || !body) return;

      toggle.addEventListener('click', function () {
        const isOpen = body.classList.contains('programme-card__body--open');

        // Close all others
        cards.forEach(other => {
          if (other !== card) {
            other.querySelector('.programme-card__body')?.classList.remove('programme-card__body--open');
            const otherToggle = other.querySelector('.programme-card__toggle');
            if (otherToggle) {
              otherToggle.setAttribute('aria-expanded', 'false');
              otherToggle.querySelector('span').textContent = 'Learn More';
            }
          }
        });

        if (isOpen) {
          body.classList.remove('programme-card__body--open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.querySelector('span').textContent = 'Learn More';
        } else {
          body.classList.add('programme-card__body--open');
          toggle.setAttribute('aria-expanded', 'true');
          toggle.querySelector('span').textContent = 'Show Less';
        }
      });
    });
  }

  /* ─────────────────────────────────────────
     10. GALLERY LIGHTBOX
  ───────────────────────────────────────── */
  function initLightbox() {
    const galleryItems  = document.querySelectorAll('.gallery__item');
    const lightbox      = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev  = document.getElementById('lightboxPrev');
    const lightboxNext  = document.getElementById('lightboxNext');
    const lightboxOverlay  = document.getElementById('lightboxOverlay');
    const lightboxCounter  = document.getElementById('lightboxCounter');
    if (!lightbox || !galleryItems.length) return;

    const sources = Array.from(galleryItems).map(item => ({
      src: item.dataset.src,
      alt: item.querySelector('img')?.alt || 'Gallery image'
    }));
    let currentIdx = 0;

    function openLightbox(idx) {
      currentIdx = idx;
      updateLightboxImage(idx);
      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
      document.addEventListener('keydown', lightboxKeyHandler);
    }

    function closeLightbox() {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', lightboxKeyHandler);
      galleryItems[currentIdx]?.focus();
    }

    function updateLightboxImage(idx) {
      const { src, alt } = sources[idx];
      lightboxImage.style.opacity = '0';
      lightboxImage.style.transform = 'scale(0.96)';
      setTimeout(() => {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightboxImage.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
      }, 120);
      lightboxCounter.textContent = (idx + 1) + ' / ' + sources.length;
    }

    function showPrev() { currentIdx = (currentIdx - 1 + sources.length) % sources.length; updateLightboxImage(currentIdx); }
    function showNext() { currentIdx = (currentIdx + 1) % sources.length; updateLightboxImage(currentIdx); }

    function lightboxKeyHandler(e) {
      if (e.key === 'Escape')    closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight')showNext();
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    /* Touch swipe */
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend',   e => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) delta < 0 ? showNext() : showPrev();
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     11. CONTACT FORM — Live validation
  ───────────────────────────────────────── */
  function initContactForm() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const submit  = document.getElementById('formSubmit');
    if (!form) return;

    function validate(input) {
      const group = input.closest('.form-group');
      const errorEl = group?.querySelector('.form-error');
      let msg = '';

      if (input.required && !input.value.trim()) {
        msg = 'This field is required.';
      } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        msg = 'Please enter a valid email address.';
      } else if (input.type === 'tel' && input.value && !/^\+?[\d\s\-()]{6,20}$/.test(input.value)) {
        msg = 'Please enter a valid phone number.';
      }

      if (errorEl) errorEl.textContent = msg;
      input.classList.toggle('error', !!msg);
      input.classList.toggle('success', !msg && input.value.trim().length > 0);
      return !msg;
    }

    // Live validation on blur
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => validate(input));
      input.addEventListener('input', debounce(() => {
        if (input.classList.contains('error')) validate(input);
      }, 400));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const inputs = form.querySelectorAll('.form-input');
      let valid = true;
      inputs.forEach(input => { if (!validate(input)) valid = false; });
      if (!valid) {
        form.querySelector('.error')?.focus();
        return;
      }

      // Show loading state
      const btnText = submit.querySelector('.btn-text');
      const original = btnText.textContent;
      btnText.textContent = 'Sending…';
      submit.disabled = true;

      // Simulate submission (replace with real endpoint)
      setTimeout(() => {
        form.style.display = 'none';
        success.removeAttribute('hidden');
        submit.disabled = false;
        btnText.textContent = original;
      }, 1400);
    });
  }

  /* ─────────────────────────────────────────
     12. NEWSLETTER FORM
  ───────────────────────────────────────── */
  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (!input || !input.value.trim()) return;
      const btn = form.querySelector('.newsletter-btn');
      btn.textContent = '✓';
      btn.style.background = '#16a34a';
      input.value = '';
      input.placeholder = 'Thank you for subscribing!';
      setTimeout(() => {
        btn.textContent = '→';
        btn.style.background = '';
        input.placeholder = 'Your email address';
      }, 4000);
    });
  }

  /* ─────────────────────────────────────────
     13. BACK TO TOP
  ───────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', throttle(() => {
      btn.classList.toggle('back-to-top--visible', window.scrollY > 400);
    }, 100));

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─────────────────────────────────────────
     14. LAZY IMAGE SKELETON EFFECT
  ───────────────────────────────────────── */
  function initImageSkeletons() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.style.background = 'linear-gradient(90deg, #f0f0f5 25%, #e8e8ef 50%, #f0f0f5 75%)';
      img.style.backgroundSize = '200% 100%';
      img.addEventListener('load', function () {
        this.style.background = '';
      }, { once: true });
    });
  }

  /* ─────────────────────────────────────────
     15. RIPPLE EFFECT on primary buttons
  ───────────────────────────────────────── */
  function initRippleEffect() {
    document.querySelectorAll('.btn--primary, .btn--hero-primary, .btn--accent').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const rect    = this.getBoundingClientRect();
        const size    = Math.max(rect.width, rect.height) * 2;
        const x       = e.clientX - rect.left - size / 2;
        const y       = e.clientY - rect.top  - size / 2;
        const ripple  = document.createElement('span');
        ripple.style.cssText = `
          position:absolute; border-radius:50%; pointer-events:none;
          width:${size}px; height:${size}px; left:${x}px; top:${y}px;
          background:rgba(255,255,255,0.25); transform:scale(0);
          animation:ripplePop 0.55s cubic-bezier(0.4,0,0.2,1) forwards;
        `;
        if (!document.querySelector('#rippleStyle')) {
          const style = document.createElement('style');
          style.id = 'rippleStyle';
          style.textContent = '@keyframes ripplePop{to{transform:scale(1);opacity:0}}';
          document.head.appendChild(style);
        }
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      });
    });
  }

  /* ─────────────────────────────────────────
     INIT — All modules
  ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initPageLoad();
    initCursor();
    initScrollProgress();
    initHeader();
    initNavigation();
    initHeroValues();
    initScrollAnimations();
    initCounters();
    initProgrammeCards();
    initLightbox();
    initContactForm();
    initNewsletter();
    initBackToTop();
    initImageSkeletons();
    initRippleEffect();
  });

})();
