// ===== API URL =====
const API_URL = "https://web-genius-academy-production.up.railway.app";
console.log('🔗 API_URL:', API_URL);

// ===== NOTIFICATION CLASS =====
class Notification {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 350px;
        `;
        document.body.appendChild(this.container);
    }

    show(type, title, message, duration = 6000) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.style.cssText = `
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        notif.innerHTML = `
            <strong style="display:block;font-weight:600">${title}</strong>
            <span style="display:block;margin-top:4px;font-size:14px">${message}</span>
        `;
        
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transition = 'opacity 0.3s';
            setTimeout(() => notif.remove(), 300);
        }, duration);
        
        this.container.appendChild(notif);
    }

    success(t, m) { this.show('success', t, m, 6000); }
    error(t, m) { this.show('error', t, m, 8000); }
    info(t, m) { this.show('info', t, m, 5000); }
}

// Add animation keyframes
if (!document.getElementById('notif-styles')) {
    const style = document.createElement('style');
    style.id = 'notif-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Global notification instance
const notification = new Notification();

// ===== COURSE DATA =====
const courses = [
    {
        title: "Web Development",
        description: "Master Full Stack MERN Development with real-world projects and industry best practices.",
        icon: "fa-code",
        duration: "24 Weeks",
        level: "Beginner to Advanced",
        price: "PKR 25,000",
        students: "500+"
    },
    {
        title: "Digital Marketing",
        description: "Learn SEO, Social Media Marketing, Google Ads, and content strategy from experts.",
        icon: "fa-bullhorn",
        duration: "12 Weeks",
        level: "All Levels",
        price: "PKR 18,000",
        students: "350+"
    },
    {
        title: "WordPress & SEO",
        description: "Build professional websites without coding and master search engine optimization.",
        icon: "fa-wordpress",
        duration: "8 Weeks",
        level: "Beginner",
        price: "PKR 12,000",
        students: "400+"
    },
    {
        title: "E-commerce",
        description: "Create and manage online stores with Shopify and WooCommerce platforms.",
        icon: "fa-shopping-cart",
        duration: "12 Weeks",
        level: "Intermediate",
        price: "PKR 20,000",
        students: "280+"
    },
    {
        title: "Basic Computer Skills",
        description: "Essential computer skills, MS Office, and productivity tools for beginners.",
        icon: "fa-desktop",
        duration: "6 Weeks",
        level: "Beginner",
        price: "PKR 8,000",
        students: "600+"
    },
    {
        title: "Freelancing Basics",
        description: "Learn how to start your freelancing career and earn online successfully.",
        icon: "fa-laptop",
        duration: "6 Weeks",
        level: "All Levels",
        price: "PKR 10,000",
        students: "450+"
    }
];

// ===== DOM ELEMENTS =====
let themeToggle, hamburger, navLinks, courseContainer, testimonialsContainer, reviewForm, ratingInput, reviewRating;

// ===== HELPER FUNCTIONS =====

function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

// ===== ENROLLMENT MODAL FUNCTIONS =====

function openEnrollmentModal(course) {
    const modal = document.getElementById('enrollment-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Set course details
    document.getElementById('modal-course-name').textContent = course.title;
    document.getElementById('enroll-course-name').value = course.title;
    document.getElementById('modal-course-duration').textContent = course.duration;
    document.getElementById('modal-course-level').textContent = course.level;
    document.getElementById('modal-course-price').textContent = course.price;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close modal
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };
    
    // Close on outside click
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function enrollNow(courseName) {
    const course = courses.find(c => c.title === courseName);
    if (course) {
        openEnrollmentModal(course);
    } else {
        notification.error('Error', 'Course not found');
    }
}

function renderCourses() {
    if (!courseContainer) {
        console.log('⚠️ courseContainer not found');
        return;
    }
    console.log('✅ Rendering courses...');
    courseContainer.innerHTML = courses.map((course, index) => `
        <div class="course-card fade-in" style="transition-delay: ${index * 0.1}s">
            <div class="course-icon"><i class="fas ${course.icon}"></i></div>
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
    console.log('✅ Courses rendered');
}

async function loadTestimonials() {
    console.log('🔍 loadTestimonials called');
    
    if (!testimonialsContainer) {
        console.error('❌ testimonials-container not found in DOM');
        return;
    }
    
    console.log('✅ Container found:', testimonialsContainer);
    
    try {
        const response = await fetch(`${API_URL}/api/reviews`);
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reviews = await response.json();
        console.log('✅ Reviews fetched:', reviews.length, reviews);
        
        // Check if user is admin (simple check - improve for production)
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isAdmin = user.email === 'ahsanherry11@gmail.com'; // Your email as admin
        
        if (reviews.length > 0) {
            testimonialsContainer.innerHTML = reviews.map(review => {
                return `
                <div class="testimonial-card fade-in">
                    <div class="testimonial-header">
                        <div class="testimonial-avatar">
                            ${review.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="testimonial-info">
                            <h4>${review.name}</h4>
                            <p>${review.course}</p>
                        </div>
                        ${isAdmin ? `
                        <button onclick="deleteReview('${review._id}')" 
                                style="background:#ef4444;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;margin-left:auto;">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        ` : ''}
                    </div>
                    <div class="testimonial-rating">
                        ${getStarRating(review.rating)}
                    </div>
                    <p class="testimonial-text">"${review.review}"</p>
                    <div class="testimonial-course">
                        <i class="fas fa-graduation-cap"></i> ${review.course} Graduate
                    </div>
                </div>
            `}).join('');
            
            console.log('✅ Reviews rendered successfully');
        } else {
            console.log('⚠️ No reviews found');
            testimonialsContainer.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1; padding: 2rem;">
                    <i class="fas fa-star" style="color: var(--accent-color); margin-bottom: 1rem; display: block; font-size: 2rem;"></i>
                    Be the first to share your experience!
                </p>
            `;
        }
    } catch (error) {
        console.error('❌ Error loading reviews:', error);
        testimonialsContainer.innerHTML = `
            <p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1; padding: 2rem;">
                <i class="fas fa-exclamation-circle" style="margin-bottom: 1rem; display: block; font-size: 2rem;"></i>
                Unable to load reviews. Please try again later.
            </p>
        `;
    }
}

// ===== DELETE REVIEW FUNCTION =====
async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            notification.success('Deleted!', 'Review has been deleted successfully');
            loadTestimonials(); // Reload reviews
        } else {
            const data = await response.json();
            notification.error('Error', data.message || 'Failed to delete review');
        }
    } catch (error) {
        console.error('Delete error:', error);
        notification.error('Error', 'Failed to delete review');
    }
}

// ===== THEME TOGGLE =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// ===== REVIEW FORM =====
function initReviewForm() {
    if (!reviewForm || !ratingInput) {
        console.log('⚠️ Review form or rating input not found');
        return;
    }
    
    const stars = ratingInput.querySelectorAll('span');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-rating'));
            reviewRating.value = selectedRating;
            stars.forEach((s, index) => {
                if (index < selectedRating) { s.classList.add('active'); s.innerHTML = '★'; }
                else { s.classList.remove('active'); s.innerHTML = '☆'; }
            });
        });
    });

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        const formData = {
            name: document.getElementById('review-name').value,
            email: document.getElementById('review-email').value,
            course: document.getElementById('review-course').value,
            rating: document.getElementById('review-rating').value,
            review: document.getElementById('review-text').value
        };
        
        if (!formData.rating) {
            notification.error('Rating Required', 'Please select a star rating');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            
            if (response.ok) {
                notification.success('Review Submitted!', 'Thank you for sharing your experience.');
                reviewForm.reset();
                selectedRating = 0;
                ratingInput.querySelectorAll('span').forEach(s => { s.classList.remove('active'); s.innerHTML = '☆'; });
                setTimeout(() => loadTestimonials(), 1000);
            } else {
                throw new Error(result.message || 'Failed to submit review');
            }
        } catch (error) {
            notification.error('Submission Failed', error.message || 'Please try again later');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== SCROLL & UI EFFECTS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.pageYOffset > 100);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
}

// ===== LOGIN STATUS =====
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (isLoggedIn && user.name && loginBtn && signupBtn) {
        loginBtn.textContent = `Hi, ${user.name}`;
        loginBtn.href = '#';
        loginBtn.classList.add('username');
        loginBtn.style.cursor = 'default';
        signupBtn.textContent = 'Logout';
        signupBtn.href = '#';
        signupBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            notification.success('Logged Out', 'See you soon!');
            setTimeout(() => window.location.reload(), 1000);
        };
    }
}

// ===== ENROLLMENT FORM HANDLER (UPDATED) =====
function initEnrollmentForm() {
    const enrollmentForm = document.getElementById('enrollment-form');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', (e) => {
            // Show success notification
            notification.success('Enrollment Submitted!', 'We will contact you soon with further details. Redirecting to home...');
            
            // Redirect to home page after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        });
    }
}

// ===== DOM READY - MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded - Initializing...');
    
    // Set DOM elements
    themeToggle = document.getElementById('theme-toggle');
    hamburger = document.querySelector('.hamburger');
    navLinks = document.querySelector('.nav-links');
    courseContainer = document.getElementById('course-container');
    testimonialsContainer = document.getElementById('testimonials-container');
    reviewForm = document.getElementById('review-form');
    ratingInput = document.getElementById('rating-input');
    reviewRating = document.getElementById('review-rating');
    
    console.log('📦 DOM Elements:', {
        themeToggle: !!themeToggle,
        hamburger: !!hamburger,
        courseContainer: !!courseContainer,
        testimonialsContainer: !!testimonialsContainer
    });
    
    // Initialize features
    initTheme();
    renderCourses();
    loadTestimonials();
    initMobileMenu();
    initReviewForm();
    initEnrollmentForm();
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
    checkLoginStatus();
    
    // ===== LOGIN FORM =====
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    notification.success('Success', 'Login successful! Welcome back!');
                    setTimeout(() => { window.location.href = window.location.href.includes('pages/') ? '../index.html' : 'index.html'; }, 1500);
                } else {
                    notification.error('Error', data.msg);
                }
            } catch (err) {
                notification.error('Error', 'Server not responding');
                console.error('Login error:', err);
            }
        });
    }
    
    // ===== SIGNUP FORM =====
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch(`${API_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    notification.success('Success', 'Account created! Please login.');
                    setTimeout(() => { window.location.href = window.location.href.includes('pages/') ? 'login.html' : 'pages/login.html'; }, 1500);
                } else {
                    notification.error('Error', data.msg);
                }
            } catch (err) {
                notification.error('Error', 'Server not responding');
                console.error('Signup error:', err);
            }
        });
    }
    
    // ===== PASSWORD TOGGLE =====
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const password = document.getElementById('password');
            const type = password.type === 'password' ? 'text' : 'password';
            password.type = type;
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // ===== THEME TOGGLE EVENT =====
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
    
    console.log('✅ Web Genius Academy - Initialized Successfully');
});