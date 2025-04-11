document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll buat nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = e.target.getAttribute('href'); // Buat /swap
      }
    });
  });

  // Animasi fade-in buat feature saat scroll
  const features = document.querySelectorAll('.feature');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.5 });

  features.forEach(feature => observer.observe(feature));
});
