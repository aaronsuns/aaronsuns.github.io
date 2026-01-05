// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Highlight active navigation item on scroll
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.main-nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.backgroundColor = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }
    });
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Unobserve after it becomes visible to prevent issues
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Handle profile image fallback
const profileImage = document.getElementById('profileImage');
if (profileImage) {
    profileImage.addEventListener('error', function() {
        // If image fails to load, hide it
        this.style.display = 'none';
        // Adjust profile section layout if image is missing
        const profileSection = document.querySelector('.profile-section');
        if (profileSection) {
            const profileText = profileSection.querySelector('.profile-text');
            if (profileText) {
                profileText.style.textAlign = 'center';
            }
        }
    });
}

// Check if element is visible in viewport (any part of it)
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Check if any part of the element is visible
    return (
        rect.top < windowHeight &&
        rect.bottom > 0 &&
        rect.left < windowWidth &&
        rect.right > 0
    );
}

// Observe all experience items, project items, and sections
// This will be called after content is rendered
window.setupAnimations = function() {
    const animatedElements = document.querySelectorAll('.experience-item, .project-item, .skill-category, .education-item, .contact-info');
    
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
        animatedElements.forEach(el => {
            // Always set transition first
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // Check if element is already visible in viewport
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                // If already visible, make it visible immediately and don't observe
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            } else {
                // If not visible, set up for animation and observe
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                observer.observe(el);
            }
        });
    });
};

// Setup animations when DOM is ready (fallback if renderer hasn't run yet)
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for renderer to finish, then setup animations
    setTimeout(() => {
        if (window.setupAnimations) {
            window.setupAnimations();
        }
    }, 200);
});
