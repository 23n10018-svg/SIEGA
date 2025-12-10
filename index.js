// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Mencegah event bubbling
        const isVisible = navMenu.style.display === 'flex';
        navMenu.style.display = isVisible ? 'none' : 'flex';
        mobileMenuBtn.setAttribute('aria-expanded', !isVisible);
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container') && navMenu) {
        if (window.innerWidth <= 768 && navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && window.innerWidth <= 768) {
        navMenu.style.display = 'none';
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
});

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    if (!sections.length || !navLinks.length) return;
    
    let current = '';
    const scrollPosition = window.scrollY + 100; // Offset for better UX
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Fallback for last section
    if (!current && sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        const lastSectionTop = lastSection.offsetTop;
        if (scrollPosition >= lastSectionTop) {
            current = lastSection.getAttribute('id');
        }
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(`#${current}`)) {
            link.classList.add('active');
        }
    });
}

// Debounce scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNavLink, 100);
});

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
            backToTopBtn.setAttribute('aria-hidden', 'false');
        } else {
            backToTopBtn.classList.remove('show');
            backToTopBtn.setAttribute('aria-hidden', 'true');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTopButton);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Focus management for accessibility
        setTimeout(() => {
            const mainContent = document.querySelector('main') || document.body;
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            mainContent.removeAttribute('tabindex');
        }, 500);
    });
}

// Form Submission
const promotionForm = document.getElementById('promotion-form');

if (promotionForm) {
    promotionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const interest = document.getElementById('interest')?.value;
        
        // Basic validation
        if (!name || !email || !phone || !interest) {
            alert('Mohon lengkapi semua field yang wajib diisi.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Mohon masukkan alamat email yang valid.');
            return;
        }
        
        // Phone validation (basic Indonesian phone number)
        const phoneRegex = /^[0-9]{10,13}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            alert('Mohon masukkan nomor telepon yang valid (10-13 digit).');
            return;
        }
        
        // Show loading state
        const submitBtn = promotionForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success message
            alert(`Terima kasih ${name}! Formulir Anda telah berhasil dikirim. Tim Siega akan menghubungi Anda di ${phone} atau ${email} dalam 1-2 hari kerja untuk memberikan penawaran khusus untuk layanan ${interest}.`);
            
            // Reset form
            promotionForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Log for debugging
            console.log('Form submitted:', { name, email, phone, interest });
            
        }, 1500);
    });
}

// Responsive Nav Menu
function handleResponsiveNav() {
    if (!navMenu) return;
    
    if (window.innerWidth > 768) {
        navMenu.style.display = 'flex';
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
    } else {
        navMenu.style.display = 'none';
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

// Debounce resize event
let resizeTimeout;
function debouncedResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResponsiveNav, 250);
}

// Initial call and event listener for window resize
handleResponsiveNav();
window.addEventListener('resize', debouncedResize);

// Smooth scroll for navigation links
if (navLinks.length) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Only process anchor links
            if (!targetId || !targetId.startsWith('#')) return;
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            e.preventDefault();
            
            // Smooth scroll to section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
            
            // Update active nav link
            updateActiveNavLink();
            
            // Close mobile menu after clicking a link
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.style.display = 'none';
                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
            
            // Focus management for accessibility
            setTimeout(() => {
                targetSection.setAttribute('tabindex', '-1');
                targetSection.focus();
                targetSection.removeAttribute('tabindex');
            }, 500);
        });
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Optional: Unobserve after animation
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements to animate
const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .about-content, .hero-content, .service-item');
if (animateElements.length) {
    animateElements.forEach(el => {
        if (el) observer.observe(el);
    });
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial active link
    updateActiveNavLink();
    
    // Check back to top button visibility
    if (backToTopBtn) {
        backToTopBtn.classList.toggle('show', window.scrollY > 300);
    }
    
    // Log initialization
    console.log('Siega Landing Page loaded successfully!');
    console.log('Tim dapat berkolaborasi dengan:');
    console.log('1. Menambahkan fitur baru di branch terpisah');
    console.log('2. Melakukan code review sebelum merge ke main');
    console.log('3. Update README.md dengan perubahan penting');
    
    // Add CSS for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
        .nav-menu {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        #back-to-top {
            transition: all 0.3s ease;
        }
        
        .animated {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.message);
});

// Performance optimization: Disable animations when user prefers reduced motion
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaQuery.matches) {
    observer.disconnect();
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}
