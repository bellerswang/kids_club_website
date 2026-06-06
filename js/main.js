/* Main Client Interaction & Responsive Page Animations */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAccountNavigation();
  initScrollReveal();
  initTestimonialSlider();
});

function initAccountNavigation() {
  const desktopNav = document.querySelector('.desktop-nav');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (desktopNav) {
    const accountLink = document.createElement('a');
    accountLink.href = 'dashboard.html';
    accountLink.className = 'btn btn-outline account-link';
    accountLink.textContent = '登录 / 用户中心';
    desktopNav.appendChild(accountLink);
  }

  if (mobileMenu) {
    const item = document.createElement('li');
    item.innerHTML = '<a href="dashboard.html" class="mobile-link">登录 / 用户中心</a>';
    mobileMenu.appendChild(item);
  }
}

/* 1. Header Scroll Shrink & Mobile Sidebar Navigation */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  // Shrink header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close mobile menu if clicked outside or on a link
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target) && mobileNav.classList.contains('open')) {
        closeMobileNav();
      }
    });

    const mobileLinks = mobileNav.querySelectorAll('.mobile-link, .mobile-sub-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  function openMobileNav() {
    mobileToggle.classList.add('active');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function closeMobileNav() {
    mobileToggle.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = ''; // Release scroll
  }
}

/* 2. Scroll Reveal Engine using IntersectionObserver */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('reveal-active'));
  }
}

/* 3. Testimonial Carousels / Slides */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');
  
  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer;

  // Create dot navigations
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  function goToSlide(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots[currentIndex].classList.remove('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0;
    }
    goToSlide(nextIndex);
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 5000); // Shift every 5 seconds
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  // Swipe support for touch screens
  let startX = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    clearInterval(autoPlayTimer);
  });

  track.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe right -> previous
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        goToSlide(prevIndex);
      } else {
        // swipe left -> next
        nextSlide();
      }
      isSwiping = false;
    }
  });

  track.addEventListener('touchend', () => {
    isSwiping = false;
    startAutoPlay();
  });

  // Start slider loop
  startAutoPlay();
}
