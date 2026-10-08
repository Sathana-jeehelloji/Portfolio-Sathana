/**
 * SATHANA S M - PORTFOLIO INTERACTION ENGINE (2027)
 * Micro-interactions, Scroll Observer, Filter Tabs, Lightbox Modal, Spotlight
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Header Scroll Effect
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Active Section Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        drawerLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  const openDrawer = () => {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
  });

  // 4. Scroll Reveal via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. Interactive Project Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const categories = category.split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 6. Interactive Spotlight Glow on Cards
  const spotlightCards = document.querySelectorAll('.bento-card, .project-card, .cert-card-v2');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 7. Modal / Lightbox for Certifications & Previews
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close-btn');
  const modalBody = document.querySelector('.modal-body');
  const modalTitle = document.querySelector('.modal-title');

  window.openCertModal = (title, src, isPdf) => {
    if (!modalOverlay || !modalBody) return;
    if (modalTitle) modalTitle.textContent = title;

    const actionButton = `<div style="margin-top: 16px; display: flex; justify-content: flex-end;"><a href="${src}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.85rem;">Open Full Document in New Tab ↗</a></div>`;

    if (isPdf) {
      modalBody.innerHTML = `<iframe src="${src}" title="${title}"></iframe>${actionButton}`;
    } else {
      modalBody.innerHTML = `<img src="${src}" alt="${title}" loading="lazy" />${actionButton}`;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      if (modalBody) modalBody.innerHTML = '';
      document.body.style.overflow = '';
    }
  };

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // 8. Copy Email to Clipboard helper
  const copyEmailBtn = document.querySelector('.copy-email-btn');
  copyEmailBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = 'smsathana12@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      const originalText = copyEmailBtn.innerHTML;
      copyEmailBtn.innerHTML = `<span>Copied! ✓</span>`;
      setTimeout(() => {
        copyEmailBtn.innerHTML = originalText;
      }, 2000);
    });
  });

  // 9. Interactive Contact Form Handler (mock with feedback)
  const contactForm = document.querySelector('#contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending message...';

    setTimeout(() => {
      submitBtn.innerHTML = 'Message Sent! ✓';
      contactForm.reset();
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 3500);
    }, 900);
  });

  // 10. Metric Counter Animation
  const metricNumbers = document.querySelectorAll('.metric-number[data-target]');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.max(1, Math.floor(target / 25));
          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            el.innerHTML = `${count}<span class="accent">${suffix}</span>`;
          }, 30);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    metricNumbers.forEach(num => counterObserver.observe(num));
  }
});
