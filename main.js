document.addEventListener('DOMContentLoaded', () => {
  const sections  = document.querySelectorAll('.section, .hero');
  const navLinks  = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // --- ScrollSpy ---
  const onScroll = () => {
    const scrollY = window.scrollY;
    let current = 'hero';

    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu toggle ---
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
});
