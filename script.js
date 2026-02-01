// ===== DOM Elements =====
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const thumbnails = document.querySelectorAll('.thumbnail');
const mainModelImg = document.getElementById('main-model-img');
const contactForm = document.getElementById('contact-form');

// ===== Mobile Navigation =====
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';

        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ===== Sticky Header on Scroll =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.12)';
        header.style.background = 'rgba(255,255,255,0.98)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        header.style.background = 'var(--white)';
    }

    lastScroll = currentScroll;
});

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
});

// ===== Image Gallery =====
function changeMainImage(thumbnail, imageUrl) {
    // Update main image with fade effect
    mainModelImg.style.opacity = '0';

    setTimeout(() => {
        mainModelImg.src = imageUrl;
        mainModelImg.style.opacity = '1';
    }, 200);

    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Add click event to thumbnails
thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function () {
        const largeImageUrl = this.src.replace('w=200', 'w=800');
        changeMainImage(this, largeImageUrl);
    });
});

// ===== Contact Form =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validate required fields
        if (!data.nombre || !data.correo || !data.telefono) {
            showNotification('Por favor completa los campos requeridos', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.correo)) {
            showNotification('Por favor ingresa un correo válido', 'error');
            return;
        }

        // Phone validation (Mexican format)
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = data.telefono.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            showNotification('Por favor ingresa un teléfono válido (10 dígitos)', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Reset form
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Show success message
            showNotification('¡Gracias! Nos pondremos en contacto contigo pronto.', 'success');

            // Console log for debugging
            console.log('Form submitted:', data);
        }, 1500);
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification__close"><i class="fas fa-times"></i></button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: var(--font);
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification__close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                opacity: 0.8;
                transition: opacity 0.3s;
            }
            .notification__close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Apply to elements
document.querySelectorAll('.badge, .stat, .testimonial-card, .credit-logo').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===== Hero Slider Dots (Placeholder) =====
const dots = document.querySelectorAll('.dot');
let currentDot = 0;

// Auto-rotate dots (visual only for now)
setInterval(() => {
    dots.forEach(dot => dot.classList.remove('active'));
    currentDot = (currentDot + 1) % dots.length;
    dots[currentDot].classList.add('active');
}, 4000);

// ===== Lazy Loading Images =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Console Welcome Message =====
console.log('%c🏠 Rincón Real - Casas en Mazatlán', 'font-size: 20px; font-weight: bold; color: #2745DF;');
console.log('%cDesarrollado por XAN', 'font-size: 12px; color: #666;');

// ===== About Slider =====
const aboutSlides = document.querySelectorAll('.about__slide');
const aboutPrevBtn = document.querySelector('.about-btn--prev');
const aboutNextBtn = document.querySelector('.about-btn--next');
let currentAboutSlide = 0;

function showAboutSlide(n) {
    aboutSlides.forEach(slide => slide.classList.remove('active'));
    currentAboutSlide = (n + aboutSlides.length) % aboutSlides.length;
    aboutSlides[currentAboutSlide].classList.add('active');
}

if (aboutPrevBtn && aboutNextBtn) {
    aboutPrevBtn.addEventListener('click', () => {
        showAboutSlide(currentAboutSlide - 1);
    });

    aboutNextBtn.addEventListener('click', () => {
        showAboutSlide(currentAboutSlide + 1);
    });

    // Auto-play for about slider
    setInterval(() => {
        showAboutSlide(currentAboutSlide + 1);
    }, 5000);
}
