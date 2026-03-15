/* ═══════════════════════════════════════════════════
   SAMEER MANUBANSH v2 – PORTFOLIO SCRIPT
   Particles · Typing · Scroll IO · Counters · Form
   Confetti · File drag-drop · Nav · Back-to-top
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── EmailJS config (replace with your own) ─────── */
  const EJS_PUBLIC  = 'YOUR_PUBLIC_KEY';
  const EJS_SERVICE = 'YOUR_SERVICE_ID';
  const EJS_TPL     = 'YOUR_TEMPLATE_ID';

  /* ── Init ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof emailjs !== 'undefined') emailjs.init(EJS_PUBLIC);

    initNav();
    initParticles();
    initTyping();
    initScrollIO();
    initCounters();
    initSkillBars();
    initBTT();
    initForm();
    initFileDrop();
  });

  /* ────────────────────────────────────────────────
     NAV
     ──────────────────────────────────────────────── */
  function initNav() {
    const nav    = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const list   = document.getElementById('navList');

    /* Scroll: frosted glass + active link */
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function onScroll() {
      nav.classList.toggle('solid', window.scrollY > 10);
      updateActiveLink();
      document.getElementById('btt')?.classList.toggle('show', window.scrollY > 500);
    }

    /* Highlight nav link for visible section */
    function updateActiveLink() {
      const sections = document.querySelectorAll('section[id]');
      const navH = nav.offsetHeight;
      let current = '';

      sections.forEach(s => {
        if (window.scrollY + navH + 40 >= s.offsetTop) current = s.id;
      });

      document.querySelectorAll('.nl').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
      });
    }

    /* Burger toggle */
    burger.addEventListener('click', () => {
      const open = list.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open.toString());
    });

    /* Close mobile menu on link click */
    list.querySelectorAll('.nl').forEach(l =>
      l.addEventListener('click', () => {
        list.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );

    /* Smooth scroll with nav offset */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const tgt = document.querySelector(a.getAttribute('href'));
        if (!tgt) return;
        e.preventDefault();
        const top = tgt.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ────────────────────────────────────────────────
     BACK TO TOP
     ──────────────────────────────────────────────── */
  function initBTT() {
    const btn = document.getElementById('btt');
    if (!btn) return;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ────────────────────────────────────────────────
     HERO PARTICLE CANVAS
     ──────────────────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isMobile = () => window.innerWidth < 600;
    const COUNT    = () => isMobile() ? 38 : 80;
    const COLORS   = [
      'rgba(0,212,255,',
      'rgba(57,255,20,',
      'rgba(0,180,220,',
    ];
    const MAX_DIST = 130;

    let W, H, particles, raf;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.r  = Math.random() * 1.6 + 0.5;
        this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.a  = Math.random() * 0.55 + 0.2;
      }
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT() }, () => new Particle());
    }

    function connect(a, b) {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d >= MAX_DIST) return;
      const alpha = (1 - d / MAX_DIST) * 0.22;
      ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
      ctx.lineWidth   = 0.5;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + p.a + ')';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) connect(p, particles[j]);
      }
      raf = requestAnimationFrame(frame);
    }

    document.addEventListener('visibilitychange', () => {
      document.hidden ? cancelAnimationFrame(raf) : frame();
    });

    new ResizeObserver(() => resize()).observe(canvas.parentElement);
    window.addEventListener('resize', resize, { passive: true });

    init();
    frame();
  }

  /* ────────────────────────────────────────────────
     TYPING EFFECT
     ──────────────────────────────────────────────── */
  function initTyping() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const lines = [
      'Scalable Data Pipelines | Azure Synapse | Databricks | ETL/ELT | Power BI',
      'Building production-grade data infrastructure since 2019',
      'Azure Synapse Analytics · ADLS Gen2 · SSIS · Delta Lake',
      'Turning raw data into executive-ready business intelligence',
      'Currently @ McCain Foods — open to senior collaborations',
    ];

    let li = 0, ci = 0, del = false;
    const T_TYPE = 55, T_DEL = 28, T_PAUSE = 2400, T_GAP = 380;

    function tick() {
      const line = lines[li];
      el.textContent = line.slice(0, ci);

      if (!del) {
        if (ci < line.length) { ci++; return setTimeout(tick, T_TYPE); }
        del = true;
        return setTimeout(tick, T_PAUSE);
      }
      if (ci > 0) { ci--; return setTimeout(tick, T_DEL); }
      del = false;
      li  = (li + 1) % lines.length;
      setTimeout(tick, T_GAP);
    }

    setTimeout(tick, 1400);
  }

  /* ────────────────────────────────────────────────
     INTERSECTION OBSERVER – reveal + skill bars
     ──────────────────────────────────────────────── */
  function initScrollIO() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ────────────────────────────────────────────────
     SKILL BARS
     ──────────────────────────────────────────────── */
  function initSkillBars() {
    const bars = document.querySelectorAll('.sk-bar');
    const io   = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const bar   = e.target;
        const fill  = bar.querySelector('.sk-fill');
        const pct   = bar.dataset.pct || '80';
        const delay = parseInt(bar.closest('.sk-card')?.dataset.delay || 0) * 100;
        setTimeout(() => (fill.style.width = pct + '%'), delay);
        io.unobserve(bar);
      });
    }, { threshold: 0.4 });

    bars.forEach(b => io.observe(b));
  }

  /* ────────────────────────────────────────────────
     ANIMATED COUNTERS (hero stats)
     ──────────────────────────────────────────────── */
  function initCounters() {
    const els = document.querySelectorAll('.hstat-n[data-target]');
    const io  = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        animCount(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.6 });

    els.forEach(el => io.observe(el));
  }

  function animCount(el) {
    const target = parseInt(el.dataset.target);
    const dur    = 1300;
    const start  = performance.now();
    const step   = (now) => {
      const p    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(2, -10 * p);       /* easeOutExpo */
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  /* ────────────────────────────────────────────────
     FILE DRAG & DROP
     ──────────────────────────────────────────────── */
  function initFileDrop() {
    const zone     = document.getElementById('fileDrop');
    const input    = document.getElementById('cf_file');
    const nameSpan = document.getElementById('fileName');
    if (!zone || !input) return;

    ['dragenter', 'dragover'].forEach(ev =>
      zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag-over'); })
    );
    ['dragleave', 'drop'].forEach(ev =>
      zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('drag-over'); })
    );
    zone.addEventListener('drop', e => {
      const files = e.dataTransfer.files;
      if (files.length) { input.files = files; showName(files[0].name); }
    });
    input.addEventListener('change', () => {
      if (input.files.length) showName(input.files[0].name);
    });
    function showName(n) {
      nameSpan.textContent = '📎 ' + n;
    }
  }

  /* ────────────────────────────────────────────────
     CONTACT FORM
     ──────────────────────────────────────────────── */
  function initForm() {
    const form   = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const btn    = document.getElementById('submitBtn');
    const lbl    = document.getElementById('btnLabel');
    const spin   = document.getElementById('btnSpinner');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name  = form.user_name.value.trim();
      const email = form.user_email.value.trim();
      const msg   = form.message.value.trim();

      if (!name || !email || !msg) return setStatus('Please fill in all required fields.', 'err');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus('Please enter a valid email address.', 'err');

      loading(true);
      setStatus('', '');

      try {
        if (typeof emailjs !== 'undefined' && EJS_SERVICE !== 'YOUR_SERVICE_ID') {
          await emailjs.sendForm(EJS_SERVICE, EJS_TPL, form);
        } else {
          await wait(1100);  /* demo fallback */
        }
        setStatus('✓ Message sent! I\'ll get back to you soon.', 'ok');
        form.reset();
        document.getElementById('fileName').textContent = '';
        fireConfetti();
      } catch (err) {
        console.error('EmailJS:', err);
        setStatus('Something went wrong. Please email directly.', 'err');
      } finally {
        loading(false);
      }
    });

    function loading(on) {
      btn.disabled = on;
      lbl.classList.toggle('hidden', on);
      spin.classList.toggle('hidden', !on);
    }

    function setStatus(txt, cls) {
      status.textContent = txt;
      status.className   = 'form-status ' + cls;
    }

    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  }

  /* ────────────────────────────────────────────────
     CONFETTI on form success
     ──────────────────────────────────────────────── */
  function fireConfetti() {
    if (typeof confetti === 'undefined') return;
    const end = Date.now() + 1800;
    const colors = ['#00D4FF', '#39FF14', '#ffffff'];
    (function burst() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(burst);
    })();
  }

  /* ────────────────────────────────────────────────
     SUBTLE HERO PARALLAX on mousemove
     ──────────────────────────────────────────────── */
  const hero    = document.getElementById('hero');
  const heroCtx = hero?.querySelector('.hero-content');
  if (hero && heroCtx && window.innerWidth > 768) {
    hero.addEventListener('mousemove', e => {
      const rx = ((e.clientX / window.innerWidth)  - 0.5) * 9;
      const ry = ((e.clientY / window.innerHeight) - 0.5) * 9;
      heroCtx.style.transform = `translate(${rx * 0.35}px, ${ry * 0.35}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroCtx.style.transform = '';
    });
  }

  /* ────────────────────────────────────────────────
     PAGE FADE-IN
     ──────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity .35s ease';
      document.body.style.opacity    = '1';
    });
  });

})();
