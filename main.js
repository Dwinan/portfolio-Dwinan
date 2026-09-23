document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const setActive = id => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    {
      rootMargin: '-72px 0px -45% 0px',
      threshold: 0
    }
  );
  sections.forEach(section => observer.observe(section));

  const setMenu = open => {
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };

  menuToggle.addEventListener('click', () => {
    setMenu(!mobileMenu.classList.contains('open'));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
});