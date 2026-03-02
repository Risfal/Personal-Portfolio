/**
 * RISFAL PORTFOLIO — script.js
 * ─────────────────────────────────────────────
 * Modules:
 *  1. Custom Cursor
 *  2. Typewriter Effect
 *  3. Nav — Scroll State + Active Link
 *  4. Mobile Menu
 *  5. Scroll Reveal
 *  6. Counter Animation
 *  7. Project Card 3D Tilt
 *  8. Contact Form Validation
 *  9. Smooth Anchor Scrolling
 */

/* ═══════════════════════════════════════════
   1. CUSTOM CURSOR
═══════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  // Dot follows mouse instantly
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring lerps smoothly behind
  (function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Expand on interactive elements
  const INTERACTIVE = 'a, button, input, textarea, label, [data-hover]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(INTERACTIVE)) {
      dot.style.width   = '12px';
      dot.style.height  = '12px';
      ring.style.width  = '50px';
      ring.style.height = '50px';
      ring.style.borderColor = 'rgba(240, 192, 96, 0.7)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(INTERACTIVE)) {
      dot.style.width   = '7px';
      dot.style.height  = '7px';
      ring.style.width  = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(240, 192, 96, 0.45)';
    }
  });

  // Hide/show when mouse leaves/enters window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ═══════════════════════════════════════════
   2. TYPEWRITER EFFECT
═══════════════════════════════════════════ */
(function initTypewriter() {
  const target = document.getElementById('typewriter-target');
  if (!target) return;

  const words = [
    'building',
    'circuits',
    'things',
    'Verilog',
    'FPGA logic',
    'and teaching',
  ];

  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 42;
  const PAUSE_AFTER    = 1800;
  const PAUSE_BEFORE   = 300;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    if (paused) return;

    const word = words[wordIndex];

    if (!deleting) {
      target.textContent = word.slice(0, ++charIndex);

      if (charIndex === word.length) {
        paused = true;
        setTimeout(() => {
          paused    = false;
          deleting  = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }

      setTimeout(tick, TYPING_SPEED);

    } else {
      target.textContent = word.slice(0, --charIndex);

      if (charIndex === 0) {
        deleting   = false;
        wordIndex  = (wordIndex + 1) % words.length;
        paused     = true;
        setTimeout(() => {
          paused = false;
          tick();
        }, PAUSE_BEFORE);
        return;
      }

      setTimeout(tick, DELETING_SPEED);
    }
  }

  // Start after hero animation delay
  setTimeout(tick, 900);
})();


/* ═══════════════════════════════════════════
   3. NAV — SCROLL STATE + ACTIVE LINK
═══════════════════════════════════════════ */
(function initNav() {
  const nav      = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  if (!nav) return;

  // Darken nav background after scrolling 60px
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 60);
  }, { passive: true });

  // Highlight nav link matching the visible section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    });
  }, { threshold: 0.45 });

  sections.forEach((section) => observer.observe(section));
})();


/* ═══════════════════════════════════════════
   4. MOBILE MENU
═══════════════════════════════════════════ */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mmLinks    = document.querySelectorAll('.mm-link');

  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';

    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(4px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4px, -5px)';
  }

  function closeMenu() {
    isOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';

    const spans = hamburger.querySelectorAll('span');
    spans.forEach((s) => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close when a link is tapped
  mmLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
})();


/* ═══════════════════════════════════════════
   5. SCROLL REVEAL
═══════════════════════════════════════════ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.1,
    rootMargin: '0px 0px -32px 0px',
  });

  elements.forEach((el) => observer.observe(el));
})();


/* ═══════════════════════════════════════════
   6. COUNTER ANIMATION
═══════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = Number(el.dataset.count);
      const dur    = 1200; // ms
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
})();


/* ═══════════════════════════════════════════
   7. PROJECT CARD 3D TILT
═══════════════════════════════════════════ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease, background 0.3s';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      card.style.transform = `
        perspective(900px)
        rotateY(${x * 4}deg)
        rotateX(${-y * 3}deg)
        translateY(-4px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.3s';
      card.style.transform  = '';

      // Reset transition after animation completes
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });
})();


/* ═══════════════════════════════════════════
   8. CONTACT FORM VALIDATION
═══════════════════════════════════════════ */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const formBtn = document.getElementById('form-btn');

  if (!form || !formBtn) return;

  function markInvalid(field) {
    field.style.borderColor = 'rgba(248, 113, 113, 0.6)';
    field.style.boxShadow   = '0 0 0 3px rgba(248, 113, 113, 0.07)';
    field.style.animation   = 'none';

    // Trigger reflow so animation restarts
    void field.offsetWidth;
    field.style.animation = 'shake 0.4s ease';

    // Clear error state on next input
    field.addEventListener('input', () => {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
      field.style.animation   = '';
    }, { once: true });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        markInvalid(field);
      }
    });

    if (!valid) return;

    // Success state
    const originalText   = formBtn.textContent;
    formBtn.textContent  = '✓ Message Sent!';
    formBtn.classList.add('sent');
    formBtn.disabled     = true;

    setTimeout(() => {
      formBtn.textContent = originalText;
      formBtn.classList.remove('sent');
      formBtn.disabled    = false;
      form.reset();
    }, 3500);
  });
})();


/* ═══════════════════════════════════════════
   9. SMOOTH ANCHOR SCROLLING
═══════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ═══════════════════════════════════════════
   10. SKILL BAR ANIMATION
   Animates .skill-fill bars when they scroll
   into view (uses IntersectionObserver)
═══════════════════════════════════════════ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  // Store target widths, then reset to 0
  bars.forEach((bar) => {
    bar.dataset.targetWidth = bar.style.width || '0%';
    bar.style.width = '0%';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      // Small delay so the reveal animation finishes first
      setTimeout(() => {
        bar.style.width = bar.dataset.targetWidth;
      }, 200);
      observer.unobserve(bar);
    });
  }, { threshold: 0.4 });

  bars.forEach((bar) => observer.observe(bar));
})();