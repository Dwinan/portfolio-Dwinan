document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const progress = document.querySelector('.scroll-progress span');

  const setActive = id => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const visibility = new Map();
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });
    let activeId = '';
    let maxRatio = 0;
    visibility.forEach((ratio, id) => {
      if (ratio > maxRatio) { maxRatio = ratio; activeId = id; }
    });
    if (activeId) setActive(activeId);
  }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
  sections.forEach(section => sectionObserver.observe(section));

  const setMenu = (open, focusToggle = true) => {
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open && focusToggle) menuToggle.focus();
  };

  menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  mobileLinks.forEach(link => link.addEventListener('click', () => setMenu(false, false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('open')) setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) setMenu(false, false);
  });

  // Hero gradient using gradients.sh gradient-engine
  const heroCanvas = document.getElementById('hero-gradient');
  if (heroCanvas && window.GradientEngine) {
    const { mountGradient, parseParams } = window.GradientEngine;
    const params = parseParams("%7B%22background%22%3A%22%23020607%22%2C%22blur%22%3A0.6%2C%22colors%22%3A%5B%22%23e6fffb%22%2C%22%2343e0cf%22%2C%22%230b6f74%22%2C%22%23032224%22%5D%2C%22dither%22%3A%7B%22cell%22%3A3%2C%22enabled%22%3Afalse%2C%22levels%22%3A8%7D%2C%22grain%22%3A0.4%2C%22interaction%22%3A%7B%22pointer%22%3A0.2%2C%22scroll%22%3A0.15%7D%2C%22kind%22%3A%22mist%22%2C%22loopSeconds%22%3A16%2C%22scale%22%3A0.9%2C%22seed%22%3A43%2C%22speed%22%3A0.7%2C%22warp%22%3A0.6%7D");
    mountGradient(heroCanvas, params, { primary: true });
  }

  let ticking = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();
});
