// Required modules
const fs = null; // Removed fs require since it's not available in browser

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Typewriter effect
const typewriter = document.getElementById('typewriter');
const phrases = ['Python Developer', 'Data Analyst', 'Problem Solver'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriter.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriter.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 100 : 200);
    }
}

typeEffect();

// Custom cursor
const cursor = document.querySelector('.mouse-cursor');
const cursorDot = document.querySelector('.mouse-cursor-dot');

document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Progress bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.progress-bar');
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Floating navigation dots
const sections = document.querySelectorAll('section');
const navDots = document.querySelectorAll('.nav-dot');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.section === current) {
            dot.classList.add('active');
        }
    });
});

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-sun');
    icon.classList.toggle('fa-moon');
});

// Initialize theme based on system preference
if (prefersDarkScheme.matches) {
    document.body.classList.remove('light-theme');
} else {
    document.body.classList.add('light-theme');
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
        navbar.style.backgroundColor = scrollTop > 50 ? 'rgba(10, 25, 47, 0.95)' : 'rgba(10, 25, 47, 0.85)';
    }
    lastScrollTop = scrollTop;
});

// Tech stack hover effect
document.querySelectorAll('.tech-stack span').forEach(tech => {
    tech.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px) rotate(5deg)';
    });
    
    tech.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// Ripple effect for nav items
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'nav-ripple';
        item.appendChild(ripple);
        
        ripple.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
            opacity: 0;
            top: 0;
            left: 0;
            animation: rippleEffect 0.8s ease-out;
        `;
        
        setTimeout(() => ripple.remove(), 1000);
    });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 0.4;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.querySelector('.form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: contactForm.name.value.trim(),
            email: contactForm.email.value.trim(),
            message: contactForm.message.value.trim()
        };

        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:3000/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            formMessage.textContent = data.message;
            formMessage.className = 'form-message ' + (data.success ? 'success' : 'error');
            
            if (data.success) {
                contactForm.reset();
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        } catch (error) {
            formMessage.textContent = 'An error occurred. Please try again later.';
            formMessage.className = 'form-message error';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Form Submission
const contactForm2 = document.getElementById('contact-form');
if (contactForm2) {
    contactForm2.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm2);
        const submitBtn = contactForm2.querySelector('.submit-btn');
        
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'var(--gradient-2)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'var(--gradient-1)';
                contactForm2.reset();
            }, 2000);
        }
    });
}

// View More Projects Button
const viewMoreBtn = document.querySelector('.view-more-btn');
let projectsVisible = 2;

viewMoreBtn.addEventListener('click', () => {
    const hiddenProjects = document.querySelectorAll('.project-card:nth-child(n + 3)');
    hiddenProjects.forEach(project => {
        project.style.display = 'block';
        project.style.animation = 'fadeInUp 0.5s ease-out forwards';
    });
    viewMoreBtn.style.display = 'none';
});

// Parallax Effect for Hero Section
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    hero.style.backgroundPosition = `${50 + (mouseX * 10)}% ${50 + (mouseY * 10)}%`;
});

// Interactive text effect for section headings
const sectionHeadings = document.querySelectorAll('h2');

sectionHeadings.forEach(heading => {
    heading.addEventListener('mousemove', (e) => {
        const rect = heading.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        // Create gradient effect based on mouse position
        const percentage = (x / rect.width) * 100;
        heading.style.background = `
            linear-gradient(
                90deg, 
                var(--accent-color) ${percentage - 10}%, 
                #fff ${percentage}%, 
                var(--accent-color) ${percentage + 10}%
            )
        `;
        heading.style.webkitBackgroundClip = 'text';
        heading.style.webkitTextFillColor = 'transparent';
        heading.style.transform = 'scale(1.05)';
    });
    
    heading.addEventListener('mouseleave', () => {
        heading.style.background = 'none';
        heading.style.webkitTextFillColor = 'var(--accent-color)';
        heading.style.transform = 'scale(1)';
    });
});

// Magnetic effect for social icons
const socialIcons = document.querySelectorAll('.social-icon');

socialIcons.forEach(icon => {
    icon.addEventListener('mousemove', (e) => {
        const rect = icon.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / 4;
        const deltaY = (y - centerY) / 4;
        
        icon.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.3)`;
        icon.style.color = 'var(--accent-color)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translate(0, 0) scale(1)';
        icon.style.color = 'var(--text-color)';
    });
});

// Optimized Project Cards Hover Effect
const projectCards = document.querySelectorAll('.project-card');
let isHovering = false;

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    card.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
    });
    
    card.addEventListener('mouseleave', () => {
        isHovering = false;
        card.style.transform = 'none';
    });
});

// Optimize Intersection Observer
const observerOptions = {
    threshold: 0.2,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
});

// Skill Level Animation with optimized observer
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillLevel = entry.target.querySelector('.skill-level');
            const skillValue = entry.target.getAttribute('data-skill');
            if (skillLevel && skillValue) {
                skillLevel.style.width = `${skillValue}%`;
                skillObserver.unobserve(entry.target); // Stop observing once animated
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card').forEach(card => {
    skillObserver.observe(card);
});

// Theme Switching
const themeSwitch = document.querySelector('.theme-switch');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to toggle theme
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    
    // Save preference to localStorage
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Initialize theme based on saved preference or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
    } else {
        // If no saved preference, use system preference
        if (!prefersDarkScheme.matches) {
            document.body.classList.add('light-theme');
        }
    }
}

// Event Listeners
themeSwitch.addEventListener('click', toggleTheme);
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (!e.matches) {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }
});

// Initialize theme when page loads
document.addEventListener('DOMContentLoaded', initializeTheme);

// Custom cursor effect
function addCustomCursor() {
    const cursor = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursor.classList.add('cursor-dot');
    cursorOutline.classList.add('cursor-dot-outline');
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorOutline);
    
    let cursorVisible = true;
    let cursorEnlarged = false;
    
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;
    
    let cursorX = endX;
    let cursorY = endY;
    
    let outlineX = endX;
    let outlineY = endY;
    
    document.addEventListener('mousemove', (e) => {
        cursorVisible = true;
        cursor.style.opacity = 1;
        cursorOutline.style.opacity = 1;
        
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        cursor.style.top = cursorY + 'px';
        cursor.style.left = cursorX + 'px';
    });
    
    requestAnimationFrame(function animate() {
        if (cursorVisible) {
            outlineX += (cursorX - outlineX) * 0.2;
            outlineY += (cursorY - outlineY) * 0.2;
            
            cursorOutline.style.top = outlineY + 'px';
            cursorOutline.style.left = outlineX + 'px';
        }
        requestAnimationFrame(animate);
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.75)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = 0;
        cursorOutline.style.opacity = 0;
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = 1;
        cursorOutline.style.opacity = 1;
    });
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .timeline-content, .skill-tag');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.borderColor = 'var(--accent-color)';
        });
        
        el.addEventListener('mouseout', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = 'var(--accent-color)';
        });
    });
}

// Initialize custom cursor
addCustomCursor();

// Progress Bar
const progressBar = document.querySelector('.progress-bar');

function updateProgressBar() {
    const scrolled = window.scrollY;
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxHeight) * 100;
    progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateProgressBar);

// Floating Navigation
const sections = document.querySelectorAll('section');
const navDots = document.querySelectorAll('.nav-dot');

function updateNavDots() {
    const currentPos = window.scrollY;
    
    sections.forEach((section, index) => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        
        if (currentPos >= top && currentPos < bottom) {
            navDots.forEach(dot => dot.classList.remove('active'));
            navDots[index].classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateNavDots);

// Smooth Parallax Effect
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    gsap.to('.floating-shapes', {
        x: moveX,
        y: moveY,
        duration: 1,
        ease: 'power2.out'
    });
});

// Glitch Effect Animation
const glitchText = document.querySelector('.glitch');
let glitchInterval;

function startGlitch() {
    clearInterval(glitchInterval);
    
    const originalText = glitchText.textContent;
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    
    let counter = 0;
    
    glitchInterval = setInterval(() => {
        glitchText.textContent = originalText
            .split('')
            .map((char, index) => {
                if (Math.random() < 0.1) {
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
                return char;
            })
            .join('');
            
        counter++;
        if (counter > 10) {
            clearInterval(glitchInterval);
            glitchText.textContent = originalText;
            setTimeout(startGlitch, Math.random() * 5000 + 3000);
        }
    }, 50);
}

glitchText.addEventListener('mouseenter', startGlitch);

// Interactive Shapes
const shapes = document.querySelectorAll('.shape');

shapes.forEach(shape => {
    shape.addEventListener('mouseenter', () => {
        gsap.to(shape, {
            scale: 1.5,
            opacity: 0.2,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    shape.addEventListener('mouseleave', () => {
        gsap.to(shape, {
            scale: 1,
            opacity: 0.1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animation
gsap.from('.hero-text', {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.hero-image', {
    x: 100,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
});

// Section Animations
sections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Timeline Items Animation
const timelineItems = document.querySelectorAll('.timeline-item');

timelineItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Skill Cards Animation
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Project Cards Animation
const projectCards = document.querySelectorAll('.project-card');

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            projectObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transitionDelay = `${index * 200}ms`;
    projectObserver.observe(card);
});

// Project Stats Counter Animation
const statNumbers = document.querySelectorAll('.stat-number');

const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.innerHTML = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const endValue = parseInt(entry.target.textContent);
            animateValue(entry.target, 0, endValue, 2000);
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

statNumbers.forEach(number => {
    statsObserver.observe(number);
});

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Cursor effect
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const angleX = (y - centerY) / 10;
        const angleY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
        card.style.boxShadow = `${(x - centerX) / 10}px ${(y - centerY) / 10}px 20px rgba(0, 0, 0, 0.3)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
});

// Skill item hover effects
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px)';
        item.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
});

// Section reveal animation
const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-revealed');
            observer.unobserve(entry.target);
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
});

// Profile picture hover effect
const profilePic = document.querySelector('.profile-picture-wrapper');
if (profilePic) {
    profilePic.addEventListener('mousemove', (e) => {
        const rect = profilePic.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 15;
        const angleY = (centerX - x) / 15;
        
        profilePic.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    profilePic.addEventListener('mouseleave', () => {
        profilePic.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// Navigation link hover effect
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
        const rect = link.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.className = 'nav-highlight';
        highlight.style.width = rect.width + 'px';
        highlight.style.height = '2px';
        highlight.style.left = rect.left + 'px';
        highlight.style.top = (rect.bottom - 2) + 'px';
        document.body.appendChild(highlight);
        
        setTimeout(() => highlight.remove(), 1000);
    });
});
