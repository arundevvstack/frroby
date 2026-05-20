/**
 * Fr. Roby Kannanchira CMI — Modern Web Application Logic
 * Optimized for performance, zero layout shifts, and WCAG AA accessibility.
 */

// ─── NAVBAR & SCROLL PARALLAX ───
const navbar = document.querySelector('.navbar');
const handleScroll = () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Parallax Hero Effect (Optimized with requestAnimationFrame for performance)
  const heroImg = document.querySelector('.hero-image-inner');
  if (heroImg && window.innerWidth > 768) {
    const speed = 0.15;
    const yOffset = window.scrollY * speed;
    // Limit translation bounds to avoid offscreen draw
    if (yOffset < 300) {
      requestAnimationFrame(() => {
        heroImg.style.transform = `translateY(${yOffset}px) perspective(1000px) rotateY(-5deg)`;
      });
    }
  }
};

// Throttle scroll events to 60fps
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      handleScroll();
      scrollTimeout = null;
    }, 10);
  }
}, { passive: true });

// ─── ACCESSIBLE MOBILE MENU ───
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const spans = document.querySelectorAll('.hamburger span');

const toggleMenu = () => {
  const isOpen = navLinks.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  
  // Update accessibility attributes
  hamburger.setAttribute('aria-expanded', isOpen.toString());
  
  if (isOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    // Move focus into the open navigation container
    navLinks.querySelector('a')?.focus();
  } else {
    spans.forEach(s => s.style.transform = '');
    spans[1].style.opacity = '1';
    hamburger.focus();
  }
};

hamburger?.addEventListener('click', toggleMenu);

// Close menu on link click or pressing ESC
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    // If it is a dropdown toggle, don't close the entire menu immediately on mobile
    if (link.parentElement.classList.contains('nav-dropdown') && window.innerWidth <= 768) {
      return;
    }
    if (navLinks.classList.contains('open')) toggleMenu();
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    toggleMenu();
  }
});

// Mobile Dropdowns with Keyboard & Touch Toggles
const dropdowns = document.querySelectorAll('.nav-dropdown');
dropdowns.forEach(dropdown => {
  const triggerLink = dropdown.querySelector('a');
  triggerLink.setAttribute('aria-haspopup', 'true');
  triggerLink.setAttribute('aria-expanded', 'false');
  
  triggerLink.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = triggerLink.parentElement;
      const isOpen = parent.classList.toggle('open');
      triggerLink.setAttribute('aria-expanded', isOpen.toString());
    }
  });

  // Keyboard navigation inside dropdowns
  dropdown.addEventListener('focusin', () => {
    triggerLink.setAttribute('aria-expanded', 'true');
  });
  dropdown.addEventListener('focusout', () => {
    triggerLink.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    dropdowns.forEach(d => {
      d.classList.remove('open');
      d.querySelector('a').setAttribute('aria-expanded', 'false');
    });
  }
});

// ─── COUNTERS ON SCROLL (Throttled) ───
const counterAnimate = (el) => {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const count = () => {
    frame++;
    const progress = frame / totalFrames;
    // Ease-out exponential
    const current = Math.round(target * (progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)));
    el.textContent = current + suffix;
    if (frame < totalFrames) {
      requestAnimationFrame(count);
    }
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
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ─── ACCESSIBLE GALLERY LIGHTBOX ───
const lightbox = document.querySelector('.lightbox');
const lbImg = lightbox?.querySelector('img');
let lastActiveElement = null;

const openLightbox = (src, alt) => {
  lastActiveElement = document.activeElement;
  if (lbImg) {
    lbImg.src = src;
    lbImg.alt = alt || 'Expanded view';
  }
  lightbox?.classList.add('open');
  lightbox?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focus close button inside lightbox
  document.getElementById('lbClose')?.focus();
};

const closeLightbox = () => {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastActiveElement) {
    lastActiveElement.focus();
  }
};

document.querySelectorAll('.gallery-item').forEach(item => {
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  
  const img = item.querySelector('img');
  
  const handleOpen = () => {
    openLightbox(img.src, img.alt);
  };
  
  item.addEventListener('click', handleOpen);
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  });
});

document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
    closeLightbox();
  }
});

// ─── FORM SUBMISSION (FORMSPREE AJAX + ROBUST VALIDATION) ───
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  
  // Set up formStatus container
  let statusDiv = document.getElementById('formStatus');
  if (!statusDiv) {
    statusDiv = document.createElement('div');
    statusDiv.id = 'formStatus';
    btn.parentNode.insertBefore(statusDiv, btn.nextSibling);
  }
  
  // Reset previous state
  statusDiv.className = '';
  statusDiv.style.display = 'none';
  statusDiv.innerHTML = '';
  
  // Hardening inputs to prevent double submit
  const formElements = form.querySelectorAll('input, textarea, select, button');
  formElements.forEach(el => el.disabled = true);
  
  // Visual Loading State
  btn.innerHTML = '<span class="loading-spinner"></span> Sending...';
  
  const formData = new FormData(form);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
  try {
    const response = await fetch(form.action, {
      method: form.method || 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      // Success Outcome
      btn.innerHTML = '✓ Message Received';
      btn.classList.add('btn-success');
      
      statusDiv.className = 'success';
      statusDiv.innerHTML = 'Thank you! Your message has been sent successfully. Fr. Roby\'s team will reach out within 48 hours.';
      statusDiv.style.display = 'block';
      statusDiv.setAttribute('aria-live', 'polite');
      
      form.reset();
      
      // Keep success state for 5s, then reset elements
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('btn-success');
        formElements.forEach(el => el.disabled = false);
      }, 5000);
    } else {
      const data = await response.json().catch(() => ({}));
      const errorMsg = data.error || data.errors?.map(err => err.message).join(', ') || 'Failed to submit the form.';
      throw new Error(errorMsg);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Submission failed:', error);
    
    // Enable inputs to allow correcting values (Retry-Safe UX)
    formElements.forEach(el => {
      if (el !== btn) el.disabled = false;
    });
    btn.innerHTML = 'Retry Sending';
    btn.disabled = false;
    
    statusDiv.className = 'error';
    statusDiv.setAttribute('aria-live', 'assertive');
    
    if (error.name === 'AbortError') {
      statusDiv.innerHTML = 'Submission timed out. Please check your network connection and try again.';
    } else {
      statusDiv.innerHTML = `Unable to send message: ${error.message || 'System error'}. Please try again later.`;
    }
    statusDiv.style.display = 'block';
  }
});
