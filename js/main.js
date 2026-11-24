(() => {
  'use strict';

  const EMAIL = 'faqih.nanda11@gmail.com';
  const STORAGE_KEY = 'dwinan-theme';
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const COPY_ICON_SVG = '<rect x="9" y="9" width="13" height="13" rx="1"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>';
  const CHECK_ICON_SVG = '<polyline points="20 6 9 17 4 12"/>';

  const GRADIENT_THEMES = {
    dark: {
      kind: 'mist',
      background: '#060808',
      colors: ['#234f4c', '#123132', '#0a1c1d', '#040808'],
      blur: 0.65,
      grain: 0.24,
      scale: 0.9,
      seed: 43,
      speed: 0.5,
      warp: 0.48,
      loopSeconds: 18,
      dither: { enabled: false, cell: 3, levels: 8 },
      interaction: { pointer: 0.2, scroll: 0.1 }
    },
    paper: {
      kind: 'mist',
      background: '#F7F4EC',
      colors: ['#c6dac9', '#dae4d7', '#ebe7db', '#F7F4EC'],
      blur: 0.72,
      grain: 0.16,
      scale: 0.9,
      seed: 43,
      speed: 0.42,
      warp: 0.42,
      loopSeconds: 20,
      dither: { enabled: false, cell: 3, levels: 8 },
      interaction: { pointer: 0.16, scroll: 0.08 }
    }
  };

  let gradientHandle = null;
  let toastTimer = null;
  let copyResetTimer = null;

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
        const ok = document.execCommand('copy');
        helper.remove();
        if (!ok) throw new Error('Copy failed');
      }

      showToast(`Email copied: ${EMAIL}`);

      const label = document.getElementById('copy-email-label');
      const icon = document.getElementById('copy-email-ico');

      if (label) {
        label.textContent = 'Copied';
        label.setAttribute('data-text', 'Copied');
      }
      if (icon) {
        icon.innerHTML = CHECK_ICON_SVG;
      }

      window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        if (label) {
          label.textContent = 'Copy Email';
          label.setAttribute('data-text', 'Copy Email');
        }
        if (icon) {
          icon.innerHTML = COPY_ICON_SVG;
        }
      }, 2000);
    } catch (_) {
      showToast(`Email: ${EMAIL}`);
    }
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
      getCurrent: () => (root.getAttribute('data-theme') === 'paper' ? 'paper' : 'dark')
    };
  }

  /* Adaptive hero mist: static CSS on mobile/low-spec, lazy WebGL on capable desktop */
  function initHeroGradient(getTheme) {
    const heroSection = document.getElementById('hero');
    const heroCanvas = document.getElementById('hero-gradient');
    if (!heroSection || !heroCanvas) return;

    const saveData = Boolean(navigator.connection?.saveData);
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 4;
    const desktopCapable = FINE_POINTER && window.innerWidth >= 1024 && !REDUCED_MOTION && !saveData && cores >= 4 && memory >= 4;
    if (!desktopCapable) return;

    let heroInView = true;

    const mount = () => {
      if (gradientHandle || !heroInView || !window.GradientEngine?.mountGradient) return;
      gradientHandle = window.GradientEngine.mountGradient(
        heroCanvas,
        GRADIENT_THEMES[getTheme()] || GRADIENT_THEMES.dark,
        { primary: true, maxDpr: 1 }
      );
      heroSection.classList.add('has-webgl');
    };

    const unmount = () => {
      if (!gradientHandle) return;
      gradientHandle.unmount?.();
      gradientHandle = null;
      heroSection.classList.remove('has-webgl');
    };

    const heroObserver = new IntersectionObserver(
      (entries) => {
        heroInView = Boolean(entries[0]?.isIntersecting);
        if (heroInView) mount();
        else unmount();
      },
      { rootMargin: '120px 0px' }
    );
    heroObserver.observe(heroSection);

    const loadEngine = () => {
      if (window.GradientEngine?.mountGradient) {
        mount();
        return;
      }
      const script = document.createElement('script');
      script.src = 'js/vendor/gradient-engine.js';
      script.async = true;
      script.onload = () => mount();
      document.body.appendChild(script);
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadEngine, { timeout: 1200 });
    } else {
      window.setTimeout(loadEngine, 250);
    }
  }

  function initScrollTracking() {
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const sections = document.querySelectorAll('.hero, .section');
    const progressBar = document.querySelector('.scroll-progress span');

    let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    let resizeTimer = null;

    const refreshBounds = () => {
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    };

    window.addEventListener('load', refreshBounds);
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refreshBounds, 120);
    }, { passive: true });

    const setActive = (activeId) => {
      allNavLinks.forEach((link) => {
        const isMatch = Boolean(activeId) && link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', isMatch);
        if (isMatch) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const visibility = new Map();
    const resolveActive = () => {
      if (maxScroll > 0 && maxScroll - window.scrollY <= 32) {
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
      if (progressBar) {
        const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
        progressBar.style.transform = `scaleX(${ratio})`;
      }
      if (maxScroll > 0 && maxScroll - window.scrollY <= 32) {
        setActive('contact');
      }
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(onScroll);
        }
      },
      { passive: true }
    );
    onScroll();

    return refreshBounds;
  }

  function initReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const lowMemory = Boolean(navigator.deviceMemory && navigator.deviceMemory <= 2);
    if (REDUCED_MOTION || lowMemory || window.innerWidth <= 760 || !('IntersectionObserver' in window)) {
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
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );

    items.forEach((el) => revealObserver.observe(el));
  }

  function initSpecMatrix(refreshBounds) {
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

        let visibleIdx = 0;
        cells.forEach((cell) => {
          const matches = filter === 'all' || cell.getAttribute('data-cat') === filter;
          cell.hidden = !matches;
          if (matches) {
            visibleIdx += 1;
            const num = cell.querySelector('.spec-num');
            if (num) num.textContent = String(visibleIdx).padStart(2, '0');
          }
        });

        if (refreshBounds) refreshBounds();
      });
    });
  }

  /* Interactive Morse FSM specimen: manual by default, optional DEMO loop while in view */
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

    let buffer = '-..';
    let decodedText = 'D';
    let autoMode = false;
    let inView = false;
    let demoStep = 0;
    let demoCharPos = 0;
    let demoTimer = null;

    const setState = (stateName) => {
      Object.entries(nodes).forEach(([key, node]) => {
        if (node) node.classList.toggle('is-lit', key === stateName);
      });
      if (stateReadout) {
        const labels = {
          idle: 'S0_IDLE',
          signal: 'S1_SIGNAL',
          decode: 'S2_DECODE'
        };
        stateReadout.textContent = labels[stateName] || 'S0_IDLE';
      }
    };

    const renderMonitor = () => {
      if (morseEl) morseEl.textContent = buffer || '-';
      if (decodedEl) decodedEl.textContent = decodedText || 'READY';
    };

    const clearTimer = () => {
      window.clearTimeout(demoTimer);
      demoTimer = null;
    };

    const stopAuto = () => {
      autoMode = false;
      clearTimer();
      if (autoBtn) {
        autoBtn.classList.remove('is-active');
        autoBtn.setAttribute('aria-pressed', 'false');
      }
    };

    const runAutoTick = () => {
      if (!autoMode || !inView) return;
      const item = DEMO_SEQUENCE[demoStep];
      if (demoCharPos === 0 && demoStep === 0) decodedText = '';

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
          if (!autoMode || !inView) return;
          buffer = '';
          setState('idle');
          renderMonitor();
          demoTimer = window.setTimeout(runAutoTick, demoStep === 0 ? 1100 : 420);
        }, 620);
      }
    };

    const startAuto = () => {
      clearTimer();
      autoMode = true;
      demoStep = 0;
      demoCharPos = 0;
      buffer = '';
      decodedText = '';
      if (autoBtn) {
        autoBtn.classList.add('is-active');
        autoBtn.setAttribute('aria-pressed', 'true');
      }
      if (inView) runAutoTick();
    };

    specimen.querySelectorAll('[data-fsm-input]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopAuto();
        if (buffer === '-..' && decodedText === 'D') {
          buffer = '';
          decodedText = '';
        }
        if (buffer.length >= 5) buffer = '';
        buffer += btn.getAttribute('data-fsm-input');
        setState('signal');
        renderMonitor();
      });
    });

    const commitBtn = specimen.querySelector('[data-fsm-action="commit"]');
    if (commitBtn) {
      commitBtn.addEventListener('click', () => {
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
      autoBtn.addEventListener('click', () => {
        if (autoMode) {
          stopAuto();
          setState('idle');
        } else {
          startAuto();
        }
      });
    }

    setState('idle');
    renderMonitor();

    const fsmObserver = new IntersectionObserver(
      (entries) => {
        inView = Boolean(entries[0]?.isIntersecting);
        if (inView && autoMode && !demoTimer) runAutoTick();
        else if (!inView) clearTimer();
      },
      { threshold: 0.1 }
    );
    fsmObserver.observe(specimen);
  }

  /* Brand logo pulse feedback and subtle magnetic pull on fine-pointer desktop */
  function initMicroInteractions() {
    const brandLogo = document.getElementById('brand-logo');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        brandLogo.classList.add('is-pulsing');
        window.setTimeout(() => brandLogo.classList.remove('is-pulsing'), 420);
      });
    }

    if (REDUCED_MOTION || !FINE_POINTER) return;

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      let rect = null;
      el.addEventListener('pointerenter', () => {
        rect = el.getBoundingClientRect();
      });
      el.addEventListener('pointermove', (event) => {
        if (!rect) rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }, { passive: true });
      el.addEventListener('pointerleave', () => {
        rect = null;
        el.style.transform = '';
      });
    });
  }

  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-backdrop');
    if (!menuToggle || !mobileMenu) return;

    const labelEl = menuToggle.querySelector('.menu-toggle-label');
    const links = Array.from(mobileMenu.querySelectorAll('.mobile-link'));
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
        requestAnimationFrame(() => {
          mobileMenu.classList.add('open');
          if (links.length) links[0].focus();
        });
      } else {
        mobileMenu.classList.remove('open');
        if (backdrop) backdrop.hidden = true;
        window.setTimeout(() => {
          if (!isOpen) mobileMenu.hidden = true;
        }, 180);
        if (restoreFocus) menuToggle.focus();
      }
    };

    menuToggle.addEventListener('click', () => setMenu(!isOpen, true));
    links.forEach((link) => link.addEventListener('click', () => setMenu(false, false)));
    if (backdrop) backdrop.addEventListener('click', () => setMenu(false, true));

    document.addEventListener('keydown', (event) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        setMenu(false, true);
        return;
      }

      if (event.key === 'Tab' && links.length) {
        const focusables = [menuToggle, ...links];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
      if (event.matches && isOpen) setMenu(false, false);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const theme = initTheme();
    initHeroGradient(theme.getCurrent);
    const refreshBounds = initScrollTracking();
    initReveals();
    initSpecMatrix(refreshBounds);
    initMorseFsm();
    initMicroInteractions();
    initMobileMenu();

    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) copyBtn.addEventListener('click', copyEmail);

    requestAnimationFrame(() => {
      document.body.classList.add('is-loaded');
    });
  });
})();
