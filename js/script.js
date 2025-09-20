// Lions Fitness - JavaScript Features

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Initialize all features
    initScrollToTop();
    initCounterAnimation();
    initMembershipModal();
    initSmoothScrolling();
    initNavbarScroll();
    initAnimationOnScroll();
    initMobileMenu();
}

// Scroll to Top Button
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    let ticking = false;
    
    function updateScrollButton() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
        ticking = false;
    }
    
    function requestScrollTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollButton);
            ticking = true;
        }
    }

    // Show/hide button based on scroll position with throttling
    window.addEventListener('scroll', requestScrollTick, { passive: true });

    // Smooth scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        // Check if smooth scrolling is supported
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback for older browsers
            const scrollStep = -window.scrollY / (500 / 15);
            const scrollInterval = setInterval(function() {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        }
    });
}

// Counter Animation for Stats
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };

    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Membership Modal
function initMembershipModal() {
    const modal = document.getElementById('signupModal');
    const signupButtons = document.querySelectorAll('[data-bs-target="#signupModal"]');
    
    signupButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const planInput = document.getElementById('plan');
            
            if (planInput) {
                const planLower = (plan || '').toLowerCase();
                if (planInput.tagName === 'SELECT') {
                    // If select has matching option values (basic/premium/elite), set it
                    const hasOption = Array.from(planInput.options).some(opt => opt.value === planLower);
                    if (hasOption) {
                        planInput.value = planLower;
                    }
                } else {
                    // Fallback for non-select inputs
                    planInput.value = planLower ? planLower.charAt(0).toUpperCase() + planLower.slice(1) + ' Plan' : '';
                }
            }
        });
    });
}

// Submit Signup Form
function submitSignup() {
    const form = document.getElementById('signupForm');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    // Validate required fields
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    if (isValid) {
        // Show success message
        alert('Thank you for signing up! We\'ll contact you soon to complete your membership.');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        modal.hide();
        
        // Reset form
        form.reset();
    } else {
        alert('Please fill in all required fields.');
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        let ticking = false;
        
        function updateNavbar() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(26, 26, 26, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.classList.add('scrolled');
            } else {
                navbar.style.background = '';
                navbar.style.backdropFilter = '';
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        }
        
        function requestNavbarTick() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestNavbarTick, { passive: true });
    }
}

// Animation on Scroll
function initAnimationOnScroll() {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .value-card, .team-card, .pricing-card');
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for staggered animation
                const delay = Array.from(animatedElements).indexOf(entry.target) * 100;
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                }, delay);
                
                // Unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger animation when element is 50px from viewport
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
}

// Mobile Menu Enhancement
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Background Image Controls for Hero Section
function initBackgroundControls() {
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        // Add smooth parallax effect on scroll with throttling
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3; // Reduced intensity for stability
            
            // Only apply parallax if element is visible
            const rect = heroSection.getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                heroSection.style.transform = `translateY(${rate}px)`;
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
}

// Initialize background controls
document.addEventListener('DOMContentLoaded', function() {
    initBackgroundControls();
});

// Form Enhancement: Auto-resize textarea
function initTextareaAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
}

// Initialize textarea auto-resize
document.addEventListener('DOMContentLoaded', function() {
    initTextareaAutoResize();
});

// Loading States for Buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="loading"></span> ${text}`;
    button.disabled = true;
    
    return function removeLoadingState() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(toast);
    });
}

// Export functions for global use
window.submitSignup = submitSignup;
window.showToast = showToast;
