(() => {
  'use strict';

  const EMAIL = 'faqih.nanda11@gmail.com';
  const STORAGE_KEY = 'dwinan-theme';
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const GRADIENT_THEMES = {
    dark: {
      kind: 'mist',
      background: '#060808',
      colors: ['#234f4c', '#123132', '#0a1c1d', '#040808'],
      blur: 0.65,
      grain: 0.28,
      scale: 0.9,
      seed: 43,
      speed: 0.55,
      warp: 0.52,
      loopSeconds: 18,
      dither: { enabled: false, cell: 3, levels: 8 },
      interaction: { pointer: 0.22, scroll: 0.14 }
    },
    paper: {
      kind: 'mist',
      background: '#F7F4EC',
      colors: ['#c6dac9', '#dae4d7', '#ebe7db', '#F7F4EC'],
      blur: 0.72,
      grain: 0.18,
      scale: 0.9,
      seed: 43,
      speed: 0.45,
      warp: 0.45,
      loopSeconds: 20,
      dither: { enabled: false, cell: 3, levels: 8 },
      interaction: { pointer: 0.18, scroll: 0.1 }
    }
  };

  let gradientHandle = null;
  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 2400);
  }

  async function copyEmail() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL);
      } else {
        const helper = document.createElement('textarea');
        helper.value = EMAIL;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        helper.remove();
      }
      showToast('Email copied â€” faqih.nanda11@gmail.com');
      const label = document.getElementById('copy-email-label');
      if (label) {
        label.textContent = 'Copied';
        label.setAttribute('data-text', 'Copied');
        window.setTimeout(() => {
          label.textContent = 'Copy Email';
          label.setAttribute('data-text', 'Copy Email');
        }, 2000);
      }
    } catch (_) {
      showToast('Email: faqih.nanda11@gmail.com');
    }
  }

  function initClock() {
    const el = document.getElementById('local-clock');
    if (!el) return;

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const tick = () => {
      const now = new Date();
      const formatted = formatter.format(now);
      el.textContent = `${formatted} WIB`;
      el.setAttribute('datetime', now.toISOString());
    };

    tick();
    window.setInterval(tick, 1000);
  }

  function initTheme() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    const toggleText = document.getElementById('theme-toggle-text');
    const metaTheme = document.getElementById('meta-theme-color');

    const applyTheme = (theme, persist = true) => {
      const safeTheme = theme === 'paper' ? 'paper' : 'dark';
      root.setAttribute('data-theme', safeTheme);
      if (metaTheme) {
        metaTheme.setAttribute('content', safeTheme === 'paper' ? '#F7F4EC' : '#060808');
      }
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-pressed', String(safeTheme === 'paper'));
      }
      if (toggleText) {
        toggleText.textContent = safeTheme === 'paper' ? 'OBSIDIAN' : 'PAPER';
      }
      if (gradientHandle?.setParams) {
        gradientHandle.setParams(GRADIENT_THEMES[safeTheme]);
      }
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, safeTheme);
        } catch (_) {}
      }
    };

    const current = root.getAttribute('data-theme') === 'paper' ? 'paper' : 'dark';
    applyTheme(current, false);

    const toggle = () => {
      const next = root.getAttribute('data-theme') === 'paper' ? 'dark' : 'paper';
      applyTheme(next, true);
      showToast(next === 'paper' ? 'Edition: Archival Paper' : 'Edition: Obsidian Mist');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggle);

    return {
      toggle,
      getCurrent: () => (root.getAttribute('data-theme') === 'paper' ? 'paper' : 'dark')
    };
  }

  function initHeroGradient(initialTheme) {
    const heroCanvas = document.getElementById('hero-gradient');
    if (!heroCanvas || !window.GradientEngine?.mountGradient) return;

    gradientHandle = window.GradientEngine.mountGradient(
      heroCanvas,
      GRADIENT_THEMES[initialTheme] || GRADIENT_THEMES.dark,
      { primary: true, maxDpr: 1.5 }
    );
  }

  function initScrollTracking() {
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const sections = document.querySelectorAll('.hero, .section');
    const progressBar = document.querySelector('.scroll-progress span');
    const portraitPlate = document.querySelector('.portrait-plate');

    const setActive = (activeId) => {
      allNavLinks.forEach((link) => {
        const isMatch = Boolean(activeId) && link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', isMatch);
        if (isMatch) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    const visibility = new Map();
    const resolveActive = () => {
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - (window.scrollY + window.innerHeight) <= 28) {
        setActive('contact');
        return;
      }
      let activeId = '';
      let maxRatio = 0;
      visibility.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeId = id;
        }
      });
      if (activeId === 'hero') setActive('');
      else if (activeId) setActive(activeId);
    };

    if (sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
          });
          resolveActive();
        },
        { rootMargin: '-18% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      sections.forEach((s) => observer.observe(s));
    }

    let ticking = false;
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      if (progressBar) {
        progressBar.style.transform = `scaleX(${ratio})`;
      }
      if (portraitPlate && !REDUCED_MOTION && window.innerWidth > 860) {
        const shift = Math.min(28, window.scrollY * 0.055);
        portraitPlate.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      } else if (portraitPlate) {
        portraitPlate.style.transform = '';
      }
      resolveActive();
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    onScroll();
  }

  function initReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    items.forEach((el) => revealObserver.observe(el));
  }

  function initSpecFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cells = document.querySelectorAll('#spec-matrix .spec-cell');
    if (!buttons.length || !cells.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });

        let visibleIdx = 1;
        cells.forEach((cell) => {
          const matches = filter === 'all' || cell.getAttribute('data-cat') === filter;
          cell.hidden = !matches;
          if (matches) {
            const num = cell.querySelector('.spec-num');
            if (num) num.textContent = String(visibleIdx).padStart(2, '0');
            visibleIdx += 1;
          }
        });
      });
    });
  }

  function initMorseFsm() {
    const specimen = document.getElementById('fsm-specimen');
    if (!specimen) return;

    const MORSE_TREE = {
      '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
      '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
      '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
      '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
      '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
      '--..': 'Z'
    };

    const DEMO_SEQUENCE = [
      { code: '-..', char: 'D' },
      { code: '.--', char: 'W' },
      { code: '..', char: 'I' },
      { code: '-.', char: 'N' },
      { code: '.-', char: 'A' },
      { code: '-.', char: 'N' }
    ];

    const nodes = {
      idle: specimen.querySelector('[data-node="idle"]'),
      signal: specimen.querySelector('[data-node="signal"]'),
      decode: specimen.querySelector('[data-node="decode"]')
    };
    const stateReadout = document.getElementById('fsm-state-readout');
    const morseEl = document.getElementById('fsm-morse');
    const decodedEl = document.getElementById('fsm-decoded');
    const autoBtn = document.getElementById('fsm-auto-btn');

    let buffer = '';
    let decodedText = '';
    let autoMode = !REDUCED_MOTION;
    let demoStep = 0;
    let demoCharPos = 0;
    let demoTimer = null;

    const setState = (stateName) => {
      Object.entries(nodes).forEach(([key, node]) => {
        if (node) node.classList.toggle('is-lit', key === stateName);
      });
      if (stateReadout) {
        const labels = {
          idle: 'STATE: S0_IDLE',
          signal: 'STATE: S1_SIGNAL',
          decode: 'STATE: S2_DECODE'
        };
        stateReadout.textContent = labels[stateName] || 'STATE: S0_IDLE';
      }
    };

    const renderMonitor = () => {
      if (morseEl) morseEl.textContent = buffer || 'â€”';
      if (decodedEl) decodedEl.textContent = decodedText || 'READY';
    };

    const stopAuto = () => {
      autoMode = false;
      window.clearTimeout(demoTimer);
      if (autoBtn) autoBtn.classList.remove('is-active');
    };

    const runAutoTick = () => {
      if (!autoMode) return;
      const item = DEMO_SEQUENCE[demoStep];
      if (demoCharPos === 0 && demoStep === 0) {
        decodedText = '';
      }

      if (demoCharPos < item.code.length) {
        buffer = item.code.slice(0, demoCharPos + 1);
        setState('signal');
        renderMonitor();
        demoCharPos += 1;
        demoTimer = window.setTimeout(runAutoTick, 360);
      } else {
        decodedText += item.char;
        setState('decode');
        renderMonitor();
        demoCharPos = 0;
        demoStep = (demoStep + 1) % DEMO_SEQUENCE.length;
        demoTimer = window.setTimeout(() => {
          if (!autoMode) return;
          buffer = '';
          setState('idle');
          renderMonitor();
          demoTimer = window.setTimeout(runAutoTick, demoStep === 0 ? 1100 : 420);
        }, 620);
      }
    };

    const startAuto = () => {
      stopAuto();
      autoMode = true;
      demoStep = 0;
      demoCharPos = 0;
      buffer = '';
      decodedText = '';
      if (autoBtn) autoBtn.classList.add('is-active');
      runAutoTick();
    };

    specimen.querySelectorAll('[data-fsm-input]').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        stopAuto();
        if (buffer.length >= 5) buffer = '';
        buffer += btn.getAttribute('data-fsm-input');
        setState('signal');
        renderMonitor();
      });
    });

    const commitBtn = specimen.querySelector('[data-fsm-action="commit"]');
    if (commitBtn) {
      commitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        stopAuto();
        if (!buffer) {
          decodedText = '';
          setState('idle');
          renderMonitor();
          return;
        }
        const match = MORSE_TREE[buffer] || '?';
        decodedText = (decodedText + match).slice(-8);
        buffer = '';
        setState('decode');
        renderMonitor();
      });
    }

    if (autoBtn) {
      autoBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (autoMode) {
          stopAuto();
          setState('idle');
        } else {
          startAuto();
        }
      });
    }

    if (autoMode) {
      if (autoBtn) autoBtn.classList.add('is-active');
      runAutoTick();
    } else {
      buffer = '-..';
      decodedText = 'DWINAN';
      setState('decode');
      renderMonitor();
    }
  }

  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-backdrop');
    if (!menuToggle || !mobileMenu) return;

    const labelEl = menuToggle.querySelector('.menu-toggle-label');
    const links = mobileMenu.querySelectorAll('.mobile-link');
    let isOpen = false;

    const setMenu = (open, restoreFocus = true) => {
      if (open === isOpen) return;
      isOpen = open;
      menuToggle.setAttribute('aria-expanded', String(open));
      if (labelEl) labelEl.textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';

      if (open) {
        mobileMenu.hidden = false;
        if (backdrop) backdrop.hidden = false;
        requestAnimationFrame(() => mobileMenu.classList.add('open'));
      } else {
        mobileMenu.classList.remove('open');
        if (backdrop) backdrop.hidden = true;
        window.setTimeout(() => {
          if (!isOpen) mobileMenu.hidden = true;
        }, 180);
        if (restoreFocus) menuToggle.focus();
      }
    };

    menuToggle.addEventListener('click', () => setMenu(!isOpen));
    links.forEach((link) => link.addEventListener('click', () => setMenu(false, false)));
    if (backdrop) backdrop.addEventListener('click', () => setMenu(false, true));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen) setMenu(false, true);
    });

    window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
      if (event.matches && isOpen) setMenu(false, false);
    });
  }

  function initPointer() {
    if (REDUCED_MOTION || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const ring = document.getElementById('cursor-ring');
    const dot = document.getElementById('cursor-dot');
    const label = document.getElementById('cursor-label');
    if (!ring || !dot || !label) return;

    document.documentElement.classList.add('has-custom-cursor');

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let visible = false;
    let rafId = 0;

    const render = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
      dot.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0)`;

      if (Math.abs(targetX - ringX) > 0.2 || Math.abs(targetY - ringY) > 0.2) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = 0;
      }
    };

    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        ringX = targetX;
        ringY = targetY;
        ring.classList.add('is-visible');
        dot.classList.add('is-visible');
      }
      if (!rafId) rafId = requestAnimationFrame(render);

      const hit = event.target instanceof Element ? event.target.closest('[data-cursor]') : null;
      const text = hit ? hit.getAttribute('data-cursor') : '';
      if (text) {
        label.textContent = text;
        ring.classList.add('is-labeled');
      } else {
        label.textContent = '';
        ring.classList.remove('is-labeled');
      }
    }, { passive: true });

    document.documentElement.addEventListener('pointerleave', () => {
      visible = false;
      ring.classList.remove('is-visible', 'is-labeled');
      dot.classList.remove('is-visible');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const theme = initTheme();
    initHeroGradient(theme.getCurrent());
    initClock();
    initScrollTracking();
    initReveals();
    initSpecFilter();
    initMorseFsm();
    initMobileMenu();
    initPointer();

    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) copyBtn.addEventListener('click', copyEmail);

    document.addEventListener('keydown', (event) => {
      const tag = event.target?.tagName;
      if (event.metaKey || event.ctrlKey || event.altKey || tag === 'INPUT' || tag === 'TEXTAREA') {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === 't') {
        event.preventDefault();
        theme.toggle();
      } else if (key === 'c') {
        event.preventDefault();
        copyEmail();
      }
    });

    requestAnimationFrame(() => {
      document.body.classList.add('is-loaded');
    });
  });
})();
