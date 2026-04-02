// Backend API URL (Railway)
const API_URL = 'https://web-genius-academy-production.up.railway.app';

// ========================================
// NOTIFICATION SYSTEM (Global)
// ========================================

class Notification {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Create notification container
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }
    
    show(type, title, message, duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }
        
        return notification;
    }
    
    remove(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 400);
    }
    
    success(title, message) {
        return this.show('success', title, message);
    }
    
    error(title, message) {
        return this.show('error', title, message);
    }
    
    info(title, message) {
        return this.show('info', title, message);
    }
}

// Global notification instance
window.notification = new Notification();

// ========================================
// COURSE DATA
// ========================================

const courses = [
    {
        title: "Web Development",
        description: "Master Full Stack MERN Development with real-world projects and industry best practices.",
        icon: "fa-code",
        duration: "24 Weeks",
        level: "Beginner to Advanced",
        students: "500+"
    },
    {
        title: "Digital Marketing",
        description: "Learn SEO, Social Media Marketing, Google Ads, and content strategy from experts.",
        icon: "fa-bullhorn",
        duration: "12 Weeks",
        level: "All Levels",
        students: "350+"
    },
    {
        title: "WordPress & SEO",
        description: "Build professional websites without coding and master search engine optimization.",
        icon: "fa-wordpress",
        duration: "8 Weeks",
        level: "Beginner",
        students: "400+"
    },
    {
        title: "E-commerce",
        description: "Create and manage online stores with Shopify and WooCommerce platforms.",
        icon: "fa-shopping-cart",
        duration: "12 Weeks",
        level: "Intermediate",
        students: "280+"
    },
    {
        title: "Basic Computer Skills",
        description: "Essential computer skills, MS Office, and productivity tools for beginners.",
        icon: "fa-desktop",
        duration: "6 Weeks",
        level: "Beginner",
        students: "600+"
    },
    {
        title: "Freelancing Basics",
        description: "Learn how to start your freelancing career and earn online successfully.",
        icon: "fa-laptop",
        duration: "6 Weeks",
        level: "All Levels",
        students: "450+"
    }
];

// ========================================
// DOM ELEMENTS
// ========================================

const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const courseContainer = document.getElementById('course-container');
const testimonialsContainer = document.getElementById('testimonials-container');
const reviewForm = document.getElementById('review-form');
const ratingInput = document.getElementById('rating-input');
const reviewRating = document.getElementById('review-rating');

// ========================================
// THEME TOGGLE
// ========================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        notification.info('Theme Changed', `Switched to ${newTheme} mode`);
    });
}

// ========================================
// MOBILE MENU
// ========================================

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ========================================
// RENDER COURSES
// ========================================

function renderCourses() {
    if (!courseContainer) return;
    
    courseContainer.innerHTML = courses.map((course, index) => `
        <div class="course-card fade-in" style="transition-delay: ${index * 0.1}s">
            <div class="course-icon">
                <i class="fas ${course.icon}"></i>
            </div>
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <span><i class="far fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-signal"></i> ${course.level}</span>
                <span><i class="fas fa-users"></i> ${course.students}</span>
            </div>
            <button class="cta-btn" onclick="enrollNow('${course.title}')">
                <i class="fas fa-arrow-right"></i> Enroll Now
            </button>
        </div>
    `).join('');
}

// ========================================
// ENROLL NOW - WITH NOTIFICATION (NO ALERT)
// ========================================

function enrollNow(courseName) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');
    
    if (isLoggedIn) {
        notification.success(
            'Enrollment Started!',
            `You're enrolling in ${courseName}. Redirecting to enrollment form...`
        );
        
        // Simulate redirect (you can add actual enrollment logic here)
        setTimeout(() => {
            window.location.href = 'pages/signup.html';
        }, 1500);
    } else {
        notification.info(
            'Account Required',
            `Please sign up or login to enroll in ${courseName}`
        );
        
        // Redirect to signup after delay
        setTimeout(() => {
            window.location.href = 'pages/signup.html';
        }, 2000);
    }
}

// ========================================
// LOAD TESTIMONIALS
// ========================================

async function loadTestimonials() {
    try {
        const response = await fetch(`${API_URL}/api/reviews`);
        const reviews = await response.json();
        
        if (reviews.length > 0) {
            testimonialsContainer.innerHTML = reviews.map(review => `
                <div class="testimonial-card fade-in">
                    <div class="testimonial-header">
                        <div class="testimonial-avatar">
                            ${review.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="testimonial-info">
                            <h4>${review.name}</h4>
                            <p>${review.course}</p>
                        </div>
                    </div>
                    <div class="testimonial-rating">
                        ${getStarRating(review.rating)}
                    </div>
                    <p class="testimonial-text">"${review.review}"</p>
                    <div class="testimonial-course">
                        <i class="fas fa-graduation-cap"></i> ${review.course} Graduate
                    </div>
                </div>
            `).join('');
        } else {
            testimonialsContainer.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1; padding: 2rem;">
                    <i class="fas fa-star" style="color: var(--accent-color); margin-bottom: 1rem; display: block; font-size: 2rem;"></i>
                    Be the first to share your experience!
                </p>
            `;
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

// ========================================
// REVIEW FORM WITH NOTIFICATIONS
// ========================================

if (ratingInput) {
    const stars = ratingInput.querySelectorAll('span');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-rating'));
            reviewRating.value = selectedRating;
            
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('active');
                    s.innerHTML = '★';
                } else {
                    s.classList.remove('active');
                    s.innerHTML = '☆';
                }
            });
        });

        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < hoverRating) {
                    s.style.color = 'var(--accent-color)';
                } else {
                    s.style.color = '';
                }
            });
        });

        star.addEventListener('mouseout', () => {
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.style.color = 'var(--accent-color)';
                } else {
                    s.style.color = '';
                }
            });
        });
    });
}

if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        const formData = {
            name: document.getElementById('review-name').value,
            email: document.getElementById('review-email').value,
            course: document.getElementById('review-course').value,
            rating: document.getElementById('review-rating').value,
            review: document.getElementById('review-text').value
        };
        
        // Validate rating
        if (!formData.rating) {
            notification.error('Rating Required', 'Please select a star rating for your review');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        try {
           const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                notification.success(
                    'Review Submitted!',
                    'Thank you for sharing your experience. Your review will appear soon.'
                );
                
                reviewForm.reset();
                selectedRating = 0;
                ratingInput.querySelectorAll('span').forEach(s => {
                    s.classList.remove('active');
                    s.innerHTML = '☆';
                });
                
                setTimeout(() => {
                    loadTestimonials();
                }, 1000);
            } else {
                throw new Error(result.message || 'Failed to submit review');
            }
        } catch (error) {
            notification.error(
                'Submission Failed',
                error.message || 'Please try again later'
            );
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ========================================
// CONTACT FORM WITH NOTIFICATIONS
// ========================================

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Formspree handles the submission
        // Show notification on form submit
        notification.info(
            'Message Sending...',
            'Please wait while we send your message'
        );
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
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

// ========================================
// PAGE LOAD ANIMATION
// ========================================

function initPageLoad() {
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// ========================================
// INITIALIZE ALL
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderCourses();
    loadTestimonials();
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initPageLoad();
    checkLoginStatus();
    
    console.log('✅ Web Genius Academy - Initialized Successfully');
});

// ========================================
// CHECK LOGIN STATUS & SHOW USERNAME
// ========================================

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (isLoggedIn && user.name && loginBtn && signupBtn) {
        // Show username
        loginBtn.textContent = `Hi, ${user.name}`;
        loginBtn.href = '#';
        loginBtn.classList.add('username');
        loginBtn.style.cursor = 'default';
        
        // Change to Logout
        signupBtn.textContent = 'Logout';
        signupBtn.href = '#';
        signupBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            notification.success('Logged Out', 'See you soon!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        };
    }
}