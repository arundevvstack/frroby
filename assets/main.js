/**
 * Fr. Roby — Modern Website Logic
 */

// ─── NAVBAR & SCROLL ───
const navbar = document.querySelector('.navbar');
const handleScroll = () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Parallax Hero Effect
  const heroImg = document.querySelector('.hero-image-inner');
  if (heroImg && window.innerWidth > 768) {
    const speed = 0.15;
    heroImg.style.transform = `translateY(${window.scrollY * speed}px) perspective(1000px) rotateY(-5deg)`;
  }
};
window.addEventListener('scroll', handleScroll);

// ─── MOBILE MENU ───
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const spans = document.querySelectorAll('.hamburger span');

const toggleMenu = () => {
  const isOpen = navLinks.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  
  if (isOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => s.style.transform = '');
    spans[1].style.opacity = '1';
  }
};

hamburger?.addEventListener('click', toggleMenu);

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) toggleMenu();
  });
});

// Mobile Dropdowns
document.querySelectorAll('.nav-dropdown > a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    }
  });
});

// ─── ANIMATIONS ON SCROLL ───
const revealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // If container, reveal items with stagger
      const children = entry.target.querySelectorAll('.fade-up-item');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 150);
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, revealOptions);

document.querySelectorAll('.fade-up, .grid-3, .grid-2').forEach(el => revealObserver.observe(el));

// ─── COUNTERS ───
const counterAnimate = (el) => {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const count = () => {
    frame++;
    const progress = frame / totalFrames;
    // Ease out expo
    const current = Math.round(target * (progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)));
    el.textContent = current + suffix;
    if (frame < totalFrames) requestAnimationFrame(count);
  };
  requestAnimationFrame(count);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counterAnimate(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ─── GALLERY LIGHTBOX ───
const lightbox = document.querySelector('.lightbox');
const lbImg = lightbox?.querySelector('img');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    if (lbImg) lbImg.src = src;
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
};

document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// ─── FORM FEEDBACK ───
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  // Let formspree handle the actual POST, or handle via AJAX if desired
  // This is just for UI feedback
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  
  // Simulated small delay for feedback
  setTimeout(() => {
    btn.innerHTML = '✓ Message Received';
    btn.classList.add('btn-success');
    contactForm.reset();
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('btn-success');
    }, 3000);
  }, 1000);
});
