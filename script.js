/* =========================================
   Portofolio — Interaksi & Animasi
   ========================================= */

(function () {
  'use strict';

  /* ---------- 1. Tahun otomatis di footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Progress bar scroll ---------- */
  const progress = document.getElementById('progress');
  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateProgress();

  /* ---------- 3. Reveal on scroll (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    // fallback: tampilkan semua
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- 4. Nav dots: aktif sesuai slide ---------- */
  const dots = document.querySelectorAll('.dot');
  const sections = Array.from(dots).map((d) =>
    document.getElementById(d.dataset.target)
  );

  function setActiveDot(id) {
    dots.forEach((d) => {
      d.classList.toggle('active', d.dataset.target === id);
    });
  }

  // klik dot → scroll halus
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // update saat scroll
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            setActiveDot(entry.target.id);
          }
        });
      },
      { threshold: [0.4, 0.6] }
    );

    sections.forEach((sec) => {
      if (sec) sectionObserver.observe(sec);
    });
  }

  /* ---------- 5. Smooth scroll untuk link anchor ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 6. Efek tilt halus pada card (opsional, desktop) ---------- */
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${
          -y * 4
        }deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- 7. Update theme-color sesuai section (bonus) ---------- */
  // tidak wajib, tapi bikin nuansa makin calm di mobile
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    window.addEventListener(
      'scroll',
      () => {
        const scrolled = window.scrollY > window.innerHeight * 0.8;
        themeMeta.setAttribute('content', scrolled ? '#ebe6dc' : '#f4f1ea');
      },
      { passive: true }
    );
  }
})();

/* =========================================
   GELEMBUNG — background & interaktif
   ========================================= */
(function () {
  'use strict';

  /* ---------- 1. Gelembung background ---------- */
  const container = document.getElementById('bubblesBg');
  if (container) {
    const palettes = [
      'radial-gradient(circle at 30% 30%, rgba(255,255,255,.75), rgba(139,168,136,.22) 60%, rgba(139,168,136,.03))',
      'radial-gradient(circle at 30% 30%, rgba(255,255,255,.75), rgba(201,163,122,.22) 60%, rgba(201,163,122,.03))',
      'radial-gradient(circle at 30% 30%, rgba(255,255,255,.75), rgba(201,141,122,.20) 60%, rgba(201,141,122,.03))'
    ];

    const count = window.innerWidth < 640 ? 9 : 16;

    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';

      const size     = 18 + Math.random() * 70;
      const left     = Math.random() * 100;
      const delay    = Math.random() * 22;
      const duration = 20 + Math.random() * 22;
      const drift    = (Math.random() - 0.5) * 140;

      b.style.width  = size + 'px';
      b.style.height = size + 'px';
      b.style.left   = left + '%';
      b.style.bottom = (-120 - Math.random() * 40) + 'px';
      b.style.background = palettes[i % palettes.length];
      b.style.animationDelay    = delay + 's';
      b.style.animationDuration = duration + 's';
      b.style.setProperty('--dx', drift + 'px');

      container.appendChild(b);
    }
  }

  /* ---------- 3. Gelembung "ikut" gerakan mouse (desktop) ---------- */
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) {
    let lastTrail = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTrail < 130) return;
      lastTrail = now;

      const t = document.createElement('div');
      t.className = 'bubble-particle';
      const size = 4 + Math.random() * 8;
      t.style.width  = size + 'px';
      t.style.height = size + 'px';
      t.style.left   = e.clientX + 'px';
      t.style.top    = e.clientY + 'px';
      t.style.setProperty('--px', (Math.random() - 0.5) * 40 + 'px');
      t.style.setProperty('--py', (-20 - Math.random() * 40) + 'px');
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 1100);
    }, { passive: true });
  }
})();

/* =========================================
   BUBBLE MINI CARD — hover & tap
   ========================================= */
(function () {
  'use strict';

  const triggers = document.querySelectorAll('[data-bubble-title]');
  if (!triggers.length) return;

  /* buat kartu sekali, dipakai ulang */
  const card = document.createElement('div');
  card.className = 'bubble-card';
  card.innerHTML = `
    <div class="bc-title">
      <span class="bc-emoji"></span>
      <span class="bc-title-text"></span>
    </div>
    <div class="bc-text"></div>
    <div class="bc-tags"></div>
  `;
  document.body.appendChild(card);

  const bcEmoji = card.querySelector('.bc-emoji');
  const bcTitle = card.querySelector('.bc-title-text');
  const bcText  = card.querySelector('.bc-text');
  const bcTags  = card.querySelector('.bc-tags');

  let current = null;
  let hideTimer;

  function showFor(el) {
    clearTimeout(hideTimer);
    if (current === el && card.classList.contains('show')) return;
    current = el;

    bcEmoji.textContent = el.dataset.bubbleEmoji || '';
    bcTitle.textContent = el.dataset.bubbleTitle || '';
    bcText.textContent  = el.dataset.bubbleText  || '';

    const tags = (el.dataset.bubbleTags || '')
      .split(',').map(t => t.trim()).filter(Boolean);
    bcTags.innerHTML = tags.map(t => `<span>${t}</span>`).join('');
    bcTags.style.display = tags.length ? '' : 'none';

    /* tampilkan dulu biar offsetWidth/Height keukur */
    card.classList.add('show');
    positionFor(el);
  }

  function positionFor(el) {
    const r  = el.getBoundingClientRect();
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const pad = 12;

    /* default: di atas elemen, center horizontal */
    let top  = r.top - ch - 12;
    let left = r.left + r.width / 2 - cw / 2;
    let below = false;

    /* kalau tidak cukup di atas → taruh di bawah */
    if (top < pad) {
      top = r.bottom + 12;
      below = true;
    }

    /* clamp horizontal */
    if (left < pad) left = pad;
    if (left + cw > window.innerWidth - pad) {
      left = window.innerWidth - cw - pad;
    }

    /* posisi panah mengikuti center elemen */
    const elCenter = r.left + r.width / 2;
    let arrowX = elCenter - left;
    arrowX = Math.max(16, Math.min(cw - 16, arrowX));

    card.classList.toggle('below', below);
    card.style.top  = top + 'px';
    card.style.left = left + 'px';
    card.style.setProperty('--arrow-x', arrowX + 'px');
  }

  function hide() {
    card.classList.remove('show');
    current = null;
  }

  const isTouch = window.matchMedia('(hover: none)').matches;

  triggers.forEach(el => {
    /* hover (desktop + HP dengan stylus) */
    el.addEventListener('mouseenter', () => showFor(el));
    el.addEventListener('mouseleave', (e) => {
      const to = e.relatedTarget;
      /* kalau pindah ke trigger lain (misal dari card ke tag),
         biarkan trigger baru yang ngurus */
      if (to && to.closest && to.closest('[data-bubble-title]')) {
        clearTimeout(hideTimer);
        return;
      }
      hideTimer = setTimeout(hide, 150);
    });

    /* tap (HP) */
    el.addEventListener('click', (e) => {
      if (!isTouch) return;
      if (current === el && card.classList.contains('show')) {
        hide();
      } else {
        e.preventDefault();
        showFor(el);
      }
    });
  });

  /* tap di luar → tutup */
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('[data-bubble-title]') && current) hide();
  }, { passive: true });

  /* scroll / resize → tutup biar tidak nyangkut */
  window.addEventListener('scroll', () => { if (current) hide(); }, { passive: true });
  window.addEventListener('resize', () => { if (current) hide(); });
})();